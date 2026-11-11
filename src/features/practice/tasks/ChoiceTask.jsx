// «Выбери ответ». Если верных вариантов несколько — режим «отметь все».
// Варианты перемешиваются, чтобы запоминался смысл, а не позиция.
// Пропсы задания: task — данные, onAnswer(value) — сообщить ответ, result — итог проверки.
import { useMemo, useState } from 'react';
import { RichText } from '../../../components/RichText/RichText.jsx';
import CodeBlock from '../../../components/CodeBlock/CodeBlock.jsx';
import { shuffle } from '../../../utils/random.js';
import styles from './tasks.module.css';
import { useI18n } from '../../../i18n/I18nContext.jsx';

export default function ChoiceTask({ task, onAnswer, result, prompt }) {
  const { t } = useI18n();
  const multi = task.options.filter((option) => option.correct).length > 1;
  const order = useMemo(() => shuffle(task.options.map((_, i) => i)), [task]);
  const [selected, setSelected] = useState([]);
  const answered = result !== null;

  function toggle(index) {
    if (answered) return;
    if (multi) {
      setSelected((list) => (list.includes(index) ? list.filter((i) => i !== index) : [...list, index]));
    } else {
      setSelected([index]);
    }
  }

  return (
    <div className={multi ? styles.multi : undefined}>
      <p className={styles.question}>
        <RichText text={prompt ?? task.question} />
      </p>
      {task.code && <CodeBlock code={task.code} anatomy={answered} />}
      {multi && <p className={styles.hint}>{t('tasks.multi')}</p>}

      <div className={styles.options} role={multi ? 'group' : 'radiogroup'} aria-label={t('tasks.options')}>
        {order.map((index) => {
          const option = task.options[index];
          const isSelected = selected.includes(index);
          let state = isSelected ? styles.selected : '';
          if (answered) state = option.correct ? styles.correct : isSelected ? styles.wrong : '';
          const mark = answered ? (option.correct ? '✓' : isSelected ? '✗' : '') : isSelected ? '•' : '';
          return (
            <button
              key={index}
              type="button"
              role={multi ? 'checkbox' : 'radio'}
              aria-checked={isSelected}
              className={`${styles.option} ${state}`}
              onClick={() => toggle(index)}
              disabled={answered}
            >
              <span className={styles.marker} aria-hidden="true">
                {mark}
              </span>
              <span>
                <RichText text={option.text} interactive={false} />
              </span>
            </button>
          );
        })}
      </div>

      {!answered && (
        <div className={styles.actions}>
          <button type="button" className="btn btn-primary" disabled={selected.length === 0} onClick={() => onAnswer(selected)}>
            {t('common.check')}
          </button>
        </div>
      )}
    </div>
  );
}
