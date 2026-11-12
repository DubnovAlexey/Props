// Хозяин пещеры встречает (или провожает) ученика.
// Угроза при входе включает эмоции и внимание, строка «почему именно он»
// связывает образ чудища с темой — так тема вспоминается по картинке.
//   chapter  — пещера (в ней story.guardian и story.intro / outro);
//   defeated — пещера пройдена: хозяин повержен и говорит слова поражения.
import Guardian from '../../mascot/guardians/Guardian.jsx';
import { RichText } from '../../components/RichText/RichText.jsx';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';
import styles from './CaveHost.module.css';
import { useI18n } from '../../i18n/I18nContext.jsx';

// eyebrow — своя подпись над именем (у Скриптория Графа хозяин не пещеры, а Скриптория)
export default function CaveHost({ chapter, defeated = false, eyebrow = null, defeatedEyebrow = null }) {
  const { t } = useI18n();
  const { guardian, intro, outro } = chapter.story;
  const name = `${guardian.kind} ${guardian.name}`;

  return (
    <section className={`card ${styles.host} ${defeated ? styles.defeated : ''}`} aria-label={t('host.label', { name })}>
      <div className={styles.portrait}>
        <Guardian id={chapter.id} size={132} mood={defeated ? 'defeated' : 'idle'} label={name} />
      </div>
      <div className={styles.text}>
        <span className="eyebrow">{defeated ? (defeatedEyebrow ?? t('host.defeated')) : (eyebrow ?? t('host.eyebrow'))}</span>
        <BloodTitle as="h2" className={styles.name}>
          {guardian.name}, <span className={styles.kind}>{guardian.kind}</span>
        </BloodTitle>
        <blockquote className={styles.speech}>{t('common.quote', { text: defeated ? guardian.defeat : guardian.threat })}</blockquote>
        <p className={styles.story}>
          <RichText text={defeated ? outro : intro} />
        </p>
        <p className={styles.why}>
          <b>{t('host.why')}</b> {guardian.why}
        </p>
      </div>
    </section>
  );
}
