// Испытание Графа: по заданию из каждой пещеры и ещё пара случайных — вперемешку, без подсказок.
// Смешанная проверка (чередование) показывает, понимаешь ли ты темы
// настолько, чтобы различать их, а не только решать «по главе».
import { useEffect, useState } from 'react';
import { ALL_TASKS, CHAPTERS } from '../../content/chapters/index.js';
import { useProgress } from '../../state/ProgressContext.jsx';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { PHRASES } from '../../mascot/phrases.js';
import { pick, shuffle } from '../../utils/random.js';
import PracticeRunner from '../practice/PracticeRunner.jsx';
import Bat from '../../mascot/Bat.jsx';
import styles from './Exam.module.css';
import { to } from '../../app/useHashRoute.js';

const EXTRA_TASKS = 2;

/** По одному случайному заданию из каждой пещеры и ещё несколько любых */
export function buildExam() {
  const perCave = CHAPTERS.map((chapter) => pick(ALL_TASKS.filter((task) => task.chapterId === chapter.id)));
  const rest = shuffle(ALL_TASKS.filter((task) => !perCave.includes(task))).slice(0, EXTRA_TASKS);
  return shuffle([...perCave, ...rest]);
}

function verdict(score) {
  if (score >= 0.9) return { title: 'Граф Пропсов!', text: 'Корона твоя. Ты понимаешь пропсы глубже, чем многие джуниоры.' };
  if (score >= 0.75) return { title: 'Хранитель пропсов', text: 'Отличный результат. Пару тем стоит освежить в склепе.' };
  if (score >= 0.5) return { title: 'Ученик склепа', text: 'Фундамент есть. Повтори ошибки и вернись через пару дней.' };
  return { title: 'Летучка с крыльями', text: 'Крылья уже растут! Пройди пещеры ещё раз — повторение всё сделает.' };
}

export default function ExamPage() {
  const { progress, dispatch } = useProgress();
  const { say } = useMascot();
  const [phase, setPhase] = useState('intro');
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    say(PHRASES.route.exam, 'talk');
  }, [say]);

  function start() {
    setTasks(buildExam());
    setSummary(null);
    setPhase('run');
  }

  function finish(result) {
    dispatch({ type: 'exam', score: result.score });
    setSummary(result);
    setPhase('result');
    say(
      result.score >= 0.75 ? 'Ты прошёл испытание! Мыши в восторге.' : 'Хорошая попытка. Склеп повторения ждёт тебя.',
      result.score >= 0.75 ? 'happy' : 'talk',
    );
  }

  if (phase === 'run') {
    return (
      <div className="stack">
        <h1>👑 Испытание Графа</h1>
        <PracticeRunner tasks={tasks} onFinish={finish} allowHints={false} showChapter />
      </div>
    );
  }

  if (phase === 'result' && summary) {
    const { title, text } = verdict(summary.score);
    return (
      <div className={`card ${styles.result}`}>
        {summary.score >= 0.75 && (
          <div className={styles.confetti} aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} style={{ left: `${(i * 8.3) % 100}%`, animationDelay: `${(i % 6) * 0.25}s` }}>
                <Bat size={26 + (i % 3) * 8} />
              </span>
            ))}
          </div>
        )}
        <span className="eyebrow">Результат</span>
        <h1>{title}</h1>
        <p className={styles.score}>
          {summary.correct} / {summary.total} · {Math.round(summary.score * 100)}%
        </p>
        <p>{text}</p>
        <div className="row">
          <button type="button" className="btn btn-primary" onClick={start}>
            Пройти ещё раз
          </button>
          <a className="btn" href={to.review()}>
            ⚰️ Повторить ошибки
          </a>
          <a className="btn btn-ghost" href={to.map()}>
            На карту
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="card stack">
      <span className="eyebrow">Логово Графа</span>
      <h1>👑 Испытание Графа</h1>
      <p>
        {CHAPTERS.length + EXTRA_TASKS} заданий из всех пещер вперемешку. Подсказок Лунатика не будет, но пояснения после каждого ответа
        останутся — испытание тоже учит.
      </p>
      <ul>
        <li>По одному заданию из каждой пещеры и ещё {EXTRA_TASKS} случайных.</li>
        <li>Ошибки попадут в склеп повторения.</li>
        <li>90% и выше — титул «Граф Пропсов».</li>
      </ul>
      {progress.exam.best !== null && (
        <p className="muted">
          Лучший результат: {Math.round(progress.exam.best * 100)}% · попыток: {progress.exam.attempts}
        </p>
      )}
      <div className="row">
        <button type="button" className="btn btn-primary" onClick={start}>
          Принять испытание
        </button>
      </div>
    </div>
  );
}
