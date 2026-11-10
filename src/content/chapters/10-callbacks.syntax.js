// Разбор кода и схемы к карточкам пещеры 10. Ключ — заголовок карточки.
export default {
  'Колокольчик для родителя': {
    why: 'Родитель передаёт вниз ФУНКЦИЮ `handleDelete` под именем `onDelete`. Ребёнок не знает, что она делает, — он просто «звонит в колокольчик» и передаёт данные: `onDelete(product.id)`. Стрелка `() => …` нужна, чтобы вызов случился при клике, а не во время рендера.',
    alt: [
      {
        code: 'function ProductCard({ product, onDelete }) {\n  function handleClick() {\n    onDelete(product.id);\n  }\n  return <button onClick={handleClick}>Удалить</button>;\n}',
        note: 'Своя функция-обработчик вместо стрелки в JSX — удобно, когда в обработчике несколько строк.',
      },
    ],
    wrong: [
      {
        code: '<button onClick={onDelete(product.id)}>\n  Удалить\n</button>',
        why: 'Скобки после имени вызывают функцию сразу — во время рендера. Удаление случится без клика, и для каждой карточки.',
      },
      {
        code: 'function ProductCard({ products, index }) {\n  products.splice(index, 1);\n}',
        why: 'Ребёнок не меняет данные родителя сам: это мутация чужого пропа. Нужно попросить родителя — вызвать его функцию.',
      },
    ],
  },
  'Имена: onЧто-то и handleЧто-то': {
    scheme: {
      type: 'compare',
      left: {
        title: '`on…` — имя пропа',
        items: ['что случилось: `onSearch`, `onClose`', 'так называют атрибут у ребёнка', 'как `onClick` у кнопки'],
      },
      right: {
        title: '`handle…` — имя функции',
        tone: 'main',
        items: ['кто обрабатывает: `handleSearch`', 'живёт у родителя', 'передаётся в `on…`-проп'],
      },
    },
    why: 'Для своих компонентов React не требует особых имён — это договорённость. `on` говорит «вот событие», `handle` — «вот кто его обрабатывает». Код читается как предложение: «при поиске — обработай поиск».',
    alt: [
      {
        code: '<SearchForm onSearch={query => setQuery(query)} />',
        note: 'Можно передать стрелку прямо в проп, без отдельной функции `handle…`.',
      },
    ],
    wrong: [
      {
        code: '<button onclick={handleClick}>Ок</button>',
        why: 'У DOM-элементов события пишутся в camelCase: `onClick`. Со строчными буквами React выдаст предупреждение, и обработчик не сработает.',
      },
      {
        code: '<SearchForm onsearch={handleSearch} />\n\nfunction SearchForm({ onSearch }) { … }',
        why: 'Имя пропа должно совпадать буква в букву: передали `onsearch`, а читаем `onSearch` — получим undefined.',
      },
    ],
  },
  'Передай функцию, а не её вызов': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Функция — вызовет потом',
        tone: 'good',
        items: ['`onClick={handleClick}`', '`onClick={() => onDelete(id)}`', 'React вызовет при клике'],
      },
      right: {
        title: 'Вызов — сработает сейчас',
        tone: 'bad',
        items: ['`onClick={onDelete(id)}`', 'выполнится во время рендера', 'в `onClick` попадёт результат — обычно undefined'],
      },
    },
    why: '`onClick` ждёт функцию, которую React вызовет ПОТОМ — при клике. Имя без скобок — это сама функция. Имя со скобками — вызов прямо сейчас. Нужен аргумент — заверни вызов в стрелку.',
    alt: [
      {
        code: '<button onClick={handleDelete.bind(null, id)}>×</button>',
        note: '`bind` тоже создаёт новую функцию с готовым аргументом. Работает, но стрелка понятнее.',
      },
    ],
    wrong: [
      {
        code: '<button onClick={setCount(count + 1)}>+</button>',
        why: 'Изменение состояния во время рендера вызовет новый рендер, тот снова вызовет сеттер… React остановит это ошибкой «Too many re-renders».',
      },
      {
        code: '<button onClick={() => onDelete}>×</button>',
        why: 'Стрелка возвращает функцию, но не вызывает её — по клику ничего не произойдёт. Нужно `() => onDelete(id)`.',
      },
    ],
  },
  'Подъём состояния': {
    why: 'Строка поиска нужна двоим соседям: поле её меняет, список по ней фильтрует. Соседи не видят друг друга, поэтому состояние живёт у ближайшего общего родителя — `FridgePage`. Вниз идут данные (`query`, `visible`), вверх — вызовы (`onQueryChange`).',
    alt: [
      {
        code: '<SearchBar\n  query={query}\n  onQueryChange={q => setQuery(q.trim())}\n/>',
        note: 'Сеттер можно обернуть и, например, обрезать пробелы перед сохранением.',
      },
    ],
    wrong: [
      {
        code: "function SearchBar() {\n  const [query, setQuery] = useState('');\n  // ProductList об этом query не узнает\n}",
        why: 'Если состояние спрятано в поле, список не может по нему фильтровать. Общие данные поднимают к общему родителю.',
      },
    ],
  },
  'Объект события': {
    scheme: {
      type: 'tree',
      title: 'Что лежит в объекте события',
      root: {
        name: 'e',
        note: 'объект события',
        tone: 'main',
        children: [
          { name: 'e.target', note: 'элемент, где всё случилось: e.target.value — текст поля' },
          { name: 'e.currentTarget', note: 'элемент, на котором висит обработчик' },
          { name: 'e.preventDefault()', note: 'отменить действие браузера по умолчанию' },
          { name: 'e.stopPropagation()', note: 'не пускать событие выше, к родителям' },
        ],
      },
    },
    why: 'React передаёт в обработчик объект события `e`. `e.target` — элемент, на котором оно случилось, поэтому текст поля — `e.target.value`. `e.preventDefault()` отменяет действие браузера по умолчанию: форма не перезагрузит страницу.',
    alt: [
      {
        code: '<input onChange={(event) => onQueryChange(event.target.value)} />',
        note: 'Имя параметра любое: `e`, `event`, `evt` — это просто первый аргумент.',
      },
      {
        code: 'function Form({ onSearch }) {\n  return (\n    <form action={formData => onSearch(formData.get(\'q\'))}>\n      <input name="q" />\n    </form>\n  );\n}',
        note: 'В React 19 в `action` формы можно передать функцию: она получит FormData, и `preventDefault` не нужен.',
      },
    ],
    wrong: [
      {
        code: '<input onChange={e => onQueryChange(e.value)} />',
        why: 'У события нет `value` — значение лежит в элементе: `e.target.value`. Здесь всегда будет undefined.',
      },
      {
        code: 'function handleSubmit() {\n  onSearch();\n}\n\n<form onSubmit={handleSubmit}>',
        why: 'Без `e.preventDefault()` браузер отправит форму и перезагрузит страницу — состояние приложения пропадёт.',
      },
    ],
  },
};
