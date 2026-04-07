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
      { platform: "Spotify", url: "https://open.spotify.com/show/4TY2xLrxqaOEffz4B8eXpi" },
    ],
  },
  {
    name: "知行小酒馆",
    host: "有知有行",
    description: "关注投资理财，更关注怎样更好地生活",
    links: [
      { platform: "小宇宙", url: "https://www.xiaoyuzhoufm.com/podcast/6013f9f58e2f7ee375cf4216" },
      { platform: "Apple Podcasts", url: "https://podcasts.apple.com/us/podcast/%E7%9F%A5%E8%A1%8C%E5%B0%8F%E9%85%92%E9%A6%86/id1559695855" },
      { platform: "Spotify", url: "https://open.spotify.com/show/2XeU495v6CZvBuRcVEbfQI" },
    ],
  },
  {
    name: "面基",
    description: "投资、金融与多元话题的深度对谈",
    links: [
      { platform: "小宇宙", url: "https://www.xiaoyuzhoufm.com/podcast/6388760f22567e8ea6ad070f" },
      { platform: "Apple Podcasts", url: "https://podcasts.apple.com/us/podcast/%E9%9D%A2%E5%9F%BA/id1686741064" },
      { platform: "Spotify", url: "https://open.spotify.com/show/65XM7rQOU05IRxFX0jVjsH" },
    ],
  },
  {
    name: "商业就是这样",
    description: "用简单易懂的语言解读商业现象",
    links: [
      { platform: "小宇宙", url: "https://www.xiaoyuzhoufm.com/podcast/6022a180ef5fdaddc30bb101" },
      { platform: "Apple Podcasts", url: "https://podcasts.apple.com/us/podcast/%E5%95%86%E4%B8%9A%E5%B0%B1%E6%98%AF%E8%BF%99%E6%A0%B7/id1552904790" },
      { platform: "Spotify", url: "https://open.spotify.com/show/1ruvRyx4vehFsx8OAfFkTv" },
    ],
  },
  {
    name: "岩中花述",
    host: "鲁豫",
    description: "聚焦智性女性的精神世界，涵盖文学、哲学、艺术",
    links: [
      { platform: "小宇宙", url: "https://www.xiaoyuzhoufm.com/podcast/625635587bfca4e73e990703" },
      { platform: "Apple Podcasts", url: "https://podcasts.apple.com/us/podcast/%E5%B2%A9%E4%B8%AD%E8%8A%B1%E8%BF%B0/id1582119137" },
      { platform: "Spotify", url: "https://open.spotify.com/show/6JukZBKKuvslkEUmfmlZTh" },
    ],
  },
  {
    name: "硅谷101",
    host: "泓君",
    description: "分享最新鲜的技术、知识与思想",
    links: [
      { platform: "小宇宙", url: "https://www.xiaoyuzhoufm.com/podcast/5e5c52c9418a84a04625e6cc" },
      { platform: "Apple Podcasts", url: "https://podcasts.apple.com/us/podcast/%E7%A1%85%E8%B0%B7101/id1498541229" },
      { platform: "Spotify", url: "https://open.spotify.com/show/0wngyWmgWZB8aXMg9DooJ5" },
    ],
  },
  {
    name: "Web3 101",
    description: "探索区块链技术、商业与人文",
    links: [
      { platform: "小宇宙", url: "https://www.xiaoyuzhoufm.com/podcast/62c2b6b3a61b9fd92a401b39" },
      { platform: "Apple Podcasts", url: "https://podcasts.apple.com/us/podcast/web3-101/id1633015931" },
      { platform: "Spotify", url: "https://open.spotify.com/show/5gCzq2p2AtPlok8wiLcJY6" },
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
