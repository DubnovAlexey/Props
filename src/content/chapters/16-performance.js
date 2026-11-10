// Пещера 16. Пещера скорости: memo, ссылки и React Compiler.
export default {
  id: 'performance',
  order: 16,
  icon: '⚡',
  color: '#facc15',
  cave: 'Пещера скорости',
  title: 'memo, ссылки и скорость',
  goal: 'Понять, как пропсы связаны со скоростью: memo, useCallback, useMemo и React Compiler.',
  breakRound: 'hooks',

  pretest: {
    question: 'Компонент обёрнут в `memo`. Родитель передаёт `style={{ color: "red" }}`. Пропустит ли memo рендер?',
    options: [
      { text: 'Нет: каждый раз приходит новый объект', correct: true },
      { text: 'Да: содержимое ведь одинаковое' },
      { text: 'Да: memo сравнивает объекты глубоко' },
    ],
    explain: '`{{ … }}` в JSX создаёт новый объект при каждом рендере, а memo сравнивает по ссылке.',
  },

  lesson: [
    {
      title: 'Перерисовка — не всегда плохо',
      body: [
        'Перерисовка ребёнка вместе с родителем — нормальное поведение. React быстрый, а в DOM попадают только реальные изменения — это [[reconciliation|согласование]].',
        'Оптимизировать стоит, когда рендер действительно тяжёлый: большие списки, сложные вычисления, графики.',
      ],
      key: 'Сначала измерь (React DevTools → Profiler), потом оптимизируй. Оптимизация «на всякий случай» усложняет код.',
    },
    {
      title: 'memo — «та же посылка — не открываю»',
      body: [
        '[[memo|memo]] оборачивает компонент и пропускает рендер, если **все** пропсы равны прошлым по [[object-is|Object.is]]. Это [[shallow|поверхностное сравнение]].',
      ],
      diagram: 'memo',
      code: "import { memo } from 'react';\n\nconst ProductCard = memo(function ProductCard({\n  product, onDelete }) {\n  return <li>{product.name}</li>;\n});",
      key: 'memo сравнивает ссылки, а не содержимое. Новый объект или функция в пропсах — и memo бесполезен.',
    },
    {
      title: 'Враги memo: новые объекты и функции',
      body: ['Каждый рендер родителя заново создаёт объекты, массивы и функции, написанные прямо в JSX.'],
      code: "function List({ products }) {\n  return products.map(p => (\n    <ProductCard\n      key={p.id}\n      product={p}                   // та же ссылка\n      style={{ color: 'red' }}      // новый объект\n      onDelete={() => remove(p.id)} // новая функция\n    />\n  ));\n}",
      highlight: [6, 7],
    },
    {
      title: 'useCallback и useMemo — стабильные ссылки',
      body: [
        '[[usecallback|useCallback]] запоминает функцию, [[usememo|useMemo]] — результат вычисления. Новое значение появляется, только когда меняются [[deps|зависимости]].',
      ],
      code: 'const handleDelete = useCallback(id => {\n  setProducts(prev => prev.filter(p => p.id !== id));\n}, []);\n\nconst style = useMemo(\n  () => ({ color: theme.color }), [theme.color]);\n\n<ProductCard onDelete={handleDelete} style={style} />',
      key: 'useCallback и useMemo без memo у ребёнка почти ничего не дают: стабильная ссылка нужна тому, кто её сравнивает.',
    },
    {
      title: 'React Compiler — автопилот',
      body: [
        '[[react-compiler|React Compiler]] (стабильная версия 1.0 вышла в октябре 2025) сам расставляет мемоизацию при сборке. С ним ручные memo, useMemo и useCallback нужны гораздо реже.',
        'Но понимать ссылки всё равно нужно: компилятор полагается на то, что компоненты [[pure|чистые]], а пропсы никто не мутирует.',
      ],
      key: 'Компилятор оптимизирует только правильный код: чистые компоненты и неизменяемые данные.',
    },
    {
      title: 'memo не спасает от своего состояния и контекста',
      body: [
        'memo смотрит только на пропсы. Изменилось собственное состояние компонента или контекст, который он читает, — он перерисуется.',
      ],
      code: 'const Badge = memo(function Badge({ label }) {\n  const theme = useContext(ThemeContext);\n  // смена темы → перерисовка, несмотря на memo\n  return <span className={theme}>{label}</span>;\n});',
    },
  ],

  spell: {
    text: 'memo смотрит на ссылку, а не на начинку.',
    meaning: 'Одинаковый на вид, но новый объект — для [[memo|memo]] это другой проп.',
  },

  practice: [
    {
      id: 'performance-1',
      type: 'choice',
      question: 'Пропустит ли memo рендер, если родитель передаёт `onDelete={() => remove(id)}`?',
      options: [
        { text: 'Нет: стрелочная функция каждый раз новая', correct: true },
        { text: 'Да: функция та же по смыслу', why: 'По смыслу та же, но по ссылке — новая.' },
        { text: 'Да: memo игнорирует функции', why: 'memo сравнивает все пропсы, включая функции.' },
        { text: 'Зависит от браузера', why: 'Сравнение по ссылке работает одинаково везде.' },
      ],
      explain: 'Стабилизируй функцию через useCallback — или включи React Compiler.',
    },
    {
      id: 'performance-2',
      type: 'sort',
      question: 'Будут ли пропсы равны для memo между двумя рендерами родителя?',
      bins: ['Равны', 'Не равны'],
      items: [
        { text: '`count={5}` и снова `count={5}`', bin: 0 },
        { text: '`title="Сыр"` и снова `title="Сыр"`', bin: 0 },
        { text: "`style={{ color: 'red' }}` прямо в JSX", bin: 1 },
        { text: '`items={[1, 2]}` прямо в JSX', bin: 1 },
        { text: '`onClick={handleClick}` из `useCallback(…, [])`', bin: 0 },
        { text: '`onClick={() => go()}`', bin: 1 },
      ],
      explain: 'Примитивы равны по значению. Объекты, массивы и функции, созданные в JSX, — новые на каждом рендере.',
    },
    {
      id: 'performance-3',
      type: 'truefalse',
      statement: 'memo сравнивает пропсы глубоко, заглядывая во вложенные объекты.',
      answer: false,
      explain:
        'Сравнение поверхностное: каждый проп сравнивается со старым через Object.is. Своё сравнение можно передать вторым аргументом memo.',
    },
    {
      id: 'performance-4',
      type: 'fill',
      question: 'Сделай функцию стабильной для memo-ребёнка.',
      code: 'const handleDelete = ___(id => {\n  setItems(prev => prev.filter(i => i.id !== id));\n}, ___);',
      answers: ['useCallback', '[]'],
      bank: ['useCallback', 'useMemo', 'memo', '[]', '[id]', '{}'],
      hint: 'id — это параметр функции, а не внешнее значение.',
      explain: 'Функциональное обновление `prev => …` не зависит от внешних значений, поэтому зависимостей нет: `[]`.',
    },
    {
      id: 'performance-5',
      type: 'choice',
      question: 'Badge обёрнут в memo и читает ThemeContext. Тема поменялась, пропсы те же. Что будет?',
      options: [
        { text: 'Badge перерисуется: изменился контекст', correct: true },
        { text: 'Не перерисуется: пропсы те же', why: 'memo проверяет только пропсы; изменение контекста всё равно вызывает рендер.' },
        { text: 'Будет ошибка', why: 'memo и Context прекрасно работают вместе.' },
      ],
      explain: 'memo пропускает только рендеры «из-за родителя». Своё состояние и контекст по-прежнему обновляют компонент.',
    },
    {
      id: 'performance-6',
      type: 'choice',
      question: 'Когда useMemo для значения в пропсах имеет смысл?',
      options: [
        { text: 'Когда значение уходит в memo-ребёнка или считается долго', correct: true },
        { text: 'Всегда и для любых значений', why: 'Мемоизация тоже стоит памяти и усложняет код.' },
        { text: 'Для строк и чисел', why: 'Примитивы и так равны по значению.' },
        { text: 'Никогда', why: 'Иногда стабильная ссылка или кэш дорогого вычисления реально нужны.' },
      ],
      explain: 'useMemo — инструмент для конкретной проблемы, а не украшение каждого значения.',
    },
    {
      id: 'performance-7',
      type: 'truefalse',
      statement: 'С React Compiler можно мутировать пропсы — он сам всё оптимизирует.',
      answer: false,
      explain: 'Компилятор рассчитывает на чистые компоненты и неизменяемые данные. Мутации ломают его оптимизации.',
    },
    {
      id: 'performance-8',
      type: 'order',
      question: 'Как memo решает, перерисовывать ли компонент?',
      items: [
        'Родитель перерисовался',
        'React проверяет: обёрнут ли компонент в memo',
        'Сравнивает каждый проп со старым через `Object.is`',
        'Все равны — берёт прошлый результат и пропускает рендер',
      ],
      explain: 'Если хоть один проп не равен, компонент рендерится как обычно.',
    },
  ],

  explain: {
    prompt: 'Объясни Лунатику: почему memo не помогает, если в пропсах `style={{ … }}`?',
    starters: ['memo сравнивает…', 'Но {{ … }} в JSX…', 'Помочь может…'],
    keywords: [
      { label: 'Сравнение по ссылке (Object.is)', words: ['ссылк', 'object.is'] },
      { label: 'Новый объект при каждом рендере', words: ['новый', 'каждый рендер', 'каждом рендере', 'заново'] },
      { label: 'Решение: useMemo, вынести наружу или Compiler', words: ['usememo', 'usecallback', 'вынест', 'компилятор', 'compiler'] },
    ],
    model:
      'memo сравнивает каждый проп со старым по ссылке через Object.is. Запись style={{ … }} создаёт новый объект при каждом рендере родителя, поэтому для memo проп каждый раз «другой». Помогает useMemo, вынос объекта за пределы компонента или React Compiler.',
  },
};
