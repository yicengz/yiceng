#!/bin/bash

# ============================================================
# Obsidian 文章选择性发布脚本
# 用法: pnpm publish:select
# ============================================================

set -e

OBSIDIAN_REPO="https://github.com/yicengz/obsidian-vault-backup.git"
OBSIDIAN_DIR="/tmp/obsidian-vault-sync"
CONTENT_DIR="./content"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔄 正在获取 Obsidian 文章列表...${NC}"

# 克隆/更新 Obsidian 仓库
if [ -d "$OBSIDIAN_DIR/.git" ]; then
  cd "$OBSIDIAN_DIR"
  git pull origin main 2>/dev/null || git pull origin master 2>/dev/null
  cd - > /dev/null
else
  rm -rf "$OBSIDIAN_DIR"
  git clone --depth 1 "$OBSIDIAN_REPO" "$OBSIDIAN_DIR"
fi

# 使用 Node.js 实现交互式选择
node << 'NODE_SCRIPT'
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const OBSIDIAN_DIR = '/tmp/obsidian-vault-sync';
const CONTENT_DIR = './content';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 递归查找所有 markdown 文件
function findMarkdownFiles(dir, basePath = '') {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item.startsWith('.')) continue;
    
    const fullPath = path.join(dir, item);
    const relativePath = basePath ? path.join(basePath, item) : item;
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath, relativePath));
    } else if (item.endsWith('.md')) {
      files.push({
        name: item,
        relativePath: relativePath,
        fullPath: fullPath,
        mtime: stat.mtime
      });
    }
  }
  return files;
}

// 生成 frontmatter
function generateFrontmatter(content, fileName) {
  const lines = content.split('\n');
  let title = fileName.replace(/\.md$/, '');
  
  const firstLine = lines.find(l => l.trim().startsWith('# '));
  if (firstLine) {
    title = firstLine.replace(/^#\s*/, '').trim();
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  return `---
title: ${title}
date: ${today}
category: 数仓随笔
tags: []
---

`;
}

// 询问问题
function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, answer => resolve(answer.trim()));
  });
}

// 主流程
async function main() {
  console.log('\n📁 正在扫描 Obsidian 仓库...\n');
  
  const files = findMarkdownFiles(OBSIDIAN_DIR)
    .filter(f => !f.relativePath.startsWith('.git/'))
    .sort((a, b) => b.mtime - a.mtime); // 最新的在前
  
  if (files.length === 0) {
    console.log('❌ 没有找到任何 markdown 文件');
    rl.close();
    return;
  }
  
  // 显示最近的文章列表
  console.log('最近的文章（按时间倒序）：\n');
  const recentFiles = files.slice(0, 20);
  
  recentFiles.forEach((file, index) => {
    const date = file.mtime.toLocaleDateString('zh-CN');
    console.log(`  ${(index + 1).toString().padStart(2)}. ${file.relativePath} (${date})`);
  });
  
  if (files.length > 20) {
    console.log(`\n  ... 还有 ${files.length - 20} 篇较旧的文章`);
  }
  
  console.log('\n─────────────────────────────────────');
  console.log('💡 提示：输入序号（如 1,3,5）或 "all" 同步全部');
  console.log('        输入 "search 关键词" 搜索文章');
  console.log('        输入 "list" 显示完整列表');
  console.log('        输入 "q" 退出');
  console.log('─────────────────────────────────────\n');
  
  const answer = await question('请选择要发布的文章: ');
  
  if (answer.toLowerCase() === 'q') {
    console.log('👋 已取消');
    rl.close();
    return;
  }
  
  let selectedFiles = [];
  
  if (answer.toLowerCase() === 'all') {
    selectedFiles = files;
  } else if (answer.toLowerCase().startsWith('search ')) {
    const keyword = answer.slice(7).toLowerCase();
    selectedFiles = files.filter(f => 
      f.relativePath.toLowerCase().includes(keyword)
    );
    if (selectedFiles.length === 0) {
      console.log(`❌ 没有找到包含 "${keyword}" 的文章`);
      rl.close();
      return;
    }
    console.log(`\n找到 ${selectedFiles.length} 篇匹配的文章：`);
    selectedFiles.forEach((f, i) => console.log(`  ${i + 1}. ${f.relativePath}`));
    const confirm = await question('\n确认发布这些文章? (y/n): ');
    if (confirm.toLowerCase() !== 'y') {
      console.log('👋 已取消');
      rl.close();
      return;
    }
  } else if (answer.toLowerCase() === 'list') {
    files.forEach((file, index) => {
      const date = file.mtime.toLocaleDateString('zh-CN');
      console.log(`  ${(index + 1).toString().padStart(3)}. ${file.relativePath} (${date})`);
    });
    const idx = await question('\n请选择序号: ');
    const indices = idx.split(',').map(s => parseInt(s.trim()) - 1).filter(i => !isNaN(i));
    selectedFiles = indices.map(i => files[i]).filter(Boolean);
  } else {
    // 解析序号
    const indices = answer.split(',').map(s => parseInt(s.trim()) - 1).filter(i => !isNaN(i));
    selectedFiles = indices.map(i => recentFiles[i]).filter(Boolean);
  }
  
  if (selectedFiles.length === 0) {
    console.log('❌ 没有选择任何文章');
    rl.close();
    return;
  }
  
  console.log(`\n📋 即将发布 ${selectedFiles.length} 篇文章：`);
  selectedFiles.forEach(f => console.log(`   - ${f.relativePath}`));
  
  const confirm = await question('\n确认发布? (y/n): ');
  if (confirm.toLowerCase() !== 'y') {
    console.log('👋 已取消');
    rl.close();
    return;
  }
  
  // 选择发布目标
  console.log('\n📂 选择发布位置：');
  console.log('  1. posts (博客文章)');
  console.log('  2. journeys (旅行记录)');
  const targetChoice = await question('请选择 (1/2): ');
  const targetDir = targetChoice === '2' ? 'journeys' : 'posts';
  
  // 执行复制
  const targetPath = path.join(CONTENT_DIR, targetDir);
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
  
  let success = 0;
  for (const file of selectedFiles) {
    try {
      let content = fs.readFileSync(file.fullPath, 'utf-8');
      
      // 自动添加 frontmatter（如果没有）
      if (!content.trim().startsWith('---')) {
        content = generateFrontmatter(content, file.name) + content;
      }
      
      const destPath = path.join(targetPath, file.name.replace(/\s+/g, '-'));
      fs.writeFileSync(destPath, content, 'utf-8');
      console.log(`✅ ${file.name}`);
      success++;
    } catch (err) {
      console.log(`❌ ${file.name}: ${err.message}`);
    }
  }
  
  console.log(`\n🎉 完成！成功发布 ${success}/${selectedFiles.length} 篇文章到 content/${targetDir}/`);
  
  const gitCommit = await question('\n是否提交到 Git? (y/n): ');
  if (gitCommit.toLowerCase() === 'y') {
    const { execSync } = require('child_process');
    try {
      execSync('git add content/', { stdio: 'inherit' });
      execSync(`git commit -m "📝 发布文章: ${new Date().toLocaleDateString('zh-CN')}"`, { stdio: 'inherit' });
      execSync('git push', { stdio: 'inherit' });
      console.log('\n✅ 已推送到远程仓库');
    } catch (e) {
      console.log('\n⚠️ Git 操作失败，请手动提交');
    }
  }
  
  rl.close();
}

main().catch(err => {
  console.error('错误:', err);
  rl.close();
  process.exit(1);
});
NODE_SCRIPT
