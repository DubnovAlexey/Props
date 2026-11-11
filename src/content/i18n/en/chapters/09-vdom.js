// Английский перевод пещеры 9 «Зеркальный грот» (оригинал — ../../../chapters/09-vdom.js
// и 09-vdom.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// В задании vdom-8 ответы и «банк» слов — английские названия шагов: render, reconciliation, commit.
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute
export default {
  cave: 'Mirror Grotto',
  title: 'The virtual DOM and reconciliation',
  goal: 'Understand how props and state turn into changes on the page: the virtual DOM, render, reconciliation, commit and batched updates.',

  pretest: {
    question: 'The `title` prop of a card has changed. What will React do with the page?',
    options: [
      { text: 'Compare the new description with the old one and change only the text of the heading' },
      { text: 'Redraw the whole page from scratch' },
      { text: 'Nothing: props do not affect the page' },
      { text: 'Reload the browser tab' },
    ],
    explain:
      'React keeps a light description of the page in memory — the virtual DOM. It compares the old and the new description and changes only the difference in the real DOM.',
  },

  lesson: [
    {
      title: 'The DOM is the living tree of the page',
      body: [
        'The [[dom|DOM]] is a tree of objects that the browser builds from HTML. Every tag is a node: `<ul>` has `<li>` children, `<li>` has text.',
        'You can change the DOM by hand, with step-by-step commands. But every change may make the browser recalculate the layout and repaint the pixels. And above all, in a big app it is easy to lose track of what has already been changed and what has not.',
      ],
      code: "// by hand, step by step — imperatively\nconst title = document.querySelector('h1');\ntitle.textContent = 'Hello, Count!';\ntitle.classList.add('active');",
      key: 'By hand you tell the browser HOW to change the page. In React you describe WHAT should be on the screen — this is the [[declarative|declarative]] approach, and React works out the “how” itself.',
      scheme: {
        left: { title: 'Imperatively — by hand', items: ['find the element', 'change the text', 'add a class', 'do not forget to remove the old one'] },
        right: {
          title: 'Declaratively — React',
          items: ['describe the result: `<h1 className="active">{title}</h1>`', 'React finds the difference itself', 'and changes only that'],
        },
      },
      why: '`document.querySelector` finds the first element by a CSS selector. `textContent` replaces its text, `classList.add` adds a class. Every line is a command “do this”: that is what the imperative style looks like.',
      alt: [
        {
          code: "const title = document.getElementById('title');\ntitle.textContent = 'Hello, Count!';",
          note: 'Finding by `id` is the same imperative approach.',
        },
      ],
      wrong: [
        {
          code: "function Header({ name }) {\n  document.querySelector('h1').textContent = name;\n  return <h1>Caves</h1>;\n}",
          why: 'A manual DOM edit inside a component argues with React: React does not know about it and puts its own version back on the next render. Show data through JSX: `<h1>{name}</h1>`.',
        },
        {
          why: '`innerHTML` with text from the user is a security hole (XSS): someone else’s HTML and scripts get onto the page. JSX escapes text by itself.',
        },
      ],
    },
    {
      title: 'The virtual DOM is a reflection of the page',
      body: [
        'React keeps a light copy of the page in memory, made of ordinary objects — [[element|elements]]. This copy is called the [[virtual-dom|virtual DOM]].',
        'Every render gives a new “reflection”: a fresh tree of elements with the current props and state. Creating an object in memory is cheap, so React can do it often.',
      ],
      code: "// JSX…\nconst element = <h1 className=\"title\">{name}</h1>;\n\n// …turns into an object (simplified)\nconst sameElement = {\n  type: 'h1',\n  key: null,\n  props: { className: 'title', children: 'Count' },\n};",
      analogy:
        'A vampire has no reflection in a mirror, but a page in React does. The Count looks into the mirror, sees how everything should look and fixes only what does not match.',
      key: 'The virtual DOM is not a “second browser” but a tree of description objects. React touches the real DOM only at the end — and only where there is a difference.',
      scheme: {
        title: 'The reflection of a list in memory',
        root: {
          note: 'the root of the reflection',
          children: [{ note: "props: { name: 'Cheese' }" }, { note: "props: { name: 'Milk' }" }],
        },
      },
      why: "The bundler turns a tag into a call `jsx('h1', { className, children })`, and that returns an object: `type` — what to draw, `key` — the name in a list, `props` — everything else. `{name}` became `children`.",
      alt: [{ note: '`createElement` creates the same object without JSX.' }],
      wrong: [
        {
          code: 'document.body.appendChild(<h1>Count</h1>);',
          why: 'An element is a description, not a DOM node: `appendChild` throws a TypeError. It is React that puts elements into the DOM: `createRoot(container).render(<h1>Count</h1>)`.',
        },
      ],
    },
    {
      title: 'Render, reconciliation, commit',
      body: [
        'Every update in React goes in three steps:',
        '- [[render|render]] — React calls the components and gets a new tree of elements;',
        '- [[reconciliation|reconciliation]] — it compares the new tree with the old one and finds the differences;',
        '- [[commit|commit]] — it puts only these differences into the real DOM. Then the browser paints the screen, and after that the effects run.',
        'Props take part in the first step: the parent has rendered — the child gets a new props object, and its part of the tree is recalculated too.',
      ],
      code: 'function Counter() {\n  const [count, setCount] = useState(0);\n  console.log(\'render\'); // step 1: the component is called\n  return (\n    <div className="counter">\n      <h2>Counter</h2>\n      <p>{count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}',
      after: ['After a click only the text inside `<p>` changes in the DOM: `div`, `h2` and `button` are the same in the new tree as in the old one.'],
      key: 'A render is not yet a change of the page. A component may render, and the DOM may not change at all if the result matched the old one.',
      scheme: {
        title: 'Three steps of an update',
        steps: [
          { title: 'The cause', sub: 'a setter · a render of the parent · a new context' },
          { title: 'Render', sub: 'calling the components → a new tree of elements' },
          { title: 'Reconciliation', sub: 'comparing with the old tree, a list of differences' },
          { title: 'Commit', sub: 'precise edits of the real DOM' },
          { title: 'The browser paints, then the effects' },
        ],
      },
      why: '`console.log` in the body of a component fires on every render — that way you see that the component was called. But only `<p>` changes in the DOM: the other elements in the new tree matched the old ones.',
      alt: [
        {
          code: "useEffect(() => {\n  console.log('the commit is done: the DOM is updated');\n});",
          note: 'An effect without dependencies runs after every commit — when the DOM has already changed.',
        },
      ],
      wrong: [
        {
          code: 'function handleClick() {\n  setCount(count + 1);\n  console.log(count); // we expect the new value\n}',
          why: 'A setter does not change the variable at once: `count` is a snapshot of this render. The new value will be in the next render.',
        },
      ],
    },
    {
      title: 'How React compares trees',
      body: [
        'Comparing two trees “perfectly” takes very long, so React uses simple rules — this is [[diffing|diffing]]:',
        '- **a different type** in the same place (`div` → `section`, `UserPanel` → `AdminPanel`) — the old subtree is removed entirely, together with its state, and a new one is built;',
        '- **the same type** — the node stays, React updates only the changed attributes and goes on to compare the children;',
        '- **lists** are matched by [[key|key]] — that is why keys matter so much.',
      ],
      code: "// the same type — Panel updates, its state is kept\n<Panel role={isAdmin ? 'admin' : 'user'} />\n\n// different types — the old panel disappears with its state\n{isAdmin ? <AdminPanel /> : <UserPanel />}",
      key: 'React compares by place and type. The type changed — everything inside is built anew. Need to reset state on purpose? Change the `key`.',
      scheme: {
        left: {
          title: 'The same type',
          items: ['`<Panel role="user" />` → `<Panel role="admin" />`', 'the node stays', 'only the prop changes', 'the state is alive'],
        },
        right: {
          title: 'A different type',
          items: ['`<UserPanel />` → `<AdminPanel />`', 'the old subtree is removed', 'a new one is created from scratch', 'the state is lost'],
        },
      },
      why: 'In the first line the ternary operator picks the VALUE of a prop — the type stays `Panel`, and React only updates the prop. In the second the COMPONENT itself is picked — different types end up in the same place.',
      alt: [{ note: 'Need to start from a clean slate on purpose? Change the `key`: the same type, but for React it is a new element.' }],
      wrong: [
        {
          why: 'In one branch the form is inside a `<div>`, in the other it is not. The tree changes its shape, React recreates `SearchForm`, and the typed text is lost. Keep the structure the same and change only `className`.',
        },
      ],
    },
    {
      title: 'Batched updates',
      body: [
        'If you call several setters in one handler, React does not re-render the component after each of them. It gathers the changes into a batch and does **one** render — this is [[batching|batched updates]].',
        'Batches are gathered everywhere: in handlers, timers, promises. That is why right after a setter the state variable is still old — it is a snapshot of the current render.',
      ],
      code: "function handleReset() {\n  setName('');\n  setAge(0);\n  setError(null);\n  // one render for all three changes\n}\n\nfunction handleClick() {\n  setCount(count + 1);\n  console.log(count); // still the old value\n}",
      key: 'State in the current render is a snapshot. The new value appears in the next render, not on the next line.',
      scheme: {
        steps: [
          { title: 'A click' },
          { title: 'Three setters go into a queue' },
          { title: 'The handler has finished' },
          { title: 'One render with all the changes' },
          { title: 'One commit to the DOM' },
        ],
      },
      why: 'React waits until the handler finishes, and only then processes the queue of updates — in one render. Inside the handler `count` is a constant of the current render, so `console.log` shows the old value.',
      alt: [
        {
          code: 'function handleClick() {\n  const next = count + 1;\n  setCount(next);\n  console.log(next); // the new value\n}',
          note: 'Need the new value right now? Compute it in a variable.',
        },
        {
          code: "import { flushSync } from 'react-dom';\n\nflushSync(() => setCount(c => c + 1));\n// here the DOM is already updated",
          note: '`flushSync` forces the DOM to update at once. It is rarely needed — for example, to scroll to an element that was just added.',
        },
      ],
      wrong: [
        {
          code: 'function handleSave() {\n  setName(input);\n  sendToServer(name); // the OLD name goes out\n}',
          why: '`name` is still old — the new value will be there only in the next render. Send what you know for sure: `sendToServer(input)`.',
        },
      ],
    },
    {
      title: 'What the virtual DOM gives and what it does not',
      body: [
        'The virtual DOM is not a magic speed-up. A precise manual edit of the DOM is the fastest, but writing it for a big app is hard and dangerous. React gives the convenience of the declarative approach at a good speed.',
        'Inside React works the [[fiber|Fiber]] engine: it splits a render into small pieces and can postpone what is unimportant for the sake of what is urgent — for example, typing text.',
        'Extra renders are not scary for React. If there are thousands of them, `memo` and React Compiler will help — more about them in the Cave of Speed.',
      ],
      key: 'Remember the chain: props and state → render → a new tree → comparison → precise DOM edits. Almost everything in React is a variation of this chain.',
      scheme: {
        left: {
          title: 'Myths',
          items: ['React redraws the whole page', 'the virtual DOM is faster than any manual edit', 'a render = a change of the screen'],
        },
        right: {
          title: 'How it really is',
          items: ['only the difference gets into the DOM', 'a manual edit is faster, but harder and more dangerous', 'a render may end without any DOM edits'],
        },
      },
    },
  ],

  spell: {
    text: 'Render in the mind, compare in the shade — only the difference into the DOM is laid!',
    meaning:
      'The new tree is built in memory ([[render|render]]), [[reconciliation|reconciliation]] looks for the differences, [[commit|commit]] puts only them into the real DOM.',
  },

  practice: [
    {
      statement: 'When one prop changes, React creates the whole DOM of the page anew.',
      explain: 'React builds a new tree of elements in memory, compares it with the old one and changes only the differences in the DOM.',
    },
    {
      question: 'What is the virtual DOM?',
      options: [
        { text: 'A tree of ordinary description objects in memory' },
        { text: 'A second, hidden copy of the browser', why: 'It is not a browser but plain JavaScript objects.' },
        { text: 'A special fast DOM mode in Chrome', why: 'The browser knows nothing about the virtual DOM — it is an idea of React.' },
        { text: 'A file that stores the HTML of the page', why: 'It lives only in memory and is recreated on every render.' },
      ],
      explain:
        'The virtual DOM is a tree of React elements: objects with the fields `type`, `key` and `props`. By it React decides what to change in the real DOM.',
    },
    {
      question: 'Put the steps of an update in order.',
      items: [
        'A state setter is called',
        'Render: React calls the components',
        'A new tree of elements is ready',
        'Reconciliation: comparing with the old tree',
        'Commit: edits in the real DOM',
        'The browser paints, then the effects run',
      ],
      explain: 'Cause → render → reconciliation → commit → painting → effects. Effects always come after the DOM has already been updated.',
    },
    {
      question: 'Text was typed into the form, then `isAdmin` changed from `false` to `true`. What happens to the text?',
      options: [
        { text: 'It is lost: the type of the component in this place has changed' },
        { text: 'It is kept: React reuses the node', why: 'Only a node of the same type can be reused.' },
        { text: 'It moves into AdminForm', why: 'The state belongs to the UserForm instance and is removed together with it.' },
        { text: 'There will be an error', why: 'Replacing one component with another is an ordinary thing.' },
      ],
      hint: 'Do the types of the old and the new element in this place match?',
      explain: 'A different type in the same place — React removes the old subtree together with its state and mounts a new one.',
    },
    {
      question: 'What will React do during reconciliation?',
      bins: ['Update the node', 'Recreate the subtree'],
      items: [{}, {}, { text: '`<Card title="Cheese" />` → `<Card title="Bread" />`' }, {}, {}, {}],
      explain: 'The same type and the same key — the node is updated. A different type or a different key — for React it is a new element.',
    },
    {
      question: 'It was `count = 0`. What will `console.log` print after a click?',
      placeholder: 'a number',
      explain: 'A setter does not change the variable at once: `count` is a snapshot of the current render. The new value `1` appears in the next render.',
    },
    {
      question: 'After every click on “+1” the typed name is wiped out. Find the guilty line.',
      code: 'function Page() {\n  const [count, setCount] = useState(0);\n  function Field() {\n    return <input placeholder="Name" />;\n  }\n  return (\n    <>\n      <Field />\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </>\n  );\n}',
      fix: 'function Field() { … } — move it outside Page',
      explain:
        'On every render of `Page` a NEW function `Field` is created — for React it is a new type. Reconciliation sees a different type and recreates the field together with its text.',
    },
    {
      question: 'Name the three steps of an update.',
      code: '// 1. ___ — call the components, get a new tree\n// 2. ___ — find the difference with the old tree\n// 3. ___ — put the difference into the real DOM',
      answers: ['render', 'reconciliation', 'commit'],
      bank: ['render', 'reconciliation', 'commit', 'mounting', 'hydration'],
      explain:
        'Render computes, reconciliation compares, commit edits the DOM. Mounting is the first appearance of a component, hydration is “bringing to life” HTML from the server.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: what happens when a prop of a component changes?',
    starters: ['React calls again…', 'Then it compares…', 'What gets into the real DOM is…'],
    keywords: [
      { label: 'Render: the component is called, a new tree is built', words: ['call', 'render', 'tree', 'description'] },
      { label: 'Reconciliation: comparing with the old tree', words: ['compar', 'reconcil', 'differ'] },
      { label: 'Only the difference gets into the DOM', words: ['only', 'precise', 'difference'] },
    ],
    model:
      'When a prop changes, React calls the component again — this is render — and gets a new tree of elements, a new virtual DOM. Then it compares it with the old tree — this is reconciliation — and finds the differences. At the commit step only these differences get into the real DOM, for example the new text in one paragraph.',
  },
};
