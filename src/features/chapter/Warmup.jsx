// Разминка перед уроком: один вопрос «на угадайку».
// Попытка ответить ДО объяснения разжигает любопытство, и потом урок
// запоминается лучше, даже если догадка была неверной (эффект претеста).
import { useState } from 'react';
import ChoiceTask from '../practice/tasks/ChoiceTask.jsx';
import { RichBlocks } from '../../components/RichText/RichText.jsx';
import styles from './Chapter.module.css';
import { useI18n } from '../../i18n/I18nContext.jsx';

export default function Warmup({ pretest, onDone }) {
  const { t } = useI18n();
  const [result, setResult] = useState(null);

  function handleAnswer(value) {
    const correct = pretest.options.every((option, i) => Boolean(option.correct) === value.includes(i));
    setResult({ correct, value });
  }

  return (
    <div className="card">
      <span className="eyebrow">{t('warmup.eyebrow')}</span>
      <p className="muted small">{t('warmup.hint')}</p>
      <ChoiceTask task={pretest} prompt={pretest.question} onAnswer={handleAnswer} result={result} />
      {result && (
        <div className={`${styles.warmupResult} anim-pop`}>
          <p>
            <strong>{result.correct ? t('warmup.right') : t('warmup.wrong')}</strong> {t('warmup.later')}
          </p>
          <RichBlocks lines={[pretest.explain]} />
          <button type="button" className="btn btn-primary" onClick={onDone}>
            {t('warmup.toLesson')}
          </button>
        </div>
      )}
    </div>
  );
}
