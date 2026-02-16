import type { Metadata } from "next";
import { Tag } from "antd";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "关于",
  description: "关于一层 - 数据仓库工程师",
};

const skills = [
  "SQL",
  "Python",
  "Spark",
  "Hive",
  "Flink",
  "Airflow",
  "dbt",
  "Kafka",
  "ClickHouse",
  "Docker",
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>关于我</h1>
        <div className={styles.content}>
          <p>
            你好，我是一层，一名数据仓库工程师。
          </p>
          <p>
            日常工作是和数据打交道——设计数仓架构、编写 ETL 管道、优化查询性能、保障数据质量。
            在数据的世界里，我享受将混沌梳理为秩序的过程。
          </p>
          <p>
            工作之外，我喜欢阅读、写字、偶尔拍拍照片。
            这个小站是我的数字花园，用来记录技术思考和生活感悟。
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>技能栈</h2>
        <div className={styles.skills}>
          {skills.map((skill) => (
            <Tag key={skill} className={styles.skillTag}>
              {skill}
            </Tag>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>联系方式</h2>
        <p className={styles.contact}>
          如果你想和我聊聊数据、技术，或者任何有趣的事情，欢迎通过以下方式联系我：
        </p>
        <ul className={styles.contactList}>
          <li>GitHub: <a href="https://github.com" target="_blank" rel="noopener noreferrer">github.com/yiceng</a></li>
          <li>Email: hello@example.com</li>
        </ul>
      </section>
    </div>
  );
}
