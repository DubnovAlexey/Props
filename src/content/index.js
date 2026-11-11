// Всё учебное содержимое игры на нужном языке — одним объектом.
//
// Русский текст — оригинал: он лежит в файлах этой папки и вшит в основной код.
// Перевод на другой язык — «накладка» из папки ./i18n/<код языка>/: в ней только переведённый
// текст. Логика заданий (какой ответ верный, номер строки с ошибкой), значки, цвета и порядок
// пещер берутся из русского оригинала — см. src/utils/localize.js.
// Чего в накладке нет, то остаётся на русском: игра работает и с переводом «наполовину».
//
// Компоненты берут содержимое хуком useContent() (src/i18n/I18nContext.jsx):
//   const { CHAPTERS, GLOSSARY_MAP } = useContent();
//
// Свитки Графа сюда не входят: они грузятся отдельным куском кода вместе со своей страницей.
import { CHAPTERS as RU_CHAPTERS } from './chapters/index.js';
import { levelOf } from './difficulty.js';
import { GLOSSARY as RU_GLOSSARY } from './glossary.js';
import { FACTS as RU_FACTS } from './facts.js';
import { METHODS as RU_METHODS, STUDY_PLAN as RU_STUDY_PLAN } from './methods.js';
import { BREAK_ROUNDS as RU_BREAK_ROUNDS } from './breakRounds.js';
import { EPILOGUE as RU_EPILOGUE, FINALE as RU_FINALE, PROLOGUE as RU_PROLOGUE, TIERS as RU_TIERS } from './story.js';
import { SYNTAX_GUIDE as RU_SYNTAX_GUIDE } from './syntaxGuide.js';
import { DIAGRAM_TEXT as RU_DIAGRAM_TEXT } from './diagrams.js';
import { localize } from '../utils/localize.js';

/** Список с id: перевод каждого элемента лежит в накладке под его id */
const localizeById = (list, overlays) => list.map((item) => localize(item, overlays?.[item.id]));

/**
 * Собирает содержимое игры: русский оригинал + накладка перевода.
 * Части накладки (все необязательные):
 *   tiers, methods, glossary, breakRounds, story, chapters — объекты «id → перевод»;
 *   facts, studyPlan — списки строк той же длины, что в оригинале;
 *   finale, prologue, epilogue — объекты с переведёнными полями;
 *   syntaxGuide — тексты «анатомии кода» (см. ./syntaxGuide.js);
 *   diagrams — подписи внутри схем-картинок (см. ./diagrams.js).
 */
export function buildContent(overlay = {}) {
  const TIERS = localizeById(RU_TIERS, overlay.tiers);

  const CHAPTERS = RU_CHAPTERS.map((chapter) => ({
    ...localize(chapter, overlay.chapters?.[chapter.id]),
    // ярус берём из переведённого списка: карта пещер сравнивает ярусы как объекты (chapter.tier === tier)
    tier: TIERS[RU_TIERS.indexOf(chapter.tier)],
    story: localize(chapter.story, overlay.story?.[chapter.id]),
  }));

  /** Все задания с пометкой пещеры и сложности; внутри пещеры — от ★ к ★★★ */
  const ALL_TASKS = CHAPTERS.flatMap((chapter) =>
    chapter.practice.map((task) => ({ ...task, chapterId: chapter.id, level: levelOf(task.id) })).sort((a, b) => a.level - b.level),
  );

  const GLOSSARY = localizeById(RU_GLOSSARY, overlay.glossary);

  return {
    TIERS,
    CHAPTERS,
    CHAPTER_MAP: Object.fromEntries(CHAPTERS.map((chapter) => [chapter.id, chapter])),
    ALL_TASKS,
    TASK_MAP: Object.fromEntries(ALL_TASKS.map((task) => [task.id, task])),
    GLOSSARY,
    GLOSSARY_MAP: Object.fromEntries(GLOSSARY.map((entry) => [entry.id, entry])),
    FACTS: localize(RU_FACTS, overlay.facts),
    METHODS: localizeById(RU_METHODS, overlay.methods),
    STUDY_PLAN: localize(RU_STUDY_PLAN, overlay.studyPlan),
    BREAK_ROUNDS: localize(RU_BREAK_ROUNDS, overlay.breakRounds),
    FINALE: localize(RU_FINALE, overlay.finale),
    PROLOGUE: localize(RU_PROLOGUE, overlay.prologue),
    EPILOGUE: localize(RU_EPILOGUE, overlay.epilogue),
    SYNTAX_GUIDE: localize(RU_SYNTAX_GUIDE, overlay.syntaxGuide),
    DIAGRAM_TEXT: localize(RU_DIAGRAM_TEXT, overlay.diagrams),
    // Сколько пещер переведено целиком: пещера считается переведённой, когда у неё есть перевод урока
    translatedCaves: CHAPTERS.filter((chapter) => overlay.chapters?.[chapter.id]?.lesson).length,
  };
}

/** Русское содержимое — оригинал (в нём «переведены» все пещеры). Оно же запасное: если перевод не загрузился */
export const RU_CONTENT = { ...buildContent(), translatedCaves: RU_CHAPTERS.length };

// Переводы лежат отдельными кусками кода и подгружаются, только когда язык выбран
const loaders = import.meta.glob('./i18n/*/index.js');
const cache = new Map([['ru', RU_CONTENT]]);

/**
 * Загружает содержимое игры на языке lang. Перевода нет или он не загрузился
 * (нет сети и файла нет в офлайн-копии) — отдаёт русское: игра остаётся рабочей.
 */
export async function loadContent(lang) {
  if (cache.has(lang)) return cache.get(lang);
  const load = loaders[`./i18n/${lang}/index.js`];
  if (!load) return RU_CONTENT;
  try {
    const content = buildContent((await load()).default);
    cache.set(lang, content);
    return content;
  } catch {
    return RU_CONTENT;
  }
}
