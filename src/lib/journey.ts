import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { JourneyMeta, Journey } from "./constants";

const JOURNEY_DIR = path.join(process.cwd(), "content/journeys");

export type { JourneyMeta, Journey, JourneyType } from "./constants";

function toSlug(filename: string): string {
  return filename
    .replace(/\.md$/, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function getSlugToFileMap(): Map<string, string> {
  if (!fs.existsSync(JOURNEY_DIR)) return new Map();
  const files = fs.readdirSync(JOURNEY_DIR).filter((f) => f.endsWith(".md"));
  const map = new Map<string, string>();
  for (const f of files) {
    map.set(toSlug(f), f);
  }
  return map;
}

export function getAllJourneysMeta(): JourneyMeta[] {
  if (!fs.existsSync(JOURNEY_DIR)) {
    return [];
  }

  const files = fs.readdirSync(JOURNEY_DIR).filter((f) => f.endsWith(".md"));

  const journeys = files.map((filename) => {
    const slug = toSlug(filename);
    const filePath = path.join(JOURNEY_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      slug,
      title: data.title || filename.replace(/\.md$/, ""),
      location: data.location || "",
      startDate: data.startDate
        ? new Date(data.startDate).toISOString().split("T")[0]
        : "",
      endDate: data.endDate
        ? new Date(data.endDate).toISOString().split("T")[0]
        : "",
      type: data.type || "travel",
      summary: data.summary || "",
      coverImage: data.coverImage || "",
    } as JourneyMeta;
  });

  return journeys.sort((a, b) =>
    a.startDate > b.startDate ? -1 : 1
  );
}

export function getJourneyBySlug(slug: string): Journey | null {
  const map = getSlugToFileMap();
  const filename = map.get(slug);
  if (!filename) return null;

  const filePath = path.join(JOURNEY_DIR, filename);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || filename.replace(/\.md$/, ""),
    location: data.location || "",
    startDate: data.startDate
      ? new Date(data.startDate).toISOString().split("T")[0]
      : "",
    endDate: data.endDate
      ? new Date(data.endDate).toISOString().split("T")[0]
      : "",
    type: data.type || "travel",
    summary: data.summary || "",
    coverImage: data.coverImage || "",
    content,
  };
}

export function getAllJourneySlugs(): string[] {
  if (!fs.existsSync(JOURNEY_DIR)) {
    return [];
  }

  return fs
    .readdirSync(JOURNEY_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => toSlug(f));
}
