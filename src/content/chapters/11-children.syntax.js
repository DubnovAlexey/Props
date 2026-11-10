// Разбор кода и схемы к карточкам пещеры 11. Ключ — заголовок карточки.
export default {
  'Что между тегами — то children': {
    scheme: {
      type: 'steps',
      steps: [
        { title: 'Родитель кладёт содержимое между тегами', code: '<Card><h2>Сыр</h2></Card>' },
        { title: 'React кладёт его в проп `children`', code: '{ children: <h2>Сыр</h2> }', arrow: 'props' },
        { title: 'Card ставит `{children}` туда, где нужно', code: '<div className="card">{children}</div>', tone: 'main' },
      ],
    },
    why: '`children` — обычный проп с особым способом передачи: содержимое пишут между открывающим и закрывающим тегом. `{children}` в JSX вставляет его на место.',
    alt: [
      {
        code: 'function Card(props) {\n  return <div className="card">{props.children}</div>;\n}',
        note: 'Без деструктуризации — `props.children`.',
      },
      { code: '<Card children={<h2>Сыр</h2>} />', note: 'Можно передать и атрибутом. Работает, но между тегами читается привычнее.' },
    ],
    wrong: [
      {
        code: 'function Card() {\n  return <div className="card" />;\n}',
        why: 'Забыли `{children}` — всё, что положили между тегами, молча пропадёт.',
      },
      {
        code: 'function Card({ child }) {\n  return <div>{child}</div>;\n}',
        why: 'Имя пропа — только `children` (во множественном числе). `child` будет undefined.',
      },
    ],
  },
  'Каким бывает children': {
    scheme: {
      type: 'compare',
      left: { title: 'Рисуется', tone: 'good', items: ['строка и число', 'элемент JSX', 'массив элементов'] },
      right: {
        title: 'Не рисуется',
        tone: 'gold',
        items: ['`null`, `undefined` — пусто', '`true`, `false` — пусто', 'обычный объект `{}` — ошибка'],
      },
    },
  },
  'Рамка и содержимое: композиция': {
    why: '`ErrorModal` — рамка: она умеет открываться, показывать заголовок и закрываться, но не знает, что внутри. Содержимое приходит через `children`, поэтому одну рамку можно использовать для любых сообщений. `return null` — «ничего не рисовать».',
    alt: [
      {
        code: '<ErrorModal isOpen={error !== null} onClose={() => setError(null)}>\n  {error}\n</ErrorModal>',
        note: 'Типичное использование: текст ошибки — это children, а флаг открытия считается из состояния.',
      },
    ],
    wrong: [
      {
        code: 'function ErrorModal({ isOpen }) {\n  if (!isOpen) return null;\n  const [shake, setShake] = useState(false);\n}',
        why: 'Хук после раннего `return` вызывается не на каждом рендере — порядок хуков ломается. Сначала все хуки, потом условия.',
      },
      {
        code: '<button onClick={onClose()}>Понятно</button>',
        why: 'Скобки вызывают `onClose` во время рендера — окно закроется сразу после открытия. Нужно `onClick={onClose}`.',
      },
    ],
  },
  'Слоты: несколько мест с именами': {
    scheme: {
      type: 'tree',
      root: {
        name: 'Layout',
        note: 'рамка с тремя слотами',
        tone: 'main',
        children: [
          { name: 'header', note: '← `<Header />`' },
          { name: 'aside', note: '← `<FilterPanel />`' },
          { name: 'main', note: '← children: `<ProductList />`' },
        ],
      },
    },
    why: 'Когда «дырка» одна — хватает `children`. Когда их несколько, JSX передают обычными пропсами с понятными именами: проп может хранить что угодно, в том числе элемент.',
    alt: [
      {
        code: 'function Layout({ header, sidebar, children }) {\n  return (\n    <div className="layout">\n      <header>{header}</header>\n      {sidebar && <aside>{sidebar}</aside>}\n      <main>{children}</main>\n    </div>\n  );\n}',
        note: 'Необязательный слот: не передали `sidebar` — блока `<aside>` не будет.',
      },
    ],
    wrong: [
      {
        code: '<Layout header={Header} />\n// внутри: <header>{header}</header>',
        why: 'Передали функцию-компонент, а не элемент. Функцию нельзя нарисовать — React предупредит «Functions are not valid as a React child». Нужно `header={<Header />}`.',
      },
    ],
  },
  'Компонент в пропсе и рендер-проп': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Компонент в пропсе',
        items: ['`icon={BatIcon}` — без скобок `<>`', 'ребёнок сам рисует `<Icon />`', 'может дать свои пропсы: `<Icon size={16} />`'],
      },
      right: {
        title: 'Рендер-проп',
        tone: 'main',
        items: ['`renderItem={p => <b>{p.name}</b>}`', 'ребёнок вызывает: `renderItem(product)`', '«дам данные — нарисуй сам»'],
      },
    },
    why: 'Переименование `icon: Icon` при деструктуризации нужно из-за правила JSX: тег с маленькой буквы — HTML, с большой — компонент. Рендер-проп — функция, которую ребёнок вызывает со своими данными, а вид результата решает родитель.',
    alt: [
      {
        code: '<Button icon={<BatIcon />}>Лететь</Button>\n\nfunction Button({ icon, children }) {\n  return <button>{icon} {children}</button>;\n}',
        note: 'Если пропсы иконке не нужны, проще передать готовый элемент и вставить `{icon}`.',
      },
      {
        code: '<ProductList>\n  {p => <b>{p.name}</b>}\n</ProductList>\n// внутри: products.map(p => children(p))',
        note: 'Функцию можно передать и через children — тот же рендер-проп.',
      },
    ],
    wrong: [
      {
        code: 'function Button({ icon }) {\n  return <button><icon /></button>;\n}',
        why: '`<icon />` с маленькой буквы — это HTML-тег, а не твой компонент. React предупредит о неизвестном теге.',
      },
      {
        code: '<Button icon={<BatIcon />} />\n// внутри: <Icon />',
        why: 'Передали элемент, а рисуют как компонент. `<Icon />` ждёт функцию — будет ошибка «Element type is invalid».',
      },
    ],
  },
  'Объект — не ребёнок': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Можно рисовать',
        tone: 'good',
        items: ['строки и числа', 'элементы JSX', 'массивы элементов', '`null` и `false` — пусто'],
      },
      right: {
        title: 'Нельзя',
        tone: 'bad',
        items: ["обычный объект `{ name: 'Аня' }`", 'дату `new Date()`', 'функцию, если её не вызвали'],
      },
    },
    why: "React умеет рисовать строки, числа, элементы и массивы. Обычный объект он показать не может — непонятно, как превратить `{ name: 'Аня' }` в текст. Достань нужное поле.",
    alt: [
      { code: '<pre>{JSON.stringify(user, null, 2)}</pre>', note: 'Для отладки объект можно превратить в строку и посмотреть целиком.' },
    ],
    wrong: [{ code: '<p>{new Date()}</p>', why: 'Дата — тоже объект: та же ошибка. Преврати в строку: `{date.toLocaleDateString()}`.' }],
  },
};
