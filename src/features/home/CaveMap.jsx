// Карта пещер — главный экран. Каждая тема живёт в своей пещере со своим
// цветом и хозяином-чудищем. Это метод локусов («дворец памяти»):
// мозг отлично помнит места, и знания, привязанные к месту, вспоминаются легче.
// Пещеры сгруппированы по ярусам: чем глубже, тем сложнее.
import { useEffect, useState } from 'react';
import { dayKey } from '../../utils/dates.js';
import { CHAPTERS } from '../../content/chapters/index.js';
import { FACTS } from '../../content/facts.js';
import { useProgress } from '../../state/ProgressContext.jsx';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { useReducedMotion } from '../../hooks/useMediaQuery.js';
import { PHRASES, phrase } from '../../mascot/phrases.js';
import { rankFor } from '../../utils/ranks.js';
import { dueIds } from '../../utils/leitner.js';
import { pick } from '../../utils/random.js';
import { RichBlocks, RichText } from '../../components/RichText/RichText.jsx';
import { EPILOGUE, FINALE, PROLOGUE, TIERS } from '../../content/story.js';
import Guardian from '../../mascot/guardians/Guardian.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import Bat from '../../mascot/Bat.jsx';
import CaveArt from './CaveArt.jsx';
import CaveNode from './CaveNode.jsx';
import styles from './CaveMap.module.css';
import { to } from '../../app/useHashRoute.js';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';

/**
 * «Начать игру заново»: сначала спрашиваем подтверждение — стёртый прогресс не вернуть.
 * Пока прогресса нет, кнопку не показываем: стирать нечего.
 */
