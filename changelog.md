# 2026-07-19

- wikilink 内联同时支持 Obsidian 嵌入语法 `![[xxx]]`（此前只处理 `[[]]`），现在 footprint 里写 `![[output/movie/《心灵奇旅》|《心灵奇旅》]]` 能像 Obsidian 客户端一样把目标文档正文展示出来
- docMap 增加"完整路径（无扩展名）"键，支持 `[[output/movie/xxx]]` 这种带路径的精确定位（basename 冲突时不用靠遍历顺序碰运气）

# 2026-07-12

- 起居模块转成"无 sync"架构：`routine.ts` 改成跟 `content.ts` 一样的 dual-mode（本地读 iCloud footprint/，Vercel 读 obsidian-vault-backup）
- 抽出共享 helper `obsidianLocal.ts`：vault root、附件 map、图片路径解析、md 文件遍历、wikilink 内联
- footprint 走 `is_yiceng_public: true` 开关（跟 posts 一致），默认不上网
- 支持 wikilink 内联：footprint 里 `[[《心灵奇旅》]]` 会被替换成 output/movie/《心灵奇旅》.md 的正文
- RoutineTimeline 支持"不可点"状态：正文空的条目留在时间线上但不跳详情页
- 废弃 `scripts/sync-from-obsidian.sh` / `sync-config.json` / `setup-auto-sync.sh`（担心 sync 出错导致两边对不上）
- 删掉 `content/routines/` 下 4 篇占位内容（原是我此前编的示范，不是真实笔记）

# 2026-07-05

- 新增「起居」模块 — 时间线形式记录日常做的事（电影 / 书 / 剧 / 播客 / 去过某地 等），底表来自 Obsidian footprint 文件夹
- 「记事」section 更名为「打磨」
- 新增「命名候选」小控件：hover 灯泡图标可看到曾考虑过但没选的名字，把设计过程留在页面上
- Future idea：把「汲取」更名为「见闻」（本次未执行）
