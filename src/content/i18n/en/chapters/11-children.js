// Английский перевод пещеры 11 «Грот самоцветов» (оригинал — ../../../chapters/11-children.js
// и 11-children.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute
export default {
  cave: 'Gem Grotto',
  title: 'children and composition',
  goal: 'Master children, slots and composition — how to nest components inside each other.',

  pretest: {
    question: 'What is the prop called that receives everything between `<Card>` and `</Card>`?',
    explain: 'React puts the content between the tags into the special prop `children`.',
  },

  lesson: [
    {
      title: 'Whatever is between the tags is children',
      body: ['Everything you put between the opening and the closing tag React passes in the special prop [[children|children]].'],
      code: '<Card>\n  <h2>Cheese</h2>\n  <p>2 pcs left</p>\n</Card>\n\nfunction Card({ children }) {\n  return <div className="card">{children}</div>;\n}',
      key: "`children` is an ordinary prop. `<Card>Text</Card>` is `jsx(Card, { children: 'Text' })`.",
      scheme: {
        steps: [
          { title: 'The parent puts content between the tags', code: '<Card><h2>Cheese</h2></Card>' },
          { title: 'React puts it into the `children` prop', code: '{ children: <h2>Cheese</h2> }' },
          { title: 'Card puts `{children}` where it is needed' },
        ],
      },
      why: '`children` is an ordinary prop with a special way of passing: the content is written between the opening and the closing tag. `{children}` in JSX inserts it in place.',
      alt: [
        { note: 'Without destructuring — `props.children`.' },
        { code: '<Card children={<h2>Cheese</h2>} />', note: 'You can pass it as an attribute too. It works, but between the tags it reads more naturally.' },
      ],
      wrong: [
        { why: 'We forgot `{children}` — everything put between the tags silently disappears.' },
        { why: 'The name of the prop is only `children` (in the plural). `child` will be undefined.' },
      ],
    },
    {
      title: 'What children can be',
      body: [
        "- a string: `<B>Hello</B>` → `'Hello'`;",
        '- one element: `<B><i /></B>` → an element object;',
        '- several children — an array: `<B><i /><i /></B>`;',
        '- nothing: `<B />` → [[undefined|undefined]];',
        '- even a function — that is a [[render-prop|render prop]].',
        'That is why children are usually not processed but simply inserted where they belong.',
      ],
      scheme: {
        left: { title: 'Is drawn', items: ['a string and a number', 'a JSX element', 'an array of elements'] },
        right: {
          title: 'Is not drawn',
          items: ['`null`, `undefined` — empty', '`true`, `false` — empty', 'a plain object `{}` — an error'],
        },
      },
    },
    {
      title: 'A frame and its content: composition',
      body: [
        '[[composition|Composition]]: a component gives a **frame**, and the parent decides the content. An error window does not know what text lies in it — so it fits any message.',
      ],
      code: 'function ErrorModal({ isOpen, title = \'Error\',\n  onClose, children }) {\n  if (!isOpen) return null;\n  return (\n    <div className="modal">\n      <h2>{title}</h2>\n      {children}\n      <button onClick={onClose}>Got it</button>\n    </div>\n  );\n}',
      key: 'Instead of a dozen props “for every occasion”, give the component children — let the parent decide what goes inside.',
      why: '`ErrorModal` is a frame: it can open, show a heading and close, but does not know what is inside. The content comes through `children`, so one frame can be used for any message. `return null` means “draw nothing”.',
      alt: [{ note: 'Typical use: the text of the error is children, and the open flag is computed from state.' }],
      wrong: [
        {
          why: 'A hook after an early `return` is not called on every render — the order of hooks breaks. All hooks first, then the conditions.',
        },
        {
          code: '<button onClick={onClose()}>Got it</button>',
          why: 'The parentheses call `onClose` during render — the window closes right after opening. You need `onClick={onClose}`.',
        },
      ],
    },
    {
      title: 'Slots: several places with names',
      body: ['If there are several places for content, pass JSX in ordinary props — these are [[slot|slots]].'],
      scheme: {
        root: { note: 'a frame with three slots' },
      },
      why: 'When there is one “hole”, `children` is enough. When there are several, JSX is passed in ordinary props with clear names: a prop can hold anything, including an element.',
      alt: [{ note: 'An optional slot: `sidebar` was not passed — there will be no `<aside>` block.' }],
      wrong: [
        {
          code: '<Layout header={Header} />\n// inside: <header>{header}</header>',
          why: 'A component function was passed, not an element. A function cannot be drawn — React warns “Functions are not valid as a React child”. You need `header={<Header />}`.',
        },
      ],
    },
    {
      title: 'A component in a prop and a render prop',
      body: ['You can pass the component itself (a function) into a prop, or a function that returns JSX.'],
      code: '// a component in a prop — rename it with a capital letter\nfunction Button({ icon: Icon, children }) {\n  return <button><Icon /> {children}</button>;\n}\n<Button icon={BatIcon}>Fly</Button>\n\n// a render prop: “I give the data — you draw it”\n<ProductList\n  renderItem={p => <b>{p.name}</b>} />',
      key: 'Passed a component (`BatIcon`)? Draw it as `<Icon />`, renamed to a name with a capital letter. Otherwise JSX takes it for an HTML tag.',
      scheme: {
        left: {
          title: 'A component in a prop',
          items: ['`icon={BatIcon}` — without the `<>` brackets', 'the child draws `<Icon />` itself', 'it can give its own props: `<Icon size={16} />`'],
        },
        right: {
          title: 'A render prop',
          items: ['`renderItem={p => <b>{p.name}</b>}`', 'the child calls it: `renderItem(product)`', '“I give the data — you draw it”'],
        },
      },
      why: 'Renaming `icon: Icon` during destructuring is needed because of a JSX rule: a tag with a lowercase letter is HTML, with a capital letter — a component. A render prop is a function the child calls with its own data, while the parent decides what the result looks like.',
      alt: [
        {
          code: '<Button icon={<BatIcon />}>Fly</Button>\n\nfunction Button({ icon, children }) {\n  return <button>{icon} {children}</button>;\n}',
          note: 'If the icon needs no props, it is simpler to pass a ready element and insert `{icon}`.',
        },
        {
          code: '<ProductList>\n  {p => <b>{p.name}</b>}\n</ProductList>\n// inside: products.map(p => children(p))',
          note: 'A function can be passed through children too — the same render prop.',
        },
      ],
      wrong: [
        {
          why: '`<icon />` with a lowercase letter is an HTML tag, not your component. React warns about an unknown tag.',
        },
        {
          code: '<Button icon={<BatIcon />} />\n// inside: <Icon />',
          why: 'An element was passed, but it is drawn as a component. `<Icon />` expects a function — you get the error “Element type is invalid”.',
        },
      ],
    },
    {
      title: 'An object is not a child',
      body: ['An object cannot be put into children directly — React does not know how to draw it.'],
      code: "const user = { name: 'Anna' };\n\n<p>{user}</p>\n// Error: Objects are not valid as a React child\n\n<p>{user.name}</p> // ✅ we draw a string",
      key: 'You can draw strings, numbers, elements and arrays. `null`, `undefined`, `true` and `false` draw nothing. An object — you cannot.',
      scheme: {
        left: {
          title: 'Can be drawn',
          items: ['strings and numbers', 'JSX elements', 'arrays of elements', '`null` and `false` — empty'],
        },
        right: {
          title: 'Cannot',
          items: ["a plain object `{ name: 'Anna' }`", 'a date `new Date()`', 'a function, if it was not called'],
        },
      },
      why: "React can draw strings, numbers, elements and arrays. It cannot show a plain object — it is unclear how to turn `{ name: 'Anna' }` into text. Take the field you need.",
      alt: [{ note: 'For debugging you can turn the object into a string and look at it whole.' }],
      wrong: [{ why: 'A date is an object too: the same error. Turn it into a string: `{date.toLocaleDateString()}`.' }],
    },
  ],

  spell: {
    text: 'Whatever is between the tags is children.',
    meaning: 'The content of a tag is the [[children|children]] prop, the same as the others.',
  },

  practice: [
    {
      question: 'What gets into `children`?',
      code: '<Bat>Bite!</Bat>',
      options: [
        { text: "The string `'Bite!'`" },
        { why: 'There is text between the tags — that is the children.' },
        { text: "An array `['Bite!']`", why: 'One text child is just a string, without an array.' },
        { text: 'An error', why: 'Text inside a component is a perfectly normal case.' },
      ],
      explain: 'One child comes as it is, several — as an array.',
    },
    {
      question: 'Find the line with the mistake.',
      explain: 'There is no `props` variable — the props are already unpacked in the parameters. Use `children` directly.',
    },
    {
      statement: '`<Card children="Hello" />` and `<Card>Hello</Card>` give the component the same `children` prop.',
      explain: 'children is an ordinary prop. Writing between the tags is just a convenient syntax for the same thing.',
    },
    {
      question: 'What will this code draw?',
      options: [
        { text: 'An empty `<div>`' },
        { text: 'The text “undefined”', why: 'undefined in JSX draws nothing.' },
        { text: 'An error', why: 'Having no children is a normal situation.' },
        { text: 'Nothing, not even the div', why: 'The component returns the div in any case.' },
      ],
      explain: 'children is undefined, and undefined in JSX turns into emptiness.',
    },
    {
      question: 'Match the concept and its meaning.',
      pairs: [
        ['`children`', 'What is between the tags'],
        ['The slot `header={…}`', 'A named place for JSX'],
        ['Render prop', 'A function that returns JSX'],
        ['Composition', 'Building from nested components'],
      ],
      explain: 'All four techniques solve one task: the parent decides what ends up inside.',
    },
    {
      question: 'The component got an icon component in the `icon` prop. Draw it.',
      explain: 'A variable holding a component must start with a capital letter, otherwise `<icon />` becomes an HTML tag.',
    },
    {
      question: 'What will happen?',
      code: "const product = { name: 'Cheese', count: 2 };\n\n<p>{product}</p>",
      options: [
        { text: 'The error “Objects are not valid as a React child”' },
        { text: '`[object Object]` appears on the screen', why: 'React does not turn an object into a string — it throws an error.' },
        { text: 'The JSON of the object is printed', why: 'For that you have to call JSON.stringify explicitly.' },
        { text: 'Nothing is printed', why: 'Only null, undefined and booleans draw emptiness.' },
      ],
      explain: 'Draw the field you need: `{product.name}` — or build the markup from the fields.',
    },
    {
      question: 'Can you put this into JSX as a child?',
      bins: ['Yes', 'No'],
      items: [
        { text: "The string `'Text'`" },
        { text: 'The number `42`' },
        { text: 'The element `<b>bold</b>`' },
        { text: "The object `{ name: 'Cheese' }`" },
        { text: '`null` (draws nothing)' },
        { text: 'A date object `new Date()`' },
      ],
      explain: 'Objects (dates included) cannot be drawn — turn them into a string: `date.toLocaleDateString()`.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: what is children, and why does an error window need children instead of a `text` prop?',
    starters: ['children is…', 'It is an ordinary…', 'That way the window…'],
    keywords: [
      { label: 'children is the content between the tags', words: ['between', 'tag'] },
      { label: 'It is an ordinary prop', words: ['prop'] },
      { label: 'Flexibility: anything can be inside', words: ['parent', 'any', 'flexib', 'anything'] },
    ],
    model:
      'children is the prop that receives everything written between the opening and the closing tag. A window with children is a frame: the parent decides what to put inside — text, a list or a retry button. One window fits any message.',
  },
};
