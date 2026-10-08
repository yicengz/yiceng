import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { RoutineMeta, Routine, RoutineType } from "./constants";
import {
  LOCAL_VAULT_ROOT,
  readMarkdownFilesUnder,
  resolveObsidianImagesLocal,
  inlineWikilinksLocal,
} from "./obsidianLocal";
import {
  fetchRepoTree,
  fetchRawContent,
  toSlug,
  matchesFilter,
} from "./githubContent";

export type { RoutineMeta, Routine, RoutineType } from "./constants";

const CONTENT_MODE = (process.env.CONTENT_MODE || "local") as "local" | "github";

const FOOTPRINT_PATH = "footprint";

// ============================================================
// 通用：frontmatter → RoutineMeta 字段映射
// ============================================================

function mapFrontmatterFields(
  frontmatter: Record<string, any>,
  filename: string,
  fallbackDate: string
) {
  const dateValue =
    frontmatter.footprint_date ?? frontmatter.date ?? frontmatter.publish_date;

  return {
    title: frontmatter.title || filename.replace(/\.md$/, ""),
    date: dateValue
      ? new Date(dateValue).toISOString().split("T")[0]
      : fallbackDate,
    type: (frontmatter.footprint_type ??
      frontmatter.type ??
      "other") as RoutineType,
    summary: frontmatter.summary ?? frontmatter.description ?? "",
    link: typeof frontmatter.link === "string" ? frontmatter.link : "",
  };
}

// wikilink 判定：正文只含 [[xxx]] 骨架，没有实际文字算无内容
function hasNonWikilinkText(body: string): boolean {
  const stripped = body.replace(/(?<!!)\[\[[^\]]+\]\]/g, "").trim();
  return stripped.length > 0;
}

// ============================================================
// 本地模式
// ============================================================

interface LocalRoutineMeta extends RoutineMeta {
  _sourcePath?: string;
}

function readAllLocalFootprints(): Array<{
  file: { path: string; name: string };
  raw: string;
}> {
  const files = readMarkdownFilesUnder(FOOTPRINT_PATH);
  const out: Array<{ file: (typeof files)[0]; raw: string }> = [];
  for (const file of files) {
    const full = path.join(LOCAL_VAULT_ROOT, file.path);
    try {
      out.push({ file, raw: fs.readFileSync(full, "utf-8") });
    } catch {
      // 跳过读不到的
    }
  }
  return out;
}

function getAllRoutinesMetaLocal(): RoutineMeta[] {
  const entries = readAllLocalFootprints();
  const metas: LocalRoutineMeta[] = [];

  for (const { file, raw } of entries) {
    const { data: frontmatter, content: body } = matter(raw);
    if (!matchesFilter(frontmatter, { publish: true })) continue;

    let fallbackDate = "";
    try {
      const full = path.join(LOCAL_VAULT_ROOT, file.path);
      const st = fs.statSync(full);
      const t =
        st.birthtime && st.birthtime.getTime() > 0 ? st.birthtime : st.mtime;
      fallbackDate = t.toISOString().split("T")[0];
    } catch {
      /* leave empty */
    }

    const mapped = mapFrontmatterFields(frontmatter, file.name, fallbackDate);
    // 内联后若还有 [[xxx]] 说明未解析，剥掉再判断
    const resolved = inlineWikilinksLocal(body);
    const hasContent = hasNonWikilinkText(resolved);

    metas.push({
      slug: toSlug(file.name),
      ...mapped,
      hasContent,
      _sourcePath: file.path,
    });
  }

  metas.sort((a, b) => (a.date > b.date ? -1 : 1));
  return metas;
}

function getRoutineBySlugLocal(slug: string): Routine | null {
  const list = getAllRoutinesMetaLocal() as LocalRoutineMeta[];
  const decoded = decodeURIComponent(slug);
  const meta = list.find((r) => r.slug === decoded);
  if (!meta?._sourcePath) return null;

  const full = path.join(LOCAL_VAULT_ROOT, meta._sourcePath);
  let raw: string;
  try {
    raw = fs.readFileSync(full, "utf-8");
  } catch {
    return null;
  }
  const { content: body } = matter(raw);
  const inlined = inlineWikilinksLocal(body);
  const withImages = resolveObsidianImagesLocal(inlined);

  return {
    slug: meta.slug,
    title: meta.title,
    date: meta.date,
    type: meta.type,
    summary: meta.summary,
    link: meta.link,
    hasContent: meta.hasContent,
    content: withImages,
  };
}

// ============================================================
// 远程模式（GitHub obsidian-vault-backup）
// ============================================================

interface GithubRoutineMeta extends RoutineMeta {
  _sourcePath?: string;
}

async function fetchTreeAndMaps(): Promise<{
  tree: Array<{ path: string; type: string }>;
  docMap: Map<string, string>;
  attachmentMap: Map<string, string>;
}> {
  const tree = await fetchRepoTree();
  const docMap = new Map<string, string>();
  const attachmentMap = new Map<string, string>();
  for (const item of tree) {
    if (item.type !== "blob") continue;
    if (item.path.startsWith("attachments/")) {
      const filename = item.path.split("/").pop()!;
      attachmentMap.set(filename, item.path);
    } else if (item.path.endsWith(".md")) {
      const basename = item.path.split("/").pop()!.replace(/\.md$/, "");
      docMap.set(basename, item.path);
    }
  }
  return { tree, docMap, attachmentMap };
}

