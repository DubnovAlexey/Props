// Английский перевод пещеры 12 «Пещера ключей» (оригинал — ../../../chapters/12-special.js
// и 12-special.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute
export default {
  cave: 'Cave of Keys',
  title: 'key, ref and DOM attributes',
  goal: 'Sort out the special props key and ref, as well as className, style and other attributes.',

  pretest: {
    question: 'What will a component get in `props.key` if you write `<Item key="5" />`?',
    options: [{ text: '`undefined` — key is not passed' }, {}, {}, {}],
    explain: '`key` is a service attribute for React. It does not get into the props of the component.',
  },

  lesson: [
    {
      title: 'key is a name badge for list items',
      body: [
        'When you draw a [[list-rendering|list]], every item needs a [[key|key]] — a unique and stable “name badge”. By it React understands which item was added, removed or moved.',
      ],
      key: '`key` is needed by React, not by you: it does not get inside the component. Need the id inside? Pass it separately: `id={p.id}`.',
      why: 'By `key` React recognises items between renders: “this is the same Cheese as before”. The key goes on the outermost element that `map` returns. It must be unique among its neighbours and must not change. `key` does not get inside the component.',
      alt: [{ note: 'Need to return several elements? Write `<Fragment key>`: the short form `<>` does not accept a key.' }],
      wrong: [
        {
          why: 'The key is on the wrong element: `map` returns `<li>`, so `<li>` needs the key. Otherwise you get the warning “Each child in a list should have a unique key”.',
        },
        {
          why: '`key` is a service attribute of React, it is not passed inside: here it will be undefined. Need the value? Pass it in a separate prop, for example `id`.',
        },
      ],
    },
    {
      title: 'Why an index is a bad key',
      body: [
        'If the list changes (removal, sorting, inserting at the start), an index key “moves” to another item, and the state of the cards gets mixed up: for example, a tick ends up at another product.',
        'A good key is an id from the data. An index is acceptable only if the list never changes.',
      ],
      code: '// ❌ an index: on removal the keys “slide”\nitems.map((item, i) => <Row key={i} />)\n\n// ✅ an id from the data\nitems.map(item => <Row key={item.id} />)\n\n// ❌ random: a new one on every render\nitems.map(item => <Row key={Math.random()} />)',
      key: 'A change of key = a new component: the old one is removed together with its state. By accident it is a bug, on purpose — a useful reset technique.',
      scheme: {
        left: {
          title: 'key = index',
          items: [
            'before: 0 Cheese · 1 Milk · 2 Bread',
            'we remove Cheese',
            'after: 0 Milk · 1 Bread',
            'React thinks: key 2 was removed, and 0 and 1 have changed',
          ],
        },
        right: {
          items: ['before: s Cheese · m Milk · h Bread', 'we remove Cheese', 'after: m Milk · h Bread', 'React: s was removed, the rest are in place'],
        },
      },
      why: 'An index is a place in a queue, not a name. An item was removed or moved — the indexes “slid”, and React gives the state (for example, the text in a field) to someone else’s item. An index is acceptable only if the list never changes its order and the items have no state.',
      alt: [{ note: 'No id in the data? Create it ONCE, when you create the item, and not during render.' }],
      wrong: [
        {
          why: 'If names repeat, the keys coincide — React warns “Encountered two children with the same key”, and the rows get mixed up.',
        },
      ],
    },
    {
      title: 'ref is a bookmark on a DOM element',
      body: [
        '[[ref|ref]] gives access to the real DOM element: to set focus, scroll, measure. It is created with the [[useref|useRef]] hook.',
        'In React 19 a ref can be passed to your own component **as an ordinary prop** — [[forward-ref|forwardRef]] is no longer needed.',
      ],
      code: 'function SearchInput({ ref, ...rest }) {\n  return <input ref={ref} {...rest} />;\n}\n\nfunction SearchForm() {\n  const inputRef = useRef(null);\n  return (\n    <>\n      <SearchInput ref={inputRef} />\n      <button onClick={() => inputRef.current.focus()}>\n        Focus\n      </button>\n    </>\n  );\n}',
      key: '`ref.current` changes without a re-render. For data that has to be shown on the screen, use state, not a ref.',
      scheme: {
        steps: [
          { title: 'We create a box', sub: 'for now `{ current: null }`' },
          { title: 'We pass it down in a prop' },
          { title: 'The child hangs it on an element' },
          { title: 'After render React puts the node there' },
          { title: 'We use it in a handler' },
        ],
      },
      why: 'In React 19 `ref` is an ordinary prop of a function component, `forwardRef` is no longer needed. `useRef(null)` creates a box `{ current: null }`, and React puts the DOM node there when the element appears on the screen.',
      alt: [
        { note: 'The old way is `forwardRef`. In React 19 it still works, but it is no longer needed.' },
        {
          code: "<input ref={node => {\n  node.focus();\n  return () => console.log('removed');\n}} />",
          note: 'A ref callback: the function gets the node. In React 19 it may return a cleanup function.',
        },
      ],
      wrong: [
        {
          why: 'During render the element does not exist yet: `current` is null — a TypeError. Work with a ref in handlers or effects.',
        },
        { why: 'String refs were removed in React 19. You need an object from `useRef` or a function.' },
      ],
    },
    {
      title: 'DOM attributes in JSX',
      body: [
        '- `class` → [[classname|className]], `for` → [[htmlfor|htmlFor]];',
        '- events and compound names — [[camelcase|camelCase]]: `onClick`, `tabIndex`, `readOnly`;',
        '- [[aria|aria-*]] and [[data-attr|data-*]] — with a hyphen, as in HTML;',
        '- [[style-object|style]] is an object, not a string.',
      ],
      code: '<label htmlFor="dish" className="label">\n  Dish\n</label>\n<input\n  id="dish"\n  tabIndex={0}\n  aria-label="Name of the dish"\n  data-testid="dish-input"\n  style={{ fontSize: 16, marginTop: 8 }}\n/>',
      key: '`style={{ fontSize: 16 }}`: for most properties React turns a number without units into pixels — `16px`.',
      why: 'JSX attributes are properties of the DOM object, so the names are in camelCase: `className`, `htmlFor`, `tabIndex`. The exceptions are `aria-*` and `data-*`: they are written with a hyphen, as in HTML. `style` is an object; React treats a number without units as pixels.',
      alt: [{ note: 'A style value can be given as a string with any units.' }, { note: 'A class can be computed with an expression.' }],
      wrong: [
        {
          why: 'React does not accept a string in `style` — there will be an error: you need an object with keys in camelCase.',
        },
        {
          code: '<label for="dish">Dish</label>',
          why: '`for` is a JavaScript word. React warns “Invalid DOM property `for`. Did you mean `htmlFor`?”',
        },
      ],
    },
    {
      title: 'Spread: whoever comes last wins',
      body: ['With a [[spread|spread]] the props are applied from left to right — the last one wins.'],
      code: 'const props = { type: \'submit\', disabled: true };\n\n<button {...props} type="button" />\n// type="button": an explicit attribute after the spread\n\n<button type="button" {...props} />\n// type="submit": the spread overwrote it',
      key: 'Want the user of your component to be able to override a value? Put `{...rest}` after your own attributes. Want to forbid it? Before.',
      scheme: {
        left: { items: ['first the spread: submit', 'then the explicit attribute: button', 'the result: **button**'] },
        right: { items: ['first the explicit attribute: button', 'then the spread: submit', 'the result: **submit**'] },
      },
      why: "JSX attributes are gathered into an object from left to right. As in `{ ...a, type: 'button' }`, a key further to the right overwrites one to the left. That is why the order of the spread and the explicit attributes decides whose value wins.",
      alt: [{ note: 'Do not overwrite but combine: your own class plus the class from the parent.' }],
      wrong: [{ why: 'If the parent passes its own `className`, the spread wipes out `btn` — the base styles disappear.' }],
    },
  ],

  spell: {
    text: 'key is a badge for a list, ref is a bookmark on an element.',
    meaning: '[[key|key]] serves React in lists, [[ref|ref]] gives access to the DOM without re-renders.',
  },

  practice: [
    {
      question: 'Which `key` is best for a list of products that can be sorted and deleted?',
      options: [
        {},
        { text: 'The index from `map`', why: 'On deletion and sorting the indexes “slide”, and the state gets mixed up.' },
        { why: 'A new key on every render — React will recreate all the items and lose their state.' },
        { why: 'Names can repeat, and a key must be unique among its neighbours.' },
      ],
      explain: 'A key must be unique among its neighbours and must not change between renders. The best is an id from the data.',
    },
    {
      question: 'Find the line with the mistake.',
      fix: 'function Row({ id, name }) {  // and pass id={i.id}',
      explain:
        '`key` does not get into the props — inside Row it will be undefined, and React warns about it in the console. Pass the id in a separate prop.',
    },
    {
      statement: 'In React 19, to pass a ref to a function component, you must use forwardRef.',
      explain: 'In React 19 `ref` comes as an ordinary prop. forwardRef is no longer needed.',
    },
    {
      question: 'Is this written correctly in JSX?',
      bins: ['Correct', 'Wrong'],
      items: [{}, {}, {}, {}, {}, {}, { text: '`aria-label="Close"`' }],
      explain: 'JSX uses the names of DOM properties in camelCase. A string in style causes an error, and React does not recognise `onclick` as an event.',
    },
    {
      question: 'What `type` will the button have?',
      code: 'const rest = { type: \'submit\' };\n\n<button type="button" {...rest}>Ok</button>',
      options: [
        {},
        { why: 'The spread comes after — its value overwrites the explicit attribute.' },
        { text: 'Both at once', why: 'An attribute can have only one value.' },
        { text: 'There will be an error', why: 'Repeating an attribute through a spread is allowed — the last one wins.' },
      ],
      explain: 'Attributes are applied from left to right: `{...rest}` is written last and wins.',
    },
    {
      question: 'Pass a ref into your own input field (React 19).',
      explain: 'In React 19 `ref` is an ordinary prop: we take it out of the props and pass it to the real `<input>`.',
    },
    {
      question: 'What happens to the state of the form when the key changes?',
      options: [
        { text: 'The form is created anew, the state is reset' },
        { text: 'The state is kept', why: 'A new key means a new instance of the component with fresh state.' },
        { text: 'There will be an error', why: 'Changing key is a legitimate technique.' },
        { text: '`key` is passed into Form as a prop', why: 'key does not get into the props.' },
      ],
      explain: 'A reset through key is the official way to start “from a clean slate” when the data changes.',
    },
    {
      question: 'How is the HTML attribute `for` of a `<label>` written in JSX?',
      placeholder: 'the attribute name',
      explain: '`for` is a JavaScript keyword (a loop), so JSX uses `htmlFor`.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: why is key needed, and why is an index a bad key?',
    starters: ['key is needed so that…', 'An index is bad because…', 'The best thing to take is…'],
    keywords: [
      { label: 'key helps React tell items apart', words: ['tell', 'recogni', 'distinguish', 'match', 'understand', 'which'] },
      { label: 'An index “slides” when the list changes', words: ['slide', 'shift', 'remov', 'delet', 'sort', 'order', 'change'] },
      { label: 'A key is a stable unique id', words: ['id', 'stable', 'unique'] },
    ],
    model:
      'key helps React understand which list item is which when the list changes. An index is bad because on deletion or sorting it “moves” to another item, and the state of the cards gets mixed up. The best key is a stable unique id from the data.',
  },
};
