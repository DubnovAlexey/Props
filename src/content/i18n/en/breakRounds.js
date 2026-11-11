// Английский перевод раундов мини-игры «Поймай мышей» (оригинал — src/content/breakRounds.js).
// Раунды из одних названий кода (хуки, атрибуты) переводить не нужно — только заголовок.
// Надписи короткие: их нужно успеть прочитать, пока мышь летит.
export const BREAK_ROUNDS = {
  hooks: {
    title: 'Catch the real React hooks',
  },
  truths: {
    title: 'Catch only the truth about props',
    good: [
      'Props are read-only',
      'Data flows down',
      'key is not in props',
      'children is a prop',
      'memo compares references',
      'ref is a prop in React 19',
      'A callback is a function in a prop',
    ],
    bad: [
      'A child changes props',
      'props.key is available',
      'React 19 needs propTypes',
      'memo compares deeply',
      'Props flow up',
      '{} === {} is true',
    ],
  },
  attrs: {
    title: 'Catch the correct JSX attributes',
  },
};
