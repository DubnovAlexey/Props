// «Чему научат пещеры» (#learn) — путеводитель для того, кто только думает, играть ли, и для того,
// кто хочет видеть всю дорогу целиком. Сверху — что ты будешь знать и уметь, пройдя все пещеры;
// ниже — оглавление: ярусы → пещеры (хозяин, цель, темы карточек урока, вопросы Реестра,
// которые там встретятся) → Скрипторий Графа → Логово. Оглавление собирается из самих пещер,
// поэтому новая пещера или карточка попадёт сюда сама.
import { useEffect } from 'react';
import Guardian from '../../mascot/guardians/Guardian.jsx';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';
import { RichBlocks, RichText } from '../../components/RichText/RichText.jsx';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';
import { courseAsCave, questionsOfCave } from '../../utils/course.js';
import { to } from '../../app/useHashRoute.js';
import styles from './Learn.module.css';

function CaveEntry({ chapter, questions }) {
  const { t } = useI18n();
  const { guardian } = chapter.story;
  return (
    <li className={`card anim-in ${styles.cave}`} style={{ '--cave': chapter.color }}>
      <div className={styles.caveHead}>
        <Guardian id={chapter.id} size={58} label={`${guardian.kind} ${guardian.name}`} />
        <div className={styles.caveName}>
          <span className={styles.caveMeta}>
            {t('common.cave', { n: chapter.order })} · {chapter.icon} {chapter.cave}
          </span>
          <b className={styles.caveTitle}>{chapter.title}</b>
          <span className="muted small">{t('learn.guardian', { kind: guardian.kind, name: guardian.name })}</span>
        </div>
      </div>
      <p className={styles.goal}>
        <RichText text={chapter.goal} />
      </p>
      <b className={styles.label}>{t('learn.topics')}</b>
      <ul className={styles.topics}>
        {chapter.lesson.map((card) => (
          <li key={card.title}>
            <RichText text={card.title} interactive={false} />
          </li>
        ))}
      </ul>
      {questions.length > 0 && (
        <>
          <b className={styles.label}>{t('learn.questions')}</b>
          <ul className={styles.questions}>
            {questions.map((item) => (
              <li key={item.number}>
                <a href={to.course(item.number)}>
                  <RichText text={item.question} interactive={false} />
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="row">
        <a className="btn btn-small" href={to.chapter(chapter.id)}>
          {t('learn.enter')}
        </a>
        <a className="btn btn-small btn-ghost" href={to.library(chapter.id)}>
          {t('learn.scroll')}
        </a>
      </div>
    </li>
  );
}

export default function LearnPage() {
  const { t } = useI18n();
  const { LEARN, TIERS, CHAPTERS, COURSE, FINALE } = useContent();
  const { say } = useMascot();
  const course = courseAsCave(COURSE);

  useEffect(() => {
    say(t('mascot.route.learn'), 'talk');
  }, [say, t]);

  return (
    <div className="stack">
      <header>
        <span className="eyebrow">{t('learn.eyebrow')}</span>
        <BloodTitle>{LEARN.title}</BloodTitle>
        <RichBlocks lines={LEARN.intro} />
      </header>

      <section className={`card ${styles.skills}`}>
        <h2>{LEARN.skillsTitle}</h2>
        <ul>
          {LEARN.skills.map((skill) => (
            <li key={skill}>
              <RichText text={skill} />
            </li>
          ))}
        </ul>
      </section>

      <h2>{LEARN.tocTitle}</h2>
      {TIERS.map((tier) => (
        <section key={tier.id} className={styles.tier} aria-labelledby={`learn-tier-${tier.id}`}>
          <h3 id={`learn-tier-${tier.id}`} className={styles.tierTitle}>
            {t('map.tier', { num: tier.num, title: tier.title })}
          </h3>
          <p className="muted small">{tier.sub}</p>
          <ol className={styles.caves}>
            {CHAPTERS.filter((chapter) => chapter.tier === tier).map((chapter) => (
              <CaveEntry key={chapter.id} chapter={chapter} questions={questionsOfCave(COURSE, chapter.id)} />
            ))}
          </ol>
        </section>
      ))}

      <section className={`card ${styles.special}`} style={{ '--cave': course.color }}>
        <div className={styles.caveHead}>
          <Guardian id="course" size={58} label={`${course.story.guardian.kind} ${course.story.guardian.name}`} />
          <div className={styles.caveName}>
            <span className={styles.caveMeta}>
              {course.icon} {course.cave}
            </span>
            <b className={styles.caveTitle}>{course.title}</b>
          </div>
        </div>
        <p>{t('learn.courseLine')}</p>
        <a className="btn btn-small" href={to.course()}>
          {t('course.toCourse')}
        </a>
      </section>

      <section className={`card ${styles.special}`} style={{ '--cave': FINALE.color }}>
        <div className={styles.caveName}>
          <span className={styles.caveMeta}>
            {FINALE.icon} {FINALE.cave}
          </span>
          <b className={styles.caveTitle}>{FINALE.title}</b>
        </div>
        <p>{LEARN.finaleText}</p>
        <a className="btn btn-small" href={to.exam()}>
          {t('course.toExam')}
        </a>
      </section>
    </div>
  );
}
