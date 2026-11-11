// Английский перевод пещеры 17 «Кристальный грот» (оригинал — ../../../chapters/17-types.js
// и 17-types.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют. Текст с `<тегами>` и двоеточиями IntelliJ тоже
// иногда читает как код («недостижимый код», «метка», «with»): это ложные срабатывания, они выключены здесь же.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute,UnreachableCodeJS,JSDuplicatedDeclaration,CommaExpressionJS,JSVoidFunctionReturnValueUsed,UnnecessaryLabelJS,WithStatementJS,InfiniteLoopJS
export default {
  cave: 'Crystal Grotto',
  title: 'Prop types',
  goal: 'Learn to describe which props a component accepts: TypeScript, JSDoc and the changes in React 19.',

  pretest: {
    question: 'What happens to `propTypes` in React 19?',
    options: [
      { text: 'They are removed: the checks are silently ignored' },
      { text: 'They work as before' },
      { text: 'They have become mandatory' },
      { text: 'They automatically turn into TypeScript' },
    ],
    explain: 'In React 19 propTypes were removed. TypeScript is used to check props.',
  },

  lesson: [
    {
      title: 'Why describe props',
      body: [
        'A component is like a contract: “give me a string `name` and a function `onDelete` — and I will draw a card”. A type description is the contract written down.',
        '[[typescript|TypeScript]] checks the contract **right in the editor**: you see a typo in the name of a prop or a number instead of a string before running anything.',
      ],
      key: 'Types catch mistakes before the user does. A mistake in the editor is cheaper than a mistake in production.',
      scheme: {
        left: {
          title: 'Without types',
          items: [
            'a typo in the name of a prop — a silent undefined',
            'a number instead of a string — you find out in the browser',
            'the contract of the component — only in your head',
          ],
        },
        right: {
          title: 'With types',
          items: ['the mistake is underlined right in the editor', 'autocompletion of prop names', 'a type is living documentation'],
        },
      },
    },
    {
      title: 'The props type in TypeScript',
      body: ['In TypeScript you describe the [[type-props|props type]]. The `?` sign makes a prop [[optional-prop|optional]].'],
      code: 'type ProductCardProps = {\n  name: string;\n  quantity?: number; // optional\n  onDelete: (id: number) => void;\n  children?: React.ReactNode;\n};\n\nfunction ProductCard({ name, quantity = 1,\n  onDelete }: ProductCardProps) {\n  return <li>{name}: {quantity}</li>;\n}',
      key: 'children are usually typed as [[react-node|React.ReactNode]] — “anything that can be drawn”.',
      scheme: {
        title: 'What a props type consists of',
        root: {
          children: [
            { note: 'required' },
            { note: 'the ? sign — optional' },
            { note: 'a function' },
            { note: 'anything that can be drawn' },
          ],
        },
      },
      why: '`type` describes the shape of the props object. `?` — the prop is optional. `(id: number) => void` is a function that takes a number and returns nothing. `React.ReactNode` is anything that can be drawn. The type goes after the destructuring: `}: ProductCardProps`.',
      alt: [
        { note: '`interface` for objects is almost the same as `type`. Pick one style per project.' },
        { note: 'For a small component the type can be written right in the parameter.' },
      ],
      wrong: [
        {
          why: 'Inside destructuring a colon means RENAMING: this is “take name and call the variable string”. The type goes after the braces: `({ name }: { name: string })`.',
        },
        { why: '`any` turns the check off completely — TypeScript stops catching mistakes.' },
      ],
    },
    {
      title: 'What mistakes TypeScript catches',
      body: ['Three typical mistakes — and how the editor reports them:'],
      code: "<ProductCard name=\"Cheese\" />\n// Property 'onDelete' is missing…\n\n<ProductCard name={42} onDelete={del} />\n// Type 'number' is not assignable\n// to type 'string'\n\n<ProductCard nmae=\"Cheese\" onDelete={del} />\n// Property 'nmae' does not exist…",
      analogy:
        'TypeScript is like a guard at the entrance to the caves: it does not let in a guest without an invitation (onDelete) or with a wrong name (nmae).',
      scheme: {
        title: 'How TypeScript checks JSX',
        steps: [
          { title: 'It reads the props type of the component' },
          { title: 'It compares it with the attributes in JSX', code: '<ProductCard name="Cheese" />' },
          { title: 'A required one is missing, a wrong type or an extra name', sub: 'an underline in the editor even before running' },
        ],
      },
      why: 'TypeScript checks the attributes in JSX against the props type: are all the required ones in place, do the types match, are there unknown names. That is why the typo `nmae` is caught at once.',
      alt: [
        {
          code: '<ProductCard name="Cheese" onDelete={() => {}} />',
          note: 'A required function prop can be closed for a while with an empty arrow.',
        },
      ],
      wrong: [
        {
          why: 'The comment hides the mistake but does not fix it: in the browser there will still be a number instead of a string.',
        },
        {
          why: '`as any` is the same “plug”: the check is off, the mistake moves to runtime.',
        },
      ],
    },
    {
      title: 'Types without TypeScript: JSDoc',
      body: [
        'Writing in JavaScript? Describe the props in a [[jsdoc|JSDoc]] comment and turn on `// @ts-check` — the editor (for example, VS Code) checks them just like TypeScript.',
      ],
      scheme: {
        steps: [
          { title: 'Turn on the check at the start of the file' },
          { title: 'A comment with two asterisks' },
          { title: 'Describe the props object' },
          { title: 'The editor underlines mistakes, as in TypeScript' },
        ],
      },
      why: '`// @ts-check` at the start of a .js file turns on the TypeScript check in the editor. JSDoc is a comment with two asterisks `/** … */`, and `@param {{…}} props` describes the props object.',
      alt: [{ note: '`@typedef` gives a type a name — it can be reused.' }],
      wrong: [
        { why: 'One asterisk is an ordinary comment, not JSDoc: the editor ignores it.' },
        { why: 'In React 19 the `propTypes` check was removed — React silently ignores them.' },
      ],
    },
    {
      title: 'What was removed in React 19',
      body: [
        '- [[proptypes|propTypes]] — the checks are silently ignored, there will be no errors in the console;',
        '- [[defaultprops|defaultProps]] of function components — default values in destructuring take their place (class components still have defaultProps).',
      ],
      code: "// ❌ does not work for functions in React 19\nButton.defaultProps = { size: 'm' };\n\n// ✅ like this\nfunction Button({ size = 'm' }) { … }",
      key: 'See propTypes or defaultProps in old code? Move it to TypeScript and default values.',
      scheme: {
        left: {
          title: 'Removed',
          items: ['`defaultProps` of functions', '`propTypes`', 'string refs: `ref="input"`', '`ReactDOM.render`'],
        },
        right: {
          title: 'Instead',
          items: ['default values in the parameters', 'TypeScript or JSDoc', '`useRef` or a ref function', '`createRoot(…).render(…)`'],
        },
      },
      why: 'Default values are now set by JavaScript itself — in the destructuring of the parameters. It is shorter, visible right in the signature and works the same everywhere.',
      alt: [{ note: 'A fallback value can be substituted in the body with `??`.' }],
      wrong: [
        {
          why: '`ReactDOM.render` was removed in React 19. You need `createRoot(root).render(<App />)` from `react-dom/client`.',
        },
      ],
    },
    {
      title: 'All the props of an HTML element at once',
      body: ['To make your own button accept all the attributes of an ordinary button, extend its type with `ComponentProps`.'],
      scheme: {
        steps: [
          { title: 'All the props of a button' },
          { title: 'Plus your own' },
          { title: 'Yours separately, the rest into rest' },
          { title: 'The button gets everything at once' },
        ],
      },
      why: "`ComponentProps<'button'>` is all the props `<button>` accepts: `onClick`, `disabled`, `type`, `aria-*`… The `&` sign adds your own to them. `...rest` gathers everything else and passes it to the button. `import type` imports only a type — after the build it disappears.",
      alt: [{ note: 'If the parent passes its own `className`, it does not wipe out `variant`: the classes are combined.' }],
      wrong: [
        {
          why: "There is no `onClick` in the type — TypeScript says “Property 'onClick' does not exist”. That is exactly why `ComponentProps<'button'>` is needed.",
        },
      ],
    },
  ],

  spell: {
    text: 'Types are a contract: what is given and what is taken.',
    meaning: '[[typescript|TypeScript]] makes sure that the parent and the child keep the contract about props.',
  },

  practice: [
    {
      question: 'How do you make a prop optional in TypeScript?',
      options: [
        {},
        { why: 'There is no word optional in TypeScript.' },
        { why: 'There is no such syntax.' },
        { why: '`!` in a type means something else — the assertion “definitely not empty”.' },
      ],
      explain: 'The `?` sign after the name of a property makes it optional: inside, the value may be undefined.',
    },
    {
      statement: 'In React 19 propTypes print an error to the console if the type of a prop is wrong.',
      explain: 'propTypes were removed — React 19 simply does not check them. Type checking is now the job of TypeScript.',
    },
    {
      question: 'What will TypeScript say?',
      code: 'type Props = { title: string };\nfunction Card({ title }: Props) {\n  return <h2>{title}</h2>;\n}\n\n<Card titel="Cheese" />',
      options: [
        { text: 'An error: there is no `titel` property, and `title` was not passed' },
        { text: 'Nothing: extra props are allowed', why: 'For JSX literals TypeScript checks both extra and missing props.' },
        { text: 'The error appears only in the browser', why: 'TypeScript checks right in the editor, before running.' },
        { text: 'React prints a propTypes warning', why: 'propTypes do not work in React 19.' },
      ],
      explain: 'A typo in the name of a prop is a classic. TypeScript underlines it at once.',
    },
    {
      question: 'Describe the type for children.',
      explain: '`React.ReactNode` is the widest type: “anything that can be drawn”.',
    },
    {
      question: 'Which line will not work in React 19?',
      explain: 'defaultProps for function components were removed in React 19. A default value is set during destructuring.',
    },
    {
      question: 'Does this work in React 19 for a function component?',
      bins: ['Works', 'Does not work'],
      items: [
        { text: "A default value `({ size = 'm' })`" },
        {},
        {},
        { text: 'A props type in TypeScript' },
        {},
        { text: '`ref` as an ordinary prop' },
      ],
      explain: 'React 19 simplified the API: default values are in JavaScript, checks are in TypeScript, ref is an ordinary prop.',
    },
    {
      question: 'Match the notation and its meaning.',
      pairs: [
        ['`?` after the name', 'An optional prop'],
        ['`ReactNode`', 'Anything that can be drawn'],
        ["`ComponentProps<'button'>`", 'All the props of an ordinary button'],
        ['`// @ts-check`', 'Type checking in a JS file'],
      ],
      explain: 'These four techniques cover most tasks with prop types.',
    },
    {
      question: 'When does TypeScript find a mistake in props?',
      options: [
        { text: 'In the editor and during the build — before running' },
        { text: 'Only in the browser', why: 'Types are checked before running; plain JS without types gets into the browser.' },
        { text: 'Only on the server', why: 'Type checking has nothing to do with the server.' },
        { text: 'After publishing on GitHub', why: 'Mistakes are visible right while you write the code.' },
      ],
      explain: 'Types exist only at the development stage: during the build they are erased.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: why describe prop types, and what changed in React 19?',
    starters: ['Prop types are…', 'They help…', 'React 19 removed…'],
    keywords: [
      {
        label: 'Types are a contract, they catch mistakes in advance',
        words: ['contract', 'mistake', 'error', 'in advance', 'editor', 'before running'],
      },
      { label: 'propTypes were removed', words: ['proptypes'] },
      { label: 'defaultProps → default values', words: ['defaultprops', 'default'] },
    ],
    model:
      'Prop types are a contract between the parent and the child: which props are needed and of what kind. TypeScript checks it in the editor and catches mistakes before running. React 19 removed propTypes (TypeScript checks now) and defaultProps for functions (now there are default values in destructuring).',
  },
};
