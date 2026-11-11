// Английский перевод пещеры 15 «Подземная река» (оригинал — ../../../chapters/15-async.js
// и 15-async.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют. Текст с `<тегами>` и двоеточиями IntelliJ тоже
// иногда читает как код («недостижимый код», «метка», «with»): это ложные срабатывания, они выключены здесь же.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute,UnreachableCodeJS,JSDuplicatedDeclaration,CommaExpressionJS,JSVoidFunctionReturnValueUsed,UnnecessaryLabelJS,WithStatementJS,InfiniteLoopJS
export default {
  cave: 'Underground River',
  title: 'Data from a server: Promise, async and loading',
  goal: 'Understand how data from a server gets into components: Promise, async/await, fetch, loading in an effect without races, and loading and error states in props.',

  pretest: {
    question: "What will `fetch('/api/products')` return right after the call?",
    options: [
      { text: 'A Promise — a promise that the answer will come later' },
      { text: 'A ready array of products' },
      { text: 'A string with JSON' },
      {},
    ],
    explain:
      'The network is not instant. `fetch` returns a Promise at once, and the data comes later — you wait for it with `await` or `then`.',
  },

  lesson: [
    {
      title: 'A Promise is a promise of an answer',
      body: [
        'A request to a server takes time, and JavaScript does not freeze while waiting. Instead of the result it gives a [[promise|Promise]] at once — a “promise”: a value will come later, or an error will.',
        'A promise has three states: pending, fulfilled (there is a value) and rejected (an error). The reaction to the result is subscribed with `then` and `catch`.',
      ],
      code: "const promise = fetch('/api/products');\n\npromise\n  .then(response => response.json())\n  .then(products => console.log(products))\n  .catch(error => console.error('It failed:', error));\n\nconsole.log('This line runs before the answer!');",
      analogy:
        'A Promise is like a messenger bat: you sent it for a letter and go about your business, and it comes back later — with the letter or with a torn wing.',
      key: 'The code after a request does not wait for the answer. Everything that depends on the data goes inside `then` or after `await`.',
      scheme: {
        title: 'The life of a promise',
        steps: [
          { title: 'The request is sent' },
          { title: 'Pending', sub: 'the code goes on without waiting for the answer' },
          { title: 'Fulfilled → then', sub: 'the data has come' },
          { title: 'or rejected → catch', sub: 'a network failure or a thrown error' },
        ],
      },
      why: '`fetch` returns a Promise at once. `then` subscribes a function to the successful result, and every `then` returns a new Promise — that is why they are lined up in a chain. `response.json()` is asynchronous too: it reads the body of the answer and turns JSON into an object.',
      alt: [{ note: 'A setter can be passed right into `then` — it gets the data. `finally` fires whatever the outcome.' }],
      wrong: [
        {
          why: 'The variable holds a Promise, not an array: “products.map is not a function”. The data is available only after `then` or `await`.',
        },
      ],
    },
    {
      title: 'async and await — waiting like a human',
      body: [
        '[[async-await|async/await]] is a convenient way of writing the same promises. `async` goes before a function, and inside it `await` goes before a promise: “wait for the result and go on”.',
        'Errors are caught with an ordinary `try…catch`. And `finally` runs in any case — handy for turning off a loading indicator.',
      ],
      code: "async function loadProducts() {\n  try {\n    const response = await fetch('/api/products');\n    if (!response.ok) throw new Error(`Error ${response.status}`);\n    return await response.json();\n  } catch (error) {\n    console.error(error);\n    return [];\n  } finally {\n    console.log('The request is finished');\n  }\n}",
      key: '[[fetch|fetch]] does not consider the answers 404 and 500 errors — check `response.ok` yourself. For fetch only a network failure is an error.',
      scheme: {
        left: { title: 'A then chain', items: ['`fetch(url).then(r => r.json())`', 'errors — `.catch(…)`', 'the nesting grows'] },
        right: {
          items: ['`const r = await fetch(url)`', 'errors — `try…catch`', 'it reads from top to bottom'],
        },
      },
      why: '`async` makes a function asynchronous: it always returns a Promise. `await` pauses it until the answer comes, without blocking the page. `throw new Error(…)` turns a bad status into an error that `catch` will catch.',
      alt: [{ note: '`async` can go before an arrow too.' }],
      wrong: [
        {
          why: '`await` works only inside an `async` function or at the top level of a module — here it is a syntax error.',
        },
        {
          why: 'An async function returns a Promise, not the data. You need `await loadProducts()` inside another async function, or `.then(…)`.',
        },
      ],
    },
    {
      title: 'Loading in an effect',
      body: [
        'To load data when a component appears, the request is made in [[useeffect|useEffect]]: render must stay pure.',
        'While the answer is on its way, `productId` may change. Then the old answer may come after the new one and overwrite it — this is a [[race-condition|race of requests]]. The protection is a flag in the cleanup of the effect: the answer of an “outdated” effect is ignored.',
      ],
      code: 'function Product({ productId }) {\n  const [product, setProduct] = useState(null);\n\n  useEffect(() => {\n    let ignore = false;\n    fetchProduct(productId).then(data => {\n      if (!ignore) setProduct(data);\n    });\n    return () => {\n      ignore = true; // the answer of the old request is not needed\n    };\n  }, [productId]);\n\n  return product ? <h2>{product.name}</h2> : <p>Loading…</p>;\n}',
      key: 'An effect with a request always comes with a cleanup: the `ignore` flag or an `AbortController`. Otherwise quick switching shows the wrong data.',
      scheme: {
        title: 'How the ignore flag saves you from a race',
        steps: [
          { title: 'productId = 1 → request No. 1' },
          { title: 'productId = 2 → the cleanup of effect No. 1' },
          { title: 'Effect No. 2 → request No. 2' },
          { title: 'Answer No. 1 came late — ignored' },
          { title: 'Answer No. 2 → setProduct' },
        ],
      },
      why: '`let ignore = false` — every run of the effect has its own flag (that is a closure!). The cleanup of the old run sets its flag to `true`, so a late answer can no longer break anything. The dependency `[productId]` restarts the effect when the product changes.',
      alt: [
        {
          note: '`AbortController` does not just ignore the answer but cancels the request itself. The cancellation comes as an `AbortError` — it is told apart from real errors.',
        },
      ],
      wrong: [
        {
          why: 'An effect cannot be async: it would return a Promise instead of a cleanup function, and React warns about it. Declare an async function inside the effect and call it.',
        },
      ],
    },
    {
      title: 'Loading, error, data — in props',
      body: [
        'A request has three outcomes: [[loading-state|loading]] is going on, an error came, the data came. They are kept in the state of the loader component and passed down in ordinary [[props|props]].',
        'The children stay simple: they know nothing about `fetch` and just draw what they got. They are easy to test and to reuse.',
      ],
      code: 'function FridgePage() {\n  const [products, setProducts] = useState([]);\n  const [isLoading, setIsLoading] = useState(true);\n  const [error, setError] = useState(null);\n  // …an effect loads the data and calls the setters\n\n  if (error) return <ErrorModal isOpen>{error.message}</ErrorModal>;\n  return <ProductList products={products} isLoading={isLoading} />;\n}',
      key: 'The network code is in one place, at the top. Further down the tree there are only the props `isLoading`, `error`, `products`.',
      scheme: {
        title: 'Who goes to the network and who only draws',
        root: {
          children: [{ note: 'just draws' }, { note: 'shows the text of the error' }],
        },
      },
      why: 'Three `useState` calls are three independent facts about the request. An early `return` on an error shows the window, otherwise the list. The list gets the data and the loading flag in props and knows nothing about the network.',
      alt: [
        {
          note: 'You can keep one object with a status — then contradictions like “loading and an error at the same time” are impossible.',
        },
      ],
      wrong: [
        {
          why: '`error` is an Error object, and objects cannot be drawn: “Objects are not valid as a React child”. Show the text: `{error.message}`.',
        },
      ],
    },
    {
      title: 'A request on a user’s action',
      body: [
        'Not all requests are needed when a component appears. A search or a form submission is done in an [[event-handler|event handler]]: the user pressed — the request went out. No effect is needed here.',
        'A handler can be `async`. The loading state is turned on before the request and turned off in `finally`.',
      ],
      code: "function SearchForm({ onFound }) {\n  const [isLoading, setIsLoading] = useState(false);\n\n  async function handleSubmit(e) {\n    e.preventDefault();\n    const dish = new FormData(e.currentTarget).get('dish');\n    setIsLoading(true);\n    try {\n      onFound(await findRecipe(dish)); // the result goes to the parent\n    } finally {\n      setIsLoading(false);\n    }\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input name=\"dish\" />\n      <button disabled={isLoading}>{isLoading ? 'Searching…' : 'Find'}</button>\n    </form>\n  );\n}",
      key: 'A request on appearing goes in an effect. A request on an action goes in a handler. Mix them up and you get extra requests.',
      scheme: {
        title: 'A search by a button',
        steps: [
          { title: 'Submitting the form' },
          { title: 'We turn on loading' },
          { title: 'We wait for the answer' },
          { title: 'The result goes to the parent' },
          { title: 'finally: we turn off loading' },
        ],
      },
      why: '`async function handleSubmit` — a handler can wait too. We read the value of the field at the start, before `await`, while the event is still fresh. `try…finally` guarantees that the button is unlocked even on an error.',
      alt: [{ note: 'The same without async/await — with a chain of `then` and `finally`.' }],
      wrong: [
        {
          why: '`preventDefault` after `await` is too late: the browser has already submitted the form and reloaded the page. Call it on the first line.',
        },
      ],
    },
    {
      title: 'React 19: use and Suspense',
      body: [
        'React 19 brought [[use|use]]: it “unwraps” a Promise right in a component. While the promise is on its way, React shows the fallback view of the nearest [[suspense|Suspense]].',
        'A Promise for `use` is created in advance — for example, in the parent or in a data library — and passed in a prop. If you create it in the component itself, it is new on every render.',
        'In big projects loading is often handed over to libraries (TanStack Query, SWR) or to a framework. But under the hood there are the same promises and props.',
      ],
      code: "import { use, Suspense } from 'react';\n\nfunction ProductInfo({ productPromise }) {\n  const product = use(productPromise); // waits for the answer\n  return <h2>{product.name}</h2>;\n}\n\nfunction Page({ productPromise }) {\n  return (\n    <Suspense fallback={<p>Loading…</p>}>\n      <ProductInfo productPromise={productPromise} />\n    </Suspense>\n  );\n}",
      key: 'A Promise can be passed in a prop like any value. `use` waits for it, and `Suspense` shows the fallback view.',
      scheme: {
        title: 'A Promise in a prop',
        steps: [
          { title: 'The parent created the Promise in advance' },
          { title: 'It passed it in a prop' },
          { title: 'use waits for the answer', sub: 'Suspense shows the fallback' },
          { title: 'The Promise is fulfilled — the component is drawn with the data' },
        ],
      },
      why: '`use(productPromise)` returns the value of a fulfilled promise. While it is pending, the component “suspends”, and React shows the `fallback` of the nearest `Suspense` up the tree.',
      alt: [
        {
          code: 'function Badge({ showTheme }) {\n  if (!showTheme) return null;\n  const theme = use(ThemeContext); // use — even after a condition\n  return <span className={theme}>★</span>;\n}',
          note: '`use` reads a context too. Unlike hooks, it can be called after conditions and in loops.',
        },
      ],
      wrong: [
        {
          why: 'The Promise is created anew on every render — React warns about an “uncached promise”. Create it in advance or take it from a library with a cache.',
        },
      ],
    },
  ],

  spell: {
    text: 'fetch makes a promise, await waits for it, and ignore leaves the old answer behind.',
    meaning:
      'A [[promise|Promise]] is a promise of an answer, [[async-await|await]] waits for it, and the ignore flag in the cleanup protects against a [[race-condition|race of requests]].',
  },

  practice: [
    {
      statement: '`fetch` throws an error if the server answered 404.',
      explain:
        'For fetch a 404 answer is a normal answer with a bad status. It considers only a network failure an error. Check `response.ok`.',
    },
    {
      question: 'In what order will the lines appear in the console?',
      options: [
        {},
        { why: '`then` fires only when the answer comes — after all the synchronous code.' },
        { why: 'Synchronous code runs in order: first 1, then 3.' },
        { why: 'The network answer cannot come before the first line has run.' },
      ],
      explain: 'Synchronous lines run at once, and the callback from `then` runs later, when the Promise is fulfilled.',
    },
    {
      question: 'Loading data in an effect: put it in order.',
      items: [
        'Render: “Loading…” is on the screen',
        'The effect sent the request',
        'The answer came, the ignore flag is still false',
        'setProduct(data) is called',
        'A new render: the product is on the screen',
        'The component was removed — the cleanup sets ignore = true',
      ],
      explain:
        'First a render with a placeholder, then the effect, the answer, the setter and a new render. The cleanup comes before a repeat of the effect and when the component is removed.',
    },
    {
      question: 'Where should you make the request that submits a search form?',
      options: [
        { text: 'In the submit handler of the form' },
        { text: 'In useEffect without a dependency array', why: 'Such an effect runs after every render, not when the button is pressed.' },
        { text: 'Right in the body of the component', why: 'Render must be pure: the request would go out on every re-render.' },
        { text: 'In useState', why: 'useState keeps a value, it does not run requests.' },
      ],
      explain: 'A request triggered by a user’s action lives in the handler of that action.',
    },
    {
      question: 'When products are switched quickly, sometimes the wrong one is shown. Where is the protection missing?',
      fix: 'if (!ignore) setProduct(data); — and in the cleanup return () => { ignore = true; }',
      explain:
        'The old answer may come after the new one and overwrite it. You need an ignore flag that the cleanup of the effect sets to true.',
    },
    {
      question: 'Complete the asynchronous function.',
      explain: '`async` before a function allows `await` inside it, and `await` waits until the Promise is fulfilled.',
    },
    {
      question: 'Where should the request be made?',
      bins: ['In an effect', 'In a handler'],
      items: [
        { text: 'Load the profile when the page opens' },
        { text: 'Submit the search form' },
        { text: 'Subscribe to a chat when the component has appeared' },
        { text: 'Save a note with the “Save” button' },
        { text: 'Load the products when the category in the props changes' },
        { text: 'Delete a product on a click' },
      ],
      explain:
        'Needed because the component is on the screen or the props have changed — an effect. Needed because the user did something — a handler.',
    },
    {
      question: "Why is `use(fetch('/api/product'))` right in the body of a component a bad idea?",
      options: [
        { text: 'The Promise will be new on every render' },
        { text: 'use cannot work with promises', why: 'It can — that is what it was made for.' },
        { text: 'fetch must not be called in a React project', why: 'It may — in effects, handlers or in advance.' },
        { text: 'Suspense forbids requests', why: 'Suspense only shows the fallback view while the data is on its way.' },
      ],
      explain:
        'Every render creates a new Promise, and React waits again. A Promise is created in advance and passed in a prop, or taken from a library with a cache.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: how do you load data from a server into a component and not show an outdated answer?',
    starters: ['The request is made in…', 'While we wait for the answer…', 'So that the old answer does not overwrite the new one…'],
    keywords: [
      { label: 'The request goes in useEffect or in a handler', words: ['useeffect', 'effect', 'handler'] },
      { label: 'Loading and the error go into props', words: ['loading', 'isloading', 'error', 'prop'] },
      { label: 'The ignore flag in the cleanup against a race', words: ['ignore', 'cleanup', 'abort', 'race', 'outdated', 'stale'] },
    ],
    model:
      'A request when a component appears is made in useEffect, and on a user’s action — in a handler. While the answer is on its way, the state holds isLoading, on a failure — error, and all of it is passed down in props. So that the old answer does not overwrite the new one, the cleanup of the effect sets the flag ignore = true, and the setter is not called for the outdated answer.',
  },
};
