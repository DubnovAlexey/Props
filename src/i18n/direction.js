// Направление письма по самим буквам текста. Чистые функции — их проверяют тесты.
// Нужны заголовкам (components/BloodTitle): там каждая буква — отдельный блок, и браузер
// уже не может сам правильно расставить слова, когда в одной строке встречаются иврит
// (справа налево) и русский или английский (слева направо).

// Буквы, которые пишутся справа налево: иврит, арабский и их дополнительные блоки
const RTL_LETTERS = /[\u0590-\u08ff\ufb1d-\ufdff\ufe70-\ufeff]/;
const RTL_LETTERS_ALL = new RegExp(RTL_LETTERS.source, 'g');

/** 'rtl', если в тексте есть хотя бы одна буква, которая пишется справа налево; иначе 'ltr' */
export function textDirection(text) {
  return RTL_LETTERS.test(text) ? 'rtl' : 'ltr';
}

/**
 * Каким письмом написано слово:
 *   'rtl'   — только буквами «справа налево» (иврит);
 *   'ltr'   — только буквами «слева направо» (русский, английский…);
 *   'mixed' — и теми и другими («ל‑props»);
 *   'none'  — букв нет вовсе (число, тире).
 */
export function wordScript(word) {
  const rtl = RTL_LETTERS.test(word);
  const ltr = /\p{L}/u.test(word.replace(RTL_LETTERS_ALL, ''));
  if (rtl && ltr) return 'mixed';
  if (rtl) return 'rtl';
  return ltr ? 'ltr' : 'none';
}
