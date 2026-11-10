// Тесты чистой логики: повторения, разметка, проверка ответов, прогресс, подсветка.
import { describe, expect, it } from 'vitest';
import { DAY, INTERVAL_DAYS, boxCounts, dueIds, schedule } from '../src/utils/leitner.js';
import { groupBlocks, parseInline, stripMarkup } from '../src/utils/richText.js';
import { checkTask, normalizeCode, normalizeLoose } from '../src/utils/checkAnswer.js';
import { initialProgress, progressReducer, restore, XP } from '../src/state/progressReducer.js';
import { tokenizeLine } from '../src/utils/highlight.js';
import { rankFor, RANKS } from '../src/utils/ranks.js';
import { daysBetween } from '../src/utils/dates.js';
import { parseHash } from '../src/app/useHashRoute.js';

describe('Лейтнер', () => {
  const now = 1_000_000;

  it('новый верный ответ — во второй гробик, через день', () => {
    const item = schedule(undefined, true, now);
    expect(item.box).toBe(2);
    expect(item.due).toBe(now + INTERVAL_DAYS[2] * DAY);
  });

  it('ошибка возвращает в первый гробик и делает элемент срочным', () => {
    const item = schedule({ box: 4, due: 0, seen: 3, lapses: 0 }, false, now);
    expect(item.box).toBe(1);
    expect(item.due).toBe(now);
    expect(item.lapses).toBe(1);
  });

  it('пятый гробик — потолок', () => {
    expect(schedule({ box: 5, due: 0, seen: 9, lapses: 0 }, true, now).box).toBe(5);
  });

  it('dueIds и boxCounts учитывают приставку', () => {
    const items = {
      'task:a': { box: 1, due: now - 1 },
      'task:b': { box: 3, due: now + DAY },
      'term:c': { box: 2, due: now - 5 },
    };
    expect(dueIds(items, 'task:', now)).toEqual(['task:a']);
    expect(dueIds(items, '', now)).toEqual(['term:c', 'task:a']);
    expect(boxCounts(items, 'task:')).toEqual([0, 1, 0, 1, 0, 0]);
  });
});

describe('мини-разметка', () => {
  it('разбирает жирный, код и термины', () => {
    expect(parseInline('Это **важно**, `код` и [[props|пропсы]].')).toEqual([
      { type: 'text', value: 'Это ' },
      { type: 'bold', value: 'важно' },
      { type: 'text', value: ', ' },
      { type: 'code', value: 'код' },
      { type: 'text', value: ' и ' },
      { type: 'term', id: 'props', label: 'пропсы' },
      { type: 'text', value: '.' },
    ]);
  });

  it('stripMarkup убирает разметку', () => {
    expect(stripMarkup('**Пропсы** — [[props|посылка]] и [[key]]', (id) => id.toUpperCase())).toBe('Пропсы — посылка и KEY');
  });

  it('строки с «- » собираются в список', () => {
    expect(groupBlocks(['Текст', '- раз', '- два', 'Ещё'])).toEqual([
      { type: 'p', text: 'Текст' },
      { type: 'ul', items: ['раз', 'два'] },
      { type: 'p', text: 'Ещё' },
    ]);
  });
});

describe('проверка ответов', () => {
  it('нормализация кода игнорирует пробелы, регистр и вид кавычек', () => {
    expect(normalizeCode(' { Title } ')).toBe(normalizeCode('{title}'));
    expect(normalizeCode('"a"')).toBe(normalizeCode("'a'"));
  });

  it('«свободная» нормализация оставляет только буквы и цифры', () => {
    expect(normalizeLoose('Подъём  состояния!')).toBe(normalizeLoose('подъем состояния'));
  });

  it('множественный выбор требует ровно верный набор', () => {
    const task = { type: 'choice', options: [{ correct: true }, { correct: true }, {}] };
    expect(checkTask(task, [1, 0])).toBe(true);
    expect(checkTask(task, [0])).toBe(false);
    expect(checkTask(task, [0, 1, 2])).toBe(false);
  });

  it('неизвестный тип — понятная ошибка', () => {
    expect(() => checkTask({ type: 'magic' }, 1)).toThrow('Неизвестный тип');
  });
});

