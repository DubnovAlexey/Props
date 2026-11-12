// Вопросы преподавателя (Кафедра Графа) как задания. Чистые функции — без React; их проверяют тесты.
// Данные — src/content/course.js; здесь из них собираются задания того же вида, что в пещерах,
// чтобы их показывал тот же PracticeRunner, а ошибки попадали в тот же склеп повторения.

/** id задания по номеру вопроса: hw38-q01 … hw38-q20 и hw38-t1 … hw38-t5 (мини-тест) */
export const questionId = (number) => `hw38-q${String(number).padStart(2, '0')}`;
export const testId = (number) => `hw38-t${number}`;

/**
 * Все задания курса по порядку: сначала 20 вопросов, потом мини-тест.
 * К пояснению задания добавляется готовый ответ «как сказать преподавателю» —
 * так даже после ошибки игрок видит, как отвечать.
 * @param {object} course — COURSE на языке игрока (уже с накладкой перевода)
 */
export function courseTasks(course) {
  const questions = course.questions.map((item, index) => ({
    ...item.task,
    id: questionId(index + 1),
    chapterId: item.chapterId,
    course: { kind: 'question', number: index + 1 },
    explain: [...[].concat(item.task.explain), `**${course.answerLabel}**`, ...item.answer],
  }));
  const test = course.miniTest.map((item, index) => ({
    ...item.task,
    id: testId(index + 1),
    chapterId: item.chapterId,
    course: { kind: 'test', number: index + 1 },
  }));
  return [...questions, ...test];
}

/**
 * Какие пещеры на пути к вопросу ещё не пройдены (их хозяева не повержены).
 * Пустой список — путь пройден, вопрос открыт.
 * @param {string[]} path — id пещер пути
 * @param {object} chapters — progress.chapters
 */
export const pathLeft = (path, chapters) => path.filter((id) => !chapters[id]?.done);

/** С какой доли верных ответов на вопросы курса хозяин Кафедры считается поверженным (20 из 25) */
export const COURSE_PASS = 0.8;

/**
 * Кафедра в виде «пещеры»: так её показывают те же компоненты, что и пещеры, — узел на карте,
 * встреча с хозяином (CaveHost), карточка в бестиарии. id 'course' — ключ портрета в реестре хозяев.
 */
export function courseAsCave(course) {
  return {
    id: 'course',
    icon: '📋',
    color: '#d9a441',
    cave: course.cave,
    title: course.title,
    goal: course.goal,
    story: { guardian: course.guardian, intro: course.story.intro, outro: course.story.outro },
  };
}

/** Вопросы курса, которые разобраны в пещере chapterId: [{ number, question, answer, code }] */
export function questionsOfCave(course, chapterId) {
  return course.questions.flatMap((item, index) => (item.chapterId === chapterId ? [{ ...item, number: index + 1 }] : []));
}
