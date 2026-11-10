// Склеп повторения. Здесь живут интервальные повторения (система Лейтнера):
// задачи с ошибками и карточки терминов всплывают тогда, когда их пора освежить.
// Задачи из разных пещер идут вперемешку — это «чередование»,
// оно учит различать темы, а не отвечать на автомате.
import { useEffect, useState } from 'react';
import { useProgress } from '../../state/ProgressContext.jsx';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { PHRASES } from '../../mascot/phrases.js';
import { TASK_MAP } from '../../content/chapters/index.js';
import { GLOSSARY, GLOSSARY_MAP } from '../../content/glossary.js';
import { BOX_NAMES, boxCounts, dueIds } from '../../utils/leitner.js';
import { shuffle } from '../../utils/random.js';
import PracticeRunner from '../practice/PracticeRunner.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import Flashcard from './Flashcard.jsx';
import styles from './Review.module.css';

const NEW_CARDS_PER_SESSION = 8;

export default function ReviewPage() {
  const { progress, dispatch } = useProgress();
  const { say } = useMascot();
  const [now] = useState(() => Date.now());
  const [session, setSession] = useState(null); // { kind: 'tasks' | 'cards', ids: [...] }
  const [cardIndex, setCardIndex] = useState(0);
  const [finished, setFinished] = useState(null);

  useEffect(() => {
    say(PHRASES.route.review, 'talk');
  }, [say]);

  const dueTasks = dueIds(progress.items, 'task:', now)
    .map((id) => id.slice(5))
    .filter((id) => TASK_MAP[id]);
  const dueTerms = dueIds(progress.items, 'term:', now)
    .map((id) => id.slice(5))
    .filter((id) => GLOSSARY_MAP[id]);
  const newTerms = GLOSSARY.filter((entry) => !progress.items[`term:${entry.id}`]).map((entry) => entry.id);
  const counts = boxCounts(progress.items);

  function startTasks() {
    setFinished(null);
    setSession({ kind: 'tasks', ids: shuffle(dueTasks).slice(0, 10) });
  }

  function startCards() {
    setFinished(null);
    setCardIndex(0);
    setSession({ kind: 'cards', ids: shuffle([...dueTerms, ...newTerms.slice(0, NEW_CARDS_PER_SESSION)]) });
  }

  function rateCard(remembered) {
    dispatch({ type: 'card', itemId: `term:${session.ids[cardIndex]}`, remembered });
    if (cardIndex + 1 < session.ids.length) setCardIndex(cardIndex + 1);
    else {
      setFinished({ kind: 'cards', total: session.ids.length });
      setSession(null);
    }
  }

  if (session?.kind === 'tasks') {
    return (
      <div className="stack">
        <h1>Работа над ошибками</h1>
        <PracticeRunner
          tasks={session.ids.map((id) => TASK_MAP[id])}
          showChapter
          onFinish={(result) => {
            setFinished({ kind: 'tasks', ...result });
            setSession(null);
          }}
        />
      </div>
    );
  }

  if (session?.kind === 'cards') {
    const entry = GLOSSARY_MAP[session.ids[cardIndex]];
    return (
      <div className="stack">
        <h1>Карточки терминов</h1>
        <ProgressBar value={cardIndex} max={session.ids.length} label={`Карточка ${cardIndex + 1} из ${session.ids.length}`} />
        <Flashcard key={entry.id} entry={entry} onRate={rateCard} />
      </div>
    );
  }

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Интервальное повторение</span>
        <h1>Склеп повторения</h1>
        <p className="muted">
          Мозг забывает по кривой: сначала быстро, потом медленнее. Повторение «на грани забывания» продлевает память надолго. Поэтому
          каждая задача и каждый термин живут в одном из пяти гробиков.
        </p>
      </div>

      {finished && (
        <div className="card anim-pop">
          <h2>Сеанс окончен!</h2>
          {finished.kind === 'tasks' ? (
            <p>
              Верно {finished.correct} из {finished.total}. Верные ответы переехали в следующий гробик и вернутся позже.
            </p>
          ) : (
            <p>Пройдено карточек: {finished.total}. Возвращайся завтра — повторение по чуть-чуть работает лучше зубрёжки.</p>
          )}
        </div>
      )}

      <section className={styles.coffins} aria-label="Гробики Лейтнера">
        {[1, 2, 3, 4, 5].map((box) => (
          <div key={box} className={styles.coffin}>
            <span className={styles.coffinIcon} aria-hidden="true">
              ⚰️
            </span>
            <b>{counts[box]}</b>
            <span className={styles.coffinName}>
              Гроб {box}
              <br />
              {BOX_NAMES[box]}
            </span>
          </div>
        ))}
      </section>

      <section className={`card ${styles.option}`}>
        <h2>🐞 Задачи на повторение</h2>
        {dueTasks.length > 0 ? (
          <>
            <p>
              Ждут повторения: <b>{dueTasks.length}</b>. В сеансе — до 10 штук вперемешку из разных пещер.
            </p>
            <button type="button" className="btn btn-primary" onClick={startTasks}>
              Начать работу над ошибками
            </button>
          </>
        ) : (
          <p className="muted">Пока пусто. Задачи попадают сюда после практики: ошибки — сразу, верные ответы — через день, три, неделю…</p>
        )}
      </section>

      <section className={`card ${styles.option}`}>
        <h2>📜 Карточки терминов</h2>
        <p>
          Пора повторить: <b>{dueTerms.length}</b> · новых: <b>{newTerms.length}</b> (за сеанс — до {NEW_CARDS_PER_SESSION} новых).
        </p>
        <button type="button" className="btn btn-primary" onClick={startCards} disabled={dueTerms.length === 0 && newTerms.length === 0}>
          Начать карточки
        </button>
      </section>
    </div>
  );
}
