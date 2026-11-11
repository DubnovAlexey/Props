// «Разложи по корзинам»: для каждого элемента выбери, куда он относится.
// Сравнение похожих понятий бок о бок (props/state, можно/нельзя)
// помогает увидеть разницу — это приём «контраст».
import { useState } from 'react';
import { RichText } from '../../../components/RichText/RichText.jsx';
import styles from './tasks.module.css';
import { useI18n } from '../../../i18n/I18nContext.jsx';

export default function SortTask({ task, onAnswer, result }) {
  const { t } = useI18n();
  const [assignment, setAssignment] = useState(() => task.items.map(() => null));
  const answered = result !== null;
  const complete = assignment.every((bin) => bin !== null);

  function choose(itemIndex, bin) {
    if (answered) return;
    setAssignment((list) => list.map((value, i) => (i === itemIndex ? bin : value)));
  }

  return (
    <div>
      <p className={styles.question}>
        <RichText text={task.question} />
      </p>
      <ul className={styles.sortList}>
        {task.items.map((item, itemIndex) => {
          const state = answered ? (assignment[itemIndex] === item.bin ? styles.correct : styles.wrong) : '';
          return (
            <li key={itemIndex} className={`${styles.sortItem} ${state}`}>
              <div className={styles.sortText}>
                <RichText text={item.text} interactive={false} />
              </div>
              <div className={styles.bins} role="radiogroup" aria-label={t('tasks.sortWhere', { text: item.text })}>
                {task.bins.map((binLabel, bin) => (
                  <button
                    key={bin}
                    type="button"
                    role="radio"
                    aria-checked={assignment[itemIndex] === bin}
                    className={`${styles.bin} ${assignment[itemIndex] === bin ? styles.binChosen : ''}`}
                    onClick={() => choose(itemIndex, bin)}
                    disabled={answered}
                  >
                    {answered && item.bin === bin ? '✓ ' : ''}
                    {binLabel}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
      {!answered && (
        <div className={styles.actions}>
          <button type="button" className="btn btn-primary" disabled={!complete} onClick={() => onAnswer(assignment)}>
            {t('common.check')}
          </button>
        </div>
      )}
    </div>
  );
}
