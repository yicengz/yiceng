"use client";

import { memo } from "react";
import Link from "next/link";
import { Tag } from "antd";
import type { PostMeta } from "@/lib/constants";
import styles from "./PostCard.module.scss";

const categoryColors: Record<string, string> = {
  数仓随笔: "orange",
  生活记录: "green",
  读书笔记: "blue",
  去过: "purple",
};

const sourceColors: Record<string, string> = {
  公众号: "#07830b",
  小红书: "#e23442",
};

function PostCard({ post }: { post: PostMeta }) {
  const visibleTags = post.tags.filter((t) => !t.startsWith("content/"));
  const href = post.href || `/blog/${post.slug}`;

  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        {post.pinned && <span className={styles.pinned}>置顶</span>}
        <time className={styles.date}>{post.date}</time>
        <span className={styles.readingTime}>{post.readingTime}</span>
      </div>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>
          <Link href={href} className={styles.titleLink}>
            {post.title}
          </Link>
        </h3>
        {post.source && (
          <Tag
            className={styles.sourceTag}
            color={sourceColors[post.source]}
          >
            {post.source}
          </Tag>
        )}
      </div>
      {post.summary && <p className={styles.summary}>{post.summary}</p>}
      <div className={styles.tags}>
        <Tag color={categoryColors[post.category] || "default"}>
          {post.category}
        </Tag>
        {visibleTags.length > 0 && <span className={styles.tagDivider} />}
        {visibleTags.map((tag) => (
          <Tag key={tag} color="default" className={styles.tag}>
            {tag}
          </Tag>
        ))}
        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkButton}
          >
            原文 ↗
          </a>
        )}
      </div>
    </article>
  );
}

export default memo(PostCard);
