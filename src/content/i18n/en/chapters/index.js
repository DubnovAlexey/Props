// Английский перевод пещер. Ключ — id пещеры, как в оригинале (src/content/chapters/index.js).
//
// Каждая пещера лежит в своём файле (NN-имя.js): «вывеска» (название, тема, цель), урок, разбор кода,
// задания. С 11.11.2026 переведены все 18. Новый язык строится так же: файл на пещеру, а пока пещера
// не переведена — её «вывеска» в объекте HEADERS здесь (так сделано в истории английского перевода).
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
import asyncCave from './15-async.js';
import performanceCave from './16-performance.js';
import types from './17-types.js';
import patterns from './18-patterns.js';

export const CHAPTERS = {
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
  async: asyncCave,
  performance: performanceCave,
  types,
  patterns,
};
