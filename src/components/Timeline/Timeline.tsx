import Link from "next/link";
import type { JourneyMeta } from "@/lib/constants";
import styles from "./Timeline.module.scss";

function formatDateRange(start: string, end: string) {
  if (!end) return start;
  // 同年同月则简写
  if (start.slice(0, 7) === end.slice(0, 7)) return start;
  return `${start} ~ ${end}`;
}

export default function Timeline({ items }: { items: JourneyMeta[] }) {
  return (
    <div className={styles.timeline}>
      {items.map((item, index) => (
        <Link
          key={item.slug}
          href={`/journey/${item.slug}`}
          className={styles.item}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* 左侧时间 */}
          <div className={styles.time}>
            <span className={styles.date}>
              {formatDateRange(item.startDate, item.endDate)}
            </span>
            {item.location && (
              <span className={styles.location}>{item.location}</span>
            )}
          </div>

          {/* 中间轴线 */}
          <div className={styles.axis}>
            <span
              className={`${styles.dot} ${
                item.type === "milestone" ? styles.milestone : styles.travel
              }`}
            />
            {index < items.length - 1 && <span className={styles.line} />}
          </div>

          {/* 右侧内容 */}
          <div className={styles.content}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{item.title}</h3>
              <span
                className={`${styles.typeTag} ${
                  item.type === "milestone"
                    ? styles.milestoneTag
                    : styles.travelTag
                }`}
              >
                {item.type === "milestone" ? "里程碑" : "旅行"}
              </span>
            </div>
            {item.summary && (
              <p className={styles.summary}>{item.summary}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
