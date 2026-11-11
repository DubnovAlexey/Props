// Пункты меню. Один массив данных — два компонента (шапка и нижняя панель)
// получают его и рисуют по-своему. Данные отдельно, отображение отдельно.
//   section — имя раздела; по нему же берётся подпись из словаря: t(`nav.${section}`);
//   header: false — не показывать в шапке; tab: false — не показывать
//   в нижней панели телефона (там помещается только пять кнопок).
import { to } from './useHashRoute.js';

export const NAV = [
  { href: to.map(), section: 'map', icon: '🗺️' },
  { href: to.library(), section: 'library', icon: '📜' },
  { href: to.review(), section: 'review', icon: '⚰️' },
  { href: to.glossary(), section: 'glossary', icon: '🔤' },
  { href: to.bestiary(), section: 'bestiary', icon: '👹' },
  { href: to.break(), section: 'break', icon: '🦇', tab: false },
  { href: to.methods(), section: 'methods', icon: '🧠', tab: false, header: false },
];

export const HEADER_NAV = NAV.filter((item) => item.header !== false);
export const TAB_NAV = NAV.filter((item) => item.tab !== false);
