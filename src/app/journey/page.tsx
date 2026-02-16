import type { Metadata } from "next";
import { getAllJourneysMeta } from "@/lib/journey";
import Timeline from "@/components/Timeline/Timeline";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "去过",
  description: "一层去过的地方，走过的路",
};

export default function JourneyPage() {
  const journeys = getAllJourneysMeta();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>去过</h1>
      <p className={styles.subtitle}>走过的路、到过的地方、经历的时刻</p>
      {journeys.length === 0 ? (
        <p className={styles.empty}>还没有记录，但路一直在脚下。</p>
      ) : (
        <Timeline items={journeys} />
      )}
    </div>
  );
}
