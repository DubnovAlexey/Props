// «Анатомия кода»: разбирает любой пример на синтаксические конструкции
// и объясняет каждую простыми словами. Работает для всего кода в игре —
// в уроках, словаре, разборах и заданиях — без ручной разметки.
//
// Как это устроено:
// 1. tokenizeLine режет строки на токены (теги, строки, скобки, имена…).
// 2. Проходим по токенам и смотрим на соседей и «стек» скобок и тегов:
//    одна и та же «{» бывает и выражением в атрибуте, и деструктуризацией,
//    и объектом — смысл определяет контекст.
// 3. Каждому токену назначаем id конструкции (cid), а для списка
//    собираем уникальные конструкции в порядке появления.
import { splitLines, tokenizeLine } from './highlight.js';

/** Справочник конструкций: заголовок, «простыми словами», «почему так», термин словаря */
export const CONSTRUCTS = {
  comment: {
    title: 'Комментарий',
    sample: '// …',
    simple: 'Пояснение для людей: от // до конца строки код игнорирует.',
    why: 'Хороший комментарий объясняет «зачем», а не пересказывает код.',
  },
  'component-decl': {
    title: 'Объявление компонента',
    sample: 'function Имя()',
    simple: 'function с именем с большой буквы — компонент: функция, которая возвращает JSX.',
    why: 'По большой букве React отличает твой компонент от HTML-тега.',
    term: 'component',
  },
  'function-decl': {
    title: 'Объявление функции',
    sample: 'function имя()',
    simple: 'Обычная функция: обработчик события или помощник.',
    why: 'Имя с маленькой буквы — значит, это не компонент.',
  },
  return: {
    title: 'return — результат функции',
    simple: 'Что функция отдаёт наружу. Компонент возвращает JSX — описание интерфейса.',
    why: 'Многострочный JSX после return оборачивают в ( ), иначе JavaScript поставит точку с запятой сразу после return и вернёт undefined.',
  },
  const: {
    title: 'const / let — переменная',
    simple: 'const — переменную нельзя переприсвоить, let — можно.',
    why: 'В React почти всё объявляют через const: новое значение — это новый объект, а не перезапись старого.',
  },
  'destructure-props': {
    title: 'Распаковка аргумента',
    sample: '({ … })',
    simple: '{ … } в скобках параметров сразу достаёт нужные свойства из объекта пропсов.',
    why: 'Короче, чем props.title, и по первой строке видно, какие пропсы ждёт компонент.',
    term: 'destructuring',
  },
  'destructure-object': {
    title: 'Деструктуризация объекта',
    sample: 'const { … } =',
    simple: 'Достаёт свойства объекта в переменные с теми же именами.',
    term: 'destructuring',
  },
  'destructure-array': {
    title: 'Деструктуризация массива',
    sample: 'const [a, setA] =',
    simple: 'Берёт элементы массива по порядку. Так из useState получают значение и сеттер.',
    why: 'Имена выбираешь сам: [count, setCount], [name, setName].',
    term: 'destructuring',
  },
  'default-value': {
    title: 'Значение по умолчанию',
    sample: 'имя = значение',
    simple: 'Подставится, если проп не передан (undefined).',
    why: 'Не срабатывает для null, 0 и пустой строки — они считаются переданными.',
    term: 'default-value',
  },
  arrow: {
    title: 'Стрелочная функция',
    sample: '() =>',
    simple: '(аргументы) => результат — короткая запись функции.',
    why: 'В onClick={() => onDelete(id)} стрелка откладывает вызов до клика.',
    term: 'arrow-function',
  },
  'jsx-component': {
    title: 'Тег своего компонента',
    sample: '<Имя …>',
    simple: 'С большой буквы — твой компонент. Его атрибуты соберутся в объект пропсов.',
    term: 'component',
  },
  'jsx-tag': {
    title: 'HTML-тег в JSX',
    sample: '<div>',
    simple: 'Встроенный тег браузера. Его атрибуты станут свойствами DOM-элемента.',
    term: 'jsx',
  },
  'jsx-tag-end': {
    title: 'Конец открывающего тега',
    sample: '>',
    simple: 'Дальше начинается содержимое тега — то, что попадёт в children.',
    term: 'children',
  },
  'jsx-close': {
    title: 'Закрывающий тег',
    sample: '</Имя>',
    simple: 'Закрывает тег. Всё между открывающим и закрывающим — содержимое (children).',
    term: 'children',
  },
  'jsx-selfclose': {
    title: 'Самозакрывающийся тег',
    sample: '/>',
    simple: 'Закрывает тег без содержимого.',
    why: 'В JSX закрывать обязательно: <img />, <input />, <Card />. Иначе — синтаксическая ошибка.',
  },
  fragment: {
    title: 'Фрагмент <> </>',
    sample: '<>…</>',
    simple: 'Невидимая обёртка: позволяет вернуть несколько элементов без лишнего <div>.',
    term: 'fragment',
  },
  attr: {
    title: 'Атрибут → проп',
    sample: 'имя=',
    simple: 'имя=значение у компонента становится свойством объекта пропсов.',
    term: 'attribute',
  },
  'attr-string': {
    title: 'Строка в кавычках',
    sample: '"…"',
    simple: 'Значение в кавычках — всегда строка.',
    why: 'Числа, true/false, объекты и функции передают в фигурных скобках: count={2}.',
  },
  'jsx-expr': {
    title: 'Выражение в атрибуте',
    sample: '={ … }',
    simple: 'Внутри { } — JavaScript: число, переменная, функция, объект.',
    why: 'Кавычки дали бы строку, а скобки передают значение как есть.',
    term: 'expression',
  },
  'double-brace': {
    title: 'Двойные скобки {{ }}',
    sample: '{{ … }}',
    simple: 'Внешние { } — «окно в JavaScript», внутренние — объект.',
    why: 'Это не особый синтаксис: просто объект внутри выражения.',
    term: 'style-object',
  },
  object: {
    title: 'Объект { ключ: значение }',
    sample: '{ ключ: … }',
    simple: 'Набор пар «ключ — значение». Так выглядит и объект пропсов.',
  },
  'jsx-child-expr': {
    title: 'Значение внутри разметки',
    sample: '{ … }',
    simple: '{значение} между тегами выводит значение на экран.',
    why: 'Внутри — только выражение: if и for нельзя, вместо них ? : и .map().',
    term: 'expression',
  },
  block: { title: 'Блок кода { }', sample: '{ … }', simple: 'Фигурные скобки группируют код: тело функции, ветку if.' },
  array: { title: 'Массив [ ]', sample: '[ … ]', simple: 'Список значений по порядку.' },
  index: { title: 'Обращение по индексу', sample: 'arr[0]', simple: 'Элемент массива по номеру, счёт с нуля.' },
  spread: {
    title: 'Spread ...',
    sample: '...obj',
    simple: 'Высыпает свойства объекта или элементы массива. В JSX {...props} передаёт их отдельными пропсами.',
    why: 'Копия поверхностная; кто записан позже, тот и побеждает.',
    term: 'spread',
  },
  rest: {
    title: 'Rest ...остальное',
    sample: '...rest',
    simple: 'Собирает «всё остальное» в новый объект.',
    why: 'Удобно передать неиспользованные пропсы дальше: {...rest}.',
    term: 'rest',
  },
  'optional-chaining': {
    title: '?. — безопасное обращение',
    sample: 'a?.b',
    simple: 'Если слева null или undefined — результат undefined, а не ошибка.',
    term: 'optional-chaining',
  },
  nullish: {
    title: '?? — запасное значение',
    sample: 'a ?? b',
    simple: 'Возьмёт правое, только если левое null или undefined.',
    why: 'В отличие от ||, не заменяет 0 и пустую строку.',
    term: 'nullish',
  },
  and: {
    title: '&& — «и»',
    sample: 'a && <X />',
    simple: 'условие && <X /> нарисует X, только если условие истинно.',
    why: 'Слева нужно true/false: 0 && <X /> выведет на экран 0.',
    term: 'conditional',
  },
  or: { title: '|| — «или»', sample: 'a || b', simple: "Правое, если левое «ложно»: 0, '', false, null, undefined." },
  ternary: {
    title: 'Тернарный оператор ? :',
    sample: 'a ? b : c',
    simple: 'условие ? A : B — A, если истинно, иначе B.',
    why: 'Замена if внутри JSX: if там писать нельзя.',
    term: 'conditional',
  },
  'strict-equal': {
    title: '=== и !== — строгое сравнение',
    sample: '===',
    simple: "Сравнение без приведения типов: 1 === '1' — false.",
    term: 'reference',
  },
  compare: { title: 'Сравнение < >', sample: 'a > b', simple: 'Больше / меньше. Даёт true или false.' },
  not: { title: '! — отрицание', sample: '!a', simple: '!isOpen читается как «не открыто».' },
  import: {
    title: 'import — подключить модуль',
    sample: 'import … from',
    simple: 'Берёт функцию или компонент из другого файла или библиотеки.',
    term: 'module',
  },
  export: {
    title: 'export — отдать наружу',
    sample: 'export',
    simple: 'Делает функцию доступной другим файлам; export default — главное значение файла.',
    term: 'module',
  },
  if: {
    title: 'if / else — условие',
    simple: 'Выполнить код, только если условие истинно.',
    why: 'В JSX if писать нельзя — используют ? : и &&, а if — до return.',
  },
  literal: {
    title: 'true · false · null · undefined',
    simple: 'Готовые значения: «да», «нет», «пусто намеренно», «не задано».',
    term: 'undefined',
  },
  number: { title: 'Число', sample: '42', simple: 'Пишется без кавычек. В JSX — в скобках: {42}.' },
  string: { title: 'Строка', sample: "'…'", simple: 'Текст в кавычках: \'…\' или "…".' },
  template: { title: 'Шаблонная строка', sample: '`…${}`', simple: 'Строка в обратных кавычках с подстановкой: `Привет, ${name}`.' },
  new: { title: 'new — создать объект', sample: 'new X()', simple: 'Создаёт объект: new Date(), new FormData(form).' },
  typeof: { title: 'typeof — узнать тип', simple: "typeof x вернёт строку: 'number', 'string', 'object'…" },
  'ts-type': {
    title: 'Тип (TypeScript)',
    sample: 'type X = {…}',
    simple: 'Описание формы данных. Проверяется редактором до запуска.',
    term: 'type-props',
  },
  'keyword-other': { title: 'Ключевое слово JavaScript', simple: 'Слово, зарезервированное языком.' },
  'key-attr': {
    title: 'key — бейджик элемента списка',
    sample: 'key=',
    simple: 'Нужен React, чтобы различать элементы списка. В пропсы не попадает.',
    term: 'key',
  },
  'ref-attr': {
    title: 'ref — доступ к DOM-элементу',
    sample: 'ref=',
    simple: 'Закладка на настоящий элемент. В React 19 — обычный проп.',
    term: 'ref',
  },
  'classname-attr': { title: 'className', sample: 'className=', simple: 'Так в JSX пишется HTML-атрибут class.', term: 'classname' },
  'htmlfor-attr': { title: 'htmlFor', sample: 'htmlFor=', simple: 'Так в JSX пишется атрибут for у label.', term: 'htmlfor' },
  'style-attr': {
    title: 'style — объект стилей',
    sample: 'style={{…}}',
    simple: 'Стили объектом, свойства в camelCase; число — пиксели.',
    term: 'style-object',
  },
  'event-attr': {
    title: 'Обработчик события',
    sample: 'onClick=',
    simple: 'Передаём функцию — React вызовет её при событии.',
    why: 'onClick={fn} — передать; onClick={fn()} — вызвать сразу при рендере (ошибка).',
    term: 'event-handler',
  },
  'aria-attr': { title: 'aria-* для доступности', simple: 'Подсказки экранным чтецам. Пишутся через дефис.', term: 'aria' },
  'data-attr': { title: 'data-* — свои данные', simple: 'Данные на теге, пишутся через дефис.', term: 'data-attr' },
  'value-attr': {
    title: 'value / checked — значение поля',
    simple: 'Значение поля из состояния. Вместе с onChange — управляемое поле.',
    term: 'controlled',
  },
  'default-value-attr': {
    title: 'defaultValue — стартовое значение',
    simple: 'Начальное значение неуправляемого поля.',
    term: 'uncontrolled',
  },
  'props-ident': { title: 'props — объект пропсов', simple: 'Единственный аргумент компонента: все переданные атрибуты.', term: 'props' },
  'children-ident': { title: 'children', simple: 'Проп с содержимым между открывающим и закрывающим тегом.', term: 'children' },
  'callback-prop': {
    title: 'Колбэк-проп on…',
    sample: 'onDelete',
    simple: 'Функция от родителя: вызови её, чтобы сообщить о событии.',
    term: 'callback',
  },
  handler: {
    title: 'Обработчик handle…',
    sample: 'handleDelete',
    simple: 'Функция в родителе, которую передают детям в пропе on….',
    term: 'event-handler',
  },
  setter: {
    title: 'Сеттер состояния set…',
    sample: 'setCount',
    simple: 'Меняет состояние и просит React перерисовать компонент.',
    term: 'usestate',
  },
  'event-obj': {
    title: 'Объект события e',
    sample: 'e.target',
    simple: 'Что случилось: e.target — элемент, e.target.value — текст поля.',
    term: 'event',
  },
  console: { title: 'console.log — отладка', simple: 'Печатает значение в консоль браузера (F12).' },
};

