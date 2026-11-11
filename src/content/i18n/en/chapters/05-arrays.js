// Английский перевод пещеры 5 «Пещера стай» (оригинал — ../../../chapters/05-arrays.js
// и 05-arrays.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute
export default {
  cave: 'Cave of Swarms',
  title: 'Arrays, truthiness and template strings',
  goal: 'Master the array methods that lists in React rest on, see the difference between a mutation and a copy, and sort out “truthy” and “falsy” values.',

  pretest: {
    question: 'What does `[1, 2, 3].map(n => n * 2)` return?',
    explain: '`map` creates a NEW array: it applies the function to every item. The original array does not change.',
  },

  lesson: [
    {
      title: 'map: transform every item',
      body: [
        '`map` walks over an array and calls your function for every item. The results are gathered into a **new** array of the same length — it is one of the main [[array-method|array methods]].',
        'In React `map` turns an array of data into an array of JSX elements — that is how [[list-rendering|lists]] are drawn. Every element needs a [[key|key]].',
      ],
      code: "const bats = ['Lunatik', 'Fang', 'Shade'];\n\nconst loud = bats.map(name => name.toUpperCase());\n// ['LUNATIK', 'FANG', 'SHADE']\n\nfunction BatList({ bats }) {\n  return (\n    <ul>\n      {bats.map(name => <li key={name}>{name}</li>)}\n    </ul>\n  );\n}",
      analogy:
        'map is like the Count putting a hat on every bat of the swarm: there are just as many bats, but each one now wears a hat. And the old swarm without hats stays as it was.',
      key: '`map` always returns a new array of the same length. The function inside must return a value — otherwise you get an array of undefined.',
      scheme: {
        title: 'map turns data into elements',
        steps: [
          { title: 'An array of data', code: "['Lunatik', 'Fang']" },
          { title: 'A function for each item' },
          { title: 'A new array of elements', code: '[<li>Lunatik</li>, <li>Fang</li>]' },
        ],
      },
      why: '`bats.map(name => …)` calls the arrow for every name and gathers the results into a new array. In JSX `{bats.map(…)}` inserts this array of elements, and React draws them in order. `key={name}` is the name of the element for reconciliation.',
      alt: [{ note: 'map passes the index as the second argument — handy for numbering, but not for key.' }],
      wrong: [
        { why: 'Curly braces make a block without `return`: map gathers an array of undefined, and the list will be empty.' },
        { why: '`forEach` returns nothing — it only walks over the array. A list needs `map`.' },
      ],
    },
    {
      title: 'filter, find, some: pick and search',
      body: [
        '`filter` keeps only the items for which the function returned “true”. The result is a new, possibly shorter array.',
        '`find` returns the **first** matching item (or `undefined`). `some` returns `true` if at least one item matches, `every` — if all of them do.',
      ],
      code: "const products = [\n  { id: 1, name: 'Cheese', days: 2 },\n  { id: 2, name: 'Milk', days: 0 },\n  { id: 3, name: 'Bread', days: 5 },\n];\n\nproducts.filter(p => p.days <= 2); // Cheese and Milk\nproducts.find(p => p.id === 3);    // { id: 3, name: 'Bread', … }\nproducts.some(p => p.days === 0);  // true\nproducts.every(p => p.days > 0);   // false",
      key: 'Removing an item from a list in React is `filter`: `items.filter(item => item.id !== id)` gives a new array without it.',
      scheme: {
        left: { items: ['always an array', 'all matching items', 'found nothing → `[]`'] },
        right: { items: ['one item', 'the first matching one', 'found nothing → `undefined`'] },
      },
      why: 'The function inside is the selection condition: it returns `true` or `false`. `p.days <= 2` is an expression that gives a boolean by itself, so a short arrow is enough.',
      alt: [{ note: '`findIndex` returns the number of the item (or -1), `includes` checks whether a value is in the array.' }],
      wrong: [
        {
          code: "const cheese = products.filter(p => p.name === 'Cheese');\ncheese.name; // undefined",
          why: '`filter` always returns an array, even of a single item. If you need one item, take `find`.',
        },
      ],
    },
    {
      title: 'reduce: fold into one value',
      body: [
        '`reduce` walks over an array and accumulates a result: a sum, an object, a string. The function gets the accumulated value and the current item and returns the new accumulated value.',
        'The second argument of `reduce` is the starting value. Do not forget it: on an empty array there will be an error without it.',
      ],
      key: '`reduce`: (accumulated, current) → new accumulated. And always give a starting value: `0`, `[]` or `{}`.',
      scheme: {
        title: 'The steps of reduce',
        steps: [{ title: 'Start' }, {}, {}, {}],
      },
      why: '`(sum, price) => sum + price` answers the question “how to add the current item to what has been accumulated”. The `0` after the comma is the starting value of `sum`. The result of the last step is the result of `reduce`.',
      alt: [{ note: 'The same calculation with a `for…of` loop — longer, but some find it clearer.' }],
      wrong: [
        {
          why: 'An empty array without a starting value — a TypeError “Reduce of empty array with no initial value”. Always pass the second argument.',
        },
      ],
    },
    {
      title: 'Mutation and copy',
      body: [
        'Some methods change an array in place — that is a [[mutation|mutation]]: `push`, `pop`, `splice`, `sort`, `reverse`. Others return a **new** array: `map`, `filter`, `slice`, `concat`, `toSorted`, `toReversed`, `with`.',
        'React compares data by [[reference|reference]], so for props and state you take the methods that create a copy.',
      ],
      code: "const bats = ['Shade', 'Fang'];\n\nbats.push('Lunatik');              // ❌ changes bats in place\nconst more = [...bats, 'Lunatik']; // ✅ a new array\n\nbats.sort();                       // ❌ sorts the original\nconst sorted = bats.toSorted();    // ✅ a copy\n\nconst renamed = bats.with(0, 'Gloom'); // ✅ a copy with a replacement",
      key: 'The rule for React: if a method changes the array in place, make a copy first and then edit it. Or take a method that returns a copy right away.',
      scheme: {
        title: 'How to change an array in React',
        steps: [
          { title: 'You need to change an array from state' },
          { title: 'Make a copy', code: '[...items] or toSorted / with / filter / map' },
          { title: 'Change the copy' },
          { title: 'Pass the copy to the setter' },
          { title: 'A new reference — React sees the change' },
        ],
      },
      why: "The spread `[...bats, 'Lunatik']` pours the old items into a new array and adds one more. `toSorted` and `with` are copying versions of `sort` and of assignment by index; they appeared in the ES2023 standard.",
      alt: [
        {
          code: "const sorted = [...bats].sort();\nconst renamed = bats.map((b, i) => (i === 0 ? 'Gloom' : b));",
          note: 'Before `toSorted` and `with`, people did this: first a copy, then a mutating method — or map.',
        },
      ],
      wrong: [
        {
          code: "const copy = bats;\ncopy.push('Lunatik');",
          why: 'An assignment does not copy an array: `copy` and `bats` point to one and the same array. `push` will change both.',
        },
      ],
    },
    {
      title: 'Truthy and falsy values',
      body: [
        "In conditions JavaScript turns any value into `true` or `false`. There are only eight falsy values: `false`, `0`, `-0`, `0n`, `''` (an empty string), `null`, `undefined` and `NaN`. Everything else is [[truthy|truthy]], even `'0'`, `'false'`, `[]` and `{}`.",
        '`&&` and `||` are [[short-circuit|short-circuit]] operators. `a && b` returns `a` if it is falsy, otherwise `b`. `a || b` returns `a` if it is truthy, otherwise `b`. And `a ?? b` returns `b` only if `a` is `null` or `undefined`.',
      ],
      code: "Boolean('false'); // true — a non-empty string\nBoolean([]);      // true — even an empty array\n\n0 && 'yes';    // 0\n'' || 'Guest'; // 'Guest'\n0 ?? 48;       // 0\nnull ?? 48;    // 48\n\n{count && <Badge />}     // with 0 it draws “0”\n{count > 0 && <Badge />} // ✅",
      key: 'Put a real boolean to the left of `&&` in JSX. `0`, `NaN` and an empty string are traps.',
      scheme: {
        left: {
          title: 'Falsy — there are eight of them',
          items: ['`false`, `0`, `-0`, `0n`', "`''` — an empty string", '`null`, `undefined`, `NaN`'],
        },
        right: {
          title: 'Truthy — everything else',
          items: ["`'0'`, `'false'` — non-empty strings", '`[]`, `{}` — any objects', '`-1`, `Infinity` — numbers other than zero'],
        },
      },
      why: '`Boolean(…)` shows how a value behaves in a condition. `&&` and `||` return not `true`/`false` but one of the original values — that is why `0 && …` gives `0`, and React draws it.',
      alt: [{ note: '`!!` turns a value into a boolean, and the ternary operator makes the choice explicit.' }],
      wrong: [{ why: '`||` replaces a legitimate zero too. For numbers use `??` or a default value.' }],
    },
    {
      title: 'Template strings',
      body: [
        'A string in backticks is a [[template-literal|template]] one: any expression can be inserted inside `${…}`, and line breaks are kept.',
        'In React template strings are handy for texts and classes — for example, to assemble a `className` out of several parts.',
      ],
      code: "const name = 'Count';\nconst age = 427;\n\nconst text = `${name}, you are ${age} years old`;\n// 'Count, you are 427 years old'\n\nfunction Card({ isActive }) {\n  return <div className={`card ${isActive ? 'active' : ''}`} />;\n}",
      key: 'Inside `${…}` is a JavaScript expression, just like inside `{…}` in JSX. Ordinary quotes insert nothing.',
      scheme: {
        title: 'How substitution works',
        steps: [
          { title: 'Backticks' },
          { title: 'An expression inside' },
          { title: 'JavaScript computes the expression and inserts the result', code: "'Count, you are 427 years old'" },
        ],
      },
      why: 'Backticks create a template string, and `${…}` inserts the value of an expression. In `className` the JSX curly braces open JavaScript, and inside them there is already a template string.',
      alt: [{ note: 'Classes can be assembled with an array: `filter(Boolean)` removes `false`, and `join` glues them with spaces.' }],
      wrong: [
        {
          code: "const text = '${name}, hello';",
          why: 'In ordinary quotes `${…}` is just characters, there will be no substitution. You need backticks.',
        },
      ],
    },
  ],

  spell: {
    text: 'Map dresses all, filter picks a few, reduce folds them up — and copies see you through!',
    meaning:
      '[[array-method|Array methods]]: map changes every item, filter picks some, reduce folds them into one value. For React — copies instead of [[mutation|mutation]].',
  },

  practice: [
    {
      statement: '`filter` removes items from the original array.',
      explain: '`filter` does not touch the original array — it returns a new one with only the matching items.',
    },
    {
      question: 'What does `[3, 1, 2].find(n => n > 1)` return?',
      options: [
        {},
        { why: 'filter would do that — find returns one item.' },
        { why: 'That is what some would answer.' },
        { why: 'find takes the FIRST matching item, and 3 comes earlier.' },
      ],
      explain: '`find` goes from left to right and stops at the first item for which the condition is true.',
    },
    {
      question: 'Does it change the array in place or create a new one?',
      bins: ['Mutates', 'Creates a new one'],
      explain:
        '`push`, `sort`, `splice`, `reverse` change the original. `filter`, `map`, `concat`, `toSorted` return a new array — those are the ones used in React.',
    },
    {
      question: 'What does this code return?',
      placeholder: 'a number',
      explain: '0 + 120 = 120, then 120 + 80 = 200.',
    },
    {
      question: 'What appears on the screen if `items = []`?',
      options: [
        {},
        { text: 'Nothing', why: '`length` is 0 — that is a number, and React draws numbers.' },
        { text: 'An empty list', why: 'It never gets to List: `&&` stops at 0.' },
        { text: 'An error', why: 'There is no error — a zero simply appears on the screen.' },
      ],
      hint: 'What does `0 && anything` return?',
      explain: 'Write `items.length > 0 && …` — then there is a real boolean on the left.',
    },
    {
      statement: 'An empty array `[]` is a falsy value in a condition.',
      explain: '`[]` is an object, and all objects are truthy. To check whether an array is empty, look at its length: `items.length > 0`.',
    },
    {
      question: 'After adding a product the list on the screen does not update. Where is the mistake?',
      explain:
        '`push` changes the same array, and `setItems` gets the same reference — React decides that nothing has changed. A new array is needed: `[...items, item]`.',
    },
    {
      question: 'Put in the right methods.',
      explain: 'To transform every item — map, to pick — filter, to bring everything down to one number — reduce.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: how do you remove an item from a list in React state, and why not with splice?',
    starters: ['An item can be removed with…', 'splice is bad because…', 'React compares…'],
    keywords: [
      { label: 'Removing with filter', words: ['filter'] },
      { label: 'splice changes the original array', words: ['mutat', 'in place', 'original', 'same array', 'changes the array'] },
      { label: 'React compares by reference — a new array is needed', words: ['reference', 'new array', 'object.is', 'copy', 'copies'] },
    ],
    model:
      'An item can be removed with filter: items.filter(item => item.id !== id) returns a new array without it. splice is bad because it changes the original array in place: the reference stays the same, and React, which compares data by reference, may not notice the change. That is why in React you take the methods that create a copy.',
  },
};
