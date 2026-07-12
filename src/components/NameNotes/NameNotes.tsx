"use client";

import { Tooltip } from "antd";
import { BulbOutlined } from "@ant-design/icons";
import styles from "./NameNotes.module.scss";

export interface NameAlternative {
  name: string;
  note: string;
}

interface Props {
  alternatives: NameAlternative[];
  title?: string;
}

export default function NameNotes({
  alternatives,
  title = "曾考虑过的名字",
}: Props) {
  const content = (
    <div className={styles.tooltipInner}>
      <div className={styles.tooltipTitle}>{title}</div>
      <ul className={styles.list}>
        {alternatives.map((alt) => (
          <li key={alt.name}>
            <span className={styles.altName}>{alt.name}</span>
            <span className={styles.altNote}>— {alt.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Tooltip
      title={content}
      placement="right"
      classNames={{ root: styles.overlay }}
    >
      <span className={styles.trigger} aria-label="命名候选">
        <BulbOutlined />
      </span>
    </Tooltip>
  );
}
