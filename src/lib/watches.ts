export interface Channel {
  name: string;
  platform: string;
  url: string;
  description: string;
}

export interface FavoriteVideo {
  title: string;
  channel: string;
  comment: string;
  url?: string;
}

export const channels: Channel[] = [
  {
    name: "食贫道",
    platform: "Bilibili",
    url: "https://space.bilibili.com/39627524",
    description: "前战地记者的美食纪实，每一口都是故事",
  },
  {
    name: "HackBear 泰瑞",
    platform: "YouTube",
    url: "https://www.youtube.com/@hackbearterry",
    description: "硅谷科技人的生活与思考",
  },
];

export const favoriteVideos: FavoriteVideo[] = [
  {
    title: "带着100万...我们去了论文代写聚集地",
    channel: "影视飓风",
    comment: "不只是揭露产业链，更是不同国家面临的困境与人文矛盾的缩影",
    url: "https://space.bilibili.com/946974",
  },
];
