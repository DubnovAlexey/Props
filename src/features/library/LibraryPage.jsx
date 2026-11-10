// «Свитки Графа» — теория для тех, кто хочет просто читать, со схемами.
//   #library            — оглавление: свитки пещер и полное руководство;
//   #library-<пещера>   — конспект пещеры + связанные разделы руководства;
//   #library-sNN        — раздел полного руководства целиком.
// Разделы руководства грузятся по требованию (import.meta.glob): основной
// код приложения не толстеет. Promise раздела создаётся заранее и кэшируется,
// а use() + Suspense ждут его — живой пример из пещеры «Подземная река».
import { Suspense, use, useEffect } from 'react';
import { CHAPTERS, CHAPTER_MAP } from '../../content/chapters/index.js';
import SECTIONS from '../../content/library/sections.json';
import Guardian from '../../mascot/guardians/Guardian.jsx';
import LessonCard from '../chapter/LessonCard.jsx';
import NotFound from '../../app/NotFound.jsx';
import MarkdownView from './MarkdownView.jsx';
import { to } from '../../app/useHashRoute.js';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { PHRASES } from '../../mascot/phrases.js';
import styles from './Library.module.css';

const LOADERS = import.meta.glob('../../content/library/sections/*.md', { query: '?raw', import: 'default' });
const cache = new Map();

/** Promise с текстом раздела: один на раздел, создаётся при первом запросе */
function loadSection(id) {
  if (!cache.has(id)) {
    const promise = LOADERS[`../../content/library/sections/${id}.md`]();
    // Не удалось загрузить (пропала сеть) — забываем неудачную попытку,
    // чтобы после «Попробовать ещё раз» раздел загрузился заново
    promise.catch(() => cache.delete(id));
    cache.set(id, promise);
  }
  return cache.get(id);
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
  const markdown = use(loadSection(id));
  return <MarkdownView markdown={markdown} />;
}

function Loading() {
  return <p className="muted">🕯️ Граф разворачивает свиток…</p>;
}

function LibraryIndex() {
  useGrafSays(PHRASES.route.library);
  return (
    <div className="stack">
      <header>
        <span className="eyebrow">Свитки Графа</span>
        <h1>Теория со схемами</h1>
        <p className="muted">
          Для тех, кто хочет просто прочитать. Свитки разложены по пещерам — по тем же темам, что и в игре. А ниже — полное руководство по
          пропсам целиком, по разделам.
        </p>
      </header>

      <section>
        <h2>Свитки пещер</h2>
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
        <h2>Полное руководство по пропсам</h2>
        <ol className={styles.sections}>
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a href={to.library(section.id)}>
                <span className={styles.num}>{section.num}</span>
                <span className={styles.sectionTitle}>{section.title}</span>
                <span className={styles.time}>{minutes(section.size)} мин</span>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function CaveScroll({ chapter }) {
  const related = SECTIONS.filter((section) => section.caves.includes(chapter.id));
  const index = CHAPTERS.indexOf(chapter);
  const prev = CHAPTERS[index - 1];
  const next = CHAPTERS[index + 1];
  const { guardian } = chapter.story;
  useGrafSays(`Свиток пещеры «${chapter.cave}»: конспект без заданий. Захочешь проверить себя — спускайся в пещеру.`);

  return (
    <div className={styles.scroll} style={{ '--cave': chapter.color }}>
      <a href={to.library()} className={styles.back}>
        ← Все свитки
      </a>
      <header className={styles.scrollHead}>
        <Guardian id={chapter.id} size={72} label={`${guardian.kind} ${guardian.name}`} />
        <div>
          <span className="eyebrow">
            Свиток пещеры {chapter.order} · {chapter.cave}
          </span>
          <h1>{chapter.title}</h1>
          <p className="muted">{chapter.goal}</p>
        </div>
      </header>

      <h2>Конспект пещеры</h2>
      {chapter.lesson.map((card, i) => (
        <LessonCard key={card.title} card={card} index={i} total={chapter.lesson.length} />
      ))}

      {related.length > 0 && (
        <section className="stack">
          <h2>Из полного руководства</h2>
          {related.map((section) => (
            <article key={section.id} className={`card ${styles.article}`}>
              <span className="eyebrow">Раздел {section.num}</span>
              <h3 className={styles.articleTitle}>{section.title}</h3>
              <Suspense fallback={<Loading />}>
                <SectionText id={section.id} />
              </Suspense>
            </article>
          ))}
        </section>
      )}

      <nav className={styles.pager} aria-label="Соседние свитки">
        {prev ? <a href={to.library(prev.id)}>← {prev.cave}</a> : <span />}
        <a className="btn btn-primary" href={to.chapter(chapter.id)}>
          ⚔️ В пещеру — тренироваться
        </a>
        {next ? <a href={to.library(next.id)}>{next.cave} →</a> : <span />}
      </nav>
    </div>
  );
}

function SectionScroll({ section }) {
  const index = SECTIONS.indexOf(section);
  const prev = SECTIONS[index - 1];
  const next = SECTIONS[index + 1];
  const caves = section.caves.map((id) => CHAPTER_MAP[id]).filter(Boolean);
  useGrafSays(`Полное руководство, раздел ${section.num}: «${section.title}».`);

  return (
    <div className={styles.scroll}>
      <a href={to.library()} className={styles.back}>
        ← Все свитки
      </a>
      <header>
        <span className="eyebrow">
          Полное руководство · раздел {section.num} из {SECTIONS.length} · {minutes(section.size)} мин
        </span>
        <h1>{section.title}</h1>
        {caves.length > 0 && (
          <div className="row small">
            <span className="muted">Тренироваться:</span>
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
      <nav className={styles.pager} aria-label="Соседние разделы">
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
  if (!topic) return <LibraryIndex />;
  if (CHAPTER_MAP[topic]) return <CaveScroll chapter={CHAPTER_MAP[topic]} />;
  const section = SECTIONS.find((item) => item.id === topic);
  if (section) return <SectionScroll section={section} />;
  return <NotFound />;
}
