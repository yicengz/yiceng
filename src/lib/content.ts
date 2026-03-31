import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { PostMeta, Post } from "./constants";

// ============================================================
// 内容源切换配置
// ============================================================

/** 
 * 内容源模式
 * - local: 使用本地 content/posts 目录
 * - github: 从 GitHub 仓库动态获取
 */
const CONTENT_MODE = (process.env.CONTENT_MODE || "local") as "local" | "github";

// ============================================================
// 本地模式实现（原有逻辑）
// ============================================================

const CONTENT_DIR = path.join(process.cwd(), "content/posts");

/** 文件名 → URL 友好的 slug */
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

/** 构建 slug → 实际文件名 的映射 */
function getSlugToFileMap(): Map<string, string> {
  if (!fs.existsSync(CONTENT_DIR)) return new Map();
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const map = new Map<string, string>();
  for (const f of files) {
    map.set(toSlug(f), f);
  }
  return map;
}

// 本地模式函数
function getAllPostsMetaLocal(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = toSlug(filename);
    const filePath = path.join(CONTENT_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    const stats = readingTime(fileContent);

    return {
      slug,
      title: data.title || filename.replace(/\.md$/, ""),
      date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
      summary: data.summary || "",
      category: data.category || "数仓随笔",
      source: data.source || "",
      tags: data.tags || [],
      readingTime: stats.text,
      pinned: !!data.pinned,
    };
  });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

function getPostBySlugLocal(slug: string): Post | null {
  const map = getSlugToFileMap();
  // URL 解码 slug
  const decodedSlug = decodeURIComponent(slug);
  const filename = map.get(decodedSlug);
  if (!filename) return null;

  const filePath = path.join(CONTENT_DIR, filename);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(fileContent);

  return {
    slug,
    title: data.title || filename.replace(/\.md$/, ""),
    date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
    summary: data.summary || "",
    category: data.category || "数仓随笔",
    source: data.source || "",
    tags: data.tags || [],
    readingTime: stats.text,
    pinned: !!data.pinned,
    content,
  };
}

function getAllPostSlugsLocal(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => toSlug(f));
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
