// Английский перевод пещеры 7 «Подземный водопад» (оригинал — ../../../chapters/07-flow.js
// и 07-flow.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют. Текст с `<тегами>` и двоеточиями IntelliJ тоже
// иногда читает как код («недостижимый код», «метка», «with»): это ложные срабатывания, они выключены здесь же.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute,UnreachableCodeJS,JSDuplicatedDeclaration,CommaExpressionJS,JSVoidFunctionReturnValueUsed,UnnecessaryLabelJS,WithStatementJS,InfiniteLoopJS
export default {
  cave: 'Underground Waterfall',
  title: 'Downward flow and immutability',
  goal: 'Understand where data flows, why props must not be changed and what a “pure” component means.',

  pretest: {
    question: 'A child got the prop `title`. Can it change it: `props.title = "New"`?',
    options: [
      { text: 'No, props are read-only' },
      { text: 'Yes, it is an ordinary object' },
      { text: 'Yes, and the parent will see the change' },
    ],
    explain: 'Props belong to the parent. In development mode React even “freezes” them.',
  },

  lesson: [
    {
      title: 'Data flows down like a waterfall',
      body: [
        'In React data flows in one direction — from the parent to the children. This is a [[one-way|one-way data flow]]. A child cannot “climb up” and change the parent’s data directly.',
        'In return the app is predictable: to find out where a value came from, it is enough to look up the tree.',
      ],
      key: 'Props flow only from top to bottom. What goes from the bottom up is not data but function calls.',
      scheme: {
        title: 'The data loop',
        steps: [
          { title: 'The parent keeps the data', sub: 'in its state' },
          { title: 'Passes it down in props' },
          { title: 'The child shows the data' },
          { title: 'An event — a function call upward', code: 'onChange(newValue)' },
          { title: 'The parent updates the data', sub: 'React re-renders both — the loop is closed' },
        ],
      },
    },
    {
      title: 'Props are read-only',
      body: [
        'Props belong to the parent. The child reads them but does not change them — they are [[read-only|read-only]].',
        'In development mode React “freezes” the props object, and an attempt to assign a value throws an error.',
      ],
      code: "function Card(props) {\n  props.title = 'New';\n  // TypeError: Cannot assign to read only\n  // property 'title' of object\n  return <h2>{props.title}</h2>;\n}",
      key: 'Need a different value? Ask the parent to change it (through a function prop) or keep your own [[state|state]].',
      scheme: {
        left: {
          title: 'Not allowed',
          items: ["`props.title = 'New'`", 'the child edits the parent’s data', 'the screen and the data drift apart'],
        },
        right: {
          title: 'Allowed',
          items: ['compute a new value in your own variable', 'ask the parent through a callback', 'keep your own state'],
        },
      },
      why: 'Props belong to the parent. If the child changed them, the parent would not know about it, and the screen would show two different “truths”. That is why React freezes the props object in development mode.',
      alt: [
        { note: 'Need a changed value? Compute a new one in your own variable.' },
        {
          code: "function Card({ title, onRename }) {\n  return (\n    <button onClick={() => onRename('New')}>\n      {title}\n    </button>\n  );\n}",
          note: 'Need to change the parent’s data? Ask it with a function prop.',
        },
      ],
      wrong: [
        {
          code: "function Card(props) {\n  props.title = 'New';\n  return <h2>{props.title}</h2>;\n}",
          why: 'A TypeError in development mode, and in production a silent mismatch with the parent.',
        },
      ],
    },
    {
      title: 'Freezing covers only the top level',
      body: [
        '`Object.freeze` freezes only the top level of an object. A nested array can technically be changed — but you **must not** do it: React will not learn about the change, and the parent’s data will be spoiled.',
      ],
      code: "function List({ items }) {\n  items.push('more'); // no error, but this is a bug!\n  return <p>{items.length}</p>;\n}",
      key: 'No error is not a permission. Props must not be mutated at any level.',
      scheme: {
        title: 'What is frozen',
        root: {
          note: 'frozen: props.items = … → TypeError',
          children: [
            {
              note: 'the array is not frozen — but you still must not change it',
              children: [{ note: 'hands off as well' }],
            },
          ],
        },
      },
      why: '`Object.freeze` does not go deep: nested arrays and objects can technically be changed. But the rule “do not mutate” holds at every level.',
      alt: [
        {
          code: "function List({ items }) {\n  const withExtra = [...items, 'more'];\n  return <p>{withExtra.length}</p>;\n}",
          note: 'A new array based on the prop — the original is untouched.',
        },
      ],
      wrong: [
        {
          code: "items.push('more');\nitems[0] = 'other';\nitems.sort();",
          why: 'All three lines change the parent’s array in place: React will not learn about the change, and the data will “drift”.',
        },
      ],
    },
    {
      title: 'A component is a pure function',
      body: [
        'React expects a component to be a [[pure|pure function]]: the same props → the same markup, without [[side-effect|side effects]] during render.',
        'To catch violations, [[strict-mode|StrictMode]] calls components twice in development mode.',
      ],
      code: 'let counter = 0;\n\nfunction Bad() {\n  counter++; // changes an outside variable\n  return <p>{counter}</p>;\n}\n\nfunction Good({ count }) {\n  return <p>{count}</p>; // props only\n}',
      key: 'Render is a calculation, not an action. Requests, timers and changes of outside variables belong in event handlers or effects.',
      scheme: {
        left: {
          title: 'Allowed in render',
          items: ['compute from props and state', 'filter or sort a copy', 'return JSX'],
        },
        right: {
          title: 'Not allowed in render',
          items: ['a `fetch` request', 'a `setInterval` timer', 'changing outside variables and `document`'],
        },
      },
      why: 'React may call a component whenever and as many times as it likes — for example, twice in StrictMode. A pure function gives the same result for the same props, so repeated calls are safe.',
      alt: [{ note: 'The outside value (the time) was passed in a prop — the component is pure again.' }],
      wrong: [
        {
          code: "function Bad() {\n  fetch('/api/fridge');\n  return <p>Loading…</p>;\n}",
          why: 'A request during render goes out on every re-render. Side effects belong in handlers or in `useEffect`.',
        },
        {
          code: "function Bad() {\n  document.title = 'Caves';\n  return <p>…</p>;\n}",
          why: 'Changing the outside world during render is a side effect too.',
        },
      ],
    },
    {
      title: 'Immutability: something new instead of editing the old',
      body: [
        'When data has to change (at its owner — in state), it is not edited but replaced with a copy. This is [[immutability|immutability]].',
      ],
      code: "// BAD: we edit the old array\nproducts.push(newItem);\n\n// GOOD: we create new ones\nconst added = [...products, newItem];\nconst without = products.filter(p => p.id !== id);\nconst renamed = { ...product, name: 'Kefir' };",
      key: 'React notices a change by a new [[reference|reference]]. A new array or object means something has changed.',
      scheme: {
        left: { title: 'Mutates — not allowed' },
        right: { title: 'Creates something new — allowed' },
      },
      why: 'React understands that the data has changed by a new reference. A mutation keeps the same reference — and React may skip the update.',
      alt: [{ note: '`concat` and `toSorted` return new arrays too.' }],
      wrong: [
        {
          why: 'The same reference: React compares the old and the new with `Object.is`, sees “the same thing” and may not re-render.',
        },
      ],
    },
  ],

  spell: {
    text: 'Props flow down from the top, callbacks climb up nonstop.',
    meaning: 'Data goes down through [[props|props]], events go up through [[callback|callbacks]].',
  },

  practice: [
    {
      statement: 'A child can change a prop, and the parent will see the new value.',
      explain: 'Props are read-only. For the value to change, its owner (the parent) changes it in its state.',
    },
    {
      question: 'What happens in development mode?',
      options: [
        { text: 'A TypeError: the property is read-only' },
        {
          text: 'The heading turns into capital letters',
          why: 'In development mode the props object is frozen — the assignment throws an error.',
        },
        {
          text: 'The parent gets capital letters too',
          why: 'Even if the assignment worked, it would be a mutation of someone else’s data.',
        },
        {
          text: 'React silently ignores the assignment',
          why: 'Module code runs in JavaScript strict mode, and there writing to a frozen object throws a TypeError.',
        },
      ],
      explain: 'The right way is to compute a new value in your own variable: `const upper = props.text.toUpperCase();`.',
    },
    {
      question: 'Which line spoils the parent’s data?',
      hint: 'Which array methods change the array itself?',
      explain:
        '`sort()` sorts the array in place — that is, it mutates the prop. Make a copy first: `[...tasks].sort()`, or use `tasks.toSorted()`.',
    },
    {
      question: 'May you do this during render?',
      bins: ['Allowed in render', 'Not allowed in render'],
      items: [
        { text: 'Compute `total = price * count`' },
        { text: 'Send a `fetch` to the server' },
        { text: 'Filter an array with `filter`' },
        { text: 'Change a global variable' },
        { text: 'Return JSX based on props' },
        { text: 'Start a `setInterval`' },
      ],
      explain: 'Render only computes. Everything that affects the outside world belongs in event handlers or in useEffect.',
    },
    {
      question: 'How do you correctly add a product to a list kept in state?',
      options: [
        {},
        { why: 'The array reference is the same — React may not notice the change. And it is a mutation.' },
        { why: 'This is a mutation too, and React will not even learn about it.' },
        { why: 'It mutates a prop — never do that.' },
      ],
      explain: 'We create a new array and give it to the setter. A new reference is the signal for React to re-render.',
    },
    {
      question: 'How does a value change in a one-way flow?',
      items: [
        'The parent keeps the data in state',
        'It passes the data to the child in a prop',
        'The child calls the function prop `onChange`',
        'The parent updates its state',
        'React re-renders both with new props',
      ],
      explain: 'Data down, the event up, the update at the owner, new props down.',
    },
    {
      statement: 'StrictMode calls components twice in the built (production) app too.',
      explain: 'The double call happens only in development mode, to help you find impure code. There is none of it in production.',
    },
    {
      question: 'Why can a nested array in props be changed without an error?',
      options: [
        { text: '`Object.freeze` freezes only the top level' },
        { text: 'Arrays cannot be frozen', why: 'They can — React simply freezes only the props object itself.' },
        { text: 'Because it is allowed', why: 'There is no error, but you still must not mutate.' },
      ],
      explain: 'Freezing is shallow. The absence of an error does not make the mutation right: the parent’s data will be spoiled.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: why must props not be changed, and how do you change a value then?',
    starters: ['Props belong to…', 'If you need a different value…', 'You can also…'],
    keywords: [
      { label: 'Props are the parent’s data, read-only', words: ['parent', 'read', 'someone else'] },
      { label: 'A change goes through a function from the parent', words: ['function', 'callback', 'onchange'] },
      { label: 'Or your own state', words: ['state', 'usestate'] },
    ],
    model:
      'Props are the parent’s data, the child only reads them. If a different value is needed, the child calls the function the parent gave it, and the parent changes its state — then React re-renders the child with new props. If the value is needed only by the component itself, it keeps its own state.',
  },
};
