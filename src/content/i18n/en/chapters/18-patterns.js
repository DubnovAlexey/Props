// Английский перевод пещеры 18 «Подземная мастерская» (оригинал — ../../../chapters/18-patterns.js
// и 18-patterns.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют. Текст с `<тегами>` и двоеточиями IntelliJ тоже
// иногда читает как код («недостижимый код», «метка», «with»): это ложные срабатывания, они выключены здесь же.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute,UnreachableCodeJS,JSDuplicatedDeclaration,CommaExpressionJS,JSVoidFunctionReturnValueUsed,UnnecessaryLabelJS,WithStatementJS,InfiniteLoopJS
export default {
  cave: 'Underground Workshop',
  title: 'Forms and patterns',
  goal: 'Master controlled and uncontrolled fields, conditional rendering and popular patterns with props.',

  pretest: {
    question: 'What will `{count && <Badge />}` show if `count = 0`?',
    options: [{ text: 'The digit 0 on the screen' }, { text: 'Nothing' }, { text: 'The Badge component' }, { text: 'An error' }],
    explain: '`0 && …` returns 0, and React draws a number. A trap everybody falls into!',
  },

  lesson: [
    {
      title: 'A controlled field: React is in charge',
      body: [
        'A [[controlled|controlled]] field gets its value from state through the `value` prop and reports changes through `onChange`.',
      ],
      key: '`value` without `onChange` “freezes” the field: typing does not work, and React warns in the console.',
      scheme: {
        title: 'The loop of a controlled field',
        steps: [
          { title: 'The user pressed a key' },
          { title: 'onChange calls the setter' },
          { title: 'React re-renders the component' },
          { title: 'The field shows the value from state' },
        ],
      },
      why: '`value` is taken from state, and `onChange` updates it — so the main source of truth is React. At any moment the text of the field is known, and it can be checked and changed on every character.',
      alt: [{ note: 'A controlled field lets you change the input right away — for example, make capital letters.' }],
      wrong: [
        {
          why: 'Without `onChange` the field becomes read-only — React warns and suggests `onChange`, `readOnly` or `defaultValue`.',
        },
        {
          why: "At first `value` = undefined (the field is uncontrolled), then a string (controlled) — React warns about the change of mode. Start with `useState('')`.",
        },
      ],
    },
    {
      title: 'An uncontrolled field: the value lives in the DOM',
      body: [
        'An [[uncontrolled|uncontrolled]] field keeps its value itself. The starting value is set by `defaultValue`, and you can read it through a [[ref|ref]] or from the form on submit.',
      ],
      code: 'function QuickForm({ onSearch }) {\n  function handleSubmit(e) {\n    e.preventDefault();\n    const data = new FormData(e.currentTarget);\n    onSearch(data.get(\'dish\'));\n  }\n  return (\n    <form onSubmit={handleSubmit}>\n      <input name="dish" defaultValue="Omelette" />\n      <button>Search</button>\n    </form>\n  );\n}',
      key: '`value` + `onChange` is a controlled field. `defaultValue` is an uncontrolled one. Do not mix them in one field.',
      scheme: {
        left: { title: 'Controlled', items: ['`value` + `onChange`', 'the value is in state', 'a check on every character'] },
        right: {
          title: 'Uncontrolled',
          items: ['`defaultValue` + `name`', 'the value is in the DOM', 'we read it on submit: FormData or a ref'],
        },
      },
      why: '`defaultValue` sets only the initial text, after that the field lives on its own. On submit the values are taken out through `FormData` by the `name` attribute. `e.currentTarget` is the form itself, the one the handler hangs on.',
      alt: [
        {
          code: '<form action={formData => onSearch(formData.get(\'dish\'))}>\n  <input name="dish" defaultValue="Omelette" />\n  <button>Search</button>\n</form>',
          note: 'React 19: a function in `action` gets FormData by itself — `preventDefault` is not needed.',
        },
      ],
      wrong: [
        {
          code: '<input name="dish" value="Omelette" />',
          why: '`value` without `onChange` freezes the field. The initial value of an uncontrolled field is `defaultValue`.',
        },
        {
          code: '<input defaultValue="Omelette" />\n// data.get(\'dish\') → null',
          why: 'Without the `name` attribute the field does not get into FormData.',
        },
      ],
    },
    {
      title: 'Conditional rendering and the zero trap',
      body: ['[[conditional|Conditional rendering]]: `if`, the ternary operator `a ? b : c` and the notation `cond && <X />`.'],
      code: '{isLoading ? <Spinner /> : <List />}\n{error && <ErrorModal isOpen>{error}</ErrorModal>}\n\n// ❌ with count = 0 a “0” appears on the screen\n{count && <Badge count={count} />}\n\n// ✅\n{count > 0 && <Badge count={count} />}',
      key: 'To the left of `&&` put a real true/false: `count > 0`, `items.length > 0`, `Boolean(x)`.',
      scheme: {
        left: { title: 'Draw nothing' },
        right: { title: 'Are drawn', items: ['`0` — a “0” appears', "`''` — an empty string (not visible)", '`NaN` — a “NaN” appears'] },
      },
      why: '`a && b` returns `a` if it is “falsy”. React does not draw `false`, but `0` is a number, and React draws numbers. That is why a real boolean goes to the left of `&&`: `count > 0`.',
      alt: [{ note: 'A ternary operator with an explicit `null`.' }, { note: '`Boolean(…)` or `!!count` turn a number into a boolean.' }],
      wrong: [
        { why: 'An empty array: `length` = 0, and a “0” appears on the screen.' },
        {
          why: '`if` is a statement, and inside the curly braces of JSX only an expression is allowed. Use `? :` or `&&`.',
        },
      ],
    },
    {
      title: 'A component may draw nothing',
      body: [
        'Sometimes a component decides from its props that there is nothing to draw and returns [[null|null]]. That is how `ExpiryBadge` in the “Smart Fridge” is built.',
      ],
      code: 'function ExpiryBadge({ daysLeft }) {\n  if (daysLeft < 0) return <span>Expired</span>;\n  if (daysLeft <= 2) return <span>Expires soon</span>;\n  return null; // the date is fine — no badge\n}',
      scheme: {
        title: 'The rules of ExpiryBadge from top to bottom',
        steps: [
          { code: '<span>Expired</span>' },
          { code: '<span>Expires soon</span>' },
          { title: 'Otherwise', code: 'return null — nothing' },
        ],
      },
      why: '`return null` means “draw nothing”. The component still exists, and its hooks work. Early `return`s read like a list of rules from top to bottom.',
      alt: [{ note: 'The decision can be moved to the parent: it simply does not draw the component.' }],
      wrong: [
        {
          why: 'An object is not something that can be drawn: the error “Objects are not valid as a React child”. For “nothing” use `null`.',
        },
        { why: 'The string "null" is text: the word “null” appears on the screen.' },
      ],
    },
    {
      title: 'HOC is a wrapper for a component',
      body: [
        'A [[hoc|HOC]] is a function that takes a component and returns a new one, adding props or behaviour to it. Hooks are used more often now, but HOCs appear in old code and in libraries.',
      ],
      code: "function withRole(Component, role) {\n  return function Guarded(props) {\n    if (props.user?.role !== role) {\n      return <p>Access denied</p>;\n    }\n    return <Component {...props} />;\n  };\n}\n\nconst AdminPanel = withRole(Panel, 'ADMIN');",
      key: 'A HOC must pass the props on: `{...props}`. Otherwise the wrapped component loses them.',
      scheme: {
        steps: [
          { title: 'An ordinary component' },
          { title: 'We pass it through a wrapper' },
          { title: 'We get a new component' },
          { title: 'Guarded checks the role', sub: 'it draws Panel with all the props — or “Access denied”' },
        ],
      },
      why: 'A HOC (a higher-order component) is a function that takes a component and returns a new one with extra behaviour. `{...props}` passes all the props to the wrapped component unchanged.',
      alt: [
        {
          code: 'function RequireRole({ user, role, children }) {\n  return user?.role === role ? children : <p>Access denied</p>;\n}\n\n<RequireRole user={user} role="ADMIN">\n  <Panel />\n</RequireRole>',
          note: 'The modern replacement is an ordinary wrapper component with children. The same behaviour, easier to read.',
        },
      ],
      wrong: [
        {
          why: 'The HOC is called on every render and creates a NEW component type: React removes the old one and mounts a new one every time, and the state is reset. Call a HOC once — outside components.',
        },
        {
          why: 'We forgot `{...props}` — the wrapped component does not get a single prop.',
        },
      ],
    },
    {
      title: 'Props in Kosmo: a player sees only their own',
      body: [
        'In the game “Preferans” the engine knows all the cards, and the interface gets only the **player’s view**: their own cards and the number of cards the opponents hold. `OpponentSeat` physically cannot peek at other cards — they are not in its props.',
      ],
      key: 'Props are also a security boundary: a component knows exactly what it was given.',
      scheme: {
        title: 'Kosmo, preferans: from the engine to a card',
        root: {
          name: 'The game engine',
          note: 'knows all the cards',
          children: [
            {
              note: 'a slice for one player',
              children: [{ children: [{ note: 'only the number of cards' }, {}, {}, {}] }],
            },
          ],
        },
      },
      why: '`Array.from({ length: cardCount }, (_, i) => …)` creates an array of N card backs. `_` is the unused first argument (the item), `i` is the index. An index key is acceptable here: the backs are identical, without state, and the order does not change. The main thing: the opponent is given only the number of cards, not the cards themselves.',
      alt: [{ note: 'One more way to get an array of the needed length.' }],
      wrong: [
        {
          code: '<OpponentSeat cards={opponent.cards} />\n// the cards are hidden with CSS',
          why: 'The cards still end up in the browser — they are visible in DevTools. What the player must not see must not get into the props.',
        },
        {
          why: '`Array(3)` creates a “holey” array without items, and `map` skips the empty slots — not a single card back is drawn.',
        },
      ],
    },
  ],

  spell: {
    text: 'value and onChange are an inseparable pair, like the Count and his cloak.',
    meaning: 'A controlled field: the value comes from state, the changes go through a [[event-handler|handler]].',
  },

  practice: [
    {
      question: 'What appears on the screen if `count = 0`?',
      options: [
        {},
        { text: 'Nothing', why: '0 is a “falsy” value, && returns it, and React draws the number.' },
        { text: 'The Badge component', why: 'The right side of && is not evaluated if the left one is “falsy”.' },
        { text: 'An error', why: 'There is no error — just an extra 0 on the screen.' },
      ],
      explain: 'Write `{count > 0 && <Badge />}` — a real true/false must stand to the left of &&.',
    },
    {
      question: 'Why can nothing be typed into the field?',
      explain: '`value` without `onChange` makes the field read-only: React puts the empty string from state back into it every time.',
    },
    {
      question: 'Is this field controlled or uncontrolled?',
      bins: ['Controlled', 'Uncontrolled'],
      items: [
        {},
        { text: '`defaultValue="Omelette"`' },
        { text: 'We read the value through a ref on submit' },
        { text: 'Every letter is saved in state at once' },
        {},
        { text: 'We take the data from `FormData`' },
      ],
      explain: 'Controlled: the source of truth is React state. Uncontrolled: the source of truth is the DOM element itself.',
    },
    {
      question: 'How do you correctly rewrite `{items.length && <List />}`?',
      options: [
        {},
        { why: 'An empty array is a “truthy” object, List is drawn even without items.' },
        { why: 'This is the opposite condition: the list is shown only when it is empty.' },
        { text: 'Nothing needs to change', why: 'With an empty array a 0 appears on the screen.' },
      ],
      explain: 'The comparison `> 0` gives a real boolean, and the 0 does not get onto the screen.',
    },
    {
      statement: 'A HOC must pass the props to the wrapped component, for example through `{...props}`.',
      explain: 'Otherwise the wrapped component does not get the props passed to it from outside.',
    },
    {
      question: 'A component has nothing to draw. What is the right way?',
      options: [
        {},
        { why: 'An object is not a valid child — there will be an error.' },
        { why: 'An error brings the interface down to the nearest Error Boundary.' },
        { text: 'Return an empty `<div />`', why: 'It works, but it clutters the DOM with an extra element.' },
      ],
      explain: '`null` is the explicit and generally accepted way to say “there is nothing here”.',
    },
    {
      question: 'Put the steps of a controlled field in order.',
      items: [
        'The user types a letter',
        '`onChange` fires with the event object',
        '`setDish(e.target.value)` is called',
        'The component re-renders with the new `dish`',
        'The field gets `value={dish}`',
      ],
      explain: 'Every character goes through the state — that is why React always knows what is in the field.',
    },
    {
      question: 'Match the notation and the pattern.',
      pairs: [
        ['`value` + `onChange`', 'A controlled field'],
        ['`defaultValue`', 'An uncontrolled field'],
        ['`withRole(Component)`', 'HOC'],
        ['`return null`', 'Draw nothing'],
      ],
      explain: 'All four techniques are common in real projects.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: how does a controlled field differ from an uncontrolled one?',
    starters: ['A controlled field…', 'The value is kept…', 'And an uncontrolled one…'],
    keywords: [
      { label: 'Controlled: value + onChange', words: ['value', 'onchange'] },
      { label: 'The value is kept in React state', words: ['state', 'usestate'] },
      { label: 'Uncontrolled: defaultValue / ref, the value is in the DOM', words: ['defaultvalue', 'ref', 'dom', 'formdata'] },
    ],
    model:
      'A controlled field gets its value from state through value and reports changes through onChange — the source of truth is React. An uncontrolled field keeps its value itself in the DOM: the starting value is set with defaultValue, and it is read through a ref or FormData on submit.',
  },
};
