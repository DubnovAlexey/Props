// Пункты меню. Один массив данных — два компонента (шапка и нижняя панель)
// получают его и рисуют по-своему. Данные отдельно, отображение отдельно.
//   header: false — не показывать в шапке; tab: false — не показывать
//   в нижней панели телефона (там помещается только пять кнопок).
import { to } from './useHashRoute.js';

export const NAV = [
  { href: to.map(), section: 'map', icon: '🗺️', label: 'Карта' },
  { href: to.library(), section: 'library', icon: '📜', label: 'Свитки' },
  { href: to.review(), section: 'review', icon: '⚰️', label: 'Повторение' },
  { href: to.glossary(), section: 'glossary', icon: '🔤', label: 'Словарь' },
  { href: to.bestiary(), section: 'bestiary', icon: '👹', label: 'Бестиарий' },
  { href: to.break(), section: 'break', icon: '🦇', label: 'Перемена', tab: false },
  { href: to.methods(), section: 'methods', icon: '🧠', label: 'Методика', tab: false, header: false },
];

export const HEADER_NAV = NAV.filter((item) => item.header !== false);
export const TAB_NAV = NAV.filter((item) => item.tab !== false);
