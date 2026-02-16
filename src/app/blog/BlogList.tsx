"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Button } from "antd";
import type { PostMeta, PostCategory } from "@/lib/constants";
import { POST_CATEGORIES } from "@/lib/constants";
import PostCard from "@/components/PostCard/PostCard";
import styles from "./page.module.scss";

interface Props {
  posts: PostMeta[];
}

export default function BlogList({ posts }: Props) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("全部");

  const filteredPosts =
    activeCategory === "全部"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  // 置顶文章排前面，其余按日期倒序（已在服务端排好）
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const handleRandomWalk = () => {
    if (posts.length === 0) return;
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    router.push(`/blog/${randomPost.slug}`);
  };

  const tabItems = [
    { key: "全部", label: "全部" },
    ...POST_CATEGORIES.map((cat: PostCategory) => ({
      key: cat,
      label: cat,
    })),
  ];

  return (
    <>
      <div className={styles.toolbar}>
        <Tabs
          activeKey={activeCategory}
          onChange={setActiveCategory}
          items={tabItems}
          className={styles.tabs}
        />
        <Button onClick={handleRandomWalk} className={styles.randomBtn}>
          随机漫步
        </Button>
      </div>
      {sortedPosts.length === 0 ? (
        <p className={styles.empty}>这个分类暂时还没有文章，敬请期待。</p>
      ) : (
        <div className={styles.postList}>
          {sortedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
