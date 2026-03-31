"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (pathname) {
      // 路由变化时触发动画
      setIsTransitioning(true);
      
      // 短暂延迟后更新内容
      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timeout);
    }
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
