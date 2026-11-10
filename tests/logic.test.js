// Тесты чистой логики: повторения, разметка, проверка ответов, прогресс, подсветка.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DAY, INTERVAL_DAYS, boxCounts, dueIds, schedule } from '../src/utils/leitner.js';
import { groupBlocks, parseInline, stripMarkup } from '../src/utils/richText.js';
import { checkTask, normalizeCode, normalizeLoose } from '../src/utils/checkAnswer.js';
import { initialProgress, isPassed, neededCorrect, progressReducer, restore, XP } from '../src/state/progressReducer.js';
import { tokenizeLine } from '../src/utils/highlight.js';
import { rankFor, RANKS } from '../src/utils/ranks.js';
import { daysBetween } from '../src/utils/dates.js';
import { parseHash } from '../src/app/useHashRoute.js';
import { hashText, letterJitter, pickDripLetters, seededRandom } from '../src/utils/bloodDrips.js';
import { buildScare, nextDelay, pickScare, SCARE_DELAY, SCARE_KINDS } from '../src/utils/scares.js';
import { FAVICON_FRAMES, FAVICON_SIZE, drawFaviconFrame } from '../src/app/liveFavicon.js';

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

  it('хозяин повержен только при 5 верных из 8', () => {
    expect(isPassed(4 / 8)).toBe(false);
    expect(isPassed(5 / 8)).toBe(true);
    expect(neededCorrect(8)).toBe(5);

    let state = progressReducer(initialProgress, { type: 'practice', chapterId: 'flow', score: 4 / 8 });
    expect(state.chapters.flow.done).toBe(false);
    expect(state.chapters.flow.practiceBest).toBe(0.5); // попытка запомнена, но победы нет
    expect(state.xp).toBe(0);

    state = progressReducer(state, { type: 'practice', chapterId: 'flow', score: 5 / 8 });
    expect(state.chapters.flow.done).toBe(true);
    expect(state.xp).toBe(XP.chapter);
  });

  it('слабая повторная попытка не отнимает победу', () => {
    let state = progressReducer(initialProgress, { type: 'practice', chapterId: 'flow', score: 1 });
    state = progressReducer(state, { type: 'practice', chapterId: 'flow', score: 0 });
    expect(state.chapters.flow.done).toBe(true);
    expect(state.chapters.flow.practiceBest).toBe(1);
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

  it('неожиданности включены по умолчанию, выключаются и переживают сброс', () => {
    expect(initialProgress.scares).toBe(true);
    expect(restore({ version: 1, xp: 7 }).scares).toBe(true); // старое сохранение без этого поля
    let state = progressReducer({ ...initialProgress, xp: 50 }, { type: 'scares', scares: false });
    expect(state.scares).toBe(false);
    state = progressReducer(state, { type: 'reset' });
    expect(state.xp).toBe(0);
    expect(state.scares).toBe(false);
  });
});

