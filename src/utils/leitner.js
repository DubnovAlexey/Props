// Интервальное повторение по системе Лейтнера («гробики Графа»).
// Каждая карточка или задача лежит в одном из 5 «гробиков».
// Ответил верно — переезжает в следующий и всплывает реже.
// Ошибся — возвращается в первый и всплывает сразу.
// Так мозг повторяет материал именно тогда, когда начинает его забывать.

export const DAY = 24 * 60 * 60 * 1000;

/** Через сколько дней повторить: индекс — номер гробика (1–5) */
export const INTERVAL_DAYS = [0, 0, 1, 3, 7, 16];

export const BOX_NAMES = ['', 'Каждый день', 'Через день', 'Через 3 дня', 'Через неделю', 'Через 16 дней'];

/**
 * Новое расписание элемента после ответа.
 * @param {{box:number, due:number, seen:number, lapses:number} | undefined} prev
 * @param {boolean} correct
 * @param {number} now — текущее время в миллисекундах
 */
export function schedule(prev, correct, now = Date.now()) {
  const prevBox = prev?.box ?? 1;
  const box = correct ? Math.min(5, prevBox + 1) : 1;
  return {
    box,
    due: now + INTERVAL_DAYS[box] * DAY,
    seen: (prev?.seen ?? 0) + 1,
    lapses: (prev?.lapses ?? 0) + (correct ? 0 : 1),
    last: now,
  };
}

/** Пора ли повторять элемент */
export function isDue(item, now = Date.now()) {
  return Boolean(item) && item.due <= now;
}

/** Идентификаторы элементов с нужной приставкой, которые пора повторить */
export function dueIds(items, prefix, now = Date.now()) {
  return Object.entries(items)
    .filter(([id, item]) => id.startsWith(prefix) && isDue(item, now))
    .sort((a, b) => a[1].due - b[1].due)
    .map(([id]) => id);
}

/** Сколько элементов лежит в каждом гробике: [_, n1, n2, n3, n4, n5] */
export function boxCounts(items, prefix = '') {
  const counts = [0, 0, 0, 0, 0, 0];
  for (const [id, item] of Object.entries(items)) {
    if (id.startsWith(prefix)) counts[item.box] += 1;
  }
  return counts;
}