async function inlineWikilinksGithub(
  content: string,
  docMap: Map<string, string>
): Promise<string> {
  const matches = [...content.matchAll(/(?<!!)\[\[([^\]|#^]+?)(?:\|[^\]]+)?\]\]/g)];
  if (matches.length === 0) return content;

  const replacements = new Map<string, string>();
  for (const m of matches) {
    const target = m[1].trim();
    if (replacements.has(target)) continue;
    const filePath = docMap.get(target);
    if (!filePath) {
      replacements.set(target, m[0]);
      continue;
    }
    const raw = await fetchRawContent(filePath);
    if (!raw) {
      replacements.set(target, m[0]);
      continue;
    }
    const { content: body } = matter(raw);
    replacements.set(target, body.trim());
  }

  return content.replace(
    /(?<!!)\[\[([^\]|#^]+?)(?:\|[^\]]+)?\]\]/g,
    (whole, target) => replacements.get(target.trim()) ?? whole
  );
}

function resolveObsidianImagesGithub(
  content: string,
  attachmentMap: Map<string, string>
): string {
  return content.replace(
    /!\[\[([^\]]+\.(jpg|jpeg|png|gif|webp|svg|avif|heic))\]\]/gi,
    (_, filename) => {
      const fullPath =
        attachmentMap.get(filename) ?? `attachments/unsplash/${filename}`;
      return `![${filename}](/api/gh-image?path=${encodeURIComponent(fullPath)})`;
    }
  );
}

async function getAllRoutinesMetaGithub(): Promise<RoutineMeta[]> {
  const { tree, docMap } = await fetchTreeAndMaps();
  const files = tree
    .filter(
      (item) =>
        item.type === "blob" &&
        item.path.startsWith(FOOTPRINT_PATH + "/") &&
        item.path.endsWith(".md")
    )
    .map((item) => ({
      path: item.path,
      name: item.path.split("/").pop()!,
    }));

  const CONCURRENCY = 5;
  const results: Array<{ file: (typeof files)[0]; raw: string | null }> = [];
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (file) => ({ file, raw: await fetchRawContent(file.path) }))
    );
    results.push(...batchResults);
  }

  const metas: GithubRoutineMeta[] = [];

  for (const { file, raw } of results) {
    if (!raw) continue;
    const { data: frontmatter, content: body } = matter(raw);
    if (!matchesFilter(frontmatter, { publish: true })) continue;

    const mapped = mapFrontmatterFields(frontmatter, file.name, "");
    // 不实际拉取 wikilink 目标，只判断"有非 wikilink 文字"或"wikilink 目标在 tree 里存在"
    const wikilinkTargets = [
      ...body.matchAll(/(?<!!)\[\[([^\]|#^]+?)(?:\|[^\]]+)?\]\]/g),
    ].map((m) => m[1].trim());
    const hasResolvableWikilink = wikilinkTargets.some((t) => docMap.has(t));
    const hasContent = hasNonWikilinkText(body) || hasResolvableWikilink;

    metas.push({
      slug: toSlug(file.name),
      ...mapped,
      hasContent,
      _sourcePath: file.path,
    });
  }

  metas.sort((a, b) => (a.date > b.date ? -1 : 1));
  return metas;
}

async function getRoutineBySlugGithub(slug: string): Promise<Routine | null> {
  const list = (await getAllRoutinesMetaGithub()) as GithubRoutineMeta[];
  const decoded = decodeURIComponent(slug);
  const meta = list.find((r) => r.slug === decoded);
  if (!meta?._sourcePath) return null;

  const raw = await fetchRawContent(meta._sourcePath);
  if (!raw) return null;

  const { content: body } = matter(raw);
  const { docMap, attachmentMap } = await fetchTreeAndMaps();
  const inlined = await inlineWikilinksGithub(body, docMap);
  const withImages = resolveObsidianImagesGithub(inlined, attachmentMap);

  return {
    slug: meta.slug,
    title: meta.title,
    date: meta.date,
    type: meta.type,
    summary: meta.summary,
    link: meta.link,
    hasContent: meta.hasContent,
    content: withImages,
  };
}

// ============================================================
// 统一 API
// ============================================================

export function getAllRoutinesMeta(): RoutineMeta[] | Promise<RoutineMeta[]> {
  return CONTENT_MODE === "github"
    ? getAllRoutinesMetaGithub()
    : getAllRoutinesMetaLocal();
}

export function getRoutineBySlug(
  slug: string
): Routine | null | Promise<Routine | null> {
  return CONTENT_MODE === "github"
    ? getRoutineBySlugGithub(slug)
    : getRoutineBySlugLocal(slug);
}

export function getAllRoutineSlugs(): string[] | Promise<string[]> {
  if (CONTENT_MODE === "github") {
    return getAllRoutinesMetaGithub().then((list) => list.map((r) => r.slug));
  }
  return getAllRoutinesMetaLocal().map((r) => r.slug);
}
