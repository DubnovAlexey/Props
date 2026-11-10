// Пещера 13. Тайный ход: prop drilling и Context.
export default {
  id: 'context',
  order: 13,
  icon: '🕳️',
  color: '#818cf8',
  cave: 'Тайный ход',
  title: 'Prop drilling и Context',
  goal: 'Понять, когда передавать пропсы по цепочке становится тяжело, и как Context решает эту проблему.',
  breakRound: 'hooks',

  pretest: {
    question: 'Проп `user` передаётся через 4 компонента, но нужен только последнему. Как называется эта проблема?',
    options: [{ text: 'Prop drilling', correct: true }, { text: 'Prop leaking' }, { text: 'Lifting state' }, { text: 'Overrendering' }],
    explain: '«Бурение» пропсов — передача через уровни, которым проп не нужен.',
  },

  lesson: [
    {
      title: 'Бурение пропсов',
      body: [
        'Иногда данные нужны глубоко внизу, а промежуточные компоненты лишь передают их дальше. Это [[prop-drilling|prop drilling]]: каждый уровень вынужден знать о пропсе, который ему не нужен.',
      ],
      diagram: 'drilling',
      code: 'function App({ user }) {\n  return <Page user={user} />;\n}\nfunction Page({ user }) {\n  return <List user={user} />; // не нужен\n}\nfunction List({ user }) {\n  return <Card user={user} />; // не нужен\n}\nfunction Card({ user }) {\n  return <p>{user.name}</p>;   // нужен тут\n}',
      key: 'Передача через два-три уровня — нормально и даже хорошо: видно, откуда данные. Проблема — длинные и хрупкие цепочки.',
    },
    {
      title: 'Сначала попробуй композицию',
      body: [
        'Часто drilling лечится [[composition|композицией]]: передай готовый JSX через [[children|children]] — и промежуточным компонентам не нужно знать про `user`.',
      ],
      code: 'function App({ user }) {\n  return (\n    <Page>\n      <List>\n        <Card user={user} />\n      </List>\n    </Page>\n  );\n}',
      highlight: [5],
      key: 'Совет из документации React: прежде чем звать Context, попробуй передать JSX через children.',
    },
    {
      title: 'Context — радиовещание для поддерева',
      body: [
        '[[context|Context]] работает как радиостанция: [[provider|провайдер]] вещает значение, а любой компонент ниже может «настроиться» на волну через [[usecontext|useContext]].',
      ],
      code: "import { createContext, useContext } from 'react';\n\nconst UserContext = createContext(null);\n\nfunction App({ user }) {\n  return (\n    <UserContext value={user}>\n      <Page />\n    </UserContext>\n  );\n}\n\nfunction Card() {\n  const user = useContext(UserContext);\n  return <p>{user.name}</p>;\n}",
      highlight: [7, 14],
      key: 'В React 19 провайдер пишется как `<UserContext value={…}>`. Старая запись `<UserContext.Provider>` пока работает, но устаревает.',
    },
    {
      title: 'Ближайший провайдер и значение по умолчанию',
      body: [
        '`useContext` ищет **ближайший** провайдер выше по дереву. Если провайдера нет, вернётся значение по умолчанию из `createContext`.',
        'Провайдеры можно вкладывать: внутренний перекрывает внешний.',
      ],
      code: "const ThemeContext = createContext('night');\n\n<ThemeContext value=\"day\">\n  <A />          {/* A видит 'day' */}\n  <ThemeContext value=\"night\">\n    <B />        {/* B видит 'night' */}\n  </ThemeContext>\n</ThemeContext>\n<C />            {/* C: по умолчанию 'night' */}",
      after: [
        'В React 19 значение контекста можно прочитать и через [[use|use]]`(ThemeContext)` — его, в отличие от хуков, разрешено вызывать внутри `if`.',
      ],
    },
    {
      title: 'Цена контекста',
      body: [
        'Когда значение провайдера меняется (сравнение через [[object-is|Object.is]]), перерисовываются **все** компоненты, которые читают этот контекст.',
        'Объект, созданный прямо в `value`, будет новым при каждом рендере провайдера.',
      ],
      code: '// новый объект при каждом рендере App\n<AuthContext value={{ user, logout }}>\n\n// та же ссылка, пока user и logout не изменились\nconst auth = useMemo(\n  () => ({ user, logout }), [user, logout]);\n<AuthContext value={auth}>',
      key: 'Context — не замена всем пропсам. Используй его для действительно общих данных: тема, текущий пользователь, язык.',
    },
  ],

  spell: {
    text: 'Если пропс идёт сквозь пять дверей — тайный ход Context найди скорей!',
    meaning: 'Длинная цепочка передачи — повод попробовать [[composition|композицию]] или [[context|Context]].',
  },

  practice: [
    {
      id: 'context-1',
      type: 'truefalse',
      statement: 'Context полностью заменяет пропсы, и пропсы лучше вообще не использовать.',
      answer: false,
      explain:
        'Пропсы — основной способ передачи данных: они явные и понятные. Context — для данных, нужных многим компонентам на разной глубине.',
    },
    {
      id: 'context-2',
      type: 'fill',
      question: 'Создай контекст и провайдер (React 19).',
      code: 'const ThemeContext = ___(\'night\');\n\nfunction App() {\n  return (\n    <ThemeContext ___="day">\n      <Page />\n    </ThemeContext>\n  );\n}',
      answers: ['createContext', 'value'],
      bank: ['createContext', 'useContext', 'value', 'theme', 'Provider'],
      explain: '`createContext(значение по умолчанию)` создаёт контекст, `<ThemeContext value=…>` — провайдер в React 19.',
    },
    {
      id: 'context-3',
      type: 'choice',
      question: 'Что вернёт `useContext(ThemeContext)`, если выше нет провайдера?',
      code: "const ThemeContext = createContext('night');",
      options: [
        { text: "`'night'` — значение по умолчанию", correct: true },
        { text: '`undefined`', why: 'undefined был бы, только если createContext вызвать без аргумента.' },
        { text: 'Ошибку', why: 'Отсутствие провайдера не ошибка — для этого и есть значение по умолчанию.' },
        { text: '`null`', why: 'Значение по умолчанию здесь — строка night.' },
      ],
      explain: 'Значение по умолчанию используется, когда над компонентом нет ни одного провайдера.',
    },
    {
      id: 'context-4',
      type: 'choice',
      question:
        'Провайдер пишет `value={{ user }}` и перерисовывается каждую секунду из-за таймера. Что с компонентами, читающими этот контекст?',
      options: [
        { text: 'Перерисуются каждую секунду: value каждый раз новый объект', correct: true },
        {
          text: 'Не перерисуются, пока user тот же',
          why: 'Контекст сравнивает value по ссылке, а `{ user }` — новый объект на каждом рендере.',
        },
        { text: 'Перерисуются один раз', why: 'Новый объект появляется при каждом рендере провайдера.' },
        { text: 'Будет ошибка', why: 'Ошибки нет — только лишняя работа.' },
      ],
      explain: 'Стабилизируй value через `useMemo(() => ({ user }), [user])` — или вынеси таймер в отдельный компонент.',
    },
    {
      id: 'context-5',
      type: 'sort',
      question: 'Хороший ли это кандидат для Context?',
      bins: ['Да, в Context', 'Лучше пропсом'],
      items: [
        { text: 'Тема оформления (день/ночь)', bin: 0 },
        { text: 'Текущий пользователь', bin: 0 },
        { text: 'Язык интерфейса', bin: 0 },
        { text: 'Текст одной кнопки', bin: 1 },
        { text: 'Цена товара в карточке', bin: 1 },
        { text: '`onDelete` для одной карточки', bin: 1 },
      ],
      explain: 'Context — для «глобальных» данных, нужных многим. Локальные данные одного компонента передавай пропсами.',
    },
    {
      id: 'context-6',
      type: 'order',
      question: 'Как подключить Context?',
      items: [
        'Создать контекст: `createContext(значение по умолчанию)`',
        'Обернуть часть дерева провайдером `<Ctx value={…}>`',
        'В нужном компоненте вызвать `useContext(Ctx)`',
        'Использовать полученное значение в JSX',
      ],
      explain: 'Создать → обернуть провайдером → прочитать → использовать.',
    },
    {
      id: 'context-7',
      type: 'choice',
      question: 'Что документация React советует попробовать при prop drilling, прежде чем брать Context?',
      options: [
        { text: 'Композицию: передать JSX через children', correct: true },
        { text: 'Глобальную переменную', why: 'Глобальные переменные не вызывают перерисовку и ломают чистоту.' },
        {
          text: 'Хранить данные в localStorage',
          why: 'localStorage — хранилище браузера, а не способ передачи данных между компонентами.',
        },
        { text: 'forwardRef', why: 'forwardRef — про передачу ref, к drilling он отношения не имеет.' },
      ],
      explain: 'Часто достаточно перестроить дерево: родитель сам вставляет готовый `<Card user={user} />` через children.',
    },
    {
      id: 'context-8',
      type: 'bug',
      question: 'Найди строку с ошибкой.',
      code: 'function Card() {\n  const user = UserContext;\n  return <p>{user.name}</p>;\n}',
      bugLine: 2,
      fix: 'const user = useContext(UserContext);',
      explain:
        '`UserContext` — сам объект контекста, а не значение. Значение читают через `useContext(UserContext)` или `use(UserContext)`.',
    },
  ],

  explain: {
    prompt: 'Объясни Лунатику: что такое prop drilling и как его вылечить?',
    starters: ['Prop drilling — это когда…', 'Сначала можно попробовать…', 'А если не помогло…'],
    keywords: [
      { label: 'Drilling — передача через ненужные уровни', words: ['цепоч', 'уров', 'промежуточ', 'через'] },
      { label: 'Композиция через children', words: ['children', 'композиц'] },
      { label: 'Context с провайдером', words: ['context', 'контекст', 'провайдер', 'usecontext'] },
    ],
    model:
      'Prop drilling — когда проп передают по цепочке через компоненты, которым он не нужен. Сначала можно попробовать композицию: передать готовый JSX через children. Если данные нужны многим компонентам на разной глубине, помогает Context: провайдер задаёт значение, а нужный компонент читает его через useContext.',
  },
};
