// Склеп повторения. Здесь живут интервальные повторения (система Лейтнера):
// задачи с ошибками и карточки терминов всплывают тогда, когда их пора освежить.
// Задачи из разных пещер идут вперемешку — это «чередование»,
// оно учит различать темы, а не отвечать на автомате.
import { useEffect, useState } from 'react';
import { useProgress } from '../../state/ProgressContext.jsx';
import { useMascot } from '../../mascot/MascotContext.jsx';

import { boxCounts, dueIds } from '../../utils/leitner.js';
import { shuffle } from '../../utils/random.js';
import PracticeRunner from '../practice/PracticeRunner.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import Flashcard from './Flashcard.jsx';
import styles from './Review.module.css';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';
import { RichText } from '../../components/RichText/RichText.jsx';

const NEW_CARDS_PER_SESSION = 8;

export default function ReviewPage() {
  const { t } = useI18n();
  const { TASK_MAP, GLOSSARY, GLOSSARY_MAP } = useContent();
  const { progress, dispatch } = useProgress();
  const { say } = useMascot();
  // «Сейчас» запоминаем в состоянии: список к повторению не должен меняться прямо во время сеанса.
  // После сеанса время обновляем — и свежие ошибки сразу появляются в списке.
  const [now, setNow] = useState(() => Date.now());
  const [session, setSession] = useState(null); // { kind: 'tasks' | 'cards', ids: [...] }
  const [cardIndex, setCardIndex] = useState(0);
  const [finished, setFinished] = useState(null);

  useEffect(() => {
    say(t('mascot.route.review'), 'talk');
  }, [say, t]);

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
    else endSession({ kind: 'cards', total: session.ids.length });
  }

  function endSession(result) {
    setFinished(result);
    setSession(null);
    setNow(Date.now());
    window.scrollTo(0, 0);
  }

  if (session?.kind === 'tasks') {
    return (
      <div className="stack">
        <BloodTitle>{t('review.mistakesTitle')}</BloodTitle>
        <PracticeRunner
          tasks={session.ids.map((id) => TASK_MAP[id])}
          showChapter
          onFinish={(result) => endSession({ kind: 'tasks', ...result })}
        />
      </div>
    );
  }

  if (session?.kind === 'cards') {
    const entry = GLOSSARY_MAP[session.ids[cardIndex]];
    return (
      <div className="stack">
        <BloodTitle>{t('review.cardsTitle')}</BloodTitle>
        <ProgressBar
          value={cardIndex}
          max={session.ids.length}
          label={t('review.cardProgress', { n: cardIndex + 1, total: session.ids.length })}
        />
        <Flashcard key={entry.id} entry={entry} onRate={rateCard} />
      </div>
    );
  }

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">{t('review.eyebrow')}</span>
        <BloodTitle>{t('review.title')}</BloodTitle>
        <p className="muted">{t('review.intro')}</p>
      </div>

      {finished && (
        <div className="card anim-pop">
          <h2>{t('review.doneTitle')}</h2>
          {finished.kind === 'tasks' ? (
            <p>{t('review.doneTasks', { correct: finished.correct, total: finished.total })}</p>
          ) : (
            <p>{t('review.doneCards', { total: finished.total })}</p>
          )}
        </div>
      )}

      <section className={styles.coffins} aria-label={t('review.coffinsLabel')}>
        {[1, 2, 3, 4, 5].map((box) => (
          <div key={box} className={styles.coffin}>
            <span className={styles.coffinIcon} aria-hidden="true">
              ⚰️
            </span>
            <b>{counts[box]}</b>
            <span className={styles.coffinName}>
              {t('review.coffin', { n: box })}
              <br />
              {t('review.boxes')[box]}
            </span>
          </div>
        ))}
      </section>

      <section className={`card ${styles.option}`}>
        <h2>{t('review.tasksTitle')}</h2>
        {dueTasks.length > 0 ? (
          <>
            <p>
              <RichText text={t('review.tasksDue', { count: dueTasks.length })} />
            </p>
            <button type="button" className="btn btn-primary" onClick={startTasks}>
              {t('review.tasksStart')}
            </button>
          </>
        ) : (
          <p className="muted">{t('review.tasksEmpty')}</p>
        )}
      </section>

      <section className={`card ${styles.option}`}>
        <h2>{t('review.termsTitle')}</h2>
        <p>
          <RichText text={t('review.termsDue', { due: dueTerms.length, fresh: newTerms.length, limit: NEW_CARDS_PER_SESSION })} />
        </p>
        <button type="button" className="btn btn-primary" onClick={startCards} disabled={dueTerms.length === 0 && newTerms.length === 0}>
          {t('review.termsStart')}
        </button>
      </section>
    </div>
  );
}
