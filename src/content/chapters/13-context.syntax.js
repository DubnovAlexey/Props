// Разбор кода и схемы к карточкам пещеры 13. Ключ — заголовок карточки.
export default {
  'Бурение пропсов': {
    why: '`Page` и `List` проп `user` не используют — только передают дальше. Каждый уровень вынужден знать о `user`, а переименование пропа — это правка во всех файлах. Это и есть бурение (prop drilling).',
    alt: [
      {
        code: 'function Page({ user }) {\n  return <List user={user} />;\n}',
        note: 'На 2–3 уровнях бурение — нормально: явно видно, откуда данные. Проблемой оно становится на длинных цепочках.',
      },
    ],
    wrong: [
      {
        code: 'window.currentUser = user;\n\nfunction Card() {\n  return <p>{window.currentUser.name}</p>;\n}',
        why: 'Глобальная переменная обходит React: при смене пользователя никто не перерисуется, и экран покажет старые данные.',
      },
    ],
  },
  'Сначала попробуй композицию': {
    scheme: {
      type: 'compare',
      left: { title: 'Бурение', tone: 'bad', items: ['App → Page → List → Card', '`user` проходит через всех', 'посредники знают лишнее'] },
      right: {
        title: 'Композиция',
        tone: 'good',
        items: ['App сам создаёт `<Card user={user} />`', 'Page и List рисуют `{children}`', 'посредники не знают про user'],
      },
    },
    why: '`App` сам создаёт `<Card user={user} />` и передаёт готовый элемент внутрь `Page` и `List` как children. Посредники просто вставляют `{children}` и ничего не знают о `user`.',
    alt: [
      {
        code: '<Page sidebar={<UserMenu user={user} />}>\n  <List />\n</Page>',
        note: 'Готовый элемент можно передать и в именованный слот.',
      },
    ],
    wrong: [
      {
        code: 'function List() {\n  return <ul className="list" />;\n}',
        why: 'Посредник забыл `{children}` — карточка, которую передал App, исчезнет.',
      },
    ],
  },
  'Context — радиовещание для поддерева': {
    scheme: {
      type: 'steps',
      steps: [
        { title: 'Создаём станцию', code: 'const UserContext = createContext(null);' },
        { title: 'Включаем вещание над поддеревом', code: '<UserContext value={user}>', tone: 'main' },
        {
          title: 'Любой потомок настраивается на волну',
          code: 'useContext(UserContext)',
          tone: 'good',
          sub: 'промежуточные компоненты ничего не передают',
        },
      ],
    },
    why: '`createContext` создаёт канал со значением по умолчанию. В React 19 сам контекст работает как провайдер: `<UserContext value={…}>`. `useContext` в любом потомке получает значение ближайшего провайдера выше по дереву.',
    alt: [
      {
        code: '<UserContext.Provider value={user}>\n  <Page />\n</UserContext.Provider>',
        note: 'Старая запись с `.Provider` — в React 19 ещё работает.',
      },
      {
        code: "import { use } from 'react';\n\nfunction Card({ show }) {\n  if (!show) return null;\n  const user = use(UserContext);\n  return <p>{user.name}</p>;\n}",
        note: 'В React 19 контекст можно читать функцией `use` — её, в отличие от хуков, разрешено вызывать после условия.',
      },
    ],
    wrong: [
      {
        code: '<UserContext>\n  <Page />\n</UserContext>',
        why: 'Провайдер без `value` передаст undefined — даже не значение по умолчанию.',
      },
      {
        code: '<Card />  {/* снаружи провайдера */}\n\n// внутри Card:\nconst user = useContext(UserContext); // null\nuser.name; // TypeError',
        why: 'Вне провайдера приходит значение по умолчанию — здесь `null`, и обращение к полю падает.',
      },
    ],
  },
  'Ближайший провайдер и значение по умолчанию': {
    scheme: {
      type: 'tree',
      root: {
        name: "ThemeContext 'day'",
        tone: 'main',
        children: [
          { name: 'A', note: "видит 'day'" },
          { name: "ThemeContext 'night'", tone: 'gold', children: [{ name: 'B', note: "видит 'night' — ближайший" }] },
        ],
      },
      caption: "`C` стоит вне провайдеров и получает значение по умолчанию из `createContext('night')`.",
    },
    why: '`useContext` ищет провайдер вверх по дереву и берёт значение ближайшего. Провайдеров выше нет — берёт значение по умолчанию из `createContext`.',
    alt: [
      {
        code: 'function useTheme() {\n  return useContext(ThemeContext);\n}\n\nconst theme = useTheme();',
        note: 'Свой хук-обёртка: короче и прячет детали контекста.',
      },
    ],
    wrong: [
      {
        code: 'function A() {\n  const theme = useContext(ThemeContext);\n  return (\n    <ThemeContext value="day">\n      <p>{theme}</p>\n    </ThemeContext>\n  );\n}',
        why: 'Компонент не видит провайдер, который сам рендерит: `theme` придёт сверху, а `day` получат только потомки.',
      },
    ],
  },
  'Цена контекста': {
    scheme: {
      type: 'steps',
      title: 'Почему перерисовываются все читатели',
      steps: [
        { title: 'App перерисовался' },
        { title: 'Литерал создаёт новый объект', code: 'value={{ user, logout }}', tone: 'gold' },
        { title: 'Object.is(старый, новый) → false' },
        { title: 'Все читатели контекста перерисовываются', tone: 'bad' },
        { title: 'useMemo: та же ссылка, пока user и logout прежние', tone: 'good' },
      ],
    },
    why: 'Когда значение провайдера меняется (по `Object.is`), перерисовываются ВСЕ его читатели. Литерал `{{ user, logout }}` — новый объект при каждом рендере, то есть «изменение» всегда. `useMemo` сохраняет ту же ссылку, пока зависимости не изменились.',
    alt: [
      {
        code: '<UserContext value={user}>\n  <LogoutContext value={logout}>\n    <Page />\n  </LogoutContext>\n</UserContext>',
        note: 'Разделить контекст: компоненты, которым нужен только `logout`, не перерисуются при смене `user`.',
      },
    ],
    wrong: [
      {
        code: 'const auth = useMemo(\n  () => ({ user, logout }), []);',
        why: 'Пустые зависимости: объект создастся один раз и навсегда запомнит первого `user`. Все читатели увидят устаревшие данные.',
      },
    ],
  },
};
