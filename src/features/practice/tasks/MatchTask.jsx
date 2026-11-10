// «Найди пару»: нажми элемент слева, затем подходящий справа.
// Пара получает общий номер и цвет. Нажатие на элемент пары разрывает её.
import { useMemo, useState } from 'react';
import { RichText } from '../../../components/RichText/RichText.jsx';
import { shuffleDifferent } from '../../../utils/random.js';
import styles from './tasks.module.css';

export default function MatchTask({ task, onAnswer, result }) {
  const rightOrder = useMemo(() => shuffleDifferent(task.pairs.map((_, i) => i)), [task]);
  const [pairs, setPairs] = useState({}); // { левый индекс: правый индекс }
  const [activeLeft, setActiveLeft] = useState(null);
  const [activeRight, setActiveRight] = useState(null);
  const answered = result !== null;

  const leftOf = (right) => Object.keys(pairs).find((left) => pairs[left] === right);
  const complete = Object.keys(pairs).length === task.pairs.length;

  function connect(left, right) {
    setPairs((current) => {
      const next = { ...current };
      for (const key of Object.keys(next)) if (next[key] === right) delete next[key];
      next[left] = right;
      return next;
    });
    setActiveLeft(null);
    setActiveRight(null);
  }

  function clickLeft(left) {
    if (answered) return;
    if (pairs[left] !== undefined) {
      setPairs(({ [left]: _removed, ...rest }) => rest);
      return;
    }
    if (activeRight !== null) connect(left, activeRight);
    else setActiveLeft(left === activeLeft ? null : left);
  }

  function clickRight(right) {
    if (answered) return;
    const pairedLeft = leftOf(right);
    if (pairedLeft !== undefined) {
      setPairs(({ [pairedLeft]: _removed, ...rest }) => rest);
      return;
    }
    if (activeLeft !== null) connect(activeLeft, right);
    else setActiveRight(right === activeRight ? null : right);
  }

  function stateFor(left) {
    if (!answered || pairs[left] === undefined) return '';
    return pairs[left] === Number(left) ? styles.correct : styles.wrong;
  }

  // Номер пары = порядковый номер левого элемента, у которого есть пара
  const pairNumber = (left) =>
    Object.keys(pairs)
      .map(Number)
      .sort((a, b) => a - b)
      .indexOf(Number(left));

  return (
    <div>
      <p className={styles.question}>
        <RichText text={task.question ?? 'Соедини пары.'} />
      </p>
      <div className={styles.columns}>
        <div className={styles.column}>
          {task.pairs.map(([leftText], left) => {
            const paired = pairs[left] !== undefined;
            const number = pairNumber(left);
            return (
              <button
                key={left}
                type="button"
                className={`${styles.option} ${activeLeft === left ? styles.active : ''} ${paired && !answered ? styles.selected : ''} ${stateFor(left)}`}
                onClick={() => clickLeft(left)}
                disabled={answered}
              >
                {paired && <span className={`${styles.badge} ${styles[`c${number % 5}`]}`}>{number + 1}</span>}
                <RichText text={leftText} interactive={false} />
              </button>
            );
          })}
        </div>
        <div className={styles.column}>
          {rightOrder.map((right) => {
            const left = leftOf(right);
            const paired = left !== undefined;
            const number = paired ? pairNumber(left) : -1;
            return (
              <button
                key={right}
                type="button"
                className={`${styles.option} ${activeRight === right ? styles.active : ''} ${paired && !answered ? styles.selected : ''} ${paired ? stateFor(left) : ''}`}
                onClick={() => clickRight(right)}
                disabled={answered}
              >
                {paired && <span className={`${styles.badge} ${styles[`c${number % 5}`]}`}>{number + 1}</span>}
                <RichText text={task.pairs[right][1]} interactive={false} />
              </button>
            );
          })}
        </div>
      </div>
      {!answered && (
        <div className={styles.actions}>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!complete}
            onClick={() => onAnswer(Object.fromEntries(Object.entries(pairs).map(([l, r]) => [Number(l), r])))}
          >
            Проверить
          </button>
        </div>
      )}
    </div>
  );
}
