"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./CareerTimeline.module.scss";

interface CareerItem {
  time: string;
  company: string;
  note?: string;
  /** 公司 logo 路径，不填则用首字做 fallback */
  logo?: string;
  /** 是否为当前在职 */
  current?: boolean;
}

const mainCareer: CareerItem[] = [
  {
    time: "2023.10 - 至今",
    company: "字节跳动",
    logo: "/images/companies/bytedance.png",
    current: true,
  },
  {
    time: "2021.11",
    company: "携程",
    logo: "/images/companies/ctrip.png",
  },
  {
    time: "2020.05",
    company: "上海市大数据股份",
    logo: "/images/companies/shdata.png",
  },
];

const earlyCareer: CareerItem[] = [
  { time: "2019.09", company: "寻找母星有限公司" },
  { time: "2019.03", company: "海风教育", note: "实习转正" },
  { time: "2018.09", company: "数云信息科技有限公司", note: "实习" },
];

function CompanyIcon({ item }: { item: CareerItem }) {
  if (item.logo) {
    return (
      <Image
        src={item.logo}
        alt={item.company}
        width={20}
        height={20}
        className={styles.logo}
      />
    );
  }
  return <span className={styles.logoFallback}>{item.company[0]}</span>;
}

export default function CareerTimeline() {
  const [showEarly, setShowEarly] = useState(false);

  const items = showEarly ? [...mainCareer, ...earlyCareer] : mainCareer;

  return (
    <div className={styles.timeline}>
      {items.map((item, index) => (
        <div
          key={item.company}
          className={styles.item}
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <div className={styles.time}>
            <span className={styles.date}>{item.time}</span>
          </div>

          <div className={styles.axis}>
            <span
              className={`${styles.dot} ${
                item.current ? styles.current : styles.past
              }`}
            />
            {index < items.length - 1 && <span className={styles.line} />}
            {!showEarly && index === items.length - 1 && (
              <span className={styles.lineFade} />
            )}
          </div>

          <div className={styles.content}>
            <CompanyIcon item={item} />
            <span className={styles.company}>{item.company}</span>
            {item.current && (
              <span className={styles.currentTag}>在职</span>
            )}
            {item.note && (
              <span className={styles.note}>{item.note}</span>
            )}
          </div>
        </div>
      ))}

      {!showEarly && (
        <button
          className={styles.expandBtn}
          onClick={() => setShowEarly(true)}
        >
          更早的经历
        </button>
      )}
    </div>
  );
}
