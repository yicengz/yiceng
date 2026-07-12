import Link from "next/link";
import type { RoutineMeta } from "@/lib/constants";
import { ROUTINE_TYPE_LABEL } from "@/lib/constants";
import styles from "./RoutineTimeline.module.scss";

export default function RoutineTimeline({ items }: { items: RoutineMeta[] }) {
  return (
    <div className={styles.timeline}>
      {items.map((item, index) => (
        <Link
          key={item.slug}
          href={`/routine/${item.slug}`}
          className={styles.item}
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <div className={styles.time}>
            <span className={styles.date}>{item.date}</span>
          </div>

          <div className={styles.axis}>
            <span
              className={`${styles.dot} ${styles[`dot-${item.type}`]}`}
            />
            {index < items.length - 1 && <span className={styles.line} />}
          </div>

          <div className={styles.content}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{item.title}</h3>
              <span
                className={`${styles.typeTag} ${styles[`tag-${item.type}`]}`}
              >
                {ROUTINE_TYPE_LABEL[item.type]}
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
