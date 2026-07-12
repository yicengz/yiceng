import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { RoutineMeta, Routine, RoutineType } from "./constants";

const ROUTINE_DIR = path.join(process.cwd(), "content/routines");

export type { RoutineMeta, Routine, RoutineType } from "./constants";

function toSlug(filename: string): string {
  return filename
    .replace(/\.md$/, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function getSlugToFileMap(): Map<string, string> {
  if (!fs.existsSync(ROUTINE_DIR)) return new Map();
  const files = fs.readdirSync(ROUTINE_DIR).filter((f) => f.endsWith(".md"));
  const map = new Map<string, string>();
  for (const f of files) {
    map.set(toSlug(f), f);
  }
  return map;
}

export function getAllRoutinesMeta(): RoutineMeta[] {
  if (!fs.existsSync(ROUTINE_DIR)) {
    return [];
  }

  const files = fs.readdirSync(ROUTINE_DIR).filter((f) => f.endsWith(".md"));

  const routines = files.map((filename) => {
    const slug = toSlug(filename);
    const filePath = path.join(ROUTINE_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      slug,
      title: data.title || filename.replace(/\.md$/, ""),
      date: data.date
        ? new Date(data.date).toISOString().split("T")[0]
        : "",
      type: (data.type || "other") as RoutineType,
      summary: data.summary || "",
      link: data.link || "",
    } as RoutineMeta;
  });

  return routines.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getRoutineBySlug(slug: string): Routine | null {
  const map = getSlugToFileMap();
  const filename = map.get(slug);
  if (!filename) return null;

  const filePath = path.join(ROUTINE_DIR, filename);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || filename.replace(/\.md$/, ""),
    date: data.date
      ? new Date(data.date).toISOString().split("T")[0]
      : "",
    type: (data.type || "other") as RoutineType,
    summary: data.summary || "",
    link: data.link || "",
    content,
  };
}

export function getAllRoutineSlugs(): string[] {
  if (!fs.existsSync(ROUTINE_DIR)) {
    return [];
  }

  return fs
    .readdirSync(ROUTINE_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => toSlug(f));
}
