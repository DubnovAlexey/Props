// Английский перевод пещеры 14 «Часовой грот» (оригинал — ../../../chapters/14-hooks.js
// и 14-hooks.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// В примерах сумма — в долларах, а не в рублях: так понятнее англоязычному игроку.
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют. Текст с `<тегами>` и двоеточиями IntelliJ тоже
// иногда читает как код («недостижимый код», «метка», «with»): это ложные срабатывания, они выключены здесь же.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute,UnreachableCodeJS,JSDuplicatedDeclaration,CommaExpressionJS,JSVoidFunctionReturnValueUsed,UnnecessaryLabelJS,WithStatementJS,InfiniteLoopJS
export default {
  cave: 'Clock Grotto',
  title: 'Hooks: memory, effects and custom hooks',
  goal: 'Sort out what hooks are, by what rules they are called and how useState, useEffect, useRef, useReducer and custom hooks work.',

  pretest: {
    question: 'Where may you call hooks, for example `useState`?',
    options: [
      { text: 'Only at the top level of a component or of your own hook' },
      { text: 'Anywhere, even inside an `if`' },
      { text: 'Only in event handlers' },
      { text: 'Only in the App.jsx file' },
    ],
    explain:
      'React recognises hooks by the order of the calls, so they are called at the top of the component, without conditions and loops.',
  },

  lesson: [
    {
      title: 'A hook is an ability for a component',
      body: [
        'A [[hook|hook]] is a React function whose name starts with `use`. Hooks give a function component “superpowers”: memory, a link to the outside world, access to the context and the DOM.',
        'Props come from **outside**, hooks work from **inside** the component. Together they describe everything the component knows and can do.',
      ],
      code: 'function Timer({ label }) {\n  // the memory of the component\n  const [seconds, setSeconds] = useState(0);\n  // a value from the context\n  const theme = useContext(ThemeContext);\n  // a link to the outside world\n  useEffect(() => {\n    document.title = `${label}: ${seconds}`;\n  }, [label, seconds]);\n  return <p className={theme}>{seconds}</p>;\n}',
      key: 'The name of a hook always starts with `use`. By this prefix both React and the linter understand that the rules of hooks apply to the function.',
      scheme: {
        title: 'The main hooks are the main abilities',
        steps: [
          { title: 'Memory', sub: 'keeps a value between renders' },
          { title: 'Radio', sub: 'reads the value of a context' },
          { title: 'A link to the outside world', sub: 'timers, subscriptions, the page title' },
          { title: 'A pocket', sub: 'keeps without a re-render: a DOM node, a timer id' },
          { title: 'Your own hook', code: 'useAnything', sub: 'a set of abilities in one function' },
        ],
      },
      why: 'A hook is a function with a name starting with `use` that gives a component an ability: memory, reading a context, a link to the outside world. Hooks are called at the start of the component, at the top level. The array `[label, seconds]` tells the effect: “run again when one of these values changes”.',
      alt: [
        {
          note: 'In React 19 `<title>` can be rendered right in a component — React moves it into `<head>` itself, no effect is needed.',
        },
      ],
      wrong: [
        {
          code: 'function formatTime() {\n  const [seconds] = useState(0);\n  return `${seconds} s`;\n}',
          why: 'Hooks work only inside components and your own hooks (a name starting with `use`). From an ordinary function you get the error “Invalid hook call”.',
        },
        {
          why: 'An effect must return a cleanup function or nothing, and an async function returns a Promise. Declare an async function inside the effect and call it.',
        },
      ],
    },
    {
      title: 'The rules of hooks',
      body: [
        'Hooks are called **only at the top level** of a component or of your own hook: not inside `if`, loops, nested functions and not after an early `return`. These are the [[rules-of-hooks|rules of hooks]].',
        'The reason: React recognises hooks by the **order of the calls**. The first `useState` is the first memory cell, the second is the second. Hide a hook in a condition — the order “slides”, and the cells get mixed up.',
      ],
      code: 'function Profile({ user }) {\n  // ✅ hooks first, without conditions\n  const [open, setOpen] = useState(false);\n  const theme = useContext(ThemeContext);\n\n  if (!user) return <p>No user</p>;\n  return <Card user={user} open={open} />;\n}',
      key: 'There is one exception: `use` from React 19 may be called inside an `if`. The other hooks go only at the top and always in the same order.',
      scheme: {
        left: {
          title: 'May be called',
          items: ['at the start of a component', 'at the start of your own hook', 'always in the same order'],
        },
        right: {
          title: 'May not be called',
          items: ['inside `if`, loops, after an early `return`', 'in event handlers', 'in ordinary functions'],
        },
      },
      why: 'React does not know the names of your hooks — it tells them apart by the order of the calls: the first `useState`, the second `useContext`… If a hook is sometimes skipped, the order shifts, and React gives the state to the wrong hook. So all the hooks first, then the conditions.',
      alt: [
        {
          code: 'useEffect(() => {\n  if (!user) return; // the condition is INSIDE the hook\n  document.title = user.name;\n}, [user]);',
          note: 'Need a check? Do it inside the hook, not around it.',
        },
      ],
      wrong: [
        {
          code: 'function Profile({ user }) {\n  if (!user) return <p>No user</p>;\n  const [open, setOpen] = useState(false);\n}',
          why: 'When `user` appears, there will be more hooks than in the previous render — the error “Rendered more hooks than during the previous render”.',
        },
        {
          why: 'A hook in an event handler gives “Invalid hook call”. State is declared in the component, and the handler calls the setter.',
        },
      ],
    },
    {
      title: 'useState in depth: an update from the old value',
      body: [
        'If the new value depends on the old one, pass a **function** to the setter: React will substitute the freshest value. This is a [[functional-update|functional update]].',
        'Objects and arrays in state are replaced with a copy — like props, they are not mutated.',
      ],
      code: "const [count, setCount] = useState(0);\nconst [user, setUser] = useState({ name: 'Anna', age: 20 });\n\nfunction addThree() {\n  setCount(c => c + 1);\n  setCount(c => c + 1);\n  setCount(c => c + 1); // the result: +3\n}\n\nfunction rename() {\n  setUser(prev => ({ ...prev, name: 'Count' }));\n}",
      key: '`setCount(count + 1)` three times in a row gives only +1: all three calls see the same old `count`. The function `c => c + 1` gets a fresh value every time.',
      scheme: {
        left: { items: ['all three lines see `count = 0`', '0 + 1, 0 + 1, 0 + 1', 'the result: 1'] },
        right: { items: ['React passes the fresh value', '0 → 1 → 2 → 3', 'the result: 3'] },
      },
      why: '`count` is a snapshot of the value for this render, it does not change until the next one. The function `c => c + 1` gets the freshest value from the queue of updates. The setter of an object does not merge fields but replaces the whole object, so the old fields are copied with `...prev`.',
      alt: [
        { note: 'If you need +3 at once, one update is simpler.' },
        { code: "setUser({ ...user, name: 'Count' });", note: 'You can do without a function too, if there is one update per event.' },
      ],
      wrong: [
        {
          code: "setUser({ name: 'Count' });",
          why: "The state is replaced entirely: the `age` field disappears. Copy the old one: `{ ...prev, name: 'Count' }`.",
        },
        {
          code: "user.name = 'Count';\nsetUser(user);",
          why: 'The same object: `Object.is` says “nothing has changed”, and React may not re-render.',
        },
      ],
    },
    {
      title: 'useEffect is syncing with the outside world',
      body: [
        '[[useeffect|useEffect]] runs code **after** painting: timers, subscriptions, requests, work with `document`.',
        'The second argument is the [[deps|dependency array]]: the effect restarts when any value in it changes. The function the effect returned is the [[cleanup|cleanup]]: it runs before a repeat and when the component is removed.',
      ],
      code: 'function Clock({ intervalMs }) {\n  const [now, setNow] = useState(() => new Date());\n\n  useEffect(() => {\n    const id = setInterval(() => setNow(new Date()), intervalMs);\n    return () => clearInterval(id); // the cleanup\n  }, [intervalMs]);\n\n  return <p>{now.toLocaleTimeString()}</p>;\n}',
      key: 'Dependencies: `[]` — once after appearing, `[x]` — when `x` changes, no array — after every render. Everything the effect reads from props and state must be in the array.',
      scheme: {
        title: 'The life of an effect',
        steps: [
          { title: 'A render, the screen is updated' },
          { title: 'The effect runs' },
          { title: '`intervalMs` changed → the cleanup' },
          { title: 'The effect runs with the new value' },
          { title: 'The component was removed → the last cleanup' },
        ],
      },
      why: 'An effect runs AFTER the changes have reached the screen. The function it returns is the cleanup: React calls it before the next run and when the component is removed. `useState(() => new Date())` is a lazy initial value: the function runs only on the first render.',
      alt: [{ note: 'The same logic can be moved into your own hook and used in any clock.' }],
      wrong: [
        {
          why: 'There is no cleanup: when the interval changes and after the component is removed, the old timers keep ticking — a leak. In StrictMode you see it at once: twice as many ticks.',
        },
        {
          why: 'Without a dependency array the effect runs after EVERY render, and the setter triggers a new render — an endless loop.',
        },
      ],
    },
    {
      title: 'No effect is needed if you can compute',
      body: [
        'A common mistake is copying props into state through an effect. It is an extra render and a chance of a mismatch. If a value is computed from props, compute it right during render.',
        'An effect is needed for the **outside world**, not for recomputing data.',
      ],
      code: '// ❌ extra state and an extra render\nfunction Cart({ items }) {\n  const [total, setTotal] = useState(0);\n  useEffect(() => {\n    setTotal(items.reduce((s, i) => s + i.price, 0));\n  }, [items]);\n  return <p>{total} $</p>;\n}\n\n// ✅ just compute it\nfunction Cart({ items }) {\n  const total = items.reduce((s, i) => s + i.price, 0);\n  return <p>{total} $</p>;\n}',
      key: 'Before writing useEffect, ask yourself: “Am I syncing with something outside React?” If not, no effect is needed.',
      scheme: {
        left: {
          title: 'An effect is needed',
          items: ['timers and intervals', 'subscriptions: WebSocket, window events', 'third-party widgets and DOM APIs'],
        },
        right: {
          title: 'No effect is needed',
          items: ['compute from props and state', 'reacting to a click — in the handler', 'resetting state — through `key`'],
        },
      },
      why: 'An effect is a bridge to the outside world. If a value comes from props and state, it is an ordinary calculation during render. An effect here only adds a render with the old value.',
      alt: [{ note: 'Is the calculation heavy? Remember the result with `useMemo`. With React Compiler even that is often not needed.' }],
      wrong: [
        {
          why: 'Telling the parent through an effect is an extra round of renders. Call `onChange` right in the event handler where you change `value`.',
        },
      ],
    },
    {
      title: 'useRef, useReducer and your own hooks',
      body: [
        '[[useref|useRef]] keeps a value without a re-render — for example, a timer id or a reference to an input field.',
        '[[usereducer|useReducer]] gathers all the changes of complex state into one [[reducer|reducer function]]. That is how the progress of this game is built.',
        '[[custom-hook|Your own hook]] is a function `useSomething` that calls other hooks inside. It shares **logic**, not state: every component has its own copy.',
      ],
      code: "// your own hook: the logic of a switch\nfunction useToggle(initial = false) {\n  const [on, setOn] = useState(initial);\n  const toggle = () => setOn(value => !value);\n  return [on, toggle];\n}\n\nfunction Menu() {\n  const [open, toggleOpen] = useToggle();\n  return (\n    <button onClick={toggleOpen}>\n      {open ? 'Close' : 'Menu'}\n    </button>\n  );\n}",
      after: [
        'This game has its own hooks too: `useProgress()` reads the progress from a context, `useMediaQuery()` watches the width of the screen.',
      ],
      key: 'Two components with the same custom hook do not share state: every call of the hook is a separate memory.',
      scheme: {
        left: { items: ['a change → a re-render', 'for what is seen on the screen'] },
        right: {
          items: ['a change of `.current` → no re-render', 'for a DOM node, a timer id, a previous value'],
        },
      },
      why: 'Your own hook is a function starting with `use` that calls other hooks inside. A hook shares LOGIC, not state: every component that called `useToggle` has its own `on`. The array `[on, toggle]` lets you name the result whatever you like, as with `useState`.',
      alt: [
        { note: 'The same in one line: `useReducer` with the reducer “flip the value”.' },
        { note: 'You can return an object: the names are fixed, but the order does not matter.' },
      ],
      wrong: [
        {
          why: 'Your own hook obeys the same rules: there is a `useState` inside it, so calling it in a condition breaks the order of hooks.',
        },
        {
          why: 'Without `use` at the start of the name the linter will not check the rules of hooks, and the reader will not understand that it is a hook and must not be called in conditions.',
        },
      ],
    },
  ],

  spell: {
    text: 'Hooks only at the top and always in order; an effect is for the outside world, not for a calculation.',
    meaning: 'The [[rules-of-hooks|rules of hooks]] and the main rule of [[useeffect|useEffect]].',
  },

  practice: [
    {
      statement: '`useState` may be called inside an `if` if the condition is almost always true.',
      explain:
        'React recognises hooks by the order of the calls. In a condition the order may change, and the memory cells get mixed up. The only exception is `use`.',
    },
    {
      question: 'What will the button show after one click?',
      options: [
        {},
        { why: 'Both calls see the same old count = 0, so both set 0 + 1.' },
        { why: 'An update happened — just one, not two.' },
        { text: 'An error', why: 'Two setter calls in a row are legitimate.' },
      ],
      hint: 'What is count inside handleClick at the moment of the click?',
      explain: 'To add 2, use a functional update: `setCount(c => c + 1)` twice.',
    },
    {
      question: 'Find the violation of the rules of hooks.',
      code: 'function Profile({ user }) {\n  if (!user) return <p>Guest</p>;\n  const [open, setOpen] = useState(false);\n  return <Card user={user} open={open} />;\n}',
      fix: 'const [open, setOpen] = useState(false); // move it above the if',
      explain:
        'A hook after an early `return` is not called on every render: with `user = null` it is not there, and the order of hooks changes. All hooks go before any return.',
    },
    {
      question: 'Complete the effect with the cleanup of the timer.',
      explain:
        'The function an effect returns is the cleanup. `[]` means run once after the component appears; the cleanup fires when it is removed.',
    },
    {
      question: 'When will an effect with the dependencies `[userId]` run?',
      options: [
        { text: 'After the first render and every time `userId` has changed' },
        { text: 'Only once', why: 'Once is the empty array [].' },
        { text: 'After every render', why: 'That is how an effect with no dependency array at all works.' },
        { text: 'Before the render', why: 'Effects always run after painting.' },
      ],
      explain:
        'React compares the dependencies with the previous render using Object.is and restarts the effect if at least one has changed.',
    },
    {
      question: 'Will this trigger a re-render of the component?',
      bins: ['Will re-render', 'Will not re-render'],
      items: [
        { text: '`setCount(5)` from useState' },
        { text: '`ref.current = 5` from useRef' },
        { text: "`dispatch({ type: 'add' })` from useReducer" },
        { text: 'Changing an ordinary variable `let x`' },
        { text: 'A new value of a Context provider' },
        {},
      ],
      explain: 'Re-renders are triggered by state (useState, useReducer) and context. A ref and ordinary variables change “quietly”.',
    },
    {
      question: 'The life of an effect: put it in order.',
      items: [
        'The component has painted, the DOM is updated',
        'The effect has run',
        'A dependency changed — a new render',
        'The cleanup of the previous effect has run',
        'The effect has run again',
        'When the component is removed — the last cleanup',
      ],
      explain: 'The cleanup runs before every repeat and when the component is removed — that way timers and subscriptions do not “leak”.',
    },
    {
      question: 'Match the hook and its job.',
      pairs: [
        ['`useState`', 'Memory that re-renders'],
        ['`useRef`', 'Memory without a re-render'],
        ['`useEffect`', 'Syncing with the outside world'],
        ['`useReducer`', 'Complex state through actions'],
        ['`useContext`', 'A value from a context'],
      ],
      explain: 'These five hooks cover almost all tasks. useMemo and useCallback are for speed — more about them in the Cave of Speed.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: what are hooks, and by what rules are they called?',
    starters: ['A hook is…', 'Hooks may be called only…', 'useEffect is needed to…'],
    keywords: [
      { label: 'A hook is a React function whose name starts with use', words: ['use', 'function'] },
      { label: 'Only at the top level, not in if and loops', words: ['top', 'condition', 'loop', 'order', 'not in if'] },
      { label: 'useEffect is for the outside world', words: ['outside', 'timer', 'subscription', 'request', 'after render'] },
    ],
    model:
      'A hook is a React function whose name starts with use: it gives a component memory, effects, access to the context and the DOM. Hooks may be called only at the top level of a component or of your own hook and always in the same order: React recognises them by the order of the calls. useEffect is needed to sync with the outside world — timers, subscriptions, requests — not to recompute data.',
  },
};
