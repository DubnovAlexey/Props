// Бестиарий: все хозяева пещер на одной странице.
// Повторять по картинкам быстро: смотришь на чудище — вспоминаешь тему
// (двойное кодирование: образ + слово). Побеждённые хозяева тускнеют.
import { CHAPTERS } from '../../content/chapters/index.js';
import { useProgress } from '../../state/ProgressContext.jsx';
import Guardian from '../../mascot/guardians/Guardian.jsx';
import Vampire from '../../mascot/Vampire.jsx';
import { to } from '../../app/useHashRoute.js';
import styles from './Bestiary.module.css';

export default function BestiaryPage() {
  const { progress } = useProgress();
  const defeated = CHAPTERS.filter((chapter) => progress.chapters[chapter.id]?.done).length;

  return (
    <div className="stack">
      <header>
        <span className="eyebrow">Бестиарий</span>
        <h1>Хозяева пещер</h1>
        <p className="muted">
          У каждой пещеры свой хозяин, и его облик подсказывает тему. Повержено: <b>{defeated}</b> из <b>{CHAPTERS.length}</b>.
        </p>
      </header>

      <section className={`card ${styles.count}`}>
        <Vampire mood="idle" size={86} />
        <div>
          <span className="eyebrow">Повелитель всех пещер</span>
          <h2 className={styles.countName}>Граф Пропсула, вампир</h2>
          <p className="muted small">
            Учитель и главный хозяин. Ждёт в логове на последнее испытание: по заданию из каждой пещеры, без подсказок.
          </p>
          <a className="btn btn-small" href={to.exam()}>
            👑 Логово Графа
          </a>
        </div>
      </section>

      <ul className={styles.grid}>
        {CHAPTERS.map((chapter) => {
          const { guardian } = chapter.story;
          const done = progress.chapters[chapter.id]?.done;
          return (
            <li key={chapter.id} className={`card ${styles.item}`} style={{ '--cave': chapter.color }}>
              <a className={styles.link} href={to.chapter(chapter.id)}>
                <Guardian id={chapter.id} size={112} mood={done ? 'defeated' : 'idle'} label={`${guardian.kind} ${guardian.name}`} />
                <span className={styles.meta}>
                  Пещера {chapter.order} · {chapter.cave}
                </span>
                <b className={styles.name}>
                  {guardian.name}, {guardian.kind}
                </b>
                <span className={styles.topic}>{chapter.title}</span>
                <span className={styles.why}>{guardian.why}</span>
                <span className={styles.status}>{done ? '✓ повержен' : '⚔️ ждёт боя'}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
