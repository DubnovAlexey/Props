// Случайности: перемешать массив и выбрать элемент.

/** Новый перемешанный массив (алгоритм Фишера — Йетса), исходный не меняется */
export function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Случайный элемент массива */
export function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/** Перемешать так, чтобы порядок точно отличался от исходного (если это возможно) */
export function shuffleDifferent(array) {
  if (array.length < 2) return [...array];
  let result = shuffle(array);
  let guard = 0;
  while (result.every((item, i) => item === array[i]) && guard < 10) {
    result = shuffle(array);
    guard += 1;
  }
  return result;
}
