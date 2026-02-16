import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} 一层 &middot; 用心记录，温暖前行
        </p>
      </div>
    </footer>
  );
}
