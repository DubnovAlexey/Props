// Нижняя панель для телефона: до кнопок легко дотянуться большим пальцем.
import { TAB_NAV } from '../../app/navigation.js';
import styles from './Layout.module.css';

export default function TabBar({ section }) {
  return (
    <nav className={styles.tabbar} aria-label="Разделы">
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
          <span className={styles.tabLabel}>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
