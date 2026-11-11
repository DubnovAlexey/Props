// Английский перевод пещер. Ключ — id пещеры, как в оригинале (src/content/chapters/index.js).
//
// Переведённая пещера лежит в своём файле (NN-имя.js) — там урок, разбор кода, задания.
// У пещер, до которых перевод ещё не дошёл, переведена только «вывеска» (название, тема, цель):
// она нужна уже сейчас — на карте пещер, в бестиарии и в свитках. Перевёл пещеру — перенеси
// её вывеску из HEADERS в файл пещеры и добавь файл в список внизу.
import setup from './01-setup.js';
import components from './02-components.js';
import jsBasics from './03-js-basics.js';
import functions from './04-functions.js';
import arrays from './05-arrays.js';
import passing from './06-passing.js';
import flow from './07-flow.js';
import state from './08-state.js';
import vdom from './09-vdom.js';
import callbacks from './10-callbacks.js';
import children from './11-children.js';
import special from './12-special.js';
import context from './13-context.js';
import hooks from './14-hooks.js';
import async from './15-async.js';

const HEADERS = {
  performance: {
    cave: 'Cave of Speed',
    title: 'memo, references and speed',
    goal: 'Understand how props are tied to speed: memo, useCallback, useMemo and React Compiler.',
  },
  types: {
    cave: 'Crystal Grotto',
    title: 'Prop types',
    goal: 'Learn to describe which props a component accepts: TypeScript, JSDoc and the changes in React 19.',
  },
  patterns: {
    cave: 'Underground Workshop',
    title: 'Forms and patterns',
    goal: 'Master controlled and uncontrolled fields, conditional rendering and popular patterns with props.',
  },
};

export const CHAPTERS = {
  ...HEADERS,
  setup,
  components,
  'js-basics': jsBasics,
  functions,
  arrays,
  passing,
  flow,
  state,
  vdom,
  callbacks,
  children,
  special,
  context,
  hooks,
  async,
};
