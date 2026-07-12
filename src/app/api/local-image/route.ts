import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const VAULT_ROOT =
  "/Users/yiceng/Library/Mobile Documents/iCloud~md~obsidian/Documents/yiceng";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".heic": "image/heic",
};

export async function GET(request: NextRequest) {
  const rel = request.nextUrl.searchParams.get("path");
  if (!rel) {
    return new NextResponse("Missing path", { status: 400 });
  }

  // 解析为绝对路径，并校验未越出 vault 根（防 path traversal）
  const full = path.resolve(VAULT_ROOT, rel);
  if (full !== VAULT_ROOT && !full.startsWith(VAULT_ROOT + path.sep)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const buf = await fs.readFile(full);
    const contentType =
      MIME_TYPES[path.extname(full).toLowerCase()] ?? "application/octet-stream";
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