describe('потёки крови на заголовках', () => {
  const letters = (text) => [...text];

  it('для одного текста выбор всегда одинаковый, для разных — разный', () => {
    const title = letters('Пещеры Графа Пропсулы');
    expect(pickDripLetters(title)).toEqual(pickDripLetters(title));
    expect(hashText('Пещеры')).not.toBe(hashText('Склеп'));
    expect(seededRandom(7)()).toBe(seededRandom(7)());
  });

  it('потёки висят только на буквах без «хвоста» и не выходят за заголовок', () => {
    const title = letters('📲 Пещеры — в кармане, 18 штук!');
    const drips = pickDripLetters(title);
    expect(drips.length).toBeGreaterThanOrEqual(2);
    expect(drips.length).toBeLessThanOrEqual(6);
    for (const drip of drips) {
      expect(title[drip.index]).toMatch(/\p{L}/u);
      expect('руфцщдРУФЦЩДqypgjQ').not.toContain(title[drip.index]);
      expect(drip.shift).toBeGreaterThanOrEqual(0.3);
      expect(drip.shift).toBeLessThanOrEqual(0.7);
      expect(drip.length).toBeGreaterThan(0);
    }
    // каждая буква — не больше одного потёка
    expect(new Set(drips.map((drip) => drip.index)).size).toBe(drips.length);
  });

  it('потёков в меру: от двух до шести, длинные чередуются с капельками', () => {
    expect(pickDripLetters(letters('Словарь Графа'))).toHaveLength(2);
    expect(pickDripLetters(letters('Пещеры Графа Пропсулы'))).toHaveLength(3);
    const long = pickDripLetters(letters('Функции в пропсах и подъём состояния наверх к самому родителю'));
    expect(long).toHaveLength(6);
    long.forEach((drip, i) => {
      if (i % 2 === 0) expect(drip.length).toBeGreaterThanOrEqual(0.38);
      else expect(drip.length).toBeLessThanOrEqual(0.28);
    });
  });

  it('буквы «пляшут» чуть-чуть и всегда одинаково, знаки препинания стоят ровно', () => {
    const word = letters('Пропсулы,');
    const jitter = letterJitter(word);
    expect(jitter).toEqual(letterJitter(word));
    expect(jitter).toHaveLength(word.length);
    expect(jitter.at(-1)).toBeNull(); // запятая
    for (const move of jitter.slice(0, -1)) {
      expect(Math.abs(move.rotate)).toBeLessThanOrEqual(4.5);
      expect(Math.abs(move.shift)).toBeLessThanOrEqual(0.07);
      expect(move.scale).toBeGreaterThanOrEqual(0.97);
      expect(move.scale).toBeLessThanOrEqual(1.18);
    }
    // другое «зерно» — другая пляска
    expect(letterJitter(word, 'Пропсулы,1')).not.toEqual(jitter);
  });

  it('без подходящих букв потёков нет, а на коротком слове их не больше, чем букв', () => {
    expect(pickDripLetters(letters('123 — !'))).toEqual([]);
    expect(pickDripLetters(letters('руд'))).toEqual([]);
    expect(pickDripLetters(letters('Я'))).toHaveLength(1);
  });
});

describe('живой значок вкладки', () => {
  it('значок — картинки владельца: обе лежат в public и подключены в index.html', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    for (const file of ['favicon.webp', 'favicon.png']) {
      expect(html).toContain(`href="./${file}"`);
      expect(readFileSync(new URL(`../public/${file}`, import.meta.url)).length).toBeGreaterThan(1000);
    }
  });

  it('раскадровка: числа в разумных пределах, большую часть времени значок спокоен', () => {
    expect(FAVICON_FRAMES.length).toBeGreaterThanOrEqual(8);
    let total = 0;
    let calm = 0;
    for (const frame of FAVICON_FRAMES) {
      expect(frame.ms).toBeGreaterThanOrEqual(100);
      expect(frame.rim).toBeGreaterThanOrEqual(0);
      expect(frame.rim).toBeLessThanOrEqual(1);
      expect(frame.zoom ?? 1).toBeGreaterThanOrEqual(1);
      expect(frame.zoom ?? 1).toBeLessThanOrEqual(1.3);
      if ('drop' in frame) {
        expect(frame.drop).toBeGreaterThan(0);
        expect(frame.drop).toBeLessThan(1);
      }
      total += frame.ms;
      if (!frame.zoom && !('drop' in frame) && frame.rim <= 0.3) calm += frame.ms;
    }
    expect(calm / total).toBeGreaterThan(0.6); // «немного оживить», а не мигать без остановки
  });

  it('кадр рисуется на холсте: картинка, рамка, капля; при рывке картинка выходит за края', () => {
    // «Холст-шпион»: вместо настоящего холста записываем, какие команды рисования вызваны
    const calls = [];
    const context = new Proxy(
      {},
      {
        get: (_, name) => (name === 'createRadialGradient' ? () => ({ addColorStop() {} }) : (...args) => calls.push([name, ...args])),
        set: () => true,
      },
    );
    drawFaviconFrame(context, {}, { rim: 1, zoom: 1.24, flash: 0.5, drop: 0.5 }, FAVICON_SIZE);
    const names = calls.map((call) => call[0]);
    expect(names).toEqual(expect.arrayContaining(['clearRect', 'drawImage', 'fillRect', 'strokeRect', 'bezierCurveTo', 'arc']));
    const [, , x, y, width] = calls.find((call) => call[0] === 'drawImage');
    expect(x).toBeLessThan(0);
    expect(y).toBeLessThan(0);
    expect(width).toBeGreaterThan(FAVICON_SIZE);

    // спокойный кадр: без капли и без вспышки
    calls.length = 0;
    drawFaviconFrame(context, {}, FAVICON_FRAMES[0]);
    expect(calls.map((call) => call[0])).not.toContain('bezierCurveTo');
    expect(calls.filter((call) => call[0] === 'fillRect')).toHaveLength(1); // только зарево по краям
  });
});

