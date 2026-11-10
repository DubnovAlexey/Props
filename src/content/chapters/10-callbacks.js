// Пещера 10. Пещера эха: функции в пропсах и подъём состояния.
export default {
  id: 'callbacks',
  order: 10,
  icon: '🔔',
  color: '#fb923c',
  cave: 'Пещера эха',
  title: 'Функции в пропсах и подъём состояния',
  goal: 'Научиться передавать функции в пропсах, чтобы дети сообщали родителю о событиях.',
  breakRound: 'truths',

  pretest: {
    question: 'Ребёнок хочет сообщить родителю, что нажали «Удалить». Как?',
    options: [
      { text: 'Вызвать функцию, которую родитель передал пропом', correct: true },
      { text: 'Изменить проп родителя' },
      { text: 'Никак — дети с родителями не общаются' },
      { text: 'Записать данные в глобальную переменную' },
    ],
    explain: 'Родитель даёт ребёнку функцию, ребёнок её вызывает — так событие «поднимается» вверх.',
  },

  lesson: [
    {
      title: 'Колокольчик для родителя',
      body: [
        'Родитель даёт ребёнку функцию — [[callback|колбэк]]. Когда что-то случается, ребёнок «звонит в колокольчик»: вызывает её и передаёт данные.',
      ],
      diagram: 'flow',
      code: "function ProductList({ products }) {\n  function handleDelete(id) {\n    console.log('удалить', id);\n  }\n  return products.map(p => (\n    <ProductCard key={p.id} product={p}\n      onDelete={handleDelete} />\n  ));\n}\n\nfunction ProductCard({ product, onDelete }) {\n  return (\n    <button onClick={() => onDelete(product.id)}>\n      Удалить {product.name}\n    </button>\n  );\n}",
      highlight: [7, 13],
      key: 'Данные — вниз, события — вверх. Ребёнок не меняет данные родителя, а сообщает ему о событии.',
    },
    {
      title: 'Имена: onЧто-то и handleЧто-то',
      body: [
        'Договорённость: проп-функция называется `onDelete`, `onSearch`, `onClose` («когда удаляют»), а функция-[[event-handler|обработчик]] в родителе — `handleDelete` («обработать удаление»).',
      ],
      code: '<SearchForm onSearch={handleSearch} />\n<ErrorModal onClose={handleClose} />',
      key: '`on…` — в пропсах, `handle…` — внутри компонента. По имени сразу видно, кто кого вызывает.',
    },
    {
      title: 'Передай функцию, а не её вызов',
      body: [
        'Самая частая ошибка — лишние круглые скобки. `onClick={handleClick()}` вызывает функцию **сразу при рендере** и передаёт её результат.',
        'Нужен аргумент — оберни вызов в [[arrow-function|стрелочную функцию]].',
      ],
      code: '// ✅ передаём функцию\n<button onClick={handleClick}>Ок</button>\n\n// ✅ нужен аргумент — стрелочная обёртка\n<button onClick={() => onDelete(id)}>×</button>\n\n// ❌ вызов во время рендера!\n<button onClick={onDelete(id)}>×</button>',
      highlight: [8],
      key: 'Если «вызов при рендере» меняет состояние, получится бесконечный цикл и ошибка «Too many re-renders».',
    },
    {
      title: 'Подъём состояния',
      body: [
        'Если двум соседям нужны одни данные, храни их у ближайшего общего родителя — это [[lifting-state|подъём состояния]]. Родитель передаёт вниз и значение, и функцию для его изменения.',
      ],
      diagram: 'lifting',
      code: "function FridgePage({ products }) {\n  const [query, setQuery] = useState('');\n  const visible = products.filter(p =>\n    p.name.includes(query));\n  return (\n    <>\n      <SearchBar query={query}\n        onQueryChange={setQuery} />\n      <ProductList products={visible} />\n    </>\n  );\n}",
      key: 'Соседи не передают пропсы друг другу. Общие данные живут у общего родителя.',
    },
    {
      title: 'Объект события',
      body: [
        'Обработчик DOM-события получает [[event|объект события]] `e`. Из него берут значение поля и отменяют действие браузера по умолчанию.',
      ],
      code: 'function SearchBar({ query, onQueryChange }) {\n  return (\n    <input value={query}\n      onChange={e => onQueryChange(e.target.value)} />\n  );\n}\n\nfunction Form({ onSearch }) {\n  function handleSubmit(e) {\n    e.preventDefault(); // без перезагрузки\n    onSearch();\n  }\n  return <form onSubmit={handleSubmit}>…</form>;\n}',
      highlight: [4, 10],
    },
  ],

  spell: {
    text: 'Данные — вниз, события — вверх; функцию передай, а не вызывай!',
    meaning: '`onClick={handleClick}` — передал. `onClick={handleClick()}` — вызвал во время рендера.',
  },

  practice: [
    {
      id: 'callbacks-1',
      type: 'bug',
      question: 'Найди строку с ошибкой.',
      code: 'function Card({ product, onDelete }) {\n  return (\n    <button onClick={onDelete(product.id)}>\n      Удалить\n    </button>\n  );\n}',
      bugLine: 3,
      fix: '<button onClick={() => onDelete(product.id)}>',
      explain:
        '`onDelete(product.id)` вызывается во время рендера, а в onClick попадает её результат (undefined). Оберни вызов в стрелочную функцию.',
    },
    {
      id: 'callbacks-2',
      type: 'choice',
      question: 'Как по соглашению назвать проп, через который форма сообщает о поиске?',
      options: [
        { text: '`onSearch`', correct: true },
        { text: '`handleSearch`', why: '`handle…` — имя обработчика внутри родителя, а проп называют `on…`.' },
        { text: '`searchFunction`', why: 'Работать будет, но это не общепринятое имя.' },
        { text: '`doSearch`', why: 'Работать будет, но нарушает соглашение `on…`.' },
      ],
      explain: '`<SearchForm onSearch={handleSearch} />` — проп `on…`, обработчик `handle…`.',
    },
    {
      id: 'callbacks-3',
      type: 'fill',
      question: 'Допиши: ребёнок сообщает родителю id удаляемого продукта.',
      code: '<button onClick={___ => ___(product.id)}>',
      answers: ['()', 'onDelete'],
      bank: ['()', 'onDelete', 'handleDelete', 'product', 'e()'],
      hint: 'Внутри ребёнка функция называется так же, как проп.',
      explain:
        'Стрелочная функция `() => onDelete(product.id)` вызовет проп только при клике. `handleDelete` живёт в родителе — ребёнок о ней не знает.',
    },
    {
      id: 'callbacks-4',
      type: 'truefalse',
      statement: 'Два соседних компонента могут передать друг другу пропсы напрямую.',
      answer: false,
      explain: 'Пропсы передаёт только родитель своим детям. Общие данные соседей поднимают в общего родителя.',
    },
    {
      id: 'callbacks-5',
      type: 'order',
      question: 'Подъём состояния: расставь шаги.',
      items: [
        'Найти ближайшего общего родителя двух компонентов',
        'Перенести `useState` в этого родителя',
        'Передать вниз значение пропсом',
        'Передать вниз функцию для изменения',
        'Дети вызывают функцию вместо своего сеттера',
      ],
      explain: 'Состояние «переезжает» наверх, а дети получают значение и колбэк.',
    },
    {
      id: 'callbacks-6',
      type: 'choice',
      question: 'Что выведет консоль при первом рендере?',
      code: "function App() {\n  function hello() {\n    console.log('Привет');\n  }\n  return <button onClick={hello()}>Жми</button>;\n}",
      options: [
        { text: '«Привет» — сразу, ещё до клика', correct: true },
        { text: 'Ничего, пока не нажмут кнопку', why: '`hello()` с круглыми скобками выполняется во время рендера.' },
        { text: '«Привет» при каждом клике', why: 'В onClick попал результат `hello()` — undefined, поэтому клик ничего не делает.' },
        { text: 'Синтаксическую ошибку', why: 'Синтаксис верный — ошибка логическая.' },
      ],
      explain: 'Скобки после имени функции — это вызов. Правильно: `onClick={hello}`.',
    },
    {
      id: 'callbacks-7',
      type: 'match',
      question: 'Соедини запись и её смысл.',
      pairs: [
        ['`onDelete`', 'Проп-функция «когда удаляют»'],
        ['`handleDelete`', 'Обработчик в родителе'],
        ['`e.target.value`', 'Текст из поля ввода'],
        ['`e.preventDefault()`', 'Отменить действие браузера'],
      ],
      explain: 'Эти четыре записи встречаются почти в каждом React-приложении.',
    },
    {
      id: 'callbacks-8',
      type: 'input',
      question: 'Как называется приём, когда общие данные переносят в ближайшего общего родителя? Два слова.',
      answers: ['подъём состояния', 'подъем состояния', 'lifting state up', 'lifting state'],
      loose: true,
      explain: 'Подъём состояния (lifting state up) — базовый приём React для общих данных.',
    },
  ],

  explain: {
    prompt: 'Объясни Лунатику: как ребёнок может сообщить родителю о клике?',
    starters: ['Родитель передаёт…', 'Ребёнок вызывает…', 'Важно не…'],
    keywords: [
      { label: 'Родитель передаёт функцию пропом', words: ['функци', 'колбэк', 'проп'] },
      { label: 'Ребёнок вызывает её при событии', words: ['вызыва', 'клик', 'событи'] },
      { label: 'Передавать функцию, а не её вызов', words: ['скобк', 'стрелоч', '=>', 'не вызов', 'без вызова'] },
    ],
    model:
      'Родитель передаёт ребёнку функцию в пропсе, например onDelete. Ребёнок вызывает её при событии — onClick={() => onDelete(id)} — и так сообщает родителю, что случилось. Передавать нужно саму функцию или стрелочную обёртку, а не её вызов.',
  },
};
