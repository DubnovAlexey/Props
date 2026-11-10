// Пещера 17. Кристальный грот: как описывать пропсы типами и что изменилось в React 19.
export default {
  id: 'types',
  order: 17,
  icon: '💠',
  color: '#2dd4bf',
  cave: 'Кристальный грот',
  title: 'Типы пропсов',
  goal: 'Научиться описывать, какие пропсы принимает компонент: TypeScript, JSDoc и изменения React 19.',
  breakRound: 'truths',

  pretest: {
    question: 'Что происходит с `propTypes` в React 19?',
    options: [
      { text: 'Удалены: проверки молча игнорируются', correct: true },
      { text: 'Работают как раньше' },
      { text: 'Стали обязательными' },
      { text: 'Автоматически превращаются в TypeScript' },
    ],
    explain: 'В React 19 propTypes удалены. Для проверки пропсов используют TypeScript.',
  },

  lesson: [
    {
      title: 'Зачем описывать пропсы',
      body: [
        'Компонент — как договор: «дай мне строку `name` и функцию `onDelete` — нарисую карточку». Описание типов — это записанный договор.',
        '[[typescript|TypeScript]] проверяет договор **ещё в редакторе**: опечатку в имени пропса или число вместо строки ты увидишь до запуска.',
      ],
      key: 'Типы ловят ошибки до пользователя. Ошибка в редакторе дешевле ошибки в продакшене.',
    },
    {
      title: 'Тип пропсов в TypeScript',
      body: ['В TypeScript описывают [[type-props|тип пропсов]]. Знак `?` делает проп [[optional-prop|необязательным]].'],
      code: 'type ProductCardProps = {\n  name: string;\n  quantity?: number; // необязательный\n  onDelete: (id: number) => void;\n  children?: React.ReactNode;\n};\n\nfunction ProductCard({ name, quantity = 1,\n  onDelete }: ProductCardProps) {\n  return <li>{name}: {quantity}</li>;\n}',
      highlight: [3, 9],
      key: 'children обычно типизируют как [[react-node|React.ReactNode]] — «всё, что можно нарисовать».',
    },
    {
      title: 'Какие ошибки поймает TypeScript',
      body: ['Три типичные ошибки — и как о них сообщит редактор:'],
      code: "<ProductCard name=\"Сыр\" />\n// Property 'onDelete' is missing…\n\n<ProductCard name={42} onDelete={del} />\n// Type 'number' is not assignable\n// to type 'string'\n\n<ProductCard nmae=\"Сыр\" onDelete={del} />\n// Property 'nmae' does not exist…",
      analogy: 'TypeScript — как страж у входа в пещеры: не пустит гостя без приглашения (onDelete) и с чужим именем (nmae).',
    },
    {
      title: 'Типы без TypeScript: JSDoc',
      body: [
        'Пишешь на JavaScript? Опиши пропсы в комментарии [[jsdoc|JSDoc]] и включи `// @ts-check` — редактор (например, VS Code) проверит их так же, как TypeScript.',
      ],
      code: '// @ts-check\n\n/**\n * @param {{\n *   name: string,\n *   quantity?: number,\n *   onDelete: (id: number) => void\n * }} props\n */\nfunction ProductCard({ name, quantity = 1, onDelete }) {\n  return <li>{name}</li>;\n}',
    },
    {
      title: 'Что убрали в React 19',
      body: [
        '- [[proptypes|propTypes]] — проверки молча игнорируются, ошибок в консоли не будет;',
        '- [[defaultprops|defaultProps]] у функций-компонентов — вместо них значения по умолчанию в деструктуризации (у классовых компонентов defaultProps остались).',
      ],
      code: "// ❌ в React 19 не работает для функций\nButton.defaultProps = { size: 'm' };\n\n// ✅ так\nfunction Button({ size = 'm' }) { … }",
      key: 'Видишь в старом коде propTypes или defaultProps — переводи на TypeScript и значения по умолчанию.',
    },
    {
      title: 'Все пропсы HTML-элемента сразу',
      body: ['Чтобы своя кнопка принимала все атрибуты обычной кнопки, расширь её тип через `ComponentProps`.'],
      code: "import type { ComponentProps } from 'react';\n\ntype ButtonProps = ComponentProps<'button'> & {\n  variant?: 'primary' | 'ghost';\n};\n\nfunction Button({ variant = 'primary',\n  ...rest }: ButtonProps) {\n  return <button className={variant} {...rest} />;\n}",
    },
  ],

  spell: {
    text: 'Типы — это договор: что дают и что берут.',
    meaning: '[[typescript|TypeScript]] следит, чтобы родитель и ребёнок соблюдали договор о пропсах.',
  },

  practice: [
    {
      id: 'types-1',
      type: 'choice',
      question: 'Как в TypeScript сделать проп необязательным?',
      options: [
        { text: '`count?: number`', correct: true },
        { text: '`count: number | optional`', why: 'Слова optional в TypeScript нет.' },
        { text: '`optional count: number`', why: 'Такого синтаксиса нет.' },
        { text: '`count!: number`', why: '`!` в типе означает другое — утверждение «точно не пусто».' },
      ],
      explain: 'Знак `?` после имени свойства делает его необязательным: внутри значение может быть undefined.',
    },
    {
      id: 'types-2',
      type: 'truefalse',
      statement: 'В React 19 propTypes выводят ошибку в консоль, если тип пропса неверный.',
      answer: false,
      explain: 'propTypes удалены — React 19 их просто не проверяет. Проверка типов теперь — работа TypeScript.',
    },
    {
      id: 'types-3',
      type: 'choice',
      question: 'Что скажет TypeScript?',
      code: 'type Props = { title: string };\nfunction Card({ title }: Props) {\n  return <h2>{title}</h2>;\n}\n\n<Card titel="Сыр" />',
      options: [
        { text: 'Ошибка: свойства `titel` нет, а `title` не передан', correct: true },
        { text: 'Ничего: лишние пропсы разрешены', why: 'Для литералов JSX TypeScript проверяет и лишние, и недостающие пропсы.' },
        { text: 'Ошибка появится только в браузере', why: 'TypeScript проверяет ещё в редакторе, до запуска.' },
        { text: 'React выведет предупреждение propTypes', why: 'propTypes в React 19 не работают.' },
      ],
      explain: 'Опечатка в имени пропса — классика. TypeScript подчеркнёт её сразу.',
    },
    {
      id: 'types-4',
      type: 'fill',
      question: 'Опиши тип для children.',
      code: 'type CardProps = {\n  children?: React.___;\n};',
      answers: ['ReactNode'],
      bank: ['ReactNode', 'Element', 'string', 'Children'],
      explain: '`React.ReactNode` — самый широкий тип «что угодно, что можно нарисовать».',
    },
    {
      id: 'types-5',
      type: 'bug',
      question: 'Какая строка не сработает в React 19?',
      code: "function Button({ size, label }) {\n  return <button className={size}>{label}</button>;\n}\n\nButton.defaultProps = { size: 'm' };",
      bugLine: 5,
      fix: "function Button({ size = 'm', label }) {",
      explain: 'defaultProps для функций-компонентов в React 19 удалены. Значение по умолчанию задают при деструктуризации.',
    },
    {
      id: 'types-6',
      type: 'sort',
      question: 'Работает ли это в React 19 для функции-компонента?',
      bins: ['Работает', 'Не работает'],
      items: [
        { text: "Значение по умолчанию `({ size = 'm' })`", bin: 0 },
        { text: '`Component.defaultProps = {…}`', bin: 1 },
        { text: '`Component.propTypes = {…}`', bin: 1 },
        { text: 'Тип пропсов в TypeScript', bin: 0 },
        { text: 'JSDoc + `// @ts-check`', bin: 0 },
        { text: '`ref` как обычный проп', bin: 0 },
      ],
      explain: 'React 19 упростил API: значения по умолчанию — в JavaScript, проверки — в TypeScript, ref — обычный проп.',
    },
    {
      id: 'types-7',
      type: 'match',
      question: 'Соедини запись и её смысл.',
      pairs: [
        ['`?` после имени', 'Необязательный проп'],
        ['`ReactNode`', 'Всё, что можно нарисовать'],
        ["`ComponentProps<'button'>`", 'Все пропсы обычной кнопки'],
        ['`// @ts-check`', 'Проверка типов в JS-файле'],
      ],
      explain: 'Эти четыре приёма покрывают большинство задач с типами пропсов.',
    },
    {
      id: 'types-8',
      type: 'choice',
      question: 'Когда TypeScript находит ошибку в пропсах?',
      options: [
        { text: 'В редакторе и при сборке — до запуска', correct: true },
        { text: 'Только в браузере', why: 'Типы проверяются до запуска; в браузер попадает обычный JS без типов.' },
        { text: 'Только на сервере', why: 'Проверка типов не связана с сервером.' },
        { text: 'После публикации на GitHub', why: 'Ошибки видны сразу при написании кода.' },
      ],
      explain: 'Типы существуют только на этапе разработки: при сборке они стираются.',
    },
  ],

  explain: {
    prompt: 'Объясни Лунатику: зачем описывать типы пропсов и что изменилось в React 19?',
    starters: ['Типы пропсов — это…', 'Они помогают…', 'В React 19 убрали…'],
    keywords: [
      { label: 'Типы — договор, ловят ошибки заранее', words: ['договор', 'ошибк', 'заранее', 'редактор', 'до запуска'] },
      { label: 'propTypes удалены', words: ['proptypes'] },
      { label: 'defaultProps → значения по умолчанию', words: ['defaultprops', 'по умолчанию'] },
    ],
    model:
      'Типы пропсов — договор между родителем и ребёнком: какие пропсы нужны и какого вида. TypeScript проверяет его в редакторе и ловит ошибки до запуска. В React 19 убрали propTypes (теперь проверяет TypeScript) и defaultProps для функций (теперь — значения по умолчанию в деструктуризации).',
  },
};
