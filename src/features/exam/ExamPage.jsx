// Испытание Графа: по заданию из каждой пещеры и ещё пара случайных — вперемешку, без подсказок.
// Смешанная проверка (чередование) показывает, понимаешь ли ты темы
// настолько, чтобы различать их, а не только решать «по главе».
// В конце — обязательная часть: все вопросы преподавателя и мини-тест (Кафедра Графа, content/course.js).
// Они идут вдобавок к заданиям пещер, а не вместо них, и без них испытание не закончится.
import { useEffect, useMemo, useState } from 'react';
import { useProgress } from '../../state/ProgressContext.jsx';
import { useMascot } from '../../mascot/MascotContext.jsx';

import { buildExam, courseSummary, EXTRA_TASKS } from '../../utils/exam.js';
import PracticeRunner from '../practice/PracticeRunner.jsx';
import Bat from '../../mascot/Bat.jsx';
import styles from './Exam.module.css';
import { to } from '../../app/useHashRoute.js';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';
import { interpolate } from '../../i18n/translate.js';
import { useScrollTopOnChange } from '../../hooks/useScrollTop.js';

/** Номер вердикта в словаре (exam.verdicts): 0 — лучший результат, 3 — самый слабый */
function verdictIndex(score) {
  if (score >= 0.9) return 0;
  if (score >= 0.75) return 1;
  if (score >= 0.5) return 2;
  return 3;
}

export default function ExamPage() {
  const { t } = useI18n();
  const { ALL_TASKS, CHAPTERS, TASK_MAP, COURSE, COURSE_TASKS } = useContent();
  const { progress, dispatch } = useProgress();
  const { say } = useMascot();
  const [phase, setPhase] = useState('intro');
  const [taskIds, setTaskIds] = useState([]);
  const [summary, setSummary] = useState(null);
  const tasks = useMemo(() => taskIds.map((id) => TASK_MAP[id]), [taskIds, TASK_MAP]);
  // Начало испытания и его итог — новые экраны: показываем их сверху
  useScrollTopOnChange(phase);

  useEffect(() => {
    say(t('mascot.route.exam'), 'talk');
  }, [say, t]);

  function start() {
    setTaskIds(buildExam(CHAPTERS, ALL_TASKS, COURSE_TASKS));
    setSummary(null);
    setPhase('run');
  }

  function finish(result) {
    const course = courseSummary(COURSE_TASKS, result.mistakes);
    dispatch({ type: 'exam', score: result.score, course: course.score });
    setSummary({ ...result, course });
    setPhase('result');
    say(result.score >= 0.75 ? t('exam.passed') : t('exam.failed'), result.score >= 0.75 ? 'happy' : 'talk');
  }

  if (phase === 'run') {
    return (
      <div className="stack">
        <BloodTitle>{t('exam.title')}</BloodTitle>
        <PracticeRunner tasks={tasks} onFinish={finish} allowHints={false} showChapter />
      </div>
    );
  }

  if (phase === 'result' && summary) {
    const { title, text } = t('exam.verdicts')[verdictIndex(summary.score)];
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
        <span className="eyebrow">{t('exam.result')}</span>
        <BloodTitle>{title}</BloodTitle>
        <p className={styles.score}>
          {summary.correct} / {summary.total} · {Math.round(summary.score * 100)}%
        </p>
        <p>{text}</p>
        <div className={`anim-pop ${styles.course}`}>
          <b>{t('exam.courseScore', { correct: summary.course.correct, total: summary.course.total })}</b>
          {summary.course.missed.length > 0 && (
            <>
              <p className="small">{t('exam.courseMissed')}</p>
              <ul className={styles.missed}>
                {summary.course.missed.map((task) => (
                  <li key={task.id}>
                    <a href={task.course.kind === 'question' ? to.course(task.course.number) : to.course()}>
                      {task.course.kind === 'question'
                        ? COURSE.questions[task.course.number - 1].question
                        : t('course.chipTest', { n: task.course.number })}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="row">
          <button type="button" className="btn btn-primary" onClick={start}>
            {t('exam.again')}
          </button>
          <a className="btn" href={to.review()}>
            {t('exam.reviewMistakes')}
          </a>
          <a className="btn btn-ghost" href={to.map()}>
            {t('common.toMapShort')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="card stack">
      <span className="eyebrow">{t('exam.lair')}</span>
      <BloodTitle>{t('exam.title')}</BloodTitle>
      <p>{t('exam.intro', { tasks: t('exam.tasks', { count: CHAPTERS.length + EXTRA_TASKS }) })}</p>
      <ul>
        {t('exam.rules').map((rule) => (
          <li key={rule}>{interpolate(rule, { extra: EXTRA_TASKS, course: COURSE_TASKS.length })}</li>
        ))}
      </ul>
      {progress.exam.best !== null && (
        <p className="muted">{t('exam.best', { percent: Math.round(progress.exam.best * 100), attempts: progress.exam.attempts })}</p>
      )}
      <div className="row">
        <button type="button" className="btn btn-primary" onClick={start}>
          {t('exam.start')}
        </button>
        <a className="btn" href={to.course()}>
          {t('course.toCourse')}
        </a>
      </div>
    </div>
  );
}
