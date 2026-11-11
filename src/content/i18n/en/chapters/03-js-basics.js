// Английский перевод пещеры 3 «Пещера алхимика» (оригинал — ../../../chapters/03-js-basics.js
// и 03-js-basics.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute
export default {
  cave: 'Alchemist’s Cave',
  title: 'Objects: JS magic for props',
  goal: 'Master destructuring, default values, spread/rest and comparison by reference.',

  pretest: {
    question: 'What will this code print?',
    explain: 'This is destructuring: the property `a` is taken out of the object into a variable of the same name.',
  },

  lesson: [
    {
      title: 'Destructuring — unpacking the parcel',
      body: [
        'Props arrive as one object. So as not to write `props.title`, `props.count`, they are “unpacked” — this is [[destructuring|destructuring]].',
      ],
      code: "const props = { title: 'Cheese', count: 2 };\n\n// without destructuring\nconst t = props.title;\n\n// with destructuring\nconst { title, count } = props;",
      analogy: 'You got a parcel — you put the things on the shelves at once instead of carrying the whole box around.',
      scheme: {
        left: { title: 'Without destructuring', items: ['`props.title`', '`props.count`', 'long, `props` is repeated'] },
        right: {
          title: 'With destructuring',
          items: ['`const { title, count } = props`', 'then simply `title`', 'you see at once what is used'],
        },
      },
      why: 'Curly braces to the left of `=` mean “unpack”: the variable names match the keys of the object. On the right is the object the values are taken from.',
      alt: [
        { note: 'Without destructuring — longer, but it works the same.' },
        { note: 'You can rename (`title: heading`) and set a default value right away (`count = 0`).' },
      ],
      wrong: [
        {
          why: 'undefined cannot be unpacked — a TypeError. If the object may be missing, play it safe: `const { title } = props ?? {}`.',
        },
        {
          why: 'Square brackets unpack an array in order, but props are an object: there will be a TypeError “props is not iterable”.',
        },
      ],
    },
    {
      title: 'Unpacking right in the parameters',
      body: ['Almost all components unpack props right in the function parameters. A property can be renamed as well.'],
      code: '// right in the parameters\nfunction Card({ title, count }) {\n  return <p>{title}: {count}</p>;\n}\n\n// renaming: title → heading\nconst { title: heading } = props;',
      key: '`function Card({ title })` is not a special React syntax but ordinary destructuring of a function parameter.',
      scheme: {
        steps: [
          { title: 'The parent writes', code: '<Card title="Cheese" count={2} />' },
          { title: 'React assembles an object', code: "{ title: 'Cheese', count: 2 }" },
          { title: 'The parameter unpacks it' },
          { title: 'Inside — ready variables' },
        ],
      },
      why: 'The props object arrives as the only argument, so it can be unpacked right in the parameter parentheses. The first line shows the component’s “contract”: which props it expects.',
      alt: [
        { note: 'Unpacking in the function body — handy if you also need the whole `props`.' },
        { note: 'The same with an arrow function and an implicit return.' },
      ],
      wrong: [
        {
          why: 'React passes ONE argument — an object. Here `title` gets the whole props object, and `count` is undefined.',
        },
        { why: 'After unpacking there is no `props` variable — a ReferenceError. Use `title`.' },
      ],
    },
    {
      title: 'A default value — the backup plan',
      body: [
        'If a prop was not passed, it holds [[undefined|undefined]]. The [[default-value|default value]] is used **only** in that case.',
      ],
      key: 'A default value works only for `undefined`. `null`, `0` and an empty string are passed values.',
      scheme: {
        left: { title: '`48` is used', items: ['`<Avatar />` — the prop is not passed', '`size={undefined}`'] },
        right: { title: 'It is not used', items: ['`size={null}` → null', '`size={0}` → 0', '`size=""` → an empty string'] },
      },
      why: 'A default value in destructuring is a feature of JavaScript, not of React. JS uses it only in place of `undefined` — “nothing was passed”. Everything else counts as a passed value.',
      alt: [{ note: '`??` will use 48 for `null` as well — if null should also count as “empty”.' }],
      wrong: [
        { why: '`||` will replace `0` too: you passed 0 — you got 48. For numbers take a default value or `??`.' },
        { why: 'In React 19 `defaultProps` of function components are removed and silently do not work.' },
      ],
    },
    {
      title: 'Spread and rest — pour out and gather',
      body: [
        '[[spread|Spread]] `...` pours out the properties of an object, [[rest|rest]] `...rest` gathers “everything else” into a new object.',
      ],
      key: 'The order matters: what is written later wins. `{ ...base, size: 3 }` will overwrite `size`.',
      scheme: {
        left: {
          title: 'Spread — pour out',
          items: ['`{ ...base }` — a copy of an object', '`[...arr, x]` — a new array', '`<Card {...props} />`'],
        },
        right: {
          title: 'Rest — gather',
          items: ['`const { a, ...rest } = obj`', '`function Btn({ variant, ...rest })`', 'rest always comes last'],
        },
      },
      why: 'Three dots do opposite things depending on the place: to the right of `=` and in JSX they pour out (spread), on the left in destructuring they gather (rest).',
      alt: [{ note: 'The old way is `Object.assign`. Spread is shorter and clearer.' }],
      wrong: [
        { why: 'Rest must come last — otherwise it is a syntax error.' },
        { why: 'This is not a copy but the same reference: `base` will change too. A copy is `{ ...base }`.' },
      ],
    },
    {
      title: 'References: identical boxes are different boxes',
      body: [
        'Numbers and strings are compared by value, while objects, arrays and functions are compared by [[reference|reference]], that is, by their “address” in memory.',
        'React compares values through [[object-is|Object.is]] — updates and optimizations are built on this.',
      ],
      code: "5 === 5;          // true\n'cat' === 'cat';  // true\n({}) === ({});    // false\n[1] === [1];      // false\n\nconst a = { x: 1 };\nconst b = a;\na === b;          // true: one box",
      analogy: 'Two identical coffins in a graveyard are still two different coffins. The address is compared, not the contents.',
      scheme: {
        left: { title: 'By value', items: ['`5 === 5` → true', "`'cat' === 'cat'` → true", 'numbers, strings, true/false'] },
        right: { title: 'By reference', items: ['`{} === {}` → false', '`[1] === [1]` → false', 'objects, arrays, functions'] },
      },
      why: 'An object lives in memory, and a variable stores its address. `===` compares addresses: two objects that look the same are two different addresses. React compares the same way (`Object.is`), so a new object means “a change” to it.',
      alt: [
        { note: '`Object.is` is almost like `===`, but it compares NaN honestly. React uses it.' },
        { note: 'Contents can be compared through JSON — slow, good for debugging, but not for render.' },
      ],
      wrong: [
        {
          code: "if (user === { name: 'Anna' }) {\n  // will never run\n}",
          why: "A new object is always a different one. Compare the fields: `user.name === 'Anna'`.",
        },
      ],
    },
    {
      title: '?. and ?? — insurance against emptiness',
      body: [
        '[[optional-chaining|?.]] keeps the code from crashing if the object is missing. [[nullish|??]] gives a fallback value only for `null` and `undefined`.',
      ],
      code: 'const user = undefined;\nuser?.name;  // undefined, no error\nuser.name;   // TypeError!\n\n0 || 10;     // 10 (0 counts as “false”)\n0 ?? 10;     // 0  (0 is a normal number)',
      key: '`||` replaces both `0` and an empty string, while `??` replaces only `null` and `undefined`.',
      scheme: {
        left: {
          title: '`?.` — safe access',
          items: ['`user?.name` with `user = null` → undefined', 'no TypeError', 'a chain: `a?.b?.c`'],
        },
        right: {
          title: '`??` — a fallback value',
          items: ["`name ?? 'Guest'`", 'works only for null and undefined', "`0` and `''` stay as they are"],
        },
      },
      why: '`?.` stops the chain at null/undefined and returns undefined instead of an error. `??` gives a fallback value only for “emptiness” — for numbers and strings it is safer than `||`.',
      alt: [
        { note: 'Before `?.` appeared, people wrote it with `&&` — it works, but it is longer.' },
        { code: "const name = user ? user.name : 'Guest';", note: 'The ternary operator — when you need your own “otherwise” branch.' },
      ],
      wrong: [
        {
          code: "const name = user?.name || 'Guest';",
          why: 'It works, but `||` will replace an empty string too. If an empty name is a normal value, take `??`.',
        },
        {
          code: "user?.name = 'Anna';",
          why: '`?.` cannot stand to the left of `=` — a syntax error: you cannot assign to something that “maybe exists”.',
        },
      ],
    },
  ],

  spell: {
    text: 'Unpack the parcel: take what you need, and put the rest into ...rest.',
    meaning: '[[destructuring|Destructuring]] takes what is needed, [[rest|rest]] gathers everything else.',
  },

  practice: [
    {
      question: 'What will `size` be equal to?',
      options: [
        {},
        { why: 'A default value is used only for undefined, and null is a passed value.' },
        { why: 'The prop is passed explicitly — it is not undefined.' },
        { text: 'There will be an error', why: 'You may pass null into a prop, there will be no error.' },
      ],
      hint: 'When does a default value kick in?',
      explain:
        '`null` is an explicitly passed “empty”, so the default value will not kick in. If you want insurance against null as well, use `size ?? 48`.',
    },
    {
      question: 'What should you write instead of `___` to take `title` out of the `props` object?',
      placeholder: 'for example: { … }',
      explain: '`const { title } = props;` is object destructuring. Curly braces to the left of `=` mean “unpack”.',
    },
    {
      statement: '`[1, 2] === [1, 2]` returns `true`.',
      explain: 'These are two different arrays in memory. Arrays are compared by reference, not by contents.',
    },
    {
      question: 'What will the console print?',
      options: [
        {},
        { why: "`color: 'blue'` is written after the spread and overwrites the value." },
        { why: 'The spread copied `size` as well — it has not gone anywhere.' },
        { text: 'An error: the key is repeated', why: 'Repeating a key in an object literal is allowed — the last one wins.' },
      ],
      explain: 'Spread copies all the properties, then the explicit properties on the right overwrite the ones with the same names.',
    },
    {
      question: 'Take `variant` by name, and gather the other props and pass them to the button.',
      explain:
        'In the parameters `...rest` gathers the other props into an object, and in JSX `{...rest}` lays them out again as attributes.',
    },
    {
      question: 'Which expression gives `10` only if `value` is `null` or `undefined`?',
      options: [
        {},
        { why: '`||` will also replace 0, an empty string and false.' },
        { why: '`&&` returns 10 when value is truthy — that is the opposite logic.' },
        { why: 'The ternary will replace 0 and an empty string too — they are “falsy”.' },
      ],
      explain: 'The `??` operator reacts only to `null` and `undefined` — ideal for numbers, where `0` is a normal value.',
    },
    {
      question: 'What will the comparison return?',
      explain: 'Primitives are compared by value; objects, arrays and functions — by reference. `Object.is` treats NaN as equal to itself.',
    },
    {
      question: 'Which line will crash with an error if `user` is not passed?',
      fix: "const name = user?.name ?? 'Guest';",
      explain: 'If `user` is undefined, the access `user.name` throws a TypeError. The line below already has protection: `?.` and `??`.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: how does `{ size = 48 }` differ from `size || 48`?',
    starters: ['A default value kicks in when…', 'And the || operator…', 'So for numbers…'],
    keywords: [
      {
        label: 'The default — only for undefined',
        words: ['undefined', 'not passed', 'was not passed', 'wasn’t passed', "wasn't passed", 'missing'],
      },
      { label: '|| replaces 0 and an empty string', words: ['0', 'zero', 'empty', 'falsy', 'false'] },
      { label: 'There is a safe option: ??', words: ['??', 'null'] },
    ],
    model:
      'A default value in destructuring kicks in only when the prop is undefined, that is, when it was not passed. The || operator replaces any “falsy” value: 0, an empty string, false, null. So for numbers a default value or ?? is safer.',
  },
};
