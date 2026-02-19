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
}

/**
 * 书架数据，手动维护。
 * 顺序即展示顺序——最近读的放前面。
 */
export const books: Book[] = [
  {
    title: "拉法耶特",
    author: "冯翔",
    comment: "两个世界的英雄，革命年代里理想主义者的一生",
    publisher: "读库",
    color: "#7A5C47",
  },
  {
    title: "投资第一课",
    author: "孟岩",
    comment: "投资的本质是认知变现",
    publisher: "读库",
    color: "#4A7A6B",
  },
  {
    title: "小岛经济学",
    author: "彼得·希夫 / 安德鲁·希夫",
    comment: "用一座小岛讲透经济学的底层逻辑",
    publisher: "中信出版社",
    color: "#5B8CAF",
  },
  {
    title: "人生解忧：佛学入门四十讲",
    author: "成庆",
    comment: "不是鸡汤，是认真地面对苦与无常",
    publisher: "理想国",
    color: "#8A7560",
  },
  {
    title: "刘擎西方现代思想讲义",
    author: "刘擎",
    comment: "19 位思想家，19 种理解世界的方式",
    publisher: "新星出版社",
    color: "#6A5A8B",
  },
  {
    title: "奔袭",
    author: "冯翔",
    comment: "恩德培行动，一场不可能完成的营救",
    publisher: "读库",
    color: "#8B5A5A",
  },
  {
    title: "世上为什么要有图书馆",
    author: "杨素秋",
    comment: "从零建起一座图书馆，也是重建一种公共生活",
    publisher: "上海译文出版社",
    color: "#5A7A7A",
  },
  {
    title: "置身事内",
    author: "兰小欢",
    comment: "从政府与经济的关系出发，理解中国经济的运行方式",
    publisher: "上海人民出版社",
    noteSlug: "reading-erta",
    color: "#8B6F5A",
  },
  {
    title: "金字塔原理",
    author: "芭芭拉·明托",
    comment: "思考和表达的底层结构",
    publisher: "南海出版公司",
    color: "#5A6E8B",
  },
  {
    title: "禅与摩托车维修艺术",
    author: "罗伯特·M·波西格",
    comment: "良质是什么？在理性与感性之间寻找答案",
    publisher: "重庆出版社",
    color: "#6B7F5A",
  },
];