describe('прогресс', () => {
  it('серия дней растёт подряд и сбрасывается после пропуска', () => {
    let state = progressReducer(initialProgress, { type: 'visit', today: '2026-11-10' });
    state = progressReducer(state, { type: 'visit', today: '2026-11-11' });
    expect(state.streak.count).toBe(2);
    state = progressReducer(state, { type: 'visit', today: '2026-11-11' });
    expect(state.streak.count).toBe(2);
    state = progressReducer(state, { type: 'visit', today: '2026-11-14' });
    expect(state.streak.count).toBe(1);
  });

  it('ответ даёт опыт, статистику и расписание', () => {
    const state = progressReducer(initialProgress, { type: 'answer', itemId: 'task:x', correct: true, xp: XP.correct, now: 5 });
    expect(state.xp).toBe(XP.correct);
    expect(state.stats).toEqual({ answered: 1, correct: 1 });
    expect(state.items['task:x'].box).toBe(2);
    expect(initialProgress.items).toEqual({}); // исходное состояние не изменилось
  });

  it('этап главы засчитывается один раз', () => {
    let state = progressReducer(initialProgress, { type: 'step', chapterId: 'flow', step: 'lesson' });
    state = progressReducer(state, { type: 'step', chapterId: 'flow', step: 'lesson' });
    expect(state.xp).toBe(XP.step);
  });

  it('практика хранит лучший результат, бонус — один раз', () => {
    let state = progressReducer(initialProgress, { type: 'practice', chapterId: 'flow', score: 0.75 });
    state = progressReducer(state, { type: 'practice', chapterId: 'flow', score: 0.5 });
    expect(state.chapters.flow.practiceBest).toBe(0.75);
    expect(state.xp).toBe(XP.chapter);
  });

  it('restore подставляет недостающие поля и отбрасывает чужую версию', () => {
    expect(restore({ version: 1, xp: 7 }).streak).toEqual(initialProgress.streak);
    expect(restore({ version: 99, xp: 7 })).toBe(initialProgress);
    expect(restore(null)).toBe(initialProgress);
  });

  it('reset сохраняет тему', () => {
    const state = progressReducer({ ...initialProgress, xp: 100, theme: 'day' }, { type: 'reset' });
    expect(state.xp).toBe(0);
    expect(state.theme).toBe('day');
  });
});

describe('мелочи', () => {
  it('подсветка распознаёт тег, атрибут, строку и выражение', () => {
    const types = tokenizeLine('<Card title="Сыр" count={2} />').map((t) => t.type);
    expect(types).toContain('tag');
    expect(types).toContain('attr');
    expect(types).toContain('string');
    expect(types).toContain('number');
  });

  it('комментарий не разбирается на части', () => {
    expect(tokenizeLine('// <Card /> = 1')).toEqual([{ type: 'comment', value: '// <Card /> = 1' }]);
  });

  it('ранги растут с опытом', () => {
    expect(rankFor(0).current).toBe(RANKS[0]);
    expect(rankFor(RANKS[2].min).current).toBe(RANKS[2]);
    expect(rankFor(99999).next).toBeNull();
  });

  it('разница дней и разбор адреса', () => {
    expect(parseHash('#chapter-js-basics')).toEqual({ path: 'chapter-js-basics', parts: ['chapter', 'js-basics'], query: {} });
    expect(parseHash('#glossary-strict-mode')).toEqual({ path: 'glossary', parts: ['glossary'], query: { term: 'strict-mode' } });
    expect(parseHash('#review').parts).toEqual(['review']);
    expect(daysBetween('2026-11-10', '2026-11-12')).toBe(2);
    expect(parseHash('#/chapter/flow?term=props')).toEqual({ path: '/chapter/flow', parts: ['chapter', 'flow'], query: { term: 'props' } });
    expect(parseHash('')).toEqual({ path: 'map', parts: [], query: {} });
  });
});
