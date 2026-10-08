"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import type { RoutineMeta } from "@/lib/constants";
import { ROUTINE_TYPE_LABEL } from "@/lib/constants";
import NameNotes from "@/components/NameNotes/NameNotes";
import styles from "./RoutineExplorer.module.scss";

export interface RoutineEntry {
  meta: RoutineMeta;
  preview: ReactNode | null;
}

const NAME_ALTERNATIVES = [
  { name: "足迹", note: "最直白，但过于常见" },
  { name: "心迹", note: "偏内在，跟外部行为记录不完全契合" },
  { name: "见闻", note: "文学感强，留给未来的『汲取』改名" },
  { name: "日常", note: "太常见，缺个性" },
];

export default function RoutineExplorer({
  entries,
}: {
  entries: RoutineEntry[];
}) {
  const firstWithContent =
    entries.find((e) => e.meta.hasContent)?.meta.slug ?? null;
  const [activeSlug, setActiveSlug] = useState<string | null>(firstWithContent);
  const [displayedSlug, setDisplayedSlug] = useState<string | null>(
    firstWithContent
  );
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (activeSlug === displayedSlug) return;
    setFading(true);
    const t = setTimeout(() => {
      setDisplayedSlug(activeSlug);
      setFading(false);
    }, 160);
    return () => clearTimeout(t);
  }, [activeSlug, displayedSlug]);

  const displayedEntry = entries.find((e) => e.meta.slug === displayedSlug);

  return (
    <div className={styles.explorer}>
      <div className={styles.left}>
        <header className={styles.hero}>
          <h1 className={styles.title}>
            起居
            <NameNotes alternatives={NAME_ALTERNATIVES} />
          </h1>
          <p className={styles.subtitle}>
            汉代有起居注，逐日记录一个人做了什么。这里也是。
          </p>
        </header>

        <div className={styles.timeline}>
          {entries.map(({ meta }, index) => {
            const isActive = activeSlug === meta.slug;
            const inner = (
              <>
                <div className={styles.time}>
                  <span className={styles.date}>{meta.date}</span>
                </div>
                <div className={styles.axis}>
                  <span
                    className={`${styles.dot} ${styles[`dot-${meta.type}`]}`}
                  />
                  {index < entries.length - 1 && (
                    <span className={styles.line} />
                  )}
                </div>
                <div className={styles.content}>
                  <div className={styles.titleRow}>
                    <h3 className={styles.itemTitle}>{meta.title}</h3>
                    <span
                      className={`${styles.typeTag} ${styles[`tag-${meta.type}`]}`}
                    >
                      {ROUTINE_TYPE_LABEL[meta.type]}
                    </span>
                  </div>
                  {meta.summary && (
                    <p className={styles.summary}>{meta.summary}</p>
                  )}
                </div>
              </>
            );

            const className = [
              styles.item,
              isActive ? styles.itemActive : "",
              !meta.hasContent ? styles.itemInert : "",
            ]
              .filter(Boolean)
              .join(" ");
            const style = { animationDelay: `${index * 0.06}s` };
            const onMouseEnter = () => setActiveSlug(meta.slug);

            if (!meta.hasContent) {
              return (
                <div
                  key={meta.slug}
                  className={className}
                  style={style}
                  onMouseEnter={onMouseEnter}
                >
                  {inner}
                </div>
              );
            }

            return (
              <Link
                key={meta.slug}
                href={`/routine/${meta.slug}`}
                className={className}
                style={style}
                onMouseEnter={onMouseEnter}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>

      <aside className={styles.preview}>
        <div
          className={`${styles.previewInner} ${fading ? styles.previewFading : ""}`}
        >
          {displayedEntry?.preview ? (
            <>
              <div className={styles.previewHeader}>
                <h2 className={styles.previewTitle}>
                  {displayedEntry.meta.title}
                </h2>
                <div className={styles.previewMeta}>
                  <time>{displayedEntry.meta.date}</time>
                  <span
                    className={`${styles.typeTag} ${styles[`tag-${displayedEntry.meta.type}`]}`}
                  >
                    {ROUTINE_TYPE_LABEL[displayedEntry.meta.type]}
                  </span>
                </div>
                {displayedEntry.meta.summary && (
                  <p className={styles.previewSummary}>
                    {displayedEntry.meta.summary}
                  </p>
                )}
              </div>
              <div className={styles.previewBody}>{displayedEntry.preview}</div>
            </>
          ) : displayedEntry ? (
            <p className={styles.previewEmpty}>此条暂无正文</p>
          ) : (
            <p className={styles.previewEmpty}>把光标放到左侧标题上看细节</p>
          )}
        </div>
      </aside>
    </div>
  );
}
