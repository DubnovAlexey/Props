// Даты для серии дней (streak): сравниваем календарные дни, а не часы.

/** '2026-11-10' по местному времени */
export function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Сколько календарных дней между двумя ключами вида '2026-11-10' */
export function daysBetween(fromKey, toKey) {
  const from = new Date(fromKey + 'T00:00:00');
  const to = new Date(toKey + 'T00:00:00');
  return Math.round((to - from) / (24 * 60 * 60 * 1000));
}
