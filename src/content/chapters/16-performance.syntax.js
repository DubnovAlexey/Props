// Разбор кода и схемы к карточкам пещеры 16. Ключ — заголовок карточки.
export default {
  'Перерисовка — не всегда плохо': {
    scheme: {
      type: 'compare',
      left: {
        title: 'Рендер — это',
        tone: 'good',
        items: ['вызов функции компонента', 'сравнение новых элементов со старыми', 'обычно — доли миллисекунды'],
      },
      right: {
        title: 'Оптимизируй, если',
        tone: 'gold',
        items: [
          'тысячи элементов в списке',
          'тяжёлые вычисления в теле компонента',
          'тормоза видны — сначала измерь в React DevTools (Profiler)',
        ],
      },
    },
  },
  'memo — «та же посылка — не открываю»': {
    why: '`memo` оборачивает компонент. Перед перерисовкой React сравнивает каждый проп со старым через `Object.is`. Все совпали — рендер пропускается. Функция внутри `memo` названа (`function ProductCard`), чтобы имя было видно в DevTools.',
    alt: [
      {
        code: 'function ProductCard({ product }) {\n  return <li>{product.name}</li>;\n}\n\nexport default memo(ProductCard);',
        note: 'Можно объявить компонент отдельно и обернуть при экспорте.',
      },
      {
        code: 'const ProductCard = memo(\n  Card,\n  (prev, next) => prev.product.id === next.product.id,\n);',
        note: 'Своё сравнение вторым аргументом: вернул true — рендер пропущен. Осторожно: забудешь проп — компонент покажет устаревшее.',
      },
    ],
    wrong: [
      {
        code: 'const Fast = memo(<ProductCard />);',
        why: '`memo` принимает компонент (функцию), а не элемент — React предупредит, что первый аргумент должен быть компонентом.',
      },
      {
        code: "product.name = 'Новое';\nsetProducts([...products]);",
        why: 'Массив новый, но объект `product` — тот же. memo сравнит ссылку, решит «не изменилось» — и карточка покажет старое имя.',
      },
    ],
  },
  'Враги memo: новые объекты и функции': {
    scheme: {
      type: 'compare',
      left: { title: 'Каждый рендер — новое', tone: 'bad', items: ['`style={{ … }}`', '`onDelete={() => …}`', '`items={[…]}`'] },
      right: { title: 'Та же ссылка', tone: 'good', items: ['константа вне компонента', '`useMemo` и `useCallback`', 'React Compiler'] },
    },
    why: "`{{ color: 'red' }}` и `() => remove(p.id)` создаются заново при каждом рендере `List`. Для `Object.is` новый объект — всегда «другой», поэтому `memo` у `ProductCard` каждый раз решает: пропсы изменились.",
    alt: [
      {
        code: "const RED = { color: 'red' }; // вне компонента — одна ссылка\n\n<ProductCard style={RED} onDelete={remove} />\n// внутри: onDelete(product.id)",
        note: 'Постоянный объект — за пределы компонента. Функцию — передать без обёртки, пусть ребёнок сам вызовет её с id.',
      },
    ],
    wrong: [
      {
        code: 'products.map(p => {\n  const onDelete = useCallback(() => remove(p.id), [p.id]);\n  return <ProductCard key={p.id} onDelete={onDelete} />;\n});',
        why: 'Хук внутри `map` — это хук в цикле. Количество хуков меняется вместе со списком — правила хуков нарушены.',
      },
    ],
  },
  'useCallback и useMemo — стабильные ссылки': {
    scheme: {
      type: 'compare',
      left: { title: 'useCallback', items: ['запоминает функцию', '`useCallback(fn, deps)`', 'для пропов-обработчиков'] },
      right: {
        title: 'useMemo',
        tone: 'main',
        items: ['запоминает результат вычисления', '`useMemo(() => value, deps)`', 'для объектов и тяжёлых расчётов'],
      },
    },
    why: 'Пока зависимости не изменились, оба хука возвращают ту же ссылку — и `memo` у ребёнка срабатывает. Обновление `prev => prev.filter(…)` не читает `products` напрямую, поэтому зависимости могут быть пустыми.',
    alt: [
      {
        code: 'const handleDelete = useMemo(\n  () => id => setProducts(prev => prev.filter(p => p.id !== id)),\n  [],\n);',
        note: '`useCallback(fn, deps)` — то же, что `useMemo(() => fn, deps)`. Запись с useCallback короче.',
      },
    ],
    wrong: [
      {
        code: 'const handleDelete = useCallback(id => {\n  setProducts(products.filter(p => p.id !== id));\n}, []);',
        why: 'Функция запомнила `products` первого рендера (устаревшее замыкание). Удаление будет фильтровать старый список и возвращать удалённое.',
      },
      {
        code: 'const style = useMemo(() => ({ color: theme.color }));',
        why: 'Без массива зависимостей `useMemo` пересчитывает значение при каждом рендере — пользы ноль.',
      },
    ],
  },
  'React Compiler — автопилот': {
    scheme: {
      type: 'steps',
      steps: [
        { title: 'Пишешь обычный код', sub: 'без memo, useMemo и useCallback' },
        { title: 'Компилятор при сборке разбирает компонент', tone: 'main' },
        { title: 'Сам добавляет мемоизацию', sub: 'объекты и функции получают стабильные ссылки' },
        { title: 'Лишние рендеры пропущены', tone: 'good', sub: 'если код соблюдает правила React: чистота, правила хуков, без мутаций' },
      ],
    },
  },
  'memo не спасает от своего состояния и контекста': {
    scheme: {
      type: 'compare',
      left: { title: 'memo остановит', tone: 'good', items: ['рендер родителя при тех же пропсах'] },
      right: {
        title: 'memo НЕ остановит',
        tone: 'bad',
        items: ['изменение своего состояния', 'изменение контекста, который читает компонент', 'новые пропсы'],
      },
    },
    why: '`memo` сравнивает только пропсы. Своё состояние и контекст — другие причины перерисовки, и это правильно: иначе компонент показывал бы устаревшие данные.',
    alt: [
      {
        code: '<ThemeContext value={theme}>\n  <UserContext value={user}>\n    <Page />\n  </UserContext>\n</ThemeContext>',
        note: 'Чтобы перерисовывалось меньше компонентов, раздели большой контекст на маленькие: `Badge` будет зависеть только от темы.',
      },
    ],
    wrong: [
      {
        code: '<ThemeContext value={{ color, size }}>',
        why: 'Новый объект при каждом рендере провайдера: все читатели перерисуются, и `memo` их не спасёт. Стабилизируй значение через `useMemo`.',
      },
    ],
  },
};
