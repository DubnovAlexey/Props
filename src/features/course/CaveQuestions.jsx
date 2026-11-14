// «Формуляр спросит»: вопросы Реестра по теме этой пещеры — с готовыми ответами.
// Стоит в конце урока пещеры, на её итоге и в свитке пещеры: вопрос встречается там, где учат тему,
// а все 20 вместе — на Скриптории Графа. В пещере без вопросов курса блок не рисуется.
import CourseQuestion from './CourseQuestion.jsx';
import Guardian from '../../mascot/guardians/Guardian.jsx';
import { questionsOfCave } from '../../utils/course.js';
import { to } from '../../app/useHashRoute.js';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';
import styles from './Course.module.css';

export default function CaveQuestions({ chapterId }) {
  const { t } = useI18n();
  const { COURSE } = useContent();
  const questions = questionsOfCave(COURSE, chapterId);
  if (questions.length === 0) return null;

  return (
    <section className={`card anim-in ${styles.inCave}`}>
      <div className={styles.inCaveHead}>
        {/* хозяин Скриптория выглядывает: его вопросы встречаются по пути, в пещерах */}
        <Guardian id="course" size={44} zoom />
        <h2 className={styles.inCaveTitle}>{t('course.inCave')}</h2>
      </div>
      <p className="muted small">{t('course.inCaveText')}</p>
      <div className={styles.questions}>
        {questions.map((item) => (
          <CourseQuestion key={item.number} item={item} label={COURSE.answerLabel} showCave={false} />
        ))}
      </div>
      <a className="btn btn-small" href={to.course()}>
        {t('course.toCourse')}
      </a>
    </section>
  );
}
