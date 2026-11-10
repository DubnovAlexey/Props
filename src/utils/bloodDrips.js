// Расчёты для заголовков «в крови» (components/BloodTitle): с каких букв свисают потёки
// и как «пляшут» буквы. Чистые функции, без браузера — поэтому их легко проверить тестами.
// Выбор «случайный», но для одного и того же текста всегда одинаковый:
// число получаем из самого текста (хэш), а не из Math.random().
// Иначе потёки и наклон букв менялись бы при каждой перерисовке.

// Буквы с «хвостом» ниже строки не берём: потёк начинался бы посреди хвоста
const DESCENDERS = new Set([...'руфцщдРУФЦЩДqypgjQ']);
const LETTER = /\p{L}/u;

const round = (value, digits = 2) => Number(value.toFixed(digits));

/** Число из строки: одинаковый текст — одинаковое число */
export function hashText(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Генератор «случайных» чисел 0..1 с заданным началом: та же затравка — тот же ряд */
export function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Выбирает буквы для потёков.
 * @param {string[]} chars — символы заголовка по порядку
 * @returns {{ index: number, shift: number, length: number }[]}
 *   index — номер символа; shift — где под буквой висит потёк (доля её ширины, 0.3–0.7);
 *   length — длина в долях размера шрифта: длинный потёк (0.38–0.8) или капелька на кончике (0.14–0.28)
 */
export function pickDripLetters(chars) {
  const suitable = chars.flatMap((char, index) => (LETTER.test(char) && !DESCENDERS.has(char) ? [index] : []));
  if (suitable.length === 0) return [];

  const random = seededRandom(hashText(chars.join('')));
  // Крови немного: примерно один потёк на семь букв, от одного до четырёх на заголовок
  const count = Math.max(1, Math.min(4, Math.round(suitable.length / 7)));

  // делим подходящие буквы на равные отрезки и берём по одной из каждого —
  // так потёки расходятся по всему заголовку, а не сбиваются в кучу
  const step = suitable.length / count;
  return Array.from({ length: count }, (_, i) => {
    const from = Math.floor(i * step);
    const to = Math.max(from + 1, Math.floor((i + 1) * step));
    const index = suitable[from + Math.floor(random() * (to - from))];
    const shift = 0.3 + random() * 0.4;
    // через один: длинный потёк, потом короткая капелька — ритм получается живой
    const long = i % 2 === 0;
    const length = long ? 0.38 + random() * 0.42 : 0.14 + random() * 0.14;
    return { index, shift: round(shift, 3), length: round(length, 3) };
  });
}

/**
 * «Пляска» букв: каждую букву чуть поворачиваем, сдвигаем и меняем в размере —
 * строка перестаёт быть ровной, будто её выцарапали когтем. Изредка буква «особая»:
 * заметно крупнее и ниже соседей. Числа небольшие, чтобы заголовок легко читался.
 * @param {string[]} chars — символы слова
 * @param {string} [seedText] — из чего получать «случайность» (по умолчанию — само слово)
 * @returns {({ rotate: number, shift: number, scale: number } | null)[]}
 *   rotate — градусы; shift — сдвиг вниз в долях размера шрифта; scale — увеличение.
 *   Для знаков препинания и цифр — null: их не трогаем.
 */
export function letterJitter(chars, seedText = chars.join('')) {
  const random = seededRandom(hashText(seedText) ^ 0x9e3779b9);
  return chars.map((char) => {
    if (!LETTER.test(char)) return null;
    const special = random() < 0.16;
    return {
      rotate: round((random() - 0.5) * (special ? 9 : 5), 1),
      shift: round((random() - 0.5) * 0.07 + (special ? 0.035 : 0), 3),
      scale: round(special ? 1.1 + random() * 0.08 : 0.97 + random() * 0.07, 3),
    };
  });
}
