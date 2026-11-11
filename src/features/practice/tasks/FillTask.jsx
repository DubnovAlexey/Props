// «Собери код из кусочков»: в коде пропуски ___, внизу кусочки.
// Нажми кусочек — он встанет в выбранный (или первый пустой) пропуск.
// Нажми заполненный пропуск — кусочек вернётся обратно.
// Работает пальцем на телефоне — печатать код там неудобно.
import { useMemo, useState } from 'react';
import { RichText } from '../../../components/RichText/RichText.jsx';
import CodeBlock from '../../../components/CodeBlock/CodeBlock.jsx';
import { shuffle } from '../../../utils/random.js';
import styles from './tasks.module.css';
import { useI18n } from '../../../i18n/I18nContext.jsx';

export default function FillTask({ task, onAnswer, result }) {
  const { t } = useI18n();
  const bank = useMemo(() => shuffle(task.bank.map((value, id) => ({ id, value }))), [task]);
  const [slots, setSlots] = useState(() => task.answers.map(() => null)); // в каждом слоте — кусочек или null
  const [activeSlot, setActiveSlot] = useState(0);
  const answered = result !== null;
  const usedIds = new Set(slots.filter(Boolean).map((piece) => piece.id));
  const complete = slots.every(Boolean);

  function placePiece(piece) {
    if (answered) return;
    const target = slots[activeSlot] === null ? activeSlot : slots.findIndex((slot) => slot === null);
    if (target === -1) return;
    const next = slots.map((slot, i) => (i === target ? piece : slot));
    setSlots(next);
    const nextEmpty = next.findIndex((slot) => slot === null);
    setActiveSlot(nextEmpty === -1 ? target : nextEmpty);
  }

  function clickSlot(index) {
    if (answered) return;
    if (slots[index]) setSlots(slots.map((slot, i) => (i === index ? null : slot)));
    setActiveSlot(index);
  }

  function renderSlot(index) {
    const piece = slots[index];
    let state = index === activeSlot && !answered ? styles.slotActive : '';
    if (answered) state = piece?.value === task.answers[index] ? styles.slotGood : styles.slotBad;
    return (
      <button
        type="button"
        className={`${styles.slot} ${state}`}
        onClick={() => clickSlot(index)}
        disabled={answered}
        aria-label={piece ? t('tasks.gapFilled', { n: index + 1, value: piece.value }) : t('tasks.gapEmpty', { n: index + 1 })}
      >
        {piece ? piece.value : ' '}
      </button>
    );
  }

  return (
    <div>
      <p className={styles.question}>
        <RichText text={task.question} />
      </p>
      <CodeBlock code={task.code} renderSlot={renderSlot} />
      {!answered && (
        <>
          <p className={styles.poolTitle}>{t('tasks.pieces')}</p>
          <div className={styles.bank}>
            {bank.map((piece) => (
              <button
                key={piece.id}
                type="button"
                className={styles.piece}
                onClick={() => placePiece(piece)}
                disabled={usedIds.has(piece.id)}
              >
                {piece.value}
              </button>
            ))}
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!complete}
              onClick={() => onAnswer(slots.map((piece) => piece.value))}
            >
              {t('common.check')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
