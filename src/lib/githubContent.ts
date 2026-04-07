import { cache } from "react";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { PostMeta, Post } from "./constants";

// GitHub 配置
const GITHUB_CONFIG = {
  owner: "yicengz",
  repo: "obsidian-vault-backup",
  branch: "main",
  token: process.env.GITHUB_TOKEN,
};

// 内容源配置
export interface ContentSource {
  path: string;
  category: string;
  filter?: {
    tags?: string[];
    publish?: boolean | string;
    custom?: (frontmatter: Record<string, any>) => boolean;
  };
  sortBy?: "date" | "updated" | "title";
  limit?: number;
}

// 默认内容源配置
export const DEFAULT_CONTENT_SOURCES: ContentSource[] = [
  {
    path: "content",
    category: "数仓随笔",
    sortBy: "date",
    limit: 50,
    filter: { publish: true },
  },
  {
    path: "yiceng",
    category: "生活记录",
    sortBy: "date",
    filter: { publish: true },
  },
];

// GitHub API 请求头
function getHeaders() {
  const token = GITHUB_CONFIG.token;
  if (!token) throw new Error("GITHUB_TOKEN 未设置");
  return {
    "Accept": "application/vnd.github.v3+json",
    "Authorization": `Bearer ${token}`,
  };
}

// ============================================================
// 缓存：posts 列表 + 原始内容（避免打开文章时重复拉取）
// ============================================================

declare global {
  // eslint-disable-next-line no-var
  var __postsCache: PostMeta[] | null;
  // eslint-disable-next-line no-var
  var __postsCacheTimestamp: number;
  // eslint-disable-next-line no-var
  var __postsCacheFetching: Promise<PostMeta[]> | null;
  // eslint-disable-next-line no-var
  var __rawContentCache: Map<string, string>;
  // eslint-disable-next-line no-var
  var __attachmentMap: Map<string, string>; // filename → full path
}

globalThis.__postsCache ??= null;
globalThis.__postsCacheTimestamp ??= 0;
globalThis.__postsCacheFetching ??= null;
globalThis.__rawContentCache ??= new Map();
globalThis.__attachmentMap ??= new Map();

// 开发模式 10 分钟，生产模式 30 分钟
const CACHE_TTL = process.env.NODE_ENV === "development"
  ? 10 * 60 * 1000
  : 30 * 60 * 1000;

// ============================================================
// 用 Git Trees API 一次拿到所有文件路径（替代递归目录遍历）
// ============================================================

async function fetchRepoTree(): Promise<Array<{ path: string; type: string }>> {
  const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/git/trees/${GITHUB_CONFIG.branch}?recursive=1`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error(`Git Trees API: HTTP ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data.tree ?? [];
}

function filterMarkdownFiles(
  tree: Array<{ path: string; type: string }>,
  basePath: string
): Array<{ path: string; name: string }> {
  return tree
    .filter(
      (item) =>
        item.type === "blob" &&
        item.path.startsWith(basePath + "/") &&
        item.path.endsWith(".md")
    )
    .map((item) => ({
      path: item.path,
      name: item.path.split("/").pop()!,
    }));
}

// ============================================================
// 获取文件原始内容（优先走内存缓存）
// ============================================================

async function fetchRawContent(filePath: string, retries = 3): Promise<string | null> {
  if (globalThis.__rawContentCache.has(filePath)) {
    return globalThis.__rawContentCache.get(filePath)!;
  }

  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  const url = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${encodedPath}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) return null;
      const text = await res.text();
      globalThis.__rawContentCache.set(filePath, text);
      return text;
    } catch (error) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 500 * attempt)); // 递增等待
      } else {
        console.error(`Failed to fetch ${filePath}:`, error);
      }
    }
  }
  return null;
}

// ============================================================
// 把 Obsidian ![[image.jpg]] 转成标准 Markdown ![](raw url)
// 利用 repo tree 里的完整路径，支持子目录（如 attachments/unsplash/）
// ============================================================

function resolveObsidianImages(content: string): string {
  return content.replace(/!\[\[([^\]]+\.(jpg|jpeg|png|gif|webp|svg|avif))\]\]/gi, (_, filename) => {
    const fullPath = globalThis.__attachmentMap.get(filename) ?? `attachments/unsplash/${filename}`;
    return `![${filename}](/api/gh-image?path=${encodeURIComponent(fullPath)})`;
  });
}

// ============================================================
// 筛选条件
// ============================================================

function matchesFilter(
  frontmatter: Record<string, any>,
  filter?: ContentSource["filter"]
): boolean {
  if (!filter) return true;

  if (filter.publish !== undefined) {
    const publishValue = frontmatter.is_yiceng_public ?? frontmatter.publish;
    if (filter.publish === true) {
      if (publishValue === undefined) return false;
      const actual =
        publishValue === true ||
        publishValue === "true" ||
        publishValue === "yes" ||
        publishValue === "发布" ||
        publishValue === "published";
      if (!actual) return false;
    }
  }

  if (filter.tags && filter.tags.length > 0) {
    const articleTags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags
      : frontmatter.tags ? [frontmatter.tags] : [];
    if (!filter.tags.some((tag) => articleTags.includes(tag))) return false;
  }

  if (filter.custom && !filter.custom(frontmatter)) return false;

  return true;
}

