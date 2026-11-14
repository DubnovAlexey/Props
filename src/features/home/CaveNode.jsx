// Одна пещера на карте. Все данные приходят пропсами:
// chapter — что за пещера, state — прогресс в ней, isNext — ждёт ли здесь Граф.
// У «не пещер» (Кафедра Графа, Логово) вместо номера — своя подпись: chapter.label или «Финал».
// В кольце прогресса — портрет хозяина пещеры: тема узнаётся по чудищу.
import Guardian from '../../mascot/guardians/Guardian.jsx';
import styles from './CaveMap.module.css';
import { to } from '../../app/useHashRoute.js';
import { useI18n } from '../../i18n/I18nContext.jsx';

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CaveNode({ chapter, state, isNext = false, href = to.chapter(chapter.id) }) {
  const { t } = useI18n();
  const best = state?.practiceBest ?? 0;
  const started = Boolean(state);
  const guardian = chapter.story?.guardian;

  return (
    <li className={`${styles.node} ${isNext ? styles.next : ''}`} style={{ '--cave': chapter.color }}>
      <a className={styles.nodeLink} href={href}>
        <span className={styles.ringWrap}>
          <svg className={styles.ring} viewBox="0 0 80 80" aria-hidden="true">
            <circle className={styles.ringTrack} cx="40" cy="40" r={RADIUS} />
            {/* при нуле не рисуем: скруглённый конец линии дал бы точку */}
            {best > 0 && (
              <circle className={styles.ringFill} cx="40" cy="40" r={RADIUS} strokeDasharray={`${CIRCUMFERENCE * best} ${CIRCUMFERENCE}`} />
            )}
          </svg>
          {guardian ? (
            <span className={styles.nodePortrait}>
              <Guardian id={chapter.id} size={50} mood={state?.done ? 'defeated' : 'idle'} zoom />
            </span>
          ) : (
            <span className={styles.nodeIcon} aria-hidden="true">
              {chapter.icon}
            </span>
          )}
        </span>
        <span className={styles.nodeText}>
          <span className={styles.nodeNum}>
            {chapter.label ?? (typeof chapter.order === 'number' ? t('common.cave', { n: chapter.order }) : t('common.final'))} ·{' '}
            {chapter.cave}
          </span>
          <b className={styles.nodeTitle}>{chapter.title}</b>
          <span className={styles.nodeStatus}>
            {guardian && <span className={styles.nodeGuardian}>{guardian.kind} · </span>}
            {state?.done ? t('node.defeated', { percent: Math.round(best * 100) }) : started ? t('node.fighting') : t('node.waiting')}
          </span>
        </span>
      </a>
      {isNext && (
        <span className={styles.nextBadge}>
          <span aria-hidden="true">🕯️</span> {t('node.next')}
        </span>
      )}
    </li>
  );
}
