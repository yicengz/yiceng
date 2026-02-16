import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag } from "antd";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllJourneySlugs, getJourneyBySlug } from "@/lib/journey";
import styles from "./page.module.scss";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllJourneySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const journey = getJourneyBySlug(slug);
  if (!journey) return {};
  return {
    title: `${journey.title} - 去过`,
    description: journey.summary,
  };
}

function formatDateRange(start: string, end: string) {
  if (!end) return start;
  if (start.slice(0, 7) === end.slice(0, 7)) return start;
  return `${start} ~ ${end}`;
}

export default async function JourneyDetailPage({ params }: Props) {
  const { slug } = await params;
  const journey = getJourneyBySlug(slug);

  if (!journey) {
    notFound();
  }

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{journey.title}</h1>
        <div className={styles.meta}>
          <span className={styles.location}>{journey.location}</span>
          <time className={styles.date}>
            {formatDateRange(journey.startDate, journey.endDate)}
          </time>
          <Tag
            color={journey.type === "milestone" ? "purple" : "orange"}
          >
            {journey.type === "milestone" ? "里程碑" : "旅行"}
          </Tag>
        </div>
      </header>
      <div className={styles.content}>
        <MDXRemote source={journey.content} />
      </div>
    </article>
  );
}
