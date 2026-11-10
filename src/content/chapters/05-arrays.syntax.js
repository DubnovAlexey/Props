// Разбор кода и схемы к карточкам пещеры 5. Ключ — заголовок карточки.
export default {
  'map: превратить каждый элемент': {
    scheme: {
      type: 'steps',
      title: 'map превращает данные в элементы',
      steps: [
        { title: 'Массив данных', code: "['Лунатик', 'Клык']" },
        { title: 'Функция для каждого', code: 'name => <li key={name}>{name}</li>', tone: 'main' },
        { title: 'Новый массив элементов', code: '[<li>Лунатик</li>, <li>Клык</li>]', tone: 'good' },
      ],
    },
    why: '`bats.map(name => …)` вызывает стрелку для каждого имени и собирает результаты в новый массив. В JSX `{bats.map(…)}` вставляет этот массив элементов, и React рисует их по порядку. `key={name}` — имя элемента для согласования.',
    alt: [
      {
        code: 'bats.map((name, index) => (\n  <li key={name}>{index + 1}. {name}</li>\n))',
        note: 'Вторым аргументом map передаёт индекс — удобно для нумерации, но не для key.',
      },
    ],
    wrong: [
      {
        code: 'bats.map(name => {\n  <li key={name}>{name}</li>;\n})',
        why: 'Фигурные скобки — блок без `return`: map соберёт массив из undefined, и список будет пустым.',
      },
      {
        code: 'bats.forEach(name => <li>{name}</li>)',
        why: '`forEach` ничего не возвращает — он только обходит массив. Для списка нужен `map`.',
      },
    ],
  },
  'filter, find, some: отобрать и найти': {
    scheme: {
      type: 'compare',
      left: { title: 'filter', items: ['всегда массив', 'все подходящие', 'не нашёл → `[]`'] },
      right: { title: 'find', tone: 'main', items: ['один элемент', 'первый подходящий', 'не нашёл → `undefined`'] },
    },
    why: 'Функция внутри — условие отбора: она возвращает `true` или `false`. `p.days <= 2` — выражение, которое само даёт булево значение, поэтому короткой стрелки хватает.',
    alt: [
      {
        code: 'const index = products.findIndex(p => p.id === 3); // 2\nconst has = products.map(p => p.id).includes(3); // true',
        note: '`findIndex` вернёт номер элемента (или -1), `includes` проверит, есть ли значение в массиве.',
      },
    ],
    wrong: [
      {
        code: "const cheese = products.filter(p => p.name === 'Сыр');\ncheese.name; // undefined",
        why: '`filter` всегда возвращает массив, даже из одного элемента. Нужен один — бери `find`.',
      },
    ],
  },
  'reduce: свернуть в одно значение': {
    scheme: {
      type: 'steps',
      title: 'Шаги reduce',
      steps: [
        { title: 'Начало', code: 'sum = 0' },
        { title: '+ 120', code: 'sum = 120' },
        { title: '+ 80', code: 'sum = 200' },
        { title: '+ 45', code: 'sum = 245', tone: 'good' },
      ],
    },
    why: '`(sum, price) => sum + price` отвечает на вопрос «как добавить текущий элемент к накопленному». `0` после запятой — начальное значение `sum`. Результат последнего шага и есть итог `reduce`.',
    alt: [
      {
        code: 'let total = 0;\nfor (const price of prices) {\n  total += price;\n}',
        note: 'Тот же расчёт циклом `for…of` — длиннее, но кому-то понятнее.',
      },
    ],
    wrong: [
      {
        code: '[].reduce((sum, p) => sum + p);',
        why: 'Пустой массив без начального значения — TypeError «Reduce of empty array with no initial value». Всегда передавай второй аргумент.',
      },
    ],
  },
  'Мутация и копия': {
    scheme: {
      type: 'steps',
      title: 'Как менять массив в React',
      steps: [
        { title: 'Нужно изменить массив из состояния' },
        { title: 'Сделай копию', code: '[...items] или toSorted / with / filter / map', tone: 'main' },
        { title: 'Меняй копию' },
        { title: 'Передай копию в сеттер', code: 'setItems(copy)' },
        { title: 'Новая ссылка — React видит изменение', tone: 'good' },
      ],
    },
    why: "Spread `[...bats, 'Лунатик']` высыпает старые элементы в новый массив и добавляет ещё один. `toSorted` и `with` — копирующие версии `sort` и присваивания по индексу; они появились в стандарте ES2023.",
    alt: [
      {
        code: "const sorted = [...bats].sort();\nconst renamed = bats.map((b, i) => (i === 0 ? 'Мрак' : b));",
        note: 'До `toSorted` и `with` делали так: сначала копия, потом мутирующий метод — или map.',
      },
    ],
    wrong: [
      {
        code: "const copy = bats;\ncopy.push('Лунатик');",
        why: 'Присваивание не копирует массив: `copy` и `bats` указывают на один и тот же. `push` изменит оба.',
      },
    ],
  },
  'Истинные и ложные значения': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Ложные — их восемь',
        tone: 'gold',
        items: ['`false`, `0`, `-0`, `0n`', "`''` — пустая строка", '`null`, `undefined`, `NaN`'],
      },
      right: {
        title: 'Истинные — всё остальное',
        tone: 'good',
        items: ["`'0'`, `'false'` — непустые строки", '`[]`, `{}` — любые объекты', '`-1`, `Infinity` — числа, кроме нуля'],
      },
    },
    why: '`Boolean(…)` показывает, как значение поведёт себя в условии. `&&` и `||` возвращают не `true`/`false`, а одно из исходных значений — поэтому `0 && …` даёт `0`, и React его рисует.',
    alt: [
      {
        code: '{!!count && <Badge />}\n{count ? <Badge /> : null}',
        note: '`!!` превращает значение в булево, а тернарный оператор делает выбор явным.',
      },
    ],
    wrong: [
      {
        code: 'const size = props.size || 48; // size = 0 → 48',
        why: '`||` заменит и законный ноль. Для чисел — `??` или значение по умолчанию.',
      },
    ],
  },
  'Шаблонные строки': {
    scheme: {
      type: 'steps',
      title: 'Как работает подстановка',
      steps: [
        { title: 'Обратные кавычки', code: '`…`' },
        { title: 'Внутри — выражение', code: '${name}', tone: 'main' },
        { title: 'JavaScript считает выражение и вставляет результат', code: "'Граф, тебе 427 лет'", tone: 'good' },
      ],
    },
    why: 'Обратные кавычки создают шаблонную строку, а `${…}` вставляет значение выражения. В `className` фигурные скобки JSX открывают JavaScript, а внутри них уже шаблонная строка.',
    alt: [
      {
        code: "const cls = ['card', isActive && 'active'].filter(Boolean).join(' ');",
        note: 'Классы можно собрать массивом: `filter(Boolean)` уберёт `false`, а `join` склеит через пробел.',
      },
    ],
    wrong: [
      {
        code: "const text = '${name}, привет';",
        why: 'В обычных кавычках `${…}` — просто символы, подстановки не будет. Нужны обратные кавычки.',
      },
    ],
  },
};
