// Где показать всплывающее окно с пояснением термина. Чистая функция — её проверяют тесты.
//
// Окно ставим над термином; не помещается — под ним; не помещается и там — с той стороны,
// где места больше, и ограничиваем его высоту (внутри окна появится прокрутка).
// По горизонтали окно стоит по центру термина, но не вылезает за края экрана.
//
//   anchor — прямоугольник термина: { top, bottom, left, width };
//   tip    — размеры окна: { width, height };
//   area   — свободная часть экрана: { top, bottom, width } — между шапкой и нижней панелью;
//   gap    — отступ от краёв экрана и от термина.

/** Ниже этой высоты окно не сжимаем: в нём должно остаться место хотя бы для заголовка и пары строк */
export const MIN_TIP_HEIGHT = 120;

export function placeTip(anchor, tip, area, gap = 8) {
  const above = anchor.top - area.top - gap * 2; // свободное место над термином
  const below = area.bottom - anchor.bottom - gap * 2; // и под ним
  const centered = anchor.left + anchor.width / 2 - tip.width / 2;
  const left = Math.max(gap, Math.min(area.width - tip.width - gap, centered));

  if (tip.height <= above) return { left, top: anchor.top - gap - tip.height, maxHeight: null };
  if (tip.height <= below) return { left, top: anchor.bottom + gap, maxHeight: null };

  // Целиком не помещается ни сверху, ни снизу — занимаем сторону, где просторнее
  if (above >= below) {
    const maxHeight = Math.max(MIN_TIP_HEIGHT, above);
    return { left, top: anchor.top - gap - maxHeight, maxHeight };
  }
  return { left, top: anchor.bottom + gap, maxHeight: Math.max(MIN_TIP_HEIGHT, below) };
}