/** Хуки и функции React: свой заголовок, пояснение и термин */
const REACT_FUNCS = {
  useState: ['память компонента: [значение, сеттер]', 'usestate'],
  useEffect: ['синхронизация с внешним миром после рендера', 'useeffect'],
  useContext: ['прочитать значение контекста', 'usecontext'],
  use: ['React 19: прочитать контекст или промис, можно внутри if', 'use'],
  useMemo: ['запомнить результат вычисления', 'usememo'],
  useCallback: ['запомнить функцию — стабильная ссылка', 'usecallback'],
  useRef: ['коробочка { current } без перерисовок', 'useref'],
  useReducer: ['состояние, которое меняют действия через редьюсер', 'hook'],
  useId: ['уникальный id для связи label и поля', 'hook'],
  useTransition: ['пометить обновление как несрочное', 'hook'],
  memo: ['пропускать рендер при тех же пропсах', 'memo'],
  createContext: ['создать канал контекста', 'context'],
  forwardRef: ['старый способ передать ref (до React 19)', 'forward-ref'],
};

/** Методы массивов и событий: что делают и меняют ли исходные данные */
const METHODS = {
  map: ['новый массив: каждый элемент преобразован', 'list-rendering'],
  filter: ['новый массив только с подходящими элементами', 'immutability'],
  reduce: ['свернуть массив в одно значение (сумму, объект)', null],
  sort: ['сортирует НА МЕСТЕ — меняет исходный массив!', 'immutability'],
  toSorted: ['новый отсортированный массив, исходный не трогает', 'immutability'],
  push: ['добавляет в конец НА МЕСТЕ — мутация!', 'immutability'],
  includes: ['есть ли значение в массиве или строке → true/false', null],
  preventDefault: ['отменить действие браузера (перезагрузку при отправке формы)', 'event'],
  focus: ['поставить курсор в поле', 'ref'],
  freeze: ['заморозить объект: запись в свойства — ошибка', 'read-only'],
  is: ['Object.is — сравнение, которым пользуется React', 'object-is'],
};

