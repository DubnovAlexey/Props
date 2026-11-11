// Карта пещер — главный экран. Каждая тема живёт в своей пещере со своим
// цветом и хозяином-чудищем. Это метод локусов («дворец памяти»):
// мозг отлично помнит места, и знания, привязанные к месту, вспоминаются легче.
// Пещеры сгруппированы по ярусам: чем глубже, тем сложнее.
import { useEffect, useState } from 'react';
import { dayKey } from '../../utils/dates.js';
import { useProgress } from '../../state/ProgressContext.jsx';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { useReducedMotion } from '../../hooks/useMediaQuery.js';
import { phrase } from '../../mascot/phrases.js';
import { rankFor } from '../../utils/ranks.js';
import { dueIds } from '../../utils/leitner.js';
import { pick } from '../../utils/random.js';
import { RichBlocks, RichText } from '../../components/RichText/RichText.jsx';
import Guardian from '../../mascot/guardians/Guardian.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import Bat from '../../mascot/Bat.jsx';
import CaveArt from './CaveArt.jsx';
import CaveNode from './CaveNode.jsx';
import styles from './CaveMap.module.css';
import { to } from '../../app/useHashRoute.js';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';
import { scrollToTop } from '../../utils/scroll.js';

/**
 * «Начать игру заново»: сначала спрашиваем подтверждение — стёртый прогресс не вернуть.
 * Пока прогресса нет, кнопку не показываем: стирать нечего.
 */
