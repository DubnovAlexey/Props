// Английский перевод пещеры 4 «Грот заклинаний» (оригинал — ../../../chapters/04-functions.js
// и 04-functions.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute
export default {
  cave: 'Grotto of Spells',
  title: 'Functions and closures',
  goal: 'Master functions the way React uses them: arrows, a function as a value, reference versus call, closures and “snapshots” of values.',

  pretest: {
    question: 'How does `handleClick` differ from `handleClick()`?',
    options: [
      { text: 'The first is the function itself, the second is a call of it right now' },
      { text: 'In no way, they are the same thing' },
      { text: 'The second is a newer way to write the same' },
      { text: 'The first is a mistake' },
    ],
    explain:
      'A name without parentheses is a reference to the function: it can be passed along and called later. Parentheses call the function immediately.',
  },

  lesson: [
    {
      title: 'A function is a spell you can keep',
      body: [
        '[[function|A function]] is a named piece of code that can be called many times. [[parameter|Parameters]] go in, a value comes out through `return`.',
        'A function can be declared in three ways: with a `function` declaration, with a function expression and with an [[arrow-function|arrow]]. For React all three work the same.',
      ],
      code: '// declaration\nfunction double(x) {\n  return x * 2;\n}\n\n// expression\nconst triple = function (x) {\n  return x * 3;\n};\n\n// arrow\nconst half = (x) => x / 2;\n\ndouble(4); // 8',
      key: 'Without `return` a function returns `undefined`. This is a frequent cause of an empty screen in a component.',
      scheme: {
        title: 'How a call works',
        steps: [
          { title: 'An argument goes in' },
          { title: 'The parameter gets the value' },
          { title: 'The body computes' },
          { title: 'return gives the result' },
        ],
      },
      why: 'The declaration `function double(x)` is hoisted: it can be called even higher up in the file. An expression and an arrow live in a `const` and are available only after the line where they are declared. The parameter `x` is a local variable that receives the argument.',
      alt: [{ note: 'A parameter can be given a default value — like props in destructuring.' }],
      wrong: [
        { why: 'There is no `return` — the result of the computation is lost, the function returned undefined.' },
        {
          why: 'An arrow in a `const` cannot be called before its declaration — a ReferenceError “Cannot access before initialization”.',
        },
      ],
    },
    {
      title: 'Arrow functions: the short form',
      body: [
        'An arrow has two forms of body. With curly braces it is an ordinary block, and `return` is needed explicitly. Without braces it is an expression that is returned by itself (an implicit return).',
        'A trap: for an arrow without `return` to return an **object**, the object is wrapped in parentheses. Otherwise the curly braces are taken for the function body.',
      ],
      code: "const sum = (a, b) => a + b;        // implicit return\nconst square = x => x * x;          // one parameter — parentheses may be omitted\nconst log = () => console.log('…'); // no parameters — empty parentheses\n\nconst makeUser = name => ({ name }); // an object — in parentheses\nconst broken = name => { name };     // ❌ returns undefined",
      key: 'An arrow with `{}` and without `return` returns nothing. If you want to return an object, write `() => ({ … })`.',
      scheme: {
        left: { title: 'Expression body', items: ['`x => x * 2`', 'no return needed', 'an object — in parentheses: `() => ({ a: 1 })`'] },
        right: { title: 'Block body', items: ['`x => { return x * 2; }`', 'return is required', 'several lines are allowed'] },
      },
      why: 'After `=>` comes either an expression or a block in `{}`. An expression is returned automatically. A block is ordinary code, and a value can be returned from it only with the word `return`. Parentheses around an object say: “this is an expression, not a block”.',
      alt: [{ note: 'An object can be returned from a block too — with an explicit `return`.' }],
      wrong: [
        { why: 'A block without `return` — the function returns undefined.' },
        { why: 'Several parameters are written only in parentheses: `(x, y) => x * y`. Without them it is a syntax error.' },
      ],
    },
    {
      title: 'A function is a value',
      body: [
        'In JavaScript a function is a value just like a number or a string. It can be put into a variable, passed into another function and returned from a function.',
        'A function that is passed so that it is called later is named a [[callback|callback]]. A function that takes or returns other functions is a [[higher-order|higher-order function]]. `map`, `filter`, `setTimeout` are exactly like that.',
        'In React that is how handlers are passed: `onClick={handleClick}` is a function in a prop.',
      ],
      code: "function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconst say = greet;           // put into a variable\nsay('Count');                // 'Hello, Count!'\n\nfunction twice(fn) {         // takes a function\n  fn();\n  fn();\n}\ntwice(() => console.log('Caw!'));",
      key: 'Since a function is a value, it can be passed as a prop. Callbacks, render props and HOCs grow from here.',
      scheme: {
        title: 'What you can do with a function',
        steps: [
          { title: 'Put it into a variable' },
          { title: 'Pass it as an argument' },
          { title: 'Return it from a function' },
          { title: 'Pass it as a prop in React' },
        ],
      },
      why: 'A template string in backticks inserts values through `${…}`. `const say = greet` copies the reference: `say` and `greet` point to one function. `twice(fn)` calls the passed function twice — that is how React calls your handlers too.',
      alt: [
        {
          code: "const twice = (fn) => {\n  fn();\n  fn();\n};\n\ntwice(function () {\n  console.log('Caw!');\n});",
          note: 'A callback can be passed both as an ordinary function and as an arrow.',
        },
      ],
      wrong: [
        {
          code: "twice(console.log('Caw!'));",
          why: 'The parentheses called `console.log` at once, and `twice` got the result — undefined. Inside, `fn()` will crash: “fn is not a function”.',
        },
      ],
    },
    {
      title: 'Reference or call',
      body: [
        'A function name without parentheses is a **reference**: “here is the function, call it yourself when needed”. A name with parentheses is a **call** right now, and what goes further is already the result.',
        'If you need to pass a function with an argument but call it later, wrap the call in an arrow: `() => remove(id)`.',
      ],
      code: "function ring() {\n  console.log('Ding!');\n}\n\nsetTimeout(ring, 1000);    // ✅ rings in a second\nsetTimeout(ring(), 1000);  // ❌ rings at once, and the timer gets undefined\n\nsetTimeout(() => remove(7), 1000); // ✅ the argument — through an arrow",
      key: 'Parentheses after a name mean “do it now”. In handler props you almost always need a reference, not a call.',
      scheme: {
        left: { title: 'Reference', items: ['`ring` — the whole function', 'it will be called later', '`setTimeout(ring, 1000)`'] },
        right: { title: 'Call', items: ['`ring()` — already the result', 'it runs now', '`setTimeout(ring(), 1000)`'] },
      },
      why: '`setTimeout` expects a function in order to call it later. `ring` is the function itself, `ring()` is the result of its work. The arrow `() => remove(7)` creates a new function that will call `remove(7)` later.',
      alt: [
        { note: '`setTimeout` can pass the arguments itself — after the delay. But an arrow is clearer.' },
        { note: '`bind` creates a copy of the function with an argument set in advance.' },
      ],
      wrong: [
        {
          code: '<button onClick={save()}>Save</button>',
          why: 'The same mistake in React: `save` will run during render, not on a click.',
        },
      ],
    },
    {
      title: 'Closure: a function remembers where it was born',
      body: [
        'A function sees the variables of the place where it was created — even when that place has already “finished”. This is a [[closure|closure]].',
        'Every call of the outer function creates a new set of variables, so every created function has its own memory.',
        'In React every handler inside a component is a closure: it sees the props and state of the render in which it was created.',
      ],
      code: 'function makeCounter() {\n  let count = 0;           // lives in the closure\n  return () => {\n    count = count + 1;\n    return count;\n  };\n}\n\nconst next = makeCounter();\nnext(); // 1\nnext(); // 2\nconst other = makeCounter();\nother(); // 1 — its own memory',
      analogy:
        'A closure is like a bat that always finds its way to its home cave: wherever it is carried, it remembers where it flew out from.',
      key: 'A function “carries along” the variables of its birthplace. That is why a handler sees the props of its own render.',
      scheme: {
        left: { items: ['its own `count`', '`next()` → 1', '`next()` → 2'] },
        right: { items: ['its own `count`', '`other()` → 1', 'the memory is not shared'] },
      },
      why: '`let count` is declared inside `makeCounter`. The arrow it returns keeps seeing this `count` even after `makeCounter` has finished. Every call of `makeCounter` creates a new `count`.',
      alt: [{ note: 'You can return several functions — they share one and the same variable.' }],
      wrong: [
        {
          why: 'A variable outside is one for all — all the counters will count together. Each gets its own memory only if the variable is inside.',
        },
      ],
    },
    {
      title: 'A snapshot: a closure remembers the old',
      body: [
        'In React every render is a separate call of the component with its own props and state. A handler from that render sees exactly them — as a **snapshot**.',
        'If a function was created long ago and was not updated, it sees old values — this is a [[stale-closure|stale closure]]. Hence the rule: everything an effect or `useCallback` reads goes into the dependency array.',
      ],
      code: "function Greeter({ name }) {\n  function handleClick() {\n    setTimeout(() => {\n      alert(`Hello, ${name}!`);\n    }, 3000);\n  }\n  return <button onClick={handleClick}>Say hello</button>;\n}\n// clicked when name = 'Anna', a second later 'Bob' arrived —\n// after 3 seconds it is still “Hello, Anna!”",
      key: 'Every render is its own snapshot of props and state. A function from an old render sees the old snapshot: it is not a React bug, it is a closure.',
      scheme: {
        title: 'Why “Hello, Anna!”',
        steps: [
          { title: 'Render 1', code: "name = 'Anna'" },
          { title: 'A click: the arrow for the timer is created', sub: 'it closed over name = “Anna”' },
          { title: 'Render 2', code: "name = 'Bob'", sub: 'new functions, but the old arrow is already waiting in the timer' },
          { title: 'After 3 seconds the old arrow fires' },
          { title: '“Hello, Anna!” — the snapshot of render 1' },
        ],
      },
      why: 'The handler `handleClick` was created during the render when `name` was “Anna”. The arrow inside `setTimeout` is a closure of that render too. New props give a new render and new functions, but the old arrow has already “flown away” with the previous snapshot.',
      alt: [
        {
          code: 'function Greeter({ name }) {\n  const nameRef = useRef(name);\n  useEffect(() => {\n    nameRef.current = name; // always the fresh value\n  });\n\n  function handleClick() {\n    setTimeout(() => alert(`Hello, ${nameRef.current}!`), 3000);\n  }\n  return <button onClick={handleClick}>Hello</button>;\n}',
          note: 'If you need exactly the fresh value, keep it in a ref: `.current` points to the latest one, not to a snapshot.',
        },
      ],
      wrong: [
        {
          why: 'Empty dependencies: the function was created in the first render and remembered the first `name` forever. Add it to the array: `[name]`.',
        },
      ],
    },
  ],

  spell: {
    text: 'No parentheses — hand it over, parentheses — call it now; what a function saw, it remembers.',
    meaning: 'Reference or call — and a [[closure|closure]]: a function remembers the variables of the place where it was born.',
  },

  practice: [
    {
      statement: "The arrow `() => { name: 'Count' }` returns the object `{ name: 'Count' }`.",
      explain:
        "Curly braces right after the arrow are the function body, not an object. There is no `return` in it, so undefined is returned. You need `() => ({ name: 'Count' })`.",
    },
    {
      question: 'What will the code print?',
      options: [
        {},
        { why: 'In curly braces an explicit return is needed — without it the result is lost.' },
        { why: 'There is no string concatenation here — numbers are added.' },
        { text: 'An error', why: 'The code is correct, it just returns nothing.' },
      ],
      explain: 'A block body without `return` returns undefined. Either `{ return a + b; }` or the short form `(a, b) => a + b`.',
    },
    {
      question: 'Is this a reference to a function or a call of it?',
      bins: ['A reference — it will be called later', 'A call — right now'],
      explain:
        'Parentheses after a name are a call now. A name without parentheses or a wrapping arrow is a function that will be called later.',
    },
    {
      question: 'What will `console.log` print?',
      options: [
        {},
        { why: 'b has its own count variable — the calls of a do not touch it.' },
        { why: '`++count` first increases, then returns.' },
        { why: 'That is the value of a after two calls, not of b.' },
      ],
      hint: 'How many times was makeCounter called and how many count variables did that give?',
      explain: 'Every call of makeCounter creates its own count. a and b are closures over different variables.',
    },
    {
      question: 'Complete the arrow so that it returns an object.',
      code: "const makeUser = (name) => ___{ name }___;\nconst user = makeUser('Anna'); // { name: 'Anna' }",
      explain: 'Parentheses say: “this is an object expression, not a function body”.',
    },
    {
      question: 'The reminder appears at once, not in a second. Where is the mistake?',
      code: "function remind() {\n  alert('Time to hunt!');\n}\nsetTimeout(remind(), 1000);",
      explain: 'The parentheses call remind at once, and setTimeout gets its result — undefined. Pass the function itself.',
    },
    {
      question:
        'The button was clicked when `name = "Anna"`, and a second later the parent passed `name = "Bob"`. What will the alert show after 3 seconds?',
      code: 'function Greeter({ name }) {\n  function handleClick() {\n    setTimeout(() => alert(`Hello, ${name}!`), 3000);\n  }\n  return <button onClick={handleClick}>Hello</button>;\n}',
      options: [
        { text: '“Hello, Anna!”' },
        {
          text: '“Hello, Bob!”',
          why: 'The arrow in the timer was created in the render where name was “Anna” — it sees its snapshot.',
        },
        { text: '“Hello, undefined!”', why: 'name was passed, and the closure remembers it.' },
        { text: 'An error', why: 'The code is correct.' },
      ],
      explain:
        'The handler and the arrow in the timer are closures of the render in which they were created. Every render is its own snapshot of props.',
    },
    {
      question: 'Match the term with its meaning.',
      pairs: [
        ['Callback', 'A function passed to be called later'],
        ['Closure', 'A function remembers the variables of its birthplace'],
        ['Higher-order function', 'Takes or returns a function'],
        ['Implicit return', 'An arrow without {} returns the expression by itself'],
        ['Stale closure', 'A function sees old values'],
      ],
      explain: 'These five words will come up in every following cave: callbacks in props, closures in handlers and hooks.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: why do we write `handleClick` in onClick, not `handleClick()`?',
    starters: ['Without parentheses it is…', 'With parentheses the function…', 'If an argument is needed…'],
    keywords: [
      { label: 'Without parentheses — a reference to the function', words: ['reference', 'the function itself', 'pass'] },
      {
        label: 'With parentheses — a call at once, during render',
        words: ['at once', 'right away', 'right now', 'immediately', 'during render', 'call'],
      },
      { label: 'An argument — through an arrow', words: ['arrow', '=>', 'wrap'] },
    ],
    model:
      'Without parentheses handleClick is a reference to the function: React will keep it and call it on a click. With parentheses the function is called at once, during render, and onClick gets its result, usually undefined. If an argument is needed, the call is wrapped in an arrow: onClick={() => remove(id)}.',
  },
};
