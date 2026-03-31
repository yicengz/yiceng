import styles from "./Skeleton.module.scss";

interface PostCardSkeletonProps {
  count?: number;
}

export default function PostCardSkeleton({ count = 2 }: PostCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.cardSkeleton}>
          <div className={styles.meta}>
            <div className={`${styles.skeleton} ${styles.date}`} />
            <div className={`${styles.skeleton} ${styles.readingTime}`} />
          </div>
          <div className={`${styles.skeleton} ${styles.title}`} />
          <div className={styles.summary}>
            <div className={`${styles.skeleton} ${styles.line}`} />
            <div className={`${styles.skeleton} ${styles.lineShort}`} />
          </div>
          <div className={styles.tags}>
            <div className={`${styles.skeleton} ${styles.tag}`} />
            <div className={`${styles.skeleton} ${styles.tag}`} />
          </div>
        </div>
      ))}
    </>
  );
}
