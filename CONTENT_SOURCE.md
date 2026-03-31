# 内容源配置说明

本网站支持两种内容源模式：

## 模式一：本地模式（默认）

从 `content/posts/` 和 `content/journeys/` 目录读取文章。

```bash
# 直接使用（默认就是本地模式）
pnpm build
pnpm dev
```

## 模式二：远程模式（GitHub）

从 GitHub 仓库动态获取文章，构建时自动拉取。

### 配置步骤

1. **设置环境变量**

```bash
# 添加到你的 .zshrc 或 .bashrc
export CONTENT_MODE=github

# 可选：GitHub Token（突破 API 请求限制）
export GITHUB_TOKEN=your_github_token_here
```

2. **配置内容源**

编辑 `src/lib/githubContent.ts` 中的 `DEFAULT_CONTENT_SOURCES`：

```typescript
export const DEFAULT_CONTENT_SOURCES: ContentSource[] = [
  {
    path: "博客文章",        // Obsidian 中的文件夹路径
    category: "数仓随笔",   // 映射到网站的分类
    filter: {
      // 只发布 frontmatter 中 publish: true 的文章
      publish: true,
    },
  },
  {
    path: "生活记录",
    category: "生活记录",
    filter: {
      publish: true,
      // 也可以按标签筛选
      // tags: ["公开"],
    },
  },
];
```

3. **文章 frontmatter 示例**

```yaml
---
title: 文章标题
date: 2026-03-25
category: 数仓随笔
publish: true        # 设置为 true 才会被同步
tags:
  - 标签1
  - 标签2
summary: 文章摘要
---

文章内容...
```

### 运行

```bash
# 开发模式（远程获取）
CONTENT_MODE=github pnpm dev

# 构建（远程获取）
CONTENT_MODE=github pnpm build
```

## 两种模式对比

| 特性 | 本地模式 | 远程模式 |
|------|----------|----------|
| 数据来源 | `content/` 目录 | GitHub 仓库 |
| 是否需要本地文件 | 是 | 否 |
| 构建速度 | 快 | 较慢（需 API 请求）|
| 文章控制 | 文件存在即发布 | frontmatter 筛选 |
| 适合场景 | 本地编辑、测试 | 生产环境、Obsidian 写作 |

## 高级用法

### 自定义筛选条件

```typescript
{
  path: "草稿箱",
  category: "数仓随笔",
  filter: {
    // 自定义函数筛选
    custom: (frontmatter) => {
      // 只发布评分大于 4 星的文章
      return frontmatter.rating >= 4;
    },
  },
}
```

### GitHub Token 申请

1. 访问 https://github.com/settings/tokens
2. 生成 Personal Access Token
3. 权限只需要 `public_repo`（访问公开仓库）

## 切换模式

```bash
# 临时切换到远程模式
CONTENT_MODE=github pnpm dev

# 永久切换（写入 .env 文件）
echo "CONTENT_MODE=github" > .env.local
echo "GITHUB_TOKEN=your_token" >> .env.local
```
