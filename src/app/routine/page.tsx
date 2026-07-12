import type { Metadata } from "next";
import { getAllRoutinesMeta } from "@/lib/routine";
import RoutineTimeline from "@/components/RoutineTimeline/RoutineTimeline";
import NameNotes from "@/components/NameNotes/NameNotes";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "起居",
  description: "日常做的事 —— 看的、读的、听的、走过的",
};

const NAME_ALTERNATIVES = [
  { name: "足迹", note: "最直白，但过于常见" },
  { name: "心迹", note: "偏内在，跟外部行为记录不完全契合" },
  { name: "见闻", note: "文学感强，留给未来的『汲取』改名" },
  { name: "日常", note: "太常见，缺个性" },
];

export default function RoutinePage() {
  const routines = getAllRoutinesMeta();

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <header className={styles.hero}>
          <h1 className={styles.title}>
            起居
            <NameNotes alternatives={NAME_ALTERNATIVES} />
          </h1>
          <p className={styles.subtitle}>
            汉代有起居注，逐日记录一个人做了什么。这里也是。
          </p>
        </header>

        {routines.length === 0 ? (
          <p className={styles.empty}>还没有记录。</p>
        ) : (
          <RoutineTimeline items={routines} />
        )}
      </div>
    </div>
  );
}
