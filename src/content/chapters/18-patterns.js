// Пещера 18. Подземная мастерская: формы, условный рендер и паттерны с пропсами.
export default {
  id: 'patterns',
  order: 18,
  icon: '🛠️',
  color: '#fb7185',
  cave: 'Подземная мастерская',
  title: 'Формы и паттерны',
  goal: 'Освоить управляемые и неуправляемые поля, условный рендер и популярные паттерны с пропсами.',
  breakRound: 'attrs',

  pretest: {
    question: 'Что покажет `{count && <Badge />}`, если `count = 0`?',
    options: [{ text: 'Цифру 0 на экране', correct: true }, { text: 'Ничего' }, { text: 'Компонент Badge' }, { text: 'Ошибку' }],
    explain: '`0 && …` возвращает 0, а число React рисует. Ловушка, на которую попадаются все!',
  },

  lesson: [
    {
      title: 'Управляемое поле: главный — React',
      body: [
        '[[controlled|Управляемое]] поле получает значение из состояния через проп `value` и сообщает об изменениях через `onChange`.',
      ],
      code: "function DishInput() {\n  const [dish, setDish] = useState('');\n  return (\n    <input\n      value={dish}\n      onChange={e => setDish(e.target.value)}\n    />\n  );\n}",
      highlight: [5, 6],
      key: '`value` без `onChange` «замораживает» поле: ввод не работает, а React предупреждает в консоли.',
    },
    {
      title: 'Неуправляемое поле: значение живёт в DOM',
      body: [
        '[[uncontrolled|Неуправляемое]] поле хранит значение само. Стартовое значение задаёт `defaultValue`, а прочитать его можно через [[ref|ref]] или из формы при отправке.',
      ],
      code: 'function QuickForm({ onSearch }) {\n  function handleSubmit(e) {\n    e.preventDefault();\n    const data = new FormData(e.currentTarget);\n    onSearch(data.get(\'dish\'));\n  }\n  return (\n    <form onSubmit={handleSubmit}>\n      <input name="dish" defaultValue="Омлет" />\n      <button>Искать</button>\n    </form>\n  );\n}',
      highlight: [9],
      key: '`value` + `onChange` — управляемое поле. `defaultValue` — неуправляемое. Не смешивай их в одном поле.',
    },
    {
      title: 'Условный рендер и ловушка с нулём',
      body: ['[[conditional|Условный рендер]]: `if`, тернарный оператор `a ? b : c` и запись `cond && <X />`.'],
      code: '{isLoading ? <Spinner /> : <List />}\n{error && <ErrorModal isOpen>{error}</ErrorModal>}\n\n// ❌ при count = 0 на экране появится «0»\n{count && <Badge count={count} />}\n\n// ✅\n{count > 0 && <Badge count={count} />}',
      highlight: [5],
      key: 'Слева от `&&` ставь настоящее true/false: `count > 0`, `items.length > 0`, `Boolean(x)`.',
    },
    {
      title: 'Компонент может ничего не рисовать',
      body: [
        'Иногда компонент по пропсам решает, что рисовать нечего, и возвращает [[null|null]]. Так устроен `ExpiryBadge` в «Умном холодильнике».',
      ],
      code: 'function ExpiryBadge({ daysLeft }) {\n  if (daysLeft < 0) return <span>Просрочено</span>;\n  if (daysLeft <= 2) return <span>Скоро истекает</span>;\n  return null; // срок в порядке — плашки нет\n}',
      highlight: [4],
    },
    {
      title: 'HOC — обёртка для компонента',
      body: [
        '[[hoc|HOC]] — функция, которая принимает компонент и возвращает новый, добавляя ему пропсы или поведение. Сейчас чаще используют хуки, но HOC встречаются в старом коде и библиотеках.',
      ],
      code: "function withRole(Component, role) {\n  return function Guarded(props) {\n    if (props.user?.role !== role) {\n      return <p>Доступ запрещён</p>;\n    }\n    return <Component {...props} />;\n  };\n}\n\nconst AdminPanel = withRole(Panel, 'ADMIN');",
      highlight: [6],
      key: 'HOC обязан пробросить пропсы дальше: `{...props}`. Иначе обёрнутый компонент их потеряет.',
    },
    {
      title: 'Пропсы в Kosmo: игрок видит только своё',
      body: [
        'В игре «Преферанс» движок знает все карты, а интерфейс получает только **вид игрока**: свои карты и количество карт у соперников. `OpponentSeat` физически не может подсмотреть чужие карты — их нет в его пропсах.',
      ],
      code: 'function OpponentSeat({ name, cardCount }) {\n  return (\n    <div className="seat">\n      <b>{name}</b>\n      {Array.from({ length: cardCount }, (_, i) =>\n        <CardBack key={i} />)}\n    </div>\n  );\n}',
      highlight: [1],
      key: 'Пропсы — ещё и граница безопасности: компонент знает ровно то, что ему передали.',
    },
  ],

  spell: {
    text: 'value и onChange — неразлучная пара, как Граф и его плащ.',
    meaning: 'Управляемое поле: значение — из состояния, изменения — через [[event-handler|обработчик]].',
  },

  practice: [
    {
      id: 'patterns-1',
      type: 'choice',
      question: 'Что появится на экране, если `count = 0`?',
      code: '<div>{count && <Badge />}</div>',
      options: [
        { text: '`0`', correct: true },
        { text: 'Ничего', why: '0 — «ложное» значение, && вернёт его, а число React нарисует.' },
        { text: 'Компонент Badge', why: 'Правая часть && не вычисляется, если левая «ложная».' },
        { text: 'Ошибка', why: 'Ошибки нет — просто лишний 0 на экране.' },
      ],
      explain: 'Пиши `{count > 0 && <Badge />}` — слева от && должно быть настоящее true/false.',
    },
    {
      id: 'patterns-2',
      type: 'bug',
      question: 'Почему в поле нельзя ничего ввести?',
      code: "function Search() {\n  const [q, setQ] = useState('');\n  return <input value={q} />;\n}",
      bugLine: 3,
      fix: 'return <input value={q} onChange={e => setQ(e.target.value)} />;',
      explain: '`value` без `onChange` делает поле только для чтения: React каждый раз возвращает в него пустую строку из состояния.',
    },
    {
      id: 'patterns-3',
      type: 'sort',
      question: 'Управляемое это поле или неуправляемое?',
      bins: ['Управляемое', 'Неуправляемое'],
      items: [
        { text: '`value={name}` + `onChange`', bin: 0 },
        { text: '`defaultValue="Омлет"`', bin: 1 },
        { text: 'Значение читаем через ref при отправке', bin: 1 },
        { text: 'Каждая буква сразу сохраняется в состоянии', bin: 0 },
        { text: '`checked={agree}` + `onChange`', bin: 0 },
        { text: 'Данные берём из `FormData`', bin: 1 },
      ],
      explain: 'Управляемое: источник правды — состояние React. Неуправляемое: источник правды — сам DOM-элемент.',
    },
    {
      id: 'patterns-4',
      type: 'choice',
      question: 'Как правильно переписать `{items.length && <List />}`?',
      options: [
        { text: '`{items.length > 0 && <List />}`', correct: true },
        { text: '`{items && <List />}`', why: 'Пустой массив — «истинный» объект, List нарисуется и без элементов.' },
        { text: '`{!items.length && <List />}`', why: 'Это обратное условие: список покажется, только когда он пуст.' },
        { text: 'Ничего менять не нужно', why: 'При пустом массиве на экране появится 0.' },
      ],
      explain: 'Сравнение `> 0` даёт настоящее булево значение, и 0 на экран не попадёт.',
    },
    {
      id: 'patterns-5',
      type: 'truefalse',
      statement: 'HOC должен передать пропсы оборачиваемому компоненту, например через `{...props}`.',
      answer: true,
      explain: 'Иначе обёрнутый компонент не получит пропсы, которые ему передали снаружи.',
    },
    {
      id: 'patterns-6',
      type: 'choice',
      question: 'Компоненту нечего рисовать. Как правильно?',
      options: [
        { text: '`return null;`', correct: true },
        { text: '`return {};`', why: 'Объект не является допустимым ребёнком — будет ошибка.' },
        { text: '`throw new Error()`', why: 'Ошибка уронит интерфейс до ближайшего Error Boundary.' },
        { text: 'Вернуть пустой `<div />`', why: 'Сработает, но засоряет DOM лишним элементом.' },
      ],
      explain: '`null` — явный и общепринятый способ сказать «здесь ничего нет».',
    },
    {
      id: 'patterns-7',
      type: 'order',
      question: 'Расставь шаги работы управляемого поля.',
      items: [
        'Пользователь вводит букву',
        'Срабатывает `onChange` с объектом события',
        'Вызывается `setDish(e.target.value)`',
        'Компонент перерисовывается с новым `dish`',
        'Поле получает `value={dish}`',
      ],
      explain: 'Каждый символ проходит через состояние — поэтому React всегда знает, что в поле.',
    },
    {
      id: 'patterns-8',
      type: 'match',
      question: 'Соедини запись и паттерн.',
      pairs: [
        ['`value` + `onChange`', 'Управляемое поле'],
        ['`defaultValue`', 'Неуправляемое поле'],
        ['`withRole(Component)`', 'HOC'],
        ['`return null`', 'Ничего не рисовать'],
      ],
      explain: 'Все четыре приёма часто встречаются в реальных проектах.',
    },
  ],

  explain: {
    prompt: 'Объясни Лунатику: чем управляемое поле отличается от неуправляемого?',
    starters: ['Управляемое поле…', 'Значение хранится…', 'А неуправляемое…'],
    keywords: [
      { label: 'Управляемое: value + onChange', words: ['value', 'onchange'] },
      { label: 'Значение хранится в состоянии React', words: ['состоян', 'state', 'usestate'] },
      { label: 'Неуправляемое: defaultValue / ref, значение в DOM', words: ['defaultvalue', 'ref', 'dom', 'formdata'] },
    ],
    model:
      'Управляемое поле получает значение из состояния через value и сообщает об изменениях через onChange — источник правды у React. Неуправляемое хранит значение само в DOM: стартовое задают через defaultValue, а читают через ref или FormData при отправке.',
  },
};
