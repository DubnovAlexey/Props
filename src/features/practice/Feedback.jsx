// Обратная связь сразу после ответа: верно ли и, главное, ПОЧЕМУ.
// Объяснение причин (а не просто «неверно») — ключ к пониманию.
import { RichBlocks } from '../../components/RichText/RichText.jsx';
import styles from './Practice.module.css';
import { useI18n } from '../../i18n/I18nContext.jsx';

/** Дополнительные строки пояснения в зависимости от типа задания */
export function detailsFor(task, result, t) {
  const { correct, value } = result;
  switch (task.type) {
    case 'choice':
      return correct
        ? []
        : task.options
            .filter((option, i) => value.includes(i) && !option.correct && option.why)
            // жирным — только подпись: внутри **…** разметка `код` не работает
            .map((option) => t('feedback.whyNot', { text: option.text, why: option.why }));
    case 'truefalse':
      return [task.answer ? t('feedback.isTrue') : t('feedback.isMyth')];
    case 'input':
      return correct ? [] : [t('feedback.expected', { answer: task.answers[0] })];
    case 'fill':
      return correct ? [] : [t('feedback.pieces', { list: task.answers.map((a) => `\`${a}\``).join(', ') })];
    case 'bug':
      return [t('feedback.bug', { line: task.bugLine, fix: task.fix })];
    case 'order':
      return correct ? [] : [t('feedback.order'), ...task.items.map((item, i) => `- ${i + 1}. ${item}`)];
    case 'match':
      return correct ? [] : [t('feedback.pairs'), ...task.pairs.map(([left, right]) => `- ${left} → ${right}`)];
    case 'sort':
      return correct
        ? []
        : [
            t('feedback.where'),
            ...task.items.filter((item, i) => value[i] !== item.bin).map((item) => `- ${item.text} → ${task.bins[item.bin]}`),
          ];
    default:
      return [];
  }
}

export default function Feedback({ task, result }) {
  const { t } = useI18n();
  const explain = Array.isArray(task.explain) ? task.explain : [task.explain];
  return (
    <div className={`${styles.feedback} ${result.correct ? styles.ok : styles.no}`} role="status">
      <div className={styles.feedbackHead}>
        <strong>{result.correct ? t('feedback.right') : t('feedback.wrong')}</strong>
        <span className="chip">{t('feedback.xp', { xp: result.xp })}</span>
      </div>
      <RichBlocks lines={[...detailsFor(task, result, t), ...explain]} />
    </div>
  );
}
