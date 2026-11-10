// Разбор кода и схемы к карточкам пещеры 14. Ключ — заголовок карточки.
export default {
  'Хук — способность для компонента': {
    scheme: {
      type: 'steps',
      title: 'Главные хуки — главные способности',
      steps: [
        { title: 'Память', code: 'useState', sub: 'хранит значение между рендерами', tone: 'main' },
        { title: 'Радио', code: 'useContext', sub: 'читает значение контекста' },
        { title: 'Связь с внешним миром', code: 'useEffect', sub: 'таймеры, подписки, заголовок страницы' },
        { title: 'Карман', code: 'useRef', sub: 'хранит без перерисовки: DOM-узел, id таймера' },
        { title: 'Свой хук', code: 'useЧтоУгодно', sub: 'набор способностей в одной функции', tone: 'good' },
      ],
    },
    why: 'Хук — функция с именем на `use`, которая даёт компоненту способность: память, чтение контекста, связь с внешним миром. Хуки вызывают в начале компонента, на верхнем уровне. Массив `[label, seconds]` говорит эффекту: «запускайся снова, когда изменится одно из этих значений».',
    alt: [
      {
        code: 'function Timer({ label, seconds }) {\n  return (\n    <>\n      <title>{`${label}: ${seconds}`}</title>\n      <p>{seconds}</p>\n    </>\n  );\n}',
        note: 'В React 19 `<title>` можно рендерить прямо в компоненте — React сам перенесёт его в `<head>`, эффект не нужен.',
      },
    ],
    wrong: [
      {
        code: 'function formatTime() {\n  const [seconds] = useState(0);\n  return `${seconds} с`;\n}',
        why: 'Хуки работают только внутри компонентов и своих хуков (имя на `use`). Из обычной функции — ошибка «Invalid hook call».',
      },
      {
        code: "useEffect(async () => {\n  const res = await fetch('/api');\n}, []);",
        why: 'Эффект должен вернуть функцию очистки или ничего, а async-функция возвращает Promise. Объяви async-функцию внутри эффекта и вызови её.',
      },
    ],
  },
  'Правила хуков': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Можно вызывать',
        tone: 'good',
        items: ['в начале компонента', 'в начале своего хука', 'всегда в одном и том же порядке'],
      },
      right: {
        title: 'Нельзя вызывать',
        tone: 'bad',
        items: ['внутри `if`, циклов, после раннего `return`', 'в обработчиках событий', 'в обычных функциях'],
      },
    },
    why: 'React не знает имён твоих хуков — он различает их по порядку вызова: первый `useState`, второй `useContext`… Если хук иногда пропускается, порядок сдвигается, и React отдаёт состояние не тому хуку. Поэтому сначала все хуки, потом условия.',
    alt: [
      {
        code: 'useEffect(() => {\n  if (!user) return; // условие — ВНУТРИ хука\n  document.title = user.name;\n}, [user]);',
        note: 'Нужна проверка — делай её внутри хука, а не вокруг него.',
      },
    ],
    wrong: [
      {
        code: 'function Profile({ user }) {\n  if (!user) return <p>Нет пользователя</p>;\n  const [open, setOpen] = useState(false);\n}',
        why: 'Когда `user` появится, хуков станет больше, чем в прошлый рендер, — ошибка «Rendered more hooks than during the previous render».',
      },
      {
        code: 'function handleClick() {\n  const [clicked, setClicked] = useState(true);\n}',
        why: 'Хук в обработчике события — «Invalid hook call». Состояние объявляют в компоненте, а в обработчике вызывают сеттер.',
      },
    ],
  },
  'useState глубже: обновление по старому значению': {
    scheme: {
      type: 'compare',
      left: {
        title: '`setCount(count + 1)` ×3',
        tone: 'bad',
        items: ['все три строки видят `count = 0`', '0 + 1, 0 + 1, 0 + 1', 'итог: 1'],
      },
      right: { title: '`setCount(c => c + 1)` ×3', tone: 'good', items: ['React передаёт свежее значение', '0 → 1 → 2 → 3', 'итог: 3'] },
    },
    why: '`count` — снимок значения на этот рендер, он не меняется до следующего. Функция `c => c + 1` получает самое свежее значение из очереди обновлений. Сеттер объекта не объединяет поля, а заменяет объект целиком, поэтому старые поля копируют через `...prev`.',
    alt: [
      { code: 'setCount(count + 3);', note: 'Если нужно сразу +3, проще одно обновление.' },
      { code: "setUser({ ...user, name: 'Граф' });", note: 'Без функции тоже можно, если за событие обновление одно.' },
    ],
    wrong: [
      {
        code: "setUser({ name: 'Граф' });",
        why: "Состояние заменится целиком: поле `age` пропадёт. Копируй старое: `{ ...prev, name: 'Граф' }`.",
      },
      {
        code: "user.name = 'Граф';\nsetUser(user);",
        why: 'Тот же объект: `Object.is` скажет «ничего не изменилось», и React может не перерисовать.',
      },
    ],
  },
  'useEffect — синхронизация с внешним миром': {
    scheme: {
      type: 'steps',
      title: 'Жизнь эффекта',
      steps: [
        { title: 'Рендер, экран обновлён', tone: 'main' },
        { title: 'Эффект запускается', code: 'setInterval(…)' },
        { title: '`intervalMs` изменился → очистка', code: 'clearInterval(id)', tone: 'gold' },
        { title: 'Эффект запускается с новым значением', code: 'setInterval(…, intervalMs)' },
        { title: 'Компонент убрали → последняя очистка', code: 'clearInterval(id)', tone: 'good' },
      ],
    },
    why: 'Эффект запускается ПОСЛЕ того, как изменения попали на экран. Функция, которую он возвращает, — очистка: React вызывает её перед следующим запуском и при удалении компонента. `useState(() => new Date())` — ленивое начальное значение: функция сработает только при первом рендере.',
    alt: [
      {
        code: 'function useNow(intervalMs) {\n  const [now, setNow] = useState(() => new Date());\n  useEffect(() => {\n    const id = setInterval(() => setNow(new Date()), intervalMs);\n    return () => clearInterval(id);\n  }, [intervalMs]);\n  return now;\n}\n\nconst now = useNow(1000);',
        note: 'Ту же логику можно вынести в свой хук и использовать в любых часах.',
      },
    ],
    wrong: [
      {
        code: 'useEffect(() => {\n  setInterval(() => setNow(new Date()), intervalMs);\n}, [intervalMs]);',
        why: 'Нет очистки: при смене интервала и после удаления компонента старые таймеры продолжат тикать — утечка. В StrictMode это видно сразу: тиков вдвое больше.',
      },
      {
        code: 'useEffect(() => {\n  setNow(new Date());\n});',
        why: 'Без массива зависимостей эффект запускается после КАЖДОГО рендера, а сеттер вызывает новый рендер — бесконечный цикл.',
      },
    ],
  },
  'Эффект не нужен, если можно вычислить': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Эффект нужен',
        tone: 'main',
        items: ['таймеры и интервалы', 'подписки: WebSocket, события окна', 'сторонние виджеты и DOM API'],
      },
      right: {
        title: 'Эффект не нужен',
        tone: 'gold',
        items: ['вычислить из пропсов и состояния', 'реакция на клик — в обработчике', 'сброс состояния — через `key`'],
      },
    },
    why: 'Эффект — мост к внешнему миру. Если значение получается из пропсов и состояния, это обычное вычисление во время рендера. Эффект здесь только добавит рендер со старым значением.',
    alt: [
      {
        code: 'const total = useMemo(\n  () => items.reduce((s, i) => s + i.price, 0),\n  [items],\n);',
        note: 'Вычисление тяжёлое — запомни результат через `useMemo`. С React Compiler и это часто не нужно.',
      },
    ],
    wrong: [
      {
        code: 'useEffect(() => {\n  onChange(value);\n}, [value]);',
        why: 'Сообщать родителю через эффект — лишний круг рендеров. Вызывай `onChange` прямо в обработчике события, где меняешь `value`.',
      },
    ],
  },
  'useRef, useReducer и свои хуки': {
    scheme: {
      type: 'compare',
      left: { title: 'useState', items: ['изменение → перерисовка', 'для того, что видно на экране'] },
      right: {
        title: 'useRef',
        tone: 'main',
        items: ['изменение `.current` → без перерисовки', 'для DOM-узла, id таймера, прошлого значения'],
      },
    },
    why: 'Свой хук — функция на `use`, внутри которой вызываются другие хуки. Хук делится ЛОГИКОЙ, а не состоянием: у каждого компонента, вызвавшего `useToggle`, своё `on`. Массив `[on, toggle]` позволяет назвать результат как угодно, как у `useState`.',
    alt: [
      {
        code: 'const [open, toggleOpen] = useReducer(v => !v, false);',
        note: 'То же одной строкой: `useReducer` с редьюсером «переверни значение».',
      },
      {
        code: 'function useToggle(initial = false) {\n  const [on, setOn] = useState(initial);\n  return { on, toggle: () => setOn(v => !v) };\n}\n\nconst { on, toggle } = useToggle();',
        note: 'Можно вернуть объект: имена фиксированы, зато порядок не важен.',
      },
    ],
    wrong: [
      {
        code: 'function Menu({ withMenu }) {\n  if (withMenu) {\n    const [open, toggleOpen] = useToggle();\n  }\n}',
        why: 'Свой хук подчиняется тем же правилам: внутри него `useState`, поэтому вызов в условии ломает порядок хуков.',
      },
      {
        code: 'function toggleLogic() {\n  const [on, setOn] = useState(false);\n  return [on, () => setOn(v => !v)];\n}',
        why: 'Без `use` в начале имени линтер не проверит правила хуков, а читатель не поймёт, что это хук и его нельзя звать в условиях.',
      },
    ],
  },
};
