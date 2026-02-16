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

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={post.href || `/blog/${post.slug}`} className={styles.card}>
      <div className={styles.meta}>
        {post.pinned && <span className={styles.pinned}>置顶</span>}
        <time className={styles.date}>{post.date}</time>
        <span className={styles.readingTime}>{post.readingTime}</span>
      </div>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>{post.title}</h3>
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
        {post.tags.length > 0 && <span className={styles.tagDivider} />}
        {post.tags.map((tag) => (
          <Tag key={tag} color="default" className={styles.tag}>
            {tag}
          </Tag>
        ))}
      </div>
    </Link>
  );
}
