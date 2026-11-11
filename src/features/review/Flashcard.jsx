// Карточка термина с переворотом. Сначала пытаешься вспомнить сам
// (активное вспоминание), потом переворачиваешь и честно оцениваешь себя.
import Spelling from '../../components/Spelling/Spelling.jsx';
import { sfx } from '../../audio/sfx.js';
import { useState } from 'react';
import styles from './Review.module.css';
import { useI18n } from '../../i18n/I18nContext.jsx';

export default function Flashcard({ entry, onRate }) {
  const { t } = useI18n();
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
        aria-label={flipped ? t('flashcard.labelBack', { title: entry.title }) : t('flashcard.labelFront', { title: entry.title })}
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
            <span className="eyebrow">{t('flashcard.question')}</span>
            <h2 className={styles.termTitle}>{entry.title}</h2>
            <p className="muted small">{t('flashcard.recall')}</p>
          </div>
          <div className={styles.back}>
            <span className="eyebrow">{entry.title}</span>
            <Spelling entry={entry} />
            <p>
              <b>{t('common.simple')}</b> {entry.simple}
            </p>
            {entry.tech && (
              <p className="muted">
                <b>{t('common.tech')}</b> {entry.tech}
              </p>
            )}
          </div>
        </div>
      </div>

      {flipped ? (
        <div className={styles.rate}>
          <button type="button" className="btn" onClick={() => onRate(false)}>
            {t('flashcard.forgot')}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onRate(true)}>
            {t('flashcard.remembered')}
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn-block" onClick={flip}>
          {t('flashcard.flip')}
        </button>
      )}
    </div>
  );
}
