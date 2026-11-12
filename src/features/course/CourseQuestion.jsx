// Один вопрос Реестра: вопрос — заголовок раскрывашки, внутри — путь к нему через пещеры,
// как ответить, пример кода и пещера, где тема разобрана подробно. Используется на Скриптории,
// в пещерах и в свитках.
// Это игра, а не учебник: к вопросу ведёт путь от простого к сложному (item.path). Пока хозяева
// пещер на пути не повержены, вопрос «запечатан» 🔒 и показывает, какие пещеры впереди;
// проходы при этом открыты все — заглянуть в ответ можно и раньше.
//   item  — вопрос из COURSE.questions с номером ({ number, question, answer, code, chapterId, path });
//   open  — раскрыть сразу (переход по ссылке #course-q7);
//   label — подпись перед ответом («Как ответить Формуляру:»);
//   showCave — показывать ли ссылку на пещеру (в самой пещере она не нужна).
import CodeBlock from '../../components/CodeBlock/CodeBlock.jsx';
import { RichBlocks, RichText } from '../../components/RichText/RichText.jsx';
import { to } from '../../app/useHashRoute.js';
import { useProgress } from '../../state/ProgressContext.jsx';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';
import { pathLeft } from '../../utils/course.js';
import styles from './Course.module.css';

export default function CourseQuestion({ item, open = false, label, showCave = true }) {
  const { t } = useI18n();
  const { CHAPTER_MAP } = useContent();
  const { progress } = useProgress();
  const chapter = CHAPTER_MAP[item.chapterId];
  const left = pathLeft(item.path, progress.chapters);

  return (
    <details
      className={`${styles.question} ${left.length === 0 ? styles.questionOpen : ''}`}
      id={`course-q${item.number}`}
      open={open || undefined}
    >
      <summary className={styles.questionHead}>
        <span className={styles.questionNum}>
          <span aria-hidden="true" className={`${styles.lock} ${left.length === 0 ? styles.lockOpen : ''}`}>
            {left.length === 0 ? '🔓' : '🔒'}
          </span>{' '}
          {t('course.question', { n: item.number })}
        </span>
        <span className={styles.questionText}>
          <RichText text={item.question} interactive={false} />
        </span>
      </summary>
      <div className={styles.answer}>
        <div className={styles.path}>
          <span className={styles.pathLabel}>{t('course.path')}</span>
          <ol className={styles.pathSteps}>
            {item.path.map((id) => {
              const cave = CHAPTER_MAP[id];
              const done = Boolean(progress.chapters[id]?.done);
              return (
                <li key={id}>
                  <a
                    className={`${styles.pathStep} ${done ? styles.pathDone : ''}`}
                    href={to.chapter(id)}
                    style={{ '--cave': cave.color }}
                    title={cave.title}
                  >
                    <span aria-hidden="true">{cave.icon}</span> {cave.order}. {cave.cave}
                    {done && <span aria-hidden="true"> ✓</span>}
                  </a>
                </li>
              );
            })}
          </ol>
          <span className={styles.pathStatus}>
            {left.length === 0 ? t('course.pathOpen') : t('course.pathLeft', { count: left.length })}
          </span>
        </div>
        <b className={styles.answerLabel}>{label}</b>
        <RichBlocks lines={item.answer} />
        {item.code && <CodeBlock code={item.code} anatomy />}
        {showCave && chapter && (
          <a className={styles.caveLink} href={to.chapter(chapter.id)} style={{ '--cave': chapter.color }}>
            {t('course.toCave', { cave: `${chapter.icon} ${chapter.order}. ${chapter.cave}` })}
          </a>
        )}
      </div>
    </details>
  );
}
