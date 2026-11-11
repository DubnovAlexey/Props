// Английский перевод пещеры 10 «Пещера эха» (оригинал — ../../../chapters/10-callbacks.js
// и 10-callbacks.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют. Текст с `<тегами>` и двоеточиями IntelliJ тоже
// иногда читает как код («недостижимый код», «метка», «with»): это ложные срабатывания, они выключены здесь же.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute,UnreachableCodeJS,JSDuplicatedDeclaration,CommaExpressionJS,JSVoidFunctionReturnValueUsed,UnnecessaryLabelJS,WithStatementJS,InfiniteLoopJS
export default {
  cave: 'Cave of Echoes',
  title: 'Functions in props and lifting state up',
  goal: 'Learn to pass functions in props so that children can tell the parent about events.',

  pretest: {
    question: 'A child wants to tell the parent that “Delete” was pressed. How?',
    options: [
      { text: 'Call the function the parent passed in a prop' },
      { text: 'Change the parent’s prop' },
      { text: 'No way — children do not talk to parents' },
      { text: 'Write the data into a global variable' },
    ],
    explain: 'The parent gives the child a function, the child calls it — that is how an event “rises” up.',
  },

  lesson: [
    {
      title: 'A little bell for the parent',
      body: [
        'The parent gives the child a function — a [[callback|callback]]. When something happens, the child “rings the bell”: it calls the function and passes the data.',
      ],
      code: "function ProductList({ products }) {\n  function handleDelete(id) {\n    console.log('delete', id);\n  }\n  return products.map(p => (\n    <ProductCard key={p.id} product={p}\n      onDelete={handleDelete} />\n  ));\n}\n\nfunction ProductCard({ product, onDelete }) {\n  return (\n    <button onClick={() => onDelete(product.id)}>\n      Delete {product.name}\n    </button>\n  );\n}",
      key: 'Data goes down, events go up. The child does not change the parent’s data — it tells the parent about an event.',
      why: 'The parent passes the FUNCTION `handleDelete` down under the name `onDelete`. The child does not know what it does — it simply “rings the bell” and passes the data: `onDelete(product.id)`. The arrow `() => …` is needed so that the call happens on a click and not during render.',
      alt: [
        {
          code: 'function ProductCard({ product, onDelete }) {\n  function handleClick() {\n    onDelete(product.id);\n  }\n  return <button onClick={handleClick}>Delete</button>;\n}',
          note: 'A handler function of its own instead of an arrow in JSX — handy when the handler has several lines.',
        },
      ],
      wrong: [
        {
          code: '<button onClick={onDelete(product.id)}>\n  Delete\n</button>',
          why: 'Parentheses after the name call the function at once — during render. The deletion happens without a click, and for every card.',
        },
        {
          why: 'A child does not change the parent’s data by itself: that is a mutation of someone else’s prop. It should ask the parent — call its function.',
        },
      ],
    },
    {
      title: 'Names: onSomething and handleSomething',
      body: [
        'The convention: a function prop is called `onDelete`, `onSearch`, `onClose` (“when something is deleted”), and the [[event-handler|handler]] function in the parent is `handleDelete` (“handle the deletion”).',
      ],
      key: '`on…` is in the props, `handle…` is inside the component. The name tells you at once who calls whom.',
      scheme: {
        left: {
          title: '`on…` — the name of a prop',
          items: [
            'what happened: `onSearch`, `onClose`',
            'that is what the attribute on the child is called',
            'like `onClick` on a button',
          ],
        },
        right: {
          title: '`handle…` — the name of a function',
          items: ['who handles it: `handleSearch`', 'lives in the parent', 'is passed into an `on…` prop'],
        },
      },
      why: 'React does not demand special names for your own components — it is a convention. `on` says “here is an event”, `handle` — “here is who handles it”. The code reads like a sentence: “on search — handle the search”.',
      alt: [{ note: 'You can pass an arrow right into the prop, without a separate `handle…` function.' }],
      wrong: [
        {
          code: '<button onclick={handleClick}>Ok</button>',
          why: 'On DOM elements events are written in camelCase: `onClick`. With lowercase letters React prints a warning, and the handler does not fire.',
        },
        {
          why: 'The name of a prop must match letter for letter: we passed `onsearch` but read `onSearch` — we get undefined.',
        },
      ],
    },
    {
      title: 'Pass the function, not its call',
      body: [
        'The most common mistake is extra parentheses. `onClick={handleClick()}` calls the function **right during render** and passes its result.',
        'Need an argument? Wrap the call in an [[arrow-function|arrow function]].',
      ],
      code: '// ✅ we pass a function\n<button onClick={handleClick}>Ok</button>\n\n// ✅ an argument is needed — an arrow wrapper\n<button onClick={() => onDelete(id)}>×</button>\n\n// ❌ a call during render!\n<button onClick={onDelete(id)}>×</button>',
      key: 'If the “call during render” changes state, you get an endless loop and the error “Too many re-renders”.',
      scheme: {
        left: {
          title: 'A function — it will be called later',
          items: ['`onClick={handleClick}`', '`onClick={() => onDelete(id)}`', 'React calls it on a click'],
        },
        right: {
          title: 'A call — it works right now',
          items: ['`onClick={onDelete(id)}`', 'runs during render', 'the result gets into `onClick` — usually undefined'],
        },
      },
      why: '`onClick` expects a function that React will call LATER — on a click. A name without parentheses is the function itself. A name with parentheses is a call right now. Need an argument? Wrap the call in an arrow.',
      alt: [{ note: '`bind` also creates a new function with a ready argument. It works, but an arrow is clearer.' }],
      wrong: [
        {
          why: 'A change of state during render triggers a new render, which calls the setter again… React stops this with the error “Too many re-renders”.',
        },
        {
          why: 'The arrow returns the function but does not call it — nothing happens on a click. You need `() => onDelete(id)`.',
        },
      ],
    },
    {
      title: 'Lifting state up',
      body: [
        'If two neighbours need the same data, keep it at their nearest common parent — this is [[lifting-state|lifting state up]]. The parent passes down both the value and the function to change it.',
      ],
      key: 'Neighbours do not pass props to each other. Shared data lives at the common parent.',
      why: 'The search string is needed by two neighbours: the field changes it, the list filters by it. The neighbours do not see each other, so the state lives at the nearest common parent — `FridgePage`. Data goes down (`query`, `visible`), calls go up (`onQueryChange`).',
      alt: [{ note: 'You can wrap the setter and, for example, trim the spaces before saving.' }],
      wrong: [
        {
          code: "function SearchBar() {\n  const [query, setQuery] = useState('');\n  // ProductList will never learn about this query\n}",
          why: 'If the state is hidden in the field, the list cannot filter by it. Shared data is lifted up to the common parent.',
        },
      ],
    },
    {
      title: 'The event object',
      body: [
        'A handler of a DOM event gets the [[event|event object]] `e`. From it you take the value of a field and cancel the browser’s default action.',
      ],
      code: 'function SearchBar({ query, onQueryChange }) {\n  return (\n    <input value={query}\n      onChange={e => onQueryChange(e.target.value)} />\n  );\n}\n\nfunction Form({ onSearch }) {\n  function handleSubmit(e) {\n    e.preventDefault(); // without a reload\n    onSearch();\n  }\n  return <form onSubmit={handleSubmit}>…</form>;\n}',
      scheme: {
        title: 'What is inside the event object',
        root: {
          note: 'the event object',
          children: [
            { note: 'the element where it all happened: e.target.value is the text of a field' },
            { note: 'the element the handler hangs on' },
            { note: 'cancel the browser’s default action' },
            { note: 'do not let the event go higher, to the parents' },
          ],
        },
      },
      why: 'React passes the event object `e` into a handler. `e.target` is the element it happened on, so the text of a field is `e.target.value`. `e.preventDefault()` cancels the browser’s default action: the form will not reload the page.',
      alt: [
        { note: 'The name of the parameter can be anything: `e`, `event`, `evt` — it is just the first argument.' },
        { note: 'In React 19 you can pass a function to the `action` of a form: it gets FormData, and `preventDefault` is not needed.' },
      ],
      wrong: [
        { why: 'An event has no `value` — the value lies in the element: `e.target.value`. Here it will always be undefined.' },
        { why: 'Without `e.preventDefault()` the browser submits the form and reloads the page — the state of the app is lost.' },
      ],
    },
  ],

  spell: {
    text: 'Data goes down, events go up; pass the function — do not call it up!',
    meaning: '`onClick={handleClick}` — passed. `onClick={handleClick()}` — called during render.',
  },

  practice: [
    {
      question: 'Find the line with the mistake.',
      code: 'function Card({ product, onDelete }) {\n  return (\n    <button onClick={onDelete(product.id)}>\n      Delete\n    </button>\n  );\n}',
      explain:
        '`onDelete(product.id)` is called during render, and its result (undefined) gets into onClick. Wrap the call in an arrow function.',
    },
    {
      question: 'By convention, what should you call the prop through which a form reports a search?',
      options: [
        {},
        { why: '`handle…` is the name of the handler inside the parent, and the prop is called `on…`.' },
        { why: 'It will work, but it is not the generally accepted name.' },
        { why: 'It will work, but it breaks the `on…` convention.' },
      ],
      explain: '`<SearchForm onSearch={handleSearch} />` — the prop is `on…`, the handler is `handle…`.',
    },
    {
      question: 'Complete it: the child tells the parent the id of the product being deleted.',
      hint: 'Inside the child the function is called the same as the prop.',
      explain:
        'The arrow function `() => onDelete(product.id)` calls the prop only on a click. `handleDelete` lives in the parent — the child knows nothing about it.',
    },
    {
      statement: 'Two neighbouring components can pass props to each other directly.',
      explain: 'Only a parent passes props to its children. Shared data of neighbours is lifted up to the common parent.',
    },
    {
      question: 'Lifting state up: put the steps in order.',
      items: [
        'Find the nearest common parent of the two components',
        'Move `useState` into this parent',
        'Pass the value down in a prop',
        'Pass down the function for changing it',
        'The children call the function instead of their own setter',
      ],
      explain: 'The state “moves” up, and the children get the value and a callback.',
    },
    {
      question: 'What will the console print on the first render?',
      code: "function App() {\n  function hello() {\n    console.log('Hello');\n  }\n  return <button onClick={hello()}>Press</button>;\n}",
      options: [
        { text: '“Hello” — at once, even before a click' },
        { text: 'Nothing until the button is pressed', why: '`hello()` with parentheses runs during render.' },
        { text: '“Hello” on every click', why: 'The result of `hello()` got into onClick — undefined, so a click does nothing.' },
        { text: 'A syntax error', why: 'The syntax is correct — the mistake is a logical one.' },
      ],
      explain: 'Parentheses after the name of a function are a call. The right way: `onClick={hello}`.',
    },
    {
      question: 'Match the notation and its meaning.',
      pairs: [
        ['`onDelete`', 'A function prop “when something is deleted”'],
        ['`handleDelete`', 'The handler in the parent'],
        ['`e.target.value`', 'The text from an input field'],
        ['`e.preventDefault()`', 'Cancel the browser’s action'],
      ],
      explain: 'These four notations appear in almost every React app.',
    },
    {
      question: 'What is the technique of moving shared data to the nearest common parent called? Three words.',
      answers: ['lifting state up', 'lifting the state up', 'lifting state', 'state lifting', 'lift state up'],
      explain: 'Lifting state up is a basic React technique for shared data.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: how can a child tell the parent about a click?',
    starters: ['The parent passes…', 'The child calls…', 'It is important not to…'],
    keywords: [
      { label: 'The parent passes a function in a prop', words: ['function', 'callback', 'prop'] },
      { label: 'The child calls it on an event', words: ['call', 'click', 'event'] },
      {
        label: 'Pass the function, not its call',
        words: ['parenthes', 'bracket', 'arrow', '=>', 'not the call', 'without calling', 'not call'],
      },
    ],
    model:
      'The parent passes the child a function in a prop, for example onDelete. The child calls it on an event — onClick={() => onDelete(id)} — and that way tells the parent what happened. You must pass the function itself or an arrow wrapper, not its call.',
  },
};
