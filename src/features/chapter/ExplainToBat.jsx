// «Объясни Лунатику» — метод резиновой уточки, только с летучей мышью.
// Когда объясняешь своими словами, мозг сам находит пробелы в понимании
// (самообъяснение и эффект протеже — «учу другого — учусь сам»).
// Проверка простая: ищем ключевые идеи по словам-маркерам и показываем,
// что получилось, а затем — объяснение Графа для сравнения.
import { useState } from 'react';
import Bat from '../../mascot/Bat.jsx';
import { RichText } from '../../components/RichText/RichText.jsx';
import styles from './Chapter.module.css';

export default function ExplainToBat({ explain, initialText = '', onDone }) {
  const [text, setText] = useState(initialText);
  const [checked, setChecked] = useState(false);
  const lower = text.toLowerCase().replace(/ё/g, 'е');
  const ideas = explain.keywords.map((idea) => ({
    ...idea,
    found: idea.words.some((word) => lower.includes(word.toLowerCase().replace(/ё/g, 'е'))),
  }));
  const foundCount = ideas.filter((idea) => idea.found).length;

  function addStarter(starter) {
    setText((current) => (current.trim() ? `${current.trim()} ${starter}` : starter));
  }

  return (
    <div className="card">
      <div className={styles.batHead}>
        <Bat size={70} label="Лунатик" />
        <div>
          <span className="eyebrow">Метод летучей мыши</span>
          <h2>Объясни Лунатику</h2>
        </div>
      </div>
      <p>
        <RichText text={explain.prompt} />
      </p>
      <p className="muted small">Своими словами, 2–4 предложения. Лунатик не оценивает стиль — только смысл. Можно начать так:</p>
      <div className="row">
        {explain.starters.map((starter) => (
          <button key={starter} type="button" className={`chip ${styles.starter}`} onClick={() => addStarter(starter)} disabled={checked}>
            {starter}
          </button>
        ))}
      </div>
      <label className="visually-hidden" htmlFor="explain-text">
        Твоё объяснение
      </label>
      <textarea
        id="explain-text"
        className={`input ${styles.explainInput}`}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Лунатик внимательно слушает…"
        disabled={checked}
      />

      {!checked ? (
        <div className="row">
          <button type="button" className="btn btn-primary" disabled={text.trim().length < 20} onClick={() => setChecked(true)}>
            Объяснить
          </button>
          <span className="muted small">{text.trim().length < 20 ? 'Хотя бы одно предложение' : 'Готово к объяснению'}</span>
        </div>
      ) : (
        <div className={`${styles.explainResult} anim-pop`}>
          <p>
            <b>
              Лунатик понял {foundCount} из {ideas.length} ключевых идей:
            </b>
          </p>
          <ul className={styles.checklist}>
            {ideas.map((idea) => (
              <li key={idea.label} className={idea.found ? styles.found : styles.missed}>
                <span aria-hidden="true">{idea.found ? '✓' : '○'}</span> {idea.label}
              </li>
            ))}
          </ul>
          <p>
            <b>Объяснение Графа для сравнения:</b>
          </p>
          <blockquote className={styles.model}>{explain.model}</blockquote>
          <div className="row">
            <button type="button" className="btn" onClick={() => setChecked(false)}>
              Дополнить
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onDone(text)}>
              Сохранить и дальше →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
