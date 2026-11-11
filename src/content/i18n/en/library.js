// Английский перевод «Свитков Графа» — накладка на ../../library/: заголовки разделов полного
// руководства и подписи схем (::scheme имя). Сами разделы лежат рядом, в ./library/sNN.md:
// страница свитков берёт переведённый раздел, если он есть, иначе — русский оригинал.
// Заголовок раздела переводится вместе с его текстом: tests/library.test.js проверяет, что у
// каждого заголовка есть раздел и наоборот, а в разделе те же схемы и блоки кода, что в оригинале.
export const LIBRARY = {
  titles: {
    s01: 'Props in simple words',
    s02: 'How it works technically',
    s03: 'Passing props: what can be passed and how',
    s04: 'Receiving props: how to read what was passed',
    s05: 'One-way data flow and the immutability of props',
    s06: 'Props and state: what is the difference',
    s07: 'Functions in props: “data down, events up”',
    s08: 'The children prop and composition',
    s09: 'Special props: key, ref and the attributes of HTML elements',
    s10: 'Props and performance',
    s11: 'Checking prop types: TypeScript, JSDoc and what changed in React 19',
    s12: 'Prop drilling and Context: when there are too many props',
    s13: 'Patterns of working with props',
    s14: 'An example from your projects: the “Smart Fridge” in React',
    s15: 'An example from your projects: a preferans table in Kosmo Game Hub',
    s16: 'Common mistakes: wrong → right',
    s17: 'A cheat sheet',
    s18: 'Practical tasks with answers',
    s19: 'A glossary of terms in plain language',
    s20: 'Resources for learning',
  },
  schemes: {
    'prop-path': {
      title: 'The path of a prop · 4 steps',
      steps: [
        { title: 'The parent writes JSX', code: '<ProductCard name="Milk" quantity={2} />' },
        { title: 'React builds the props object', code: "{ name: 'Milk', quantity: 2 }" },
        { title: 'It calls the component function' },
        { title: 'The card appears on the screen' },
      ],
    },
    'jsx-to-dom': {
      title: 'The path of a prop from JSX to the DOM · 5 steps',
      steps: [
        { code: '<ProductCard name="Milk" quantity={2} />' },
        { title: 'A function call', code: "jsx(ProductCard, { name: 'Milk', quantity: 2 })" },
        { title: 'A React element' },
        { title: 'Render' },
        { title: 'Only the changes go into the DOM' },
      ],
    },
    rerender: {
      title: 'The re-render loop · 5 steps',
      steps: [
        { title: 'The cause', sub: 'a setter · a render of the parent · a new context' },
        { title: 'Render', sub: 'React calls the component again' },
        { title: 'A new tree of elements' },
        { title: 'Reconciliation', sub: 'comparing with the old tree' },
        { title: 'Commit', sub: 'only the difference gets into the DOM' },
      ],
    },
    fridge: {
      title: 'Smart Fridge · the component tree',
      root: { note: 'the user, the products, the recipe, the error' },
    },
    kosmo: {
      title: 'Kosmo, preferans · from the engine to a card',
      root: {
        name: 'The game engine',
        note: 'knows all the cards',
        children: [
          {
            note: 'a slice for one player',
            children: [{ children: [{ note: 'only the number of cards' }, {}, {}, {}] }],
          },
        ],
      },
    },
  },
};
