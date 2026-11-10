// «Заклинание» — короткая рифма-мнемоника главы.
// Кнопка «Прочитать вслух» использует встроенный синтез речи браузера:
// произнесённое вслух запоминается лучше прочитанного про себя (эффект продукции).
import { RichText } from '../RichText/RichText.jsx';
import styles from './Spell.module.css';

const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

export default function Spell({ spell }) {
  function speak() {
    const utterance = new SpeechSynthesisUtterance(spell.text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className={styles.scroll}>
      <span className="eyebrow">Заклинание Графа</span>
      <p className={styles.text}>«{spell.text}»</p>
      {spell.meaning && (
        <p className={styles.meaning}>
          <RichText text={spell.meaning} />
        </p>
      )}
      <div className="row">
        {canSpeak && (
          <button type="button" className="btn btn-small" onClick={speak}>
            🔊 Прочитать вслух
          </button>
        )}
        <span className="muted small">Произнеси вслух три раза — так запоминается крепче.</span>
      </div>
    </div>
  );
}
