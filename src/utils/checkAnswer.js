// Проверка ответов для всех типов заданий. Чистые функции —
// их легко тестировать (см. tests/logic.test.js).

/** Для кода: регистр и пробелы не важны, кавычки любые */
export function normalizeCode(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/["\x60]/g, "'")
    .replace(/;$/, '');
}

/** Для слов: только буквы и цифры, «ё» = «е» */
export function normalizeLoose(value) {
  return String(value)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]/g, '');
}

function sameSet(a, b) {
  return a.length === b.length && a.every((item) => b.includes(item));
}

export const checkers = {
  /** value — массив индексов выбранных вариантов (в исходном порядке) */
  choice(task, value) {
    const correct = task.options.flatMap((option, i) => (option.correct ? [i] : []));
    return sameSet(correct, value);
  },
  /** value — true или false */
  truefalse(task, value) {
    return value === task.answer;
  },
  /** value — строка, которую ввёл ученик */
  input(task, value) {
    const normalize = task.loose ? normalizeLoose : normalizeCode;
    return task.answers.some((answer) => normalize(answer) === normalize(value));
  },
  /** value — массив строк, вставленных в пропуски */
  fill(task, value) {
    return task.answers.length === value.length && task.answers.every((answer, i) => value[i] === answer);
  },
  /** value — номер строки (с 1) */
  bug(task, value) {
    return value === task.bugLine;
  },
  /** value — массив исходных индексов в выбранном порядке */
  order(task, value) {
    return value.length === task.items.length && value.every((index, position) => index === position);
  },
  /** value — объект { индекс слева: индекс справа } */
  match(task, value) {
    return task.pairs.every((_, i) => value[i] === i);
  },
  /** value — массив: номер корзины для каждого элемента */
  sort(task, value) {
    return task.items.every((item, i) => value[i] === item.bin);
  },
};

/** Общая точка входа: проверить ответ на любое задание */
export function checkTask(task, value) {
  const checker = checkers[task.type];
  if (!checker) throw new Error(`Неизвестный тип задания: ${task.type}`);
  return checker(task, value);
}
