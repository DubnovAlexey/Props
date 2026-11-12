// Реестр хозяев пещер: ключ — id пещеры.
//   Art   — рисунок (файл в art/);
//   light — цвет света снизу: у каждого свой, чтобы различать с первого взгляда.
// Имя, угрозы и «почему именно он» — в content/story.js (поле guardian).
// Новый хозяин = файл в art/ + строка здесь + запись guardian в story.js.
import Goblin from './art/Goblin.jsx';
import Troll from './art/Troll.jsx';
import Toad from './art/Toad.jsx';
import Lich from './art/Lich.jsx';
import Centipede from './art/Centipede.jsx';
import Mole from './art/Mole.jsx';
import Eel from './art/Eel.jsx';
import Spider from './art/Spider.jsx';
import Doppelganger from './art/Doppelganger.jsx';
import Banshee from './art/Banshee.jsx';
import Scorpion from './art/Scorpion.jsx';
import RatKing from './art/RatKing.jsx';
import Worm from './art/Worm.jsx';
import Mantis from './art/Mantis.jsx';
import Octopus from './art/Octopus.jsx';
import Werewolf from './art/Werewolf.jsx';
import Golem from './art/Golem.jsx';
import Minotaur from './art/Minotaur.jsx';
import Archivist from './art/Archivist.jsx';

export const GUARDIANS = {
  setup: { Art: Goblin, light: '#ff8a3d' },
  components: { Art: Troll, light: '#7fb069' },
  'js-basics': { Art: Toad, light: '#c3d43a' },
  functions: { Art: Lich, light: '#9b5cff' },
  arrays: { Art: Centipede, light: '#e0532f' },
  passing: { Art: Mole, light: '#e0a84a' },
  flow: { Art: Eel, light: '#2fb5a8' },
  state: { Art: Spider, light: '#c01733' },
  vdom: { Art: Doppelganger, light: '#cfd8e3' },
  callbacks: { Art: Banshee, light: '#7fd6ff' },
  children: { Art: Scorpion, light: '#e0a030' },
  special: { Art: RatKing, light: '#d43a3a' },
  context: { Art: Worm, light: '#e07a7a' },
  hooks: { Art: Mantis, light: '#8fe04a' },
  async: { Art: Octopus, light: '#b04ad6' },
  performance: { Art: Werewolf, light: '#ffd34a' },
  types: { Art: Golem, light: '#57e3ff' },
  patterns: { Art: Minotaur, light: '#ff5a1f' },
  // Не пещера, а Скрипторий Графа (вопросы Реестра): её хозяин живёт в content/course.js (COURSE.guardian)
  course: { Art: Archivist, light: '#d9a441' },
};
