// Карточка термина с переворотом. Сначала пытаешься вспомнить сам
// (активное вспоминание), потом переворачиваешь и честно оцениваешь себя.
import Spelling from '../../components/Spelling/Spelling.jsx';
import { sfx } from '../../audio/sfx.js';
import { useState } from 'react';
import styles from './Review.module.css';

export default function Flashcard({ entry, onRate }) {
  const [flipped, setFlipped] = useState(false);

  function flip() {
    sfx.flip();
    setFlipped((value) => !value);
  }

  return (
    <div className="stack">
      <div
        className={`${styles.flashcard} ${flipped ? styles.flipped : ''}`}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={flipped ? `Пояснение термина ${entry.title}` : `Термин ${entry.title}. Нажми, чтобы перевернуть`}
        onClick={flip}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            flip();
          }
        }}
      >
        <div className={styles.inner}>
          <div className={styles.front}>
            <span className="eyebrow">Что это простыми словами?</span>
            <h2 className={styles.termTitle}>{entry.title}</h2>
            <p className="muted small">Вспомни сам, потом нажми на карточку</p>
          </div>
          <div className={styles.back}>
            <span className="eyebrow">{entry.title}</span>
            <Spelling entry={entry} />
            <p>
              <b>Простыми словами:</b> {entry.simple}
            </p>
            {entry.tech && (
              <p className="muted">
                <b>Технически:</b> {entry.tech}
              </p>
            )}
          </div>
        </div>
      </div>

      {flipped ? (
        <div className={styles.rate}>
          <button type="button" className="btn" onClick={() => onRate(false)}>
            😖 Не вспомнил
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onRate(true)}>
            😊 Вспомнил
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn-block" onClick={flip}>
          Перевернуть карточку
        </button>
      )}
    </div>
  );
}
