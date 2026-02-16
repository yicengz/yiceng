import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag } from "antd";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPostSlugs, getPostBySlug } from "@/lib/content";
import styles from "./page.module.scss";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <time className={styles.date}>{post.date}</time>
          <span className={styles.readingTime}>{post.readingTime}</span>
        </div>
        <div className={styles.tags}>
          <Tag color="orange">{post.category}</Tag>
          {post.source && <Tag style={{ borderStyle: "dashed" }}>{post.source}</Tag>}
          {post.tags.map((tag) => (
            <Tag key={tag} color="default">
              {tag}
            </Tag>
          ))}
        </div>
      </header>
      <div className={styles.content}>
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
