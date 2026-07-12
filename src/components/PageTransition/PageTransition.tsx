"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./PageTransition.module.scss";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // 首次挂载（含刷新）不做淡出，避免闪一下已经渲染好的 SSR 内容
    if (prevPathnameRef.current === pathname) {
      setDisplayChildren(children);
      return;
    }
    prevPathnameRef.current = pathname;

    setIsTransitioning(true);
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timeout);
  }, [pathname, children]);

  return (
    <div
      className={`${styles.pageTransition} ${
        isTransitioning ? styles.exiting : styles.entering
      }`}
    >
      {displayChildren}
    </div>
  );
}