export function getConstruct(cid) {
  if (!cid) return null;
  if (cid.startsWith('react:')) {
    const name = cid.slice(6);
    const [simple, term] = REACT_FUNCS[name];
    return {
      title: `${name} — функция React`,
      sample: name,
      simple: `${name}: ${simple}.`,
      term,
      why: name.startsWith('use') ? 'Хуки вызывают на верхнем уровне компонента, не в условиях и циклах (исключение — use).' : undefined,
    };
  }
  if (cid.startsWith('method:')) {
    const name = cid.slice(7);
    const [simple, term] = METHODS[name];
    return { title: `.${name}()`, sample: `.${name}()`, simple: `${name}: ${simple}.`, term };
  }
  return CONSTRUCTS[cid] ?? null;
}

const STRUCTURAL = new Set([
  'block',
  'object',
  'jsx-expr',
  'double-brace',
  'destructure-props',
  'destructure-object',
  'destructure-array',
  'jsx-child-expr',
  'array',
  'index',
  'component-decl',
  'function-decl',
  'default-value',
  'fragment',
  'ternary',
  'comment',
]);

const OPS = {
  '...': 'spread',
  '?.': 'optional-chaining',
  '??': 'nullish',
  '&&': 'and',
  '||': 'or',
  '===': 'strict-equal',
  '!==': 'strict-equal',
};
const DESTRUCTURE = new Set(['destructure-props', 'destructure-object']);