function ResetProgress() {
  const { t } = useI18n();
  const { progress, dispatch } = useProgress();
  const [asking, setAsking] = useState(false);
  const hasProgress = progress.xp > 0 || Object.keys(progress.chapters).length > 0 || Object.keys(progress.items).length > 0;
  if (!hasProgress) return null;

  function reset() {
    dispatch({ type: 'reset' });
    dispatch({ type: 'visit', today: dayKey() }); // сегодняшний день в серии остаётся
    setAsking(false);
    scrollToTop();
  }

  if (!asking) {
    return (
      <button type="button" className="btn btn-ghost btn-small" onClick={() => setAsking(true)}>
        {t('map.resetButton')}
      </button>
    );
  }

  return (
    <div className={styles.reset} role="alertdialog" aria-label={t('map.resetLabel')}>
      <p>
        <RichText text={t('map.resetText')} />
      </p>
      <div className="row">
        <button type="button" className="btn" onClick={() => setAsking(false)}>
          {t('common.cancel')}
        </button>
        <button type="button" className="btn btn-danger" onClick={reset}>
          {t('map.resetConfirm')}
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
  const { t } = useI18n();
  const { progress, dispatch } = useProgress();
  const reducedMotion = useReducedMotion();
  const on = progress.scares !== false;

  return (
    <div className={styles.scares}>
      <p className="small">
        <RichText text={t('map.scaresText')} />
      </p>
      <button type="button" className="btn btn-small" aria-pressed={on} onClick={() => dispatch({ type: 'scares', scares: !on })}>
        {on ? t('map.scaresOn') : t('map.scaresOff')}
      </button>
      {reducedMotion && on && <p className="muted small">{t('map.scaresReduced')}</p>}
    </div>
  );
}

export default function CaveMap() {
  const { t } = useI18n();
  const { progress } = useProgress();
  const { say } = useMascot();
  const { CHAPTERS, FACTS, EPILOGUE, FINALE, PROLOGUE, TIERS, translatedCaves } = useContent();
  // В состоянии — номер факта, а не текст: сменится язык — тот же факт покажется на новом языке
  const [factIndex, setFactIndex] = useState(() => pick(FACTS.map((_, i) => i)));
  const isNew = progress.xp === 0;

  useEffect(() => {
    say(isNew ? phrase(t, 'greet') : t('mascot.route.map'), 'wave');
    // реплика — только при входе на карту, поэтому isNew не в зависимостях
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [say, t]);

  const nextChapter = CHAPTERS.find((chapter) => !progress.chapters[chapter.id]?.done) ?? null;
  const dueCount = dueIds(progress.items, '', Date.now()).length;
  const doneCount = CHAPTERS.filter((chapter) => progress.chapters[chapter.id]?.done).length;
  const { current, next, progress: toNext } = rankFor(progress.xp);
  const accuracy = progress.stats.answered ? Math.round((progress.stats.correct / progress.stats.answered) * 100) : 0;

  return (
    <div className="stack">
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className="eyebrow">{t('map.eyebrow')}</span>
          <BloodTitle>{t('map.title')}</BloodTitle>
          <p>
            <RichText text={t('map.intro', { caves: t('map.caves', { count: CHAPTERS.length }) })} />
          </p>
          <div className="row">
            <a className="btn btn-primary" href={to.chapter((nextChapter ?? CHAPTERS[0]).id)}>
              {isNew ? t('map.start') : nextChapter ? t('map.continue') : t('map.again')}
            </a>
            {dueCount > 0 && (
              <a className="btn" href={to.review()}>
                {t('map.review', { count: dueCount })}
              </a>
            )}
          </div>
        </div>
        <CaveArt />
      </section>

      {/* Честное предупреждение, пока на языке игрока переведены не все пещеры */}
      {translatedCaves < CHAPTERS.length && (
        <p className="card small">
          {translatedCaves === 0 ? t('lang.notice') : t('lang.partial', { done: translatedCaves, total: CHAPTERS.length })}
        </p>
      )}

      <section className={`card ${styles.rank}`}>
        <div className={styles.rankHead}>
          <span className={styles.rankIcon} aria-hidden="true">
            {current.icon}
          </span>
          <div>
            <span className="eyebrow">{t('map.rankEyebrow')}</span>
            <h2 className={styles.rankTitle}>{t('ranks')[current.id]}</h2>
          </div>
        </div>
        <ProgressBar
          value={next ? toNext : 1}
          max={1}
          label={
            next
              ? t('map.xpToNext', { xp: progress.xp, rank: t('ranks')[next.id], left: next.min - progress.xp })
              : t('map.xpTop', { xp: progress.xp })
          }
        />
        <dl className={styles.stats}>
          <div>
            <dt>{t('map.statCaves')}</dt>
            <dd>
              {doneCount}/{CHAPTERS.length}
            </dd>
          </div>
          <div>
            <dt>{t('map.statAnswers')}</dt>
            <dd>{progress.stats.answered}</dd>
          </div>
          <div>
            <dt>{t('map.statAccuracy')}</dt>
            <dd>{accuracy}%</dd>
          </div>
          <div>
            <dt>{t('map.statStreak')}</dt>
            <dd>{progress.streak.count}</dd>
          </div>
        </dl>
      </section>

      {isNew && (
        <section className={`card ${styles.prologue}`}>
          <span className="eyebrow">{t('map.prologue')}</span>
          <h2>{PROLOGUE.title}</h2>
          <RichBlocks lines={PROLOGUE.text} />
        </section>
      )}

      <section>
        <h2>{t('map.mapTitle')}</h2>
        <p className="muted small">{t('map.mapHint')}</p>
        {TIERS.map((tier) => (
          <section key={tier.id} className={styles.tier} aria-labelledby={`tier-${tier.id}`}>
            <header className={styles.tierHead}>
              <span className={styles.tierNum} aria-hidden="true">
                {tier.num}
              </span>
              <div>
                <h3 id={`tier-${tier.id}`} className={styles.tierTitle}>
                  {t('map.tier', { num: tier.num, title: tier.title })}
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
          <span className="eyebrow">{t('map.epilogue')}</span>
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
          <span className="eyebrow">{t('map.bestiaryEyebrow')}</span>
          <h2 className={styles.bestiaryTitle}>{t('map.guardians', { count: CHAPTERS.length })}</h2>
          <p className="muted small">{t('map.bestiaryText')}</p>
          <a className="btn btn-small" href={to.bestiary()}>
            {t('map.bestiaryOpen')}
          </a>
        </div>
      </section>

      <section className={`card ${styles.fact}`}>
        <Bat size={54} />
        <div>
          <span className="eyebrow">{t('map.factEyebrow')}</span>
          <p>
            <RichText text={FACTS[factIndex]} />
          </p>
          <button
            type="button"
            className="btn btn-small"
            onClick={() => setFactIndex(pick(FACTS.map((_, i) => i).filter((i) => i !== factIndex)))}
          >
            {t('map.factMore')}
          </button>
        </div>
      </section>

      <section className="card">
        <h2>{t('map.howTitle')}</h2>
        <ul>
          {t('map.how').map((line) => (
            <li key={line}>
              <RichText text={line} />
            </li>
          ))}
        </ul>
        <div className="row">
          <a href={to.methods()}>{t('map.whyLink')}</a>
          <a href={to.break()}>{t('map.breakLink')}</a>
          <a href={to.install()}>{t('map.installLink')}</a>
        </div>
        <ScaresToggle />
        <ResetProgress />
      </section>
    </div>
  );
}
