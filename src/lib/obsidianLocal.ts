import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const LOCAL_VAULT_ROOT =
  "/Users/yiceng/Library/Mobile Documents/iCloud~md~obsidian/Documents/yiceng";

// ============================================================
// 附件 filename → 仓库相对路径（用于解析 ![[image.jpg]]）
// ============================================================

let attachmentMap: Map<string, string> | null = null;

function buildAttachmentMap(): Map<string, string> {
  const map = new Map<string, string>();
  const root = path.join(LOCAL_VAULT_ROOT, "attachments");
  if (!fs.existsSync(root)) return map;

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) {
        map.set(entry.name, path.relative(LOCAL_VAULT_ROOT, full));
      }
    }
  };
  walk(root);
  return map;
}

function getAttachmentMap(): Map<string, string> {
  if (!attachmentMap || process.env.NODE_ENV === "development") {
    attachmentMap = buildAttachmentMap();
  }
  return attachmentMap;
}

export function resolveObsidianImagesLocal(content: string): string {
  const map = getAttachmentMap();
  return content.replace(
    /!\[\[([^\]]+\.(jpg|jpeg|png|gif|webp|svg|avif|heic))\]\]/gi,
    (_, filename) => {
      const rel = map.get(filename) ?? `attachments/unsplash/${filename}`;
      return `![${filename}](/api/local-image?path=${encodeURIComponent(rel)})`;
    }
  );
}

// ============================================================
// md 文件 basename → 仓库相对路径（用于 wikilink [[xxx]] 解析）
// ============================================================

let docMap: Map<string, string> | null = null;

function buildDocMap(): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(LOCAL_VAULT_ROOT)) return map;

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      // 跳过附件目录避免污染
      if (entry.isDirectory() && entry.name === "attachments") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(".md")) {
        const rel = path.relative(LOCAL_VAULT_ROOT, full);
        const basename = entry.name.replace(/\.md$/, "");
        // basename 键：后写入覆盖同名条目（output/ 优先级更高）
        map.set(basename, rel);
        // 路径键：允许 [[output/movie/xxx]] 精确定位
        map.set(rel.replace(/\.md$/, ""), rel);
      }
    }
  };
  walk(LOCAL_VAULT_ROOT);
  return map;
}

function getDocMap(): Map<string, string> {
  if (!docMap || process.env.NODE_ENV === "development") {
    docMap = buildDocMap();
  }
  return docMap;
}

// 把 [[xxx]] 或 ![[xxx]] 内联为对应文件的正文（不含 frontmatter）
// 支持 [[xxx]]、[[xxx|显示名]]、![[xxx]]（Obsidian 嵌入语法），暂不处理 #heading / ^blockid
// 图片嵌入（![[xxx.jpg]] 等）不在此处理，会被 resolveObsidianImagesLocal 接手
export function inlineWikilinksLocal(content: string): string {
  const map = getDocMap();
  return content.replace(/!?\[\[([^\]|#^]+?)(?:\|[^\]]+)?\]\]/g, (whole, target) => {
    const trimmed = target.trim();
    // 图片嵌入交给 resolveObsidianImagesLocal
    if (/\.(jpg|jpeg|png|gif|webp|svg|avif|heic)$/i.test(trimmed)) return whole;
    const rel = map.get(trimmed);
    if (!rel) return whole;
    const full = path.join(LOCAL_VAULT_ROOT, rel);
    try {
      const raw = fs.readFileSync(full, "utf-8");
      const { content: body } = matter(raw);
      return body.trim();
    } catch {
      return whole;
    }
  });
}

// ============================================================
// 遍历目录下的所有 .md
// ============================================================

export function readMarkdownFilesUnder(
  basePath: string
): Array<{ path: string; name: string }> {
  const root = path.join(LOCAL_VAULT_ROOT, basePath);
  if (!fs.existsSync(root)) return [];

  const out: Array<{ path: string; name: string }> = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(".md")) {
        out.push({
          path: path.relative(LOCAL_VAULT_ROOT, full),
          name: entry.name,
        });
      }
    }
  };
  walk(root);
  return out;
}
