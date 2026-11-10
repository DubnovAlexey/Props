// Разминка перед уроком: один вопрос «на угадайку».
// Попытка ответить ДО объяснения разжигает любопытство, и потом урок
// запоминается лучше, даже если догадка была неверной (эффект претеста).
import { useState } from 'react';
import ChoiceTask from '../practice/tasks/ChoiceTask.jsx';
import { RichBlocks } from '../../components/RichText/RichText.jsx';
import styles from './Chapter.module.css';

export default function Warmup({ pretest, onDone }) {
  const [result, setResult] = useState(null);

  function handleAnswer(value) {
    const correct = pretest.options.every((option, i) => Boolean(option.correct) === value.includes(i));
    setResult({ correct, value });
  }

  return (
    <div className="card">
      <span className="eyebrow">Разминка · угадай до урока</span>
      <p className="muted small">Не знаешь — просто предположи. Ошибка здесь ничего не стоит, а урок потом запомнится крепче.</p>
      <ChoiceTask task={pretest} prompt={pretest.question} onAnswer={handleAnswer} result={result} />
      {result && (
        <div className={`${styles.warmupResult} anim-pop`}>
          <p>
            <strong>{result.correct ? '🎯 Угадал!' : '🤔 Интересная догадка.'}</strong> Подробно разберём в уроке.
          </p>
          <RichBlocks lines={[pretest.explain]} />
          <button type="button" className="btn btn-primary" onClick={onDone}>
            К уроку →
          </button>
        </div>
      )}
    </div>
  );
}
