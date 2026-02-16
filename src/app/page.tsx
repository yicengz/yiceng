import Link from "next/link";
import { Button } from "antd";
import { getAllPostsMeta } from "@/lib/content";
import PostCard from "@/components/PostCard/PostCard";
import styles from "./page.module.scss";

export default function HomePage() {
  const posts = getAllPostsMeta().slice(0, 5);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.greeting}>你好，我是一层</h1>
        <p className={styles.intro}>
          数据仓库工程师，喜欢用代码梳理混沌，用文字记录生活。
          <br />
          这里是我的数字花园，欢迎随意逛逛。
        </p>
        <div className={styles.actions}>
          <Link href="/blog">
            <Button type="primary" size="large">
              阅读文字
            </Button>
          </Link>
          <Link href="/about">
            <Button size="large">了解更多</Button>
          </Link>
        </div>
      </section>

      {/* Recent Posts */}
      {posts.length > 0 && (
        <section className={styles.recentPosts}>
          <h2 className={styles.sectionTitle}>最新文字</h2>
          <div className={styles.postList}>
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <div className={styles.viewAll}>
            <Link href="/blog">
              <Button type="link">查看全部文章 &rarr;</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
