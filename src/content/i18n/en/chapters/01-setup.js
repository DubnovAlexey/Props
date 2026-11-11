// Английский перевод пещеры 1 «Костровой грот» (оригинал — ../../../chapters/01-setup.js
// и 01-setup.syntax.js). Здесь только текст: id, значки, правильные ответы и код без русских
// слов берутся из оригинала. Списки объектов (карточки, варианты, шаги схем) идут в том же
// порядке, что в оригинале; пустой объект {} значит «в этом элементе переводить нечего».
// Примеры кода в строках («code», «fix», текст с тегами) IntelliJ проверяет как настоящий код и ругается
// на «неиспользуемые» функции и картинки без alt. Это учебные фрагменты, а не код игры: для них эти
// проверки выключены. Код игры они по-прежнему проверяют.
// noinspection JSUnusedLocalSymbols,HtmlRequiredAltAttribute,HtmlUnknownTarget,HtmlUnknownAttribute
export default {
  cave: 'Campfire Grotto',
  title: 'How a React project is built',
  goal: 'Understand what a React project consists of, how it starts and how modules connect components to each other.',

  pretest: {
    question: 'How does the browser “find out” about your App component?',
    options: [
      { text: 'The main.jsx file finds the #root element and renders `<App />` in it' },
      { text: 'The browser finds all .jsx files by itself' },
      { text: 'App is included in index.html with an `<App>` tag' },
      { text: 'Through CSS' },
    ],
    explain:
      "The entry point is main.jsx: `createRoot(document.getElementById('root')).render(<App />)`. From there React renders the whole tree by itself.",
  },

  lesson: [
    {
      title: 'What React is and why you need a bundler',
      body: [
        '[[react|React]] is a library: it turns components into a page and updates the page when the data changes.',
        'The browser does not understand JSX, so you need a [[bundler|bundler]], for example [[vite|Vite]]. It translates JSX into plain JavaScript, puts the files together and refreshes the page on the fly while you write code.',
        'Libraries are installed with [[npm|npm]], and their list is kept in the `package.json` file.',
      ],
      code: '# create a React project\nnpm create vite@latest my-app -- --template react\ncd my-app\nnpm install   # download the libraries\nnpm run dev   # start the dev server',
      codeTitle: 'Terminal',
      key: 'React draws the interface, Vite translates JSX and builds the project, npm brings the libraries. These are three different tools — do not mix them up.',
      scheme: {
        title: 'The path of code to the screen',
        steps: [
          { title: 'You write JSX', code: '<Card title="Cheese" />' },
          { title: 'Vite translates it into JavaScript', code: "jsx(Card, { title: 'Cheese' })" },
          { title: 'The browser runs plain JS' },
          { title: 'React draws the page' },
        ],
      },
      why: '`npm create vite@latest` downloads a project template. `npm install` puts the libraries from `package.json` into the `node_modules` folder. `npm run dev` runs the `dev` command from `package.json` — a development server that refreshes the page on every save. The lines after `#` are terminal comments.',
      alt: [
        {
          code: 'npm i\nnpm run build    # a ready build in the dist folder\nnpm run preview  # look at the build locally',
          note: '`npm i` is short for `npm install`. `build` makes an optimized version for publishing.',
        },
      ],
      wrong: [
        {
          why: 'The browser does not understand JSX: you cannot include a .jsx file directly — there will be a syntax error. The code has to go through a bundler.',
        },
        {
          why: 'The Vite template has no `start` command — npm will answer “Missing script: start”. Look for the commands in the scripts section of package.json.',
        },
      ],
    },
    {
      title: 'What lives where in a project',
      body: [
        'A typical Vite project:',
        '- `index.html` — an almost empty page with a single container, `<div id="root">`;',
        '- `package.json` — the list of libraries and commands (`dev`, `build`);',
        '- `src/main.jsx` — the [[entry-point|entry point]]: React starts working from here;',
        '- `src/App.jsx` — the root [[component|component]]; the whole tree grows from it;',
        '- `src/components/` — the other components, usually one per file.',
      ],
      key: 'There is no interface of yours in index.html — only an empty `#root`. React will put all the markup there.',
      scheme: {
        title: 'The project folder',
        root: {
          children: [
            { note: 'a page with an empty #root' },
            { note: 'libraries and commands' },
            { note: 'downloaded libraries — hands off' },
            {
              children: [{ note: 'the entry point' }, { note: 'the root of the component tree' }, { note: 'the other components' }],
            },
          ],
        },
      },
      why: '`<div id="root">` is an empty box: React will put the whole interface into it. `type="module"` allows `import` and `export` in the script. The path `/src/main.jsx` points to the entry point.',
      alt: [{ note: 'The container can have any name — what matters is that it matches in index.html and main.jsx.' }],
      wrong: [
        {
          why: 'Without `type="module"` the browser will not allow `import` inside the file: “Cannot use import statement outside a module”.',
        },
      ],
    },
    {
      title: 'Modules: import and export',
      body: [
        'Every file is a separate [[module|module]]. What a module gives to the outside is marked with the word `export`, and it is taken with the word `import`.',
        'An export can be a [[default-export|default]] one — one per file, imported without curly braces and under any name — or a [[named-export|named]] one: as many as you like, imported in curly braces by their exact names.',
      ],
      key: 'Curly braces in an import are for a named export, no braces — for the default export. A path without `./` (`react`) is a library, a path with `./` is your own file.',
      scheme: {
        left: {
          title: 'Default export',
          items: ['`export default function Card()`', 'one per file', '`import Card from …` — no braces, any name'],
        },
        right: {
          title: 'Named export',
          items: ['`export const MAX = 99`', 'as many as you like', '`import { MAX } from …` — in braces, the exact name'],
        },
      },
      why: '`export default` marks the main thing a file gives away — usually a component. A named `export` is for the rest: constants, hooks, utilities. In the line `import ProductCard, { MAX_COUNT }` the default export comes first, then the named ones in braces.',
      alt: [{ note: '`as` renames on import, `* as` gathers all named exports into one object.' }],
      wrong: [
        {
          why: 'ProductCard is exported by default, while the braces look for a named export with that name. There is none — the bundler will report an error.',
        },
        {
          why: 'You do not write `const` after `export default` — it is a syntax error. You can write `export default 99` or `export const MAX = 99`.',
        },
      ],
    },
    {
      title: 'The entry point: createRoot and StrictMode',
      body: [
        'In `main.jsx` React finds the `#root` container and draws `<App />` in it — that is [[create-root|createRoot]]. It is the only place where React “attaches” itself to the page: after that it renders the whole tree by itself.',
        '[[strict-mode|StrictMode]] is a mode of checks for development. It calls components and effects twice so that mistakes like an impure render or a forgotten cleanup show up at once. In a production build there are no double calls.',
      ],
      key: '`react` is components and hooks, `react-dom` is the link to the browser. `createRoot` is called once for the whole app.',
      scheme: {
        title: 'How the app comes alive',
        steps: [
          { title: 'index.html loads the entry point' },
          { title: 'createRoot finds the container' },
          { title: 'render draws the tree' },
          { title: 'React calls App and all its children', sub: 'from here on — only props and state' },
        ],
      },
      why: '`createRoot` takes a DOM element and creates a React “root” in it, and `.render(…)` draws JSX there. `StrictMode` wraps the app and turns on the checks in development mode. The comma after `</StrictMode>` is a trailing comma after the last argument: it is allowed and makes edits easier.',
      alt: [{ note: 'The root can be saved in a variable. StrictMode is optional, but it helps a lot in development.' }],
      wrong: [
        { why: '`ReactDOM.render` was removed in React 19. Use `createRoot` from `react-dom/client`.' },
        {
          why: 'A component function was passed, but an element, `<App />`, is needed. The screen will stay empty, and React will warn that functions cannot be rendered.',
        },
      ],
    },
    {
      title: 'One component — one file',
      body: [
        'It is convenient to keep components one per file, with the file named the same: `ProductCard.jsx` exports `ProductCard`. The file name starts with a capital letter, like the component name.',
        'Files with JSX get the `.jsx` extension (or `.tsx` for TypeScript) — that way both the bundler and the editor know there is markup inside.',
        'Related things are put side by side, in one folder: the component, its styles and its tests. That makes them easier to find and reuse.',
      ],
      key: 'A path in an import is counted from the file it is written in: `./` is the same folder, `../` is one level up.',
      scheme: {
        title: 'The component folder',
        root: {
          children: [
            {
              children: [
                { note: 'the component, export default' },
                { note: 'styles of this component only' },
                { note: 'tests next to the code' },
              ],
            },
            {},
          ],
        },
      },
      why: "`import styles from './ProductCard.module.css'` is a CSS module: the classes from the file become properties of the `styles` object and do not clash with the classes of other components. The path `./components/…` is counted from `App.jsx`.",
      alt: [
        {
          note: 'An `index.js` file in a folder lets you import by the folder name. It is handy, but it is an extra file — pick one style per project.',
        },
      ],
      wrong: [
        {
          why: 'Without `./` or `../` the path is treated as the name of a library from node_modules — the bundler will not find the file.',
        },
      ],
    },
    {
      title: 'React DevTools: props under a magnifying glass',
      body: [
        '[[devtools|React DevTools]] is a browser extension. The Components tab shows the component tree, and for the selected component — its props, state and hooks. You can even change a prop there and see the result at once.',
        'The Profiler tab records renders and shows which component re-rendered how many times and why.',
        'The second helper is the browser console (F12). React writes warnings with hints there, for example about a missing `key`.',
      ],
      key: 'If you do not understand which props came into a component, do not guess: open DevTools and look.',
      scheme: {
        title: 'How to look at props',
        steps: [
          { title: 'Install the React Developer Tools extension', sub: 'Chrome, Firefox or Edge' },
          { title: 'Open the page and press F12' },
          { title: 'The ⚛️ Components tab' },
          { title: 'Pick a component in the tree', sub: 'on the right — props, state and hooks' },
          { title: 'Change a prop — the screen updates' },
        ],
      },
    },
  ],

  spell: {
    text: 'npm fetches, Vite builds the loot — createRoot plants App in #root.',
    meaning: '[[npm|npm]] installs the libraries, [[vite|Vite]] builds the project, [[create-root|createRoot]] attaches React to the page.',
  },

  practice: [
    {
      statement: 'The browser can run JSX directly, without a bundler.',
      explain: 'JSX is not JavaScript. A bundler (Vite) translates it into `jsx()` calls before the code reaches the browser.',
    },
    {
      question: 'How do you import something exported like this: `export default function Card() {}`?',
      options: [
        {},
        { why: 'Curly braces are for a named export, and this is a default export.' },
        { why: 'The word default is not written in an import.' },
        { why: 'There is no such syntax.' },
      ],
      explain: 'A default export is imported without braces and under any name.',
    },
    {
      question: 'Match the file with its role.',
      pairs: [
        ['`index.html`', 'A page with an empty #root'],
        ['`main.jsx`', 'The entry point: createRoot'],
        ['`App.jsx`', 'The root component'],
        ['`package.json`', 'The list of libraries and commands'],
        ['`node_modules`', 'The downloaded libraries'],
      ],
      explain:
        'index.html provides the container, main.jsx attaches React to it, App is the root of the tree, package.json and node_modules are the libraries.',
    },
    {
      question: 'Complete the entry point.',
      explain: '`createRoot` is imported from `react-dom/client`, and the container id must match `<div id="root">` in index.html.',
    },
    {
      question: 'How do you import this?',
      bins: ['In curly braces', 'Without braces'],
      items: [{}, {}, {}, {}, { text: '`useState` from the react library' }, {}],
      explain:
        'A named export goes in braces, by its exact name. A default export goes without braces. `export { Card as default }` is a default export too.',
    },
    {
      question: 'The bundler says that Card.jsx has no default export. Which line is to blame?',
      code: "// Card.jsx\nexport function Card() {\n  return <div>Card</div>;\n}\n\n// App.jsx\nimport Card from './Card.jsx';",
      explain:
        'Card is exported as a named export, so it has to be imported in curly braces. Without braces the import looks for a default export, and there is none.',
    },
    {
      question: 'Why does StrictMode call components twice?',
      options: [
        { text: 'So that an impure render and a forgotten cleanup show up at once' },
        { text: 'To make the app run faster', why: 'Double calls only slow things down — that is why they exist only in development.' },
        { text: 'It is a bug in React', why: 'It is a deliberate check.' },
        {
          text: 'To show the component on the screen twice',
          why: 'There is one component on the screen: the result of the second call is a check, it is not shown.',
        },
      ],
      explain:
        'If a component is pure, the double call changes nothing. If it is not, the mistake shows at once, not a month later in front of your users.',
    },
    {
      question: 'Which command starts the dev server in a Vite project?',
      placeholder: 'command',
      explain: '`npm run dev` runs the `dev` command from the scripts section of package.json.',
    },
  ],

  explain: {
    prompt: 'Explain to Lunatik: how does a React app get onto the page?',
    starters: ['In index.html there is…', 'The main.jsx file…', 'Then React…'],
    keywords: [
      { label: 'An empty #root container in index.html', words: ['root', 'container', 'empty'] },
      { label: 'main.jsx: createRoot and render(<App />)', words: ['createroot', 'main', 'render', 'entry point'] },
      { label: 'React renders the tree from App by itself', words: ['tree', 'app', 'nested', 'component'] },
    ],
    model:
      'In index.html there is only an empty container, <div id="root">. The main.jsx file is the entry point: createRoot finds that container and renders <App /> in it. Then React itself calls App and all the nested components, passes them props and builds the page out of them.',
  },
};
