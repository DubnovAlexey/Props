// «Свитки Графа» — теория для тех, кто хочет просто читать, со схемами.
//   #library            — оглавление: свитки пещер и полное руководство;
//   #library-<пещера>   — конспект пещеры + связанные разделы руководства;
//   #library-sNN        — раздел полного руководства целиком.
// Разделы руководства грузятся по требованию (import.meta.glob): основной
// код приложения не толстеет. Promise раздела создаётся заранее и кэшируется,
// а use() + Suspense ждут его — живой пример из пещеры «Подземная река».
// Перевод свитков: заголовки разделов и подписи схем — в накладке языка (useContent().LIBRARY),
// сами разделы — в src/content/i18n/<язык>/library/sNN.md. Чего нет в переводе, то показывается по-русски.
import { Suspense, use, useEffect, useMemo } from 'react';
import RU_SECTIONS from '../../content/library/sections.json';
import Guardian from '../../mascot/guardians/Guardian.jsx';
import LessonCard from '../chapter/LessonCard.jsx';
import NotFound from '../../app/NotFound.jsx';
import MarkdownView from './MarkdownView.jsx';
import { to } from '../../app/useHashRoute.js';
import { useMascot } from '../../mascot/MascotContext.jsx';

import styles from './Library.module.css';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';

const LOADERS = import.meta.glob(['../../content/library/sections/*.md', '../../content/i18n/*/library/*.md'], {
  query: '?raw',
  import: 'default',
});
const cache = new Map();

/** Где лежит текст раздела на этом языке; перевода нет — русский оригинал */
const sectionPath = (id, lang) => {
  const translated = `../../content/i18n/${lang}/library/${id}.md`;
  return LOADERS[translated] ? translated : `../../content/library/sections/${id}.md`;
};

/** Promise с текстом раздела: один на раздел и язык, создаётся при первом запросе */
function loadSection(id, lang) {
  const path = sectionPath(id, lang);
  if (!cache.has(path)) {
    const promise = LOADERS[path]();
    // Не удалось загрузить (пропала сеть) — забываем неудачную попытку,
    // чтобы после «Попробовать ещё раз» раздел загрузился заново
    promise.catch(() => cache.delete(path));
    cache.set(path, promise);
  }
  return cache.get(path);
}

/** Оглавление руководства на языке игры: заголовки — из накладки, остальное — из оригинала */
function useSections() {
  const { LIBRARY } = useContent();
  return useMemo(() => RU_SECTIONS.map((section) => ({ ...section, title: LIBRARY?.titles?.[section.id] ?? section.title })), [LIBRARY]);
}

/** Граф говорит реплику при входе на страницу свитков */
function useGrafSays(text) {
  const { say } = useMascot();
  useEffect(() => {
    say(text, 'talk');
  }, [say, text]);
}

const minutes = (size) => Math.max(1, Math.round(size / 1100));

function SectionText({ id }) {
  const { lang } = useI18n();
  const markdown = use(loadSection(id, lang));
  return <MarkdownView markdown={markdown} />;
}

function Loading() {
  const { t } = useI18n();
  return <p className="muted">{t('loading.scroll')}</p>;
}

