"use client";

import { useState, useEffect } from "react";
import styles from "./BackToTop.module.scss";

const chevrons = [
  { baseOpacity: 0.18, delay: "0.4s" }, // 顶部，最后亮
  { baseOpacity: 0.32, delay: "0.2s" }, // 中间
  { baseOpacity: 0.52, delay: "0s"   }, // 底部，最先亮
];

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className={`${styles.wrapper} ${visible ? styles.visible : ""}`}>
      {/* 圆形主按钮 */}
      <button className={styles.btn} onClick={scrollToTop} aria-label="返回顶部">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M2 9.5L7 4L12 9.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 右侧箭头组，光从底部向顶部流动 */}
      <div className={styles.arrowTrail} aria-hidden>
        {chevrons.map((c, i) => (
          <svg
            key={i}
            className={styles.chevron}
            width="10"
            height="7"
            viewBox="0 0 10 7"
            fill="none"
            style={{
              "--base-opacity": c.baseOpacity,
              "--peak-opacity": Math.min(c.baseOpacity + 0.28, 0.85),
              animationDelay: c.delay,
            } as React.CSSProperties}
          >
            <path
              d="M1 6L5 1.5L9 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}
