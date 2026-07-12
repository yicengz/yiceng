import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag } from "antd";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllRoutineSlugs, getRoutineBySlug } from "@/lib/routine";
import { ROUTINE_TYPE_LABEL } from "@/lib/constants";
import styles from "./page.module.scss";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllRoutineSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const routine = getRoutineBySlug(slug);
  if (!routine) return {};
  return {
    title: `${routine.title} - 起居`,
    description: routine.summary,
  };
}

const TYPE_COLOR: Record<string, string> = {
  movie: "blue",
  tv: "purple",
  book: "gold",
  podcast: "magenta",
  place: "green",
  writing: "default",
  other: "default",
};

export default async function RoutineDetailPage({ params }: Props) {
  const { slug } = await params;
  const routine = getRoutineBySlug(slug);

  if (!routine) {
    notFound();
  }

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{routine.title}</h1>
        <div className={styles.meta}>
          <time className={styles.date}>{routine.date}</time>
          <Tag color={TYPE_COLOR[routine.type] || "default"}>
            {ROUTINE_TYPE_LABEL[routine.type]}
          </Tag>
          {routine.link && (
            <a
              href={routine.link}
              className={styles.link}
              target={routine.link.startsWith("http") ? "_blank" : undefined}
              rel={
                routine.link.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              延伸阅读 →
            </a>
          )}
        </div>
        {routine.summary && (
          <p className={styles.summary}>{routine.summary}</p>
        )}
      </header>
      {routine.content.trim() && (
        <div className={styles.content}>
          <MDXRemote source={routine.content} />
        </div>
      )}
    </article>
  );
}