function ResetProgress() {
  const { progress, dispatch } = useProgress();
  const [asking, setAsking] = useState(false);
  const hasProgress = progress.xp > 0 || Object.keys(progress.chapters).length > 0 || Object.keys(progress.items).length > 0;
  if (!hasProgress) return null;

  function reset() {
    dispatch({ type: 'reset' });
    dispatch({ type: 'visit', today: dayKey() }); // сегодняшний день в серии остаётся
    setAsking(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!asking) {
    return (
      <button type="button" className="btn btn-ghost btn-small" onClick={() => setAsking(true)}>
        🗑️ Начать игру заново
      </button>
    );
  }

  return (
    <div className={styles.reset} role="alertdialog" aria-label="Сброс прогресса">
      <p>
        <b>Точно начать заново?</b> Опыт, пройденные пещеры и расписание повторений будут стёрты. Вернуть их нельзя.
      </p>
      <div className="row">
        <button type="button" className="btn" onClick={() => setAsking(false)}>
          Отмена
        </button>
        <button type="button" className="btn btn-danger" onClick={reset}>
          Да, стереть прогресс
        </button>
      </div>
    </div>
  );
}

/**
 * Переключатель «Неожиданностей» — пролетающих мышей, гоблинов и прочих (components/Scares).
 * Настройка хранится в прогрессе рядом с темой и звуком.
 */
function ScaresToggle() {
  const { progress, dispatch } = useProgress();
  const reducedMotion = useReducedMotion();
  const on = progress.scares !== false;

  return (
    <div className={styles.scares}>
      <p className="small">
        <b>Неожиданности.</b> Иногда по экрану кто-то пролетает или пробегает: летучая мышь, гоблин, тролль, банши. Секунда испуга
        встряхивает мозг — он отвлекается, отдыхает и возвращается к задаче свежим. Мешает — выключи.
      </p>
      <button type="button" className="btn btn-small" aria-pressed={on} onClick={() => dispatch({ type: 'scares', scares: !on })}>
        {on ? '👻 Неожиданности включены' : '🚫 Неожиданности выключены'}
      </button>
      {reducedMotion && on && (
        <p className="muted small">
          В настройках твоего устройства включено «уменьшение движения», поэтому сейчас никто не появляется: игра уважает эту настройку.
        </p>
      )}
    </div>
  );
}

export default function CaveMap() {
  const { progress } = useProgress();
  const { say } = useMascot();
  const [fact, setFact] = useState(() => pick(FACTS));
  const isNew = progress.xp === 0;

  useEffect(() => {
    say(isNew ? phrase('greet') : PHRASES.route.map, 'wave');
    // реплика — только при входе на карту, поэтому isNew не в зависимостях
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [say]);

  const nextChapter = CHAPTERS.find((chapter) => !progress.chapters[chapter.id]?.done) ?? null;
  const dueCount = dueIds(progress.items, '', Date.now()).length;
  const doneCount = CHAPTERS.filter((chapter) => progress.chapters[chapter.id]?.done).length;
  const { current, next, progress: toNext } = rankFor(progress.xp);
  const accuracy = progress.stats.answered ? Math.round((progress.stats.correct / progress.stats.answered) * 100) : 0;

  return (
    <div className="stack">
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className="eyebrow">Игра-тренажёр по React</span>
          <BloodTitle>Пещеры Графа Пропсулы</BloodTitle>
          <p>
            <RichText
              text={`${CHAPTERS.length} пещер на трёх ярусах — от устройства проекта до паттернов. Всё о [[props|пропсах]] и всём, что рядом: [[component|компоненты]], JavaScript, [[state|состояние]], [[virtual-dom|виртуальный DOM]], [[hook|хуки]], [[context|Context]], [[memo|memo]] и типы. В каждой пещере — свой хозяин-чудище, а над всеми — Граф.`}
            />
          </p>
          <div className="row">
            <a className="btn btn-primary" href={to.chapter((nextChapter ?? CHAPTERS[0]).id)}>
              {isNew ? '🕯️ Войти в первую пещеру' : nextChapter ? '🕯️ Продолжить путь' : '🔁 Пройти заново'}
            </a>
            {dueCount > 0 && (
              <a className="btn" href={to.review()}>
                ⚰️ Повторить ({dueCount})
              </a>
            )}
          </div>
        </div>
        <CaveArt />
      </section>

      <section className={`card ${styles.rank}`}>
        <div className={styles.rankHead}>
          <span className={styles.rankIcon} aria-hidden="true">
            {current.icon}
          </span>
          <div>
            <span className="eyebrow">Твой ранг</span>
            <h2 className={styles.rankTitle}>{current.title}</h2>
          </div>
        </div>
        <ProgressBar
          value={next ? toNext : 1}
          max={1}
          label={next ? `Опыт ${progress.xp} · до ранга «${next.title}» — ${next.min - progress.xp}` : `Опыт ${progress.xp} · высший ранг!`}
        />
        <dl className={styles.stats}>
          <div>
            <dt>Пещер</dt>
            <dd>
              {doneCount}/{CHAPTERS.length}
            </dd>
          </div>
          <div>
            <dt>Ответов</dt>
            <dd>{progress.stats.answered}</dd>
          </div>
          <div>
            <dt>Точность</dt>
            <dd>{accuracy}%</dd>
          </div>
          <div>
            <dt>Дней подряд</dt>
            <dd>{progress.streak.count}</dd>
          </div>
        </dl>
      </section>

      {isNew && (
        <section className={`card ${styles.prologue}`}>
          <span className="eyebrow">Пролог</span>
          <h2>{PROLOGUE.title}</h2>
          <RichBlocks lines={PROLOGUE.text} />
        </section>
      )}

      <section>
        <h2>Карта пещер</h2>
        <p className="muted small">Спускайся по порядку: каждая пещера опирается на предыдущую. Но проходы открыты все.</p>
        {TIERS.map((tier) => (
          <section key={tier.id} className={styles.tier} aria-labelledby={`tier-${tier.id}`}>
            <header className={styles.tierHead}>
              <span className={styles.tierNum} aria-hidden="true">
                {tier.num}
              </span>
              <div>
                <h3 id={`tier-${tier.id}`} className={styles.tierTitle}>
                  Ярус {tier.num} · {tier.title}
                </h3>
                <p className="muted small">{tier.sub}</p>
              </div>
            </header>
            <ol className={styles.path}>
              {CHAPTERS.filter((chapter) => chapter.tier === tier).map((chapter) => (
                <CaveNode key={chapter.id} chapter={chapter} state={progress.chapters[chapter.id]} isNext={chapter === nextChapter} />
              ))}
            </ol>
          </section>
        ))}
        <ol className={styles.path}>
          <CaveNode
            chapter={{ ...FINALE, order: '★' }}
            href={to.exam()}
            state={progress.exam.best !== null ? { done: true, practiceBest: progress.exam.best } : undefined}
            isNext={!nextChapter}
          />
        </ol>
      </section>

      {!nextChapter && progress.exam.best !== null && (
        <section className={`card ${styles.prologue}`}>
          <span className="eyebrow">Эпилог</span>
          <h2>{EPILOGUE.title}</h2>
          <RichBlocks lines={EPILOGUE.text} />
        </section>
      )}

      <section className={`card ${styles.bestiary}`}>
        <div className={styles.bestiaryFaces} aria-hidden="true">
          {['state', 'context', 'hooks'].map((id) => (
            <Guardian key={id} id={id} size={58} />
          ))}
        </div>
        <div>
          <span className="eyebrow">Бестиарий</span>
          <h2 className={styles.bestiaryTitle}>{CHAPTERS.length} хозяев пещер</h2>
          <p className="muted small">
            Вспомни чудище — вспомнишь тему. Сороконожка — массив, богомол с крюками — хуки, червь, прогрызающий уровни, — Context.
          </p>
          <a className="btn btn-small" href={to.bestiary()}>
            Открыть бестиарий →
          </a>
        </div>
      </section>

      <section className={`card ${styles.fact}`}>
        <Bat size={54} />
        <div>
          <span className="eyebrow">Лунатик принёс факт</span>
          <p>
            <RichText text={fact} />
          </p>
          <button type="button" className="btn btn-small" onClick={() => setFact(pick(FACTS.filter((item) => item !== fact)))}>
            Ещё факт
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Как учиться с Графом</h2>
        <ul>
          <li>
            <b>Короткие подходы.</b> Одна пещера — 15–25 минут, потом перемена.
          </li>
          <li>
            <b>Возвращайся завтра.</b> Склеп повторения сам подскажет, что освежить.
          </li>
          <li>
            <b>Объясняй вслух.</b> Заклинания и «Объясни Лунатику» закрепляют лучше перечитывания.
          </li>
        </ul>
        <div className="row">
          <a href={to.methods()}>Почему это работает →</a>
          <a href={to.break()}>🦇 Перемена</a>
          <a href={to.install()}>📲 Играть без интернета</a>
        </div>
        <ScaresToggle />
        <ResetProgress />
      </section>
    </div>
  );
}
