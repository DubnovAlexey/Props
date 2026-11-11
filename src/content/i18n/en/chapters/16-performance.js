// Английский перевод пещеры 16 «Пещера скорости» (оригинал — ../../../chapters/16-performance.js
// и 16-performance.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют. Текст с `<тегами>` и двоеточиями IntelliJ тоже
// иногда читает как код («недостижимый код», «метка», «with»): это ложные срабатывания, они выключены здесь же.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute,UnreachableCodeJS,JSDuplicatedDeclaration,CommaExpressionJS,JSVoidFunctionReturnValueUsed,UnnecessaryLabelJS,WithStatementJS,InfiniteLoopJS
export default {
  cave: 'Cave of Speed',
  title: 'memo, references and speed',
  goal: 'Understand how props are tied to speed: memo, useCallback, useMemo and React Compiler.',

  pretest: {
    question: 'A component is wrapped in `memo`. The parent passes `style={{ color: "red" }}`. Will memo skip the render?',
    options: [
      { text: 'No: a new object comes every time' },
      { text: 'Yes: the content is the same, after all' },
      { text: 'Yes: memo compares objects deeply' },
    ],
    explain: '`{{ … }}` in JSX creates a new object on every render, and memo compares by reference.',
  },

  lesson: [
    {
      title: 'A re-render is not always bad',
      body: [
        'A child re-rendering together with its parent is normal behaviour. React is fast, and only real changes get into the DOM — this is [[reconciliation|reconciliation]].',
        'It is worth optimising when a render is really heavy: big lists, complex calculations, charts.',
      ],
      key: 'Measure first (React DevTools → Profiler), then optimise. Optimisation “just in case” makes the code more complicated.',
      scheme: {
        left: {
          title: 'A render is',
          items: [
            'a call of the component function',
            'comparing the new elements with the old ones',
            'usually a fraction of a millisecond',
          ],
        },
        right: {
          title: 'Optimise if there are',
          items: [
            'thousands of items in a list',
            'heavy calculations in the body of the component',
            'visible slowdowns — measure first in React DevTools (Profiler)',
          ],
        },
      },
    },
    {
      title: 'memo — “the same parcel — I will not open it”',
      body: [
        '[[memo|memo]] wraps a component and skips a render if **all** the props are equal to the previous ones by [[object-is|Object.is]]. This is a [[shallow|shallow comparison]].',
      ],
      key: 'memo compares references, not the content. A new object or function in the props — and memo is useless.',
      why: '`memo` wraps a component. Before a re-render React compares every prop with the old one through `Object.is`. All of them matched — the render is skipped. The function inside `memo` has a name (`function ProductCard`) so that the name is visible in DevTools.',
      alt: [
        { note: 'You can declare the component separately and wrap it on export.' },
        {
          note: 'Your own comparison as the second argument: it returned true — the render is skipped. Careful: forget a prop, and the component shows outdated data.',
        },
      ],
      wrong: [
        {
          why: '`memo` takes a component (a function), not an element — React warns that the first argument must be a component.',
        },
        {
          code: "product.name = 'New';\nsetProducts([...products]);",
          why: 'The array is new, but the `product` object is the same. memo compares the reference, decides “nothing has changed” — and the card shows the old name.',
        },
      ],
    },
    {
      title: 'The enemies of memo: new objects and functions',
      body: ['Every render of the parent creates anew the objects, arrays and functions written right in JSX.'],
      code: "function List({ products }) {\n  return products.map(p => (\n    <ProductCard\n      key={p.id}\n      product={p}                   // the same reference\n      style={{ color: 'red' }}      // a new object\n      onDelete={() => remove(p.id)} // a new function\n    />\n  ));\n}",
      scheme: {
        left: { title: 'Every render — something new' },
        right: {
          title: 'The same reference',
          items: ['a constant outside the component', '`useMemo` and `useCallback`', 'React Compiler'],
        },
      },
      why: "`{{ color: 'red' }}` and `() => remove(p.id)` are created anew on every render of `List`. For `Object.is` a new object is always “different”, so the `memo` of `ProductCard` decides every time: the props have changed.",
      alt: [
        {
          code: "const RED = { color: 'red' }; // outside the component — one reference\n\n<ProductCard style={RED} onDelete={remove} />\n// inside: onDelete(product.id)",
          note: 'A constant object goes outside the component. A function is passed without a wrapper — let the child call it with the id itself.',
        },
      ],
      wrong: [
        {
          why: 'A hook inside `map` is a hook in a loop. The number of hooks changes together with the list — the rules of hooks are broken.',
        },
      ],
    },
    {
      title: 'useCallback and useMemo are stable references',
      body: [
        '[[usecallback|useCallback]] remembers a function, [[usememo|useMemo]] — the result of a calculation. A new value appears only when the [[deps|dependencies]] change.',
      ],
      key: 'useCallback and useMemo give almost nothing without memo at the child: a stable reference is needed by the one who compares it.',
      scheme: {
        left: { items: ['remembers a function', '`useCallback(fn, deps)`', 'for handler props'] },
        right: {
          items: ['remembers the result of a calculation', '`useMemo(() => value, deps)`', 'for objects and heavy calculations'],
        },
      },
      why: 'While the dependencies have not changed, both hooks return the same reference — and the `memo` of the child works. The update `prev => prev.filter(…)` does not read `products` directly, so the dependencies can be empty.',
      alt: [{ note: '`useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`. The form with useCallback is shorter.' }],
      wrong: [
        {
          why: 'The function remembered the `products` of the first render (a stale closure). Deletion will filter the old list and bring back what was deleted.',
        },
        { why: 'Without a dependency array `useMemo` recomputes the value on every render — zero benefit.' },
      ],
    },
    {
      title: 'React Compiler is an autopilot',
      body: [
        '[[react-compiler|React Compiler]] (the stable version 1.0 came out in October 2025) places memoisation itself during the build. With it manual memo, useMemo and useCallback are needed much less often.',
        'But you still need to understand references: the compiler relies on components being [[pure|pure]] and on nobody mutating props.',
      ],
      key: 'The compiler optimises only correct code: pure components and immutable data.',
      scheme: {
        steps: [
          { title: 'You write ordinary code', sub: 'without memo, useMemo and useCallback' },
          { title: 'During the build the compiler analyses the component' },
          { title: 'It adds memoisation itself', sub: 'objects and functions get stable references' },
          { title: 'Extra renders are skipped', sub: 'if the code follows the rules of React: purity, the rules of hooks, no mutations' },
        ],
      },
    },
    {
      title: 'memo does not save you from your own state and context',
      body: ['memo looks only at the props. The component’s own state or a context it reads has changed — and it re-renders.'],
      code: 'const Badge = memo(function Badge({ label }) {\n  const theme = useContext(ThemeContext);\n  // a change of the theme → a re-render, despite memo\n  return <span className={theme}>{label}</span>;\n});',
      scheme: {
        left: { title: 'memo will stop', items: ['a render of the parent with the same props'] },
        right: {
          title: 'memo will NOT stop',
          items: ['a change of its own state', 'a change of a context the component reads', 'new props'],
        },
      },
      why: '`memo` compares only the props. Its own state and context are other reasons for a re-render, and that is right: otherwise the component would show outdated data.',
      alt: [
        {
          note: 'To make fewer components re-render, split a big context into small ones: `Badge` will depend only on the theme.',
        },
      ],
      wrong: [
        {
          why: 'A new object on every render of the provider: all the readers re-render, and `memo` will not save them. Stabilise the value with `useMemo`.',
        },
      ],
    },
  ],

  spell: {
    text: 'memo looks at the reference, not at the filling.',
    meaning: 'An object that looks the same but is new is a different prop for [[memo|memo]].',
  },

  practice: [
    {
      question: 'Will memo skip the render if the parent passes `onDelete={() => remove(id)}`?',
      options: [
        { text: 'No: the arrow function is new every time' },
        { text: 'Yes: the function means the same thing', why: 'It means the same thing, but by reference it is new.' },
        { text: 'Yes: memo ignores functions', why: 'memo compares all the props, functions included.' },
        { text: 'It depends on the browser', why: 'Comparing by reference works the same everywhere.' },
      ],
      explain: 'Stabilise the function with useCallback — or turn on React Compiler.',
    },
    {
      question: 'Will the props be equal for memo between two renders of the parent?',
      bins: ['Equal', 'Not equal'],
      items: [
        { text: '`count={5}` and again `count={5}`' },
        { text: '`title="Cheese"` and again `title="Cheese"`' },
        { text: "`style={{ color: 'red' }}` right in JSX" },
        { text: '`items={[1, 2]}` right in JSX' },
        { text: '`onClick={handleClick}` from `useCallback(…, [])`' },
        {},
      ],
      explain: 'Primitives are equal by value. Objects, arrays and functions created in JSX are new on every render.',
    },
    {
      statement: 'memo compares props deeply, looking into nested objects.',
      explain:
        'The comparison is shallow: every prop is compared with the old one through Object.is. Your own comparison can be passed as the second argument of memo.',
    },
    {
      question: 'Make the function stable for a memo child.',
      hint: 'id is a parameter of the function, not an outside value.',
      explain: 'The functional update `prev => …` does not depend on outside values, so there are no dependencies: `[]`.',
    },
    {
      question: 'Badge is wrapped in memo and reads ThemeContext. The theme changed, the props are the same. What happens?',
      options: [
        { text: 'Badge re-renders: the context has changed' },
        {
          text: 'It does not re-render: the props are the same',
          why: 'memo checks only the props; a change of the context triggers a render anyway.',
        },
        { text: 'There will be an error', why: 'memo and Context work together perfectly well.' },
      ],
      explain: 'memo skips only the renders “because of the parent”. Its own state and context still update the component.',
    },
    {
      question: 'When does useMemo for a value in props make sense?',
      options: [
        { text: 'When the value goes into a memo child or takes long to compute' },
        { text: 'Always and for any values', why: 'Memoisation costs memory too and makes the code more complicated.' },
        { text: 'For strings and numbers', why: 'Primitives are equal by value anyway.' },
        { text: 'Never', why: 'Sometimes a stable reference or a cache of an expensive calculation is really needed.' },
      ],
      explain: 'useMemo is a tool for a specific problem, not a decoration for every value.',
    },
    {
      statement: 'With React Compiler you can mutate props — it optimises everything itself.',
      explain: 'The compiler counts on pure components and immutable data. Mutations break its optimisations.',
    },
    {
      question: 'How does memo decide whether to re-render a component?',
      items: [
        'The parent has re-rendered',
        'React checks whether the component is wrapped in memo',
        'It compares every prop with the old one through `Object.is`',
        'All are equal — it takes the previous result and skips the render',
      ],
      explain: 'If at least one prop is not equal, the component renders as usual.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: why does memo not help if the props contain `style={{ … }}`?',
    starters: ['memo compares…', 'But {{ … }} in JSX…', 'What can help is…'],
    keywords: [
      { label: 'Comparing by reference (Object.is)', words: ['reference', 'object.is'] },
      { label: 'A new object on every render', words: ['new', 'every render', 'each render', 'anew'] },
      { label: 'The fix: useMemo, moving it outside or the Compiler', words: ['usememo', 'usecallback', 'outside', 'compiler'] },
    ],
    model:
      'memo compares every prop with the old one by reference through Object.is. The notation style={{ … }} creates a new object on every render of the parent, so for memo the prop is “different” every time. What helps is useMemo, moving the object outside the component, or React Compiler.',
  },
};
