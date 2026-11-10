// Все пещеры в порядке спуска — от простого к сложному.
// Глава собирается из трёх частей:
//   NN-имя.js        — урок, задания, заклинание (основной текст);
//   NN-имя.syntax.js — разбор кода к карточкам («почему так / как ещё / как нельзя») и схемы;
//   ../story.js и ../difficulty.js — сюжет, ярус пещер и сложность заданий.
// Новая глава = новые файлы по образцу + строки в массивах ниже. Тесты проверят остальное.
import setup from './01-setup.js';
import components from './02-components.js';
import jsBasics from './03-js-basics.js';
import functions from './04-functions.js';
import arrays from './05-arrays.js';
import passing from './06-passing.js';
import flow from './07-flow.js';
import state from './08-state.js';
import vdom from './09-vdom.js';
import callbacks from './10-callbacks.js';
import children from './11-children.js';
import special from './12-special.js';
import context from './13-context.js';
import hooks from './14-hooks.js';
import asyncData from './15-async.js';
import performance from './16-performance.js';
import types from './17-types.js';
import patterns from './18-patterns.js';

import setupSyntax from './01-setup.syntax.js';
import componentsSyntax from './02-components.syntax.js';
import jsBasicsSyntax from './03-js-basics.syntax.js';
import functionsSyntax from './04-functions.syntax.js';
import arraysSyntax from './05-arrays.syntax.js';
import passingSyntax from './06-passing.syntax.js';
import flowSyntax from './07-flow.syntax.js';
import stateSyntax from './08-state.syntax.js';
import vdomSyntax from './09-vdom.syntax.js';
import callbacksSyntax from './10-callbacks.syntax.js';
import childrenSyntax from './11-children.syntax.js';
import specialSyntax from './12-special.syntax.js';
import contextSyntax from './13-context.syntax.js';
import hooksSyntax from './14-hooks.syntax.js';
import asyncDataSyntax from './15-async.syntax.js';
import performanceSyntax from './16-performance.syntax.js';
import typesSyntax from './17-types.syntax.js';
import patternsSyntax from './18-patterns.syntax.js';

import { CHAPTER_STORY, tierOf } from '../story.js';
import { levelOf } from '../difficulty.js';

const RAW = [
  setup,
  components,
  jsBasics,
  functions,
  arrays,
  passing,
  flow,
  state,
  vdom,
  callbacks,
  children,
  special,
  context,
  hooks,
  asyncData,
  performance,
  types,
  patterns,
];

/** Разбор кода и схемы: ключ — id главы, внутри ключ — заголовок карточки */
export const SYNTAX = {
  setup: setupSyntax,
  components: componentsSyntax,
  'js-basics': jsBasicsSyntax,
  functions: functionsSyntax,
  arrays: arraysSyntax,
  passing: passingSyntax,
  flow: flowSyntax,
  state: stateSyntax,
  vdom: vdomSyntax,
  callbacks: callbacksSyntax,
  children: childrenSyntax,
  special: specialSyntax,
  context: contextSyntax,
  hooks: hooksSyntax,
  async: asyncDataSyntax,
  performance: performanceSyntax,
  types: typesSyntax,
  patterns: patternsSyntax,
};

export const CHAPTERS = RAW.map((chapter, i) => ({
  ...chapter,
  order: i + 1,
  tier: tierOf(i + 1),
  story: CHAPTER_STORY[chapter.id],
  lesson: chapter.lesson.map((card) => ({ ...card, ...(SYNTAX[chapter.id]?.[card.title] ?? {}) })),
}));

export const CHAPTER_MAP = Object.fromEntries(CHAPTERS.map((chapter) => [chapter.id, chapter]));

/** Все задания с пометкой пещеры и сложности; внутри пещеры — от ★ к ★★★ */
export const ALL_TASKS = CHAPTERS.flatMap((chapter) =>
  chapter.practice.map((task) => ({ ...task, chapterId: chapter.id, level: levelOf(task.id) })).sort((a, b) => a.level - b.level),
);

export const TASK_MAP = Object.fromEntries(ALL_TASKS.map((task) => [task.id, task]));
