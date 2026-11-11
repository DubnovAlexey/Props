// Шапка: логотип, меню (на компьютере), опыт, серия дней, язык, звук и смена темы.
import { HEADER_NAV } from '../../app/navigation.js';
import { useProgress } from '../../state/ProgressContext.jsx';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { rankFor } from '../../utils/ranks.js';
import FlyingBats from '../../mascot/FlyingBats.jsx';
import styles from './Layout.module.css';
import { to } from '../../app/useHashRoute.js';

/**
 * Переключатель языка. Снаружи — глобус и код языка, а работает настоящий список
 * <select>: он лежит поверх прозрачным слоем. Так на телефоне открывается привычное
 * системное окно выбора, а с клавиатуры список листается стрелками — ничего не нужно
 * программировать самим.
 */
function LanguageSwitch() {
  const { lang, setLang, languages, t } = useI18n();

  return (
    <label className={styles.lang} title={t('lang.choose')}>
      <span aria-hidden="true">🌐</span>
      <span className={styles.langCode} aria-hidden="true">
        {lang}
      </span>
      <select className={styles.langSelect} aria-label={t('lang.choose')} value={lang} onChange={(event) => setLang(event.target.value)}>
        {languages.map((item) => (
          // lang на пункте — чтобы экранная читалка произнесла название на его языке
          <option key={item.code} value={item.code} lang={item.code}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Header({ section }) {
  const { progress, dispatch } = useProgress();
  const { t } = useI18n();
  const { current } = rankFor(progress.xp);
  const isNight = progress.theme === 'night';
  const soundOn = progress.sound !== false;

  return (
    <header className={styles.header}>
      <FlyingBats />
      <div className={styles.inner}>
        <a href={to.map()} className={styles.logo} aria-label={t('header.logoLabel')}>
          <span className={styles.moon} aria-hidden="true" />
          <span className={styles.logoText}>
            <b>Props</b>
            <small>{t('header.subtitle')}</small>
          </span>
        </a>

        <nav className={styles.nav} aria-label={t('common.sections')}>
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
              {t(`nav.${item.section}`)}
            </a>
          ))}
        </nav>

        <div className={styles.stats}>
          <span className={`chip ${styles.stat}`} title={t('header.rank', { rank: t('ranks')[current.id], xp: progress.xp })}>
            <span aria-hidden="true">{current.icon}</span>
            <span className="visually-hidden">{t('header.xp')}</span> {progress.xp}
          </span>
          {progress.streak.count > 1 && (
            <span className={`chip ${styles.stat}`} title={t('header.streak')}>
              <span aria-hidden="true">🔥</span> {progress.streak.count}
            </span>
          )}
          <LanguageSwitch />
          <button
            type="button"
            className={styles.theme}
            onClick={() => dispatch({ type: 'sound', sound: !soundOn })}
            aria-label={soundOn ? t('header.soundOff') : t('header.soundOn')}
            aria-pressed={soundOn}
            title={soundOn ? t('header.soundOnTitle') : t('header.soundOffTitle')}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <button
            type="button"
            className={styles.theme}
            onClick={() => dispatch({ type: 'theme', theme: isNight ? 'day' : 'night' })}
            aria-label={isNight ? t('header.themeDay') : t('header.themeNight')}
            title={isNight ? t('header.themeDayTitle') : t('header.themeNightTitle')}
          >
            {isNight ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
