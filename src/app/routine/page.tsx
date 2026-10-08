import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllRoutinesMeta, getRoutineBySlug } from "@/lib/routine";
import RoutineExplorer, {
  type RoutineEntry,
} from "@/components/RoutineExplorer/RoutineExplorer";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "起居",
  description: "日常做的事 —— 看的、读的、听的、走过的",
};

export default async function RoutinePage() {
  const metas = await getAllRoutinesMeta();

  const entries: RoutineEntry[] = await Promise.all(
    metas.map(async (meta) => {
      if (!meta.hasContent) return { meta, preview: null };
      const full = await getRoutineBySlug(meta.slug);
      return {
        meta,
        preview: full ? <MDXRemote source={full.content} /> : null,
      };
    })
  );

  return (
    <div className={styles.page}>
      {metas.length === 0 ? (
        <p className={styles.empty}>还没有记录。</p>
      ) : (
        <RoutineExplorer entries={entries} />
      )}
    </div>
  );
}
