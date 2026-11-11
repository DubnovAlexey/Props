// «Правда или миф?» — быстрый выбор из двух. Разоблачение мифов
// помогает исправить неверные представления, а не просто добавить знание.
import { RichText } from '../../../components/RichText/RichText.jsx';
import CodeBlock from '../../../components/CodeBlock/CodeBlock.jsx';
import styles from './tasks.module.css';
import { useI18n } from '../../../i18n/I18nContext.jsx';

const CHOICES = [
  { value: true, labelKey: 'tasks.truth' },
  { value: false, labelKey: 'tasks.myth' },
];

export default function TrueFalseTask({ task, onAnswer, result }) {
  const { t } = useI18n();
  const answered = result !== null;
  return (
    <div>
      <p className={styles.hint}>{t('tasks.statement')}</p>
      <div className={styles.statement}>
        <RichText text={task.statement} />
      </div>
      {task.code && <CodeBlock code={task.code} anatomy={answered} />}
      <div className={styles.duo}>
        {CHOICES.map((choice) => {
          let state = '';
          if (answered) {
            if (choice.value === task.answer) state = styles.correct;
            else if (choice.value === result.value) state = styles.wrong;
          }
          return (
            <button
              key={choice.labelKey}
              type="button"
              className={`${styles.option} ${state}`}
              onClick={() => onAnswer(choice.value)}
              disabled={answered}
            >
              {t(choice.labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
