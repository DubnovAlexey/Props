// Скрипторий Графа (#course) — двадцать вопросов Реестра Формуляра о пропсах, списках и условиях и Малое испытание.
// Здесь вопросы не только перечислены, а «обыграны»: хозяин Скриптория (упырь-архивариус Формуляр),
// схема потока данных, пять тем с теорией (усиленной там, где в пещерах тема затронута коротко),
// у каждого вопроса — готовый ответ и пещера с подробностями, живая мастерская-опыт,
// Малое испытание и тренировка с подсказками. Все 25 заданий потом обязательно идут в Испытании Графа.
//   focus — номер вопроса, который открыть сразу (ссылка #course-q7 из испытания или оглавления).
import { useEffect, useMemo, useState } from 'react';
import CaveHost from '../chapter/CaveHost.jsx';
import CourseQuestion from './CourseQuestion.jsx';
import CrmLab from './CrmLab.jsx';
import PracticeRunner from '../practice/PracticeRunner.jsx';
import Scheme from '../../components/Scheme/Scheme.jsx';
import CodeBlock from '../../components/CodeBlock/CodeBlock.jsx';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';
import { RichBlocks, RichText } from '../../components/RichText/RichText.jsx';
import { useProgress } from '../../state/ProgressContext.jsx';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';
import { useScrollTopOnChange } from '../../hooks/useScrollTop.js';
import { scrollToElement } from '../../utils/scroll.js';
import { COURSE_PASS, courseAsCave, questionId } from '../../utils/course.js';
import { to } from '../../app/useHashRoute.js';
import styles from './Course.module.css';

export default function CoursePage({ focus = null }) {
  const { t } = useI18n();
  const { COURSE, COURSE_TASKS } = useContent();
  const { progress } = useProgress();
  const { say } = useMascot();
  const [run, setRun] = useState(null); // { ids, title, round } — идёт тренировка
  const [summary, setSummary] = useState(null);
  const cave = useMemo(() => courseAsCave(COURSE), [COURSE]);
  const questions = useMemo(() => COURSE.questions.map((item, index) => ({ ...item, number: index + 1 })), [COURSE]);
  const courseBest = progress.exam.courseBest ?? null;
  useScrollTopOnChange(run ? `run:${run.round}` : summary ? 'result' : 'read');

  useEffect(() => {
    say(t('mascot.route.course'), 'talk');
  }, [say, t]);

  // Переход по ссылке на конкретный вопрос: раскрыт сразу (open), остаётся до него докрутить
  useEffect(() => {
    if (focus) scrollToElement(document.getElementById(`course-q${focus}`));
  }, [focus]);

  function train(ids, title) {
    setSummary(null);
    setRun((previous) => ({ ids, title, round: (previous?.round ?? 0) + 1 }));
  }

  function finish(result) {
    setSummary({ ...result, ids: run.ids, title: run.title });
    setRun(null);
  }

  if (run) {
    const tasks = run.ids.map((id) => COURSE_TASKS.find((task) => task.id === id));
    return (
      <div className="stack">
        <button type="button" className={`btn btn-ghost btn-small ${styles.back}`} onClick={() => setRun(null)}>
          {t('course.backToList')}
        </button>
        <BloodTitle>{run.title}</BloodTitle>
        <p className="muted small">{t('course.trainHint')}</p>
        <PracticeRunner key={run.round} tasks={tasks} onFinish={finish} showChapter />
      </div>
    );
  }

  if (summary) {
    return (
      <div className="card stack">
        <span className="eyebrow">{t('course.eyebrow')}</span>
        <BloodTitle>{summary.title}</BloodTitle>
        <p className={styles.score}>{t('course.result', { correct: summary.correct, total: summary.total })}</p>
        <div className="row">
          <button type="button" className="btn btn-primary" onClick={() => train(summary.ids, summary.title)}>
            {t('course.again')}
          </button>
          <button type="button" className="btn" onClick={() => setSummary(null)}>
            {t('course.backToList')}
          </button>
          <a className="btn btn-ghost" href={to.exam()}>
            {t('course.toExam')}
          </a>
        </div>
      </div>
    );
  }

  const allIds = COURSE_TASKS.map((task) => task.id);
  const trainAll = () => train(allIds, t('course.trainAll'));

  return (
    <div className={`stack ${styles.page}`} style={{ '--cave': cave.color }}>
      <header>
        <span className="eyebrow">{t('course.eyebrow')}</span>
        <BloodTitle>{COURSE.title}</BloodTitle>
        <p className="muted">{COURSE.goal}</p>
      </header>

      <CaveHost chapter={cave} defeated={courseBest !== null && courseBest >= COURSE_PASS} />

      <section className="card stack">
        <RichBlocks lines={COURSE.intro} />
      </section>

      <section className={`card ${styles.examCall}`}>
        <h2>👑 {t('course.examTitle')}</h2>
        <p>{t('course.examText', { count: COURSE_TASKS.length })}</p>
        {courseBest !== null && <p className="muted small">{t('course.best', { percent: Math.round(courseBest * 100) })}</p>}
        <div className="row">
          <button type="button" className="btn btn-primary" onClick={trainAll}>
            {t('course.trainAll')}
          </button>
          <a className="btn" href={to.exam()}>
            {t('course.toExam')}
          </a>
        </div>
      </section>

      <h2>{t('course.blocksTitle')}</h2>
      {COURSE.blocks.map((block) => {
        const blockTitle = `${block.icon} ${block.title}`;
        return (
          <section key={block.title} className={`card stack anim-in ${styles.block}`}>
            <h3 className={styles.blockTitle}>{blockTitle}</h3>
            <RichBlocks lines={block.body} />
            {block.scheme && <Scheme scheme={block.scheme} />}
            {block.code && <CodeBlock code={block.code} anatomy />}
            <div className={styles.questions}>
              {block.questions.map((number) => (
                <CourseQuestion key={number} item={questions[number - 1]} label={COURSE.answerLabel} open={focus === number} />
              ))}
            </div>
            <div className="row">
              <button type="button" className="btn btn-small" onClick={() => train(block.questions.map(questionId), blockTitle)}>
                {t('course.trainBlock')}
              </button>
            </div>
          </section>
        );
      })}

      <CrmLab lab={COURSE.lab} />

      <section className="card stack">
        <h2>🗡️ {t('course.miniTest')}</h2>
        <p className="muted">{t('course.miniTestText')}</p>
        <ol className={styles.miniList}>
          {COURSE.miniTest.map((item) => (
            <li key={item.task.question}>
              <RichText text={item.task.question} />
            </li>
          ))}
        </ol>
      </section>

      <section className={`card ${styles.examCall}`}>
        <blockquote className={styles.outro}>{COURSE.story.outro}</blockquote>
        <div className="row">
          <button type="button" className="btn btn-primary" onClick={trainAll}>
            {t('course.trainAll')}
          </button>
          <a className="btn" href={to.exam()}>
            {t('course.toExam')}
          </a>
        </div>
      </section>
    </div>
  );
}
