// Шапка: логотип, меню (на компьютере), опыт, серия дней и смена темы.
import { HEADER_NAV } from '../../app/navigation.js';
import { useProgress } from '../../state/ProgressContext.jsx';
import { rankFor } from '../../utils/ranks.js';
import FlyingBats from '../../mascot/FlyingBats.jsx';
import styles from './Layout.module.css';
import { to } from '../../app/useHashRoute.js';

export default function Header({ section }) {
  const { progress, dispatch } = useProgress();
  const { current } = rankFor(progress.xp);
  const isNight = progress.theme === 'night';
  const soundOn = progress.sound !== false;

  return (
    <header className={styles.header}>
      <FlyingBats />
      <div className={styles.inner}>
        <a href={to.map()} className={styles.logo} aria-label="Props — на карту пещер">
          <span className={styles.moon} aria-hidden="true" />
          <span className={styles.logoText}>
            <b>Props</b>
            <small>Пещеры Графа Пропсулы</small>
          </span>
        </a>

        <nav className={styles.nav} aria-label="Разделы">
          {HEADER_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={section === item.section ? styles.current : undefined}
              aria-current={section === item.section ? 'page' : undefined}
            >
              <span className={styles.navIcon} aria-hidden="true">
                {item.icon}
              </span>{' '}
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.stats}>
          <span className={`chip ${styles.stat}`} title={`Ранг: ${current.title}. Опыт: ${progress.xp}`}>
            <span aria-hidden="true">{current.icon}</span>
            <span className="visually-hidden">Опыт:</span> {progress.xp}
          </span>
          {progress.streak.count > 1 && (
            <span className={`chip ${styles.stat}`} title="Дней подряд с Графом">
              <span aria-hidden="true">🔥</span> {progress.streak.count}
            </span>
          )}
          <button
            type="button"
            className={styles.theme}
            onClick={() => dispatch({ type: 'sound', sound: !soundOn })}
            aria-label={soundOn ? 'Выключить звуки' : 'Включить звуки'}
            aria-pressed={soundOn}
            title={soundOn ? 'Звуки ответов включены' : 'Звуки выключены'}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <button
            type="button"
            className={styles.theme}
            onClick={() => dispatch({ type: 'theme', theme: isNight ? 'day' : 'night' })}
            aria-label={isNight ? 'Включить дневную тему' : 'Включить ночную тему'}
            title={isNight ? 'Днём Граф недоволен, но терпит' : 'Вернуть ночь'}
          >
            {isNight ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
