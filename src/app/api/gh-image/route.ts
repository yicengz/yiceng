import { NextRequest, NextResponse } from "next/server";

const GITHUB_CONFIG = {
  owner: "yicengz",
  repo: "obsidian-vault-backup",
  branch: "main",
};

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path) {
    return new NextResponse("Missing path", { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return new NextResponse("Server misconfiguration", { status: 500 });
  }

  const encoded = path.split("/").map(encodeURIComponent).join("/");
  const url = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${encoded}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return new NextResponse("Image not found", { status: res.status });
  }

  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
