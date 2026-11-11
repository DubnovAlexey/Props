// «Расставь по порядку»: нажимай шаги в правильной последовательности.
// Нажатие на уже выбранный шаг возвращает его обратно.
import { useMemo, useState } from 'react';
import { RichText } from '../../../components/RichText/RichText.jsx';
import { shuffleDifferent } from '../../../utils/random.js';
import styles from './tasks.module.css';
import { useI18n } from '../../../i18n/I18nContext.jsx';

export default function OrderTask({ task, onAnswer, result }) {
  const { t } = useI18n();
  const pool = useMemo(() => shuffleDifferent(task.items.map((_, i) => i)), [task]);
  const [sequence, setSequence] = useState([]);
  const answered = result !== null;

  const add = (index) => !answered && setSequence((list) => [...list, index]);
  const remove = (index) => !answered && setSequence((list) => list.filter((i) => i !== index));

  return (
    <div>
      <p className={styles.question}>
        <RichText text={task.question} />
      </p>

      {sequence.length > 0 && (
        <ol className={styles.sequence} aria-label={t('tasks.yourOrder')}>
          {sequence.map((index, position) => {
            const state = answered ? (index === position ? styles.correct : styles.wrong) : styles.selected;
            return (
              <li key={index}>
                <button type="button" className={`${styles.option} ${state}`} onClick={() => remove(index)} disabled={answered}>
                  <RichText text={task.items[index]} interactive={false} />
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {!answered && sequence.length < task.items.length && (
        <>
          <p className={styles.poolTitle}>{sequence.length === 0 ? t('tasks.firstStep') : t('tasks.whatNext')}</p>
          <div className={styles.options}>
            {pool
              .filter((index) => !sequence.includes(index))
              .map((index) => (
                <button key={index} type="button" className={styles.option} onClick={() => add(index)}>
                  <span className={styles.marker} aria-hidden="true" />
                  <RichText text={task.items[index]} interactive={false} />
                </button>
              ))}
          </div>
        </>
      )}

      {!answered && (
        <div className={styles.actions}>
          <button
            type="button"
            className="btn btn-primary"
            disabled={sequence.length < task.items.length}
            onClick={() => onAnswer(sequence)}
          >
            {t('common.check')}
          </button>
          {sequence.length > 0 && (
            <button type="button" className="btn btn-ghost" onClick={() => setSequence([])}>
              {t('common.reset')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
