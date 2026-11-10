// Разбор кода и схемы к карточкам пещеры 7. Ключ — заголовок карточки.
export default {
  'Данные текут вниз, как водопад': {
    scheme: {
      type: 'steps',
      title: 'Круг данных',
      steps: [
        { title: 'Родитель хранит данные', sub: 'в своём состоянии', tone: 'main' },
        { title: 'Передаёт их вниз пропсами', arrow: 'props' },
        { title: 'Ребёнок показывает данные' },
        { title: 'Событие — вызов функции вверх', code: 'onChange(новое значение)', tone: 'gold' },
        { title: 'Родитель обновляет данные', sub: 'React перерисовывает обоих — круг замкнулся', tone: 'good' },
      ],
    },
  },
  'Пропсы — только для чтения': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Нельзя',
        tone: 'bad',
        items: ["`props.title = 'Новое'`", 'ребёнок правит данные родителя', 'экран и данные расходятся'],
      },
      right: {
        title: 'Можно',
        tone: 'good',
        items: ['вычислить новое значение в своей переменной', 'попросить родителя через колбэк', 'завести своё состояние'],
      },
    },
    why: 'Пропсы принадлежат родителю. Если бы ребёнок их менял, родитель не узнал бы об этом, и экран показывал бы две разные «правды». Поэтому React в режиме разработки замораживает объект пропсов.',
    alt: [
      {
        code: 'function Card({ title }) {\n  const upper = title.toUpperCase();\n  return <h2>{upper}</h2>;\n}',
        note: 'Нужно изменённое значение — вычисли новое в своей переменной.',
      },
      {
        code: "function Card({ title, onRename }) {\n  return (\n    <button onClick={() => onRename('Новое')}>\n      {title}\n    </button>\n  );\n}",
        note: 'Нужно изменить данные родителя — попроси его функцией-пропом.',
      },
    ],
    wrong: [
      {
        code: "function Card(props) {\n  props.title = 'Новое';\n  return <h2>{props.title}</h2>;\n}",
        why: 'TypeError в режиме разработки, а в продакшене — тихий рассинхрон с родителем.',
      },
    ],
  },
  'Заморозка — только верхний уровень': {
    scheme: {
      type: 'tree',
      title: 'Что заморожено',
      root: {
        name: 'props',
        note: 'заморожен: props.items = … → TypeError',
        tone: 'main',
        children: [
          {
            name: 'items',
            note: 'массив не заморожен — но менять его всё равно нельзя',
            tone: 'gold',
            children: [{ name: 'items[0]', note: 'тоже не трогаем' }],
          },
        ],
      },
    },
    why: '`Object.freeze` не заходит вглубь: вложенные массивы и объекты технически можно изменить. Но правило «не мутировать» действует на любом уровне.',
    alt: [
      {
        code: "function List({ items }) {\n  const withExtra = [...items, 'ещё'];\n  return <p>{withExtra.length}</p>;\n}",
        note: 'Новый массив на основе пропа — исходный не тронут.',
      },
    ],
    wrong: [
      {
        code: "items.push('ещё');\nitems[0] = 'другое';\nitems.sort();",
        why: 'Все три строки меняют массив родителя на месте: React не узнает об изменении, и данные «поплывут».',
      },
    ],
  },
  'Компонент — чистая функция': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Можно в рендере',
        tone: 'good',
        items: ['вычислить по пропсам и состоянию', 'отфильтровать, отсортировать копию', 'вернуть JSX'],
      },
      right: {
        title: 'Нельзя в рендере',
        tone: 'bad',
        items: ['запрос `fetch`', 'таймер `setInterval`', 'менять внешние переменные и `document`'],
      },
    },
    why: 'React может вызывать компонент когда угодно и сколько угодно раз — например, дважды в StrictMode. Чистая функция при тех же пропсах даёт тот же результат, поэтому повторные вызовы безопасны.',
    alt: [
      {
        code: 'function Clock({ time }) {\n  return <p>{time.toLocaleTimeString()}</p>;\n}',
        note: 'Внешнее значение (время) передали пропом — компонент снова чистый.',
      },
    ],
    wrong: [
      {
        code: "function Bad() {\n  fetch('/api/fridge');\n  return <p>Загрузка…</p>;\n}",
        why: 'Запрос во время рендера уйдёт при каждой перерисовке. Побочные эффекты — в обработчиках или в `useEffect`.',
      },
      {
        code: "function Bad() {\n  document.title = 'Пещеры';\n  return <p>…</p>;\n}",
        why: 'Изменение внешнего мира во время рендера — тоже побочный эффект.',
      },
    ],
  },
  'Неизменяемость: новое вместо правки старого': {
    scheme: {
      type: 'compare',
      left: { title: 'Мутирует — нельзя', tone: 'bad', items: ['`push`, `pop`, `splice`', '`sort`, `reverse`', '`obj.key = …`'] },
      right: {
        title: 'Создаёт новое — можно',
        tone: 'good',
        items: ['`[...arr, x]`, `concat`', '`filter`, `map`, `toSorted`', '`{ ...obj, key: … }`'],
      },
    },
    why: 'React понимает, что данные изменились, по новой ссылке. Мутация оставляет ту же ссылку — и React может пропустить обновление.',
    alt: [
      {
        code: 'const added = products.concat(newItem);\nconst sorted = products.toSorted(\n  (a, b) => a.price - b.price,\n);',
        note: '`concat` и `toSorted` тоже возвращают новые массивы.',
      },
    ],
    wrong: [
      {
        code: 'products.push(newItem);\nsetProducts(products);',
        why: 'Та же ссылка: React сравнит старое и новое через `Object.is`, увидит «то же самое» и может не перерисовать.',
      },
    ],
  },
};
