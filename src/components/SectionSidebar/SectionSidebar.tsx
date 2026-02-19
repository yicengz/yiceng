"use client";

import { useEffect, useState } from "react";
import styles from "./SectionSidebar.module.scss";

export interface SidebarSection {
  id: string;
  label: string;
}

export default function SectionSidebar({
  sections,
}: {
  sections: SidebarSection[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(section.id);
          }
        },
        { rootMargin: "-20% 0px -60% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {sections.map((s) => (
          <button
            key={s.id}
            className={`${styles.link} ${
              activeId === s.id ? styles.active : ""
            }`}
            onClick={() => handleClick(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
