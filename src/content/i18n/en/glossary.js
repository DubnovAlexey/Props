// Английский перевод словаря терминов (оригинал — src/content/glossary.js и glossaryCode.js).
// Ключ — id термина. У термина переводится:
//   title  — заголовок в словаре и всплывающем окне;
//   label  — подпись по умолчанию для [[id]] в тексте;
//   simple — простыми словами; tech — технически;
//   example и code — только если в оригинале в них есть русские слова.
// Чего здесь нет (например, title у useState), то берётся из оригинала: оно и так на латинице.
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute
export const GLOSSARY = {
  react: {
    simple: 'A library that builds an interface out of blocks called components and updates the page by itself when the data changes.',
    tech: 'A JavaScript library for building interfaces: you describe what the interface should look like for the current data, and React works out the changes and applies them to the DOM.',
  },
  component: {
    title: 'Component',
    label: 'component',
    simple: 'A building block of the interface: a button, a product card, a whole page. It can be used many times.',
    tech: 'A JavaScript function with a capitalized name that takes a props object and returns JSX.',
    example: 'function Hello({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}',
  },
  jsx: {
    simple: 'A notation that looks like HTML, right inside JavaScript. A convenient way to describe what to draw.',
    tech: 'A syntax extension of JS. The bundler turns every tag into a call of the function jsx(type, props).',
    example: '<Card title="Cheese" />\n// turns into\njsx(Card, { title: \'Cheese\' })',
    code: '<Card title="Cheese" />',
  },
  expression: {
    title: 'Expression in { }',
    label: 'expression',
    simple:
      'A piece of JavaScript that produces a value: a variable name, an addition, a function call. In JSX it is written in curly braces.',
    tech: 'Inside {} in JSX any expression (not a statement) is allowed: {user.name}, {count + 1}, {isOpen ? "Yes" : "No"}. if and for are not allowed there.',
  },
  element: {
    title: 'React element',
    label: 'element',
    simple: 'A description of what to draw — like an order in a kitchen, not the dish itself.',
    tech: 'A plain object with the fields type, key and props, returned by jsx(). React builds and updates the DOM from elements.',
    example: "{ type: Card, key: null, props: { title: 'Cheese' } }",
  },
  render: {
    title: 'Render',
    label: 'render',
    simple: 'The moment when React calls your component function to find out what it should look like now.',
    tech: 'Calling a component and computing a new tree of elements. Then React compares it with the old one and changes only the difference in the DOM.',
  },
  rerender: {
    title: 'Re-render',
    label: 're-render',
    simple: 'React calls the component once more because something has changed.',
    tech: 'A repeated call of the component function when its state changes, when a context it reads changes, or when its parent renders.',
  },
  dom: {
    simple: 'The live tree of the page in the browser — what the user sees.',
    tech: 'Document Object Model — the object representation of an HTML document that the browser and JavaScript work with.',
  },
  reconciliation: {
    title: 'Reconciliation',
    label: 'reconciliation',
    simple: 'React compares “how it was” with “how it is now” and changes only the difference on the page.',
    tech: 'The algorithm that compares the new tree of elements with the previous one. The key attribute helps to match list items correctly.',
  },
  tree: {
    title: 'Component tree',
    label: 'component tree',
    simple: 'Components are nested inside each other, like nesting dolls or the branches of a tree.',
    tech: 'A hierarchy: every component except the root has a parent and may have children inside. Data is passed along the branches from top to bottom.',
  },
  parent: {
    title: 'Parent',
    label: 'parent',
    simple: 'A component inside which another component is drawn.',
    tech: 'A component whose JSX creates the element of a child component. It is the parent that decides which props the child gets.',
  },
  child: {
    title: 'Child (child component)',
    label: 'child',
    simple: 'A component drawn inside another one; it receives props from it.',
    tech: 'A component whose element is created by the parent. It receives props but cannot change them.',
  },
  props: {
    title: 'Props',
    label: 'props',
    simple: 'A parcel of data that a parent sends to a child. The child opens it and uses it, but does not alter it.',
    tech: 'An object with the JSX attributes, which React passes to the component function as its only argument. Read-only.',
    example: '<Card title="Cheese" price={120} />\n\nfunction Card({ title, price }) { … }',
  },
  attribute: {
    title: 'Attribute',
    label: 'attribute',
    simple: 'A name=value record inside a tag.',
    tech: 'For your own components JSX attributes become props, for HTML tags — properties of the DOM element.',
    code: 'title="Cheese"',
  },
  fragment: {
    title: 'Fragment <>…</>',
    label: 'fragment',
    simple: 'An invisible wrapper: it lets you return several elements without an extra div.',
    tech: 'The Fragment component. The short form is <>…</>; the full <Fragment key={id}> is needed when a list requires a key.',
  },
  'strict-mode': {
    simple: 'A “strict teacher” mode during development: it calls components twice to catch mistakes.',
    tech: 'In development mode <StrictMode> calls components and effects again to find impure code. It has no effect in a built app.',
  },
  pure: {
    title: 'Pure function',
    label: 'pure function',
    simple: 'A function without surprises: the same input gives the same result, and it changes nothing outside.',
    tech: 'Deterministic and without side effects. React expects a component to be pure with respect to its props, state and context.',
  },
  'side-effect': {
    title: 'Side effect',
    label: 'side effect',
    simple: 'An action “on the side”: a request to a server, a timer, a change to an outside variable.',
    tech: 'An influence beyond computing the result. In React side effects are done in event handlers or in useEffect, but not during render.',
  },
  immutability: {
    title: 'Immutability',
    label: 'immutability',
    simple: 'We do not alter the old — we create the new.',
    tech: 'Objects and arrays are not mutated but replaced with copies ({...obj}, [...arr], map, filter). A new reference tells React that the data has changed.',
    example: "const next = [...items, newItem];\nconst renamed = { ...user, name: 'Count' };",
  },
  'read-only': {
    title: 'Read-only',
    label: 'read-only',
    simple: 'Props can be read but cannot be changed inside the component.',
    tech: 'In development mode React freezes the props object (Object.freeze, top level only): an assignment throws a TypeError.',
  },
  'one-way': {
    title: 'One-way data flow',
    label: 'one-way flow',
    simple: 'Data flows from top to bottom, like water in a waterfall.',
    tech: 'Data is passed only from parent to children through props. What goes up is not data but calls of callback functions.',
  },
  state: {
    title: 'State',
    label: 'state',
    simple: 'The memory of a component: what it remembers between re-renders and can change by itself.',
    tech: 'Data that React stores for an instance of a component. It is changed through a setter function and causes a re-render.',
  },
  usestate: {
    simple: 'A hook that gives a component a memory cell and a “change” button.',
    tech: 'const [value, setValue] = useState(initial). Calling setValue schedules a re-render with the new value.',
  },
  hook: {
    title: 'Hook',
    label: 'hook',
    simple: 'A special React function whose name starts with use.',
    tech: 'useState, useContext, useMemo and others. They are called only at the top level of a component or of a custom hook — not in conditions or loops (use is the exception).',
  },
  derived: {
    title: 'Derived value',
    label: 'derived value',
    simple: 'Something that can be computed from the data you already have. There is no need to store it separately.',
    tech: 'A value computed during render from props and state (const total = items.length) instead of a copy in useState.',
  },
  callback: {
    title: 'Callback (a function prop)',
    label: 'callback',
    simple: '“Call me when something happens” — a function that a parent gives to a child.',
    tech: 'A function passed as a prop. The child calls it (onDelete(id)) and so tells the parent about an event.',
    example: '<ProductCard onDelete={handleDelete} />\n// inside: onDelete(product.id)',
  },
  'event-handler': {
    title: 'Event handler',
    label: 'event handler',
    simple: 'A function that fires on a click, text input and other user actions.',
    tech: 'A function in the props onClick, onChange, onSubmit and the like. It receives an event object.',
  },
  event: {
    title: 'Event object',
    label: 'event object',
    simple: 'A packet of information about what happened: where the click was, what was typed.',
    tech: 'The handler’s argument (e). e.target is the element, e.target.value is the text of a field, e.preventDefault() cancels the browser’s action.',
  },
  'lifting-state': {
    title: 'Lifting state up',
    label: 'lifting state up',
    simple: 'If two siblings need the same data, keep it in their common parent.',
    tech: 'Moving state to the nearest common ancestor and passing the value and the functions that change it down to the children.',
  },
  controlled: {
    title: 'Controlled component',
    label: 'controlled',
    simple: 'An input field fully commanded by React.',
    tech: 'The value is set by the value prop from state, changes arrive through onChange. The source of truth is the state.',
  },
  uncontrolled: {
    title: 'Uncontrolled component',
    label: 'uncontrolled',
    simple: 'The field keeps its value by itself, and React only peeks into it when needed.',
    tech: 'The starting value is defaultValue; it is read through a ref or FormData when the form is submitted.',
  },
  children: {
    simple: 'Everything you put between the opening and the closing tag of a component.',
    tech: 'A special prop that the bundler fills with the contents of the tag: a string, an element, an array or even a function.',
    example: "<Card>Hello</Card>\n// jsx(Card, { children: 'Hello' })",
  },
  composition: {
    title: 'Composition',
    label: 'composition',
    simple: 'We build big things out of small ones by nesting components inside each other.',
    tech: 'Building an interface by nesting components and passing JSX through children and other props instead of inheritance.',
  },
  slot: {
    title: 'Slot',
    label: 'slot',
    simple: 'A “hole” in a component where the parent inserts its own piece of interface.',
    tech: 'A prop that accepts JSX (header, footer, icon) — a named place for content.',
  },
  'render-prop': {
    title: 'Render prop',
    label: 'render prop',
    simple: 'A function prop that returns markup: “I give the data — you say how to draw it.”',
    tech: 'A function in a prop (render, renderItem or children) that the component calls with its own data.',
  },
  hoc: {
    title: 'HOC (higher-order component)',
    simple: 'A wrapper function: it takes a component and returns an improved one.',
    tech: 'function withX(Component) { return (props) => <Component {...props} /> }. Nowadays it is more often replaced by hooks.',
  },
  key: {
    simple: 'A name badge for a list item, so that React does not mix the items up.',
    tech: 'A special attribute for reconciling lists. It must be unique among siblings and stable. It is not passed into the component as a prop.',
  },
  ref: {
    simple: 'A “bookmark” to a real DOM element, or to a value whose change does not cause a re-render.',
    tech: 'An object { current }, usually from useRef. In React 19 a ref can be passed to a function component as an ordinary prop.',
  },
  useref: {
    simple: 'A hook that gives a little box { current } that lives between re-renders.',
    tech: 'It returns the same object on every render. Changing current does not cause a re-render.',
  },
  'forward-ref': {
    simple: 'The old way to pass a ref into your own component.',
    tech: 'Before React 19 it was required for refs in function components. In React 19 it is not needed: ref arrives as an ordinary prop, and forwardRef is going to be deprecated.',
  },
  classname: {
    simple: 'That is how the HTML attribute class is written in JSX.',
    tech: 'It corresponds to the DOM property className. The word class is taken in JavaScript for classes.',
  },
  htmlfor: {
    simple: 'That is how the for attribute of the label tag is written in JSX.',
    tech: 'It corresponds to the DOM property htmlFor; the word for is taken in JavaScript for loops.',
  },
  'style-object': {
    title: 'style as an object',
    simple: 'Styles in JSX are passed as an object, not as a string.',
    tech: "style={{ color: 'red', fontSize: 16 }}: the outer braces are an expression, the inner ones are an object. Properties are in camelCase; a number means pixels for most properties.",
  },
  camelcase: {
    simple: 'writingLikeACamel: words are joined together, and every new word starts with a capital letter.',
    tech: 'That is how events and compound attributes are written in JSX: onClick, tabIndex, readOnly, backgroundColor. The exceptions are aria-* and data-*.',
  },
  aria: {
    title: 'aria attributes',
    simple: 'Hints for screen readers, which blind people use.',
    tech: 'aria-label, aria-expanded and others. In JSX they are written with a hyphen, as in HTML.',
  },
  'data-attr': {
    title: 'data attributes',
    simple: 'Your own data on an HTML tag: data-id="5".',
    tech: 'They are written with a hyphen and get into the DOM as they are; they are available through element.dataset.',
  },
  spread: {
    simple: '“Pour everything out of the box”: copy all the properties of an object or the items of an array.',
    tech: '{...obj} is a shallow copy of an object. In JSX <Card {...props} /> passes every property as a separate prop. Whatever is written later wins.',
  },
  rest: {
    simple: '“Put everything else here.”',
    tech: 'In destructuring it gathers the unused properties into a new object: function Btn({ variant, ...rest }). It is often passed on: {...rest}.',
  },
  destructuring: {
    title: 'Destructuring',
    label: 'destructuring',
    simple: 'Unpacking: we take the properties we need out of an object straight into variables.',
    tech: 'const { title, count } = props; the same right in the function parameters: function Card({ title }) {…}.',
  },
  'default-value': {
    title: 'Default value',
    label: 'default value',
    simple: 'A fallback in case the prop was not passed.',
    tech: 'function Avatar({ size = 48 }) — it works only for undefined. null, 0 and an empty string count as passed values.',
  },
  undefined: {
    simple: '“Nothing was passed”: that is the value of a prop that is not specified in JSX.',
    tech: 'The primitive value “absent”. Default values kick in for undefined; in JSX undefined draws nothing.',
  },
  null: {
    simple: '“Empty on purpose.”',
    tech: 'A component can return null to draw nothing. A default value does not kick in for null.',
  },
  'boolean-shorthand': {
    title: 'A boolean prop without a value',
    label: 'boolean prop',
    simple: 'An attribute without a value means “yes”.',
    tech: '<Modal isOpen /> is the same as isOpen={true}.',
  },
  reference: {
    title: 'Object reference',
    label: 'reference',
    simple: 'The address of an object in memory. Two boxes that look the same are still two different boxes.',
    tech: 'Objects, arrays and functions are compared by reference: {} === {} gives false. Numbers and strings are compared by value.',
  },
  'object-is': {
    simple: 'The way of comparing that React uses: “is this the same value?”',
    tech: 'Almost like ===, but NaN equals NaN, and 0 and -0 differ. That is how React compares state, props in memo and the dependencies of hooks.',
  },
  shallow: {
    title: 'Shallow comparison',
    label: 'shallow comparison',
    simple: 'Comparing “at the top level”, without looking inside nested objects.',
    tech: 'Every prop is compared with its old value through Object.is. That is how memo works.',
  },
  context: {
    title: 'Context',
    simple: '“Broadcasting” data to a whole subtree: whoever wants to, tunes in and listens.',
    tech: 'createContext() creates a channel, a provider sets the value, useContext or use read the nearest value up the tree.',
  },
  provider: {
    title: 'Provider',
    label: 'provider',
    simple: 'A component that “broadcasts” a context value to everything nested inside.',
    tech: 'In React 19: <ThemeContext value="dark">…</ThemeContext>. The old form ThemeContext.Provider still works.',
  },
  usecontext: {
    simple: 'A hook that “tunes in” to a context and returns its value.',
    tech: 'It returns the value of the nearest provider up the tree, or the default value. When the value changes, the component re-renders.',
  },
  use: {
    simple: 'A new helper of React 19: it reads a context or waits for a promise.',
    tech: 'Unlike the other hooks, use can be called inside if and loops.',
  },
  'prop-drilling': {
    title: 'Prop drilling',
    simple: 'Passing a prop down a chain through components that do not need it.',
    tech: 'It complicates the code and breaks when the tree is rearranged. The cure is composition (pass JSX through children) or Context.',
  },
  memo: {
    simple: '“The same parcel — I do not open it”: do not re-render a component if its props have not changed.',
    tech: 'memo(Component) skips a render if all the props equal the previous ones by Object.is. It does not protect from changes of its own state and context.',
  },
  usememo: {
    simple: 'It remembers the result of a computation so as not to compute it again needlessly.',
    tech: 'useMemo(() => value, [dependencies]) — a new value only when the dependencies change; it also gives a stable reference to an object.',
  },
  usecallback: {
    simple: 'It remembers the function itself, so that it stays “the same” between re-renders.',
    tech: 'useCallback(fn, [dependencies]) returns the same function until the dependencies change. Useful together with memo on a child.',
  },
  deps: {
    title: 'Dependency array',
    label: 'dependencies',
    simple: 'A list of values; when they change, the hook recomputes its result.',
    tech: 'The second argument of useMemo, useCallback, useEffect: [a, b]. The values are compared through Object.is.',
  },
  'react-compiler': {
    simple: 'An optimization autopilot: it places memoization by itself when the project is built.',
    tech: 'A build tool (stable version 1.0 — October 2025). With it manual memo, useMemo and useCallback are needed less often, but the code still has to be pure.',
  },
  typescript: {
    simple: 'JavaScript with types: you describe in advance what data you expect, and the editor catches mistakes before the code runs.',
    tech: 'A superset of JS with static type checking. For props you describe the type of the object and state it in the component’s parameter.',
  },
  'type-props': {
    title: 'Props type',
    label: 'props type',
    simple: 'A contract: which props, and of what kind, a component accepts.',
  },
  'optional-prop': {
    title: 'Optional prop',
    label: 'optional prop',
    simple: 'A prop that may be left out.',
    tech: 'In TypeScript it is marked with the ? sign: count?: number. Inside the component its value may be undefined.',
  },
  'react-node': {
    simple: 'The type “anything that can be drawn”.',
    tech: 'A string, a number, an element, an array, null, undefined, a boolean. This is how children is usually typed.',
  },
  jsdoc: {
    simple: 'A description of types in the comments of plain JavaScript.',
    tech: 'Comments like /** @param {…} props */. With // @ts-check at the top of the file the editor checks them like TypeScript.',
  },
  proptypes: {
    simple: 'The old check of prop types right while the app is running.',
    tech: 'Removed in React 19: the checks are silently ignored. TypeScript has taken its place.',
  },
  defaultprops: {
    simple: 'The old way to set default values of props.',
    tech: 'Removed for function components in React 19 — use default values in destructuring. Class components still have it.',
  },
  conditional: {
    title: 'Conditional rendering',
    label: 'conditional rendering',
    simple: 'We draw different things depending on conditions.',
    tech: 'if with an early return, the ternary operator cond ? a : b, cond && a. Careful: 0 && <X /> will draw 0.',
  },
  'list-rendering': {
    title: 'Rendering a list',
    label: 'list rendering',
    simple: 'We turn an array of data into a set of elements.',
    tech: 'items.map(item => <Item key={item.id} item={item} />). Every element needs a stable key.',
  },
  'optional-chaining': {
    title: '?. — optional chaining',
    simple: 'Safe access: if the object is missing, it returns undefined instead of an error.',
    tech: 'user?.name — if user is null or undefined, the result is undefined, not a TypeError.',
  },
  nullish: {
    title: '?? — nullish coalescing',
    simple: 'A fallback value only for the “empty” case (null or undefined).',
    tech: 'a ?? b takes b only if a is null or undefined. Unlike ||, it does not replace 0, false or an empty string.',
  },
  'arrow-function': {
    title: 'Arrow function',
    label: 'arrow function',
    simple: 'A short way to write a function.',
    tech: '(a) => a * 2. In handlers: onClick={() => onDelete(id)} — the function is created, but it will be called only on a click.',
  },
  module: {
    title: 'Module (import/export)',
    label: 'module',
    simple: 'A file that shares code with other files.',
    tech: 'export gives a function or a value to the outside, import takes it. That is how a project is split into independent parts.',
  },
  vite: {
    simple: 'A bundler and a dev server: it turns JSX into plain JS and refreshes the page instantly when you edit the code.',
    tech: 'A frontend build tool: npm run dev is the development server, npm run build makes the ready files in the dist folder.',
  },
  npm: {
    simple: 'A package manager: it installs libraries and runs the project’s commands.',
    tech: 'npm install — install the dependencies from package.json, npm run <script> — run a script.',
  },
  mount: {
    title: 'Mounting',
    label: 'mounting',
    simple: 'The first appearance of a component on the page. Unmounting is its removal.',
    tech: 'When the key changes, React unmounts the old instance (together with its state) and mounts a new one.',
  },
  useeffect: {
    simple: 'A hook for working with the outside world after the draw: timers, subscriptions, requests.',
    tech: 'useEffect(() => {…}, [dependencies]). Do not use it to copy props into state — that is an extra render and a source of bugs.',
  },
  'rules-of-hooks': {
    title: 'Rules of hooks',
    label: 'rules of hooks',
    simple: 'Hooks are called only at the top of a component and always in the same order.',
    tech: 'Only at the top level of a function component or of a custom hook: not in conditions, loops, nested functions, and not after an early return. React matches hooks by the order of calls. The exception is use.',
  },
  'functional-update': {
    title: 'Functional update',
    label: 'functional update',
    simple: 'We pass to the setter not a value but a function: “how to get the new from the old”.',
    tech: 'setCount(c => c + 1): React will call the function with the freshest value. It is needed when the new state depends on the previous one.',
  },
  cleanup: {
    title: 'Effect cleanup',
    label: 'cleanup',
    simple: 'Tidying up after an effect: stop a timer, unsubscribe.',
    tech: 'The function that useEffect returns. It runs before the effect runs again and when the component is removed.',
  },
  usereducer: {
    simple: 'A hook for complex state: all the changes are described in one function.',
    tech: 'const [state, dispatch] = useReducer(reducer, initial). dispatch({ type }) sends an action, the reducer returns the new state.',
  },
  reducer: {
    title: 'Reducer',
    label: 'reducer',
    simple: 'A pure function: (old state, action) → new state.',
    tech: 'It does not mutate the old state but returns a new one. Easy to test: the same input gives the same output.',
  },
  'custom-hook': {
    title: 'Custom hook',
    label: 'custom hook',
    simple: 'Your own function useSomething that assembles logic out of other hooks.',
    tech: 'It shares logic, not state: every component that calls the hook gets its own copy of the state. It obeys the rules of hooks.',
  },
  'virtual-dom': {
    title: 'Virtual DOM',
    label: 'virtual DOM',
    simple: 'A light “reflection” of the page in memory: a tree of plain objects by which React decides what to change on the screen.',
    tech: 'The tree of React elements produced by a render. React compares the new tree with the previous one (reconciliation) and applies only the differences to the real DOM.',
    example: "{ type: 'h1', key: null, props: { children: 'Count' } }",
  },
  commit: {
    title: 'Commit',
    label: 'commit',
    simple: 'The step where React finally changes the real page — and only where there is a difference.',
    tech: 'The phase after render and reconciliation: React applies the changes it found to the DOM, then the browser paints the screen and the effects run.',
  },
  diffing: {
    title: 'Diffing (comparing trees)',
    label: 'diffing',
    simple: 'How React looks for the difference: another type — it builds anew, the same type — it updates, lists are checked by key.',
    tech: 'A heuristic algorithm that compares trees in linear time: elements of different types are treated as different subtrees, the children of lists are matched by key.',
  },
  batching: {
    title: 'Batching (batched updates)',
    label: 'batching',
    simple: 'React gathers several state changes in a row into a batch and re-renders once.',
    tech: 'Automatic merging of state updates into one render — in handlers, timers and promises (since React 18). An immediate DOM update is flushSync.',
    example: "setName('');\nsetAge(0); // one render for both",
  },
  fiber: {
    simple: 'The inner engine of React: it splits the work into pieces and can postpone the unimportant for the sake of the urgent.',
    tech: 'The reconciliation architecture of React: every part of the tree is a fiber node. Work can be interrupted, prioritized and resumed — concurrent rendering and useTransition are built on this.',
  },
  declarative: {
    title: 'Declarative approach',
    label: 'declarative approach',
    simple: 'You describe WHAT should be on the screen, not HOW to make it step by step.',
    tech: 'The opposite of the imperative style, where the DOM is changed by commands step by step. In React the interface is a function of data: UI = f(props, state).',
  },
  bundler: {
    title: 'Bundler',
    label: 'bundler',
    simple: 'A program that translates JSX into plain JavaScript and puts all the project files together.',
    tech: 'A build tool (Vite, webpack, Rollup): it resolves imports, translates JSX and TypeScript, merges and minifies files, and in development updates the page without a reload.',
  },
  'entry-point': {
    title: 'Entry point',
    label: 'entry point',
    simple: 'The file an app starts from. In a Vite project it is src/main.jsx.',
    tech: 'The module that is included in index.html and starts the rest: in a React project it calls createRoot and renders the root component.',
  },
  'create-root': {
    simple: 'The function that “attaches” React to an empty container on the page.',
    tech: 'createRoot(domNode) from react-dom/client creates a React root; root.render(<App />) draws the component tree in it. It is called once per app.',
  },
  'default-export': {
    title: 'Default export',
    label: 'default export',
    simple: 'The main thing a file gives away. It is imported without curly braces and under any name.',
    tech: 'export default — one per module. import Card from "./Card.jsx" gets exactly it.',
  },
  'named-export': {
    title: 'Named export',
    label: 'named export',
    simple: 'An export with an exact name: a file can have as many as you like, and they are imported in curly braces.',
    tech: 'export const / export function. Import: import { MAX } from "./file.js"; renaming — import { MAX as LIMIT }.',
  },
  devtools: {
    simple: 'A browser extension that shows the component tree, their props, state and hooks.',
    tech: 'The tabs Components (the tree, props, state, hooks — editable on the fly) and Profiler (a recording of renders and their reasons).',
  },
  function: {
    title: 'Function',
    label: 'function',
    simple: 'A named piece of code: it takes parameters, does something and returns a result.',
    tech: 'A declaration function f() {}, an expression const f = function () {} or an arrow const f = () => {}. Without return it returns undefined.',
  },
  parameter: {
    title: 'Parameter and argument',
    label: 'parameter',
    simple: 'A parameter is an “empty cell” in the function declaration, an argument is the value put into it at the call.',
    tech: 'function double(x) — x is a parameter; double(4) — 4 is an argument. Parameters can have default values and destructuring.',
  },
  'higher-order': {
    title: 'Higher-order function',
    label: 'higher-order function',
    simple: 'A function that takes another function or returns one.',
    tech: 'map, filter, setTimeout, memo and HOCs are higher-order functions: they work with functions as values.',
  },
  closure: {
    title: 'Closure',
    label: 'closure',
    simple: 'A function remembers the variables of the place where it was created, even when that place has already “finished”.',
    tech: 'A function plus the lexical environment of its creation. Handlers in a component are closures over the props and state of a particular render.',
  },
  'stale-closure': {
    title: 'Stale closure',
    label: 'stale closure',
    simple: 'A function was created long ago and sees old values of props or state.',
    tech: 'A typical cause is missing dependencies in useEffect or useCallback. The cure is a correct dependency array, a functional update or a ref.',
  },
  'array-method': {
    title: 'Array methods',
    label: 'array methods',
    simple: 'Ready-made functions of an array: map transforms every item, filter picks items, reduce folds them into one value.',
    tech: 'Copying: map, filter, slice, concat, toSorted, toReversed, with. Mutating: push, pop, shift, unshift, splice, sort, reverse.',
  },
  mutation: {
    title: 'Mutation',
    label: 'mutation',
    simple: 'Changing an object or an array “in place”, without creating a new one.',
    tech: 'push, splice, sort, the assignment obj.key = … The reference does not change, so React, which compares through Object.is, may not notice the change.',
  },
  truthy: {
    title: 'Truthy and falsy values',
    label: 'truthy values',
    simple:
      'How a value behaves in a condition. There are only eight falsy ones: false, 0, -0, 0n, an empty string, null, undefined and NaN.',
    tech: 'Everything else is truthy, including "0", "false", [] and {}. To check: Boolean(value) or !!value.',
  },
  'short-circuit': {
    title: 'Short-circuit evaluation',
    label: 'short-circuit evaluation',
    simple: '&& and || stop as soon as the answer is clear and return one of the original values, not true/false.',
    tech: 'a && b → a if a is falsy, otherwise b. a || b → a if a is truthy, otherwise b. Hence the trap {count && <Badge />} when count = 0.',
    example: "0 && 'yes' // 0",
  },
  'template-literal': {
    title: 'Template string',
    label: 'template string',
    simple: 'A string in backticks into which values can be inserted with ${…}.',
    tech: 'A template literal: it substitutes any expressions and keeps line breaks.',
    example: '`${name}, you are ${age} years old`',
  },
  promise: {
    simple: 'A “promise” of a result that will come later — or of an error.',
    tech: 'An object with the states pending, fulfilled and rejected. The result is obtained through then/catch or await.',
  },
  'async-await': {
    simple: 'A convenient way to write waiting: await “waits” for a Promise without freezing the page.',
    tech: 'An async function always returns a Promise; await pauses it until the promise settles. Errors are caught with try…catch.',
  },
  fetch: {
    simple: 'A built-in browser function for requests to a server.',
    tech: 'fetch(url, options) returns a Promise<Response>. HTTP errors (404, 500) do not reject the Promise — check response.ok. The body is read with response.json().',
  },
  'race-condition': {
    title: 'Race condition',
    label: 'race condition',
    simple: 'An old response arrives later than a new one and overwrites it.',
    tech: 'It happens when an effect restarts before the response arrives. The protection is an ignore flag in the effect cleanup or an AbortController.',
  },
  'loading-state': {
    title: 'Loading state',
    label: 'loading state',
    simple: 'A flag “the data is still on its way”, to show a placeholder or disable a button.',
    tech: 'Usually the trio isLoading / error / data. The loader component keeps it, and the children get it through props.',
  },
  suspense: {
    simple: 'A wrapper that shows a fallback view while something inside is loading.',
    tech: '<Suspense fallback={…}> shows the fallback while a descendant is “suspended”: for example, use(promise) is waiting for data or a lazy component is loading.',
  },
};
