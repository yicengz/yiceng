"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import styles from "./Header.module.scss";

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  { label: "首页", href: "/" },
  {
    label: "留痕",
    href: "/trace",
    children: [
      { label: "文字", href: "/trace#writing" },
      { label: "去过", href: "/trace#journey" },
    ],
  },
  {
    label: "汲取",
    href: "/intake",
    children: [
      { label: "书架", href: "/intake#bookshelf" },
      { label: "播客", href: "/intake#podcast" },
      { label: "影视", href: "/intake#watch" },
    ],
  },
  {
    label: "关于",
    href: "/about",
    children: [
      { label: "履历", href: "/about#career" },
      { label: "技能栈", href: "/about#skills" },
      { label: "联系方式", href: "/about#contact" },
      { label: "更新日志", href: "/about#changelog" },
    ],
  },
];

/** "留痕"下的子路由也应高亮父级 */
const TRACE_ROUTES = ["/trace", "/blog", "/journey"];
const INTAKE_ROUTES = ["/intake"];
const ABOUT_ROUTES = ["/about"];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/trace") {
    return TRACE_ROUTES.some((r) => pathname.startsWith(r));
  }
  if (item.href === "/intake") {
    return INTAKE_ROUTES.some((r) => pathname.startsWith(r));
  }
  if (item.href === "/about") {
    return ABOUT_ROUTES.some((r) => pathname.startsWith(r));
  }
  if (item.href) {
    return item.href === "/"
      ? pathname === "/"
      : pathname.startsWith(item.href);
  }
  return false;
}

export default function Header() {
  const pathname = usePathname();
  const [showPreview, setShowPreview] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    timerRef.current = setTimeout(() => setShowPreview(true), 500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowPreview(false);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href="/"
          className={styles.logoGroup}
          onClick={() => {
            if (pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <span
            className={styles.avatarWrap}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src="/images/avatar.png"
              alt="头像"
              width={28}
              height={28}
              className={styles.avatar}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
            {showPreview && (
              <span
                className={styles.preview}
                onContextMenu={(e) => e.preventDefault()}
              >
                <Image
                  src="/images/avatar.png"
                  alt="头像"
                  width={300}
                  height={300}
                  className={styles.previewImg}
                  draggable={false}
                />
              </span>
            )}
          </span>
          <span className={styles.logoText}>一层</span>
        </Link>
        <div className={styles.right}>
          <nav className={styles.nav}>
            {navItems.map((item) => {
              const active = isActive(pathname, item);

              if (item.children) {
                return (
                  <div key={item.label} className={styles.dropdown}>
                    <Link
                      href={item.href!}
                      className={`${styles.navLink} ${active ? styles.active : ""}`}
                    >
                      {item.label}
                    </Link>
                    <div className={styles.dropdownMenu}>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={styles.dropdownItem}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`${styles.navLink} ${active ? styles.active : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
