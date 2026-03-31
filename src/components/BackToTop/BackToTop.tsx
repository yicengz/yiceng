"use client";

import { useState, useEffect } from "react";
import { Button } from "antd";
import { UpOutlined } from "@ant-design/icons";
import styles from "./BackToTop.module.scss";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      // 滚动超过 300px 显示按钮
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      type="primary"
      shape="circle"
      icon={<UpOutlined />}
      className={`${styles.backToTop} ${visible ? styles.visible : ""}`}
      onClick={scrollToTop}
      aria-label="返回顶部"
    />
  );
}
