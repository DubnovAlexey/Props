// Разбор кода и схемы к карточкам пещеры 3. Ключ — заголовок карточки.
export default {
  'Деструктуризация — распаковка посылки': {
    scheme: {
      type: 'compare',
      left: { title: 'Без деструктуризации', items: ['`props.title`', '`props.count`', 'длинно, `props` повторяется'] },
      right: {
        title: 'С деструктуризацией',
        tone: 'good',
        items: ['`const { title, count } = props`', 'дальше просто `title`', 'сразу видно, что используем'],
      },
    },
    why: 'Фигурные скобки слева от `=` означают «распаковать»: имена переменных совпадают с ключами объекта. Справа — объект, из которого достаём значения.',
    alt: [
      { code: 'const title = props.title;\nconst count = props.count;', note: 'Без деструктуризации — длиннее, но работает так же.' },
      {
        code: 'const { title: heading, count = 0 } = props;',
        note: 'Можно переименовать (`title: heading`) и сразу задать значение по умолчанию (`count = 0`).',
      },
    ],
    wrong: [
      {
        code: 'const { title } = undefined;',
        why: 'Распаковать undefined нельзя — TypeError. Если объекта может не быть, подстрахуйся: `const { title } = props ?? {}`.',
      },
      {
        code: 'const [title, count] = props;',
        why: 'Квадратные скобки распаковывают массив по порядку, а пропсы — объект: будет TypeError «props is not iterable».',
      },
    ],
  },
  'Распаковка прямо в параметрах': {
    scheme: {
      type: 'steps',
      steps: [
        { title: 'Родитель пишет', code: '<Card title="Сыр" count={2} />' },
        { title: 'React собирает объект', code: "{ title: 'Сыр', count: 2 }" },
        { title: 'Параметр распаковывает его', code: 'function Card({ title, count })', tone: 'main' },
        { title: 'Внутри — готовые переменные', code: 'title, count', tone: 'good' },
      ],
    },
    why: 'Объект пропсов приходит единственным аргументом, поэтому его можно распаковать прямо в скобках параметров. По первой строке видно «контракт» компонента: какие пропсы он ждёт.',
    alt: [
      {
        code: 'function Card(props) {\n  const { title, count } = props;\n  return <p>{title}: {count}</p>;\n}',
        note: 'Распаковка в теле функции — удобно, если нужен и весь `props` целиком.',
      },
      {
        code: 'const Card = ({ title, count }) => (\n  <p>{title}: {count}</p>\n);',
        note: 'То же со стрелочной функцией и неявным return.',
      },
    ],
    wrong: [
      {
        code: 'function Card(title, count) {\n  return <p>{title}: {count}</p>;\n}',
        why: 'React передаёт ОДИН аргумент — объект. Здесь `title` получит весь объект пропсов, а `count` будет undefined.',
      },
      {
        code: 'function Card({ title }) {\n  return <p>{props.title}</p>;\n}',
        why: 'После распаковки переменной `props` нет — ReferenceError. Используй `title`.',
      },
    ],
  },
  'Значение по умолчанию — запасной план': {
    scheme: {
      type: 'compare',
      left: { title: 'Сработает `48`', tone: 'good', items: ['`<Avatar />` — проп не передан', '`size={undefined}`'] },
      right: { title: 'Не сработает', tone: 'bad', items: ['`size={null}` → null', '`size={0}` → 0', '`size=""` → пустая строка'] },
    },
    why: 'Значение по умолчанию в деструктуризации — возможность JavaScript, а не React. JS подставляет его только вместо `undefined` — «ничего не передали». Всё остальное считается переданным значением.',
    alt: [
      {
        code: 'function Avatar({ size }) {\n  const finalSize = size ?? 48;\n  return <img width={finalSize} />;\n}',
        note: '`??` подставит 48 ещё и для `null` — если null тоже нужно считать «пусто».',
      },
    ],
    wrong: [
      {
        code: 'function Avatar({ size }) {\n  return <img width={size || 48} />;\n}',
        why: '`||` заменит и `0`: передали 0 — получили 48. Для чисел бери значение по умолчанию или `??`.',
      },
      { code: 'Avatar.defaultProps = { size: 48 };', why: 'В React 19 `defaultProps` у функций-компонентов удалены и молча не работают.' },
    ],
  },
  'Spread и rest — высыпать и собрать': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Spread — высыпать',
        items: ['`{ ...base }` — копия объекта', '`[...arr, x]` — новый массив', '`<Card {...props} />`'],
      },
      right: {
        title: 'Rest — собрать',
        tone: 'main',
        items: ['`const { a, ...rest } = obj`', '`function Btn({ variant, ...rest })`', 'rest всегда последний'],
      },
    },
    why: 'Три точки делают противоположное в зависимости от места: справа от `=` и в JSX — высыпают (spread), слева в деструктуризации — собирают (rest).',
    alt: [
      { code: 'const copy = Object.assign({}, base, { size: 3 });', note: 'Старый способ — `Object.assign`. Spread короче и понятнее.' },
    ],
    wrong: [
      { code: 'const { ...rest, color } = copy;', why: 'Rest должен стоять последним — иначе синтаксическая ошибка.' },
      { code: 'const copy = base;\ncopy.size = 3;', why: 'Это не копия, а та же ссылка: изменится и `base`. Копия — `{ ...base }`.' },
    ],
  },
  'Ссылки: одинаковые коробки — разные коробки': {
    scheme: {
      type: 'compare',
      left: { title: 'По значению', tone: 'good', items: ['`5 === 5` → true', "`'кот' === 'кот'` → true", 'числа, строки, true/false'] },
      right: { title: 'По ссылке', tone: 'gold', items: ['`{} === {}` → false', '`[1] === [1]` → false', 'объекты, массивы, функции'] },
    },
    why: 'Объект живёт в памяти, а переменная хранит его адрес. `===` сравнивает адреса: два одинаковых на вид объекта — два разных адреса. React сравнивает так же (`Object.is`), поэтому новый объект для него — «изменение».',
    alt: [
      {
        code: 'Object.is(NaN, NaN); // true\nNaN === NaN;         // false',
        note: '`Object.is` почти как `===`, но честно сравнивает NaN. Им пользуется React.',
      },
      {
        code: 'JSON.stringify(a) === JSON.stringify(b);',
        note: 'Сравнить содержимое можно через JSON — медленно, для отладки, но не для рендера.',
      },
    ],
    wrong: [
      {
        code: "if (user === { name: 'Аня' }) {\n  // никогда не выполнится\n}",
        why: "Новый объект всегда другой. Сравнивай поля: `user.name === 'Аня'`.",
      },
    ],
  },
  '?. и ?? — страховка от пустоты': {
    scheme: {
      type: 'compare',
      left: {
        title: '`?.` — безопасный доступ',
        items: ['`user?.name` при `user = null` → undefined', 'без TypeError', 'цепочка: `a?.b?.c`'],
      },
      right: {
        title: '`??` — запасное значение',
        tone: 'main',
        items: ["`name ?? 'Гость'`", 'срабатывает только для null и undefined', "`0` и `''` остаются как есть"],
      },
    },
    why: '`?.` останавливает цепочку на null/undefined и возвращает undefined вместо ошибки. `??` даёт запасное значение только для «пустоты» — для чисел и строк это безопаснее, чем `||`.',
    alt: [
      { code: 'const name = user && user.name;', note: 'До появления `?.` писали через `&&` — работает, но длиннее.' },
      { code: "const name = user ? user.name : 'Гость';", note: 'Тернарный оператор — когда нужна своя ветка «иначе».' },
    ],
    wrong: [
      {
        code: "const name = user?.name || 'Гость';",
        why: 'Работает, но `||` заменит и пустую строку. Если пустое имя — нормальное значение, бери `??`.',
      },
      {
        code: "user?.name = 'Аня';",
        why: '`?.` нельзя ставить слева от `=` — синтаксическая ошибка: присвоить «возможно, существующему» нельзя.',
      },
    ],
  },
};
