// Страница пещеры (главы). Учёба идёт по шагам, как по ступеням:
// разминка → урок → заклинание → практика → объясни Лунатику → перемена → итог.
// Шаги можно переключать вручную: свобода выбора поддерживает мотивацию.
import { useEffect, useMemo, useState } from 'react';
import { ALL_TASKS, CHAPTERS, CHAPTER_MAP } from '../../content/chapters/index.js';
import { useProgress } from '../../state/ProgressContext.jsx';
import { XP, isPassed, neededCorrect } from '../../state/progressReducer.js';
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

/**
 * С какого шага открыть пещеру. Бой ещё идёт (практика не пройдена) —
 * продолжаем с первого непройденного шага: не нужно заново отвечать на разминку.
 * Новая или уже пройденная пещера открывается с начала — со встречи с хозяином.
 */
function firstStepFor(done) {
  if (done.done) return 'warmup';
  return ['warmup', 'lesson', 'spell'].find((id) => !done[id]) ?? 'practice';
}

export default function ChapterPage({ chapterId }) {
  const chapter = CHAPTER_MAP[chapterId];
  const { progress, dispatch } = useProgress();
  const { say } = useMascot();
  // Функция в useState выполняется один раз, при первом рендере («ленивое» начальное значение)
  const [step, setStep] = useState(() => firstStepFor(progress.chapters[chapterId] ?? {}));
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
    // Победу празднуем, только если практика действительно пройдена
    if (nextStep === 'done' && done.done) {
      sfx.complete();
      say(phrase('chapterDone'), 'happy');
    }
    go(nextStep);
  }

  /** Показать карточку урока с начала: карточки разной высоты, прокрутка сбивала бы с толку */
  function showCard(index) {
    setCardIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function finishPractice(result) {
    setSummary(result);
    dispatch({ type: 'practice', chapterId: chapter.id, score: result.score });
    // Порог набран (или хозяин повержен раньше) — идём дальше по шагам.
    // Не набран — на «Итог»: там хозяин ещё стоит и зовёт на новый бой.
    if (isPassed(result.score) || done.done) {
      go('explain');
    } else {
      say(phrase('chapterFail'), 'sad');
      go('done');
    }
  }

  function finishExplain(text) {
    dispatch({ type: 'journal', chapterId: chapter.id, text });
    complete('explain', 'break', XP.explain);
  }

  function finishBreak(score) {
    dispatch({ type: 'break', score });
    complete('break', 'done');
  }

  const card = chapter.lesson[cardIndex];
  const lastCard = cardIndex === chapter.lesson.length - 1;
  const needed = neededCorrect(tasks.length); // сколько верных ответов нужно для победы

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
            <button type="button" className="btn" disabled={cardIndex === 0} onClick={() => showCard(cardIndex - 1)}>
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
                  onClick={() => showCard(i)}
                />
              ))}
            </div>
            {lastCard ? (
              <button type="button" className="btn btn-primary" onClick={() => complete('lesson', 'spell')}>
                К заклинанию ✨
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => showCard(cardIndex + 1)}>
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

      {step === 'practice' && (
        <div className="stack">
          {!done.done && (
            <p className="muted small">
              ⚔️ Чтобы повергнуть хозяина, ответь верно хотя бы на {needed} из {tasks.length} заданий. Ошибаться можно: каждая ошибка
              объясняется.
            </p>
          )}
          <PracticeRunner tasks={tasks} onFinish={finishPractice} />
        </div>
      )}

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

      {/* Итог открыт всегда (шаги переключаются свободно), но победу показываем только после практики */}
      {step === 'done' && !done.done && (
        <div className={`card stack anim-in ${styles.standing}`}>
          <div className={styles.standingHost}>
            <Guardian id={chapter.id} size={96} label={`${chapter.story.guardian.kind} ${chapter.story.guardian.name}`} />
            <blockquote className={styles.standingThreat}>«{chapter.story.guardian.threat}»</blockquote>
          </div>
          <span className="eyebrow">Итог пещеры</span>
          {summary ? (
            <>
              <h2>Хозяин устоял</h2>
              <p>
                В этой попытке верно <b>{summary.correct}</b> из <b>{summary.total}</b>. Чтобы повергнуть хозяина, нужно хотя бы{' '}
                <b>{needed}</b>. Ошибки уже объяснены и ждут в склепе повторения — загляни в урок и возвращайся в бой.
              </p>
            </>
          ) : (
            <>
              <h2>Хозяин ещё не повержен</h2>
              <p>
                {chapter.story.guardian.name} ждёт боя. Чтобы его повергнуть, ответь верно хотя бы на <b>{needed}</b> из{' '}
                <b>{tasks.length}</b> заданий практики.
              </p>
            </>
          )}
          <div className="row">
            <button type="button" className="btn btn-primary" onClick={() => go('practice')}>
              {summary ? 'Ещё раз в бой ⚔️' : 'К практике ⚔️'}
            </button>
            <button type="button" className="btn" onClick={() => go('lesson')}>
              {summary ? 'Перечитать урок 📖' : 'Сначала урок 📖'}
            </button>
            {summary && (
              <a className="btn btn-ghost" href={to.review()}>
                ⚰️ Склеп повторения
              </a>
            )}
          </div>
        </div>
      )}

      {step === 'done' && done.done && (
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
