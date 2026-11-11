// «Заклинание» — короткая рифма-мнемоника главы.
// Кнопка «Прочитать вслух» использует встроенный синтез речи браузера:
// произнесённое вслух запоминается лучше прочитанного про себя (эффект продукции).
import { useEffect } from 'react';
import { RichText } from '../RichText/RichText.jsx';
import styles from './Spell.module.css';
import { useI18n } from '../../i18n/I18nContext.jsx';

const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

export default function Spell({ spell }) {
  const { t } = useI18n();
  // Ушли со страницы — замолкаем: функция очистки эффекта выполняется при размонтировании
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function speak() {
    const utterance = new SpeechSynthesisUtterance(spell.text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className={styles.scroll}>
      <span className="eyebrow">{t('spell.eyebrow')}</span>
      <p className={styles.text}>«{spell.text}»</p>
      {spell.meaning && (
        <p className={styles.meaning}>
          <RichText text={spell.meaning} />
        </p>
      )}
      <div className="row">
        {canSpeak && (
          <button type="button" className="btn btn-small" onClick={speak}>
            {t('spell.read')}
          </button>
        )}
        <span className="muted small">{t('spell.hint')}</span>
      </div>
    </div>
  );
}