function attrCid(name) {
  if (name === 'key') return 'key-attr';
  if (name === 'ref') return 'ref-attr';
  if (name === 'className') return 'classname-attr';
  if (name === 'htmlFor') return 'htmlfor-attr';
  if (name === 'style') return 'style-attr';
  if (name === 'children') return 'children-ident';
  if (name === 'value' || name === 'checked') return 'value-attr';
  if (name === 'defaultValue') return 'default-value-attr';
  if (/^on[A-Z]/.test(name)) return 'event-attr';
  if (name.startsWith('aria-')) return 'aria-attr';
  if (name.startsWith('data-')) return 'data-attr';
  return 'attr';
}

function keywordCid(word) {
  if (word === 'return') return 'return';
  if (word === 'const' || word === 'let' || word === 'var') return 'const';
  if (word === 'import' || word === 'from') return 'import';
  if (word === 'export' || word === 'default') return 'export';
  if (word === 'if' || word === 'else') return 'if';
  if (['true', 'false', 'null', 'undefined'].includes(word)) return 'literal';
  if (word === 'new') return 'new';
  if (word === 'typeof') return 'typeof';
  if (word === 'type' || word === 'interface') return 'ts-type';
  return 'keyword-other';
}

/**
 * Разбор кода: для каждого токена — его конструкция, плюс список конструкций.
 * @returns {{ lines: {type:string, value:string, cid:string|null}[][], constructs: object[] }}
 */
