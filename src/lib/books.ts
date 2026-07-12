import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ReadingFormat = "纸质" | "电子" | "混合";

export interface Book {
  title: string;
  author: string;
  comment: string;
  /** 出版社 / 出品方 */
  publisher?: string;
  /** 阅读形式 */
  format?: ReadingFormat;
  /** 对应 /blog/[slug] 的读书笔记，没有则不填 */
  noteSlug?: string;
  /** 封面主色调，用于生成书脊颜色 */
  color?: string;
  /** 看完时间，用于排序 */
  miletone_date?: string;
  /** 封面图，相对 /books/ 的文件名（如 lafayette.jpg） */
  cover?: string;
  /** 豆瓣条目 URL，点击封面跳转 */
  douban?: string;
}

const BOOK_DIR =
  "/Users/yiceng/Library/Mobile Documents/iCloud~md~obsidian/Documents/yiceng/output/book";

function toDateString(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function readBooks(): Book[] {
  if (!fs.existsSync(BOOK_DIR)) return [];

  const entries = fs
    .readdirSync(BOOK_DIR, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".md"));

  const books: Book[] = [];
  for (const entry of entries) {
    const full = path.join(BOOK_DIR, entry.name);
    let raw: string;
    try {
      raw = fs.readFileSync(full, "utf-8");
    } catch (err) {
      console.warn(`[books] 跳过读不到的文件: ${entry.name}`, err);
      continue;
    }

    const { data } = matter(raw);
    if (data.is_yiceng_public !== true) continue;

    const title = entry.name.replace(/\.md$/, "").replace(/^《(.*)》$/, "$1");
    books.push({
      title,
      author: typeof data.author === "string" ? data.author : "",
      comment: typeof data.comment === "string" ? data.comment : "",
      publisher: typeof data.publisher === "string" ? data.publisher : undefined,
      format: data.format as ReadingFormat | undefined,
      noteSlug: typeof data.noteSlug === "string" ? data.noteSlug : undefined,
      color: typeof data.color === "string" ? data.color : undefined,
      miletone_date: toDateString(data.miletone_date),
      cover: typeof data.cover === "string" ? data.cover : undefined,
      douban: typeof data.douban === "string" ? data.douban : undefined,
    });
  }

  books.sort((a, b) => {
    const da = a.miletone_date || "";
    const db = b.miletone_date || "";
    if (db !== da) return db > da ? 1 : -1;
    return a.title.localeCompare(b.title, "zh-Hans-CN");
  });

  return books;
}

export const books: Book[] = readBooks();
