// Полоса прогресса. Видимый остаток («ещё 2 задания») подталкивает
// закончить начатое — это эффект Зейгарник.
import styles from './ProgressBar.module.css';
import { useI18n } from '../../i18n/I18nContext.jsx';

export default function ProgressBar({ value, max = 1, label, tone = 'accent' }) {
  const { t } = useI18n();
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={styles.wrap}>
      {label && (
        <div className={styles.label}>
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={label ?? t('common.progress')}
      >
        <div className={`${styles.fill} ${styles[tone]}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
