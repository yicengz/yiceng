"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeOutlined, RightOutlined } from "@ant-design/icons";
import styles from "./Breadcrumb.module.scss";

interface BreadcrumbItem {
  label: string;
  href: string;
}

// 路由映射表
const routeMap: Record<string, string> = {
  "": "首页",
  trace: "留痕",
  blog: "文字",
  journey: "行迹",
  intake: "汲取",
  about: "缘起",
};

export default function Breadcrumb() {
  const pathname = usePathname();

  // 首页不显示面包屑
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  
  const items: BreadcrumbItem[] = [
    { label: "首页", href: "/" },
    ...segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      // URL 解码 segment
      const decodedSegment = decodeURIComponent(segment);
      return {
        label: routeMap[segment] || decodedSegment,
        href,
      };
    }),
  ];

  // 生成结构化数据
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `https://yiceng.dev${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <nav aria-label="面包屑导航" className={styles.breadcrumb}>
        <ol className={styles.list}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={item.href} className={styles.item}>
                {index > 0 && (
                  <RightOutlined className={styles.separator} />
                )}
                {isLast ? (
                  <span className={styles.current} aria-current="page">
                    {index === 0 ? <HomeOutlined /> : item.label}
                  </span>
                ) : (
                  <Link href={item.href} className={styles.link}>
                    {index === 0 ? <HomeOutlined /> : item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
