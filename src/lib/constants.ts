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
  href?: string;
}

export interface Post extends PostMeta {
  content: string;
}

// Journey types
export type JourneyType = "travel" | "milestone";

export interface JourneyMeta {
  slug: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  type: JourneyType;
  summary: string;
  coverImage: string;
}

export interface Journey extends JourneyMeta {
  content: string;
}