// ============================================================
// 文件名 → slug
// ============================================================

function toSlug(filename: string): string {
  return filename
    .replace(/\.md$/, "")
    .replace(/[，,]/g, "-")
    .replace(/[。.]/g, "")
    .replace(/[？?]/g, "")
    .replace(/[！!]/g, "")
    .replace(/[""''']/g, "")
    .replace(/[:：]/g, "-")
    .replace(/[（(）)]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

// ============================================================
// 从单个源获取文章（并行拉取所有内容）
// ============================================================

async function getPostsFromSource(
  source: ContentSource,
  tree: Array<{ path: string; type: string }>
): Promise<PostMeta[]> {
  const files = filterMarkdownFiles(tree, source.path);

  // 限流并行拉取（最多 5 个并发，避免 ECONNRESET）
  const CONCURRENCY = 5;
  const results: Array<{ file: typeof files[0]; content: string | null }> = [];
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (file) => ({ file, content: await fetchRawContent(file.path) }))
    );
    results.push(...batchResults);
  }

  const posts: PostMeta[] = [];

  for (const { file, content } of results) {
    if (!content) continue;
    const { data: frontmatter } = matter(content);
    if (!matchesFilter(frontmatter, source.filter)) continue;

    const stats = readingTime(content);
    const slug = toSlug(file.name);

    (posts as any).push({
      slug,
      title: frontmatter.title || file.name.replace(/\.md$/, ""),
      date: (frontmatter.date ?? frontmatter.published)
        ? new Date(frontmatter.date ?? frontmatter.published).toISOString().split("T")[0]
        : "",
      summary: frontmatter.summary || "",
      category: frontmatter.category || source.category,
      source: frontmatter.source || "",
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      readingTime: stats.text,
      pinned: !!frontmatter.pinned,
      _sourcePath: file.path,
    });
  }

  if (source.sortBy === "date") {
    posts.sort((a, b) => (a.date > b.date ? -1 : 1));
  }

  return source.limit ? posts.slice(0, source.limit) : posts;
}

// ============================================================
// 获取所有文章（带缓存）
// ============================================================

async function fetchAllPostsMeta(): Promise<PostMeta[]> {
  if (
    globalThis.__postsCache &&
    Date.now() - globalThis.__postsCacheTimestamp < CACHE_TTL
  ) {
    return globalThis.__postsCache;
  }

  if (globalThis.__postsCacheFetching) {
    return globalThis.__postsCacheFetching;
  }

  const fetchPromise = (async () => {
    // 缓存过期时清空内容缓存，确保拉取最新内容
    globalThis.__rawContentCache.clear();
    globalThis.__attachmentMap.clear();

    // 一次 API 调用拿到整个仓库文件树
    const tree = await fetchRepoTree();

    // 建立 filename → full path 查找表（用于 Obsidian 图片路径解析）
    for (const item of tree) {
      if (item.type === "blob" && item.path.startsWith("attachments/")) {
        const filename = item.path.split("/").pop()!;
        globalThis.__attachmentMap.set(filename, item.path);
      }
    }

    const allPosts: PostMeta[] = [];

    for (const source of DEFAULT_CONTENT_SOURCES) {
      try {
        const posts = await getPostsFromSource(source, tree);
        allPosts.push(...posts);
      } catch (error) {
        console.error(`Failed to fetch from source ${source.path}:`, error);
      }
    }

    allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));

    if (allPosts.length > 0) {
      globalThis.__postsCache = allPosts;
      globalThis.__postsCacheTimestamp = Date.now();
    }
    globalThis.__postsCacheFetching = null;

    return allPosts;
  })();

  globalThis.__postsCacheFetching = fetchPromise;
  return fetchPromise;
}

export const getAllPostsMeta = cache(fetchAllPostsMeta);

// ============================================================
// 根据 slug 获取单篇文章（内容直接走缓存，不重复拉取）
// ============================================================

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const allPosts = await getAllPostsMeta();
  const decodedSlug = decodeURIComponent(slug);
  const postMeta = (allPosts as any[]).find((p) => p.slug === decodedSlug);

  if (!postMeta?._sourcePath) return null;

  // 列表阶段已经拉过内容并写入缓存，这里直接读缓存
  const content = await fetchRawContent(postMeta._sourcePath);
  if (!content) return null;

  const { data: frontmatter, content: rawBody } = matter(content);
  const body = resolveObsidianImages(rawBody);
  const stats = readingTime(content);

  return {
    slug,
    title: frontmatter.title || postMeta.title,
    date: postMeta.date,
    summary: postMeta.summary,
    category: postMeta.category,
    source: postMeta.source,
    tags: postMeta.tags,
    readingTime: stats.text,
    pinned: postMeta.pinned,
    content: body,
  };
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getAllPostsMeta();
  return posts.map((p) => p.slug);
}

// 兼容导出
export type { PostCategory, PostMeta, Post } from "./constants";
export { POST_CATEGORIES } from "./constants";

// 开发模式预加载
if (process.env.NODE_ENV === "development" && process.env.CONTENT_MODE === "github") {
  console.log("[githubContent] 预加载 GitHub 内容...");
  fetchAllPostsMeta()
    .then((posts) => console.log(`[githubContent] 预加载完成: ${posts.length} 篇文章`))
    .catch((err) => console.error("[githubContent] 预加载失败:", err.message));
}
