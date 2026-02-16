"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.scss";

const navItems = [
  { label: "首页", href: "/" },
  { label: "文字", href: "/blog" },
  { label: "去过", href: "/journey" },
  { label: "关于", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          一层
        </Link>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${
                pathname.startsWith(item.href) && (item.href !== "/" || pathname === "/")
                  ? styles.active
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
