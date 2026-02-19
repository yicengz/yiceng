import type { Metadata } from "next";
import { getAllPostsMeta } from "@/lib/content";
import { getAllJourneysMeta } from "@/lib/journey";
import BlogList from "@/app/blog/BlogList";
import Timeline from "@/components/Timeline/Timeline";
import SectionSidebar from "@/components/SectionSidebar/SectionSidebar";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "留痕",
  description: "一层的文字与足迹 — 笔下与脚下的痕迹",
};

const sections = [
  { id: "writing", label: "文字" },
  { id: "journey", label: "去过" },
];

export default function TracePage() {
  const posts = getAllPostsMeta();
  const journeys = getAllJourneysMeta();

  return (
    <div className={styles.page}>
      <SectionSidebar sections={sections} />

      <div className={styles.main}>
        {/* ===== 文字 ===== */}
        <section id="writing" className={styles.section}>
          <h1 className={styles.sectionTitle}>文字</h1>
          <p className={styles.sectionSubtitle}>
            落笔成痕，慢慢写，慢慢沉淀
          </p>
          <BlogList posts={posts} />
        </section>

        {/* ===== 去过 ===== */}
        <section id="journey" className={styles.section}>
          <h1 className={styles.sectionTitle}>去过</h1>
          <p className={styles.sectionSubtitle}>
            走过的路，脚下的每一步都算数
          </p>
          {journeys.length === 0 ? (
            <p className={styles.empty}>还没有记录，但路一直在脚下。</p>
          ) : (
            <Timeline items={journeys} />
          )}
        </section>
      </div>
    </div>
  );
}
