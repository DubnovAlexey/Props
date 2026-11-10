// Страница пещеры (главы). Учёба идёт по шагам, как по ступеням:
// разминка → урок → заклинание → практика → объясни Лунатику → перемена → итог.
// Шаги можно переключать вручную: свобода выбора поддерживает мотивацию.
import { useEffect, useMemo, useState } from 'react';
import { ALL_TASKS, CHAPTERS, CHAPTER_MAP } from '../../content/chapters/index.js';
import { useProgress } from '../../state/ProgressContext.jsx';
import { XP } from '../../state/progressReducer.js';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { phrase } from '../../mascot/phrases.js';
import LessonCard from './LessonCard.jsx';
import Warmup from './Warmup.jsx';
import ExplainToBat from './ExplainToBat.jsx';
import Spell from '../../components/Spell/Spell.jsx';
import PracticeRunner from '../practice/PracticeRunner.jsx';
import BatCatcher from '../break/BatCatcher.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import NotFound from '../../app/NotFound.jsx';
import styles from './Chapter.module.css';
import CaveHost from './CaveHost.jsx';
import { sfx } from '../../audio/sfx.js';
import Guardian from '../../mascot/guardians/Guardian.jsx';
import { to } from '../../app/useHashRoute.js';

const STEPS = [
  { id: 'warmup', label: 'Разминка', icon: '🕯️' },
  { id: 'lesson', label: 'Урок', icon: '📖' },
  { id: 'spell', label: 'Заклинание', icon: '✨' },
  { id: 'practice', label: 'Практика', icon: '⚔️' },
  { id: 'explain', label: 'Объясни', icon: '🦇' },
  { id: 'break', label: 'Перемена', icon: '🎮' },
  { id: 'done', label: 'Итог', icon: '🏆' },
];

