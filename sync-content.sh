#!/bin/bash

SRC="/Users/guihuajiu/yiceng/obsidian-vault-backup/web/"
DEST="/Users/guihuajiu/yiceng/yiceng-web/content/"

sync_once() {
  rsync -av --delete \
    --exclude='.DS_Store' \
    "$SRC" "$DEST"
  echo "[$(date '+%H:%M:%S')] 同步完成"
}

# 先执行一次同步
sync_once

# 如果带 --watch 参数，则持续监听变化自动同步
if [ "$1" = "--watch" ]; then
  echo "监听 $SRC 变化中..."
  fswatch -o "$SRC" | while read; do
    sync_once
  done
fi
