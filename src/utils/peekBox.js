// Где стоит крупная копия портрета, который вырос под мышью (хук useHoverZoom).
// Правило владельца (14.11.2026): картинки в небольших окошках при наведении растут серьёзно —
// портрет и квадрат примерно в 2,5 раза, широкая картинка в 3, — а не «чуть-чуть дёргаются».
// Чистая функция: получает прямоугольники, ничего не читает со страницы — её проверяют тесты.

export const ZOOM_TALL = 2.5; // портрет и квадрат
export const ZOOM_WIDE = 3; // широкая картинка (шире 4:3)
export const ZOOM_MARGIN = 14; // отступ от края окна

/**
 * Крупная копия: k × ширина картинки, целиком в своих пропорциях, ужатая до окна,
 * по центру над своей картинкой и сдвинутая внутрь полей окна.
 * @param {{ left: number, top: number, width: number, height: number }} rect — где картинка сейчас
 * @param {number} ratio — ширина / высота картинки
 * @param {{ width: number, height: number }} view — размер окна
 * @returns {{ left: number, top: number, width: number, height: number }}
 */
export function peekBox(rect, ratio, view) {
  const k = ratio > 4 / 3 ? ZOOM_WIDE : ZOOM_TALL;
  let width = rect.width * k;
  let height = width / ratio;
  const fit = Math.min(1, (view.width - ZOOM_MARGIN * 2) / width, (view.height - ZOOM_MARGIN * 2) / height);
  width *= fit;
  height *= fit;
  const clamp = (value, size, limit) => Math.min(Math.max(value, ZOOM_MARGIN), limit - size - ZOOM_MARGIN);
  return {
    left: clamp(rect.left + rect.width / 2 - width / 2, width, view.width),
    top: clamp(rect.top + rect.height / 2 - height / 2, height, view.height),
    width,
    height,
  };
}
