// Разбор кода и схемы к карточкам пещеры 6. Ключ — заголовок карточки.
export default {
  'Посылка от родителя': {
    why: 'Передача и получение — две стороны одной записи: атрибут `name="Молоко"` у родителя становится ключом `name` в объекте пропсов ребёнка. Имена должны совпадать буква в букву.',
    alt: [
      {
        code: 'function ProductCard(props) {\n  return <p>{props.name}: {props.quantity} шт.</p>;\n}',
        note: 'Без деструктуризации — через `props.имя`.',
      },
    ],
    wrong: [
      {
        code: '<ProductCard Name="Молоко" />\n\nfunction ProductCard({ name }) { … }',
        why: 'Регистр важен: передали `Name`, а читаем `name` — получим undefined.',
      },
    ],
  },
  'Строки — в кавычках, всё остальное — в скобках': {
    scheme: {
      type: 'compare',
      left: { title: 'Кавычки — только строки', items: ['`title="Сыр"`', '`id="7"` — тоже строка!'] },
      right: {
        title: 'Фигурные скобки — что угодно',
        tone: 'main',
        items: [
          '`price={120}` — число',
          '`inStock={true}` — булево',
          "`tags={['молочное']}` — массив",
          '`onBuy={handleBuy}` — функция',
          '`icon={<CheeseIcon />}` — JSX',
        ],
      },
    },
    why: 'Кавычки в JSX работают как в HTML — только текст. Фигурные скобки открывают JavaScript, поэтому внутри можно передать значение любого типа.',
    alt: [
      {
        code: "<Card title={'Сыр'} />\n<Card title={`Сыр ${weight} г`} />",
        note: 'Строку тоже можно в скобках — удобно для шаблонных строк с подстановкой.',
      },
    ],
    wrong: [
      {
        code: '<Card price="120" />\n// внутри: price + 1 → "1201"',
        why: 'В кавычках — строка, и арифметика превратится в склейку строк.',
      },
      {
        code: '<Card onBuy="handleBuy" />',
        why: 'Передалась строка "handleBuy", а не функция — по клику ничего не произойдёт или будет ошибка «is not a function».',
      },
    ],
  },
  'Булевы и пропущенные пропсы': {
    scheme: {
      type: 'steps',
      title: 'Что окажется в isOpen',
      steps: [
        { title: '`<Modal isOpen />`', sub: 'атрибут без значения', code: 'isOpen = true', tone: 'good' },
        { title: '`<Modal isOpen={false} />`', sub: 'явное «нет»', code: 'isOpen = false' },
        { title: '`<Modal />`', sub: 'атрибута нет вовсе', code: 'isOpen = undefined', tone: 'gold' },
      ],
    },
    why: 'Атрибут без значения в JSX означает `true` — так короче писать флаги. А нет атрибута — нет ключа в объекте, то есть `undefined`.',
    alt: [{ code: '<Modal isOpen={isOpen} />', note: 'Обычно флаг берут из переменной или состояния.' }],
    wrong: [
      { code: '<Modal isOpen="false" />', why: 'Строка "false" непустая, значит «истинная» — окно откроется! Пиши `isOpen={false}`.' },
    ],
  },
  'Двойные скобки — не магия': {
    scheme: {
      type: 'steps',
      steps: [
        { title: 'Внешние скобки — «дальше JavaScript»', code: 'style={ … }' },
        { title: 'Внутренние скобки — объект', code: "{ color: 'red' }", tone: 'main' },
        { title: 'Вместе', code: "style={{ color: 'red' }}", tone: 'good' },
      ],
    },
    why: 'Внешние скобки говорят «дальше JavaScript», внутренние — это литерал объекта. Если положить объект в переменную, двойные скобки исчезнут.',
    alt: [
      {
        code: "const style = { color: 'red', fontSize: 16 };\n\n<p style={style}>Текст</p>",
        note: 'Объект в переменной читается проще; вынесенный за компонент, он ещё и не создаётся заново.',
      },
    ],
    wrong: [
      {
        code: '<Card meta={ id: 7 } />',
        why: 'Одинарные скобки ждут выражение, а `id: 7` — не выражение. Объекту нужны свои скобки: `{{ id: 7 }}`.',
      },
    ],
  },
  'Передать всё сразу: spread': {
    scheme: {
      type: 'steps',
      steps: [
        { title: 'Объект с данными', code: "{ name: 'Хлеб', quantity: 1 }" },
        { title: 'Spread в JSX', code: '<ProductCard {...product} />', arrow: 'каждый ключ → отдельный проп' },
        { title: 'Ребёнок получает', code: 'function ProductCard({ name, quantity })', tone: 'main' },
      ],
    },
    why: '`{...product}` раскладывает ключи объекта в отдельные атрибуты. Удобно, когда форма данных совпадает с пропсами компонента.',
    alt: [
      {
        code: '<ProductCard product={product} />\n\nfunction ProductCard({ product }) {\n  return <p>{product.name}</p>;\n}',
        note: 'Передать объект целиком — явный и понятный вариант.',
      },
    ],
    wrong: [
      {
        code: '<ProductCard {...product} name="Батон" {...extra} />',
        why: 'Синтаксис верный, но запутанный: что правее, то и побеждает, и `extra.name` молча перезапишет «Батон». Не смешивай много spread и явных пропсов.',
      },
    ],
  },
  'Пример из «Умного холодильника»': {
    scheme: {
      type: 'tree',
      title: 'Кто что знает',
      root: {
        name: 'App',
        note: 'знает user и products',
        tone: 'main',
        children: [
          {
            name: 'ProductList',
            down: 'products, canDelete, onDelete',
            note: 'про роли не знает',
            children: [{ name: 'ProductCard', down: 'product, canDelete', up: 'onDelete(id)' }],
          },
        ],
      },
    },
    why: '`canDelete` вычисляет тот, кто знает про роли, — `App`. Список получает готовый ответ «можно / нельзя» и не зависит от системы ролей, поэтому его легко переиспользовать.',
    alt: [
      {
        code: "<ProductList products={products} user={user} />\n// внутри: user.role === 'ADMIN'",
        note: 'Можно передать всего пользователя, но тогда список начнёт зависеть от ролей.',
      },
    ],
    wrong: [
      {
        code: '<ProductList products={products} canDelete="true" />',
        why: 'Строка "true" вместо булева: любая непустая строка «истинна» — даже "false".',
      },
    ],
  },
};
