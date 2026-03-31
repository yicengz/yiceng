#!/bin/bash

# ============================================================
# Obsidian → 网站自动同步脚本
# 用法: ./scripts/sync-from-obsidian.sh [--auto-commit] [--deploy]
# ============================================================

set -e

# 配置项
OBSIDIAN_REPO="https://github.com/yicengz/obsidian-vault-backup.git"
OBSIDIAN_DIR="/tmp/obsidian-vault-sync"
CONTENT_DIR="./content"
SYNC_CONFIG="./scripts/sync-config.json"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 开始同步 Obsidian 文章...${NC}"

# 参数解析
AUTO_COMMIT=false
AUTO_DEPLOY=false

for arg in "$@"; do
  case $arg in
    --auto-commit)
      AUTO_COMMIT=true
      shift
      ;;
    --deploy)
      AUTO_DEPLOY=true
      shift
      ;;
  esac
done

# 1. 克隆/更新 Obsidian 仓库
echo -e "${BLUE}📥 获取 Obsidian 仓库...${NC}"
if [ -d "$OBSIDIAN_DIR/.git" ]; then
  cd "$OBSIDIAN_DIR"
  git pull origin main 2>/dev/null || git pull origin master 2>/dev/null
  cd - > /dev/null
else
  rm -rf "$OBSIDIAN_DIR"
  git clone --depth 1 "$OBSIDIAN_REPO" "$OBSIDIAN_DIR"
fi

# 2. 确保同步配置存在
if [ ! -f "$SYNC_CONFIG" ]; then
  echo -e "${YELLOW}⚙️  创建默认同步配置...${NC}"
  mkdir -p "$(dirname "$SYNC_CONFIG")"
  cat > "$SYNC_CONFIG" << 'EOF'
{
  "mappings": [
    {
      "from": "博客文章",
      "to": "posts",
      "category": "数仓随笔"
    },
    {
      "from": "生活记录",
      "to": "posts",
      "category": "生活记录"
    },
    {
      "from": "读书笔记",
      "to": "posts",
      "category": "读书笔记"
    },
    {
      "from": "旅行/去过",
      "to": "journeys",
      "category": "去过"
    }
  ],
  "defaultCategory": "数仓随笔",
  "requireFrontmatter": false,
  "autoGenerateFrontmatter": true
}
EOF
  echo -e "${GREEN}✅ 已创建配置文件: $SYNC_CONFIG${NC}"
  echo -e "${YELLOW}💡 请根据需要修改配置后重新运行${NC}"
  exit 0
fi

# 3. 同步文章
echo -e "${BLUE}📋 开始同步文章...${NC}"

# 使用 Node.js 进行更复杂的同步逻辑
node << 'NODE_SCRIPT'
const fs = require('fs');
const path = require('path');

const OBSIDIAN_DIR = '/tmp/obsidian-vault-sync';
const CONTENT_DIR = './content';
const SYNC_CONFIG = './scripts/sync-config.json';

// 读取配置
const config = JSON.parse(fs.readFileSync(SYNC_CONFIG, 'utf-8'));

// 统计
let stats = {
  copied: 0,
  updated: 0,
  skipped: 0,
  errors: []
};

// 生成 frontmatter
generateFrontmatter = (content, fileName, category) => {
  // 尝试从内容第一行提取标题
  const lines = content.split('\n');
  let title = fileName.replace(/\.md$/, '');
  
  // 如果第一行是 # 标题，提取它
  const firstLine = lines.find(l => l.trim().startsWith('# '));
  if (firstLine) {
    title = firstLine.replace(/^#\s*/, '').trim();
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  return `---
title: ${title}
date: ${today}
category: ${category}
tags: []
---

`;
};

// 处理单个文件
processFile = (sourcePath, targetDir, category) => {
  try {
    const fileName = path.basename(sourcePath);
    const targetPath = path.join(targetDir, fileName);
    
    let content = fs.readFileSync(sourcePath, 'utf-8');
    
    // 检查是否有 frontmatter
    const hasFrontmatter = content.trim().startsWith('---');
    
    if (!hasFrontmatter && config.autoGenerateFrontmatter) {
      const frontmatter = generateFrontmatter(content, fileName, category);
      // 如果第一行是标题，去掉它（避免重复）
      const lines = content.split('\n');
      if (lines[0].trim().startsWith('# ')) {
        content = lines.slice(1).join('\n').trim();
      }
      content = frontmatter + content;
    }
    
    // 检查文件是否已存在
    if (fs.existsSync(targetPath)) {
      const existing = fs.readFileSync(targetPath, 'utf-8');
      if (existing === content) {
        stats.skipped++;
        return;
      }
      stats.updated++;
      console.log(`📝 更新: ${fileName}`);
    } else {
      stats.copied++;
      console.log(`✨ 新增: ${fileName}`);
    }
    
    fs.writeFileSync(targetPath, content, 'utf-8');
  } catch (err) {
    stats.errors.push({ file: sourcePath, error: err.message });
  }
};

// 遍历映射配置
config.mappings.forEach(mapping => {
  const sourceDir = path.join(OBSIDIAN_DIR, mapping.from);
  const targetDir = path.join(CONTENT_DIR, mapping.to);
  
  if (!fs.existsSync(sourceDir)) {
    console.log(`⚠️  跳过不存在的目录: ${mapping.from}`);
    return;
  }
  
  // 确保目标目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // 读取源目录
  const files = fs.readdirSync(sourceDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'));
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    if (fs.statSync(sourcePath).isFile()) {
      processFile(sourcePath, targetDir, mapping.category);
    }
  });
});

// 输出统计
console.log('\n📊 同步统计:');
console.log(`   新增: ${stats.copied} 篇`);
console.log(`   更新: ${stats.updated} 篇`);
console.log(`   跳过: ${stats.skipped} 篇`);
if (stats.errors.length > 0) {
  console.log(`   错误: ${stats.errors.length} 个`);
  stats.errors.forEach(e => console.log(`      - ${e.file}: ${e.error}`));
}

// 返回是否有变更
process.exit(stats.copied + stats.updated > 0 ? 0 : 1);
NODE_SCRIPT

# 检查是否有新文件
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}ℹ️  没有新文章需要同步${NC}"
  exit 0
fi

# 4. 自动提交（可选）
if [ "$AUTO_COMMIT" = true ]; then
  echo -e "${BLUE}💾 自动提交变更...${NC}"
  git add content/
  git commit -m "📝 同步 Obsidian 文章: $(date '+%Y-%m-%d %H:%M')" || {
    echo -e "${YELLOW}⚠️  没有变更需要提交${NC}"
    exit 0
  }
  git push
  echo -e "${GREEN}✅ 已推送到远程仓库${NC}"
fi

# 5. 自动部署（可选）
if [ "$AUTO_DEPLOY" = true ]; then
  echo -e "${BLUE}🚀 开始构建部署...${NC}"
  pnpm build
  # 这里可以添加你的部署命令，比如：
  # pnpm deploy
  # 或 rsync 到服务器
  echo -e "${GREEN}✅ 部署完成${NC}"
fi

echo -e "${GREEN}🎉 同步完成！${NC}"
