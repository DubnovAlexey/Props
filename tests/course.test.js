// Вопросы Реестра и Скрипторий Графа (src/content/course.js, src/utils/course.js).
// Решение владельца (12.11.2026): вопросы — обязательная часть, «не для замены, а для дополнения»;
// к каждому ведёт путь через пещеры (это игра, а не учебник). Тесты следят, чтобы вопросы не потерялись
// из испытания, путь вёл через существующие пещеры от простого к сложному, а задания проверялись верно.
import { describe, expect, it } from 'vitest';
import { COURSE } from '../src/content/course.js';
import { LEARN } from '../src/content/learn.js';
import { ALL_TASKS, CHAPTER_MAP, CHAPTERS } from '../src/content/chapters/index.js';
import { GLOSSARY } from '../src/content/glossary.js';
import { RU_CONTENT } from '../src/content/index.js';
import { GUARDIANS } from '../src/mascot/guardians/index.js';
import { buildExam, courseSummary } from '../src/utils/exam.js';
import { COURSE_PASS, courseAsCave, courseTasks, pathLeft, questionId, questionsOfCave, testId } from '../src/utils/course.js';
import { initialProgress, progressReducer, restore } from '../src/state/progressReducer.js';
import { checkTask } from '../src/utils/checkAnswer.js';
import { parseInline, termIdsIn } from '../src/utils/richText.js';
import { parseHash } from '../src/app/useHashRoute.js';
import { correctValue, expectValidTask, wrongValue } from './taskChecks.js';

const TASKS = courseTasks(COURSE);

/** Все строки значения — для проверки терминов и разметки */
function strings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value !== null && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

describe('вопросы Реестра: содержимое', () => {
  it('у каждого вопроса есть текст, ответ, пещера и путь через существующие пещеры', () => {
    for (const [index, item] of COURSE.questions.entries()) {
      const where = `вопрос ${index + 1}`;
      expect(item.question, where).toBeTruthy();
      expect(item.answer.length, where).toBeGreaterThan(0);
      expect(CHAPTER_MAP[item.chapterId], where).toBeDefined();
      expect(item.path.length, where).toBeGreaterThan(0);
      for (const id of item.path) expect(CHAPTER_MAP[id], `${where}: пещера ${id}`).toBeDefined();
    }
  });

  it('путь идёт от простого к сложному и кончается пещерой, где вопрос разбирают', () => {
    for (const [index, item] of COURSE.questions.entries()) {
      const orders = item.path.map((id) => CHAPTER_MAP[id].order);
      expect(orders, `вопрос ${index + 1}`).toEqual([...orders].sort((a, b) => a - b));
      expect(new Set(item.path).size, `вопрос ${index + 1}: пещеры не повторяются`).toBe(item.path.length);
      expect(item.path.at(-1), `вопрос ${index + 1}`).toBe(item.chapterId);
    }
  });

  it('пять тем покрывают все вопросы ровно по одному разу', () => {
    const numbers = COURSE.blocks.flatMap((block) => block.questions).sort((a, b) => a - b);
    expect(numbers).toEqual(COURSE.questions.map((_, index) => index + 1));
    for (const block of COURSE.blocks) expect(block.scheme || block.code, block.title).toBeTruthy();
  });

  it('все [[термины]] есть в словаре; внутри **жирного** терминов нет', () => {
    const ids = new Set(GLOSSARY.map((entry) => entry.id));
    const texts = strings([COURSE, LEARN]);
    expect(texts.flatMap(termIdsIn).filter((id) => !ids.has(id))).toEqual([]);
    expect(texts.filter((text) => parseInline(text).some((token) => token.type === 'bold' && token.value.includes('[[')))).toEqual([]);
  });

  it('у хозяина Скриптория есть портрет и все поля, как у хозяев пещер', () => {
    expect(GUARDIANS.course).toBeDefined();
    for (const field of ['name', 'kind', 'threat', 'defeat', 'why', 'bio']) expect(COURSE.guardian[field], field).toBeTruthy();
    const cave = courseAsCave(COURSE);
    expect(cave.id).toBe('course');
    expect(cave.story.guardian).toBe(COURSE.guardian);
  });

  it('мастерская: у учеников уникальные id, есть и спящий в гробу, и слишком юный для обращения', () => {
    const { apprentices: students } = COURSE.lab;
    expect(new Set(students.map((student) => student.id)).size).toBe(students.length);
    expect(students.some((student) => !student.isActive)).toBe(true);
    expect(students.some((student) => student.age < 18)).toBe(true);
  });
});

