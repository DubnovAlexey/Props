// Тесты переводов уроков. Русский текст — оригинал, перевод — «накладка» на него
// (src/utils/localize.js, src/content/index.js, сами переводы — src/content/i18n/<язык>/).
// Тесты следят, чтобы перевод ложился на оригинал поле в поле, не ломал задания, не терял
// термины и не оставлял русских слов в пещере, которая считается переведённой.
import { describe, expect, it } from 'vitest';
import { localize, overlayProblems } from '../src/utils/localize.js';
import { buildContent, loadContent, RU_CONTENT } from '../src/content/index.js';
import { ALL_TASKS, CHAPTERS } from '../src/content/chapters/index.js';
import { GLOSSARY } from '../src/content/glossary.js';
import { FACTS } from '../src/content/facts.js';
import { METHODS, STUDY_PLAN } from '../src/content/methods.js';
import { BREAK_ROUNDS } from '../src/content/breakRounds.js';
import { CHAPTER_STORY, EPILOGUE, FINALE, PROLOGUE, TIERS } from '../src/content/story.js';
import { SYNTAX_GUIDE } from '../src/content/syntaxGuide.js';
import { DIAGRAM_TEXT } from '../src/content/diagrams.js';
import LIBRARY_SECTIONS from '../src/content/library/sections.json';
import { LIBRARY_SCHEMES } from '../src/content/library/schemes.js';
import { DIAGRAM_NAMES } from '../src/components/Diagram/Diagram.jsx';
import { COURSE } from '../src/content/course.js';
import { LEARN } from '../src/content/learn.js';
import { explainCode } from '../src/utils/syntaxGuide.js';
import { languageByCode } from '../src/i18n/languages.js';
import { loadLanguage } from '../src/i18n/dictionaries.js';
import { checkTask } from '../src/utils/checkAnswer.js';
import { parseInline, termIdsIn } from '../src/utils/richText.js';
import { correctValue, expectValidTask, wrongValue } from './taskChecks.js';

/** Все переводы, какие есть в проекте: { en: накладка, … } */
const OVERLAYS = Object.fromEntries(
  Object.entries(import.meta.glob('../src/content/i18n/*/index.js', { eager: true, import: 'default' })).map(([path, overlay]) => [
    path.split('/').at(-2),
    overlay,
  ]),
);

const byId = (list) => Object.fromEntries(list.map((item) => [item.id, item]));

/** Оригинал каждой части накладки — в том виде, в каком накладка её переводит */
const BASES = {
  tiers: byId(TIERS),
  finale: FINALE,
  prologue: PROLOGUE,
  epilogue: EPILOGUE,
  story: CHAPTER_STORY,
  chapters: byId(CHAPTERS),
  glossary: byId(GLOSSARY),
  facts: FACTS,
  methods: byId(METHODS),
  studyPlan: STUDY_PLAN,
  breakRounds: BREAK_ROUNDS,
  syntaxGuide: SYNTAX_GUIDE,
  diagrams: DIAGRAM_TEXT,
  // свитки: заголовки разделов и подписи схем (сами разделы проверяет tests/library.test.js)
  library: { titles: Object.fromEntries(LIBRARY_SECTIONS.map((section) => [section.id, section.title])), schemes: LIBRARY_SCHEMES },
  // вопросы Реестра (Скрипторий Графа) и страница «Чему научат пещеры»
  course: COURSE,
  learn: LEARN,
};

const CYRILLIC = /[а-яё]/i;
const count = (text, part) => text.split(part).length - 1;
const termsOf = (text) => [...new Set(termIdsIn(text))].sort().join(', ');

/** Все строки значения с их «адресами»: [['lesson[0].title', 'Модули…'], …] */
function strings(value, path = '') {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, index) => strings(item, `${path}[${index}]`));
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => strings(item, path ? `${path}.${key}` : key));
  }
  return [];
}

/** Где в значении остались русские буквы */
const cyrillicIn = (value) =>
  strings(value)
    .filter(([, text]) => CYRILLIC.test(text))
    .map(([path, text]) => `${path}: ${text.slice(0, 60)}`);

/** Проверка пары «русская строка — перевод» */
function checkText(where, base, translated) {
  const problems = [];
  if (!translated.trim()) problems.push(`${where}: пустой перевод`);
  if (CYRILLIC.test(translated)) problems.push(`${where}: в переводе остались русские буквы`);
  // Число строк кода важно: по номерам строк работают подсветка (highlight) и задание «Найди ошибку» (bugLine)
  if (count(base, '\n') !== count(translated, '\n')) problems.push(`${where}: другое число строк`);
  if (count(base, '___') !== count(translated, '___')) problems.push(`${where}: другое число пропусков ___`);
  if (termsOf(base) !== termsOf(translated)) problems.push(`${where}: термины [[…]] не те, что в оригинале (${termsOf(base)})`);
  return problems;
}

