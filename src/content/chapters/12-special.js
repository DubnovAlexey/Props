// Пещера 12. Пещера ключей: особые пропсы key и ref и атрибуты DOM.
export default {
  id: 'special',
  order: 12,
  icon: '🗝️',
  color: '#fbbf24',
  cave: 'Пещера ключей',
  title: 'key, ref и атрибуты DOM',
  goal: 'Разобраться с особыми пропсами key и ref, а также с className, style и другими атрибутами.',
  breakRound: 'attrs',

  pretest: {
    question: 'Что получит компонент в `props.key`, если написать `<Item key="5" />`?',
    options: [{ text: '`undefined` — key не передаётся', correct: true }, { text: '`"5"`' }, { text: '`5`' }, { text: '`null`' }],
    explain: '`key` — служебный атрибут для React. В пропсы компонента он не попадает.',
  },

  lesson: [
    {
      title: 'key — бейджик для элементов списка',
      body: [
        'Когда рисуешь [[list-rendering|список]], каждому элементу нужен [[key|key]] — уникальный и стабильный «бейджик». По нему React понимает, какой элемент добавили, удалили или переставили.',
      ],
      diagram: 'tree',
      code: '<ul>\n  {products.map(p => (\n    <ProductCard key={p.id} product={p} />\n  ))}\n</ul>',
      highlight: [3],
      key: '`key` нужен React, а не тебе: внутрь компонента он не попадает. Нужен id внутри — передай его отдельно: `id={p.id}`.',
    },
    {
      title: 'Почему индекс — плохой ключ',
      body: [
        'Если список меняется (удаление, сортировка, вставка в начало), ключ-индекс «переезжает» на другой элемент, и состояние карточек путается: например, галочка оказывается у другого товара.',
        'Хороший ключ — id из данных. Индекс допустим, только если список никогда не меняется.',
      ],
      code: '// ❌ индекс: при удалении ключи «съедут»\nitems.map((item, i) => <Row key={i} />)\n\n// ✅ id из данных\nitems.map(item => <Row key={item.id} />)\n\n// ❌ случайный: новый на каждом рендере\nitems.map(item => <Row key={Math.random()} />)',
      key: 'Смена key = новый компонент: старый удаляется вместе с состоянием. Случайно — это баг, нарочно — полезный приём сброса.',
    },
    {
      title: 'ref — закладка на DOM-элемент',
      body: [
        '[[ref|ref]] даёт доступ к настоящему DOM-элементу: поставить фокус, прокрутить, измерить. Создаётся хуком [[useref|useRef]].',
        'В React 19 ref можно передать своему компоненту **как обычный проп** — [[forward-ref|forwardRef]] больше не нужен.',
      ],
      code: 'function SearchInput({ ref, ...rest }) {\n  return <input ref={ref} {...rest} />;\n}\n\nfunction SearchForm() {\n  const inputRef = useRef(null);\n  return (\n    <>\n      <SearchInput ref={inputRef} />\n      <button onClick={() => inputRef.current.focus()}>\n        Фокус\n      </button>\n    </>\n  );\n}',
      highlight: [1, 9],
      key: '`ref.current` меняется без перерисовки. Для данных, которые нужно показывать на экране, используй состояние, а не ref.',
    },
    {
      title: 'Атрибуты DOM в JSX',
      body: [
        '- `class` → [[classname|className]], `for` → [[htmlfor|htmlFor]];',
        '- события и составные имена — [[camelcase|camelCase]]: `onClick`, `tabIndex`, `readOnly`;',
        '- [[aria|aria-*]] и [[data-attr|data-*]] — через дефис, как в HTML;',
        '- [[style-object|style]] — объект, а не строка.',
      ],
      code: '<label htmlFor="dish" className="label">\n  Блюдо\n</label>\n<input\n  id="dish"\n  tabIndex={0}\n  aria-label="Название блюда"\n  data-testid="dish-input"\n  style={{ fontSize: 16, marginTop: 8 }}\n/>',
      key: '`style={{ fontSize: 16 }}`: число без единиц для большинства свойств React превращает в пиксели — `16px`.',
    },
    {
      title: 'Spread: кто последний — тот и прав',
      body: ['При [[spread|spread]] пропсы применяются слева направо — побеждает последний.'],
      code: 'const props = { type: \'submit\', disabled: true };\n\n<button {...props} type="button" />\n// type="button": явный атрибут после spread\n\n<button type="button" {...props} />\n// type="submit": spread перезаписал',
      key: 'Хочешь, чтобы пользователь компонента мог переопределить значение, — ставь `{...rest}` после своих атрибутов. Хочешь запретить — до.',
    },
  ],

  spell: {
    text: 'key — бейджик для списка, ref — закладка на элемент.',
    meaning: '[[key|key]] служит React для списков, [[ref|ref]] даёт доступ к DOM без перерисовок.',
  },

  practice: [
    {
      id: 'special-1',
      type: 'choice',
      question: 'Какой `key` лучше для списка продуктов, который можно сортировать и удалять?',
      options: [
        { text: '`product.id`', correct: true },
        { text: 'Индекс из `map`', why: 'При удалении и сортировке индексы «съезжают», и состояние перепутается.' },
        { text: '`Math.random()`', why: 'Новый ключ на каждом рендере — React будет пересоздавать все элементы и терять их состояние.' },
        { text: '`product.name`', why: 'Имена могут повторяться, а ключ должен быть уникальным среди соседей.' },
      ],
      explain: 'Ключ должен быть уникальным среди соседей и не меняться между рендерами. Лучше всего — id из данных.',
    },
    {
      id: 'special-2',
      type: 'bug',
      question: 'Найди строку с ошибкой.',
      code: 'function Row({ key, name }) {\n  return <li data-id={key}>{name}</li>;\n}\n\nitems.map(i => <Row key={i.id} name={i.name} />)',
      bugLine: 1,
      fix: 'function Row({ id, name }) {  // и передать id={i.id}',
      explain:
        '`key` не попадает в пропсы — внутри Row он будет undefined, и React предупредит об этом в консоли. Передай id отдельным пропсом.',
    },
    {
      id: 'special-3',
      type: 'truefalse',
      statement: 'В React 19, чтобы передать ref в функцию-компонент, обязательно нужен forwardRef.',
      answer: false,
      explain: 'В React 19 `ref` приходит обычным пропом. forwardRef больше не нужен.',
    },
    {
      id: 'special-4',
      type: 'sort',
      question: 'Правильно ли это записано в JSX?',
      bins: ['Правильно', 'Неправильно'],
      items: [
        { text: '`className="card"`', bin: 0 },
        { text: '`class="card"`', bin: 1 },
        { text: "`style={{ color: 'red' }}`", bin: 0 },
        { text: '`style="color: red"`', bin: 1 },
        { text: '`onClick={go}`', bin: 0 },
        { text: '`onclick={go}`', bin: 1 },
        { text: '`aria-label="Закрыть"`', bin: 0 },
      ],
      explain: 'JSX использует имена свойств DOM в camelCase. Строка в style вызовет ошибку, а `onclick` React не узнает как событие.',
    },
    {
      id: 'special-5',
      type: 'choice',
      question: 'Какой `type` будет у кнопки?',
      code: 'const rest = { type: \'submit\' };\n\n<button type="button" {...rest}>Ок</button>',
      options: [
        { text: '`"submit"`', correct: true },
        { text: '`"button"`', why: 'Spread стоит после — его значение перезаписывает явный атрибут.' },
        { text: 'Оба сразу', why: 'У атрибута может быть только одно значение.' },
        { text: 'Будет ошибка', why: 'Повтор атрибута через spread разрешён — побеждает последний.' },
      ],
      explain: 'Атрибуты применяются слева направо: `{...rest}` записан последним и побеждает.',
    },
    {
      id: 'special-6',
      type: 'fill',
      question: 'Передай ref в своё поле ввода (React 19).',
      code: 'function MyInput({ ___, ...rest }) {\n  return <input ___={ref} {...rest} />;\n}',
      answers: ['ref', 'ref'],
      bank: ['ref', 'ref', 'forwardRef', 'current', 'useRef'],
      explain: 'В React 19 `ref` — обычный проп: достаём его из пропсов и передаём настоящему `<input>`.',
    },
    {
      id: 'special-7',
      type: 'choice',
      question: 'Что станет с состоянием формы при смене key?',
      code: '<Form key={userId} />',
      options: [
        { text: 'Форма создастся заново, состояние сбросится', correct: true },
        { text: 'Состояние сохранится', why: 'Новый key — новый экземпляр компонента со свежим состоянием.' },
        { text: 'Будет ошибка', why: 'Менять key — законный приём.' },
        { text: '`key` передастся в Form как проп', why: 'key не попадает в пропсы.' },
      ],
      explain: 'Сброс через key — официальный способ начать «с чистого листа» при смене данных.',
    },
    {
      id: 'special-8',
      type: 'input',
      question: 'Как в JSX пишется HTML-атрибут `for` у `<label>`?',
      answers: ['htmlFor'],
      placeholder: 'имя атрибута',
      explain: '`for` — ключевое слово JavaScript (цикл), поэтому в JSX используется `htmlFor`.',
    },
  ],

  explain: {
    prompt: 'Объясни Лунатику: зачем нужен key и почему индекс — плохой ключ?',
    starters: ['key нужен, чтобы…', 'Индекс плох, потому что…', 'Лучше всего брать…'],
    keywords: [
      { label: 'key помогает React различать элементы', words: ['различ', 'узна', 'отлич', 'сопостав', 'понять'] },
      { label: 'Индекс «съезжает» при изменении списка', words: ['съезж', 'сдвиг', 'удал', 'сортир', 'порядок', 'меня'] },
      { label: 'Ключ — стабильный уникальный id', words: ['id', 'стабил', 'уникал'] },
    ],
    model:
      'key помогает React понять, какой элемент списка какой, когда список меняется. Индекс плох, потому что при удалении или сортировке он «переезжает» на другой элемент, и состояние карточек путается. Лучший ключ — стабильный уникальный id из данных.',
  },
};
