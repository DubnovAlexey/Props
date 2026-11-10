// Проверка целостности контента: опечатки в терминах, неверные ответы,
// пропуски без кусочков — всё это ловится здесь, а не игроком.
// Запуск: npm test
import { describe, expect, it } from 'vitest';
import { ALL_TASKS, CHAPTERS } from '../src/content/chapters/index.js';
import { GLOSSARY, GLOSSARY_MAP } from '../src/content/glossary.js';
import { BREAK_ROUNDS } from '../src/content/breakRounds.js';
import { FACTS } from '../src/content/facts.js';
import { METHODS } from '../src/content/methods.js';
import { DIAGRAM_NAMES } from '../src/components/Diagram/Diagram.jsx';
import { checkTask, checkers } from '../src/utils/checkAnswer.js';
import { parseInline, termIdsIn } from '../src/utils/richText.js';
import { SYNTAX } from '../src/content/chapters/index.js';
import { CHAPTER_STORY, TIERS } from '../src/content/story.js';
import { TASK_LEVELS } from '../src/content/difficulty.js';
import { TERM_CODE } from '../src/content/glossaryCode.js';
import { SCHEME_TYPES } from '../src/components/Scheme/Scheme.jsx';

/** Правильный ответ, собранный из данных задания */
function correctValue(task) {
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
function wrongValue(task) {
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

/** Все тексты главы, где может встретиться разметка [[термин]] */
function textsOf(chapter) {
  const texts = [
    chapter.goal,
    chapter.spell.text,
    chapter.spell.meaning ?? '',
    chapter.pretest.question,
    chapter.pretest.explain,
    chapter.explain.prompt,
  ];
  chapter.pretest.options.forEach((option) => texts.push(option.text));
  chapter.lesson.forEach((card) => {
    texts.push(card.title, ...(card.body ?? []), ...(card.after ?? []), card.key ?? '', card.analogy ?? '');
  });
  chapter.practice.forEach((task) => {
    texts.push(task.question ?? '', task.statement ?? '', task.hint ?? '', ...[].concat(task.explain));
    (task.options ?? []).forEach((option) => texts.push(option.text, option.why ?? ''));
    (task.items ?? []).forEach((item) => texts.push(typeof item === 'string' ? item : item.text));
    (task.pairs ?? []).forEach(([left, right]) => texts.push(left, right));
  });
  return texts;
}

describe('главы', () => {
  it('18 пещер с уникальными id и порядком 1…18, по 6 на ярус', () => {
    expect(CHAPTERS).toHaveLength(18);
    expect(new Set(CHAPTERS.map((c) => c.id)).size).toBe(18);
    expect(CHAPTERS.map((c) => c.order)).toEqual(Array.from({ length: 18 }, (_, i) => i + 1));
    for (const tier of TIERS) expect(CHAPTERS.filter((c) => c.tier === tier)).toHaveLength(6);
  });

  it('у каждой пещеры есть ярус и сюжет, ярусы идут по порядку', () => {
    for (const chapter of CHAPTERS) {
      expect(chapter.tier, chapter.id).toBeDefined();
      expect(chapter.story?.intro?.length, `${chapter.id}: intro`).toBeGreaterThan(30);
      expect(chapter.story?.outro?.length, `${chapter.id}: outro`).toBeGreaterThan(30);
    }
    const tierOrder = CHAPTERS.map((c) => TIERS.indexOf(c.tier));
    expect(tierOrder).toEqual([...tierOrder].sort((a, b) => a - b));
    expect(Object.keys(CHAPTER_STORY).sort()).toEqual(CHAPTERS.map((c) => c.id).sort());
  });

  it.each(CHAPTERS.map((c) => [c.id, c]))('глава %s заполнена полностью', (_, chapter) => {
    for (const field of ['icon', 'color', 'cave', 'title', 'goal', 'breakRound']) {
      expect(chapter[field], field).toBeTruthy();
    }
    expect(BREAK_ROUNDS[chapter.breakRound], 'раунд перемены').toBeDefined();
    expect(chapter.lesson.length).toBeGreaterThanOrEqual(4);
    expect(chapter.lesson.length).toBeLessThanOrEqual(6);
    expect(chapter.practice.length).toBe(8);
    expect(chapter.pretest.options.some((o) => o.correct)).toBe(true);
    expect(chapter.spell.text.length).toBeGreaterThan(10);
    expect(chapter.explain.keywords.length).toBeGreaterThanOrEqual(2);
    expect(chapter.explain.starters.length).toBeGreaterThanOrEqual(2);
    expect(chapter.explain.model.length).toBeGreaterThan(60);
  });

  it('карточки урока: заголовок, текст, существующие схемы', () => {
    for (const chapter of CHAPTERS) {
      for (const card of chapter.lesson) {
        expect(card.title, chapter.id).toBeTruthy();
        expect(Array.isArray(card.body) && card.body.length > 0, `${chapter.id}: ${card.title}`).toBe(true);
        if (card.diagram) expect(DIAGRAM_NAMES, card.diagram).toContain(card.diagram);
      }
    }
  });

  it('в каждой главе хотя бы 5 разных типов заданий', () => {
    for (const chapter of CHAPTERS) {
      const types = new Set(chapter.practice.map((task) => task.type));
      expect(types.size, chapter.id).toBeGreaterThanOrEqual(5);
    }
  });
});

describe('задания', () => {
  it('id уникальны и начинаются с id главы', () => {
    expect(new Set(ALL_TASKS.map((t) => t.id)).size).toBe(ALL_TASKS.length);
    for (const task of ALL_TASKS) expect(task.id.startsWith(task.chapterId), task.id).toBe(true);
  });

  it.each(ALL_TASKS.map((t) => [t.id, t]))('%s: корректные данные', (_, task) => {
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
  });

  it.each(ALL_TASKS.map((t) => [t.id, t]))('%s: верный ответ принимается, неверный — нет', (_, task) => {
    expect(checkTask(task, correctValue(task))).toBe(true);
    expect(checkTask(task, wrongValue(task))).toBe(false);
  });
});

describe('термины', () => {
  it('id словаря уникальны, поля заполнены', () => {
    expect(new Set(GLOSSARY.map((e) => e.id)).size).toBe(GLOSSARY.length);
    for (const entry of GLOSSARY) {
      expect(entry.title && entry.label && entry.simple, entry.id).toBeTruthy();
    }
  });

  it('связанные термины существуют', () => {
    for (const entry of GLOSSARY) {
      for (const id of entry.related ?? []) expect(GLOSSARY_MAP[id], `${entry.id} → ${id}`).toBeDefined();
    }
  });

  it('все [[термины]] в главах и фактах есть в словаре', () => {
    const texts = [...CHAPTERS.flatMap(textsOf), ...FACTS];
    const missing = texts.flatMap(termIdsIn).filter((id) => !GLOSSARY_MAP[id]);
    expect(missing).toEqual([]);
  });

  it('внутри **жирного** нет [[терминов]] — такая разметка не поддерживается', () => {
    const texts = CHAPTERS.flatMap(textsOf);
    const broken = texts.filter((text) => parseInline(text).some((t) => t.type === 'bold' && t.value.includes('[[')));
    expect(broken).toEqual([]);
  });
});

describe('прочий контент', () => {
  it('раунды перемены содержат и верные, и неверные надписи', () => {
    for (const round of Object.values(BREAK_ROUNDS)) {
      expect(round.good.length).toBeGreaterThanOrEqual(5);
      expect(round.bad.length).toBeGreaterThanOrEqual(5);
      expect(round.good.filter((label) => round.bad.includes(label))).toEqual([]);
    }
  });

  it('методики описаны полностью', () => {
    for (const method of METHODS) {
      expect(method.name && method.what && method.inGame && method.tip, method.id).toBeTruthy();
    }
  });
});

describe('разбор кода и схемы', () => {
  it('ключи разбора совпадают с заголовками карточек', () => {
    for (const chapter of CHAPTERS) {
      const titles = chapter.lesson.map((card) => card.title);
      for (const key of Object.keys(SYNTAX[chapter.id] ?? {})) {
        expect(titles, `${chapter.id}: «${key}»`).toContain(key);
      }
    }
  });

  it('у каждой карточки с кодом есть «почему так», «как ещё» и «как нельзя»', () => {
    for (const chapter of CHAPTERS) {
      for (const card of chapter.lesson.filter((c) => c.code)) {
        const where = `${chapter.id}: «${card.title}»`;
        expect(card.why?.length, `${where} — why`).toBeGreaterThan(40);
        expect(card.alt?.length, `${where} — alt`).toBeGreaterThanOrEqual(1);
        expect(card.wrong?.length, `${where} — wrong`).toBeGreaterThanOrEqual(1);
        for (const item of card.alt) expect(item.code && item.note, `${where} — alt`).toBeTruthy();
        for (const item of card.wrong) expect(item.code && item.why, `${where} — wrong`).toBeTruthy();
      }
    }
  });

  it('у каждой карточки есть схема или иллюстрация', () => {
    for (const chapter of CHAPTERS) {
      for (const card of chapter.lesson) {
        expect(card.scheme || card.diagram, `${chapter.id}: «${card.title}»`).toBeTruthy();
      }
    }
  });

  it('у каждой пещеры есть хозяин: имя, вид, угроза, поражение и «почему он»', () => {
    for (const chapter of CHAPTERS) {
      const guardian = chapter.story.guardian;
      for (const field of ['name', 'kind', 'threat', 'defeat', 'why']) {
        expect(guardian?.[field], `${chapter.id}: ${field}`).toBeTruthy();
      }
    }
  });

  it('схемы правильного формата', () => {
    const checkNode = (node, where) => {
      expect(node.name, where).toBeTruthy();
      for (const child of node.children ?? []) checkNode(child, where);
    };
    for (const chapter of CHAPTERS) {
      for (const card of chapter.lesson.filter((c) => c.scheme)) {
        const { scheme } = card;
        const where = `${chapter.id}: «${card.title}»`;
        expect(SCHEME_TYPES, where).toContain(scheme.type);
        if (scheme.type === 'steps') {
          expect(scheme.steps.length, where).toBeGreaterThanOrEqual(2);
          for (const step of scheme.steps) expect(step.title, where).toBeTruthy();
        }
        if (scheme.type === 'compare') {
          expect(scheme.left.items.length && scheme.right.items.length, where).toBeTruthy();
        }
        if (scheme.type === 'tree') checkNode(scheme.root, where);
      }
    }
  });

  it('у каждого задания есть сложность ★–★★★', () => {
    for (const task of ALL_TASKS) {
      expect(TASK_LEVELS[task.id], task.id).toBeGreaterThanOrEqual(1);
      expect(TASK_LEVELS[task.id], task.id).toBeLessThanOrEqual(3);
    }
    expect(Object.keys(TASK_LEVELS).sort()).toEqual(ALL_TASKS.map((t) => t.id).sort());
  });

  it('написания терминов в коде: у каждого термина есть en, лишних ключей нет', () => {
    for (const entry of GLOSSARY) expect(entry.en, entry.id).toBeTruthy();
    for (const id of Object.keys(TERM_CODE)) expect(GLOSSARY_MAP[id], id).toBeDefined();
  });
});
