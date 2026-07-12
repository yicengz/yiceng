import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { PostMeta, Post } from "./constants";
import {
  DEFAULT_CONTENT_SOURCES,
  matchesFilter,
  toSlug,
  type ContentSource,
} from "./githubContent";

// ============================================================
// 内容源切换配置
// ============================================================

/**
 * 内容源模式
 * - local: 读取本地 iCloud Obsidian 仓库
 * - github: 从 GitHub 仓库动态获取
 */
const CONTENT_MODE = (process.env.CONTENT_MODE || "local") as "local" | "github";

// ============================================================
// 本地模式：从 iCloud Obsidian 仓库读取
// ============================================================

const LOCAL_VAULT_ROOT =
  "/Users/yiceng/Library/Mobile Documents/iCloud~md~obsidian/Documents/yiceng";

// 附件 filename → 仓库相对路径，用于解析 ![[image.jpg]]
let localAttachmentMap: Map<string, string> | null = null;

function buildLocalAttachmentMap(): Map<string, string> {
  const map = new Map<string, string>();
  const root = path.join(LOCAL_VAULT_ROOT, "attachments");
  if (!fs.existsSync(root)) return map;

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        map.set(entry.name, path.relative(LOCAL_VAULT_ROOT, full));
      }
    }
  };
  walk(root);
  return map;
}

function getLocalAttachmentMap(): Map<string, string> {
  // 开发模式每次重建，反映最新内容
  if (!localAttachmentMap || process.env.NODE_ENV === "development") {
    localAttachmentMap = buildLocalAttachmentMap();
  }
  return localAttachmentMap;
}

function resolveObsidianImagesLocal(content: string): string {
  const map = getLocalAttachmentMap();
  return content.replace(
    /!\[\[([^\]]+\.(jpg|jpeg|png|gif|webp|svg|avif|heic))\]\]/gi,
    (_, filename) => {
      const rel = map.get(filename) ?? `attachments/unsplash/${filename}`;
      return `![${filename}](/api/local-image?path=${encodeURIComponent(rel)})`;
    }
  );
}

function readMarkdownFilesUnder(
  basePath: string
): Array<{ path: string; name: string }> {
  const root = path.join(LOCAL_VAULT_ROOT, basePath);
  if (!fs.existsSync(root)) return [];

  const out: Array<{ path: string; name: string }> = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        out.push({
          path: path.relative(LOCAL_VAULT_ROOT, full),
          name: entry.name,
        });
      }
    }
  };
  walk(root);
  return out;
}

interface LocalPostMeta extends PostMeta {
  _sourcePath?: string;
}

function getPostsFromSourceLocal(source: ContentSource): LocalPostMeta[] {
  const files = readMarkdownFilesUnder(source.path);
  const posts: LocalPostMeta[] = [];

  for (const file of files) {
    const full = path.join(LOCAL_VAULT_ROOT, file.path);
    let raw: string;
    try {
      raw = fs.readFileSync(full, "utf-8");
    } catch (err) {
      console.warn(`[local content] 跳过读不到的文件: ${file.path}`, err);
      continue;
    }

    const { data: frontmatter } = matter(raw);
    if (!matchesFilter(frontmatter, source.filter)) continue;

    const stats = readingTime(raw);
    const slug = toSlug(file.name);
    const dateValue =
      frontmatter.publish_date ?? frontmatter.date ?? frontmatter.published;

    let date = "";
    if (dateValue) {
      date = new Date(dateValue).toISOString().split("T")[0];
    } else {
      try {
        const st = fs.statSync(full);
        const t =
          st.birthtime && st.birthtime.getTime() > 0 ? st.birthtime : st.mtime;
        date = t.toISOString().split("T")[0];
      } catch {
        // 读不到就留空，落到列表尾部
      }
    }

    posts.push({
      slug,
      title: frontmatter.title || file.name.replace(/\.md$/, ""),
      date,
      summary: frontmatter.summary || "",
      category: frontmatter.category || source.category,
      source: frontmatter.source || "",
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      readingTime: stats.text,
      pinned: !!frontmatter.pinned,
      link: typeof frontmatter.link === "string" ? frontmatter.link : "",
      _sourcePath: file.path,
    });
  }

  if (source.sortBy === "date") {
    posts.sort((a, b) => (a.date > b.date ? -1 : 1));
  }

  return source.limit ? posts.slice(0, source.limit) : posts;
}

function getAllPostsMetaLocal(): PostMeta[] {
  const all: LocalPostMeta[] = [];
  for (const source of DEFAULT_CONTENT_SOURCES) {
    try {
      all.push(...getPostsFromSourceLocal(source));
    } catch (err) {
      console.error(`[local content] 读取源 ${source.path} 失败:`, err);
    }
  }
  all.sort((a, b) => (a.date > b.date ? -1 : 1));
  return all;
}

function getPostBySlugLocal(slug: string): Post | null {
  const all = getAllPostsMetaLocal() as LocalPostMeta[];
  const decoded = decodeURIComponent(slug);
  const meta = all.find((p) => p.slug === decoded);
  if (!meta?._sourcePath) return null;

  const full = path.join(LOCAL_VAULT_ROOT, meta._sourcePath);
  let raw: string;
  try {
    raw = fs.readFileSync(full, "utf-8");
  } catch {
    return null;
  }

  const { data: frontmatter, content } = matter(raw);
  const body = resolveObsidianImagesLocal(content);
  const stats = readingTime(raw);

  return {
    slug,
    title: frontmatter.title || meta.title,
    date: meta.date,
    summary: meta.summary,
    category: meta.category,
    source: meta.source,
    tags: meta.tags,
    readingTime: stats.text,
    pinned: meta.pinned,
    link: meta.link,
    content: body,
  };
}

function getAllPostSlugsLocal(): string[] {
  return getAllPostsMetaLocal().map((p) => p.slug);
}

// ============================================================
// 远程模式实现（GitHub）
// ============================================================

import {
  getAllPostsMeta as getAllPostsMetaRemote,
  getPostBySlug as getPostBySlugRemote,
  getAllPostSlugs as getAllPostSlugsRemote,
} from "./githubContent";

// ============================================================
// 统一 API（根据模式自动选择）
// ============================================================

export type { PostCategory, PostMeta, Post } from "./constants";
export { POST_CATEGORIES } from "./constants";

/**
 * 获取所有文章的元信息
 *
 * 本地模式：同步返回
 * 远程模式：异步返回（返回 Promise）
 */
export function getAllPostsMeta(): PostMeta[] | Promise<PostMeta[]> {
  if (CONTENT_MODE === "github") {
    return getAllPostsMetaRemote();
  }
  return getAllPostsMetaLocal();
}

/**
 * 根据 slug 获取单篇文章
 *
 * 本地模式：同步返回
 * 远程模式：异步返回（返回 Promise）
 */
export function getPostBySlug(slug: string): Post | null | Promise<Post | null> {
  if (CONTENT_MODE === "github") {
    return getPostBySlugRemote(slug);
  }
  return getPostBySlugLocal(slug);
}

/**
 * 获取所有文章的 slug
 *
 * 本地模式：同步返回
 * 远程模式：异步返回（返回 Promise）
 */
export function getAllPostSlugs(): string[] | Promise<string[]> {
  if (CONTENT_MODE === "github") {
    return getAllPostSlugsRemote();
  }
  return getAllPostSlugsLocal();
}
