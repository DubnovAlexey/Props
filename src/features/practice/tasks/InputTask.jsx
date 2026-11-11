// «Впиши ответ». Самому вспомнить и написать сложнее, чем выбрать,
// поэтому запоминается крепче (эффект генерации).
import { useState } from 'react';
import { RichText } from '../../../components/RichText/RichText.jsx';
import CodeBlock from '../../../components/CodeBlock/CodeBlock.jsx';
import styles from './tasks.module.css';
import { useI18n } from '../../../i18n/I18nContext.jsx';

export default function InputTask({ task, onAnswer, result }) {
  const { t } = useI18n();
  const [value, setValue] = useState('');
  const answered = result !== null;

  function handleSubmit(event) {
    event.preventDefault(); // форма не должна перезагружать страницу
    if (value.trim()) onAnswer(value);
  }

  const stateClass = answered ? (result.correct ? styles.correct : styles.wrong) : '';

  return (
    <form onSubmit={handleSubmit}>
      <p className={styles.question}>
        <RichText text={task.question} />
      </p>
      {task.code && <CodeBlock code={task.code} anatomy={answered} />}
      <label className="visually-hidden" htmlFor={`input-${task.id}`}>
        {t('tasks.answerLabel')}
      </label>
      <input
        id={`input-${task.id}`}
        className={`input ${stateClass}`}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={task.placeholder ?? t('tasks.answerPlaceholder')}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        disabled={answered}
      />
      {!answered && (
        <div className={styles.actions}>
          <button type="submit" className="btn btn-primary" disabled={!value.trim()}>
            {t('common.check')}
          </button>
        </div>
      )}
    </form>
  );
}
