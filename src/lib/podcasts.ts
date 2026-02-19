export interface PodcastLink {
  platform: string;
  url: string;
}

export interface PodcastEpisode {
  title: string;
  episode: string;
  comment: string;
  url?: string;
}

export interface Podcast {
  name: string;
  host?: string;
  description: string;
  links: PodcastLink[];
}

export const podcasts: Podcast[] = [
  {
    name: "无人知晓",
    host: "孟岩",
    description: "关于投资与生活的对话，更新频率、嘉宾、主题——无人知晓",
    links: [
      { platform: "小宇宙", url: "https://www.xiaoyuzhoufm.com/podcast/611719d3cb0b82e1df0ad29e" },
      { platform: "Apple Podcasts", url: "https://podcasts.apple.com/cn/podcast/id1581271335" },
    ],
  },
  {
    name: "知行小酒馆",
    host: "有知有行",
    description: "关注投资理财，更关注怎样更好地生活",
    links: [
      { platform: "小宇宙", url: "https://www.xiaoyuzhoufm.com/podcast/6013f9f58e2f7ee375cf4216" },
    ],
  },
  {
    name: "面基",
    description: "投资、金融与多元话题的深度对谈",
    links: [
      { platform: "小宇宙", url: "https://www.xiaoyuzhoufm.com/podcast/6388760f22567e8ea6ad070f" },
    ],
  },
  {
    name: "商业就是这样",
    description: "用简单易懂的语言解读商业现象",
    links: [
      { platform: "小宇宙", url: "https://www.xiaoyuzhoufm.com/podcast/6022a180ef5fdaddc30bb101" },
    ],
  },
  {
    name: "岩中花述",
    host: "鲁豫",
    description: "聚焦智性女性的精神世界，涵盖文学、哲学、艺术",
    links: [
      { platform: "小宇宙", url: "https://www.xiaoyuzhoufm.com/podcast/625635587bfca4e73e990703" },
    ],
  },
  {
    name: "硅谷101",
    host: "泓君",
    description: "分享最新鲜的技术、知识与思想",
    links: [
      { platform: "小宇宙", url: "https://www.xiaoyuzhoufm.com/podcast/5e5c52c9418a84a04625e6cc" },
      { platform: "Apple Podcasts", url: "https://podcasts.apple.com/cn/podcast/id1498541229" },
    ],
  },
  {
    name: "Web3 101",
    description: "探索区块链技术、商业与人文",
    links: [
      { platform: "小宇宙", url: "https://www.xiaoyuzhoufm.com/podcast/62c2b6b3a61b9fd92a401b39" },
    ],
  },
];

export const favoriteEpisodes: PodcastEpisode[] = [
  {
    title: "孟岩对话韦青：沉默的主角",
    episode: "无人知晓 E42",
    comment: "沉默不是缺席，是另一种在场",
    url: "https://www.xiaoyuzhoufm.com/episode/682ecd8b457b22ce0df770c2",
  },
  {
    title: "够与多",
    episode: "无人知晓 E40",
    comment: "关于金钱与欲望的故事",
    url: "https://www.xiaoyuzhoufm.com/episode/682ecd8b457b22ce0df770c2",
  },
  {
    title: "让万物穿过自己",
    episode: "无人知晓 E10",
    comment: "不执着，不对抗，让一切自然流过",
    url: "https://www.xiaoyuzhoufm.com/episode/61ee26c84675a08411f51570",
  },
];
