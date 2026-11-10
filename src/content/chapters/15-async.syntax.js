// Разбор кода и схемы к карточкам пещеры 15. Ключ — заголовок карточки.
export default {
  'Promise — обещание ответа': {
    scheme: {
      type: 'steps',
      title: 'Жизнь обещания',
      steps: [
        { title: 'Запрос отправлен', code: "fetch('/api/products')" },
        { title: 'Ожидание', sub: 'код идёт дальше, не дожидаясь ответа', tone: 'gold' },
        { title: 'Выполнено → then', sub: 'пришли данные', tone: 'good' },
        { title: 'или отклонено → catch', sub: 'сбой сети или брошенная ошибка', tone: 'bad' },
      ],
    },
    why: '`fetch` сразу возвращает Promise. `then` подписывает функцию на успешный результат, а каждый `then` возвращает новый Promise — поэтому их выстраивают цепочкой. `response.json()` тоже асинхронный: он читает тело ответа и превращает JSON в объект.',
    alt: [
      {
        code: "fetch('/api/products')\n  .then(r => r.json())\n  .then(setProducts)\n  .finally(() => setIsLoading(false));",
        note: 'Сеттер можно передать прямо в `then` — он получит данные. `finally` сработает при любом исходе.',
      },
    ],
    wrong: [
      {
        code: "const products = fetch('/api/products');\nproducts.map(p => p.name);",
        why: 'В переменной — Promise, а не массив: «products.map is not a function». Данные доступны только после `then` или `await`.',
      },
    ],
  },
  'async и await — ждать по-человечески': {
    scheme: {
      type: 'compare',
      left: { title: 'Цепочка then', items: ['`fetch(url).then(r => r.json())`', 'ошибки — `.catch(…)`', 'вложенность растёт'] },
      right: {
        title: 'async / await',
        tone: 'main',
        items: ['`const r = await fetch(url)`', 'ошибки — `try…catch`', 'читается сверху вниз'],
      },
    },
    why: '`async` делает функцию асинхронной: она всегда возвращает Promise. `await` приостанавливает её до ответа, не блокируя страницу. `throw new Error(…)` превращает плохой статус в ошибку, которую поймает `catch`.',
    alt: [
      {
        code: "const loadProducts = async () => {\n  const response = await fetch('/api/products');\n  return response.json();\n};",
        note: '`async` можно поставить и перед стрелкой.',
      },
    ],
    wrong: [
      {
        code: "function load() {\n  const response = await fetch('/api');\n}",
        why: '`await` работает только внутри `async`-функции или на верхнем уровне модуля — здесь синтаксическая ошибка.',
      },
      {
        code: 'const data = loadProducts();\nconsole.log(data.length); // undefined',
        why: 'async-функция возвращает Promise, а не данные. Нужно `await loadProducts()` внутри другой async-функции или `.then(…)`.',
      },
    ],
  },
  'Загрузка в эффекте': {
    scheme: {
      type: 'steps',
      title: 'Как флаг ignore спасает от гонки',
      steps: [
        { title: 'productId = 1 → запрос №1' },
        { title: 'productId = 2 → очистка эффекта №1', code: 'ignore₁ = true', tone: 'gold' },
        { title: 'Эффект №2 → запрос №2' },
        { title: 'Ответ №1 пришёл поздно — проигнорирован', tone: 'bad' },
        { title: 'Ответ №2 → setProduct', tone: 'good' },
      ],
    },
    why: '`let ignore = false` — у каждого запуска эффекта свой флаг (это замыкание!). Очистка старого запуска ставит его флаг в `true`, поэтому поздний ответ уже ничего не сломает. Зависимость `[productId]` перезапускает эффект при смене товара.',
    alt: [
      {
        code: "useEffect(() => {\n  const controller = new AbortController();\n  fetch(`/api/products/${productId}`, { signal: controller.signal })\n    .then(r => r.json())\n    .then(setProduct)\n    .catch(error => {\n      if (error.name !== 'AbortError') setError(error);\n    });\n  return () => controller.abort();\n}, [productId]);",
        note: '`AbortController` не просто игнорирует ответ, а отменяет сам запрос. Отмена приходит как ошибка `AbortError` — её отделяют от настоящих ошибок.',
      },
    ],
    wrong: [
      {
        code: 'useEffect(async () => {\n  setProduct(await fetchProduct(productId));\n}, [productId]);',
        why: 'Эффект не может быть async: он вернёт Promise вместо функции очистки, и React предупредит. Объяви async-функцию внутри эффекта и вызови её.',
      },
    ],
  },
  'Загрузка, ошибка, данные — в пропсах': {
    scheme: {
      type: 'tree',
      title: 'Кто ходит в сеть, а кто только рисует',
      root: {
        name: 'FridgePage',
        note: 'fetch, isLoading, error',
        tone: 'main',
        children: [
          { name: 'ProductList', down: 'products, isLoading', note: 'просто рисует' },
          { name: 'ErrorModal', down: 'isOpen, children', note: 'показывает текст ошибки' },
        ],
      },
    },
    why: 'Три `useState` — три независимых факта о запросе. Ранний `return` при ошибке показывает окно, иначе — список. Список получает данные и флаг загрузки пропсами и ничего не знает о сети.',
    alt: [
      {
        code: "const [request, setRequest] = useState({\n  status: 'loading', // 'loading' | 'error' | 'success'\n  data: [],\n  error: null,\n});",
        note: 'Можно хранить один объект со статусом — тогда невозможны противоречия вроде «загрузка и ошибка одновременно».',
      },
    ],
    wrong: [
      {
        code: '{error && <ErrorModal isOpen>{error}</ErrorModal>}',
        why: '`error` — объект Error, а объекты рисовать нельзя: «Objects are not valid as a React child». Показывай текст: `{error.message}`.',
      },
    ],
  },
  'Запрос по действию пользователя': {
    scheme: {
      type: 'steps',
      title: 'Поиск по кнопке',
      steps: [
        { title: 'Отправка формы', code: 'onSubmit={handleSubmit}' },
        { title: 'Включаем загрузку', code: 'setIsLoading(true)', tone: 'gold' },
        { title: 'Ждём ответ', code: 'await findRecipe(dish)' },
        { title: 'Результат — родителю', code: 'onFound(recipe)', tone: 'main' },
        { title: 'finally: выключаем загрузку', code: 'setIsLoading(false)', tone: 'good' },
      ],
    },
    why: '`async function handleSubmit` — обработчик тоже может ждать. Значение поля читаем в начале, до `await`, пока событие ещё свежее. `try…finally` гарантирует, что кнопка разблокируется даже при ошибке.',
    alt: [
      {
        code: "function handleSubmit(e) {\n  e.preventDefault();\n  const dish = new FormData(e.currentTarget).get('dish');\n  setIsLoading(true);\n  findRecipe(dish)\n    .then(onFound)\n    .finally(() => setIsLoading(false));\n}",
        note: 'То же без async/await — цепочкой `then` и `finally`.',
      },
    ],
    wrong: [
      {
        code: 'async function handleSubmit(e) {\n  const recipe = await findRecipe(dish);\n  e.preventDefault();\n}',
        why: '`preventDefault` после `await` опоздал: браузер уже отправил форму и перезагрузил страницу. Вызывай его первой строкой.',
      },
    ],
  },
  'React 19: use и Suspense': {
    scheme: {
      type: 'steps',
      title: 'Promise в пропсе',
      steps: [
        { title: 'Родитель создал Promise заранее', code: 'fetchProduct(id)' },
        { title: 'Передал его пропом', code: '<ProductInfo productPromise={…} />' },
        { title: 'use ждёт ответ', sub: 'Suspense показывает fallback', tone: 'gold' },
        { title: 'Promise выполнен — компонент рисуется с данными', tone: 'good' },
      ],
    },
    why: '`use(productPromise)` возвращает значение выполненного обещания. Пока оно в ожидании, компонент «приостанавливается», и React показывает `fallback` ближайшего `Suspense` выше по дереву.',
    alt: [
      {
        code: 'function Badge({ showTheme }) {\n  if (!showTheme) return null;\n  const theme = use(ThemeContext); // use — даже после условия\n  return <span className={theme}>★</span>;\n}',
        note: '`use` читает и контекст. В отличие от хуков, его можно вызывать после условий и в циклах.',
      },
    ],
    wrong: [
      {
        code: 'function ProductInfo({ id }) {\n  const product = use(fetch(`/api/products/${id}`).then(r => r.json()));\n}',
        why: 'Promise создаётся заново на каждом рендере — React предупредит о «некэшированном промисе». Создавай его заранее или бери из библиотеки с кэшем.',
      },
    ],
  },
};