export function explainCode(code) {
  const lines = splitLines(code).map((line, li) => tokenizeLine(line).map((token) => ({ ...token, cid: null, line: li })));
  const tokens = lines.flat().filter((token) => token.type !== 'plain' || token.value.trim());
  const lineText = (li) => lines[li].map((token) => token.value).join('');
  const stack = []; // открытые теги, скобки { и [
  let tagMode = null; // 'open' | 'close' — внутри <Тег …> или </Тег>

  tokens.forEach((token, k) => {
    const { type, value } = token;
    const prev = tokens[k - 1];
    const prev2 = tokens[k - 2];
    const next = tokens[k + 1];
    const top = stack[stack.length - 1];
    const inJsxText = !tagMode && top?.kind === 'tag';

    switch (type) {
      case 'comment':
      case 'number':
        token.cid = type;
        break;
      case 'string':
        if (prev?.value === '=' && prev2?.type === 'attr') token.cid = 'attr-string';
        else token.cid = value.startsWith('\x60') ? 'template' : 'string';
        break;
      case 'arrow':
        token.cid = 'arrow';
        break;
      case 'op':
        token.cid = value === '...' && DESTRUCTURE.has(top?.cid) ? 'rest' : OPS[value];
        break;
      case 'tag':
        if (value === '/>' || value === '>') {
          if (prev?.type === 'punct' && prev.value === '<') {
            // <> или </> — фрагмент
            token.cid = 'fragment';
            prev.cid = 'fragment';
            if (value === '>') stack.push({ kind: 'tag' });
            else if (stack.length && stack[stack.length - 1].kind === 'tag') stack.pop();
          } else if (tagMode === 'open') {
            token.cid = value === '/>' ? 'jsx-selfclose' : 'jsx-tag-end';
            if (value === '>') stack.push({ kind: 'tag' });
            tagMode = null;
          } else if (tagMode === 'close') {
            token.cid = 'jsx-close';
            tagMode = null;
          } else {
            token.cid = value === '>' ? 'compare' : null;
          }
        } else if (value.startsWith('</')) {
          token.cid = 'jsx-close';
          tagMode = 'close';
          const index = stack.map((item) => item.kind).lastIndexOf('tag');
          if (index !== -1) stack.splice(index);
        } else {
          token.cid = /^<[A-Z]/.test(value) ? 'jsx-component' : 'jsx-tag';
          tagMode = 'open';
        }
        break;
      case 'keyword':
        if (value === 'function') {
          const isComponent = next?.type === 'ident' && /^[A-Z]/.test(next.value);
          token.cid = isComponent ? 'component-decl' : 'function-decl';
          if (next?.type === 'ident') next.cid = token.cid;
        } else {
          token.cid = keywordCid(value);
        }
        break;
      case 'attr':
        token.cid = attrCid(value);
        break;
      case 'ident':
        if (token.cid) break; // имя функции уже размечено
        if (REACT_FUNCS[value]) token.cid = `react:${value}`;
        else if (prev?.value === '.' && METHODS[value]) token.cid = `method:${value}`;
        else if (value === 'props') token.cid = 'props-ident';
        else if (value === 'children') token.cid = 'children-ident';
        else if (value === 'console') token.cid = 'console';
        else if (/^on[A-Z]/.test(value)) token.cid = 'callback-prop';
        else if (/^handle[A-Z]/.test(value)) token.cid = 'handler';
        else if (/^set[A-Z]/.test(value)) token.cid = 'setter';
        else if ((value === 'e' || value === 'event') && next?.value === '.') token.cid = 'event-obj';
        break;
      case 'punct':
        if (value === '{') {
          let cid = 'block';
          if (prev?.value === '=' && prev2?.type === 'attr') cid = next?.value === '{' ? 'double-brace' : 'jsx-expr';
          else if (prev?.value === '{' && top?.cid === 'double-brace') cid = 'object';
          else if (inJsxText) cid = 'jsx-child-expr';
          else if (!prev || prev.type === 'comment' || prev.value === ';' || (prev.line !== token.line && prev.value === '}'))
            // фрагмент вида {isOpen && <Modal />} — вставка значения в разметку
            cid = /<[A-Za-z>]/.test(lineText(token.line)) ? 'jsx-child-expr' : 'block';
          else if (prev?.type === 'keyword' && ['const', 'let', 'var'].includes(prev.value)) cid = 'destructure-object';
          else if (prev?.value === 'import' || prev?.value === 'export') cid = prev.value;
          else if (prev?.value === '(' || (prev?.value === ',' && top?.cid === 'params'))
            cid = isParams(tokens, k) ? 'destructure-props' : 'object';
          else if ([':', ',', '[', '=', 'return', '(', '??', '||', '&&', '?'].includes(prev?.value)) cid = 'object';
          token.cid = cid;
          stack.push({ kind: 'brace', cid });
        } else if (value === '}') {
          if (top?.kind === 'brace') token.cid = stack.pop().cid;
        } else if (value === '[') {
          let cid = 'array';
          if (prev?.type === 'keyword' && ['const', 'let'].includes(prev.value)) cid = 'destructure-array';
          else if (prev && (prev.type === 'ident' || prev.value === ']' || prev.value === ')')) cid = 'index';
          token.cid = cid;
          stack.push({ kind: 'bracket', cid });
        } else if (value === ']') {
          if (top?.kind === 'bracket') token.cid = stack.pop().cid;
        } else if (value === '=' && DESTRUCTURE.has(top?.cid) && prev?.type === 'ident') {
          token.cid = 'default-value';
        } else if (value === '?') {
          token.cid = 'ternary';
        } else if (value === '!' && next?.value !== '=') {
          token.cid = 'not';
        } else if (value === '<' && !(next?.type === 'tag' && (next.value === '>' || next.value === '/>'))) {
          token.cid = 'compare';
        }
        break;
      default:
        break;
    }
  });

  // Для «структурных» конструкций показываем шаблон ({ … }), для остальных — сам кусочек кода
  const seen = new Map();
  for (const token of tokens) {
    if (token.cid && !seen.has(token.cid)) {
      const info = getConstruct(token.cid);
      const sample = STRUCTURAL.has(token.cid) ? (info?.sample ?? token.value) : token.value;
      if (info) seen.set(token.cid, { cid: token.cid, ...info, sample });
    }
  }
  return { lines, constructs: [...seen.values()] };
}

/** «{» после «(» — это параметры функции? Ищем «function» раньше или «=>» после закрывающей «)» */
function isParams(tokens, k) {
  for (let i = k - 1; i >= Math.max(0, k - 4); i--) {
    if (tokens[i].value === 'function' || tokens[i].value === 'memo') return true;
  }
  let depth = 0;
  for (let i = k; i < tokens.length; i++) {
    const v = tokens[i].value;
    if (v === '(') depth++;
    if (v === ')') {
      if (depth === 0) return tokens[i + 1]?.value === '=>' || tokens[i + 1]?.value === ':';
      depth--;
    }
  }
  return false;
}
