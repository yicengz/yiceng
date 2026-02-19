import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { PostMeta, Post } from "./constants";

const CONTENT_DIR = path.join(process.cwd(), "content/posts");

export type { PostCategory, PostMeta, Post } from "./constants";
export { POST_CATEGORIES } from "./constants";

/** 文件名 → URL 友好的 slug（空格转连字符，统一小写） */
function toSlug(filename: string): string {
  return filename
    .replace(/\.md$/, "")
    .replace(/\s+/g, "-")
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

/**
 * 获取所有文章的元信息，按日期倒序排列
 */
export function getAllPostsMeta(): PostMeta[] {
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

/**
 * 根据 slug 获取单篇文章（含正文）
 */
export function getPostBySlug(slug: string): Post | null {
  const map = getSlugToFileMap();
  const filename = map.get(slug);
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

/**
 * 获取所有文章的 slug（用于 generateStaticParams）
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => toSlug(f));
}
