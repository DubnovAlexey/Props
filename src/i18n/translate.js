// Перевод строк интерфейса. Чистые функции, без React и без браузера — их проверяют тесты.
//
// Словарь — обычный вложенный объект: { map: { title: 'Пещеры Графа Пропсулы' } }.
// Компонент просит строку по «адресу»: t('map.title'). В строке могут быть:
//   • места для подстановки в фигурных скобках: 'Пещера {n}' + { n: 3 } → 'Пещера 3';
//   • формы числа: вместо строки — объект { one, few, many, other }, и нужная форма
//     выбирается по числу count («1 пещера», «3 пещеры», «18 пещер»). Правила у каждого
//     языка свои, их знает сам браузер (Intl.PluralRules);
//   • список (массив) — например, шаги инструкции или реплики Графа: он отдаётся как есть.

/** Достаёт значение по адресу вида 'map.title'; если такого нет — undefined */
export function lookup(dictionary, key) {
  let node = dictionary;
  for (const part of key.split('.')) {
    if (node === null || typeof node !== 'object') return undefined;
    node = node[part];
  }
  return node;
}

/** Подставляет значения в места вида {имя}. Незнакомое место оставляет как есть — так заметнее ошибка */
export function interpolate(text, params) {
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match));
}

/** Объект с формами числа? У него есть форма other, а все значения — строки */
export function isPluralForms(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof value.other === 'string' &&
    Object.values(value).every((form) => typeof form === 'string')
  );
}

/**
 * Создаёт функцию перевода t(key, params) для языка.
 * @param {string} lang — код языка: по нему выбираются формы числа
 * @param {object} dictionary — словарь этого языка
 * @param {object} [fallback] — запасной словарь (русский): из него берётся строка, которой нет в основном
 */
export function createTranslator(lang, dictionary, fallback = dictionary) {
  const rules = new Intl.PluralRules(lang);

  return function t(key, params) {
    let value = lookup(dictionary, key);
    if (value === undefined) value = lookup(fallback, key);
    // Строки нет нигде — показываем сам адрес: по нему легко найти, что забыли перевести
    if (value === undefined) return key;

    if (isPluralForms(value)) value = value[rules.select(Number(params?.count ?? 0))] ?? value.other;
    return typeof value === 'string' && params ? interpolate(value, params) : value;
  };
}
