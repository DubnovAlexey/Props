// Бестиарий: все хозяева пещер на одной странице.
// Повторять по картинкам быстро: смотришь на чудище — вспоминаешь тему
// (двойное кодирование: образ + слово). Побеждённые хозяева тускнеют.
import { useEffect } from 'react';
import { useProgress } from '../../state/ProgressContext.jsx';
import { useMascot } from '../../mascot/MascotContext.jsx';

import Guardian from '../../mascot/guardians/Guardian.jsx';
import Vampire from '../../mascot/Vampire.jsx';
import { to } from '../../app/useHashRoute.js';
import styles from './Bestiary.module.css';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';
import { RichText } from '../../components/RichText/RichText.jsx';
import { COURSE_PASS, courseAsCave } from '../../utils/course.js';

export default function BestiaryPage() {
  const { t } = useI18n();
  const { CHAPTERS, COURSE } = useContent();
  const { progress } = useProgress();
  const { say } = useMascot();

  useEffect(() => {
    say(t('mascot.route.bestiary'), 'talk');
  }, [say, t]);

  const defeated = CHAPTERS.filter((chapter) => progress.chapters[chapter.id]?.done).length;
  const course = courseAsCave(COURSE);
  const courseDone = (progress.exam.courseBest ?? 0) >= COURSE_PASS;

  return (
    <div className="stack">
      <header>
        <span className="eyebrow">{t('bestiary.eyebrow')}</span>
        <BloodTitle>{t('bestiary.title')}</BloodTitle>
        <p className="muted">
          <RichText text={t('bestiary.intro', { defeated, total: CHAPTERS.length })} />
        </p>
      </header>

      <section className={`card ${styles.count}`}>
        <Vampire mood="idle" size={86} />
        <div>
          <span className="eyebrow">{t('bestiary.lordEyebrow')}</span>
          <h2 className={styles.countName}>{t('bestiary.lordName')}</h2>
          <p className="muted small">{t('bestiary.lordText')}</p>
          <a className="btn btn-small" href={to.exam()}>
            {t('bestiary.lair')}
          </a>
        </div>
      </section>

      <ul className={styles.grid}>
        {CHAPTERS.map((chapter) => {
          const { guardian } = chapter.story;
          const done = progress.chapters[chapter.id]?.done;
          return (
            <li key={chapter.id} className={`card ${styles.item}`} style={{ '--cave': chapter.color }}>
              <a className={styles.link} href={to.chapter(chapter.id)}>
                <Guardian id={chapter.id} size={112} mood={done ? 'defeated' : 'idle'} label={`${guardian.kind} ${guardian.name}`} />
                <span className={styles.meta}>{t('bestiary.caveMeta', { order: chapter.order, cave: chapter.cave })}</span>
                <b className={styles.name}>
                  {guardian.name}, {guardian.kind}
                </b>
                <span className={styles.topic}>{chapter.title}</span>
                <span className={styles.why}>{guardian.why}</span>
                <span className={styles.bio}>{guardian.bio}</span>
                <span className={styles.status}>{done ? t('bestiary.defeated') : t('bestiary.waiting')}</span>
              </a>
            </li>
          );
        })}
        {/* Хозяин Кафедры Графа: повержен, когда в испытании верны 80% вопросов преподавателя */}
        <li className={`card ${styles.item}`} style={{ '--cave': course.color }}>
          <a className={styles.link} href={to.course()}>
            <Guardian
              id="course"
              size={112}
              mood={courseDone ? 'defeated' : 'idle'}
              label={`${course.story.guardian.kind} ${course.story.guardian.name}`}
            />
            <span className={styles.meta}>
              {course.icon} {course.cave}
            </span>
            <b className={styles.name}>
              {course.story.guardian.name}, {course.story.guardian.kind}
            </b>
            <span className={styles.topic}>{course.title}</span>
            <span className={styles.why}>{course.story.guardian.why}</span>
            <span className={styles.bio}>{course.story.guardian.bio}</span>
            <span className={styles.status}>{courseDone ? t('bestiary.defeated') : t('bestiary.waiting')}</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
