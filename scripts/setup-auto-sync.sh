#!/bin/bash

# ============================================================
# 设置自动定时同步（使用 macOS launchd）
# 用法: ./scripts/setup-auto-sync.sh [间隔分钟数，默认60]
# ============================================================

INTERVAL=${1:-60}
PLIST_NAME="com.yiceng.obsidian-sync"
PLIST_PATH="$HOME/Library/LaunchAgents/${PLIST_NAME}.plist"
SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd)/sync-from-obsidian.sh"

echo "🔄 设置自动同步（每 ${INTERVAL} 分钟）..."

# 创建 plist 文件
cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${PLIST_NAME}</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>cd $(dirname "$SCRIPT_PATH")/.. &amp;&amp; $(dirname "$0")/sync-from-obsidian.sh --auto-commit 2&gt;&amp;1 | tee -a /tmp/obsidian-sync.log</string>
    </array>
    <key>StartInterval</key>
    <integer>$(($INTERVAL * 60))</integer>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/obsidian-sync.out</string>
    <key>StandardErrorPath</key>
    <string>/tmp/obsidian-sync.err</string>
</dict>
</plist>
EOF

# 加载服务
launchctl unload "$PLIST_PATH" 2>/dev/null || true
launchctl load "$PLIST_PATH"

echo "✅ 自动同步已设置！"
echo ""
echo "📋 管理命令:"
echo "   查看状态: launchctl list | grep ${PLIST_NAME}"
echo "   手动运行: launchctl start ${PLIST_NAME}"
echo "   停止同步: launchctl unload ${PLIST_PATH}"
echo "   查看日志: tail -f /tmp/obsidian-sync.log"
echo ""
echo "🗑️  要取消自动同步，运行: launchctl unload ${PLIST_PATH}"
