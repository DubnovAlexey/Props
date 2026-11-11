// Английский перевод пещеры 6 «Грот посылок» (оригинал — ../../../chapters/06-passing.js
// и 06-passing.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// В задании passing-8 валюта по умолчанию — доллар, а не рубль: так понятнее англоязычному игроку.
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute
export default {
  cave: 'Parcel Grotto',
  title: 'Passing and receiving props',
  goal: 'Learn to pass any data in props and to receive it correctly.',

  pretest: {
    question: 'How do you pass the number 5 into a component?',
    explain: 'Everything except strings is passed in curly braces: `count={5}`. In quotes it would be the string "5".',
  },

  lesson: [
    {
      title: 'A parcel from the parent',
      body: [
        '[[props|Props]] are a parcel: the [[parent|parent]] puts data into it, and the [[child|child]] unpacks and uses it.',
        'We pass them as attributes in JSX. We receive them as the **only argument** of the component function.',
      ],
      code: '// The parent passes\n<ProductCard name="Milk" quantity={2} />\n\n// The child receives\nfunction ProductCard({ name, quantity }) {\n  return <p>{name}: {quantity} pcs</p>;\n}',
      key: 'A component gets exactly one argument — the props object. Not two and not three — one.',
      why: 'Passing and receiving are two sides of the same record: the attribute `name="Milk"` on the parent becomes the key `name` in the child’s props object. The names must match letter for letter.',
      alt: [
        {
          code: 'function ProductCard(props) {\n  return <p>{props.name}: {props.quantity} pcs</p>;\n}',
          note: 'Without destructuring — through `props.name`.',
        },
      ],
      wrong: [
        {
          code: '<ProductCard Name="Milk" />\n\nfunction ProductCard({ name }) { … }',
          why: 'The case matters: we passed `Name` but read `name` — we get undefined.',
        },
      ],
    },
    {
      title: 'A string literal in quotes, JavaScript expressions in curly braces',
      body: [
        'You can pass **anything** in a prop: a string, a number, a boolean, an array, an object, a function and even JSX.',
        'A string literal can be passed in quotes: `title="Cheese"`. JavaScript expressions go in curly braces — they can hold a number, a function and the same string too: `title={"Cheese"}`.',
      ],
      code: '<Card\n  title="Cheese"        // a string\n  price={120}           // a number\n  inStock={true}        // a boolean\n  tags={[\'dairy\']}      // an array\n  meta={{ id: 7 }}      // an object\n  onBuy={handleBuy}     // a function\n  icon={<CheeseIcon />} // JSX\n/>',
      key: '`price="120"` is the string "120". To pass a number, write `price={120}`.',
      scheme: {
        left: { title: 'Quotes — only strings', items: ['`title="Cheese"`', '`id="7"` — a string too!'] },
        right: {
          title: 'Curly braces — anything',
          items: [
            '`price={120}` — a number',
            '`inStock={true}` — a boolean',
            "`tags={['dairy']}` — an array",
            '`onBuy={handleBuy}` — a function',
            '`icon={<CheeseIcon />}` — JSX',
          ],
        },
      },
      why: 'Quotes in JSX work as in HTML — only text. Curly braces open JavaScript, so a value of any type can be passed inside.',
      alt: [
        {
          code: "<Card title={'Cheese'} />\n<Card title={`Cheese ${weight} g`} />",
          note: 'A string can also go in braces — handy for template strings with substitution.',
        },
      ],
      wrong: [
        {
          code: '<Card price="120" />\n// inside: price + 1 → "1201"',
          why: 'In quotes it is a string, and arithmetic turns into gluing strings together.',
        },
        {
          why: 'The string "handleBuy" was passed, not a function — nothing will happen on a click, or there will be an error “is not a function”.',
        },
      ],
    },
    {
      title: 'Boolean and missing props',
      body: [
        'An attribute without a value means `true` — this is a [[boolean-shorthand|boolean prop without a value]]. If you do not specify a prop at all, it will be [[undefined|undefined]] inside.',
      ],
      analogy: 'An empty field in a form means “not filled in” (undefined), not “no” (false).',
      scheme: {
        title: 'What ends up in isOpen',
        steps: [{ sub: 'an attribute without a value' }, { sub: 'an explicit “no”' }, { sub: 'no attribute at all' }],
      },
      why: 'An attribute without a value in JSX means `true` — that makes flags shorter to write. And no attribute means no key in the object, that is, `undefined`.',
      alt: [{ note: 'Usually the flag is taken from a variable or from state.' }],
      wrong: [{ why: 'The string "false" is not empty, so it is “truthy” — the window will open! Write `isOpen={false}`.' }],
    },
    {
      title: 'Double braces are not magic',
      body: [
        '`meta={{ id: 7 }}`: the outer braces are a “window into JavaScript”, the inner ones are the object itself. [[style-object|style]] works the same way.',
      ],
      code: 'const meta = { id: 7 };\n<Card meta={meta} />\n\n// the same, only shorter:\n<Card meta={{ id: 7 }} />',
      scheme: {
        steps: [
          { title: 'The outer braces — “JavaScript from here on”' },
          { title: 'The inner braces — an object' },
          { title: 'Together' },
        ],
      },
      why: 'The outer braces say “JavaScript from here on”, the inner ones are an object literal. If you put the object into a variable, the double braces disappear.',
      alt: [
        {
          code: "const style = { color: 'red', fontSize: 16 };\n\n<p style={style}>Text</p>",
          note: 'An object in a variable is easier to read; moved outside the component, it is also not created anew.',
        },
      ],
      wrong: [
        {
          why: 'Single braces expect an expression, and `id: 7` is not an expression. An object needs its own braces: `{{ id: 7 }}`.',
        },
      ],
    },
    {
      title: 'Pass everything at once: spread',
      body: [
        'If the data already lies in an object, you can “pour” it into props with a [[spread|spread]]: every key becomes a separate prop.',
      ],
      code: 'const product = { name: \'Bread\', quantity: 1 };\n\n<ProductCard {...product} />\n// the same as\n<ProductCard name="Bread" quantity={1} />',
      key: 'Do not overuse spread: it becomes unclear which props the component really gets. If there are only a few props, pass them explicitly.',
      scheme: {
        steps: [
          { title: 'An object with data', code: "{ name: 'Bread', quantity: 1 }" },
          { title: 'Spread in JSX', arrow: 'every key → a separate prop' },
          { title: 'The child receives' },
        ],
      },
      why: '`{...product}` lays out the keys of the object as separate attributes. Handy when the shape of the data matches the props of the component.',
      alt: [{ note: 'Passing the whole object is an explicit and clear option.' }],
      wrong: [
        {
          code: '<ProductCard {...product} name="Loaf" {...extra} />',
          why: 'The syntax is correct but confusing: whatever is further to the right wins, and `extra.name` will silently overwrite “Loaf”. Do not mix many spreads and explicit props.',
        },
      ],
    },
    {
      title: 'An example from the “Smart Fridge”',
      body: ['In the fridge project `App` passes the list the products, the right to delete and the delete function:'],
      after: ['`canDelete` is computed right when it is passed. The list knows nothing about roles — it simply gets `true` or `false`.'],
      key: 'It is better to pass a child a ready decision (`canDelete`) rather than raw data from which it has to work something out itself.',
      scheme: {
        title: 'Who knows what',
        root: {
          note: 'knows user and products',
          children: [{ note: 'knows nothing about roles', children: [{}] }],
        },
      },
      why: '`canDelete` is computed by the one who knows about roles — `App`. The list gets a ready answer “allowed / not allowed” and does not depend on the role system, so it is easy to reuse.',
      alt: [
        {
          code: "<ProductList products={products} user={user} />\n// inside: user.role === 'ADMIN'",
          note: 'You could pass the whole user, but then the list would start to depend on roles.',
        },
      ],
      wrong: [{ why: 'The string "true" instead of a boolean: any non-empty string is “truthy” — even "false".' }],
    },
  ],

  spell: {
    text: 'Quotes hold a string — braces hold everything!',
    meaning:
      'Quotes give only a string. Curly braces take any JavaScript expression: a number, an array, an object, a function, JSX and a string too.',
  },

  practice: [
    {
      question: 'What type is the `count` prop?',
      options: [
        { text: 'The string `"10"`' },
        { text: 'The number `10`', why: 'In quotes it is always a string. A number needs curly braces: `count={10}`.' },
        { text: 'The boolean `true`', why: 'true would come from an attribute without a value.' },
        { why: 'The prop is specified, so it is passed.' },
      ],
      explain: 'Quotes in JSX mean a string literal. `"10" + 1` gives `"101"` — a classic mistake.',
    },
    {
      question: 'What arrives in the prop: a string or not a string?',
      bins: ['A string', 'Not a string'],
      items: [{ text: '`title="Cheese"`' }, { text: "`title={'Cheese'}`" }, {}, {}, { text: '`isOpen` (without a value)' }, {}],
      explain: "A string comes from quotes or from a string expression `{'Cheese'}`. An attribute without a value is `true`.",
    },
    {
      question: 'What arrives in the `isOpen` prop?',
      options: [
        {},
        { why: 'The name of an attribute does not become its value.' },
        { why: 'The attribute is specified — so it is passed.' },
        { why: 'An attribute without a value means true.' },
      ],
      explain: '`<Modal isOpen />` is a short way to write `isOpen={true}`.',
    },
    {
      question: 'Find the line with the mistake.',
      code: 'function App() {\n  return (\n    <ProductCard\n      name="Milk"\n      quantity=2\n    />\n  );\n}',
      explain: 'An attribute value is written in quotes (a string) or in curly braces (an expression). A bare `2` is a syntax error.',
    },
    {
      question: 'Pass an array of tags and a handler function.',
      answers: ["{['new']}", '{handleBuy}'],
      bank: ["{['new']}", '"[\'new\']"', '{handleBuy}', '{handleBuy()}', '"handleBuy"'],
      hint: 'The function has to be passed, not called.',
      explain:
        'An array and a function are passed in curly braces. `{handleBuy()}` would call the function at once during render and pass its result.',
    },
    {
      question: 'How many arguments does a component function get?',
      options: [
        { text: 'One — the props object' },
        { text: 'As many as there are attributes', why: 'All the attributes are gathered into one object.' },
        { text: 'Two: props and state', why: 'State is not passed as an argument — it is taken with the useState hook.' },
        { text: 'None', why: 'There is always an argument — the props object (even if it is empty).' },
      ],
      explain: 'React calls a component as `Card(props)`. Even without attributes an empty object `{}` arrives.',
    },
    {
      statement: '`<Card {...product} />` passes one prop named `product`.',
      explain:
        'Spread lays out the object: every property of `product` becomes a separate prop. To pass the whole object, write `product={product}`.',
    },
    {
      question: 'What will the component show? Type the text from the screen.',
      code: "function Price({ value, currency = '$' }) {\n  return <b>{value} {currency}</b>;\n}\n\n<Price value={99} />",
      answers: ['99 $', '99 dollars', '99 usd', '$99'],
      placeholder: 'the text on the screen',
      explain: '`currency` was not passed — the default value `$` was used.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: how do you pass a number, a string and a function in props?',
    starters: ['A string can be…', 'Numbers and functions…', 'A function is passed without…'],
    keywords: [
      { label: 'A string can be passed in quotes', words: ['quote'] },
      { label: 'Everything else goes in curly braces', words: ['brace', 'bracket', '{'] },
      {
        label: 'A function is passed without calling it',
        words: [
          'without calling',
          'not call',
          'don’t call',
          "don't call",
          'without parentheses',
          'without brackets',
          'reference',
          'the function itself',
        ],
      },
    ],
    model:
      'A string can be passed in quotes: title="Cheese". Everything else — numbers, arrays, objects, functions and JSX — is passed in curly braces: price={120}, onBuy={handleBuy}. A function is passed itself, without parentheses, otherwise it is called at once during render.',
  },
};
