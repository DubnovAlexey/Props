// Английский перевод «анатомии кода» (оригинал — src/content/syntaxGuide.js): объяснения
// конструкций, которые показывает кнопка «Разобрать синтаксис» под любым примером кода.
// Переводится title, sample (если в нём русские слова), simple и why; term — из оригинала.
export const SYNTAX_GUIDE = {
  constructs: {
    comment: {
      title: 'Comment',
      simple: 'A note for people: from // to the end of the line the code ignores it.',
      why: 'A good comment explains “why”, it does not retell the code.',
    },
    'component-decl': {
      title: 'Component declaration',
      sample: 'function Name()',
      simple: 'A function with a capitalized name is a component: a function that returns JSX.',
      why: 'By the capital letter React tells your component from an HTML tag.',
    },
    'function-decl': {
      title: 'Function declaration',
      sample: 'function name()',
      simple: 'An ordinary function: an event handler or a helper.',
      why: 'A lowercase name means it is not a component.',
    },
    return: {
      title: 'return — the result of a function',
      simple: 'What the function gives to the outside. A component returns JSX — a description of the interface.',
      why: 'Multi-line JSX after return is wrapped in ( ), otherwise JavaScript puts a semicolon right after return and returns undefined.',
    },
    const: {
      title: 'const / let — a variable',
      simple: 'const — the variable cannot be reassigned, let — it can.',
      why: 'In React almost everything is declared with const: a new value is a new object, not an overwrite of the old one.',
    },
    'destructure-props': {
      title: 'Unpacking the argument',
      simple: '{ … } in the parameter parentheses takes the needed properties out of the props object at once.',
      why: 'It is shorter than props.title, and the first line shows which props the component expects.',
    },
    'destructure-object': {
      title: 'Object destructuring',
      simple: 'Takes the properties of an object into variables with the same names.',
    },
    'destructure-array': {
      title: 'Array destructuring',
      simple: 'Takes the items of an array in order. That is how the value and the setter are taken from useState.',
      why: 'You choose the names yourself: [count, setCount], [name, setName].',
    },
    'default-value': {
      title: 'Default value',
      sample: 'name = value',
      simple: 'It is used if the prop was not passed (undefined).',
      why: 'It does not work for null, 0 or an empty string — they count as passed.',
    },
    arrow: {
      title: 'Arrow function',
      simple: '(arguments) => result — a short way to write a function.',
      why: 'In onClick={() => onDelete(id)} the arrow postpones the call until the click.',
    },
    'jsx-component': {
      title: 'A tag of your own component',
      sample: '<Name …>',
      simple: 'A capital letter means your component. Its attributes are gathered into the props object.',
    },
    'jsx-tag': {
      title: 'An HTML tag in JSX',
      simple: 'A built-in browser tag. Its attributes become properties of the DOM element.',
    },
    'jsx-tag-end': {
      title: 'The end of the opening tag',
      simple: 'After it the contents of the tag begin — what gets into children.',
    },
    'jsx-close': {
      title: 'Closing tag',
      sample: '</Name>',
      simple: 'Closes the tag. Everything between the opening and the closing tag is the contents (children).',
    },
    'jsx-selfclose': {
      title: 'Self-closing tag',
      simple: 'Closes a tag that has no contents.',
      why: 'In JSX closing is required: <img />, <input />, <Card />. Otherwise it is a syntax error.',
    },
    fragment: {
      title: 'Fragment <> </>',
      simple: 'An invisible wrapper: it lets you return several elements without an extra <div>.',
    },
    attr: {
      title: 'Attribute → prop',
      sample: 'name=',
      simple: 'name=value on a component becomes a property of the props object.',
    },
    'attr-string': {
      title: 'A string in quotes',
      simple: 'A value in quotes is always a string.',
      why: 'Numbers, true/false, objects and functions are passed in curly braces: count={2}.',
    },
    'jsx-expr': {
      title: 'An expression in an attribute',
      simple: 'Inside { } is JavaScript: a number, a variable, a function, an object.',
      why: 'Quotes would give a string, while braces pass the value as it is.',
    },
    'double-brace': {
      title: 'Double braces {{ }}',
      simple: 'The outer { } are a “window into JavaScript”, the inner ones are an object.',
      why: 'It is not a special syntax: just an object inside an expression.',
    },
    object: {
      title: 'Object { key: value }',
      sample: '{ key: … }',
      simple: 'A set of “key — value” pairs. The props object looks like this too.',
    },
    'jsx-child-expr': {
      title: 'A value inside the markup',
      simple: '{value} between tags shows the value on the screen.',
      why: 'Only an expression goes inside: if and for are not allowed, use ? : and .map() instead.',
    },
    block: { title: 'Code block { }', simple: 'Curly braces group code: the body of a function, a branch of an if.' },
    array: { title: 'Array [ ]', simple: 'A list of values in order.' },
    index: { title: 'Access by index', simple: 'An item of an array by its number, counting from zero.' },
    spread: {
      simple: 'Pours out the properties of an object or the items of an array. In JSX {...props} passes them as separate props.',
      why: 'The copy is shallow; whatever is written later wins.',
    },
    rest: {
      title: 'Rest ...rest',
      simple: 'Gathers “everything else” into a new object.',
      why: 'Handy for passing unused props further: {...rest}.',
    },
    'optional-chaining': {
      title: '?. — safe access',
      simple: 'If the left side is null or undefined, the result is undefined, not an error.',
    },
    nullish: {
      title: '?? — fallback value',
      simple: 'Takes the right side only if the left one is null or undefined.',
      why: 'Unlike ||, it does not replace 0 or an empty string.',
    },
    and: {
      title: '&& — “and”',
      simple: 'condition && <X /> draws X only if the condition is true.',
      why: 'The left side should be true/false: 0 && <X /> will show 0 on the screen.',
    },
    or: { title: '|| — “or”', simple: "The right side, if the left one is “falsy”: 0, '', false, null, undefined." },
    ternary: {
      title: 'Ternary operator ? :',
      simple: 'condition ? A : B — A if it is true, otherwise B.',
      why: 'A replacement for if inside JSX: if cannot be written there.',
    },
    'strict-equal': {
      title: '=== and !== — strict comparison',
      simple: "Comparison without type conversion: 1 === '1' is false.",
    },
    compare: { title: 'Comparison < >', simple: 'Greater / less. Gives true or false.' },
    not: { title: '! — negation', simple: '!isOpen reads as “not open”.' },
    import: {
      title: 'import — include a module',
      simple: 'Takes a function or a component from another file or a library.',
    },
    export: {
      title: 'export — give to the outside',
      simple: 'Makes a function available to other files; export default is the main value of a file.',
    },
    if: {
      title: 'if / else — a condition',
      simple: 'Run the code only if the condition is true.',
      why: 'if cannot be written in JSX — ? : and && are used there, and if goes before return.',
    },
    literal: {
      simple: 'Ready-made values: “yes”, “no”, “empty on purpose”, “not set”.',
    },
    number: { title: 'Number', simple: 'Written without quotes. In JSX — in braces: {42}.' },
    string: { title: 'String', simple: 'Text in quotes: \'…\' or "…".' },
    template: { title: 'Template string', simple: 'A string in backticks with substitution: `Hello, ${name}`.' },
    new: { title: 'new — create an object', simple: 'Creates an object: new Date(), new FormData(form).' },
    typeof: { title: 'typeof — find out the type', simple: "typeof x returns a string: 'number', 'string', 'object'…" },
    'ts-type': {
      title: 'Type (TypeScript)',
      simple: 'A description of the shape of data. The editor checks it before the code runs.',
    },
    'keyword-other': { title: 'JavaScript keyword', simple: 'A word reserved by the language.' },
    'key-attr': {
      title: 'key — the badge of a list item',
      simple: 'React needs it to tell list items apart. It does not get into props.',
    },
    'ref-attr': {
      title: 'ref — access to a DOM element',
      simple: 'A bookmark to the real element. In React 19 it is an ordinary prop.',
    },
    'classname-attr': { simple: 'That is how the HTML attribute class is written in JSX.' },
    'htmlfor-attr': { simple: 'That is how the for attribute of label is written in JSX.' },
    'style-attr': {
      title: 'style — an object of styles',
      simple: 'Styles as an object, properties in camelCase; a number means pixels.',
    },
    'event-attr': {
      title: 'Event handler',
      simple: 'We pass a function — React will call it when the event happens.',
      why: 'onClick={fn} — pass it; onClick={fn()} — call it at once during render (a mistake).',
    },
    'aria-attr': { title: 'aria-* for accessibility', simple: 'Hints for screen readers. Written with a hyphen.' },
    'data-attr': { title: 'data-* — your own data', simple: 'Data on a tag, written with a hyphen.' },
    'value-attr': {
      title: 'value / checked — the value of a field',
      simple: 'The value of a field from state. Together with onChange it is a controlled field.',
    },
    'default-value-attr': {
      title: 'defaultValue — the starting value',
      simple: 'The initial value of an uncontrolled field.',
    },
    'props-ident': { title: 'props — the props object', simple: 'The only argument of a component: all the attributes passed to it.' },
    'children-ident': { simple: 'The prop with the contents between the opening and the closing tag.' },
    'callback-prop': {
      title: 'Callback prop on…',
      simple: 'A function from the parent: call it to report an event.',
    },
    handler: {
      title: 'Handler handle…',
      simple: 'A function in the parent that is passed to children in an on… prop.',
    },
    setter: {
      title: 'State setter set…',
      simple: 'Changes the state and asks React to re-render the component.',
    },
    'event-obj': {
      title: 'Event object e',
      simple: 'What happened: e.target is the element, e.target.value is the text of the field.',
    },
    console: { title: 'console.log — debugging', simple: 'Prints a value to the browser console (F12).' },
  },

  react: {
    useState: { simple: 'the memory of a component: [value, setter]' },
    useEffect: { simple: 'synchronization with the outside world after render' },
    useContext: { simple: 'read the value of a context' },
    use: { simple: 'React 19: read a context or a promise, allowed inside if' },
    useMemo: { simple: 'remember the result of a computation' },
    useCallback: { simple: 'remember a function — a stable reference' },
    useRef: { simple: 'a little box { current } without re-renders' },
    useReducer: { simple: 'state that is changed by actions through a reducer' },
    useId: { simple: 'a unique id to link a label and a field' },
    useTransition: { simple: 'mark an update as non-urgent' },
    memo: { simple: 'skip the render when the props are the same' },
    createContext: { simple: 'create a context channel' },
    forwardRef: { simple: 'the old way to pass a ref (before React 19)' },
  },

  methods: {
    map: { simple: 'a new array: every item is transformed' },
    filter: { simple: 'a new array with only the matching items' },
    reduce: { simple: 'fold an array into one value (a sum, an object)' },
    sort: { simple: 'sorts IN PLACE — it changes the original array!' },
    toSorted: { simple: 'a new sorted array, the original is not touched' },
    push: { simple: 'adds to the end IN PLACE — a mutation!' },
    includes: { simple: 'is the value in the array or the string → true/false' },
    preventDefault: { simple: 'cancel the browser’s action (the reload when a form is submitted)' },
    focus: { simple: 'put the cursor into the field' },
    freeze: { simple: 'freeze an object: writing to its properties is an error' },
    is: { simple: 'Object.is — the comparison that React uses' },
  },

  reactTitle: '{name} — a React function',
  hookWhy: 'Hooks are called at the top level of a component, not in conditions or loops (use is the exception).',
};
