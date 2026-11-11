// Сложность заданий: ★ — узнать, ★★ — применить, ★★★ — найти подвох.
// Внутри пещеры задания идут от простых к сложным (порядок задаёт ALL_TASKS).
// Формат: id главы → [номера ★, номера ★★, номера ★★★].
const LEVELS = {
  setup: [
    [1, 3, 8],
    [2, 4, 5],
    [6, 7],
  ],
  components: [
    [3, 8, 1],
    [2, 4, 7],
    [5, 6],
  ],
  'js-basics': [
    [3, 2, 6],
    [4, 7, 1],
    [5, 8],
  ],
  functions: [
    [1, 3, 8],
    [2, 5, 6],
    [4, 7],
  ],
  arrays: [
    [1, 2, 6],
    [3, 4, 8],
    [5, 7],
  ],
  passing: [
    [3, 1, 6],
    [2, 7, 8],
    [4, 5],
  ],
  flow: [
    [1, 7, 8],
    [2, 4, 6],
    [3, 5],
  ],
  state: [
    [3, 1, 6],
    [5, 7, 8],
    [2, 4],
  ],
  vdom: [
    [1, 2, 8],
    [3, 5, 6],
    [4, 7],
  ],
  callbacks: [
    [2, 4, 8],
    [7, 5, 3],
    [1, 6],
  ],
  children: [
    [1, 3, 5],
    [4, 6, 8],
    [2, 7],
  ],
  special: [
    [3, 8, 1],
    [4, 6, 7],
    [2, 5],
  ],
  context: [
    [1, 6, 7],
    [2, 3, 5],
    [4, 8],
  ],
  hooks: [
    [1, 8, 5],
    [6, 4, 7],
    [2, 3],
  ],
  async: [
    [1, 4, 6],
    [2, 3, 7],
    [5, 8],
  ],
  performance: [
    [3, 1, 7],
    [2, 8, 6],
    [4, 5],
  ],
  types: [
    [1, 2, 8],
    [4, 7, 6],
    [3, 5],
  ],
  patterns: [
    [5, 6, 8],
    [3, 7, 1],
    [2, 4],
  ],
};

export const TASK_LEVELS = Object.fromEntries(
  Object.entries(LEVELS).flatMap(([chapterId, groups]) =>
    groups.flatMap((numbers, level) => numbers.map((n) => [`${chapterId}-${n}`, level + 1])),
  ),
);

// Подписи уровней («★ узнать», «★★ применить»…) — в словарях интерфейса: practice.levels

export function levelOf(taskId) {
  return TASK_LEVELS[taskId] ?? 2;
}