/** Списки, длина которых в переводе может быть другой: слова-маркеры и принимаемые ответы «Впиши ответ» */
function freeLengthFor(lang) {
  const inputAnswers = new Set(
    CHAPTERS.flatMap((chapter) =>
      chapter.practice.flatMap((task, index) =>
        task.type === 'input' ? [`${lang}.chapters.${chapter.id}.practice[${index}].answers`] : [],
      ),
    ),
  );
  // и у вопросов Реестра с ответом «Впиши ответ»
  COURSE.questions.forEach((item, index) => {
    if (item.task.type === 'input') inputAnswers.add(`${lang}.course.questions[${index}].task.answers`);
  });
  return (path) => path.endsWith('.words') || inputAnswers.has(path);
}

/** То, что в задании отвечает за проверку ответа: перевод не должен это менять */
const logicOf = (task) => ({
  id: task.id,
  type: task.type,
  answer: task.answer,
  bugLine: task.bugLine,
  correct: task.options?.map((option) => Boolean(option.correct)),
  bins: task.type === 'sort' ? task.items.map((item) => item.bin) : undefined,
  sizes: [task.options, task.items, task.pairs, task.bins, task.type === 'fill' ? task.answers : null].map((list) => list?.length ?? null),
});

describe('наложение перевода (localize)', () => {
  const base = {
    id: 'a',
    text: 'Привет',
    correct: true,
    lines: ['раз', 'два'],
    options: [
      { text: 'Да', correct: true },
      { text: 'Нет', why: 'Потому что' },
    ],
    pairs: [
      ['`a`', 'первый'],
      ['`b`', 'второй'],
    ],
  };

  it('меняет только то, что есть в накладке; логика остаётся из оригинала', () => {
    const result = localize(base, { text: 'Hello', options: [{}, { text: 'No', why: 'Because' }] });
    expect(result.text).toBe('Hello');
    expect(result.id).toBe('a');
    expect(result.correct).toBe(true);
    expect(result.options).toEqual([
      { text: 'Да', correct: true },
      { text: 'No', why: 'Because' },
    ]);
  });

  it('список простых значений заменяется целиком, список объектов — складывается по номерам', () => {
    expect(localize(base, { lines: ['one', 'two', 'three'] }).lines).toEqual(['one', 'two', 'three']);
    expect(localize(base, { pairs: [['`a`', 'first']] }).pairs).toEqual([
      ['`a`', 'first'],
      ['`b`', 'второй'],
    ]);
  });

  it('без накладки отдаёт сам оригинал и никогда его не меняет', () => {
    const copy = JSON.parse(JSON.stringify(base));
    expect(localize(base, undefined)).toBe(base);
    localize(base, { text: 'Hello', options: [{ text: 'Yes' }], lines: ['x'] });
    expect(base).toEqual(copy);
  });

  it('накладка «не той формы» не портит оригинал', () => {
    expect(localize(base, { options: 'oops', lines: { a: 1 } })).toEqual(base);
  });
});

describe('проверка накладки (overlayProblems)', () => {
  const base = { title: 'Заголовок', options: [{ text: 'Да' }, { text: 'Нет' }], words: ['a', 'b'] };

  it('правильная накладка — без замечаний', () => {
    expect(overlayProblems(base, { title: 'Title', options: [{ text: 'Yes' }, {}] })).toEqual([]);
  });

  it('замечает опечатку в поле, потерянный элемент списка и не тот тип', () => {
    expect(overlayProblems(base, { titel: 'Title' }, {}, 'x')).toEqual(['x.titel: такого поля нет в оригинале']);
    expect(overlayProblems(base, { options: [{ text: 'Yes' }] }, {}, 'x')).toHaveLength(1);
    expect(overlayProblems(base, { title: 5 }, {}, 'x')).toHaveLength(1);
    expect(overlayProblems(base, { options: { text: 'Yes' } }, {}, 'x')).toHaveLength(1);
  });

  it('длина «свободных» списков может отличаться; строки проверяет переданная функция', () => {
    const freeLength = (path) => path.endsWith('.words');
    expect(overlayProblems(base, { words: ['a'] }, {}, 'x')).toHaveLength(1);
    expect(overlayProblems(base, { words: ['a'] }, { freeLength }, 'x')).toEqual([]);
    const checkText = (where, from, to) => (to === from ? [`${where}: не переведено`] : []);
    expect(overlayProblems(base, { title: 'Заголовок' }, { checkText }, 'x')).toEqual(['x.title: не переведено']);
  });
});

