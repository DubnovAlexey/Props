// Общие проверки заданий. Ими пользуются и тесты русского содержимого (content.test.js),
// и тесты переводов (translation.test.js): перевод не должен сломать ни одно задание.
// Файл не заканчивается на .test.js, поэтому сам как набор тестов не запускается.
import { expect } from 'vitest';
import { checkers } from '../src/utils/checkAnswer.js';

/** Правильный ответ, собранный из данных задания */
export function correctValue(task) {
  switch (task.type) {
    case 'choice':
      return task.options.flatMap((option, i) => (option.correct ? [i] : []));
    case 'truefalse':
      return task.answer;
    case 'input':
      return task.answers[0];
    case 'fill':
      return [...task.answers];
    case 'bug':
      return task.bugLine;
    case 'order':
      return task.items.map((_, i) => i);
    case 'match':
      return Object.fromEntries(task.pairs.map((_, i) => [i, i]));
    case 'sort':
      return task.items.map((item) => item.bin);
    default:
      throw new Error(task.type);
  }
}

/** Заведомо неверный ответ */
export function wrongValue(task) {
  switch (task.type) {
    case 'choice':
      return [task.options.findIndex((option) => !option.correct)];
    case 'truefalse':
      return !task.answer;
    case 'input':
      return 'заведомо неверный ответ';
    case 'fill':
      return task.answers.map(() => '???');
    case 'bug':
      return task.bugLine === 1 ? 2 : 1;
    case 'order':
      return task.items.map((_, i) => i).reverse();
    case 'match':
      return Object.fromEntries(task.pairs.map((_, i) => [i, (i + 1) % task.pairs.length]));
    case 'sort':
      return task.items.map((item) => (item.bin + 1) % task.bins.length);
    default:
      throw new Error(task.type);
  }
}

/** Данные задания корректны: есть пояснение, верный вариант, пропусков столько же, сколько ответов… */
export function expectValidTask(task) {
  expect(Object.keys(checkers)).toContain(task.type);
  expect(task.explain, 'нужно пояснение').toBeTruthy();

  if (task.type === 'choice') {
    expect(task.options.length).toBeGreaterThanOrEqual(2);
    expect(task.options.some((o) => o.correct)).toBe(true);
    for (const option of task.options.filter((o) => !o.correct)) {
      expect(option.why, `нет объяснения для «${option.text}»`).toBeTruthy();
    }
  }
  if (task.type === 'truefalse') expect(typeof task.answer).toBe('boolean');
  if (task.type === 'input') expect(task.answers.length).toBeGreaterThan(0);
  if (task.type === 'fill') {
    const blanks = task.code.split('___').length - 1;
    expect(blanks, 'пропусков столько же, сколько ответов').toBe(task.answers.length);
    const bank = [...task.bank];
    for (const answer of task.answers) {
      const index = bank.indexOf(answer);
      expect(index, `кусочка «${answer}» нет в банке`).toBeGreaterThanOrEqual(0);
      bank.splice(index, 1);
    }
    expect(bank.length, 'нужен хотя бы один лишний кусочек').toBeGreaterThan(0);
  }
  if (task.type === 'bug') {
    const lines = task.code.split('\n').length;
    expect(task.bugLine).toBeGreaterThanOrEqual(1);
    expect(task.bugLine).toBeLessThanOrEqual(lines);
    expect(task.fix).toBeTruthy();
  }
  if (task.type === 'order') expect(task.items.length).toBeGreaterThanOrEqual(3);
  if (task.type === 'match') {
    expect(task.pairs.length).toBeGreaterThanOrEqual(3);
    expect(new Set(task.pairs.map(([, right]) => right)).size).toBe(task.pairs.length);
  }
  if (task.type === 'sort') {
    expect(task.bins.length).toBeGreaterThanOrEqual(2);
    for (const item of task.items) expect(item.bin).toBeLessThan(task.bins.length);
  }
}
