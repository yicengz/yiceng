import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { PostMeta, Post } from "./constants";

const CONTENT_DIR = path.join(process.cwd(), "content/posts");

export type { PostCategory, PostMeta, Post } from "./constants";
export { POST_CATEGORIES } from "./constants";

/**
 * 获取所有文章的元信息，按日期倒序排列
 */
export function getAllPostsMeta(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(CONTENT_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    const stats = readingTime(fileContent);

    return {
      slug,
      title: data.title || slug,
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
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(fileContent);

  return {
    slug,
    title: data.title || slug,
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
    .map((f) => f.replace(/\.md$/, ""));
}
