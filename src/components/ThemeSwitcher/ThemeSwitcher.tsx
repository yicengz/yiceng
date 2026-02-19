"use client";

import { Popover } from "antd";
import { useTheme } from "@/theme/ThemeContext";
import { themes, type ThemeKey } from "@/theme/themes";
import styles from "./ThemeSwitcher.module.scss";

const themeOrder: ThemeKey[] = ["snow", "dustless", "sunrise", "nightink"];

export default function ThemeSwitcher() {
  const { themeKey, setTheme } = useTheme();
  const currentTheme = themes[themeKey];

  const content = (
    <div className={styles.options}>
      {themeOrder.map((key) => {
        const t = themes[key];
        return (
          <button
            key={key}
            className={`${styles.option} ${key === themeKey ? styles.active : ""}`}
            onClick={() => setTheme(key)}
          >
            <span
              className={styles.swatch}
              style={{ background: t.cssVars["--color-accent"] }}
            />
            <span className={styles.label}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="hover"
      placement="bottomRight"
      arrow={false}
    >
      <button className={styles.trigger} aria-label="切换主题">
        <span
          className={styles.dot}
          style={{ background: currentTheme.cssVars["--color-accent"] }}
        />
      </button>
    </Popover>
  );
}
