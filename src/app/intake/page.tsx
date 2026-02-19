import type { Metadata } from "next";
import Link from "next/link";
import { books } from "@/lib/books";
import { podcasts, favoriteEpisodes } from "@/lib/podcasts";
import { channels, favoriteVideos } from "@/lib/watches";
import SectionSidebar from "@/components/SectionSidebar/SectionSidebar";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "汲取",
  description: "一层的书架、播客与影视 — 从世界汲取养分",
};

const sections = [
  { id: "bookshelf", label: "书架" },
  { id: "podcast", label: "播客" },
  { id: "watch", label: "影视" },
];

export default function IntakePage() {
  return (
    <div className={styles.page}>
      <SectionSidebar sections={sections} />

      <div className={styles.main}>
        {/* ===== 书架 ===== */}
        <section id="bookshelf" className={styles.section}>
          <h1 className={styles.sectionTitle}>书架</h1>
          <p className={styles.sectionSubtitle}>读过的书，留下的痕迹</p>

          <div className={styles.shelf}>
            {books.map((book) => {
              const inner = (
                <>
                  <span
                    className={styles.spine}
                    style={{ backgroundColor: book.color || "#8E867E" }}
                  />
                  <span className={styles.face}>
                    <span className={styles.bookTitle}>{book.title}</span>
                    <span className={styles.bookMeta}>
                      <span className={styles.bookAuthor}>{book.author}</span>
                      {book.publisher && (
                        <span className={styles.bookPublisher}>
                          {book.publisher}
                        </span>
                      )}
                    </span>
                    {book.format && (
                      <span className={styles.bookFormat}>{book.format}</span>
                    )}
                  </span>
                </>
              );

              return book.noteSlug ? (
                <Link
                  key={book.title}
                  href={`/blog/${book.noteSlug}`}
                  className={`${styles.book} ${styles.hasNote}`}
                  title={book.comment}
                >
                  {inner}
                  <span className={styles.noteHint}>读书笔记</span>
                </Link>
              ) : (
                <div
                  key={book.title}
                  className={styles.book}
                  title={book.comment}
                >
                  {inner}
                </div>
              );
            })}
          </div>
          <div className={styles.shelfLine} />
        </section>

        {/* ===== 播客 ===== */}
        <section id="podcast" className={styles.section}>
          <h1 className={styles.sectionTitle}>播客</h1>
          <p className={styles.sectionSubtitle}>
            耳朵里的世界，通勤路上的陪伴
          </p>

          <h2 className={styles.subTitle}>在听的节目</h2>
          <div className={styles.podcastList}>
            {podcasts.map((p) => (
              <div key={p.name} className={styles.podcastCard}>
                <div className={styles.podcastInfo}>
                  <span className={styles.podcastName}>
                    {p.name}
                    {p.host && (
                      <span className={styles.podcastHost}>{p.host}</span>
                    )}
                  </span>
                  <span className={styles.podcastDesc}>{p.description}</span>
                </div>
                <div className={styles.podcastLinks}>
                  {p.links.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.platformLink}
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {favoriteEpisodes.length > 0 && (
            <>
              <h2 className={styles.subTitle}>喜欢的单集</h2>
              <div className={styles.episodeList}>
                {favoriteEpisodes.map((ep) => (
                  <div key={ep.title} className={styles.episodeCard}>
                    <span className={styles.episodeTag}>{ep.episode}</span>
                    {ep.url ? (
                      <a
                        href={ep.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.episodeTitle}
                      >
                        {ep.title}
                      </a>
                    ) : (
                      <span className={styles.episodeTitle}>{ep.title}</span>
                    )}
                    <span className={styles.episodeComment}>{ep.comment}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* ===== 影视 ===== */}
        <section id="watch" className={styles.section}>
          <h1 className={styles.sectionTitle}>影视</h1>
          <p className={styles.sectionSubtitle}>
            屏幕里的故事，值得被记住的画面
          </p>

          <h2 className={styles.subTitle}>常看的频道</h2>
          <div className={styles.channelList}>
            {channels.map((ch) => (
              <a
                key={ch.name}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.channelCard}
              >
                <span className={styles.channelName}>
                  {ch.name}
                  <span className={styles.channelPlatform}>
                    {ch.platform}
                  </span>
                </span>
                <span className={styles.channelDesc}>{ch.description}</span>
              </a>
            ))}
          </div>

          {favoriteVideos.length > 0 && (
            <>
              <h2 className={styles.subTitle}>喜欢的内容</h2>
              <div className={styles.episodeList}>
                {favoriteVideos.map((v) => (
                  <div key={v.title} className={styles.episodeCard}>
                    <span className={styles.episodeTag}>{v.channel}</span>
                    {v.url ? (
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.episodeTitle}
                      >
                        {v.title}
                      </a>
                    ) : (
                      <span className={styles.episodeTitle}>{v.title}</span>
                    )}
                    <span className={styles.episodeComment}>{v.comment}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
