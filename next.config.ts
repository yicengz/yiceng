import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 开发模式下禁用静态导出，以支持动态路由
  ...(process.env.NODE_ENV === "production" ? { output: "export" } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
