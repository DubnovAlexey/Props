// Пещера 3. Пещера алхимика: приёмы JavaScript, на которых держатся пропсы.
export default {
  id: 'js-basics',
  order: 3,
  icon: '⚗️',
  color: '#34d399',
  cave: 'Пещера алхимика',
  title: 'Объекты: JS-магия для пропсов',
  goal: 'Освоить деструктуризацию, значения по умолчанию, spread/rest и сравнение по ссылке.',
  breakRound: 'truths',

  pretest: {
    question: 'Что выведет этот код?',
    code: 'const { a } = { a: 1, b: 2 };\nconsole.log(a);',
    options: [{ text: '`1`', correct: true }, { text: '`{ a: 1 }`' }, { text: '`undefined`' }, { text: '`2`' }],
    explain: 'Это деструктуризация: из объекта достаётся свойство `a` в одноимённую переменную.',
  },

  lesson: [
    {
      title: 'Деструктуризация — распаковка посылки',
      body: [
        'Пропсы приходят одним объектом. Чтобы не писать `props.title`, `props.count`, их «распаковывают» — это [[destructuring|деструктуризация]].',
      ],
      code: "const props = { title: 'Сыр', count: 2 };\n\n// без деструктуризации\nconst t = props.title;\n\n// с деструктуризацией\nconst { title, count } = props;",
      highlight: [7],
      analogy: 'Получил посылку — сразу разложил вещи по полкам, а не таскаешь всю коробку с собой.',
    },
    {
      title: 'Распаковка прямо в параметрах',
      body: ['Почти все компоненты распаковывают пропсы сразу в параметрах функции. Можно и переименовать свойство.'],
      code: '// сразу в параметрах\nfunction Card({ title, count }) {\n  return <p>{title}: {count}</p>;\n}\n\n// переименование: title → heading\nconst { title: heading } = props;',
      highlight: [2],
      key: '`function Card({ title })` — не особый синтаксис React, а обычная деструктуризация параметра функции.',
    },
    {
      title: 'Значение по умолчанию — запасной план',
      body: [
        'Если проп не передали, в нём [[undefined|undefined]]. [[default-value|Значение по умолчанию]] подставится **только** в этом случае.',
      ],
      code: 'function Avatar({ size = 48 }) {\n  return <img width={size} />;\n}\n\n<Avatar />             // size = 48\n<Avatar size={80} />   // size = 80\n<Avatar size={null} /> // size = null!\n<Avatar size={0} />    // size = 0',
      highlight: [7],
      key: 'Значение по умолчанию срабатывает только для `undefined`. `null`, `0` и пустая строка — это переданные значения.',
    },
    {
      title: 'Spread и rest — высыпать и собрать',
      body: ['[[spread|Spread]] `...` высыпает свойства объекта, [[rest|rest]] `...rest` собирает «всё остальное» в новый объект.'],
      code: "const base = { color: 'red', size: 2 };\nconst copy = { ...base, size: 3 };\n// { color: 'red', size: 3 }\n\nconst { color, ...rest } = copy;\n// color = 'red', rest = { size: 3 }",
      key: 'Порядок важен: что написано позже, то и побеждает. `{ ...base, size: 3 }` перезапишет `size`.',
    },
    {
      title: 'Ссылки: одинаковые коробки — разные коробки',
      body: [
        'Числа и строки сравниваются по значению, а объекты, массивы и функции — по [[reference|ссылке]], то есть по «адресу» в памяти.',
        'React сравнивает значения через [[object-is|Object.is]] — на этом построены обновления и оптимизации.',
      ],
      code: "5 === 5;          // true\n'кот' === 'кот';  // true\n({}) === ({});    // false\n[1] === [1];      // false\n\nconst a = { x: 1 };\nconst b = a;\na === b;          // true: одна коробка",
      analogy: 'Два одинаковых гроба на кладбище — всё равно два разных гроба. Сравнивают адрес, а не содержимое.',
    },
    {
      title: '?. и ?? — страховка от пустоты',
      body: [
        '[[optional-chaining|?.]] не даёт коду упасть, если объекта нет. [[nullish|??]] подставляет запасное значение только для `null` и `undefined`.',
      ],
      code: 'const user = undefined;\nuser?.name;  // undefined, без ошибки\nuser.name;   // TypeError!\n\n0 || 10;     // 10 (0 считается «ложью»)\n0 ?? 10;     // 0  (0 — нормальное число)',
      key: '`||` заменяет и `0`, и пустую строку, а `??` — только `null` и `undefined`.',
    },
  ],

  spell: {
    text: 'Распакуй посылку: что нужно — достань, остальное — в ...rest.',
    meaning: '[[destructuring|Деструктуризация]] берёт нужное, [[rest|rest]] собирает остальное.',
  },

  practice: [
    {
      id: 'js-basics-1',
      type: 'choice',
      question: 'Чему будет равен `size`?',
      code: 'function Avatar({ size = 48 }) {\n  return <img width={size} />;\n}\n\n<Avatar size={null} />',
      options: [
        { text: '`null`', correct: true },
        { text: '`48`', why: 'Значение по умолчанию подставляется только для undefined, а null — это переданное значение.' },
        { text: '`undefined`', why: 'Проп передан явно — он не undefined.' },
        { text: 'Будет ошибка', why: 'Передать null в проп можно, ошибки не будет.' },
      ],
      hint: 'Когда срабатывает значение по умолчанию?',
      explain:
        '`null` — это явно переданное «пусто», поэтому значение по умолчанию не сработает. Хочешь подстраховаться и от null — используй `size ?? 48`.',
    },
    {
      id: 'js-basics-2',
      type: 'input',
      question: 'Что написать вместо `___`, чтобы достать `title` из объекта `props`?',
      code: 'const ___ = props;\nconsole.log(title);',
      answers: ['{ title }'],
      placeholder: 'например: { … }',
      explain: '`const { title } = props;` — деструктуризация объекта. Фигурные скобки слева от `=` означают «распаковать».',
    },
    {
      id: 'js-basics-3',
      type: 'truefalse',
      statement: '`[1, 2] === [1, 2]` вернёт `true`.',
      answer: false,
      explain: 'Это два разных массива в памяти. Массивы сравниваются по ссылке, а не по содержимому.',
    },
    {
      id: 'js-basics-4',
      type: 'choice',
      question: 'Что выведет консоль?',
      code: "const a = { color: 'red', size: 2 };\nconst b = { ...a, color: 'blue' };\nconsole.log(b);",
      options: [
        { text: "`{ color: 'blue', size: 2 }`", correct: true },
        { text: "`{ color: 'red', size: 2 }`", why: "`color: 'blue'` записан после spread и перезаписывает значение." },
        { text: "`{ color: 'blue' }`", why: 'Spread скопировал и `size` — он никуда не делся.' },
        { text: 'Ошибка: ключ повторяется', why: 'Повтор ключа в литерале объекта разрешён — побеждает последний.' },
      ],
      explain: 'Spread копирует все свойства, затем явные свойства справа перезаписывают одноимённые.',
    },
    {
      id: 'js-basics-5',
      type: 'fill',
      question: 'Возьми `variant` по имени, а остальные пропсы собери и передай кнопке.',
      code: 'function Button({ variant, ___rest }) {\n  return <button className={variant} ___ />;\n}',
      answers: ['...', '{...rest}'],
      bank: ['...', '{...rest}', 'rest', '{rest}', '..'],
      explain: 'В параметрах `...rest` собирает остальные пропсы в объект, а в JSX `{...rest}` раскладывает их обратно атрибутами.',
    },
    {
      id: 'js-basics-6',
      type: 'choice',
      question: 'Какое выражение подставит `10`, только если `value` равно `null` или `undefined`?',
      options: [
        { text: '`value ?? 10`', correct: true },
        { text: '`value || 10`', why: '`||` заменит ещё и 0, пустую строку и false.' },
        { text: '`value && 10`', why: '`&&` вернёт 10, когда value истинно, — это обратная логика.' },
        { text: '`value ? value : 10`', why: 'Тернарник тоже заменит 0 и пустую строку — они «ложные».' },
      ],
      explain: 'Оператор `??` реагирует только на `null` и `undefined` — идеально для чисел, где `0` — нормальное значение.',
    },
    {
      id: 'js-basics-7',
      type: 'sort',
      question: 'Что вернёт сравнение?',
      bins: ['true', 'false'],
      items: [
        { text: '`5 === 5`', bin: 0 },
        { text: "`'a' === 'a'`", bin: 0 },
        { text: '`{} === {}`', bin: 1 },
        { text: '`[] === []`', bin: 1 },
        { text: '`Object.is(NaN, NaN)`', bin: 0 },
        { text: '`(() => 1) === (() => 1)`', bin: 1 },
      ],
      explain: 'Примитивы сравниваются по значению, объекты, массивы и функции — по ссылке. `Object.is` считает NaN равным самому себе.',
    },
    {
      id: 'js-basics-8',
      type: 'bug',
      question: 'Какая строка упадёт с ошибкой, если `user` не передан?',
      code: "function Header({ user }) {\n  const name = user.name;\n  const role = user?.role ?? 'GUEST';\n  return <p>{name} ({role})</p>;\n}",
      bugLine: 2,
      fix: "const name = user?.name ?? 'Гость';",
      explain: 'Если `user` — undefined, обращение `user.name` бросит TypeError. Строкой ниже защита уже есть: `?.` и `??`.',
    },
  ],

  explain: {
    prompt: 'Объясни Лунатику: чем `{ size = 48 }` отличается от `size || 48`?',
    starters: ['Значение по умолчанию срабатывает, когда…', 'А оператор || …', 'Поэтому для чисел…'],
    keywords: [
      { label: 'По умолчанию — только для undefined', words: ['undefined', 'не передал'] },
      { label: '|| заменяет 0 и пустую строку', words: ['0', 'ноль', 'пуст', 'ложн', 'false'] },
      { label: 'Есть безопасный вариант ??', words: ['??', 'null'] },
    ],
    model:
      'Значение по умолчанию в деструктуризации срабатывает, только когда проп равен undefined, то есть его не передали. Оператор || заменяет любое «ложное» значение: 0, пустую строку, false, null. Поэтому для чисел безопаснее значение по умолчанию или ??.',
  },
};
