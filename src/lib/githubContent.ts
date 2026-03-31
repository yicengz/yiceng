import { cache } from "react";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { PostMeta, Post } from "./constants";

// GitHub 配置
const GITHUB_CONFIG = {
  owner: "yicengz",
  repo: "obsidian-vault-backup",
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
// 只展示 frontmatter 中 publish=true 的文章
export const DEFAULT_CONTENT_SOURCES: ContentSource[] = [
  {
    path: "content",
    category: "数仓随笔",
    sortBy: "date",
    limit: 50,
    filter: {
      publish: true,
    },
  },
  {
    path: "yiceng",
    category: "生活记录",
    sortBy: "date",
    filter: {
      publish: true,
    },
  },
];

// GitHub API 请求头
function getHeaders() {
  const token = GITHUB_CONFIG.token;
  if (!token) {
    throw new Error("GITHUB_TOKEN 未设置");
  }
  return {
    "Accept": "application/vnd.github.v3+json",
    "Authorization": `Bearer ${token}`,
  };
}

// 递归获取所有 .md 文件
async function fetchAllMarkdownFiles(
  basePath: string
): Promise<Array<{ path: string; name: string }>> {
  const files: Array<{ path: string; name: string }> = [];

  async function traverse(currentPath: string) {
    try {
      const encodedPath = currentPath.split("/").map(encodeURIComponent).join("/");
      const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${encodedPath}`;
      
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (!Array.isArray(data)) {
        return;
      }

      for (const item of data) {
        if (item.type === "file" && item.name.endsWith(".md")) {
          files.push({
            path: item.path,
            name: item.name,
          });
        } else if (item.type === "dir") {
          await traverse(item.path);
        }
      }
    } catch (error: any) {
      console.error(`Failed to traverse ${currentPath}:`, error.message);
    }
  }

  await traverse(basePath);
  return files;
}

// 获取文件原始内容
async function fetchRawContent(path: string): Promise<string | null> {
  try {
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    
    // 先尝试 main 分支
    try {
      const url = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/main/${encodedPath}`;
      const res = await fetch(url, { 
        headers: getHeaders(),
      });
      if (res.ok) return await res.text();
    } catch (e) {
      // 忽略错误，尝试下一个分支
    }
    
    // 再尝试 master 分支
    try {
      const url = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/master/${encodedPath}`;
      const res = await fetch(url, { 
        headers: getHeaders(),
      });
      if (res.ok) return await res.text();
    } catch (e) {
      // 忽略错误
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error);
    return null;
  }
}

// 检查筛选条件
function matchesFilter(
  frontmatter: Record<string, any>,
  filter?: ContentSource["filter"]
): boolean {
  if (!filter) return true;

  if (filter.publish !== undefined) {
    const publishValue = frontmatter.publish;
    const expectedValue = filter.publish;
    
    if (typeof expectedValue === "boolean") {
      if (expectedValue === true) {
        if (publishValue === undefined) return false;
        const actualValue = 
          publishValue === true || 
          publishValue === "true" || 
          publishValue === "yes" ||
          publishValue === "发布" ||
          publishValue === "published";
        if (actualValue !== true) return false;
      }
    }
  }

  if (filter.tags && filter.tags.length > 0) {
    const articleTags = Array.isArray(frontmatter.tags) 
      ? frontmatter.tags 
      : frontmatter.tags ? [frontmatter.tags] : [];
    
    const hasMatchingTag = filter.tags.some((tag) =>
      articleTags.includes(tag)
    );
    if (!hasMatchingTag) return false;
  }

  if (filter.custom && !filter.custom(frontmatter)) {
    return false;
  }

  return true;
}

// 文件名 → slug
function toSlug(filename: string): string {
  return filename
    .replace(/\.md$/, "")
    .replace(/[，,]/g, "-")  // 中文逗号、英文逗号
    .replace(/[。.]/g, "")    // 中文句号、英文句号
    .replace(/[？?]/g, "")    // 问号
    .replace(/[！!]/g, "")    // 感叹号
    .replace(/[""''']/g, "") // 引号
    .replace(/[:：]/g, "-")   // 冒号
    .replace(/[（(）)]/g, "") // 括号
    .replace(/\s+/g, "-")     // 空格
    .replace(/-+/g, "-")      // 多个连字符合并
    .replace(/^-|-$/g, "")    // 去除首尾连字符
    .toLowerCase();
}

// 从单个源获取文章
async function getPostsFromSource(
  source: ContentSource
): Promise<PostMeta[]> {
  const files = await fetchAllMarkdownFiles(source.path);
  const posts: PostMeta[] = [];

  for (const file of files) {
    const content = await fetchRawContent(file.path);
    if (!content) continue;

    const { data: frontmatter } = matter(content);

    if (!matchesFilter(frontmatter, source.filter)) {
      continue;
    }

    const stats = readingTime(content);
    const slug = toSlug(file.name);

    (posts as any).push({
      slug,
      title: frontmatter.title || file.name.replace(/\.md$/, ""),
      date: frontmatter.date 
        ? new Date(frontmatter.date).toISOString().split("T")[0] 
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

  if (source.limit) {
    return posts.slice(0, source.limit);
  }

  return posts;
}

// 缓存
let postsCache: PostMeta[] | null = null;
let cacheTimestamp: number = 0;
// 开发模式下缓存1分钟，方便调试时快速看到更新
const CACHE_TTL = process.env.NODE_ENV === "development" 
  ? 1 * 60 * 1000   // 开发模式: 1分钟
  : 5 * 60 * 1000;  // 生产模式: 5分钟

/**
 * 获取所有文章（带缓存）
 */
async function fetchAllPostsMeta(): Promise<PostMeta[]> {
  if (postsCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return postsCache;
  }

  const allPosts: PostMeta[] = [];

  for (const source of DEFAULT_CONTENT_SOURCES) {
    try {
      const posts = await getPostsFromSource(source);
      allPosts.push(...posts);
    } catch (error) {
      console.error(`Failed to fetch from source ${source.path}:`, error);
    }
  }

  allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));

  postsCache = allPosts;
  cacheTimestamp = Date.now();

  return allPosts;
}

// 使用 React cache 确保同一请求共享数据
export const getAllPostsMeta = cache(fetchAllPostsMeta);

/**
 * 根据 slug 获取单篇文章
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const allPosts = await getAllPostsMeta();
  
  // URL 解码 slug
  const decodedSlug = decodeURIComponent(slug);
  
  const postMeta = (allPosts as any[]).find(
    (p) => p.slug === decodedSlug
  );

  if (!postMeta?._sourcePath) {
    return null;
  }

  const content = await fetchRawContent(postMeta._sourcePath);
  if (!content) {
    return null;
  }

  const { data: frontmatter, content: body } = matter(content);
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

/**
 * 获取所有 slug
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getAllPostsMeta();
  return posts.map((p) => p.slug);
}

// 兼容导出
export type { PostCategory, PostMeta, Post } from "./constants";
export { POST_CATEGORIES } from "./constants";

// 开发模式下启动时预加载数据，避免首次访问缓慢
if (process.env.NODE_ENV === "development" && process.env.CONTENT_MODE === "github") {
  console.log("[githubContent] 预加载 GitHub 内容...");
  fetchAllPostsMeta()
    .then((posts) => {
      console.log(`[githubContent] 预加载完成: ${posts.length} 篇文章`);
    })
    .catch((err) => {
      console.error("[githubContent] 预加载失败:", err.message);
    });
}