describe('неожиданности', () => {
  const kinds = SCARE_KINDS.map((item) => item.kind);
  const guardianIds = ['setup', 'components', 'callbacks'];
  const phone = { width: 360, height: 740, guardianIds };
  const desktop = { width: 1440, height: 900, guardianIds };

  it('та же неожиданность не выпадает два раза подряд', () => {
    const random = seededRandom(42);
    let previous = null;
    for (let i = 0; i < 300; i += 1) {
      const kind = pickScare(random, previous);
      expect(kinds).toContain(kind);
      expect(kind).not.toBe(previous);
      previous = kind;
    }
  });

  it('выпадают все виды, частые — чаще редких', () => {
    const random = seededRandom(7);
    const counts = Object.fromEntries(kinds.map((kind) => [kind, 0]));
    let previous = null;
    for (let i = 0; i < 4000; i += 1) {
      previous = pickScare(random, previous);
      counts[previous] += 1;
    }
    for (const kind of kinds) expect(counts[kind]).toBeGreaterThan(0);
    expect(counts.bat).toBeGreaterThan(counts.banshee);
    // крайние значения случайного числа не ломают выбор
    expect(kinds).toContain(pickScare(() => 0));
    expect(kinds).toContain(pickScare(() => 0.999999));
  });

  it('паузы укладываются в заданные границы', () => {
    const random = seededRandom(3);
    for (let i = 0; i < 100; i += 1) {
      const first = nextDelay(random, true);
      const next = nextDelay(random);
      expect(first).toBeGreaterThanOrEqual(SCARE_DELAY.first[0]);
      expect(first).toBeLessThanOrEqual(SCARE_DELAY.first[1]);
      expect(next).toBeGreaterThanOrEqual(SCARE_DELAY.next[0]);
      expect(next).toBeLessThanOrEqual(SCARE_DELAY.next[1]);
    }
  });

  it('каждая неожиданность собирается для телефона и компьютера без «битых» чисел', () => {
    const random = seededRandom(11);
    for (const view of [phone, desktop]) {
      for (const kind of kinds) {
        for (let i = 0; i < 25; i += 1) {
          const scare = buildScare(kind, random, view);
          expect(scare.kind).toBe(kind);
          expect(scare.duration).toBeGreaterThan(1000);
          expect(scare.duration).toBeLessThan(11000);
          // в описании не должно быть NaN и undefined: такие значения молча ломают анимацию
          expect(JSON.stringify(scare)).not.toMatch(/NaN|undefined|Infinity|null/);
        }
      }
    }
    expect(buildScare('нет такой', random, phone)).toBeNull();
  });

  it('мышь стартует и финиширует за краями экрана', () => {
    const random = seededRandom(5);
    for (let i = 0; i < 50; i += 1) {
      const [bat] = buildScare('bat', random, desktop).bats;
      const x0 = parseFloat(bat.style['--x0']);
      const x1 = parseFloat(bat.style['--x1']);
      expect(Math.min(x0, x1)).toBeLessThanOrEqual(-bat.size);
      expect(Math.max(x0, x1)).toBeGreaterThanOrEqual(desktop.width);
    }
  });

  it('в пещере из темноты выглядывает её хозяин, вне пещер — кто-то из хозяев', () => {
    const random = seededRandom(9);
    expect(buildScare('apparition', random, { ...phone, caveId: 'components' }).guardianId).toBe('components');
    expect(guardianIds).toContain(buildScare('apparition', random, phone).guardianId);
    expect(guardianIds).toContain(buildScare('apparition', random, { ...phone, caveId: 'нет такой' }).guardianId);
    expect(buildScare('banshee', random, phone).guardianId).toBe('callbacks');
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
