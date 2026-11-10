// Разбор кода и схемы к карточкам пещеры 12. Ключ — заголовок карточки.
export default {
  'key — бейджик для элементов списка': {
    why: 'По `key` React узнаёт элементы между рендерами: «это тот же Сыр, что и раньше». Ключ ставят на самый внешний элемент, который возвращает `map`. Он должен быть уникальным среди соседей и не меняться. Внутрь компонента `key` не попадает.',
    alt: [
      {
        code: "import { Fragment } from 'react';\n\nproducts.map(p => (\n  <Fragment key={p.id}>\n    <dt>{p.name}</dt>\n    <dd>{p.quantity}</dd>\n  </Fragment>\n));",
        note: 'Нужно вернуть несколько элементов — пиши `<Fragment key>`: короткая запись `<>` ключ не принимает.',
      },
    ],
    wrong: [
      {
        code: 'products.map(p => (\n  <li>\n    <ProductCard key={p.id} product={p} />\n  </li>\n));',
        why: 'Ключ стоит не на том элементе: `map` возвращает `<li>`, значит, ключ нужен ему. Иначе — предупреждение «Each child in a list should have a unique key».',
      },
      {
        code: 'function ProductCard(props) {\n  return <p>{props.key}</p>;\n}',
        why: '`key` — служебный атрибут React, внутрь он не передаётся: здесь будет undefined. Нужно значение — передай отдельным пропом, например `id`.',
      },
    ],
  },
  'Почему индекс — плохой ключ': {
    scheme: {
      type: 'compare',
      left: {
        title: 'key = индекс',
        tone: 'bad',
        items: [
          'было: 0 Сыр · 1 Молоко · 2 Хлеб',
          'удаляем Сыр',
          'стало: 0 Молоко · 1 Хлеб',
          'React думает: удалён ключ 2, а 0 и 1 изменились',
        ],
      },
      right: {
        title: 'key = id',
        tone: 'good',
        items: ['было: s Сыр · m Молоко · h Хлеб', 'удаляем Сыр', 'стало: m Молоко · h Хлеб', 'React: удалён s, остальные на месте'],
      },
    },
    why: 'Индекс — это место в очереди, а не имя. Удалили или переставили элемент — индексы «съехали», и React отдаёт состояние (например, текст в поле) чужому элементу. Индекс допустим, только если список никогда не меняет порядок и у элементов нет состояния.',
    alt: [
      {
        code: 'function addItem(name) {\n  const item = { id: crypto.randomUUID(), name };\n  setItems(prev => [...prev, item]);\n}',
        note: 'Нет id в данных — создай его ОДИН раз, когда создаёшь элемент, а не во время рендера.',
      },
    ],
    wrong: [
      {
        code: 'items.map(item => <Row key={item.name} />)',
        why: 'Если имена повторяются, ключи совпадут — React предупредит «Encountered two children with the same key», и строки перепутаются.',
      },
    ],
  },
  'ref — закладка на DOM-элемент': {
    scheme: {
      type: 'steps',
      steps: [
        { title: 'Создаём коробку', code: 'const inputRef = useRef(null);', sub: 'пока `{ current: null }`' },
        { title: 'Передаём вниз пропом', code: '<SearchInput ref={inputRef} />', arrow: 'ref' },
        { title: 'Ребёнок вешает на элемент', code: '<input ref={ref} />' },
        { title: 'После рендера React кладёт узел', code: 'inputRef.current → <input>', tone: 'main' },
        { title: 'В обработчике пользуемся', code: 'inputRef.current.focus()', tone: 'good' },
      ],
    },
    why: 'В React 19 `ref` — обычный проп функции-компонента, `forwardRef` больше не нужен. `useRef(null)` создаёт коробку `{ current: null }`, а React кладёт туда DOM-узел, когда элемент появится на экране.',
    alt: [
      {
        code: "import { forwardRef } from 'react';\n\nconst SearchInput = forwardRef(function SearchInput(props, ref) {\n  return <input ref={ref} {...props} />;\n});",
        note: 'Старый способ — `forwardRef`. В React 19 ещё работает, но уже не нужен.',
      },
      {
        code: "<input ref={node => {\n  node.focus();\n  return () => console.log('убран');\n}} />",
        note: 'Ref-колбэк: функция получит узел. В React 19 она может вернуть функцию очистки.',
      },
    ],
    wrong: [
      {
        code: 'function SearchForm() {\n  const inputRef = useRef(null);\n  inputRef.current.focus();\n  return <input ref={inputRef} />;\n}',
        why: 'Во время рендера элемента ещё нет: `current` равен null — TypeError. Работай с ref в обработчиках или эффектах.',
      },
      { code: '<input ref="search" />', why: 'Строковые ref удалены в React 19. Нужен объект из `useRef` или функция.' },
    ],
  },
  'Атрибуты DOM в JSX': {
    scheme: {
      type: 'compare',
      left: { title: 'HTML', items: ['`class`', '`for`', '`tabindex`', '`style="font-size: 16px"`'] },
      right: { title: 'JSX', tone: 'main', items: ['`className`', '`htmlFor`', '`tabIndex`', '`style={{ fontSize: 16 }}`'] },
    },
    why: 'JSX-атрибуты — это свойства DOM-объекта, поэтому имена в camelCase: `className`, `htmlFor`, `tabIndex`. Исключения — `aria-*` и `data-*`: они пишутся через дефис, как в HTML. `style` — объект; число без единиц React считает пикселями.',
    alt: [
      {
        code: "<input style={{ fontSize: '16px', marginTop: '0.5rem' }} />",
        note: 'Значение стиля можно дать строкой с любыми единицами.',
      },
      { code: "<label className={isActive ? 'label active' : 'label'}>", note: 'Класс можно вычислить выражением.' },
    ],
    wrong: [
      {
        code: '<input style="font-size: 16px" />',
        why: 'React не принимает строку в `style` — будет ошибка: нужен объект с ключами в camelCase.',
      },
      {
        code: '<label for="dish">Блюдо</label>',
        why: '`for` — слово JavaScript. React предупредит «Invalid DOM property `for`. Did you mean `htmlFor`?»',
      },
    ],
  },
  'Spread: кто последний — тот и прав': {
    scheme: {
      type: 'compare',
      left: {
        title: '`{...props}` → `type="button"`',
        tone: 'good',
        items: ['сначала spread: submit', 'потом явный атрибут: button', 'итог: **button**'],
      },
      right: {
        title: '`type="button"` → `{...props}`',
        tone: 'gold',
        items: ['сначала явный атрибут: button', 'потом spread: submit', 'итог: **submit**'],
      },
    },
    why: "Атрибуты JSX собираются в объект слева направо. Как в `{ ...a, type: 'button' }`, более правый ключ перезаписывает левый. Поэтому порядок spread и явных атрибутов решает, чьё значение победит.",
    alt: [
      {
        code: "function Button({ className = '', ...rest }) {\n  return <button {...rest} className={`btn ${className}`} />;\n}",
        note: 'Не перезаписывать, а объединять: свой класс плюс класс от родителя.',
      },
    ],
    wrong: [
      {
        code: 'function Button(props) {\n  return <button className="btn" {...props} />;\n}',
        why: 'Если родитель передаст свой `className`, spread затрёт `btn` — базовые стили пропадут.',
      },
    ],
  },
};
