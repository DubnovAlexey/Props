// Разбор кода и схемы к карточкам пещеры 1. Ключ — заголовок карточки.
export default {
  'Что такое React и зачем сборщик': {
    scheme: {
      type: 'steps',
      title: 'Путь кода до экрана',
      steps: [
        { title: 'Ты пишешь JSX', code: '<Card title="Сыр" />' },
        { title: 'Vite переводит его в JavaScript', code: "jsx(Card, { title: 'Сыр' })", tone: 'main' },
        { title: 'Браузер выполняет обычный JS' },
        { title: 'React рисует страницу', tone: 'good' },
      ],
    },
    why: '`npm create vite@latest` скачивает шаблон проекта. `npm install` ставит библиотеки из `package.json` в папку `node_modules`. `npm run dev` запускает команду `dev` из `package.json` — сервер разработки, который обновляет страницу при каждом сохранении. Строки после `#` — комментарии терминала.',
    alt: [
      {
        code: 'npm i\nnpm run build    # готовая сборка в папке dist\nnpm run preview  # посмотреть сборку локально',
        note: '`npm i` — короткая запись `npm install`. `build` собирает оптимизированную версию для публикации.',
      },
    ],
    wrong: [
      {
        code: '<script src="App.jsx"></script>',
        why: 'Браузер не понимает JSX: подключить .jsx напрямую нельзя — будет синтаксическая ошибка. Код должен пройти через сборщик.',
      },
      {
        code: 'npm run start',
        why: 'В шаблоне Vite нет команды `start` — npm ответит «Missing script: start». Команды смотри в разделе scripts файла package.json.',
      },
    ],
  },
  'Что где лежит в проекте': {
    scheme: {
      type: 'tree',
      title: 'Папка проекта',
      root: {
        name: 'my-app/',
        tone: 'main',
        children: [
          { name: 'index.html', note: 'страница с пустым #root' },
          { name: 'package.json', note: 'библиотеки и команды' },
          { name: 'node_modules/', note: 'скачанные библиотеки — руками не трогаем' },
          {
            name: 'src/',
            children: [
              { name: 'main.jsx', note: 'точка входа', tone: 'gold' },
              { name: 'App.jsx', note: 'корень дерева компонентов' },
              { name: 'components/', note: 'остальные компоненты' },
            ],
          },
        ],
      },
    },
    why: '`<div id="root">` — пустая коробка: React положит туда весь интерфейс. `type="module"` разрешает в скрипте `import` и `export`. Путь `/src/main.jsx` указывает на точку входа.',
    alt: [
      {
        code: '<div id="app"></div>\n\n// main.jsx\ncreateRoot(document.getElementById(\'app\'));',
        note: 'Имя контейнера любое — главное, чтобы оно совпадало в index.html и main.jsx.',
      },
    ],
    wrong: [
      {
        code: '<script src="/src/main.jsx"></script>',
        why: 'Без `type="module"` браузер не разрешит `import` внутри файла: «Cannot use import statement outside a module».',
      },
    ],
  },
  'Модули: import и export': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Экспорт по умолчанию',
        items: ['`export default function Card()`', 'один на файл', '`import Card from …` — без скобок, имя любое'],
      },
      right: {
        title: 'Именованный экспорт',
        tone: 'main',
        items: ['`export const MAX = 99`', 'сколько угодно', '`import { MAX } from …` — в скобках, имя точное'],
      },
    },
    why: '`export default` помечает главное, что отдаёт файл, — обычно компонент. Именованный `export` — для остального: констант, хуков, утилит. В строке `import ProductCard, { MAX_COUNT }` сначала идёт экспорт по умолчанию, потом в скобках — именованные.',
    alt: [
      {
        code: "import { MAX_COUNT as LIMIT } from './ProductCard.jsx';\nimport * as utils from './utils.js';",
        note: '`as` переименовывает при импорте, `* as` собирает все именованные экспорты в один объект.',
      },
    ],
    wrong: [
      {
        code: "import { ProductCard } from './ProductCard.jsx';",
        why: 'ProductCard экспортирован по умолчанию, а скобки ищут именованный экспорт с таким именем. Его нет — сборщик выдаст ошибку.',
      },
      {
        code: 'export default const MAX = 99;',
        why: 'После `export default` не пишут `const` — синтаксическая ошибка. Можно `export default 99` или `export const MAX = 99`.',
      },
    ],
  },
  'Точка входа: createRoot и StrictMode': {
    scheme: {
      type: 'steps',
      title: 'Как приложение оживает',
      steps: [
        { title: 'index.html загружает точку входа', code: '<script type="module" src="/src/main.jsx">' },
        { title: 'createRoot находит контейнер', code: "document.getElementById('root')", tone: 'main' },
        { title: 'render рисует дерево', code: '<StrictMode><App /></StrictMode>' },
        { title: 'React вызывает App и всех детей', sub: 'дальше — только пропсы и состояние', tone: 'good' },
      ],
    },
    why: '`createRoot` берёт DOM-элемент и создаёт в нём «корень» React, а `.render(…)` рисует туда JSX. `StrictMode` оборачивает приложение и включает проверки в режиме разработки. Запятая после `</StrictMode>` — висячая запятая после последнего аргумента: она разрешена и упрощает правки.',
    alt: [
      {
        code: "const root = createRoot(document.getElementById('root'));\nroot.render(<App />);",
        note: 'Корень можно сохранить в переменную. StrictMode не обязателен, но в разработке сильно помогает.',
      },
    ],
    wrong: [
      {
        code: "import ReactDOM from 'react-dom';\n\nReactDOM.render(<App />, document.getElementById('root'));",
        why: '`ReactDOM.render` удалён в React 19. Используй `createRoot` из `react-dom/client`.',
      },
      {
        code: "createRoot(document.getElementById('root')).render(App);",
        why: 'Передали функцию-компонент, а нужен элемент `<App />`. Экран останется пустым, а React предупредит, что функции рендерить нельзя.',
      },
    ],
  },
  'Один компонент — один файл': {
    scheme: {
      type: 'tree',
      title: 'Папка компонента',
      root: {
        name: 'src/',
        children: [
          {
            name: 'components/ProductCard/',
            tone: 'main',
            children: [
              { name: 'ProductCard.jsx', note: 'компонент, export default' },
              { name: 'ProductCard.module.css', note: 'стили только этого компонента' },
              { name: 'ProductCard.test.jsx', note: 'тесты рядом с кодом' },
            ],
          },
          { name: 'App.jsx', note: "import ProductCard from './components/…'" },
        ],
      },
    },
    why: "`import styles from './ProductCard.module.css'` — CSS-модуль: классы из файла становятся свойствами объекта `styles` и не пересекаются с классами других компонентов. Путь `./components/…` считается от `App.jsx`.",
    alt: [
      {
        code: "// src/components/ProductCard/index.js\nexport { default } from './ProductCard.jsx';\n\n// App.jsx\nimport ProductCard from './components/ProductCard';",
        note: 'Файл `index.js` в папке позволяет импортировать по имени папки. Удобно, но это лишний файл — выбери один стиль на проект.',
      },
    ],
    wrong: [
      {
        code: "import ProductCard from 'components/ProductCard.jsx';",
        why: 'Без `./` или `../` путь считается именем библиотеки из node_modules — сборщик не найдёт файл.',
      },
    ],
  },
  'React DevTools: пропсы под лупой': {
    scheme: {
      type: 'steps',
      title: 'Как посмотреть пропсы',
      steps: [
        { title: 'Установи расширение React Developer Tools', sub: 'Chrome, Firefox или Edge' },
        { title: 'Открой страницу и нажми F12' },
        { title: 'Вкладка ⚛️ Components', tone: 'main' },
        { title: 'Выбери компонент в дереве', sub: 'справа — props, state и hooks' },
        { title: 'Поменяй проп — экран обновится', tone: 'good' },
      ],
    },
  },
};
