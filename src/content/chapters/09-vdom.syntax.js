// Разбор кода и схемы к карточкам пещеры 9 «Зеркальный грот».
export default {
  'DOM — живое дерево страницы': {
    scheme: {
      type: 'compare',
      left: { title: 'Императивно — вручную', items: ['найди элемент', 'поменяй текст', 'добавь класс', 'не забудь убрать старое'] },
      right: {
        title: 'Декларативно — React',
        tone: 'main',
        items: ['опиши результат: `<h1 className="active">{title}</h1>`', 'React сам найдёт разницу', 'и поменяет только её'],
      },
    },
    why: '`document.querySelector` находит первый элемент по CSS-селектору. `textContent` заменяет его текст, `classList.add` добавляет класс. Каждая строка — команда «сделай вот это»: так выглядит императивный стиль.',
    alt: [
      {
        code: "const title = document.getElementById('title');\ntitle.textContent = 'Привет, Граф!';",
        note: 'Поиск по `id` — тот же императивный подход.',
      },
    ],
    wrong: [
      {
        code: "function Header({ name }) {\n  document.querySelector('h1').textContent = name;\n  return <h1>Пещеры</h1>;\n}",
        why: 'Ручная правка DOM внутри компонента спорит с React: он о ней не знает и при следующем рендере вернёт своё. Показывай данные через JSX: `<h1>{name}</h1>`.',
      },
      {
        code: 'title.innerHTML = userInput;',
        why: '`innerHTML` с текстом от пользователя — дыра в безопасности (XSS): чужой HTML и скрипты попадут на страницу. JSX экранирует текст сам.',
      },
    ],
  },
  'Виртуальный DOM — отражение страницы': {
    scheme: {
      type: 'tree',
      title: 'Отражение списка в памяти',
      root: {
        name: "{ type: 'ul' }",
        note: 'корень отражения',
        tone: 'main',
        children: [
          { name: "{ type: ProductCard, key: 's' }", note: "props: { name: 'Сыр' }" },
          { name: "{ type: ProductCard, key: 'm' }", note: "props: { name: 'Молоко' }" },
        ],
      },
    },
    why: "Сборщик превращает тег в вызов `jsx('h1', { className, children })`, а тот возвращает объект: `type` — что рисовать, `key` — имя в списке, `props` — всё остальное. `{name}` стал `children`.",
    alt: [
      {
        code: "import { createElement } from 'react';\n\nconst element = createElement('h1', { className: 'title' }, name);",
        note: '`createElement` создаёт тот же объект без JSX.',
      },
    ],
    wrong: [
      {
        code: 'document.body.appendChild(<h1>Граф</h1>);',
        why: 'Элемент — описание, а не DOM-узел: `appendChild` выбросит TypeError. В DOM элементы выводит React: `createRoot(container).render(<h1>Граф</h1>)`.',
      },
    ],
  },
  'Рендер, согласование, фиксация': {
    scheme: {
      type: 'steps',
      title: 'Три шага обновления',
      steps: [
        { title: 'Причина', sub: 'сеттер · рендер родителя · новый контекст', tone: 'gold' },
        { title: 'Рендер', sub: 'вызов компонентов → новое дерево элементов', tone: 'main' },
        { title: 'Согласование', sub: 'сравнение со старым деревом, список отличий' },
        { title: 'Фиксация', sub: 'точечные правки настоящего DOM', tone: 'good' },
        { title: 'Браузер рисует, затем эффекты' },
      ],
    },
    why: '`console.log` в теле компонента срабатывает на каждом рендере — так видно, что компонент вызвали. Но в DOM меняется только `<p>`: остальные элементы в новом дереве совпали со старыми.',
    alt: [
      {
        code: "useEffect(() => {\n  console.log('фиксация прошла: DOM обновлён');\n});",
        note: 'Эффект без зависимостей запускается после каждой фиксации — когда DOM уже изменён.',
      },
    ],
    wrong: [
      {
        code: 'function handleClick() {\n  setCount(count + 1);\n  console.log(count); // ждём новое значение\n}',
        why: 'Сеттер не меняет переменную сразу: `count` — снимок этого рендера. Новое значение будет в следующем рендере.',
      },
    ],
  },
  'Как React сравнивает деревья': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Тот же тип',
        tone: 'good',
        items: ['`<Panel role="user" />` → `<Panel role="admin" />`', 'узел остаётся', 'меняется только проп', 'состояние живо'],
      },
      right: {
        title: 'Другой тип',
        tone: 'bad',
        items: ['`<UserPanel />` → `<AdminPanel />`', 'старое поддерево удалено', 'новое создано с нуля', 'состояние потеряно'],
      },
    },
    why: 'В первой строке тернарный оператор выбирает ЗНАЧЕНИЕ пропа — тип остаётся `Panel`, и React лишь обновит проп. Во второй выбирается сам КОМПОНЕНТ — на одном месте оказываются разные типы.',
    alt: [
      {
        code: "<Panel key={isAdmin ? 'admin' : 'user'} role={isAdmin ? 'admin' : 'user'} />",
        note: 'Нужно нарочно начать с чистого листа — смени `key`: тот же тип, но для React это новый элемент.',
      },
    ],
    wrong: [
      {
        code: '{isWide ? (\n  <div className="wide"><SearchForm /></div>\n) : (\n  <SearchForm />\n)}',
        why: 'В одной ветке форма внутри `<div>`, в другой — нет. Дерево меняет форму, React пересоздаёт `SearchForm`, и набранный текст пропадает. Держи структуру одинаковой и меняй только `className`.',
      },
    ],
  },
  'Пакетные обновления': {
    scheme: {
      type: 'steps',
      steps: [
        { title: 'Клик' },
        { title: 'Три сеттера — в очередь', code: "setName('') · setAge(0) · setError(null)", tone: 'gold' },
        { title: 'Обработчик закончился' },
        { title: 'Один рендер со всеми изменениями', tone: 'main' },
        { title: 'Одна фиксация в DOM', tone: 'good' },
      ],
    },
    why: 'React ждёт, пока обработчик закончится, и только потом обрабатывает очередь обновлений — одним рендером. Внутри обработчика `count` — константа текущего рендера, поэтому `console.log` показывает старое значение.',
    alt: [
      {
        code: 'function handleClick() {\n  const next = count + 1;\n  setCount(next);\n  console.log(next); // новое значение\n}',
        note: 'Нужно новое значение прямо сейчас — посчитай его в переменной.',
      },
      {
        code: "import { flushSync } from 'react-dom';\n\nflushSync(() => setCount(c => c + 1));\n// здесь DOM уже обновлён",
        note: '`flushSync` заставляет обновить DOM сразу. Нужен редко — например, чтобы прокрутить к только что добавленному элементу.',
      },
    ],
    wrong: [
      {
        code: 'function handleSave() {\n  setName(input);\n  sendToServer(name); // уйдёт СТАРОЕ имя\n}',
        why: '`name` ещё старый — новое значение будет только в следующем рендере. Отправляй то, что точно знаешь: `sendToServer(input)`.',
      },
    ],
  },
  'Что даёт виртуальный DOM и чего не даёт': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Мифы',
        tone: 'bad',
        items: ['React перерисовывает всю страницу', 'виртуальный DOM быстрее любой ручной правки', 'рендер = изменение экрана'],
      },
      right: {
        title: 'Как на самом деле',
        tone: 'good',
        items: ['в DOM попадает только разница', 'ручная правка быстрее, но сложнее и опаснее', 'рендер может закончиться без правок DOM'],
      },
    },
  },
};
