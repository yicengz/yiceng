import type { Metadata } from "next";
import { Tag } from "antd";
import CareerTimeline from "./CareerTimeline";
import SectionSidebar from "@/components/SectionSidebar/SectionSidebar";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "关于",
  description: "关于一层 - 数据仓库工程师",
};

const skills = ["Hive", "Spark", "数仓建模"];

const sections = [
  { id: "career", label: "履历" },
  { id: "skills", label: "技能栈" },
  { id: "contact", label: "联系方式" },
  { id: "changelog", label: "更新日志" },
];

/*
 * ---- 保留但暂不展示的自我介绍 ----
 *
 * <section>
 *   <h1>关于我</h1>
 *   <p>你好，我是一层，一名数据仓库工程师。</p>
 *   <p>
 *     日常工作是和数据打交道——设计数仓架构、编写 ETL 管道、优化查询性能、保障数据质量。
 *     在数据的世界里，我享受将混沌梳理为秩序的过程。
 *   </p>
 *   <p>
 *     工作之外，我喜欢阅读、写字、偶尔拍拍照片。
 *     这个小站是我的数字花园，用来记录技术思考和生活感悟。
 *   </p>
 * </section>
 */

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <SectionSidebar sections={sections} />

      <div className={styles.main}>
        <h1 className={styles.title}>关于我</h1>

        <section id="career" className={styles.section}>
          <h2 className={styles.sectionTitle}>履历</h2>
          <CareerTimeline />
        </section>

        <section id="skills" className={styles.section}>
          <h2 className={styles.sectionTitle}>技能栈</h2>
          <div className={styles.skills}>
            {skills.map((skill) => (
              <Tag key={skill} className={styles.skillTag}>
                {skill}
              </Tag>
            ))}
          </div>
        </section>

        <section id="contact" className={styles.section}>
          <h2 className={styles.sectionTitle}>联系方式</h2>
          <p className={styles.contact}>
            如果你想和我聊聊数据、技术，或者任何有趣的事情，欢迎通过以下方式联系我：
          </p>
          <ul className={styles.contactList}>
            <li>GitHub: <a href="https://github.com/yicengz" target="_blank" rel="noopener noreferrer">github.com/yicengz</a></li>
            <li>Email: <a href="mailto:yiceng.zhuang@outlook.com">yiceng.zhuang@outlook.com</a></li>
            <li>微信公众号: 一层檐下</li>
          </ul>
        </section>

        <section id="changelog" className={styles.section}>
          <h2 className={styles.sectionTitle}>更新日志</h2>
          {/* TODO: 后续补充更新日志内容 */}
          <p className={styles.empty}>暂无内容，敬请期待。</p>
        </section>
      </div>
    </div>
  );
}
