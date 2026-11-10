// Разбор кода и схемы к карточкам пещеры 4. Ключ — заголовок карточки.
export default {
  'Функция — заклинание, которое можно сохранить': {
    scheme: {
      type: 'steps',
      title: 'Как работает вызов',
      steps: [
        { title: 'Аргумент на вход', code: 'double(4)' },
        { title: 'Параметр получает значение', code: 'x = 4' },
        { title: 'Тело считает', code: 'x * 2', tone: 'main' },
        { title: 'return отдаёт результат', code: '8', tone: 'good' },
      ],
    },
    why: 'Объявление `function double(x)` поднимается (hoisting): его можно вызвать даже выше по файлу. Выражение и стрелка живут в `const` и доступны только после строки, где их объявили. Параметр `x` — локальная переменная, в которую попадает аргумент.',
    alt: [
      {
        code: 'function double(x = 1) {\n  return x * 2;\n}\ndouble(); // 2',
        note: 'Параметру можно дать значение по умолчанию — как пропсам в деструктуризации.',
      },
    ],
    wrong: [
      {
        code: 'function double(x) {\n  x * 2;\n}\ndouble(4); // undefined',
        why: 'Нет `return` — результат вычисления пропал, функция вернула undefined.',
      },
      {
        code: 'half(4);\nconst half = (x) => x / 2;',
        why: 'Стрелку в `const` нельзя вызвать раньше объявления — ReferenceError «Cannot access before initialization».',
      },
    ],
  },
  'Стрелочные функции: короткая запись': {
    scheme: {
      type: 'compare',
      left: { title: 'Тело-выражение', tone: 'good', items: ['`x => x * 2`', 'return не нужен', 'объект — в скобках: `() => ({ a: 1 })`'] },
      right: { title: 'Тело-блок', tone: 'main', items: ['`x => { return x * 2; }`', 'return обязателен', 'можно несколько строк'] },
    },
    why: 'После `=>` идёт либо выражение, либо блок в `{}`. Выражение возвращается автоматически. Блок — обычный код, и вернуть значение из него можно только словом `return`. Круглые скобки вокруг объекта говорят: «это выражение, а не блок».',
    alt: [{ code: 'const makeUser = (name) => {\n  return { name };\n};', note: 'Объект можно вернуть и из блока — с явным `return`.' }],
    wrong: [
      { code: 'const sum = (a, b) => { a + b };', why: 'Блок без `return` — функция вернёт undefined.' },
      {
        code: 'const multiply = x, y => x * y;',
        why: 'Несколько параметров пишут только в скобках: `(x, y) => x * y`. Без них — синтаксическая ошибка.',
      },
    ],
  },
  'Функция — это значение': {
    scheme: {
      type: 'steps',
      title: 'Что можно сделать с функцией',
      steps: [
        { title: 'Положить в переменную', code: 'const say = greet;' },
        { title: 'Передать аргументом', code: 'twice(fn)' },
        { title: 'Вернуть из функции', code: 'return () => …' },
        { title: 'Передать пропсом в React', code: 'onClick={handleClick}', tone: 'main' },
      ],
    },
    why: 'Шаблонная строка в обратных кавычках подставляет значения через `${…}`. `const say = greet` копирует ссылку: `say` и `greet` указывают на одну функцию. `twice(fn)` вызывает переданную функцию дважды — так и React вызывает твои обработчики.',
    alt: [
      {
        code: "const twice = (fn) => {\n  fn();\n  fn();\n};\n\ntwice(function () {\n  console.log('Кар!');\n});",
        note: 'Колбэк можно передать и обычной функцией, и стрелкой.',
      },
    ],
    wrong: [
      {
        code: "twice(console.log('Кар!'));",
        why: 'Скобки вызвали `console.log` сразу, и в `twice` попал результат — undefined. Внутри `fn()` упадёт: «fn is not a function».',
      },
    ],
  },
  'Ссылка или вызов': {
    scheme: {
      type: 'compare',
      left: { title: 'Ссылка', tone: 'good', items: ['`ring` — функция целиком', 'вызовут потом', '`setTimeout(ring, 1000)`'] },
      right: { title: 'Вызов', tone: 'bad', items: ['`ring()` — уже результат', 'выполнится сейчас', '`setTimeout(ring(), 1000)`'] },
    },
    why: '`setTimeout` ждёт функцию, чтобы вызвать её позже. `ring` — сама функция, `ring()` — результат её работы. Стрелка `() => remove(7)` создаёт новую функцию, которая вызовет `remove(7)` потом.',
    alt: [
      { code: 'setTimeout(remove, 1000, 7);', note: '`setTimeout` умеет сам передать аргументы — после задержки. Но стрелка понятнее.' },
      {
        code: 'const removeSeven = remove.bind(null, 7);\nsetTimeout(removeSeven, 1000);',
        note: '`bind` создаёт копию функции с заранее заданным аргументом.',
      },
    ],
    wrong: [
      { code: '<button onClick={save()}>Сохранить</button>', why: 'Та же ошибка в React: `save` выполнится при рендере, а не при клике.' },
    ],
  },
  'Замыкание: функция помнит, где родилась': {
    scheme: {
      type: 'compare',
      left: { title: 'next = makeCounter()', items: ['свой `count`', '`next()` → 1', '`next()` → 2'] },
      right: { title: 'other = makeCounter()', tone: 'main', items: ['свой `count`', '`other()` → 1', 'память не общая'] },
    },
    why: '`let count` объявлен внутри `makeCounter`. Стрелка, которую она возвращает, продолжает видеть этот `count` и после того, как `makeCounter` завершилась. Каждый вызов `makeCounter` создаёт новый `count`.',
    alt: [
      {
        code: 'function makeCounter() {\n  let count = 0;\n  return {\n    inc: () => ++count,\n    get: () => count,\n  };\n}',
        note: 'Можно вернуть несколько функций — они делят одну и ту же переменную.',
      },
    ],
    wrong: [
      {
        code: 'let count = 0;\nfunction makeCounter() {\n  return () => ++count;\n}',
        why: 'Переменная снаружи одна на всех — все счётчики будут считать вместе. Своя память у каждого — только если переменная внутри.',
      },
    ],
  },
  'Снимок: замыкание помнит старое': {
    scheme: {
      type: 'steps',
      title: 'Почему «Привет, Аня!»',
      steps: [
        { title: 'Рендер 1', code: "name = 'Аня'" },
        { title: 'Клик: создана стрелка для таймера', sub: 'она замкнула name = «Аня»', tone: 'gold' },
        { title: 'Рендер 2', code: "name = 'Боб'", sub: 'новые функции, но старая стрелка уже ждёт в таймере' },
        { title: 'Через 3 секунды срабатывает старая стрелка', tone: 'main' },
        { title: '«Привет, Аня!» — снимок рендера 1', tone: 'good' },
      ],
    },
    why: 'Обработчик `handleClick` создан во время рендера, когда `name` был «Аня». Стрелка внутри `setTimeout` — тоже замыкание этого рендера. Новые пропсы дают новый рендер и новые функции, но старая стрелка уже «улетела» с прежним снимком.',
    alt: [
      {
        code: 'function Greeter({ name }) {\n  const nameRef = useRef(name);\n  useEffect(() => {\n    nameRef.current = name; // всегда свежее значение\n  });\n\n  function handleClick() {\n    setTimeout(() => alert(`Привет, ${nameRef.current}!`), 3000);\n  }\n  return <button onClick={handleClick}>Привет</button>;\n}',
        note: 'Нужно именно свежее значение — храни его в ref: `.current` указывает на последнее, а не на снимок.',
      },
    ],
    wrong: [
      {
        code: 'const handleSave = useCallback(() => {\n  save(name);\n}, []);',
        why: 'Пустые зависимости: функция создана в первом рендере и навсегда запомнила первое `name`. Добавь его в массив: `[name]`.',
      },
    ],
  },
};
