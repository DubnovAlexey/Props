// Реплики Графа Пропсулы. Сами тексты лежат в словарях интерфейса
// (src/i18n/ui/*.js, раздел mascot) — на каждом языке свои. Здесь — только выбор:
// из списка реплик нужного вида берётся случайная, чтобы Граф не повторялся.
import { pick } from '../utils/random.js';

/**
 * Случайная реплика Графа.
 * @param {(key: string) => any} t — функция перевода из useI18n()
 * @param {string} kind — вид реплики: 'greet', 'correct', 'wrong', 'hint', 'chapterDone', 'chapterFail'…
 */
export function phrase(t, kind) {
  const variants = t(`mascot.phrases.${kind}`);
  return Array.isArray(variants) ? pick(variants) : String(variants);
}
