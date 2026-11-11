// Нижняя панель для телефона: до кнопок легко дотянуться большим пальцем.
import { TAB_NAV } from '../../app/navigation.js';
import { useI18n } from '../../i18n/I18nContext.jsx';
import styles from './Layout.module.css';

export default function TabBar({ section }) {
  const { t } = useI18n();

  return (
    <nav className={styles.tabbar} aria-label={t('common.sections')} data-fixed="bottom">
      {TAB_NAV.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={section === item.section ? styles.tabCurrent : undefined}
          aria-current={section === item.section ? 'page' : undefined}
        >
          <span className={styles.tabIcon} aria-hidden="true">
            {item.icon}
          </span>
          <span className={styles.tabLabel}>{t(`nav.${item.section}`)}</span>
        </a>
      ))}
    </nav>
  );
}