function LibraryIndex() {
  const { t } = useI18n();
  const { CHAPTERS } = useContent();
  const SECTIONS = useSections();
  useGrafSays(t('mascot.route.library'));
  return (
    <div className="stack">
      <header>
        <span className="eyebrow">{t('library.eyebrow')}</span>
        <BloodTitle>{t('library.title')}</BloodTitle>
        <p className="muted">{t('library.intro')}</p>
      </header>

      <section>
        <h2>{t('library.cavesTitle')}</h2>
        <ul className={styles.caves}>
          {CHAPTERS.map((chapter) => (
            <li key={chapter.id} style={{ '--cave': chapter.color }}>
              <a className={styles.caveLink} href={to.library(chapter.id)}>
                <Guardian id={chapter.id} size={46} />
                <span>
                  <span className={styles.caveMeta}>
                    {chapter.order}. {chapter.cave}
                  </span>
                  <b>{chapter.title}</b>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t('library.guideTitle')}</h2>
        <ol className={styles.sections}>
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a href={to.library(section.id)}>
                <span className={styles.num}>{section.num}</span>
                <span className={styles.sectionTitle}>{section.title}</span>
                <span className={styles.time}>{t('common.minutes', { n: minutes(section.size) })}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function CaveScroll({ chapter }) {
  const { t } = useI18n();
  const { CHAPTERS } = useContent();
  const SECTIONS = useSections();
  const related = SECTIONS.filter((section) => section.caves.includes(chapter.id));
  const index = CHAPTERS.indexOf(chapter);
  const prev = CHAPTERS[index - 1];
  const next = CHAPTERS[index + 1];
  const { guardian } = chapter.story;
  useGrafSays(t('library.caveSays', { cave: chapter.cave }));

  return (
    <div className={styles.scroll} style={{ '--cave': chapter.color }}>
      <a href={to.library()} className={styles.back}>
        {t('library.all')}
      </a>
      <header className={styles.scrollHead}>
        <Guardian id={chapter.id} size={72} label={`${guardian.kind} ${guardian.name}`} />
        <div>
          <span className="eyebrow">{t('library.caveEyebrow', { order: chapter.order, cave: chapter.cave })}</span>
          <BloodTitle>{chapter.title}</BloodTitle>
          <p className="muted">{chapter.goal}</p>
        </div>
      </header>

      <h2>{t('library.summary')}</h2>
      {chapter.lesson.map((card, i) => (
        <LessonCard key={card.title} card={card} index={i} total={chapter.lesson.length} />
      ))}

      {related.length > 0 && (
        <section className="stack">
          <h2>{t('library.fromGuide')}</h2>
          {related.map((section) => (
            <article key={section.id} className={`card ${styles.article}`}>
              <span className="eyebrow">{t('library.section', { num: section.num })}</span>
              <h3 className={styles.articleTitle}>{section.title}</h3>
              <Suspense fallback={<Loading />}>
                <SectionText id={section.id} />
              </Suspense>
            </article>
          ))}
        </section>
      )}

      <nav className={styles.pager} aria-label={t('library.neighbours')}>
        {prev ? <a href={to.library(prev.id)}>← {prev.cave}</a> : <span />}
        <a className="btn btn-primary" href={to.chapter(chapter.id)}>
          {t('library.train')}
        </a>
        {next ? <a href={to.library(next.id)}>{next.cave} →</a> : <span />}
      </nav>
    </div>
  );
}

function SectionScroll({ section }) {
  const { t } = useI18n();
  const { CHAPTER_MAP } = useContent();
  const SECTIONS = useSections();
  const index = SECTIONS.findIndex((item) => item.id === section.id);
  const prev = SECTIONS[index - 1];
  const next = SECTIONS[index + 1];
  const caves = section.caves.map((id) => CHAPTER_MAP[id]).filter(Boolean);
  useGrafSays(t('library.sectionSays', { num: section.num, title: section.title }));

  return (
    <div className={styles.scroll}>
      <a href={to.library()} className={styles.back}>
        {t('library.all')}
      </a>
      <header>
        <span className="eyebrow">
          {t('library.sectionEyebrow', {
            num: section.num,
            total: SECTIONS.length,
            minutes: t('common.minutes', { n: minutes(section.size) }),
          })}
        </span>
        <BloodTitle>{section.title}</BloodTitle>
        {caves.length > 0 && (
          <div className="row small">
            <span className="muted">{t('library.trainLabel')}</span>
            {caves.map((chapter) => (
              <a key={chapter.id} className="chip" href={to.chapter(chapter.id)}>
                {chapter.icon} {chapter.cave}
              </a>
            ))}
          </div>
        )}
      </header>
      <article className={`card ${styles.article}`}>
        <Suspense fallback={<Loading />}>
          <SectionText id={section.id} />
        </Suspense>
      </article>
      <nav className={styles.pager} aria-label={t('library.neighbourSections')}>
        {prev ? (
          <a href={to.library(prev.id)}>
            ← {prev.num}. {prev.title}
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a href={to.library(next.id)}>
            {next.num}. {next.title} →
          </a>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

export default function LibraryPage({ topic }) {
  const { CHAPTER_MAP } = useContent();
  const SECTIONS = useSections();
  if (!topic) return <LibraryIndex />;
  if (CHAPTER_MAP[topic]) return <CaveScroll chapter={CHAPTER_MAP[topic]} />;
  const section = SECTIONS.find((item) => item.id === topic);
  if (section) return <SectionScroll section={section} />;
  return <NotFound />;
}
