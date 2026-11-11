// Прогон заданий: одно задание за раз → ответ → пояснение → дальше.
// Каждый ответ записывается в «гробики» Лейтнера: ошибки вернутся
// на повторение сразу, верные ответы — через растущие промежутки.

import { sfx } from '../../audio/sfx.js';
import { useRef, useState } from 'react';
import { TASK_TYPES, TASK_VIEWS } from './tasks/index.js';
import Feedback from './Feedback.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import { RichText } from '../../components/RichText/RichText.jsx';
import Bat from '../../mascot/Bat.jsx';
import { useProgress } from '../../state/ProgressContext.jsx';
import { XP } from '../../state/progressReducer.js';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { phrase } from '../../mascot/phrases.js';
import { checkTask } from '../../utils/checkAnswer.js';
import { CHAPTER_MAP } from '../../content/chapters/index.js';
import styles from './Practice.module.css';
import { useI18n } from '../../i18n/I18nContext.jsx';

export default function PracticeRunner({ tasks, onFinish, allowHints = true, showChapter = false }) {
  const { t } = useI18n();
  const { dispatch } = useProgress();
  const { say } = useMascot();
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(null); // { correct, value, xp } после ответа
  const [hintShown, setHintShown] = useState(false);
  const [log, setLog] = useState([]); // [{ id, correct }]
  const topRef = useRef(null);

  const task = tasks[index];
  const TaskView = TASK_VIEWS[task.type];
  const type = TASK_TYPES[task.type];
  const isLast = index === tasks.length - 1;
  const chapter = CHAPTER_MAP[task.chapterId];

  function handleAnswer(value) {
    const correct = checkTask(task, value);
    const xp = correct ? (hintShown ? XP.correctWithHint : XP.correct) : XP.attempt;
    dispatch({ type: 'answer', itemId: `task:${task.id}`, correct, xp });
    if (correct) sfx.correct();
    else sfx.wrong();
    setResult({ correct, value, xp });
    setLog((list) => [...list, { id: task.id, correct }]);
    say(phrase(t, correct ? 'correct' : 'wrong'), correct ? 'happy' : 'sad');
  }

  function next() {
    if (isLast) {
      const correctCount = log.filter((entry) => entry.correct).length;
      onFinish({
        total: tasks.length,
        correct: correctCount,
        score: correctCount / tasks.length,
        mistakes: log.filter((entry) => !entry.correct).map((entry) => entry.id),
      });
      return;
    }
    setIndex(index + 1);
    setResult(null);
    setHintShown(false);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showHint() {
    setHintShown(true);
    say(phrase(t, 'hint'), 'talk');
  }

  return (
    <section className={styles.runner} ref={topRef}>
      <ProgressBar
        value={index + (result ? 1 : 0)}
        max={tasks.length}
        label={t('practice.progress', { current: index + 1, total: tasks.length, left: tasks.length - index - (result ? 1 : 0) })}
      />

      <div className={`card ${styles.taskCard}`} key={task.id}>
        <div className={styles.meta}>
          <span className="chip">
            <span aria-hidden="true">{type.icon}</span> {t(`tasks.types.${task.type}`)}
          </span>
          {task.level && (
            <span className={`chip ${styles.level}`} title={t('practice.levelTitle')}>
              {t('practice.levels')[task.level]}
            </span>
          )}
          {showChapter && chapter && (
            <span className="chip" title={t('practice.caveTitle')}>
              <span aria-hidden="true">{chapter.icon}</span> {chapter.cave}
            </span>
          )}
        </div>

        <TaskView task={task} onAnswer={handleAnswer} result={result} />

        {!result && allowHints && task.hint && (
          <div className={styles.hintZone}>
            {hintShown ? (
              <p className={`${styles.hintBox} anim-pop`}>
                <Bat size={34} /> <RichText text={task.hint} />
              </p>
            ) : (
              <button type="button" className="btn btn-ghost btn-small" onClick={showHint}>
                {t('practice.hint')}
              </button>
            )}
          </div>
        )}

        {result && (
          <>
            <Feedback task={task} result={result} />
            <div className={styles.nextRow}>
              <button type="button" className="btn btn-primary" onClick={next} autoFocus>
                {isLast ? t('practice.toSummary') : t('common.next')}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
