---
title: 你好，世界
date: 2026-02-15
summary: 这是我的第一篇文章，记录建站的心路历程。
category: 生活记录
source: 公众号
tags:
  - 随笔
  - 建站
---

## 开始

终于搭好了自己的小站。

作为一个数据仓库工程师，日常和数据管道、SQL 打交道，搭一个属于自己的网站，算是给生活找点不一样的节奏。

## 为什么要写博客

写博客的初衷很简单：

- **沉淀思考**：写下来的东西，才真正属于自己
- **分享交流**：也许某个踩坑经验，刚好能帮到别人
- **记录生活**：不只是技术，也想记录一些温暖的瞬间

## 技术栈

这个网站使用了以下技术：

- **Next.js** - React 框架，支持静态生成
- **TypeScript** - 类型安全
- **Ant Design** - UI 组件库
- **MDX** - Markdown 与 React 的结合

```sql
-- 作为数据工程师，来一段 SQL 助助兴
SELECT
    moment,
    feeling,
    COUNT(*) AS memories
FROM life_journal
WHERE year = 2026
GROUP BY moment, feeling
ORDER BY memories DESC;
```

## 未来计划

接下来想慢慢完善：

1. 接入 Obsidian 笔记同步
2. 添加标签筛选功能
3. 加入暗色模式
4. 优化移动端体验

期待在这里留下更多文字。
