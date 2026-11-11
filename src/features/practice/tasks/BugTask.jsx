// «Найди ошибку»: нажми на строку, в которой прячется баг.
// Поиск ошибки в чужом коде — главный навык разработчика.
import { useState } from 'react';
import { RichText } from '../../../components/RichText/RichText.jsx';
import CodeBlock from '../../../components/CodeBlock/CodeBlock.jsx';
import styles from './tasks.module.css';
import { useI18n } from '../../../i18n/I18nContext.jsx';

export default function BugTask({ task, onAnswer, result }) {
  const { t } = useI18n();
  const [line, setLine] = useState(null);
  const answered = result !== null;

  const lineStatus = {};
  if (answered) {
    if (result.correct) lineStatus[task.bugLine] = 'good';
    else {
      lineStatus[task.bugLine] = 'bad';
      if (line !== null) lineStatus[line] = 'selected';
    }
  } else if (line !== null) {
    lineStatus[line] = 'selected';
  }

  return (
    <div>
      <p className={styles.question}>
        <RichText text={task.question ?? t('tasks.bugQuestion')} />
      </p>
      <CodeBlock code={task.code} onLineClick={setLine} lineStatus={lineStatus} disabled={answered} />
      {!answered && (
        <div className={styles.actions}>
          <button type="button" className="btn btn-primary" disabled={line === null} onClick={() => onAnswer(line)}>
            {line === null ? t('tasks.bugPick') : t('tasks.bugLine', { n: line })}
          </button>
        </div>
      )}
    </div>
  );
}
