// Пещера 11. Грот самоцветов: children, слоты и композиция.
export default {
  id: 'children',
  order: 11,
  icon: '💎',
  color: '#c084fc',
  cave: 'Грот самоцветов',
  title: 'children и композиция',
  goal: 'Освоить children, слоты и композицию — как вкладывать компоненты друг в друга.',
  breakRound: 'truths',

  pretest: {
    question: 'Как называется проп, в который попадает всё между `<Card>` и `</Card>`?',
    options: [{ text: '`children`', correct: true }, { text: '`content`' }, { text: '`inner`' }, { text: '`body`' }],
    explain: 'Содержимое между тегами React кладёт в особый проп `children`.',
  },

  lesson: [
    {
      title: 'Что между тегами — то children',
      body: ['Всё, что ты кладёшь между открывающим и закрывающим тегом, React передаёт в особый проп [[children|children]].'],
      code: '<Card>\n  <h2>Сыр</h2>\n  <p>Осталось 2 шт.</p>\n</Card>\n\nfunction Card({ children }) {\n  return <div className="card">{children}</div>;\n}',
      highlight: [6, 7],
      key: "`children` — обычный проп. `<Card>Текст</Card>` — это `jsx(Card, { children: 'Текст' })`.",
    },
    {
      title: 'Каким бывает children',
      body: [
        "- строка: `<B>Привет</B>` → `'Привет'`;",
        '- один элемент: `<B><i /></B>` → объект-элемент;',
        '- несколько детей — массив: `<B><i /><i /></B>`;',
        '- ничего: `<B />` → [[undefined|undefined]];',
        '- даже функция — это [[render-prop|рендер-проп]].',
        'Поэтому с children обычно ничего не делают, а просто вставляют туда, где им место.',
      ],
    },
    {
      title: 'Рамка и содержимое: композиция',
      body: [
        '[[composition|Композиция]]: компонент даёт **рамку**, а содержимое решает родитель. Окно ошибки не знает, какой текст в нём лежит, — поэтому подходит для любых сообщений.',
      ],
      diagram: 'modal',
      code: 'function ErrorModal({ isOpen, title = \'Ошибка\',\n  onClose, children }) {\n  if (!isOpen) return null;\n  return (\n    <div className="modal">\n      <h2>{title}</h2>\n      {children}\n      <button onClick={onClose}>Понятно</button>\n    </div>\n  );\n}',
      highlight: [7],
      key: 'Вместо десятка пропсов «на все случаи» дай компоненту children — пусть родитель сам решит, что внутри.',
    },
    {
      title: 'Слоты: несколько мест с именами',
      body: ['Если мест для содержимого несколько, передай JSX в обычных пропсах — это [[slot|слоты]].'],
      code: '<Layout\n  header={<Header />}\n  sidebar={<FilterPanel />}\n>\n  <ProductList />\n</Layout>\n\nfunction Layout({ header, sidebar, children }) {\n  return (\n    <div className="layout">\n      <header>{header}</header>\n      <aside>{sidebar}</aside>\n      <main>{children}</main>\n    </div>\n  );\n}',
    },
    {
      title: 'Компонент в пропсе и рендер-проп',
      body: ['В проп можно передать сам компонент (функцию) или функцию, которая возвращает JSX.'],
      code: '// компонент в пропсе — переименуй с большой буквы\nfunction Button({ icon: Icon, children }) {\n  return <button><Icon /> {children}</button>;\n}\n<Button icon={BatIcon}>Лететь</Button>\n\n// рендер-проп: «дам данные — нарисуй сам»\n<ProductList\n  renderItem={p => <b>{p.name}</b>} />',
      highlight: [2],
      key: 'Передал компонент (`BatIcon`) — рисуй его как `<Icon />`, переименовав в имя с большой буквы. Иначе JSX примет его за HTML-тег.',
    },
    {
      title: 'Объект — не ребёнок',
      body: ['Объект нельзя положить в children напрямую — React не знает, как его нарисовать.'],
      code: "const user = { name: 'Аня' };\n\n<p>{user}</p>\n// Error: Objects are not valid as a React child\n\n<p>{user.name}</p> // ✅ рисуем строку",
      highlight: [3],
      key: 'Рисовать можно строки, числа, элементы и массивы. `null`, `undefined`, `true` и `false` рисуют пустоту. Объект — нельзя.',
    },
  ],

  spell: {
    text: 'Что между тегами — то children.',
    meaning: 'Содержимое тега — это проп [[children|children]], такой же, как остальные.',
  },

  practice: [
    {
      id: 'children-1',
      type: 'choice',
      question: 'Что придёт в `children`?',
      code: '<Bat>Кусь!</Bat>',
      options: [
        { text: "Строка `'Кусь!'`", correct: true },
        { text: '`undefined`', why: 'Между тегами есть текст — он и есть children.' },
        { text: "Массив `['Кусь!']`", why: 'Один текстовый ребёнок — это просто строка, без массива.' },
        { text: 'Ошибка', why: 'Текст внутри компонента — совершенно нормальный случай.' },
      ],
      explain: 'Один ребёнок приходит как есть, несколько — массивом.',
    },
    {
      id: 'children-2',
      type: 'bug',
      question: 'Найди строку с ошибкой.',
      code: 'function Panel({ title, children }) {\n  return (\n    <section>\n      <h2>{title}</h2>\n      <div>{props.children}</div>\n    </section>\n  );\n}',
      bugLine: 5,
      fix: '<div>{children}</div>',
      explain: 'Переменной `props` нет — пропсы уже распакованы в параметрах. Используй `children` напрямую.',
    },
    {
      id: 'children-3',
      type: 'truefalse',
      statement: '`<Card children="Привет" />` и `<Card>Привет</Card>` дают компоненту одинаковый проп `children`.',
      answer: true,
      explain: 'children — обычный проп. Запись между тегами — просто удобный синтаксис для того же самого.',
    },
    {
      id: 'children-4',
      type: 'choice',
      question: 'Что нарисует этот код?',
      code: 'function Box({ children }) {\n  return <div>{children}</div>;\n}\n\n<Box />',
      options: [
        { text: 'Пустой `<div>`', correct: true },
        { text: 'Текст «undefined»', why: 'undefined в JSX ничего не рисует.' },
        { text: 'Ошибку', why: 'Отсутствие children — нормальная ситуация.' },
        { text: 'Ничего, даже div', why: 'div компонент возвращает в любом случае.' },
      ],
      explain: 'children равен undefined, а undefined в JSX превращается в пустоту.',
    },
    {
      id: 'children-5',
      type: 'match',
      question: 'Соедини понятие и смысл.',
      pairs: [
        ['`children`', 'То, что между тегами'],
        ['Слот `header={…}`', 'Именованное место для JSX'],
        ['Рендер-проп', 'Функция, возвращающая JSX'],
        ['Композиция', 'Сборка из вложенных компонентов'],
      ],
      explain: 'Все четыре приёма решают одну задачу: родитель решает, что окажется внутри.',
    },
    {
      id: 'children-6',
      type: 'fill',
      question: 'Компонент получил иконку-компонент в пропе `icon`. Нарисуй её.',
      code: 'function Button({ icon: ___, label }) {\n  return <button><___ /> {label}</button>;\n}',
      answers: ['Icon', 'Icon'],
      bank: ['Icon', 'Icon', 'icon', 'props'],
      explain: 'Переменная с компонентом должна начинаться с большой буквы, иначе `<icon />` станет HTML-тегом.',
    },
    {
      id: 'children-7',
      type: 'choice',
      question: 'Что произойдёт?',
      code: "const product = { name: 'Сыр', count: 2 };\n\n<p>{product}</p>",
      options: [
        { text: 'Ошибка «Objects are not valid as a React child»', correct: true },
        { text: 'На экране появится `[object Object]`', why: 'React не превращает объект в строку — он выбрасывает ошибку.' },
        { text: 'Выведется JSON объекта', why: 'Для этого нужно явно вызвать JSON.stringify.' },
        { text: 'Ничего не выведется', why: 'Пустоту рисуют только null, undefined и булевы значения.' },
      ],
      explain: 'Нарисуй нужное поле: `{product.name}` — или собери разметку из полей.',
    },
    {
      id: 'children-8',
      type: 'sort',
      question: 'Можно ли положить это в JSX как ребёнка?',
      bins: ['Можно', 'Нельзя'],
      items: [
        { text: "Строка `'Текст'`", bin: 0 },
        { text: 'Число `42`', bin: 0 },
        { text: 'Элемент `<b>жирно</b>`', bin: 0 },
        { text: "Объект `{ name: 'Сыр' }`", bin: 1 },
        { text: '`null` (ничего не нарисует)', bin: 0 },
        { text: 'Объект даты `new Date()`', bin: 1 },
      ],
      explain: 'Объекты (включая даты) рисовать нельзя — превращай их в строку: `date.toLocaleDateString()`.',
    },
  ],

  explain: {
    prompt: 'Объясни Лунатику: что такое children и зачем окну ошибки children вместо пропа `text`?',
    starters: ['children — это…', 'Это обычный…', 'Так окно…'],
    keywords: [
      { label: 'children — содержимое между тегами', words: ['между', 'тег'] },
      { label: 'Это обычный проп', words: ['проп'] },
      { label: 'Гибкость: внутри может быть что угодно', words: ['родител', 'любой', 'любое', 'гибк', 'что угодно'] },
    ],
    model:
      'children — проп, в который попадает всё, что написано между открывающим и закрывающим тегом. Окно с children — это рамка: родитель сам решает, что положить внутрь — текст, список или кнопку повтора. Одно окно подходит для любых сообщений.',
  },
};
