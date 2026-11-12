// Сборка Испытания Графа и подсчёт обязательной части. Чистые функции — их проверяют тесты (tests/course.test.js).
import { pick, shuffle } from './random.js';

/** Сколько случайных заданий добавить к заданиям из каждой пещеры */
export const EXTRA_TASKS = 2;

/**
 * По одному случайному заданию из каждой пещеры и ещё несколько любых — вперемешку,
 * а в конце все вопросы Реестра по порядку (обязательная часть, вдобавок к пещерам).
 * Возвращает id заданий: по ним страница достаёт задания на языке игрока.
 */
export function buildExam(chapters, tasks, courseTasks = []) {
  const perCave = chapters.map((chapter) => pick(tasks.filter((task) => task.chapterId === chapter.id)));
  const rest = shuffle(tasks.filter((task) => !perCave.includes(task))).slice(0, EXTRA_TASKS);
  return [...shuffle([...perCave, ...rest]), ...courseTasks].map((task) => task.id);
}

/** Итог по вопросам Реестра: сколько верно, доля верных и задания с ошибкой */
export function courseSummary(courseTasks, mistakes) {
  const missed = courseTasks.filter((task) => mistakes.includes(task.id));
  const total = courseTasks.length;
  return { total, correct: total - missed.length, score: total ? (total - missed.length) / total : 0, missed };
}
