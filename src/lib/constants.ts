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
  /** 第一项约定为主分类（数仓随笔/生活记录/读书笔记），其余为自由二级标签 */
  category: string[];
  source: string;
  tags: string[];
  readingTime: string;
  pinned: boolean;
  href?: string;
  link?: string;
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

// Routine (起居) types
export type RoutineType =
  | "movie"
  | "tv"
  | "book"
  | "podcast"
  | "place"
  | "writing"
  | "other";

export interface RoutineMeta {
  slug: string;
  title: string;
  date: string;
  type: RoutineType;
  summary: string;
  link: string;
  hasContent: boolean;
}

export interface Routine extends RoutineMeta {
  content: string;
}

export const ROUTINE_TYPE_LABEL: Record<RoutineType, string> = {
  movie: "电影",
  tv: "剧集",
  book: "书",
  podcast: "播客",
  place: "去过",
  writing: "写作",
  other: "其他",
};