describe('«анатомия кода»', () => {
  it('у каждой конструкции есть заголовок и объяснение, а её термин есть в словаре', () => {
    const ids = new Set(GLOSSARY.map((entry) => entry.id));
    for (const [cid, item] of Object.entries(SYNTAX_GUIDE.constructs)) {
      expect(item.title && item.simple, cid).toBeTruthy();
      if (item.term) expect(ids.has(item.term), `${cid} → ${item.term}`).toBe(true);
    }
    for (const [name, item] of Object.entries({ ...SYNTAX_GUIDE.react, ...SYNTAX_GUIDE.methods })) {
      expect(item.simple, name).toBeTruthy();
      if (item.term) expect(ids.has(item.term), `${name} → ${item.term}`).toBe(true);
    }
    expect(SYNTAX_GUIDE.reactTitle).toContain('{name}');
  });
});

describe('схемы-картинки', () => {
  it('у каждой схемы есть подписи, у каждого набора подписей — схема', () => {
    expect(Object.keys(DIAGRAM_TEXT).sort()).toEqual([...DIAGRAM_NAMES].sort());
    for (const [name, text] of Object.entries(DIAGRAM_TEXT)) {
      expect(text.label, name).toBeTruthy();
      for (const [key, value] of Object.entries(text)) expect(value, `${name}.${key}`).toBeTruthy();
    }
  });
});

describe('содержимое игры по языкам', () => {
  it('русское содержимое — это оригинал без изменений', () => {
    expect(RU_CONTENT.CHAPTERS).toEqual(CHAPTERS);
    expect(RU_CONTENT.ALL_TASKS).toEqual(ALL_TASKS);
    expect(RU_CONTENT.GLOSSARY).toEqual(GLOSSARY);
    expect(RU_CONTENT.FACTS).toBe(FACTS);
    expect(RU_CONTENT.translatedCaves).toBe(CHAPTERS.length);
  });

  it('ярус пещеры — тот же объект, что в списке ярусов: карта пещер сравнивает их по ссылке', () => {
    for (const content of [RU_CONTENT, ...Object.values(OVERLAYS).map(buildContent)]) {
      for (const chapter of content.CHAPTERS) expect(content.TIERS).toContain(chapter.tier);
      for (const tier of content.TIERS) expect(content.CHAPTERS.filter((chapter) => chapter.tier === tier)).toHaveLength(6);
    }
  });

  it('загрузка: перевод подгружается, незнакомый язык получает русские уроки', async () => {
    expect(await loadContent('ru')).toBe(RU_CONTENT);
    expect(await loadContent('xx')).toBe(RU_CONTENT);
    for (const lang of Object.keys(OVERLAYS)) {
      const content = await loadContent(lang);
      expect(content).not.toBe(RU_CONTENT);
      expect(await loadContent(lang), 'второй раз — тот же объект, без повторной сборки').toBe(content);
    }
    const loaded = await loadLanguage('ru');
    expect(loaded.lang).toBe('ru');
    expect(loaded.content).toBe(RU_CONTENT);
    expect(loaded.dictionary.meta.title).toBeTruthy();
  });
});

