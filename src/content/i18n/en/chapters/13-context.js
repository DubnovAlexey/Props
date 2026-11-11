// Английский перевод пещеры 13 «Тайный ход» (оригинал — ../../../chapters/13-context.js
// и 13-context.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute
export default {
  cave: 'Secret Passage',
  title: 'Prop drilling and Context',
  goal: 'Understand when passing props down a chain becomes a burden and how Context solves the problem.',

  pretest: {
    question: 'The prop `user` is passed through 4 components but is needed only by the last one. What is this problem called?',
    explain: 'Prop “drilling” is passing a prop through levels that do not need it.',
  },

  lesson: [
    {
      title: 'Drilling props',
      body: [
        'Sometimes data is needed deep down, and the components in between only pass it on. This is [[prop-drilling|prop drilling]]: every level has to know about a prop it does not need.',
      ],
      code: 'function App({ user }) {\n  return <Page user={user} />;\n}\nfunction Page({ user }) {\n  return <List user={user} />; // not needed\n}\nfunction List({ user }) {\n  return <Card user={user} />; // not needed\n}\nfunction Card({ user }) {\n  return <p>{user.name}</p>;   // needed here\n}',
      key: 'Passing through two or three levels is normal and even good: you see where the data comes from. The problem is long and fragile chains.',
      why: '`Page` and `List` do not use the `user` prop — they only pass it on. Every level has to know about `user`, and renaming the prop means editing every file. That is drilling (prop drilling).',
      alt: [
        {
          note: 'At 2–3 levels drilling is normal: you clearly see where the data comes from. It becomes a problem on long chains.',
        },
      ],
      wrong: [
        {
          why: 'A global variable goes around React: when the user changes, nobody re-renders, and the screen shows old data.',
        },
      ],
    },
    {
      title: 'Try composition first',
      body: [
        'Drilling is often cured by [[composition|composition]]: pass ready JSX through [[children|children]] — and the components in between do not need to know about `user`.',
      ],
      key: 'Advice from the React documentation: before you call Context, try passing JSX through children.',
      scheme: {
        left: { title: 'Drilling', items: ['App → Page → List → Card', '`user` passes through everyone', 'the go-betweens know too much'] },
        right: {
          title: 'Composition',
          items: ['App creates `<Card user={user} />` itself', 'Page and List draw `{children}`', 'the go-betweens know nothing about user'],
        },
      },
      why: '`App` creates `<Card user={user} />` itself and passes the ready element into `Page` and `List` as children. The go-betweens simply insert `{children}` and know nothing about `user`.',
      alt: [{ note: 'A ready element can be passed into a named slot too.' }],
      wrong: [{ why: 'The go-between forgot `{children}` — the card that App passed disappears.' }],
    },
    {
      title: 'Context is a broadcast for a subtree',
      body: [
        '[[context|Context]] works like a radio station: a [[provider|provider]] broadcasts a value, and any component below can “tune in” through [[usecontext|useContext]].',
      ],
      key: 'In React 19 a provider is written as `<UserContext value={…}>`. The old form `<UserContext.Provider>` still works for now, but it is becoming outdated.',
      scheme: {
        steps: [
          { title: 'We create a station' },
          { title: 'We turn on the broadcast over a subtree' },
          { title: 'Any descendant tunes in to the wave', sub: 'the components in between pass nothing' },
        ],
      },
      why: '`createContext` creates a channel with a default value. In React 19 the context itself works as a provider: `<UserContext value={…}>`. `useContext` in any descendant gets the value of the nearest provider up the tree.',
      alt: [
        { note: 'The old form with `.Provider` still works in React 19.' },
        { note: 'In React 19 a context can be read with the `use` function — unlike hooks, it may be called after a condition.' },
      ],
      wrong: [
        { why: 'A provider without `value` passes undefined — not even the default value.' },
        {
          code: '<Card />  {/* outside the provider */}\n\n// inside Card:\nconst user = useContext(UserContext); // null\nuser.name; // TypeError',
          why: 'Outside a provider the default value comes — here `null`, and reading a field crashes.',
        },
      ],
    },
    {
      title: 'The nearest provider and the default value',
      body: [
        '`useContext` looks for the **nearest** provider up the tree. If there is no provider, the default value from `createContext` is returned.',
        'Providers can be nested: the inner one overrides the outer one.',
      ],
      code: "const ThemeContext = createContext('night');\n\n<ThemeContext value=\"day\">\n  <A />          {/* A sees 'day' */}\n  <ThemeContext value=\"night\">\n    <B />        {/* B sees 'night' */}\n  </ThemeContext>\n</ThemeContext>\n<C />            {/* C: the default 'night' */}",
      after: [
        'In React 19 the value of a context can also be read through [[use|use]]`(ThemeContext)` — unlike hooks, it is allowed to be called inside `if`.',
      ],
      scheme: {
        root: {
          children: [{ note: "sees 'day'" }, { children: [{ note: "sees 'night' — the nearest" }] }],
        },
        caption: "`C` stands outside the providers and gets the default value from `createContext('night')`.",
      },
      why: '`useContext` looks for a provider up the tree and takes the value of the nearest one. No providers above — it takes the default value from `createContext`.',
      alt: [{ note: 'Your own wrapper hook: shorter, and it hides the details of the context.' }],
      wrong: [
        {
          why: 'A component does not see the provider it renders itself: `theme` comes from above, and only the descendants get `day`.',
        },
      ],
    },
    {
      title: 'The price of a context',
      body: [
        'When the value of a provider changes (compared with [[object-is|Object.is]]), **all** components that read this context re-render.',
        'An object created right in `value` is new on every render of the provider.',
      ],
      code: '// a new object on every render of App\n<AuthContext value={{ user, logout }}>\n\n// the same reference while user and logout have not changed\nconst auth = useMemo(\n  () => ({ user, logout }), [user, logout]);\n<AuthContext value={auth}>',
      key: 'Context is not a replacement for all props. Use it for truly shared data: the theme, the current user, the language.',
      scheme: {
        title: 'Why all the readers re-render',
        steps: [
          { title: 'App has re-rendered' },
          { title: 'The literal creates a new object' },
          { title: 'Object.is(old, new) → false' },
          { title: 'All the readers of the context re-render' },
          { title: 'useMemo: the same reference while user and logout are the same' },
        ],
      },
      why: 'When the value of a provider changes (by `Object.is`), ALL its readers re-render. The literal `{{ user, logout }}` is a new object on every render, that is, always a “change”. `useMemo` keeps the same reference until the dependencies change.',
      alt: [{ note: 'Split the context: components that need only `logout` will not re-render when `user` changes.' }],
      wrong: [
        {
          why: 'Empty dependencies: the object is created once and remembers the first `user` forever. All the readers will see outdated data.',
        },
      ],
    },
  ],

  spell: {
    text: 'If a prop goes through five doors, take the secret passage of Context — it is yours!',
    meaning: 'A long chain of passing is a reason to try [[composition|composition]] or [[context|Context]].',
  },

  practice: [
    {
      statement: 'Context fully replaces props, and it is better not to use props at all.',
      explain:
        'Props are the main way to pass data: they are explicit and clear. Context is for data needed by many components at different depths.',
    },
    {
      question: 'Create a context and a provider (React 19).',
      explain: '`createContext(the default value)` creates a context, `<ThemeContext value=…>` is a provider in React 19.',
    },
    {
      question: 'What will `useContext(ThemeContext)` return if there is no provider above?',
      options: [
        { text: "`'night'` — the default value" },
        { why: 'It would be undefined only if createContext were called without an argument.' },
        { text: 'An error', why: 'A missing provider is not an error — that is what the default value is for.' },
        { why: 'The default value here is the string night.' },
      ],
      explain: 'The default value is used when there is no provider above the component at all.',
    },
    {
      question:
        'A provider writes `value={{ user }}` and re-renders every second because of a timer. What happens to the components that read this context?',
      options: [
        { text: 'They re-render every second: value is a new object each time' },
        {
          text: 'They do not re-render while user is the same',
          why: 'A context compares value by reference, and `{ user }` is a new object on every render.',
        },
        { text: 'They re-render once', why: 'A new object appears on every render of the provider.' },
        { text: 'There will be an error', why: 'There is no error — only extra work.' },
      ],
      explain: 'Stabilise value with `useMemo(() => ({ user }), [user])` — or move the timer into a separate component.',
    },
    {
      question: 'Is this a good candidate for Context?',
      bins: ['Yes, into Context', 'Better as a prop'],
      items: [
        { text: 'The colour theme (day/night)' },
        { text: 'The current user' },
        { text: 'The language of the interface' },
        { text: 'The text of one button' },
        { text: 'The price of a product in a card' },
        { text: '`onDelete` for one card' },
      ],
      explain: 'Context is for “global” data needed by many. Pass the local data of one component in props.',
    },
    {
      question: 'How do you connect a Context?',
      items: [
        'Create a context: `createContext(the default value)`',
        'Wrap a part of the tree in a provider `<Ctx value={…}>`',
        'Call `useContext(Ctx)` in the component that needs it',
        'Use the value you got in JSX',
      ],
      explain: 'Create → wrap in a provider → read → use.',
    },
    {
      question: 'What does the React documentation advise trying for prop drilling before reaching for Context?',
      options: [
        { text: 'Composition: passing JSX through children' },
        { text: 'A global variable', why: 'Global variables do not trigger a re-render and break purity.' },
        {
          text: 'Keeping the data in localStorage',
          why: 'localStorage is browser storage, not a way to pass data between components.',
        },
        { why: 'forwardRef is about passing a ref, it has nothing to do with drilling.' },
      ],
      explain: 'It is often enough to rebuild the tree: the parent itself inserts a ready `<Card user={user} />` through children.',
    },
    {
      question: 'Find the line with the mistake.',
      explain:
        '`UserContext` is the context object itself, not the value. The value is read through `useContext(UserContext)` or `use(UserContext)`.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: what is prop drilling and how do you cure it?',
    starters: ['Prop drilling is when…', 'First you can try…', 'And if that did not help…'],
    keywords: [
      { label: 'Drilling is passing through levels that do not need it', words: ['chain', 'level', 'in between', 'through'] },
      { label: 'Composition through children', words: ['children', 'composition'] },
      { label: 'Context with a provider', words: ['context', 'provider', 'usecontext'] },
    ],
    model:
      'Prop drilling is when a prop is passed down a chain through components that do not need it. First you can try composition: pass ready JSX through children. If the data is needed by many components at different depths, Context helps: a provider sets the value, and the component that needs it reads it through useContext.',
  },
};
