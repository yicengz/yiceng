import type { Metadata } from "next";

interface StructuredDataProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export default function StructuredData({
  title = "一层 - 个人主页",
  description = "一层的个人主页与博客，记录数据工程与生活的点滴",
  url = "https://yiceng.dev",
  image = "https://yiceng.dev/images/avatar.png",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "一层",
}: StructuredDataProps) {
  const baseData = {
    "@context": "https://schema.org",
    "@graph": [
      // 个人/组织信息
      {
        "@type": "Person",
        "@id": "https://yiceng.dev/#person",
        name: author,
        url: "https://yiceng.dev",
        image: {
          "@type": "ImageObject",
          url: image,
        },
        jobTitle: "数据仓库工程师",
        description: "数据仓库工程师，将混沌梳理为秩序",
      },
      // 网站信息
      {
        "@type": "WebSite",
        "@id": "https://yiceng.dev/#website",
        url: "https://yiceng.dev",
        name: title,
        description: description,
        publisher: {
          "@id": "https://yiceng.dev/#person",
        },
      },
      // 当前页面
      {
        "@type": type === "article" ? "BlogPosting" : "WebPage",
        "@id": url,
        url: url,
        name: title,
        description: description,
        isPartOf: {
          "@id": "https://yiceng.dev/#website",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: image,
        },
        ...(type === "article" && {
          author: {
            "@id": "https://yiceng.dev/#person",
          },
          datePublished: publishedTime,
          dateModified: modifiedTime || publishedTime,
        }),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseData) }}
    />
  );
}