describe.each(Object.keys(OVERLAYS))('перевод уроков: %s', (lang) => {
  const overlay = OVERLAYS[lang];
  const content = buildContent(overlay);
  const translatedIds = CHAPTERS.filter((chapter) => overlay.chapters?.[chapter.id]?.lesson).map((chapter) => chapter.id);
  const overlayTexts = strings(overlay).map(([, text]) => text);

  it('язык есть в списке языков игры', () => {
    expect(languageByCode(lang)).not.toBeNull();
    expect(lang).not.toBe('ru');
  });

  it('накладка ложится на оригинал поле в поле: те же поля, списки той же длины, те же термины и число строк кода', () => {
    expect(overlayProblems(BASES, overlay, { freeLength: freeLengthFor(lang), checkText }, lang)).toEqual([]);
  });

  it('у всех пещер переведена «вывеска» — название, тема и цель; заголовки не повторяются', () => {
    for (const chapter of content.CHAPTERS) {
      expect(cyrillicIn({ cave: chapter.cave, title: chapter.title, goal: chapter.goal }), chapter.id).toEqual([]);
    }
    expect(new Set(content.CHAPTERS.map((chapter) => chapter.cave)).size).toBe(CHAPTERS.length);
    expect(new Set(content.CHAPTERS.map((chapter) => chapter.title)).size).toBe(CHAPTERS.length);
  });

  it('сюжет переведён целиком: ярусы, пролог, эпилог, финал и хозяева всех пещер', () => {
    const story = {
      tiers: content.TIERS,
      finale: content.FINALE,
      prologue: content.PROLOGUE,
      epilogue: content.EPILOGUE,
      caves: content.CHAPTERS.map((chapter) => chapter.story),
    };
    expect(cyrillicIn(story)).toEqual([]);
    expect(new Set(content.CHAPTERS.map((chapter) => chapter.story.guardian.name)).size).toBe(CHAPTERS.length);
  });

  it('факты, методики и раунды перемены переведены целиком', () => {
    expect(cyrillicIn([content.FACTS, content.METHODS, content.STUDY_PLAN, content.BREAK_ROUNDS])).toEqual([]);
    for (const round of Object.values(content.BREAK_ROUNDS)) {
      expect(
        round.good.filter((label) => round.bad.includes(label)),
        round.id,
      ).toEqual([]);
    }
  });

  it('все [[термины]] перевода есть в словаре; внутри **жирного** терминов нет', () => {
    const ids = new Set(GLOSSARY.map((entry) => entry.id));
    expect(overlayTexts.flatMap(termIdsIn).filter((id) => !ids.has(id))).toEqual([]);
    expect(overlayTexts.filter((text) => parseInline(text).some((token) => token.type === 'bold' && token.value.includes('[[')))).toEqual(
      [],
    );
  });

  it('«анатомия кода»: если переведена, то целиком, и разбор примера идёт на языке перевода', () => {
    if (!overlay.syntaxGuide) return;
    expect(cyrillicIn(content.SYNTAX_GUIDE)).toEqual([]);
    // пример для разбора — строка, а не код теста: IntelliJ читает её как код и считает Card «неиспользуемой»
    // noinspection JSUnusedLocalSymbols
    const code =
      'function Card({ title = "x", ...rest }) {\n  const [n, setN] = useState(0);\n  return <li onClick={() => setN(n + 1)}>{items.map(String)}</li>;\n}';
    const explained = explainCode(code, content.SYNTAX_GUIDE);
    expect(explained.constructs.length).toBeGreaterThan(8);
    expect(cyrillicIn(explained.constructs)).toEqual([]);
    // те же конструкции, что и в русском разборе: перевод меняет слова, а не логику
    expect(explained.constructs.map((item) => item.cid)).toEqual(explainCode(code).constructs.map((item) => item.cid));
  });

  it('схемы-картинки: если переведены, то все подписи, и они не длиннее русских больше чем на четверть', () => {
    if (!overlay.diagrams) return;
    expect(cyrillicIn(content.DIAGRAM_TEXT)).toEqual([]);
    for (const [name, text] of Object.entries(content.DIAGRAM_TEXT)) {
      for (const [key, value] of Object.entries(text)) {
        if (key === 'label') continue; // описание для экранных чтецов на рисунке не видно
        const limit = Math.max(8, Math.ceil(DIAGRAM_TEXT[name][key].length * 1.25));
        expect(value.length, `${name}.${key}: «${value}»`).toBeLessThanOrEqual(limit);
      }
    }
  });

  it('словарь терминов: переведённый термин переведён целиком — название, подпись, объяснения, пример', () => {
    for (const id of Object.keys(overlay.glossary ?? {})) {
      const entry = content.GLOSSARY_MAP[id];
      expect(entry.title && entry.label && entry.simple, id).toBeTruthy();
      expect(cyrillicIn(entry), id).toEqual([]);
    }
  });

  if (translatedIds.length > 0) {
    it.each(translatedIds)('пещера %s переведена целиком: русских букв не осталось', (id) => {
      expect(cyrillicIn(content.CHAPTER_MAP[id])).toEqual([]);
    });

    it.each(translatedIds)('пещера %s: заголовки карточек разные, задания проверяются так же, как в оригинале', (id) => {
      const chapter = content.CHAPTER_MAP[id];
      const original = CHAPTERS.find((item) => item.id === id);
      expect(new Set(chapter.lesson.map((card) => card.title)).size).toBe(chapter.lesson.length);
      chapter.practice.forEach((task, index) => {
        expect(logicOf(task), task.id).toEqual(logicOf(original.practice[index]));
        expectValidTask(task);
        expect(checkTask(task, correctValue(task)), task.id).toBe(true);
        expect(checkTask(task, wrongValue(task)), task.id).toBe(false);
      });
      for (const idea of chapter.explain.keywords) {
        expect(idea.words.length, idea.label).toBeGreaterThan(0);
        // слова-маркеры ищутся в тексте, приведённом к нижнему регистру
        for (const word of idea.words) expect(word, idea.label).toBe(word.toLowerCase());
      }
    });
  }

  it('число переведённых пещер посчитано верно; «готовый» язык переведён полностью', () => {
    expect(content.translatedCaves).toBe(translatedIds.length);
    if (languageByCode(lang)?.ready) {
      expect(translatedIds).toHaveLength(CHAPTERS.length);
      expect(Object.keys(overlay.glossary ?? {})).toHaveLength(GLOSSARY.length);
      expect(cyrillicIn(content)).toEqual([]);
    }
  });
});
