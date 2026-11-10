// Разбор кода и схемы к карточкам пещеры 17. Ключ — заголовок карточки.
export default {
  'Зачем описывать пропсы': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Без типов',
        tone: 'bad',
        items: [
          'опечатка в имени пропа — тихий undefined',
          'число вместо строки — узнаешь в браузере',
          'договор компонента — только в голове',
        ],
      },
      right: {
        title: 'С типами',
        tone: 'good',
        items: ['ошибка подчёркнута прямо в редакторе', 'автодополнение имён пропсов', 'тип — живая документация'],
      },
    },
  },
  'Тип пропсов в TypeScript': {
    scheme: {
      type: 'tree',
      title: 'Из чего состоит тип пропсов',
      root: {
        name: 'ProductCardProps',
        tone: 'main',
        children: [
          { name: 'name: string', note: 'обязательный' },
          { name: 'quantity?: number', note: 'знак ? — необязательный' },
          { name: 'onDelete: (id: number) => void', note: 'функция' },
          { name: 'children?: React.ReactNode', note: 'всё, что можно нарисовать' },
        ],
      },
    },
    why: '`type` описывает форму объекта пропсов. `?` — проп необязательный. `(id: number) => void` — функция, которая принимает число и ничего не возвращает. `React.ReactNode` — всё, что можно нарисовать. Тип ставят после деструктуризации: `}: ProductCardProps`.',
    alt: [
      {
        code: 'interface ProductCardProps {\n  name: string;\n  quantity?: number;\n}',
        note: '`interface` для объектов почти то же, что `type`. Выбери один стиль на проект.',
      },
      {
        code: 'function Tag({ label }: { label: string }) {\n  return <span>{label}</span>;\n}',
        note: 'Для маленького компонента тип можно написать прямо в параметре.',
      },
    ],
    wrong: [
      {
        code: 'function ProductCard({ name: string }) {\n  return <li>{name}</li>;\n}',
        why: 'Внутри деструктуризации двоеточие означает ПЕРЕИМЕНОВАНИЕ: это «возьми name и назови переменную string». Тип пишут после скобок: `({ name }: { name: string })`.',
      },
      { code: 'function ProductCard(props: any) { … }', why: '`any` выключает проверку полностью — TypeScript перестанет ловить ошибки.' },
    ],
  },
  'Какие ошибки поймает TypeScript': {
    scheme: {
      type: 'steps',
      title: 'Как TypeScript проверяет JSX',
      steps: [
        { title: 'Читает тип пропсов компонента', code: 'ProductCardProps' },
        { title: 'Сравнивает с атрибутами в JSX', code: '<ProductCard name="Сыр" />' },
        { title: 'Нет обязательного, не тот тип или лишнее имя', tone: 'bad', sub: 'подчёркивание в редакторе ещё до запуска' },
      ],
    },
    why: 'TypeScript сверяет атрибуты в JSX с типом пропсов: все ли обязательные на месте, совпадают ли типы, нет ли неизвестных имён. Поэтому опечатка `nmae` ловится сразу.',
    alt: [
      { code: '<ProductCard name="Сыр" onDelete={() => {}} />', note: 'Обязательный проп-функцию можно временно закрыть пустой стрелкой.' },
    ],
    wrong: [
      {
        code: '// @ts-ignore\n<ProductCard name={42} onDelete={del} />',
        why: 'Комментарий прячет ошибку, но не исправляет: в браузере всё равно будет число вместо строки.',
      },
      {
        code: '<ProductCard name={42 as any} onDelete={del} />',
        why: '`as any` — та же «заглушка»: проверка выключена, ошибка уезжает в рантайм.',
      },
    ],
  },
  'Типы без TypeScript: JSDoc': {
    scheme: {
      type: 'steps',
      steps: [
        { title: 'Включи проверку в начале файла', code: '// @ts-check' },
        { title: 'Комментарий с двумя звёздочками', code: '/** … */' },
        { title: 'Опиши объект пропсов', code: '@param {{ name: string }} props', tone: 'main' },
        { title: 'Редактор подчёркивает ошибки, как в TypeScript', tone: 'good' },
      ],
    },
    why: '`// @ts-check` в начале .js-файла включает проверку TypeScript в редакторе. JSDoc — комментарий с двумя звёздочками `/** … */`, а `@param {{…}} props` описывает объект пропсов.',
    alt: [
      {
        code: '/**\n * @typedef {{ name: string, quantity?: number }} ProductCardProps\n */\n\n/** @param {ProductCardProps} props */\nfunction ProductCard({ name, quantity = 1 }) { … }',
        note: '`@typedef` даёт типу имя — его можно переиспользовать.',
      },
    ],
    wrong: [
      {
        code: '/*\n * @param {{ name: string }} props\n */',
        why: 'Одна звёздочка — обычный комментарий, не JSDoc: редактор его проигнорирует.',
      },
      {
        code: 'ProductCard.propTypes = {\n  name: PropTypes.string,\n};',
        why: 'В React 19 проверка `propTypes` удалена — React их молча игнорирует.',
      },
    ],
  },
  'Что убрали в React 19': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Удалено',
        tone: 'bad',
        items: ['`defaultProps` у функций', '`propTypes`', 'строковые ref: `ref="input"`', '`ReactDOM.render`'],
      },
      right: {
        title: 'Вместо этого',
        tone: 'good',
        items: ['значения по умолчанию в параметрах', 'TypeScript или JSDoc', '`useRef` или ref-функция', '`createRoot(…).render(…)`'],
      },
    },
    why: 'Значения по умолчанию теперь задаёт сам JavaScript — в деструктуризации параметров. Это короче, видно прямо в сигнатуре и работает одинаково везде.',
    alt: [
      {
        code: "function Button({ size }) {\n  const finalSize = size ?? 'm';\n  return <button className={finalSize} />;\n}",
        note: 'Запасное значение можно подставить в теле через `??`.',
      },
    ],
    wrong: [
      {
        code: "import ReactDOM from 'react-dom';\n\nReactDOM.render(<App />, root);",
        why: '`ReactDOM.render` удалён в React 19. Нужно `createRoot(root).render(<App />)` из `react-dom/client`.',
      },
    ],
  },
  'Все пропсы HTML-элемента сразу': {
    scheme: {
      type: 'steps',
      steps: [
        { title: 'Все пропсы кнопки', code: "ComponentProps<'button'>", sub: 'onClick, disabled, type, aria-*…' },
        { title: 'Плюс свои', code: "& { variant?: 'primary' | 'ghost' }", tone: 'main' },
        { title: 'Своё — отдельно, остальное — в rest', code: '{ variant, ...rest }' },
        { title: 'Кнопка получает всё сразу', code: '<button {...rest} />', tone: 'good' },
      ],
    },
    why: "`ComponentProps<'button'>` — все пропсы, которые принимает `<button>`: `onClick`, `disabled`, `type`, `aria-*`… Знак `&` добавляет к ним свои. `...rest` собирает всё остальное и передаёт кнопке. `import type` — импорт только типа, после сборки он исчезает.",
    alt: [
      {
        code: "function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {\n  return <button {...rest} className={`${variant} ${className}`} />;\n}",
        note: 'Если родитель передаст свой `className`, он не затрёт `variant`: классы объединены.',
      },
    ],
    wrong: [
      {
        code: "type ButtonProps = { variant?: 'primary' | 'ghost' };\n\n<Button onClick={save} />",
        why: "В типе нет `onClick` — TypeScript скажет «Property 'onClick' does not exist». Поэтому и нужен `ComponentProps<'button'>`.",
      },
    ],
  },
};
