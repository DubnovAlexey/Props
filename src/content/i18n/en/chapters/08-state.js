// Английский перевод пещеры 8 «Пещера памяти» (оригинал — ../../../chapters/08-state.js
// и 08-state.syntax.js). Здесь только текст и те примеры кода, где были русские слова;
// порядок карточек, вариантов и шагов — как в оригинале, {} — «переводить нечего».
// В примерах сумма — в долларах, а не в рублях: так понятнее англоязычному игроку.
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute
export default {
  cave: 'Cave of Memory',
  title: 'Props and state',
  goal: 'Tell props from state and understand when a component re-renders.',

  pretest: {
    question: 'Where does a component keep what it must “remember” between re-renders?',
    options: [{ text: 'In state (useState)' }, { text: 'In props' }, { text: 'In an ordinary variable inside the function' }, { text: 'In CSS' }],
    explain: 'An ordinary variable is created anew on every render, and props come from outside. The memory of a component is its state.',
  },

  lesson: [
    {
      title: 'Props come from outside, state lives inside',
      body: ['[[props|Props]] are what a component is **given**. [[state|State]] is what a component **remembers** itself and can change.'],
      code: 'function Counter({ step }) {\n  // step is a prop: it came from the parent\n  // count is state: its own memory\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + step)}>\n      {count}\n    </button>\n  );\n}',
      analogy: 'Props are a letter from the parent: you may read it but not rewrite it. State is a personal diary: you write whatever you like.',
      why: '`step` comes from the parent and is only read. `count` is the component’s own memory: `useState(0)` creates it on the first render, and `setCount` changes it and triggers a re-render.',
      alt: [
        {
          note: 'An update through the function `c => c + step` takes the freshest value — safer when there are several updates in a row.',
        },
      ],
      wrong: [{ why: 'A prop must not be changed, and `count++` does not even trigger a re-render. The memory of a component is only `useState`.' }],
    },
    {
      title: 'When a component re-renders',
      body: [
        'A component [[rerender|re-renders]] when:',
        '- its state has changed (a setter was called);',
        '- its [[parent|parent]] has re-rendered — then the child gets fresh props;',
        '- a [[context|context]] it reads has changed.',
        'Props do not “change” by themselves: the parent renders again and passes a new props object.',
      ],
      key: 'A child re-renders together with its parent, even if the props are exactly the same. [[memo|memo]] can skip such a render.',
      scheme: {
        title: 'What triggers a re-render',
        left: {
          title: 'Will re-render',
          items: ['a setter call with a new value', 'a re-render of the parent', 'a new value of a context the component reads'],
        },
        right: {
          title: 'Will not re-render',
          items: ['changing an ordinary variable `let x`', 'mutating an object without a setter', 'a setter with the same value (`Object.is`)'],
        },
        caption: 'What exactly happens during a re-render, we will sort out in the “Mirror Grotto”.',
      },
    },
    {
      title: 'useState: a memory cell',
      body: [
        '[[usestate|useState]] returns a pair: the current value and a setter function. Calling the setter asks React to re-render the component with the new value.',
      ],
      code: "const [name, setName] = useState('');\n\nsetName('Count'); // React re-renders the component\n\n// name = 'Count' — you must not do this:\n// React will not learn about the change",
      key: 'State can be changed only through the setter. Then React learns about the change and updates the screen.',
      scheme: {
        steps: [
          { title: 'The first render' },
          { title: 'The user did something', code: "setName('Count')" },
          { title: 'React re-renders the component' },
          { title: 'A new render', code: "useState('') → ['Count', setName]", sub: 'the initial value is no longer used' },
        ],
      },
      why: 'An ordinary variable is created anew on every call of the function, while React keeps the value of `useState` between calls. The setter is the only way to tell React: “the data has changed, re-render”.',
      alt: [{ note: 'Lazy initialisation: the function is called only on the first render — for expensive calculations.' }],
      wrong: [
        {
          code: "let [name, setName] = useState('');\nname = 'Count';",
          why: 'The assignment changes only the local variable of this call — React will not learn about it, and the screen will not update.',
        },
        {
          why: 'A hook inside a condition breaks the order of hooks — React will mix up the states. Hooks are called only at the top level.',
        },
      ],
    },
    {
      title: 'Do not copy a prop into state',
      body: [
        'A common mistake is to put a prop into `useState`. State takes the value **only on the first render** and does not follow the prop afterwards.',
      ],
      code: '// BAD: the colour “freezes” at its first value\nfunction Label({ color }) {\n  const [c] = useState(color);\n  return <span style={{ color: c }}>Text</span>;\n}\n\n// GOOD: just use the prop\nfunction Label({ color }) {\n  return <span style={{ color }}>Text</span>;\n}',
      key: 'If a prop is needed only as a starting value, name it honestly: `initialColor`. Then the reader understands that it is not tracked afterwards.',
      scheme: {
        title: 'Why the copy falls behind',
        steps: [
          { title: 'The first render' },
          { title: 'The parent passed a new prop' },
          { title: 'useState no longer reads the initial value', sub: "the state still holds 'red'" },
          { title: 'The fix: use the prop directly' },
        ],
      },
      why: '`useState(color)` reads `color` once — on the first render. After that the state lives a life of its own and does not learn about new props. Use the prop directly — it is always fresh.',
      alt: [
        {
          code: 'function Label({ initialColor }) {\n  const [color, setColor] = useState(initialColor);\n  // later the colour is changed by buttons inside Label\n}',
          note: 'If the prop is only a starting value, honestly name it `initialColor`.',
        },
      ],
      wrong: [{ why: 'Syncing through an effect: an extra render with the old value and a source of bugs. Just use `color`.' }],
    },
    {
      title: 'Compute, do not store',
      body: [
        'If a value can be computed from props and state, compute it right during render. This is a [[derived|derived value]].',
      ],
      code: 'function Cart({ items }) {\n  // no useState needed for total\n  const total = items.reduce(\n    (sum, item) => sum + item.price, 0);\n  return <p>Total: {total} $</p>;\n}',
      after: [
        'And do not use [[useeffect|useEffect]] to “sync” a prop with state: it is an extra render and a frequent source of bugs.',
      ],
      key: 'Every extra piece of state is a chance of a mismatch. Store the minimum, compute the rest.',
      scheme: {
        left: { title: 'Storing — superfluous', items: ['`useState(0)` for the sum', 'update it by hand', 'forget it — a mismatch'] },
        right: {
          title: 'Computing',
          items: ['`const total = …` in the body', 'always matches the data', 'zero extra renders'],
        },
      },
      why: 'A value obtained from props and state is derived. If you store it separately, you have to remember to update both copies.',
      alt: [{ note: 'If the calculation is heavy, wrap it in `useMemo` — but still do not keep it in state.' }],
      wrong: [{ why: 'Double work: first a render with the old sum, then one more. And extra code.' }],
    },
    {
      title: 'Resetting state with key',
      body: [
        'If a change of a prop should start things “from a clean slate”, give the component a [[key|key]]. When the key changes, React removes the old instance together with its state and creates a new one — this is [[mount|mounting]] anew.',
      ],
      after: ['That is how this game does it too: when you go to another cave, the page gets a new `key` and starts from the first step.'],
      scheme: {
        steps: [
          { title: 'User 1' },
          { title: 'userId changed to 2' },
          { title: 'React sees a different key', sub: 'the old form is removed together with its state' },
          { title: 'A new form is mounted', sub: 'state from scratch' },
        ],
      },
      why: 'For React a component with a different `key` is a different component. This is the official way to “start from a clean slate” without effects and without resetting fields by hand.',
      alt: [{ note: 'You can reset the fields by hand in an effect, but it is longer and easy to forget a field.' }],
      wrong: [{ why: 'A random key changes on EVERY render: the form will keep resetting, and you will not manage to type any text.' }],
    },
  ],

  spell: {
    text: 'Props are what I was given, state is what I remember.',
    meaning: 'Props come from outside and are only read. State lives inside and changes through a setter.',
  },

  practice: [
    {
      question: 'What is better made a prop, and what — state?',
      bins: ['Prop', 'State'],
      items: [
        { text: 'The name of a product passed by the list' },
        { text: 'Whether the component’s own drop-down menu is open' },
        { text: 'The user’s role that came from App' },
        { text: 'The number of the current slide in a carousel' },
        { text: 'The `onDelete` function from the parent' },
        { text: 'The text typed into the component’s own field' },
      ],
      explain: 'Props come from outside. State is what the component remembers itself and changes in response to the user’s actions.',
    },
    {
      question: 'The parent passed `color="red"`, and then `color="blue"`. What colour will the text be?',
      code: 'function Label({ color }) {\n  const [c] = useState(color);\n  return <span style={{ color: c }}>Text</span>;\n}',
      options: [
        { text: 'Red: the state remembered the first value' },
        { text: 'Blue: the prop has been updated, after all', why: 'The prop has been updated, but `c` is taken from state, and state is initialised once.' },
        { text: 'Black: the style will be reset', why: 'The style is taken from c — and it still holds red.' },
        { text: 'There will be an error', why: 'There is no error — it is a silent bug, and that is why it is dangerous.' },
      ],
      explain: 'The initial value of `useState` is used only on the first render. Use the prop directly or name it `initialColor`.',
    },
    {
      statement: 'If the parent has re-rendered, the child re-renders too, even with the same props (without memo).',
      explain: 'By default React re-renders the whole subtree. memo lets you skip a render when the props are equal.',
    },
    {
      question: 'Why does the counter not change? Find the line.',
      fix: 'const [count, setCount] = useState(0); // and onClick={() => setCount(count + 1)}',
      hint: 'What happens to an ordinary variable on every render?',
      explain:
        'An ordinary variable is created anew on every render, and changing it does not trigger a re-render. You need the memory of the component — `useState` and a change through the setter.',
    },
    {
      question: 'What is the best way to get the number of finished tasks?',
      code: 'function Stats({ tasks }) {\n  // ???\n  return <p>Done: {done}</p>;\n}',
      options: [
        {},
        { text: '`useState(0)` and update it in `useEffect`', why: 'Extra state and an extra render — the value is easy to compute.' },
        {
          text: 'Ask the parent to pass a separate prop `done`',
          why: 'You can, but you do not need to: the value is computed from tasks right here.',
        },
        { text: 'Keep `done` in a global variable', why: 'Global variables break purity and do not trigger a re-render.' },
      ],
      explain: 'A derived value is computed during render and always matches the props.',
    },
    {
      question: 'What should you call a prop used only as the starting value for the colour state? One word in camelCase.',
      explain: 'The prefix `initial` (or `default`) honestly says that later changes of the prop are ignored.',
    },
    {
      question: 'What will `<ProfileForm key={userId} />` do when `userId` changes?',
      options: [
        { text: 'Create the form anew with fresh state' },
        { text: 'Pass `key` into the form as a prop', why: '`key` does not get into props — it is a service attribute for React.' },
        { text: 'Change nothing', why: 'A new key means a new instance of the component.' },
        { text: 'Throw an error', why: 'Changing key is allowed — it is a legitimate reset technique.' },
      ],
      explain: 'A change of key = removing the old instance and mounting a new one. All state starts over.',
    },
    {
      question: 'What happens after a click on a button with `setCount`?',
      items: [
        'The user clicks — the handler is called',
        'The handler calls `setCount(count + 1)`',
        'React schedules a re-render',
        'The component is called again, `count` is already new',
        'React updates the text of the button in the DOM',
      ],
      explain: 'A setter does not change the variable “in place” — it asks React to render the component with the new value.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: how do props differ from state?',
    starters: ['Props come…', 'And state…', 'To change state…'],
    keywords: [
      { label: 'Props come from the parent', words: ['parent', 'outside', 'passed', 'given'] },
      { label: 'State is the component’s own memory', words: ['memory', 'remember', 'inside', 'own'] },
      { label: 'State is changed through a setter', words: ['setter', 'setstate', 'set', 'usestate'] },
    ],
    model:
      'Props come from the parent, and the child only reads them. State is the component’s own memory: it keeps it with useState and changes it by calling the setter, after which React re-renders the component.',
  },
};
