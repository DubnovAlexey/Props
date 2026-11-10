// Разбор кода и схемы к карточкам пещеры 18. Ключ — заголовок карточки.
export default {
  'Управляемое поле: главный — React': {
    scheme: {
      type: 'steps',
      title: 'Круг управляемого поля',
      steps: [
        { title: 'Пользователь нажал клавишу' },
        { title: 'onChange вызывает сеттер', code: 'setDish(e.target.value)', tone: 'gold' },
        { title: 'React перерисовывает компонент' },
        { title: 'Поле показывает значение из состояния', code: 'value={dish}', tone: 'main' },
      ],
    },
    why: '`value` берётся из состояния, а `onChange` его обновляет — значит, главный источник правды React. В любой момент текст поля известен, его можно проверять и менять на каждом символе.',
    alt: [
      {
        code: '<input\n  value={dish}\n  onChange={e => setDish(e.target.value.toUpperCase())}\n/>',
        note: 'Управляемое поле позволяет сразу менять ввод — например, делать заглавные буквы.',
      },
    ],
    wrong: [
      {
        code: '<input value={dish} />',
        why: 'Без `onChange` поле станет только для чтения — React предупредит и посоветует `onChange`, `readOnly` или `defaultValue`.',
      },
      {
        code: 'const [dish, setDish] = useState();\n\n<input value={dish} onChange={…} />',
        why: "Сначала `value` = undefined (поле неуправляемое), потом строка (управляемое) — React предупредит о смене режима. Начинай с `useState('')`.",
      },
    ],
  },
  'Неуправляемое поле: значение живёт в DOM': {
    scheme: {
      type: 'compare',
      left: { title: 'Управляемое', items: ['`value` + `onChange`', 'значение — в состоянии', 'проверка на каждом символе'] },
      right: {
        title: 'Неуправляемое',
        tone: 'main',
        items: ['`defaultValue` + `name`', 'значение — в DOM', 'читаем при отправке: FormData или ref'],
      },
    },
    why: '`defaultValue` задаёт только начальный текст, дальше поле живёт само. При отправке значения достают через `FormData` по атрибуту `name`. `e.currentTarget` — сама форма, на которой висит обработчик.',
    alt: [
      {
        code: '<form action={formData => onSearch(formData.get(\'dish\'))}>\n  <input name="dish" defaultValue="Омлет" />\n  <button>Искать</button>\n</form>',
        note: 'React 19: функция в `action` сама получит FormData — `preventDefault` не нужен.',
      },
    ],
    wrong: [
      {
        code: '<input name="dish" value="Омлет" />',
        why: '`value` без `onChange` замораживает поле. Начальное значение неуправляемого поля — `defaultValue`.',
      },
      { code: '<input defaultValue="Омлет" />\n// data.get(\'dish\') → null', why: 'Без атрибута `name` поле не попадёт в FormData.' },
    ],
  },
  'Условный рендер и ловушка с нулём': {
    scheme: {
      type: 'compare',
      left: { title: 'Ничего не рисуют', tone: 'good', items: ['`false`', '`null`', '`undefined`'] },
      right: { title: 'Рисуются', tone: 'bad', items: ['`0` — появится «0»', "`''` — пустая строка (не видно)", '`NaN` — появится «NaN»'] },
    },
    why: '`a && b` возвращает `a`, если оно «ложное». `false` React не рисует, а `0` — это число, и числа React рисует. Поэтому слева от `&&` ставят настоящее булево: `count > 0`.',
    alt: [
      { code: '{count ? <Badge count={count} /> : null}', note: 'Тернарный оператор с явным `null`.' },
      { code: '{Boolean(count) && <Badge count={count} />}', note: '`Boolean(…)` или `!!count` превращают число в булево.' },
    ],
    wrong: [
      { code: '{items.length && <List items={items} />}', why: 'Пустой массив: `length` = 0, и на экране появится «0».' },
      {
        code: '{if (isLoading) <Spinner />}',
        why: '`if` — инструкция, а в фигурных скобках JSX можно только выражение. Используй `? :` или `&&`.',
      },
    ],
  },
  'Компонент может ничего не рисовать': {
    scheme: {
      type: 'steps',
      title: 'Правила ExpiryBadge сверху вниз',
      steps: [
        { title: 'daysLeft < 0', code: '<span>Просрочено</span>', tone: 'bad' },
        { title: 'daysLeft <= 2', code: '<span>Скоро истекает</span>', tone: 'gold' },
        { title: 'Иначе', code: 'return null — ничего', tone: 'good' },
      ],
    },
    why: '`return null` значит «ничего не рисовать». Компонент при этом существует, и его хуки работают. Ранние `return` читаются как список правил сверху вниз.',
    alt: [
      {
        code: '{daysLeft <= 2 && <ExpiryBadge daysLeft={daysLeft} />}',
        note: 'Решение можно перенести к родителю: он просто не рисует компонент.',
      },
    ],
    wrong: [
      {
        code: 'function ExpiryBadge() {\n  return {};\n}',
        why: 'Объект — не то, что можно нарисовать: ошибка «Objects are not valid as a React child». Для «ничего» — `null`.',
      },
      { code: "function ExpiryBadge() {\n  return 'null';\n}", why: 'Строка "null" — это текст: на экране появится слово «null».' },
    ],
  },
  'HOC — обёртка для компонента': {
    scheme: {
      type: 'steps',
      steps: [
        { title: 'Обычный компонент', code: 'Panel' },
        { title: 'Пропускаем через обёртку', code: "withRole(Panel, 'ADMIN')" },
        { title: 'Получаем новый компонент', code: 'Guarded', tone: 'main' },
        { title: 'Guarded проверяет роль', sub: 'рисует Panel со всеми пропсами — или «Доступ запрещён»', tone: 'good' },
      ],
    },
    why: 'HOC (компонент высшего порядка) — функция, которая принимает компонент и возвращает новый с дополнительным поведением. `{...props}` передаёт обёрнутому компоненту все пропсы без изменений.',
    alt: [
      {
        code: 'function RequireRole({ user, role, children }) {\n  return user?.role === role ? children : <p>Доступ запрещён</p>;\n}\n\n<RequireRole user={user} role="ADMIN">\n  <Panel />\n</RequireRole>',
        note: 'Современная замена — обычный компонент-обёртка с children. То же поведение, проще читать.',
      },
    ],
    wrong: [
      {
        code: "function Page() {\n  const Admin = withRole(Panel, 'ADMIN');\n  return <Admin />;\n}",
        why: 'HOC вызывается при каждом рендере и создаёт НОВЫЙ тип компонента: React каждый раз удаляет старый и монтирует новый, состояние сбрасывается. Вызывай HOC один раз — вне компонентов.',
      },
      {
        code: 'return function Guarded(props) {\n  return <Component />;\n};',
        why: 'Забыли `{...props}` — обёрнутый компонент не получит ни одного пропа.',
      },
    ],
  },
  'Пропсы в Kosmo: игрок видит только своё': {
    scheme: {
      type: 'tree',
      title: 'Kosmo, преферанс: от движка до карты',
      root: {
        name: 'Движок игры',
        note: 'знает все карты',
        tone: 'gold',
        children: [
          {
            name: 'playerView',
            note: 'срез для одного игрока',
            children: [
              {
                name: 'GameTable',
                down: 'view',
                up: 'onPlayCard, onBid',
                tone: 'main',
                children: [
                  { name: 'OpponentSeat ×2', down: 'name, cardCount', note: 'только число карт' },
                  { name: 'TrickArea', down: 'trick, trump' },
                  { name: 'BiddingPanel', down: 'availableBids', up: 'onBid' },
                  {
                    name: 'PlayerHand',
                    down: 'cards, playableIds',
                    up: 'onPlayCard',
                    children: [{ name: 'Card', down: 'card, isPlayable', up: 'onPlay' }],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    why: '`Array.from({ length: cardCount }, (_, i) => …)` создаёт массив из N рубашек. `_` — неиспользуемый первый аргумент (элемент), `i` — индекс. Ключ-индекс здесь допустим: рубашки одинаковые, без состояния, и порядок не меняется. Главное — сопернику передаётся только число карт, а не сами карты.',
    alt: [{ code: '[...Array(cardCount)].map((_, i) => <CardBack key={i} />)', note: 'Ещё один способ получить массив нужной длины.' }],
    wrong: [
      {
        code: '<OpponentSeat cards={opponent.cards} />\n// карты спрятаны через CSS',
        why: 'Карты всё равно окажутся в браузере — их видно в DevTools. Что игроку видеть нельзя, не должно попадать в пропсы.',
      },
      {
        code: 'Array(cardCount).map((_, i) => <CardBack key={i} />)',
        why: '`Array(3)` создаёт «дырявый» массив без элементов, и `map` пропускает пустые места — не нарисуется ни одной рубашки.',
      },
    ],
  },
};
