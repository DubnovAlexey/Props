// English overlay for the Register of Formular and the Count's Scriptorium (original: src/content/course.js).
// Same shape as the original, text only and in the same order: which answer is right, the paths through the
// caves and the number of code lines come from the original. Everything stays inside the world of the caves:
// no teachers, classes or students — the Count's apprentices and his archivist.
// Code examples in strings are inspected by IntelliJ as real code — false positives
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute,UnnecessaryLabelJS,CommaExpressionJS,WithStatementJS,UnreachableCodeJS,BadExpressionStatementJS,JSXUnresolvedComponent,JSUnresolvedReference
export const COURSE = {
  title: 'The Register of Formular',
  cave: 'The Count’s Scriptorium',
  goal: 'The Register’s questions on props, lists and conditions, plus the Small Trial — the required part of the Count’s Trial',
  answerLabel: 'How to answer Formular:',
  intro: [
    'The archivist Formular asks these questions of every apprentice of the Count and writes the answers into the Register: what props are and how to pass them, whether you may change them, what children is, how to draw lists with `map()` and `key`, and how to show different things depending on a condition. Answer with confidence and in your own words — Formular smells a memorised phrase the way he smells blood.',
    'A path through the caves leads to every question — from simple to complex: defeat the guardians on the way and the question opens. Here every question has a model answer, a code example and the cave where the topic is covered in depth. The questions are **required**: all of them and the Small Trial await you at the end of the Count’s Trial — on top of the cave tasks, not instead of them.',
  ],
  story: {
    intro:
      'The Count takes a battered leather-bound ledger from the shelf. “This is the Register of my apprentices. Everyone who descends into the caves answers its questions. Even vampires sit exams — I sat mine by candlelight. My archivist will ask strictly, but first we will pick every question apart, bone by bone.”',
    outro:
      '“If you know the answers, tell them to me in the lair. Every single one, and the Small Trial. The trial does not end without them.”',
  },
  guardian: {
    name: 'Formular',
    kind: 'ghoul archivist',
    threat: 'Answer every question and I will enter you in the Register. Fail — and I will enter you in the obituaries.',
    defeat: 'The archivist slams the Register shut and puts a bloody tick next to your name.',
    why: 'The archivist keeps the Register of the Count’s apprentices and holds their oral exam — no cheat sheets, no hints.',
    bio: 'In life he examined others and never once gave top marks — he did not live long enough. Now he records the answers in blood: ink, he says, fades, but blood never does.',
  },
  blocks: [
    {
      title: 'What props are and why we need them',
      body: [
        'Imagine a parcel: the parent puts data into it and sends it to the child. The parcel is the [[props|props]] object. The child opens it and draws what is inside.',
        'A component is an ordinary JavaScript function, and props are its argument. That is why one function `ApprenticeCard` draws any apprentice of the Count: whatever data arrives, that is the card you get.',
      ],
      scheme: {
        left: {
          title: 'An ordinary function',
          items: [
            'arguments go in brackets: `sum(2, 3)`',
            'you call it yourself',
            'returns a value',
            'there can be any number of arguments',
          ],
        },
        right: {
          title: 'A component',
          items: [
            'props go as attributes: `<ApprenticeCard age={25} />`',
            'React calls it, not you',
            'returns markup (JSX)',
            'one argument — the props object',
          ],
        },
      },
    },
    {
      title: 'How to pass a string, a number, a boolean, an object',
      body: [
        'The main rule: **quotes are only for strings**. Everything else — a number, true / false, an object, an array, a function, a variable — goes in curly braces: JavaScript lives inside them.',
        'The most common beginner mistake is `age="25"`: the number turns into a string, and `"25" + 1` gives `"251"`. The second is `isActive="false"`: a non-empty string is truthy, and an apprentice asleep in his coffin suddenly shows as “Awake”.',
      ],
      code: '// a string — in quotes\n<ApprenticeCard name="Agnes Morrow" />\n\n// a number — in curly braces\n<ApprenticeCard age={25} />\n\n// true — just the name, false — only in braces\n<StatusBadge isActive />\n<StatusBadge isActive={false} />\n\n// an object — from a variable or right in JSX (double braces)\n<ApprenticeCard apprentice={apprentice} />\n<p style={{ color: "crimson" }}>Awake</p>',
    },
    {
      title: 'How to get props, whether you may change them, and what children is',
      body: [
        'Inside a component props are an ordinary object. Read it with a dot (`props.apprentice`) or unpack it right in the parameters with [[destructuring|destructuring]]: `function ApprenticeCard({ apprentice })`.',
        'You may not change props — they are [[read-only|read-only]]: the data belongs to the parent. And everything between a component’s tags arrives in a special prop, [[children|children]].',
      ],
      scheme: {
        left: {
          title: 'Not allowed',
          items: ['`props.apprentice = …`', '`apprentice.isActive = false` inside the card', 'expecting the parent to see the change'],
        },
        right: {
          title: 'Allowed',
          items: ['read: `props.apprentice.name`', 'unpack: `({ apprentice })`', 'compute something new: `const isYoung = age < 18`'],
        },
      },
    },
    {
      title: 'Lists: map() and key',
      body: [
        '`map()` walks through an array and turns every element into a new one — that is how an array of apprentices becomes an array of cards. The original array does not change: `map` returns **a new array of the same length**.',
        'Every card made by `map` needs a [[key|key]] — a permanent label. With it React understands who was entered, struck out or moved. An array index is a poor label: it belongs to a place in the list, not to an apprentice. In the Workshop below you can see it with your own eyes.',
      ],
      scheme: {
        title: 'How an array becomes a list',
        steps: [
          { title: 'An array of data' },
          { title: 'An array of elements' },
          { title: 'React compares the lists by key', sub: 'and updates only the cards that changed' },
        ],
      },
    },
    {
      title: 'Conditional rendering: if, ? :, && and an empty list',
      body: [
        '[[conditional|Conditional rendering]] — a component shows different things depending on the data. There are three tools, each with its own place:',
        '- `if` with an early `return` — when the component’s whole answer is different: an empty Register → “The Register is empty”. You cannot write `if` inside `{}` in JSX — only expressions go there.',
        '- `? :` — pick one of two: “Awake” or “Asleep in the coffin”, the class `card` or `card--asleep`.',
        '- `&&` — show something or nothing: the note “Too young to be turned” when `age < 18`. Put a real true / false on the left — otherwise a `0` crawls onto the screen.',
      ],
      scheme: {
        title: 'ApprenticeList and an empty array',
        steps: [
          { title: 'ApprenticeList gets the array' },
          { title: 'Check the length' },
          { title: 'Empty — early return', code: 'return <p>The Register is empty</p>;', arrow: 'else' },
          { title: 'Not empty — map() and cards' },
        ],
      },
    },
  ],
  lab: {
    title: 'Workshop: touch the props with your own hands',
    intro:
      'Two halves: the data (the `apprentices` array) and the screen — what React draws from it. Wake the apprentices and lay them in their coffins (`isActive`), change their age, strike them out of the Register — and watch how the cards change and which line of code is responsible.',
    dataTitle: 'Data: the apprentices array',
    screenTitle: 'The Register of the Count’s apprentices',
    viewTitle: 'Screen: <ApprenticeList apprentices={apprentices} />',
    older: 'Age of {name} +1',
    younger: 'Age of {name} −1',
    remove: 'Strike out {name}',
    clear: 'Strike out everyone',
    restore: 'Bring everyone back',
    total: 'Apprentices in the Register: {n}',
    empty: 'The Register is empty',
    activeBadge: 'Awake',
    pausedBadge: 'Asleep in the coffin',
    ageLine: 'Age: {age}',
    tierLine: 'Tier: {tier}',
    minor: 'Too young to be turned',
    notesTitle: 'What just worked',
    notes: {
      empty: 'An early `return`: `apprentices.length === 0` — “The Register is empty” instead of the list.',
      list: '`apprentices.map(…)` turned the apprentices ({n}) into as many cards, each with `key={apprentice.id}`.',
      paused:
        '`isActive={false}` for {name}: `StatusBadge` picked “Asleep in the coffin” with the ternary operator, and the card got the class `card--asleep`.',
      minor: '`{age < 18 && …}`: {name} is only {age} — the note appeared by itself.',
    },
    keyTitle: 'Why an index is a bad key',
    keyIntro:
      'Write a note for every apprentice in both lists — for example, “bites” or “afraid of garlic”. Then strike out the first one and see who ends up with the notes.',
    notePlaceholder: 'a note about {name}',
    removeFirst: 'Strike out the first',
    reset: 'Start over',
    passed: 'Right now the card of {name} received:',
    keyVerdict:
      'On the left the notes “moved” to other apprentices: React compared the elements by indexes 0, 1, 2 and decided the last one had gone. On the right everything is in place: the key is the apprentice’s id, and React knows exactly who was struck out.',
  },
  questions: [
    {
      question: 'What are props?',
      answer: [
        '[[props|Props]] (properties) are the data a parent component passes to a child. In JSX they are written as attributes, and the component receives them as one object — the first and only argument of its function.',
        'Example: in `<ApprenticeCard apprentice={agnes} />` the prop `apprentice` is an object with the apprentice’s data.',
      ],
      task: {
        question: 'What will the component receive?',
        options: [
          { text: 'One props object: `{ name: "Agnes", age: 25 }`' },
          {
            text: 'Two separate arguments: `"Agnes"` and `25`',
            why: 'A component receives exactly one argument — an object with all the props.',
          },
          {
            text: 'Only `name`: you cannot pass a number like that',
            why: 'A number in curly braces is passed just like a string in quotes.',
          },
          {
            text: 'Nothing: `useState` is needed first',
            why: 'State has nothing to do with it: props come from the parent by themselves.',
          },
        ],
        explain: 'React gathers all the attributes from JSX into one object — props — and passes it to the component function.',
      },
    },
    {
      question: 'What are props for?',
      answer: [
        'So that one and the same component can show different data. A component is a template, and props are what fills it: one `ApprenticeCard` and five apprentices — five different cards.',
        'Props also connect components to each other: data flows from top to bottom, from the parent to the children.',
      ],
      task: {
        question: 'Why does `ApprenticeCard` get the apprentice through props instead of keeping the data inside?',
        options: [
          { text: 'So that one card can show any apprentice: the data comes from outside' },
          {
            text: 'It makes the browser faster',
            why: 'Speed has nothing to do with it: the point is for one component to work with different data.',
          },
          { text: 'So that the card can change the apprentice’s data', why: 'Props are read-only: the child does not change them.' },
        ],
        explain: 'A component is a template, props are its filling. One component + different props = different cards.',
      },
    },
    {
      question: 'How are props similar to function arguments?',
      answer: [
        'A component is an ordinary function, and props are its argument. Just as `sum(a, b)` counts differently for different `a` and `b`, a component draws differently for different props.',
        'The differences: there is one argument — an object with all the props; we pass it not by calling `ApprenticeCard(…)` but with attributes in JSX — React calls the function itself; and you may not change props inside.',
      ],
      code: "function greet(name) {\n  return 'Welcome to the caves, ' + name;\n}\ngreet('Agnes');\n\nfunction Greeting({ name }) {\n  return <p>Welcome to the caves, {name}</p>;\n}\n<Greeting name=\"Agnes\" />",
      task: {
        question: 'What is true about props and function arguments?',
        options: [
          { text: 'A component is a function, props are its only argument-object, and React calls the function' },
          {
            text: 'Every prop is a separate argument: `ApprenticeCard(name, age)`',
            why: 'There is one argument — an object holding all the props.',
          },
          { text: 'Props are global variables that every component sees', why: 'Only the component they were passed to sees its props.' },
        ],
        explain:
          'Props are the argument of the component function. The only difference is that we pass it with attributes in JSX, and React calls the function.',
      },
    },
    {
      question: 'How do you pass a string?',
      answer: [
        'A string is written in quotes, like an HTML attribute: `tier="Lower tier"`. Curly braces work too — `tier={"Lower tier"}` — but quotes are shorter.',
        'A string from a variable — only in curly braces: `tier={tierName}`. In quotes, `"tierName"` would pass the word tierName itself.',
      ],
      task: {
        question: 'Pass the name as a string and the tier from the variable `tierName`.',
        explain:
          'A string literal goes in quotes, a variable in curly braces. `{Agnes Morrow}` is an error: without quotes it is not a string but two unknown words.',
      },
    },
    {
      question: 'How do you pass a number?',
      answer: [
        'A number — only in curly braces: `age={25}`. In quotes, `age="25"` passes a string: `"25" + 1` gives `"251"`, and sorting and comparisons behave unexpectedly.',
      ],
      task: {
        question: 'The age must arrive as a number. Find the line with the error.',
        explain: 'Quotes always mean a string. A number is passed in curly braces: a JavaScript expression goes there.',
      },
    },
    {
      question: 'How do you pass a boolean?',
      answer: [
        '`true` can be written briefly — just the attribute name: `<StatusBadge isActive />` is the same as `isActive={true}`. `false` — only in curly braces: `isActive={false}`.',
        'The trap: `isActive="false"` is a non-empty string, and in a condition it counts as truthy.',
      ],
      task: {
        question: 'The apprentice is asleep in her coffin. How do you pass that to `StatusBadge`?',
        options: [
          {},
          { why: 'That is the string "false". A non-empty string is truthy — the badge will show “Awake”.' },
          { text: '`isActive` (no value)', why: 'An attribute without a value means true.' },
        ],
        explain: 'A boolean goes in curly braces. For true there is a short form: just the attribute name.',
      },
    },
    {
      question: 'How do you pass an object?',
      answer: [
        'An object goes in curly braces. If it sits in a variable: `apprentice={apprentice}`. If we write the object right in JSX, the braces are double: the outer ones mean “JavaScript here”, the inner ones are the object itself: `style={{ color: "crimson" }}`.',
        'You can also “pour out” all of an object’s fields as separate props: `<ApprenticeCard {...apprentice} />`.',
      ],
      task: {
        question: 'What do you write instead of `___` to pass the object `{ id: 1, name: "Agnes" }` right in JSX?',
        placeholder: 'e.g. {…}',
        explain:
          'The outer braces mean “JavaScript here”, the inner ones are an object literal. Double braces are not special syntax, just two different braces in a row.',
      },
    },
    {
      question: 'How do you get props inside a component?',
      answer: [
        'Two ways. The first is the `props` parameter and a dot: `props.apprentice.name`. The second, handier, is [[destructuring|destructuring]] right in the parameters: `function ApprenticeCard({ apprentice })`.',
        'Inside a component props are an ordinary object: read it like any other object.',
      ],
      code: '// 1. through the props object\nfunction ApprenticeCard(props) {\n  return <h3>{props.apprentice.name}</h3>;\n}\n\n// 2. by destructuring in the parameters\nfunction ApprenticeCard({ apprentice }) {\n  return <h3>{apprentice.name}</h3>;\n}',
      task: {
        question:
          'The card was given `<ApprenticeCard apprentice={agnes} />`. How do you get the name inside `function ApprenticeCard(props)`?',
        options: [
          {},
          { why: 'Props hold only `apprentice`, and the name is inside it.' },
          { why: 'Without destructuring there is no variable apprentice — only props.' },
          { why: 'this.props comes from old class components. In a function, props are a parameter.' },
        ],
        explain: 'Props are an object: `props.apprentice` is the apprentice, `props.apprentice.name` is their name.',
      },
    },
    {
      question: 'What is destructuring?',
      answer: [
        '[[destructuring|Destructuring]] is a short way to say “take the object’s fields out into variables”. Instead of `const name = apprentice.name;` and `const age = apprentice.age;` we write one line: `const { name, age } = apprentice;`.',
        'In React it is most often done right in the component’s parameters: `function ApprenticeCard({ apprentice })`. You can set a default value: `{ tier = "Lower tier" }`.',
      ],
      task: {
        question: 'What do you write instead of `___` to get `name` and `age` out of `apprentice`?',
        placeholder: 'e.g. { … }',
        explain: 'Curly braces to the left of `=` mean “unpack”: the variables get the values of the fields with the same names.',
      },
    },
    {
      question: 'May you change props?',
      answer: [
        'No. Props are [[read-only|read-only]]: a component does not change what it was given. The data belongs to the parent, and only the parent can change it — for example, in its state. Then React redraws the child with the new props.',
        'Need a different value? Create a new variable instead of editing the prop.',
      ],
      task: {
        statement: '`ApprenticeCard` may write `apprentice.isActive = false` to lay the apprentice in his coffin.',
        explain:
          'Props are read-only. The data must be changed by its owner — the parent, and the child can only ask it to do so through a callback function.',
      },
    },
    {
      question: 'What is children?',
      answer: [
        '[[children|children]] is a special prop: everything written between a component’s opening and closing tags. In `<Header>Apprentices of the Propsula caves</Header>` the text lands in `props.children`.',
        'That is how “frames” are made: a wrapper component draws the decoration, and the content is passed to it from outside.',
      ],
      code: 'function Header({ title, children }) {\n  return (\n    <header>\n      <h1>{title}</h1>\n      <p>{children}</p>\n    </header>\n  );\n}\n\n<Header title="THE COUNT’S REGISTER">Apprentices of the Propsula caves</Header>',
      task: {
        question: 'What will arrive in `children`?',
        code: '<Header title="THE COUNT’S REGISTER">Apprentices of the Propsula caves</Header>',
        options: [
          { text: 'The text “Apprentices of the Propsula caves”' },
          { text: 'The text “THE COUNT’S REGISTER”', why: 'That is the title prop — it is written as an attribute.' },
          {
            text: '`undefined`: children is passed as an attribute',
            why: 'children fills itself — with whatever stands between the tags.',
          },
        ],
        explain: 'Attributes become ordinary props, and the content between the tags becomes the children prop.',
      },
    },
    {
      question: 'What is map() used for?',
      answer: [
        '`map()` turns every element of an array into something new. That is how React draws lists: an array of data → an array of JSX elements.',
        '`apprentices.map((apprentice) => <ApprenticeCard key={apprentice.id} apprentice={apprentice} />)` — five apprentices give five cards, and you do not have to write each one by hand.',
      ],
      task: {
        question: 'Draw a card for every apprentice.',
        explain:
          '`forEach` returns nothing — React has nothing to draw. `map` returns a new array of elements. Each card gets its own `apprentice`, not the whole array.',
      },
    },
    {
      question: 'What does map() return?',
      answer: [
        'A new array of the same length; the original array does not change. Every element of the new array is whatever the function inside `map` returned.',
        'A common mistake: an arrow with curly braces and no `return` — then you get an array of `undefined`.',
      ],
      code: 'const ages = apprentices.map((a) => a.age); // [25, 28, 23, 30, 17]\n\n// ❌ curly braces without return\napprentices.map((a) => { <ApprenticeCard apprentice={a} />; });\n\n// ✅ round brackets — the value is returned by itself\napprentices.map((a) => <ApprenticeCard key={a.id} apprentice={a} />);',
      task: {
        question: 'What does `[1, 2, 3].map((n) => n * 2)` return?',
        options: [
          { text: 'A new array `[2, 4, 6]`' },
          { text: 'The same array, changed in place', why: 'map does not change the original array — it creates a new one.' },
          { why: 'That is what forEach does. map returns an array.' },
          { text: '`12` — the sum', why: 'Folding an array into one value is what reduce does.' },
        ],
        explain: 'map returns a new array of the same length; the original `[1, 2, 3]` stays as it was.',
      },
    },
    {
      question: 'What is key for?',
      answer: [
        '[[key|key]] is a unique label of a list element. With it React tells which element is which when the list changes: who was entered, struck out or moved — and updates only what is needed, without mixing up the elements’ state.',
        'The key goes on the element right inside `map`; it must be unique among its siblings. The best key is an id from the data.',
      ],
      task: {
        question: 'React will complain in the console. Find the line with the error.',
        explain: 'The elements created in map have no key — React will warn: “Each child in a list should have a unique "key" prop”.',
      },
    },
    {
      question: 'Why is it unwise to use the array index as a key?',
      answer: [
        'An index is a place in the list, not the element itself. Strike out the first apprentice or sort the Register — the indexes shift, and React decides that the elements with the old keys are the same ones. It mixes them up: typed text, checkboxes and other state “move” to someone else’s row.',
        'An index is acceptable only if the list never changes. An id from the data is better.',
      ],
      task: {
        statement: 'If apprentices can be struck out and sorted, `key={index}` is a fine choice.',
        explain: 'On removal and sorting the indexes shift, and React mixes up the elements. You need a permanent key — `apprentice.id`.',
      },
    },
    {
      question: 'What is conditional rendering?',
      answer: [
        '[[conditional|Conditional rendering]] means showing different things depending on a condition. A component is a function, so ordinary JavaScript tools work: `if` with an early `return`, the ternary operator `? :` and `&&`.',
        'For example, in the Register of apprentices: “Awake” or “Asleep in the coffin”, the note “Too young to be turned” and the line “The Register is empty”.',
      ],
      task: {
        question: 'Which tool is the handiest for each case?',
        bins: ['if with an early return', 'ternary ? :', '&&'],
        items: [
          { text: 'The Register is empty — return completely different markup' },
          { text: 'Show “Awake” or “Asleep in the coffin”' },
          { text: 'The line “Too young to be turned” only when `age < 18`' },
          { text: 'The class `card` or `card--asleep`' },
        ],
        explain:
          '`if` — when the component’s whole answer is different; `? :` — when you pick one of two; `&&` — when you show something or nothing.',
      },
    },
    {
      question: 'How do you use if in a component?',
      answer: [
        'You cannot write `if` inside JSX curly braces — only expressions are allowed there. So `if` goes **before** `return`: check the condition and immediately return the right markup (an “early return”).',
        'If there is nothing to draw, the component returns `null`.',
      ],
      code: 'function ApprenticeList({ apprentices }) {\n  if (apprentices.length === 0) {\n    return <p>The Register is empty</p>;\n  }\n  return apprentices.map((a) => <ApprenticeCard key={a.id} apprentice={a} />);\n}',
      task: {
        question: 'Find the line with the error.',
        code: "function StatusBadge({ isActive }) {\n  return (\n    <span>\n      {if (isActive) 'Awake'}\n    </span>\n  );\n}",
        fix: "{isActive ? 'Awake' : 'Asleep in the coffin'}",
        explain: 'Only expressions go inside `{}` in JSX, and `if` is a statement. Use the ternary operator or put `if` before `return`.',
      },
    },
    {
      question: 'How does the ternary operator work?',
      answer: [
        '`condition ? A : B` means “if the condition is true, then A, otherwise B”. It is an expression, so you can write it right in JSX: `{isActive ? "Awake" : "Asleep in the coffin"}`.',
        'Handy when you need to pick one of two: a text, a class or a component.',
      ],
      task: {
        question: 'Pick the badge class by `isActive`.',
        explain: 'First the condition, then `?` and the “if yes” value, then `:` and the “if no” value.',
      },
    },
    {
      question: 'How does && work in JSX?',
      answer: [
        '`condition && <Element />` means “if the condition is true, draw the element, otherwise nothing”. JavaScript returns the right side if the left one is [[truthy|truthy]], and otherwise the left side itself; React does not draw `false`, `null` or `undefined`.',
        'The trap: React does draw the number `0`! So put a real true / false on the left: `apprentices.length > 0 && …`, not `apprentices.length && …`.',
      ],
      task: {
        question: 'What appears on the screen if `apprentices` is an empty array?',
        code: "<p>{apprentices.length && 'There are apprentices'}</p>",
        options: [
          { text: 'The digit `0`' },
          {
            text: 'Nothing',
            why: 'There is 0 to the left of &&, and React draws the number 0. Nothing would appear with `apprentices.length > 0 && …`.',
          },
          { text: 'The text “There are apprentices”', why: 'A length of 0 is falsy, so the right side is not even evaluated.' },
        ],
        explain: '`0 && anything` gives `0`, and React draws it. Put a comparison to the left of `&&`: `apprentices.length > 0`.',
      },
    },
    {
      question: 'How do you show a message for an empty array?',
      answer: [
        'Check the array’s length: `apprentices.length === 0`. Then use any kind of conditional rendering: an early `return <p>The Register is empty</p>` in the list component or the ternary operator `{apprentices.length === 0 ? <p>The Register is empty</p> : <ul>…</ul>}`.',
        'Do not check the array itself: an empty array `[]` is truthy, and the condition `!apprentices` will not catch it.',
      ],
      task: {
        question: 'Which condition catches an empty Register?',
        options: [
          {},
          { why: '`[]` is an object, and objects are truthy: `![]` gives false.' },
          { why: 'Arrays are compared by reference: a new `[]` is a different object, so the comparison is always false.' },
          { why: 'That catches a missing array, not an empty one.' },
        ],
        explain: 'You check whether an array is empty by its length: `length === 0`.',
      },
    },
  ],
  miniTest: [
    {
      task: {
        question: 'What are props?',
        options: [
          {
            text: 'A way to store global state',
            why: 'Data shared by many components lives in context or Redux. Props are passed by a parent to a child.',
          },
          { text: 'Data passed to a component' },
          { text: 'CSS styles', why: 'Styles can be passed as a prop, but props are any data, not just styles.' },
        ],
        explain: 'Props are the data a component receives from its parent.',
      },
    },
    {
      task: {
        question: 'How do you pass a number?',
        options: [{ why: 'In quotes, the string "25" arrives.' }, {}],
        explain: 'A number goes in curly braces: a JavaScript expression goes there.',
      },
    },
    {
      task: {
        question: 'What does map() do?',
        options: [
          { text: 'Changes the DOM directly', why: 'map works with an array and knows nothing about the DOM. React updates the page.' },
          { text: 'Creates a new array based on the original' },
          { text: 'Removes all the array’s elements', why: 'map removes nothing: the original array stays as it was.' },
        ],
        explain: 'map walks through the array and builds a new array from whatever the function returned.',
      },
    },
    {
      task: {
        question: 'What is key for?',
        options: [
          { text: 'For CSS', why: 'key does not affect styles: it is not even in the DOM.' },
          { text: 'For identifying the elements of a React list' },
          {
            text: 'For sending data to the server',
            why: 'key is not sent anywhere and does not even get into props: React itself needs it.',
          },
        ],
        explain: 'With key React tells the list’s elements apart when the list changes.',
      },
    },
    {
      task: {
        question: 'How do you show an element only when something is true?',
        options: [
          { text: '`{isActive && <p>Awake</p>}`' },
          { text: '`{isActive <p>Awake</p>}`', why: 'There is no operator between the condition and the element — it is a syntax error.' },
        ],
        explain: '`condition && element`: with true React draws the element, with false — nothing.',
      },
    },
  ],
};
