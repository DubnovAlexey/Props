// Английский перевод пещер. Ключ — id пещеры, как в оригинале (src/content/chapters/index.js).
//
// Переведённая пещера лежит в своём файле (NN-имя.js) — там урок, разбор кода, задания.
// У пещер, до которых перевод ещё не дошёл, переведена только «вывеска» (название, тема, цель):
// она нужна уже сейчас — на карте пещер, в бестиарии и в свитках. Перевёл пещеру — перенеси
// её вывеску из HEADERS в файл пещеры и добавь файл в список внизу.
import setup from './01-setup.js';
import components from './02-components.js';
import jsBasics from './03-js-basics.js';
import functions from './04-functions.js';

const HEADERS = {
  arrays: {
    cave: 'Cave of Swarms',
    title: 'Arrays, truthiness and template strings',
    goal: 'Master the array methods that lists in React rest on, see the difference between a mutation and a copy, and sort out “truthy” and “falsy” values.',
  },
  passing: {
    cave: 'Parcel Grotto',
    title: 'Passing and receiving props',
    goal: 'Learn to pass any data in props and to receive it correctly.',
  },
  flow: {
    cave: 'Underground Waterfall',
    title: 'Downward flow and immutability',
    goal: 'Understand where data flows, why props must not be changed and what a “pure” component means.',
  },
  state: {
    cave: 'Cave of Memory',
    title: 'Props and state',
    goal: 'Tell props from state and understand when a component re-renders.',
  },
  vdom: {
    cave: 'Mirror Grotto',
    title: 'The virtual DOM and reconciliation',
    goal: 'Understand how props and state turn into changes on the page: the virtual DOM, render, reconciliation, commit and batched updates.',
  },
  callbacks: {
    cave: 'Cave of Echoes',
    title: 'Functions in props and lifting state up',
    goal: 'Learn to pass functions in props so that children can tell the parent about events.',
  },
  children: {
    cave: 'Gem Grotto',
    title: 'children and composition',
    goal: 'Master children, slots and composition — how to nest components inside each other.',
  },
  special: {
    cave: 'Cave of Keys',
    title: 'key, ref and DOM attributes',
    goal: 'Sort out the special props key and ref, as well as className, style and other attributes.',
  },
  context: {
    cave: 'Secret Passage',
    title: 'Prop drilling and Context',
    goal: 'Understand when passing props down a chain becomes a burden and how Context solves the problem.',
  },
  hooks: {
    cave: 'Clock Grotto',
    title: 'Hooks: memory, effects and custom hooks',
    goal: 'Sort out what hooks are, by what rules they are called and how useState, useEffect, useRef, useReducer and custom hooks work.',
  },
  async: {
    cave: 'Underground River',
    title: 'Data from a server: Promise, async and loading',
    goal: 'Understand how data from a server gets into components: Promise, async/await, fetch, loading in an effect without races, and loading and error states in props.',
  },
  performance: {
    cave: 'Cave of Speed',
    title: 'memo, references and speed',
    goal: 'Understand how props are tied to speed: memo, useCallback, useMemo and React Compiler.',
  },
  types: {
    cave: 'Crystal Grotto',
    title: 'Prop types',
    goal: 'Learn to describe which props a component accepts: TypeScript, JSDoc and the changes in React 19.',
  },
  patterns: {
    cave: 'Underground Workshop',
    title: 'Forms and patterns',
    goal: 'Master controlled and uncontrolled fields, conditional rendering and popular patterns with props.',
  },
};

export const CHAPTERS = {
  ...HEADERS,
  setup,
  components,
  'js-basics': jsBasics,
  functions,
};