export default function ChapterPage({ chapterId }) {
  const chapter = CHAPTER_MAP[chapterId];
  const { progress, dispatch } = useProgress();
  const { say } = useMascot();
  const [step, setStep] = useState('warmup');
  const [cardIndex, setCardIndex] = useState(0);
  const [summary, setSummary] = useState(null);
  const tasks = useMemo(() => ALL_TASKS.filter((task) => task.chapterId === chapterId), [chapterId]);

  useEffect(() => {
    if (chapter) say(`Пещера «${chapter.cave}». ${chapter.goal}`, 'wave');
  }, [chapter, say]);

  if (!chapter) return <NotFound />;

  const done = progress.chapters[chapter.id] ?? {};
  const nextChapter = CHAPTERS[CHAPTERS.indexOf(chapter) + 1];

  function go(stepId) {
    setStep(stepId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function complete(stepId, nextStep, xp = XP.step) {
    dispatch({ type: 'step', chapterId: chapter.id, step: stepId, xp });
    if (nextStep === 'done') sfx.complete();
    go(nextStep);
  }

  function finishPractice(result) {
    setSummary(result);
    dispatch({ type: 'practice', chapterId: chapter.id, score: result.score });
    go('explain');
  }

  function finishExplain(text) {
    dispatch({ type: 'journal', chapterId: chapter.id, text });
    complete('explain', 'break', XP.explain);
  }

  function finishBreak(score) {
    dispatch({ type: 'break', score });
    complete('break', 'done');
    say(phrase('chapterDone'), 'happy');
  }

  const card = chapter.lesson[cardIndex];
  const lastCard = cardIndex === chapter.lesson.length - 1;

  return (
    <div className={styles.page} style={{ '--cave': chapter.color }}>
      <div className={styles.topLinks}>
        <a href={to.map()} className={styles.back}>
          ← Карта пещер
        </a>
        <a href={to.library(chapter.id)} className={styles.back}>
          📜 Свиток пещеры: теория
        </a>
      </div>

      <header className={styles.header}>
        <Guardian
          id={chapter.id}
          size={64}
          mood={done.done ? 'defeated' : 'idle'}
          className={styles.hostMini}
          label={`${chapter.story.guardian.kind} ${chapter.story.guardian.name}`}
        />
        <div>
          <span className="eyebrow">
            Пещера {chapter.order} из {CHAPTERS.length} · ярус {chapter.tier.num} · {chapter.cave}
          </span>
          <h1 className={styles.title}>{chapter.title}</h1>
          <p className="muted">{chapter.goal}</p>
        </div>
      </header>

      <nav className={styles.steps} aria-label="Шаги пещеры">
        {STEPS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.step} ${step === item.id ? styles.stepCurrent : ''} ${done[item.id] || (item.id === 'practice' && done.done) ? styles.stepDone : ''}`}
            onClick={() => go(item.id)}
            aria-current={step === item.id ? 'step' : undefined}
          >
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {step === 'warmup' && (
        <div className="stack">
          <CaveHost chapter={chapter} defeated={Boolean(done.done)} />
          <Warmup pretest={chapter.pretest} onDone={() => complete('warmup', 'lesson')} />
        </div>
      )}

      {step === 'lesson' && (
        <div className="stack">
          <ProgressBar
            value={cardIndex + 1}
            max={chapter.lesson.length}
            label={`Урок: карточка ${cardIndex + 1} из ${chapter.lesson.length}`}
            tone="gold"
          />
          <LessonCard key={cardIndex} card={card} index={cardIndex} total={chapter.lesson.length} />
          <div className={styles.cardNav}>
            <button type="button" className="btn" disabled={cardIndex === 0} onClick={() => setCardIndex(cardIndex - 1)}>
              ← Назад
            </button>
            <div className={styles.dots} role="tablist" aria-label="Карточки урока">
              {chapter.lesson.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  aria-selected={i === cardIndex}
                  aria-label={`Карточка ${i + 1}: ${item.title}`}
                  className={`${styles.dot} ${i === cardIndex ? styles.dotActive : ''}`}
                  onClick={() => setCardIndex(i)}
                />
              ))}
            </div>
            {lastCard ? (
              <button type="button" className="btn btn-primary" onClick={() => complete('lesson', 'spell')}>
                К заклинанию ✨
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setCardIndex(cardIndex + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Дальше →
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'spell' && (
        <div className="stack">
          <Spell spell={chapter.spell} />
          <div className="row">
            <button type="button" className="btn btn-primary" onClick={() => complete('spell', 'practice')}>
              Запомнил — к практике ⚔️
            </button>
          </div>
        </div>
      )}

      {step === 'practice' && <PracticeRunner tasks={tasks} onFinish={finishPractice} />}

      {step === 'explain' && (
        <ExplainToBat explain={chapter.explain} initialText={progress.journal[chapter.id] ?? ''} onDone={finishExplain} />
      )}

      {step === 'break' && (
        <div className="stack">
          <BatCatcher roundId={chapter.breakRound} onFinish={finishBreak} finishLabel="К итогам →" />
          <button type="button" className="btn btn-ghost" onClick={() => complete('break', 'done', 0)}>
            Пропустить перемену
          </button>
        </div>
      )}

      {step === 'done' && (
        <div className="stack anim-in">
          <CaveHost chapter={chapter} defeated />
          <div className="card stack">
            <span className="eyebrow">Итог пещеры</span>
            <h2>
              {chapter.icon} {chapter.cave} — пройдено!
            </h2>
            {summary ? (
              <p>
                Практика: <b>{summary.correct}</b> из <b>{summary.total}</b> ({Math.round(summary.score * 100)}%).
                {summary.mistakes.length > 0 && ' Ошибки уже ждут в склепе повторения — вернись к ним завтра.'}
              </p>
            ) : (
              done.practiceBest !== undefined && <p>Лучший результат практики: {Math.round(done.practiceBest * 100)}%.</p>
            )}
            <p className="muted">
              Заклинание пещеры: <i>«{chapter.spell.text}»</i>
            </p>
            <div className="row">
              {nextChapter ? (
                <a className="btn btn-primary" href={to.chapter(nextChapter.id)}>
                  {nextChapter.icon} Следующая пещера →
                </a>
              ) : (
                <a className="btn btn-primary" href={to.exam()}>
                  👑 К испытанию Графа
                </a>
              )}
              <a className="btn" href={to.review()}>
                ⚰️ Склеп повторения
              </a>
              <a className="btn btn-ghost" href={to.map()}>
                На карту
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
