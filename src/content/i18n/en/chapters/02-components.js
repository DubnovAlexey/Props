// Английский перевод пещеры 2 «Грот у входа» (оригинал — ../../../chapters/02-components.js
// и 02-components.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
export default {
  cave: 'Entrance Grotto',
  title: 'Components and JSX',
  goal: 'Understand that a component is a function and JSX is a convenient way to write its call.',

  pretest: {
    question: 'What do you think a component in React is?',
    options: [
      { text: 'A function that returns markup' },
      { text: 'A separate HTML file with a template' },
      { text: 'A CSS class for styling' },
      { text: 'A browser tab' },
    ],
    explain: 'A component is an ordinary JavaScript function. React calls it and gets a description of the interface.',
  },

  lesson: [
    {
      title: 'A component is a function',
      body: [
        'Imagine that an interface is built from **LEGO bricks**: a button, a product card, a site header. In [[react|React]] every brick is a [[component|component]].',
        'Technically a component is an ordinary JavaScript function that returns [[jsx|JSX]] — a description of what to draw.',
      ],
      code: 'function Greeting() {\n  return <h1>Hello, pupil!</h1>;\n}\n\n// use it as a tag:\n<Greeting />',
      key: 'A component name starts with a capital letter: `Greeting`, not `greeting`. With a lowercase letter React will decide it is an HTML tag.',
      scheme: {
        title: 'The life of a component',
        steps: [
          { title: 'We declare a function with a capital letter' },
          { title: 'The function returns JSX', code: 'return <h1>Hello!</h1>;' },
          { title: 'We use it as a tag' },
        ],
      },
      why: 'A component is an ordinary function, so it is declared with the word `function` (or with an arrow). The capital letter in the name is required: that is how JSX tells `<Greeting />` — your component — from `<div>` — an HTML tag. `return` gives away the description of the interface.',
      alt: [
        {
          code: 'const Greeting = () => {\n  return <h1>Hello, pupil!</h1>;\n};',
          note: 'An arrow function in a constant is the same thing. Pick one style for the whole project.',
        },
        {
          code: 'const Greeting = () => <h1>Hello, pupil!</h1>;',
          note: 'A short arrow without curly braces returns JSX at once — no `return` is needed.',
        },
        {
          code: 'export default function Greeting() {\n  return <h1>Hello, pupil!</h1>;\n}',
          note: 'With `export default` the component can be imported in another file.',
        },
      ],
      wrong: [
        {
          code: 'function greeting() {\n  return <h1>Hello!</h1>;\n}\n\n<greeting />',
          why: 'With a lowercase letter JSX will create an HTML tag `<greeting>`, and your function will not be called.',
        },
        {
          code: 'function Greeting() {\n  <h1>Hello!</h1>;\n}',
          why: 'There is no `return` — the function returns `undefined`, and nothing appears on the screen.',
        },
      ],
    },
    {
      title: 'JSX is not HTML but a function call',
      body: [
        'JSX looks like HTML, but it is JavaScript. The bundler ([[vite|Vite]]) translates every tag into a call of the `jsx()` function.',
        'All the attributes of a tag are gathered into **one object** — these are the future [[props|props]].',
      ],
      code: '// You write:\n<Greeting name="Anna" />\n\n// The bundler turns it into:\njsx(Greeting, { name: \'Anna\' })',
      key: 'Everything you write in the attributes of a component turns into one props object.',
      why: 'The bundler translates every tag into a call `jsx(type, props)`. So attributes are not “text in a tag” but keys of an object. That explains all the rules of JSX: one root, curly braces, `className`.',
      alt: [
        {
          code: "import { createElement } from 'react';\n\ncreateElement(Greeting, { name: 'Anna' });",
          note: 'The same result without JSX — `createElement`. It works, but it is hard to read, so everyone writes JSX.',
        },
      ],
      wrong: [
        {
          code: '<Greeting name=Anna />',
          why: 'An attribute value goes only in quotes (a string) or in curly braces (an expression). A bare word is a syntax error.',
        },
        {
          code: '<Greeting {name: "Anna"} />',
          why: 'An object cannot be put in place of attributes. A name is needed: `user={{ name: "Anna" }}` — or a spread: `{...user}`.',
        },
      ],
    },
    {
      title: 'An element is an order, not a dish',
      body: [
        'A call of `jsx()` returns a [[element|React element]] — a small object with the fields `type`, `key` and `props`. It is not a piece of the page yet but an “order” for React: what to draw and with what data.',
        'React takes the elements, calls the components — that is a [[render|render]] — and updates the [[dom|DOM]], the real page.',
      ],
      code: "// this is what an element looks like inside\n{\n  type: Greeting,\n  key: null,\n  props: { name: 'Anna' }\n}",
      analogy:
        'A waiter (JSX) writes down the order (an element), the cook (React) makes the dish (the DOM). The order is just a slip of paper — the dish still has to be cooked from it.',
      scheme: {
        left: {
          title: 'An element — the order',
          items: ['a plain JavaScript object', 'created on every render', 'draws nothing by itself'],
        },
        right: {
          title: 'The DOM — the dish',
          items: ['the real nodes of the page', 'React changes only the difference', 'this is what the user sees'],
        },
      },
      why: 'An element is a light descriptive object. React compares the new elements with the old ones and changes only the difference in the DOM. That is why frequent renders are not scary: creating an object is cheap.',
      alt: [
        {
          code: 'const element = <Greeting name="Anna" />;\nconsole.log(element.props.name); // \'Anna\'',
          note: 'An element can be put into a variable, and you can even look into its props.',
        },
      ],
      wrong: [
        {
          code: 'const element = <Greeting name="Anna" />;\nelement.props.name = \'Bob\';',
          why: 'In development mode an element and its props are frozen — there will be a TypeError. If you need another prop, create a new element.',
        },
      ],
    },
    {
      title: 'Components nest inside each other',
      body: [
        'A component can use other components. That gives a [[tree|component tree]]: each one has a [[parent|parent]] and may have [[child|children]] inside.',
        'It is the parent that decides which props the child gets. This is the main idea of all the caves.',
      ],
      why: 'Components are assembled like nesting dolls: a big one out of small ones. Every small one can be reused and checked separately. The `<main>` wrapper is needed because a function returns one value — one root.',
      alt: [{ note: 'A fragment `<>…</>` instead of `<main>` — when an extra tag in the markup is not needed.' }],
      wrong: [
        {
          code: 'function App() {\n  function Header() {\n    return <h1>Caves</h1>;\n  }\n  return <Header />;\n}',
          why: 'A component inside a component is created anew on every render: React treats it as a new type and resets its state. Declare components at the top level of the file.',
        },
      ],
    },
    {
      title: 'JSX rules that save you from mistakes',
      body: [
        '- One root: return one element or wrap several in a [[fragment|fragment]] `<>…</>`.',
        '- All tags are closed: `<img />`, `<input />`, `<br />`.',
        '- JavaScript inside the markup goes in curly braces: `{user.name}`. Only an [[expression|expression]] goes inside the braces.',
        '- Attributes are written in [[camelcase|camelCase]]: `className`, `onClick`.',
      ],
      code: 'function Card() {\n  const name = \'Milk\';\n  return (\n    <>\n      <h2 className="title">{name}</h2>\n      <img src="milk.png" alt={name} />\n    </>\n  );\n}',
      key: 'Curly braces `{}` in JSX are a “window into JavaScript”. Any expression can be written inside, but not `if` and not `for`.',
      scheme: {
        left: { title: 'Mistake', items: ['two roots in a row', '`class="…"`', '`{if (ok) …}`', '`<img>` without a slash'] },
        right: {
          title: 'The right way',
          items: ['a wrapper `<>…</>`', '`className="…"`', '`{ok ? … : …}`', '`<img />` — the tag is closed'],
        },
      },
      why: 'Every rule follows from the fact that JSX is JavaScript: a function returns one value (one root), attributes are keys of an object (hence camelCase), and `{}` is a place for an expression.',
      alt: [
        {
          code: 'function Card() {\n  const name = \'Milk\';\n  return (\n    <div className="card">\n      <h2>{name}</h2>\n    </div>\n  );\n}',
          note: 'A `<div>` wrapper instead of a fragment — when a class is needed for styles.',
        },
      ],
      wrong: [
        {
          code: 'return (\n  <h2>Cheese</h2>\n  <p>2 pcs</p>\n);',
          why: 'Two roots in a row: a function cannot return two values. Wrap them in a fragment `<>…</>`.',
        },
        {
          code: '<h2 class="title">{if (ok) \'Yes\'}</h2>',
          why: "`class` is a JavaScript word; in JSX you write `className`. And `if` is a statement: only an expression is allowed inside `{}`, for example `{ok ? 'Yes' : 'No'}`.",
        },
      ],
    },
  ],

  spell: {
    text: 'A component is a function with a capital letter: props in — markup out.',
    meaning: 'The input of a component is one [[props|props]] object, the output is [[jsx|JSX]].',
  },

  practice: [
    {
      question: 'You wrote `function card() {…}` and use `<card />`. What will happen?',
      options: [
        { text: 'React will create an HTML tag `<card>`, and your function will not be called' },
        {
          text: 'Everything will work, the case does not matter',
          why: 'The case matters: a lowercase letter means a built-in tag, a capital one means a component.',
        },
        { text: 'There will be a syntax error', why: 'Syntactically everything is correct — the tag is simply taken for HTML.' },
      ],
      hint: 'Look at the first letter of the name.',
      explain: 'React treats lowercase tags as HTML tags and will warn in the console about an unknown tag. Name the component `Card`.',
    },
    {
      question: 'Assemble the JSX: the name must get into the heading.',
      code: "function Hello() {\n  const name = 'Anna';\n  return <h1>Hello, ___name___!</h1>;\n}",
      explain: 'JavaScript inside JSX is written in curly braces: `{name}`.',
    },
    {
      statement: 'JSX is HTML that the browser understands directly.',
      explain:
        'The browser does not know JSX. The bundler turns it into ordinary JavaScript function calls before the code reaches the browser.',
    },
    {
      question: 'What will the bundler turn this JSX into?',
      options: [
        {},
        { why: 'Attributes are not passed one by one — they are gathered into one object.' },
        { why: 'JSX assigns nothing to the component — it creates a function call.' },
        { why: 'That is HTML markup, while JSX turns into a function call.' },
      ],
      explain:
        'All the attributes are gathered into one props object — the second argument of `jsx()`. Note: `count={3}` gave the number 3, not a string.',
    },
    {
      question: 'Find the line with the mistake.',
      code: 'function Avatar() {\n  return (\n    <div className="avatar">\n      <img src="bat.png" alt="Bat">\n    </div>\n  );\n}',
      fix: '<img src="bat.png" alt="Bat" />',
      hint: 'In HTML this is allowed, in JSX it is not.',
      explain: 'In JSX every tag must be closed. Single tags are closed with a slash: `<img />`, `<br />`, `<input />`.',
    },
    {
      question: 'Put in order what happens to JSX.',
      items: [
        'You write `<Card title="Cheese" />`',
        "The bundler turns it into `jsx(Card, { title: 'Cheese' })`",
        'The result is an element — an object `{ type, props }`',
        'React calls `Card(props)` — that is a render',
        'React updates the DOM on the page',
      ],
      explain: 'JSX → a `jsx()` call → an element → the component’s render → a DOM update.',
    },
    {
      question: 'Match the term with its simple explanation.',
      pairs: [
        ['Component', 'A function that returns JSX'],
        ['JSX', 'An HTML-like notation in JavaScript'],
        ['Element', 'An “order” object: what to draw'],
        ['DOM', 'The real tree of the page'],
      ],
      explain: 'A component creates elements through JSX, and React updates the DOM from the elements.',
    },
    {
      question: 'A component or an HTML tag?',
      bins: ['Component', 'HTML tag'],
      explain: 'A capital letter means your components, a lowercase one means built-in HTML tags.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: what is a component and what does JSX turn into?',
    starters: ['A component is…', 'JSX turns into…', 'A component name…'],
    keywords: [
      { label: 'A component is a function', words: ['function'] },
      { label: 'JSX turns into a jsx() call', words: ['jsx(', 'call', 'createelement', 'turn'] },
      { label: 'A component name starts with a capital letter', words: ['capital', 'uppercase', 'upper-case', 'big letter'] },
    ],
    model:
      'A component is a function with a capitalized name that returns JSX. JSX is a convenient notation: the bundler turns every tag into a call jsx(type, props), and React draws the page from these “orders”.',
  },
};
