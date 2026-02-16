export type PostCategory = "数仓随笔" | "生活记录" | "读书笔记";

export const POST_CATEGORIES: PostCategory[] = [
  "数仓随笔",
  "生活记录",
  "读书笔记",
];

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: PostCategory;
  source: string;
  tags: string[];
  readingTime: string;
  pinned: boolean;
}

export interface Post extends PostMeta {
  content: string;
}
