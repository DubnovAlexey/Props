// Обратная связь сразу после ответа: верно ли и, главное, ПОЧЕМУ.
// Объяснение причин (а не просто «неверно») — ключ к пониманию.
import { RichBlocks } from '../../components/RichText/RichText.jsx';
import styles from './Practice.module.css';

/** Дополнительные строки пояснения в зависимости от типа задания */
export function detailsFor(task, result) {
  const { correct, value } = result;
  switch (task.type) {
    case 'choice':
      return correct
        ? []
        : task.options
            .filter((option, i) => value.includes(i) && !option.correct && option.why)
            // жирным — только подпись: внутри **…** разметка `код` не работает
            .map((option) => `**Почему не этот вариант:** «${option.text}» — ${option.why}`);
    case 'truefalse':
      return [task.answer ? 'Это **правда**.' : 'Это **миф**.'];
    case 'input':
      return correct ? [] : [`**Ожидался ответ:** \`${task.answers[0]}\``];
    case 'fill':
      return correct ? [] : [`**Верные кусочки по порядку:** ${task.answers.map((a) => `\`${a}\``).join(', ')}`];
    case 'bug':
      return [`**Ошибка в строке ${task.bugLine}. Исправленный вариант:** \`${task.fix}\``];
    case 'order':
      return correct ? [] : ['**Правильный порядок:**', ...task.items.map((item, i) => `- ${i + 1}. ${item}`)];
    case 'match':
      return correct ? [] : ['**Правильные пары:**', ...task.pairs.map(([left, right]) => `- ${left} → ${right}`)];
    case 'sort':
      return correct
        ? []
        : [
            '**Где ошибка:**',
            ...task.items.filter((item, i) => value[i] !== item.bin).map((item) => `- ${item.text} → ${task.bins[item.bin]}`),
          ];
    default:
      return [];
  }
}

export default function Feedback({ task, result }) {
  const explain = Array.isArray(task.explain) ? task.explain : [task.explain];
  return (
    <div className={`${styles.feedback} ${result.correct ? styles.ok : styles.no}`} role="status">
      <div className={styles.feedbackHead}>
        <strong>{result.correct ? '✓ Верно!' : '✗ Не совсем'}</strong>
        <span className="chip">+{result.xp} опыта</span>
      </div>
      <RichBlocks lines={[...detailsFor(task, result), ...explain]} />
    </div>
  );
}
