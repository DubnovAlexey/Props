// Перевод «поверх» оригинала. Чистые функции, без React и без браузера — их проверяют тесты.
//
// Уроки написаны по-русски: это оригинал. Перевод на другой язык — «накладка»: объект той же
// формы, но в нём только то, что нужно заменить, — текст. Всё остальное (id, значки, какой
// ответ верный, номер строки с ошибкой) берётся из оригинала. Поэтому перевод не может
// случайно сломать задание: правильные ответы в нём просто не записаны.
//
//   localize({ id: 'a', text: 'Привет', correct: true }, { text: 'Hello' })
//   → { id: 'a', text: 'Hello', correct: true }
//
// Правила наложения:
//   • значения в накладке нет (undefined) — остаётся оригинал;
//   • объект на объект — складываем по ключам, и так на любую глубину;
//   • список объектов (варианты ответа, карточки урока) — складываем по номерам: первый с первым;
//   • список простых значений (абзацы, слова-маркеры) — заменяем целиком;
//   • простое значение (строка, число) — заменяем.

const isObject = (value) => value !== null && typeof value === 'object';

/** Накладывает перевод на оригинал и возвращает новый объект; оригинал не меняется */
export function localize(base, overlay) {
  if (overlay === undefined) return base;

  if (Array.isArray(base)) {
    if (!Array.isArray(overlay)) return base;
    // Список простых значений переводится целиком: слов-маркеров в другом языке может быть больше
    if (!base.some(isObject)) return overlay;
    return base.map((item, index) => localize(item, overlay[index]));
  }

  if (isObject(base)) {
    if (!isObject(overlay) || Array.isArray(overlay)) return base;
    const result = { ...base };
    for (const [key, value] of Object.entries(overlay)) result[key] = localize(base[key], value);
    return result;
  }

  return overlay;
}

/**
 * Проверка накладки: всё ли в ней ложится на оригинал. Возвращает список замечаний (пустой —
 * всё хорошо). Нужна тестам: опечатку в названии поля или потерянный вариант ответа иначе
 * никто бы не заметил — игра молча показала бы русский текст.
 * @param {*} base — оригинал
 * @param {*} overlay — накладка с переводом
 * @param {object} [options]
 * @param {(path: string) => boolean} [options.freeLength] — у каких списков длина может отличаться
 * @param {(path: string, base: string, overlay: string) => string[]} [options.checkText] —
 *        своя проверка для каждой пары «русская строка — перевод»; возвращает замечания
 * @param {string} [path] — «адрес» проверяемого места: он попадает в текст замечаний
 */
export function overlayProblems(base, overlay, options = {}, path = '') {
  const { freeLength = () => false, checkText = () => [] } = options;
  const problems = [];

  function visit(baseValue, overlayValue, where) {
    if (overlayValue === undefined) return;

    if (Array.isArray(baseValue)) {
      if (!Array.isArray(overlayValue)) {
        problems.push(`${where}: в оригинале список, в переводе — нет`);
        return;
      }
      if (freeLength(where)) return;
      if (baseValue.length !== overlayValue.length) {
        problems.push(`${where}: в оригинале элементов ${baseValue.length}, в переводе ${overlayValue.length}`);
        return;
      }
      overlayValue.forEach((item, index) => visit(baseValue[index], item, `${where}[${index}]`));
      return;
    }

    if (isObject(baseValue)) {
      if (!isObject(overlayValue) || Array.isArray(overlayValue)) {
        problems.push(`${where}: в оригинале объект, в переводе — нет`);
        return;
      }
      for (const [key, value] of Object.entries(overlayValue)) {
        if (key in baseValue) visit(baseValue[key], value, `${where}.${key}`);
        else problems.push(`${where}.${key}: такого поля нет в оригинале`);
      }
      return;
    }

    if (typeof baseValue !== typeof overlayValue) {
      problems.push(`${where}: в оригинале ${typeof baseValue}, в переводе ${typeof overlayValue}`);
      return;
    }
    if (typeof baseValue === 'string') problems.push(...checkText(where, baseValue, overlayValue));
  }

  visit(base, overlay, path);
  return problems;
}
