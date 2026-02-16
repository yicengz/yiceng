import type { Metadata } from "next";
import { getAllContentMeta } from "@/lib/content";
import BlogList from "./BlogList";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "文字",
  description: "一层的文字 — 数仓随笔、生活记录、读书笔记",
};

export default function BlogPage() {
  const posts = getAllContentMeta();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>文字</h1>
      <p className={styles.subtitle}>数仓心得、生活感悟、读书笔记，慢慢写，慢慢沉淀</p>
      <BlogList posts={posts} />
    </div>
  );
}