describe('вопросы Реестра: задания', () => {
  it('заданий столько же, сколько вопросов и Малого испытания; id уникальны и не совпадают с заданиями пещер', () => {
    expect(TASKS).toHaveLength(COURSE.questions.length + COURSE.miniTest.length);
    const ids = TASKS.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);
    const caveIds = new Set(ALL_TASKS.map((task) => task.id));
    expect(ids.filter((id) => caveIds.has(id))).toEqual([]);
    expect(ids[0]).toBe(questionId(1));
    expect(ids.at(-1)).toBe(testId(COURSE.miniTest.length));
  });

  it.each(TASKS.map((task) => [task.id, task]))('%s: корректные данные, верный ответ принимается, неверный — нет', (_, task) => {
    expectValidTask(task);
    expect(checkTask(task, correctValue(task))).toBe(true);
    expect(checkTask(task, wrongValue(task))).toBe(false);
  });

  it('после ответа на вопрос игрок видит, как отвечать Формуляру', () => {
    const task = TASKS[0];
    expect(task.explain).toContain(`**${COURSE.answerLabel}**`);
    for (const line of COURSE.questions[0].answer) expect(task.explain).toContain(line);
  });

  it('задания курса есть в общем списке заданий по id (испытание и склеп повторения их находят)', () => {
    for (const task of RU_CONTENT.COURSE_TASKS) expect(RU_CONTENT.TASK_MAP[task.id]).toBe(task);
    // а в пещерах по-прежнему ровно по 8 заданий
    expect(RU_CONTENT.ALL_TASKS).toHaveLength(CHAPTERS.length * 8);
  });
});

describe('путь к вопросу и вопросы пещеры', () => {
  it('pathLeft: непройденные пещеры пути; пустой список — вопрос открыт', () => {
    expect(pathLeft(['arrays', 'patterns'], {})).toEqual(['arrays', 'patterns']);
    expect(pathLeft(['arrays', 'patterns'], { arrays: { done: true } })).toEqual(['patterns']);
    expect(pathLeft(['arrays', 'patterns'], { arrays: { done: true }, patterns: { done: true } })).toEqual([]);
  });

  it('questionsOfCave: вопросы пещеры с номерами по порядку', () => {
    const passing = questionsOfCave(COURSE, 'passing');
    expect(passing.length).toBeGreaterThan(0);
    for (const item of passing) {
      expect(item.chapterId).toBe('passing');
      expect(COURSE.questions[item.number - 1].question).toBe(item.question);
    }
    expect(questionsOfCave(COURSE, 'setup')).toEqual([]);
  });

  it('ссылка на вопрос: #course-q7 открывает Скрипторий на седьмом вопросе', () => {
    expect(parseHash('#course-q7')).toEqual({ path: 'course', parts: ['course'], query: { question: '7' } });
    expect(parseHash('#course')).toEqual({ path: 'course', parts: ['course'], query: {} });
    expect(parseHash('#learn')).toEqual({ path: 'learn', parts: ['learn'], query: {} });
  });
});

describe('испытание Графа: обязательная часть', () => {
  it('все вопросы Реестра идут в конце, по порядку, вдобавок к заданиям пещер', () => {
    const ids = buildExam(CHAPTERS, ALL_TASKS, TASKS);
    expect(ids).toHaveLength(CHAPTERS.length + 2 + TASKS.length);
    expect(ids.slice(-TASKS.length)).toEqual(TASKS.map((task) => task.id));
    // по заданию из каждой пещеры — как и раньше
    const caveTasks = ids.slice(0, -TASKS.length).map((id) => ALL_TASKS.find((task) => task.id === id));
    for (const chapter of CHAPTERS)
      expect(
        caveTasks.some((task) => task.chapterId === chapter.id),
        chapter.id,
      ).toBe(true);
  });

  it('без вопросов курса испытание собирается как раньше', () => {
    expect(buildExam(CHAPTERS, ALL_TASKS)).toHaveLength(CHAPTERS.length + 2);
  });

  it('courseSummary считает верные ответы и собирает ошибки', () => {
    const missed = [TASKS[2].id, TASKS[5].id, 'passing-1'];
    const summary = courseSummary(TASKS, missed);
    expect(summary.total).toBe(TASKS.length);
    expect(summary.correct).toBe(TASKS.length - 2);
    expect(summary.missed.map((task) => task.id)).toEqual([TASKS[2].id, TASKS[5].id]);
    expect(summary.score).toBeCloseTo((TASKS.length - 2) / TASKS.length);
  });

  it('прогресс: лучший результат по вопросам курса растёт, а старое сохранение получает пустое поле', () => {
    let state = progressReducer(initialProgress, { type: 'exam', score: 0.6, course: 0.5 });
    expect(state.exam.courseBest).toBe(0.5);
    state = progressReducer(state, { type: 'exam', score: 0.9, course: 0.9 });
    state = progressReducer(state, { type: 'exam', score: 0.7, course: 0.7 });
    expect(state.exam).toEqual({ best: 0.9, attempts: 3, courseBest: 0.9 });
    expect(state.exam.courseBest >= COURSE_PASS).toBe(true);
    const old = restore({ ...initialProgress, exam: { best: 0.8, attempts: 2 } });
    expect(old.exam.courseBest).toBeNull();
  });
});
