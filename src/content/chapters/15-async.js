// Пещера 15. Подземная река: данные с сервера — Promise, async/await, fetch,
// загрузка без гонок и состояния загрузки/ошибки в пропсах.
// Стоит после «Часового грота»: загрузка при появлении компонента живёт в useEffect.
export default {
  id: 'async',
  order: 15,
  icon: '🛶',
  color: '#7c9cff',
  cave: 'Подземная река',
  title: 'Данные с сервера: Promise, async и загрузка',
  goal: 'Понять, как данные с сервера попадают в компоненты: Promise, async/await, fetch, загрузка в эффекте без гонок и состояния загрузки и ошибки в пропсах.',
  breakRound: 'hooks',

  pretest: {
    question: "Что вернёт `fetch('/api/products')` сразу после вызова?",
    options: [
      { text: 'Promise — обещание, что ответ придёт позже', correct: true },
      { text: 'Готовый массив продуктов' },
      { text: 'Строку с JSON' },
      { text: '`undefined`' },
    ],
    explain: 'Сеть работает не мгновенно. `fetch` сразу возвращает Promise, а данные будут позже — их ждут через `await` или `then`.',
  },

  lesson: [
    {
      title: 'Promise — обещание ответа',
      body: [
        'Запрос к серверу занимает время, а JavaScript не замирает в ожидании. Вместо результата он сразу даёт [[promise|Promise]] — «обещание»: значение придёт позже или придёт ошибка.',
        'У обещания три состояния: ожидание, выполнено (есть значение) и отклонено (ошибка). Реакцию на результат подписывают через `then` и `catch`.',
      ],
      code: "const promise = fetch('/api/products');\n\npromise\n  .then(response => response.json())\n  .then(products => console.log(products))\n  .catch(error => console.error('Не вышло:', error));\n\nconsole.log('Эта строка выполнится раньше ответа!');",
      highlight: [1, 8],
      analogy:
        'Promise — как летучая мышь-гонец: ты отправил её за письмом и занимаешься делами, а она вернётся позже — с письмом или с порванным крылом.',
      key: 'Код после запроса не ждёт ответа. Всё, что зависит от данных, — внутри `then` или после `await`.',
    },
    {
      title: 'async и await — ждать по-человечески',
      body: [
        '[[async-await|async/await]] — удобная запись тех же промисов. Перед функцией пишут `async`, а внутри перед промисом — `await`: «дождись результата и продолжай».',
        'Ошибки ловят обычным `try…catch`. А `finally` выполнится в любом случае — удобно, чтобы выключить индикатор загрузки.',
      ],
      code: "async function loadProducts() {\n  try {\n    const response = await fetch('/api/products');\n    if (!response.ok) throw new Error(`Ошибка ${response.status}`);\n    return await response.json();\n  } catch (error) {\n    console.error(error);\n    return [];\n  } finally {\n    console.log('Запрос завершён');\n  }\n}",
      highlight: [3, 4, 6],
      key: '[[fetch|fetch]] не считает ошибкой ответы 404 и 500 — проверяй `response.ok` сам. Ошибкой для него будет только сбой сети.',
    },
    {
      title: 'Загрузка в эффекте',
      body: [
        'Чтобы загрузить данные при появлении компонента, запрос делают в [[useeffect|useEffect]]: рендер должен оставаться чистым.',
        'Пока ответ в пути, `productId` может смениться. Тогда старый ответ может прийти позже нового и затереть его — это [[race-condition|гонка запросов]]. Защита — флаг в очистке эффекта: ответ «устаревшего» эффекта игнорируется.',
      ],
      code: 'function Product({ productId }) {\n  const [product, setProduct] = useState(null);\n\n  useEffect(() => {\n    let ignore = false;\n    fetchProduct(productId).then(data => {\n      if (!ignore) setProduct(data);\n    });\n    return () => {\n      ignore = true; // ответ старого запроса не нужен\n    };\n  }, [productId]);\n\n  return product ? <h2>{product.name}</h2> : <p>Загрузка…</p>;\n}',
      highlight: [5, 7, 10],
      key: 'Эффект с запросом — всегда с очисткой: флаг `ignore` или `AbortController`. Иначе быстрые переключения покажут не те данные.',
    },
    {
      title: 'Загрузка, ошибка, данные — в пропсах',
      body: [
        'У запроса три исхода: идёт [[loading-state|загрузка]], пришла ошибка, пришли данные. Их хранят в состоянии компонента-загрузчика и передают вниз обычными [[props|пропсами]].',
        'Дети при этом остаются простыми: они не знают про `fetch`, а просто рисуют то, что получили. Их легко проверить и переиспользовать.',
      ],
      code: 'function FridgePage() {\n  const [products, setProducts] = useState([]);\n  const [isLoading, setIsLoading] = useState(true);\n  const [error, setError] = useState(null);\n  // …эффект загружает данные и вызывает сеттеры\n\n  if (error) return <ErrorModal isOpen>{error.message}</ErrorModal>;\n  return <ProductList products={products} isLoading={isLoading} />;\n}',
      highlight: [7, 8],
      key: 'Сетевой код — в одном месте, наверху. Ниже по дереву — только пропсы `isLoading`, `error`, `products`.',
    },
    {
      title: 'Запрос по действию пользователя',
      body: [
        'Не все запросы нужны при появлении компонента. Поиск или отправку формы делают в [[event-handler|обработчике события]]: пользователь нажал — пошёл запрос. Эффект здесь не нужен.',
        'Обработчик может быть `async`. Состояние загрузки включают перед запросом и выключают в `finally`.',
      ],
      code: "function SearchForm({ onFound }) {\n  const [isLoading, setIsLoading] = useState(false);\n\n  async function handleSubmit(e) {\n    e.preventDefault();\n    const dish = new FormData(e.currentTarget).get('dish');\n    setIsLoading(true);\n    try {\n      onFound(await findRecipe(dish)); // результат — родителю\n    } finally {\n      setIsLoading(false);\n    }\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input name=\"dish\" />\n      <button disabled={isLoading}>{isLoading ? 'Ищу…' : 'Найти'}</button>\n    </form>\n  );\n}",
      highlight: [4, 9, 11],
      key: 'Запрос при появлении — в эффекте. Запрос по действию — в обработчике. Перепутаешь — получишь лишние запросы.',
    },
    {
      title: 'React 19: use и Suspense',
      body: [
        'В React 19 появился [[use|use]]: он «разворачивает» Promise прямо в компоненте. Пока обещание в пути, React показывает запасной вид из ближайшего [[suspense|Suspense]].',
        'Promise для `use` создают заранее — например, в родителе или в библиотеке данных — и передают пропом. Если создавать его в самом компоненте, он будет новым на каждом рендере.',
        'В больших проектах загрузку часто отдают библиотекам (TanStack Query, SWR) или фреймворку. Но под капотом там те же промисы и пропсы.',
      ],
      code: "import { use, Suspense } from 'react';\n\nfunction ProductInfo({ productPromise }) {\n  const product = use(productPromise); // ждёт ответ\n  return <h2>{product.name}</h2>;\n}\n\nfunction Page({ productPromise }) {\n  return (\n    <Suspense fallback={<p>Загрузка…</p>}>\n      <ProductInfo productPromise={productPromise} />\n    </Suspense>\n  );\n}",
      highlight: [4, 10],
      key: 'Promise можно передать пропом, как любое значение. `use` дождётся его, а `Suspense` покажет запасной вид.',
    },
  ],

  spell: {
    text: 'fetch обещает, await дожидается, а ignore со старым ответом не связывается.',
    meaning:
      '[[promise|Promise]] — обещание ответа, [[async-await|await]] ждёт его, а флаг ignore в очистке защищает от [[race-condition|гонки запросов]].',
  },

  practice: [
    {
      id: 'async-1',
      type: 'truefalse',
      statement: '`fetch` выбрасывает ошибку, если сервер ответил 404.',
      answer: false,
      explain: 'Для fetch ответ 404 — нормальный ответ с плохим статусом. Ошибкой он считает только сбой сети. Проверяй `response.ok`.',
    },
    {
      id: 'async-2',
      type: 'choice',
      question: 'В каком порядке появятся строки в консоли?',
      code: "console.log('1');\nfetch('/api').then(() => console.log('2'));\nconsole.log('3');",
      options: [
        { text: '1, 3, 2', correct: true },
        { text: '1, 2, 3', why: '`then` сработает, только когда придёт ответ, — после всего синхронного кода.' },
        { text: '3, 1, 2', why: 'Синхронный код выполняется по порядку: сначала 1, потом 3.' },
        { text: '2, 1, 3', why: 'Ответ сети не может прийти раньше, чем выполнится первая строка.' },
      ],
      explain: 'Синхронные строки выполняются сразу, а колбэк из `then` — позже, когда Promise выполнится.',
    },
    {
      id: 'async-3',
      type: 'order',
      question: 'Загрузка данных в эффекте: расставь по порядку.',
      items: [
        'Рендер: на экране «Загрузка…»',
        'Эффект отправил запрос',
        'Пришёл ответ, флаг ignore ещё false',
        'Вызван setProduct(data)',
        'Новый рендер: на экране товар',
        'Компонент удалили — очистка ставит ignore = true',
      ],
      explain:
        'Сначала рендер с заглушкой, потом эффект, ответ, сеттер и новый рендер. Очистка — перед повтором эффекта и при удалении компонента.',
    },
    {
      id: 'async-4',
      type: 'choice',
      question: 'Где делать запрос, который отправляет форму поиска?',
      options: [
        { text: 'В обработчике отправки формы', correct: true },
        { text: 'В useEffect без массива зависимостей', why: 'Такой эффект запустится после каждого рендера, а не по нажатию кнопки.' },
        { text: 'Прямо в теле компонента', why: 'Рендер должен быть чистым: запрос уходил бы на каждой перерисовке.' },
        { text: 'В useState', why: 'useState хранит значение, а не выполняет запросы.' },
      ],
      explain: 'Запрос, вызванный действием пользователя, живёт в обработчике этого действия.',
    },
    {
      id: 'async-5',
      type: 'bug',
      question: 'При быстром переключении товаров иногда показывается не тот. Где не хватает защиты?',
      code: 'useEffect(() => {\n  fetchProduct(productId).then(data => {\n    setProduct(data);\n  });\n}, [productId]);',
      bugLine: 3,
      fix: 'if (!ignore) setProduct(data); — и в очистке return () => { ignore = true; }',
      explain: 'Старый ответ может прийти позже нового и перезаписать его. Нужен флаг ignore, который очистка эффекта ставит в true.',
    },
    {
      id: 'async-6',
      type: 'fill',
      question: 'Допиши асинхронную функцию.',
      code: "___ function load() {\n  const response = ___ fetch('/api/bats');\n  return response.json();\n}",
      answers: ['async', 'await'],
      bank: ['async', 'await', 'then', 'return', 'yield'],
      explain: '`async` перед функцией разрешает внутри `await`, а `await` ждёт, пока Promise выполнится.',
    },
    {
      id: 'async-7',
      type: 'sort',
      question: 'Где делать запрос?',
      bins: ['В эффекте', 'В обработчике'],
      items: [
        { text: 'Загрузить профиль при открытии страницы', bin: 0 },
        { text: 'Отправить форму поиска', bin: 1 },
        { text: 'Подписаться на чат, когда компонент появился', bin: 0 },
        { text: 'Сохранить заметку по кнопке «Сохранить»', bin: 1 },
        { text: 'Загрузить товары при смене категории в пропсах', bin: 0 },
        { text: 'Удалить товар по клику', bin: 1 },
      ],
      explain:
        'Нужно, потому что компонент на экране или сменились пропсы, — эффект. Нужно, потому что пользователь что-то сделал, — обработчик.',
    },
    {
      id: 'async-8',
      type: 'choice',
      question: "Почему `use(fetch('/api/product'))` прямо в теле компонента — плохая идея?",
      options: [
        { text: 'Promise будет новым на каждом рендере', correct: true },
        { text: 'use не умеет работать с промисами', why: 'Умеет — для этого он и создан.' },
        { text: 'fetch нельзя вызывать в React-проекте', why: 'Можно — в эффектах, обработчиках или заранее.' },
        { text: 'Suspense запрещает запросы', why: 'Suspense только показывает запасной вид, пока данные в пути.' },
      ],
      explain:
        'Каждый рендер создаёт новый Promise, и React снова ждёт. Promise создают заранее и передают пропом или берут из библиотеки с кэшем.',
    },
  ],

  explain: {
    prompt: 'Объясни Лунатику: как загрузить данные с сервера в компонент и не показать устаревший ответ?',
    starters: ['Запрос делают в…', 'Пока ждём ответ…', 'Чтобы старый ответ не затёр новый…'],
    keywords: [
      { label: 'Запрос в useEffect или в обработчике', words: ['useeffect', 'эффект', 'обработчик'] },
      { label: 'Загрузка и ошибка — в пропсы', words: ['загрузк', 'isloading', 'ошибк', 'error', 'пропс'] },
      { label: 'Флаг ignore в очистке против гонки', words: ['ignore', 'очистк', 'abort', 'гонк', 'устаревш'] },
    ],
    model:
      'Запрос при появлении компонента делают в useEffect, а по действию пользователя — в обработчике. Пока ответ в пути, состояние хранит isLoading, при сбое — error, и всё это вниз передаётся пропсами. Чтобы старый ответ не затёр новый, в очистке эффекта ставят флаг ignore = true и не вызывают сеттер для устаревшего ответа.',
  },
};
