# web

个人网站内容目录，供 yiceng-web 项目读取。

## 目录结构

```
web/
├── posts/        # 写作记录（公众号文章、读书笔记等）
├── journeys/     # 去过记录（旅行、里程碑）
├── about.md      # 简历/个人信息
└── README.md
```

## 写作记录 frontmatter 格式

```yaml
---
title: 文章标题
date: 2026-02-15
summary: 一句话摘要
category: 数仓随笔 | 生活记录 | 读书笔记
source: 公众号 | 小红书
pinned: false
tags:
  - 标签1
---
```

## 去过记录 frontmatter 格式

```yaml
---
title: 标题
location: 地点
startDate: 2025-11-01
endDate: 2025-11-07
type: travel | milestone
summary: 一句话摘要
---
```
