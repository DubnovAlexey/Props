// Пещера 1. Костровой грот: как устроен React-проект — снаряжение перед спуском.
// Без этой пещеры непонятно, откуда берутся import в примерах, кто вызывает App
// и где посмотреть пропсы вживую.
export default {
  id: 'setup',
  order: 1,
  icon: '🔥',
  color: '#ef6f4a',
  cave: 'Костровой грот',
  title: 'Как устроен React-проект',
  goal: 'Понять, из чего состоит React-проект, как он запускается и как модули связывают компоненты между собой.',
  breakRound: 'truths',

  pretest: {
    question: 'Как браузер «узнаёт» о твоём компоненте App?',
    options: [
      { text: 'Файл main.jsx находит элемент #root и рендерит в нём `<App />`', correct: true },
      { text: 'Браузер сам находит все .jsx-файлы' },
      { text: 'App подключают в index.html тегом `<App>`' },
      { text: 'Через CSS' },
    ],
    explain: "Точка входа — main.jsx: `createRoot(document.getElementById('root')).render(<App />)`. Дальше React сам рендерит всё дерево.",
  },

  lesson: [
    {
      title: 'Что такое React и зачем сборщик',
      body: [
        '[[react|React]] — библиотека: она превращает компоненты в страницу и обновляет её, когда меняются данные.',
        'Браузер не понимает JSX, поэтому нужен [[bundler|сборщик]], например [[vite|Vite]]. Он переводит JSX в обычный JavaScript, собирает файлы вместе и на лету обновляет страницу, пока ты пишешь код.',
        'Библиотеки ставят через [[npm|npm]], а их список хранится в файле `package.json`.',
      ],
      code: '# создать проект на React\nnpm create vite@latest my-app -- --template react\ncd my-app\nnpm install   # скачать библиотеки\nnpm run dev   # запустить сервер разработки',
      codeTitle: 'Терминал',
      highlight: [2, 5],
      key: 'React рисует интерфейс, Vite переводит JSX и собирает проект, npm приносит библиотеки. Это три разных инструмента — не путай их.',
    },
    {
      title: 'Что где лежит в проекте',
      body: [
        'Типичный проект на Vite:',
        '- `index.html` — почти пустая страница с одним контейнером `<div id="root">`;',
        '- `package.json` — список библиотек и команд (`dev`, `build`);',
        '- `src/main.jsx` — [[entry-point|точка входа]]: отсюда React начинает работу;',
        '- `src/App.jsx` — корневой [[component|компонент]], от него растёт всё дерево;',
        '- `src/components/` — остальные компоненты, обычно по одному в файле.',
      ],
      code: '<body>\n  <div id="root"></div>\n  <script type="module" src="/src/main.jsx"></script>\n</body>',
      codeTitle: 'index.html',
      highlight: [2],
      key: 'В index.html нет твоего интерфейса — только пустой `#root`. Всю разметку туда положит React.',
    },
    {
      title: 'Модули: import и export',
      body: [
        'Каждый файл — отдельный [[module|модуль]]. Что модуль отдаёт наружу, помечают словом `export`, а забирают — словом `import`.',
        'Экспорт бывает [[default-export|по умолчанию]] — один на файл, импортируется без фигурных скобок и под любым именем — и [[named-export|именованный]]: таких сколько угодно, импортируются в фигурных скобках по точному имени.',
      ],
      code: "// ProductCard.jsx\nexport default function ProductCard({ name }) {\n  return <li>{name}</li>;\n}\nexport const MAX_COUNT = 99;\n\n// App.jsx\nimport ProductCard, { MAX_COUNT } from './ProductCard.jsx';\nimport { useState } from 'react';",
      highlight: [2, 5, 8, 9],
      key: 'Фигурные скобки в import — для именованного экспорта, без скобок — для экспорта по умолчанию. Путь без `./` (`react`) — библиотека, путь с `./` — твой файл.',
    },
    {
      title: 'Точка входа: createRoot и StrictMode',
      body: [
        'В `main.jsx` React находит контейнер `#root` и рисует в нём `<App />` — это [[create-root|createRoot]]. Единственное место, где React «прикрепляется» к странице: дальше он сам рендерит всё дерево.',
        '[[strict-mode|StrictMode]] — режим проверок для разработки. Он вызывает компоненты и эффекты дважды, чтобы ошибки вроде нечистого рендера или забытой очистки проявились сразу. В готовой сборке двойных вызовов нет.',
      ],
      code: "import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App.jsx';\n\ncreateRoot(document.getElementById('root')).render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n);",
      codeTitle: 'src/main.jsx',
      highlight: [5, 6],
      key: '`react` — компоненты и хуки, `react-dom` — связь с браузером. `createRoot` вызывают один раз на всё приложение.',
    },
    {
      title: 'Один компонент — один файл',
      body: [
        'Компоненты удобно держать по одному в файле с тем же именем: `ProductCard.jsx` экспортирует `ProductCard`. Имя файла — с большой буквы, как и имя компонента.',
        'Файлы с JSX получают расширение `.jsx` (или `.tsx` для TypeScript) — так и сборщик, и редактор понимают, что внутри разметка.',
        'Связанное кладут рядом, в одну папку: компонент, его стили и тесты. Так проще найти и переиспользовать.',
      ],
      code: "// src/components/ProductCard/ProductCard.jsx\nimport styles from './ProductCard.module.css';\n\nexport default function ProductCard({ name }) {\n  return <li className={styles.card}>{name}</li>;\n}\n\n// src/App.jsx\nimport ProductCard from './components/ProductCard/ProductCard.jsx';",
      highlight: [2, 9],
      key: 'Путь в import считают от файла, где он написан: `./` — та же папка, `../` — на уровень выше.',
    },
    {
      title: 'React DevTools: пропсы под лупой',
      body: [
        '[[devtools|React DevTools]] — расширение для браузера. Вкладка Components показывает дерево компонентов, а у выбранного — его пропсы, состояние и хуки. Пропс там можно даже поменять и сразу увидеть результат.',
        'Вкладка Profiler записывает рендеры и показывает, какой компонент сколько раз перерисовался и почему.',
        'Второй помощник — консоль браузера (F12). React пишет туда предупреждения с подсказками, например о пропущенном `key`.',
      ],
      key: 'Не понимаешь, какие пропсы пришли в компонент, — не гадай: открой DevTools и посмотри.',
    },
  ],

  spell: {
    text: 'npm приносит, Vite собирает, createRoot в #root App сажает.',
    meaning: '[[npm|npm]] ставит библиотеки, [[vite|Vite]] собирает проект, [[create-root|createRoot]] прикрепляет React к странице.',
  },

  practice: [
    {
      id: 'setup-1',
      type: 'truefalse',
      statement: 'Браузер умеет выполнять JSX напрямую, без сборщика.',
      answer: false,
      explain: 'JSX — не JavaScript. Сборщик (Vite) переводит его в вызовы `jsx()` до того, как код попадёт в браузер.',
    },
    {
      id: 'setup-2',
      type: 'choice',
      question: 'Как импортировать то, что экспортировано так: `export default function Card() {}`?',
      options: [
        { text: "`import Card from './Card.jsx'`", correct: true },
        { text: "`import { Card } from './Card.jsx'`", why: 'Фигурные скобки — для именованного экспорта, а здесь экспорт по умолчанию.' },
        { text: "`import default Card from './Card.jsx'`", why: 'Слово default в import не пишут.' },
        { text: "`require Card from './Card.jsx'`", why: 'Такого синтаксиса нет.' },
      ],
      explain: 'Экспорт по умолчанию импортируют без скобок и под любым именем.',
    },
    {
      id: 'setup-3',
      type: 'match',
      question: 'Соедини файл и его роль.',
      pairs: [
        ['`index.html`', 'Страница с пустым #root'],
        ['`main.jsx`', 'Точка входа: createRoot'],
        ['`App.jsx`', 'Корневой компонент'],
        ['`package.json`', 'Список библиотек и команд'],
        ['`node_modules`', 'Скачанные библиотеки'],
      ],
      explain:
        'index.html даёт контейнер, main.jsx прикрепляет к нему React, App — корень дерева, package.json и node_modules — библиотеки.',
    },
    {
      id: 'setup-4',
      type: 'fill',
      question: 'Допиши точку входа.',
      code: "import { ___ } from 'react-dom/client';\nimport App from './App.jsx';\n\ncreateRoot(document.getElementById('___')).render(<App />);",
      answers: ['createRoot', 'root'],
      bank: ['createRoot', 'root', 'render', 'app', 'useState'],
      explain: '`createRoot` импортируют из `react-dom/client`, а id контейнера должен совпадать с `<div id="root">` в index.html.',
    },
    {
      id: 'setup-5',
      type: 'sort',
      question: 'Как это импортировать?',
      bins: ['В фигурных скобках', 'Без скобок'],
      items: [
        { text: '`export default function App()`', bin: 1 },
        { text: '`export function useToggle()`', bin: 0 },
        { text: '`export const MAX = 99`', bin: 0 },
        { text: '`export default memo(Card)`', bin: 1 },
        { text: '`useState` из библиотеки react', bin: 0 },
        { text: '`export { Card as default }`', bin: 1 },
      ],
      explain:
        'Именованный экспорт — в скобках по точному имени. Экспорт по умолчанию — без скобок. `export { Card as default }` — тоже экспорт по умолчанию.',
    },
    {
      id: 'setup-6',
      type: 'bug',
      question: 'Сборщик пишет, что в Card.jsx нет экспорта по умолчанию. Какая строка виновата?',
      code: "// Card.jsx\nexport function Card() {\n  return <div>Карта</div>;\n}\n\n// App.jsx\nimport Card from './Card.jsx';",
      bugLine: 7,
      fix: "import { Card } from './Card.jsx';",
      explain:
        'Card экспортирован как именованный, значит, импортировать его нужно в фигурных скобках. Без скобок import ищет экспорт по умолчанию, а его нет.',
    },
    {
      id: 'setup-7',
      type: 'choice',
      question: 'Зачем StrictMode вызывает компоненты дважды?',
      options: [
        { text: 'Чтобы нечистый рендер и забытая очистка проявились сразу', correct: true },
        { text: 'Чтобы приложение работало быстрее', why: 'Двойные вызовы только замедляют — поэтому они есть лишь в разработке.' },
        { text: 'Это ошибка React', why: 'Это намеренная проверка.' },
        {
          text: 'Чтобы показать компонент на экране два раза',
          why: 'На экране компонент один: результат второго вызова — проверка, его не показывают.',
        },
      ],
      explain: 'Если компонент чистый, двойной вызов ничего не меняет. Если нет — ошибка видна сразу, а не через месяц у пользователей.',
    },
    {
      id: 'setup-8',
      type: 'input',
      question: 'Какая команда запускает сервер разработки в проекте на Vite?',
      answers: ['npm run dev'],
      placeholder: 'команда',
      explain: '`npm run dev` запускает команду `dev` из раздела scripts файла package.json.',
    },
  ],

  explain: {
    prompt: 'Объясни Лунатику: как React-приложение попадает на страницу?',
    starters: ['В index.html есть…', 'Файл main.jsx…', 'Дальше React…'],
    keywords: [
      { label: 'В index.html — пустой контейнер #root', words: ['root', 'контейнер', 'пуст'] },
      { label: 'main.jsx: createRoot и render(<App />)', words: ['createroot', 'main', 'render', 'точка входа', 'точку входа'] },
      { label: 'React сам рендерит дерево от App', words: ['дерев', 'app', 'вложен', 'компонент'] },
    ],
    model:
      'В index.html есть только пустой контейнер <div id="root">. Файл main.jsx — точка входа: createRoot находит этот контейнер и рендерит в нём <App />. Дальше React сам вызывает App и все вложенные компоненты, передаёт им пропсы и строит из них страницу.',
  },
};
