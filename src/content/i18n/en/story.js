// Английский перевод сюжета (оригинал — src/content/story.js): ярусы, пролог, эпилог, финал
// и рассказ каждой пещеры с её хозяином. Здесь только текст: номера ярусов, значки и цвета
// берутся из оригинала. Ключи — те же id, что в оригинале.

export const TIERS = {
  upper: {
    title: 'The Upper Grottoes',
    sub: 'The basics: how a project is built, components, objects, functions, arrays and passing props',
  },
  twilight: {
    title: 'The Twilight Caves',
    sub: 'How React thinks: data flow, state, the virtual DOM, events, composition and keys',
  },
  deep: {
    title: 'The Depths',
    sub: 'Mastery: Context, hooks, data from a server, speed, types and patterns',
  },
};

export const FINALE = {
  cave: 'The Count’s Lair',
  title: 'The Count’s Trial',
};

export const PROLOGUE = {
  title: 'How you ended up in the caves',
  text: [
    'A storm drove you into the mountains, to the black mouth of a cave. Inside it smells of wax and old code. Out of the dark steps **Count Propsula** — a vampire who still remembers the first versions of React.',
    '“Do not be afraid,” he hisses. “I do not need your blood. I need a pupil.” Every cave has a monster for a guardian, and every one of them serves the Count. Pass through all the caves, from the campfire grotto to the lair, and the Count will reveal to you the secret of [[props|props]].',
    'Each cave is deeper and darker than the one before. What you learn above will save you below.',
  ],
};

export const EPILOGUE = {
  title: 'Dawn',
  text: [
    'You have passed every cave and survived the trial. The cave guardians bow their heads, and the Count takes a bat-shaped medallion from his neck: “Now you are the **Keeper of Props**.”',
    '“Remember: data flows down, events fly up, and mutating props is worse than stepping into the sun.” The bats see you to the exit, where the sky is already turning grey.',
  ],
};

export const CHAPTER_STORY = {
  setup: {
    intro:
      'At the mouth of the caves travellers light a fire and check their gear. Before you go down, learn how a React project is built and where it starts from.',
    outro: 'The gear is packed, the torch is lit. Ahead lies the first cave; a single candle burns at its entrance.',
    guardian: {
      name: 'Skulk',
      kind: 'goblin stoker',
      threat: 'No gear — no caves! First work out what is in your backpack, or you will burn at the first turn.',
      defeat: 'The goblin grumbles, but hands you the torch.',
      why: 'The goblin keeps the fire and the gear — the way npm and Vite keep a project: without them nothing starts.',
      bio: 'He worked as a stoker in hell, but was fired for wasting coal and being late for all eternity. Now he keeps the fire at the entrance and checks everyone’s backpack — hell, he says, was stricter.',
    },
  },
  components: {
    intro:
      'Scratched on the wall: “Whoever enters is a function.” The Count explains: everything in his caves is built from blocks called components.',
    outro:
      'The troll has crumbled into blocks, the candle flares brighter. From the depths comes a smell of herbs and sulphur — an alchemist is brewing potions there.',
    guardian: {
      name: 'Boulder',
      kind: 'troll gatekeeper',
      threat: 'Only functions with a capital letter pass through my gate! The rest I crush.',
      defeat: 'The troll crumbles into stone blocks — components — and lets you through.',
      why: 'The troll is piled up from boulders — the way an interface is built from components.',
      bio: 'Once he was a whole mountain, but he was taken apart into blocks to build the gate. Every morning he puts himself together again and gets furious if one boulder lands in the wrong place.',
    },
  },
  'js-basics': {
    intro:
      'JavaScript potions boil in the flasks. Without them props cannot be unpacked: destructuring, spread and treacherous references.',
    outro: 'The potions are poured into vials. Next door, in the grotto of spells, the strongest magic is kept — functions.',
    guardian: {
      name: 'Wart',
      kind: 'toad alchemist',
      threat: 'Croooak… Mix up the flasks and undefined will poison you!',
      defeat: 'The toad hides in the cauldron, muttering something about spread and rest.',
      why: 'The toad sorts poisons into flasks — the way destructuring sorts an object into variables.',
      bio: 'She has brewed potions for three hundred years and never once washed the cauldron: it tastes better that way, she says. Once she drank undefined instead of an elixir and has croaked with pauses ever since.',
    },
  },
  functions: {
    intro:
      'The scrolls on the walls stir by themselves. Here they teach the main spell of JavaScript — the function: it can be stored, handed over and cast later.',
    outro: 'The spells are learned. Wings and legs rustle under the vaults — the Cave of Swarms lies ahead.',
    guardian: {
      name: 'Mortis',
      kind: 'lich sorcerer',
      threat: 'Cast a spell with parentheses too early — and it will burn you on the spot!',
      defeat: 'The lich falls apart into bones, but his spells stay with you — the way a closure remembers its variables.',
      why: 'The lich stores spells for later and casts them when needed — the way a function is passed along and called later.',
      bio: 'He died of his own spell, cast with brackets too early. Since then he keeps his spells in scrolls and calls them only when he is quite sure he is ready.',
    },
  },
  arrays: {
    intro:
      'Endless swarms crawl over the walls. To get through, you must count them, pick them and line them up — without a single mutation.',
    outro: 'The swarms are counted and lined up. In the next grotto a postman is already digging about.',
    guardian: {
      name: 'Hundred',
      kind: 'centipede',
      threat: 'Count my legs without reduce? You cannot! And break even one of them — I will eat you.',
      defeat: 'The centipede curls into a ring — the way reduce folds an array into a single value.',
      why: 'A centipede is like an array: many identical segments in order, and map walks over every one.',
      bio: 'Every morning she counts her hundred legs and every time gets ninety-nine. The hundredth leg, they say, walked off on its own — tired of being last in the array.',
    },
  },
  passing: {
    intro:
      'Underground passages lead from parents to children, and parcels are carried along them. Every parcel is a props object. Learn how to pack it and unpack it.',
    outro: 'The parcels are delivered. Tier I is behind you, and ahead an underground waterfall roars.',
    guardian: {
      name: 'Delver',
      kind: 'mole postman',
      threat: 'I take no parcel without an address! Quotes or braces — decide fast, before I bury you.',
      defeat: 'The mole crawls back into his burrow: every parcel is delivered.',
      why: 'The mole digs passages from parent to child and carries parcels along them — like props.',
      bio: 'Blind from birth, he reads the addresses on parcels with his nose. He has never lost a parcel — though he delivered two to the wrong parent, who is still offended.',
    },
  },
  flow: {
    intro: 'Water falls only downwards — like data in React. Nobody swims against the current, and nobody touches someone else’s props.',
    outro: 'The law of the waterfall is clear. Next comes a cave whose walls remember every guest.',
    guardian: {
      name: 'Riptide',
      kind: 'cave eel',
      threat: 'Try to swim against the current — and I will swallow you!',
      defeat: 'The eel sinks into the deep, and the current stays one-way.',
      why: 'The eel swims only down the waterfall — the way data in React flows from parent to children.',
      bio: 'Once she tried to swim up the waterfall and was going for a record until she met a rock. Now she lectures on the harm of swimming against the current — with a bruise on her forehead.',
    },
  },
  state: {
    intro:
      'The walls of this cave are covered with cobwebs: every thread remembers something. This is state. How does memory differ from a parcel, and when is the cave “redrawn”?',
    outro: 'The threads of memory are untangled. Ahead a mirror glimmers — a strange thing for a vampire’s den…',
    guardian: {
      name: 'Snare',
      kind: 'spider',
      threat: 'I remember everything that ever fell into my web. Can you recall what was there before the redraw?',
      defeat: 'The spider lets you go and leaves you one thread to remember her by — useState.',
      why: 'The spider remembers every thread of her web — the way state remembers values between renders.',
      bio: 'She remembers everyone who ever got caught in her web, by name and by taste. She forgets only what happened before the re-render — and is deeply ashamed of it.',
    },
  },
  vdom: {
    intro:
      'A vampire has no reflection in mirrors, but a React page does: a light copy of it lives in memory. Here you will learn how React compares the reflection with the original.',
    outro: 'Now you can see what happens on every redraw. A scream comes from the depths — someone is calling for a parent.',
    guardian: {
      name: 'Doppel',
      kind: 'shadow double',
      threat: 'I am your reflection. Find a single difference between us — and I will let you go.',
      defeat: 'The double dissolves: you found every difference, just as reconciliation does.',
      why: 'The double is a copy without flesh — the way the virtual DOM is a light copy of the page in memory.',
      bio: 'He escaped from a mirror while its owner looked away and has copied everyone’s every move ever since — only lighter. He has never seen his real self: he has no reflection.',
    },
  },
  callbacks: {
    intro:
      'Shout — and the echo will reach the one who waits above. That is how children tell parents about events: through functions in props.',
    outro: 'The scream has died away, the state is lifted. Further on, gems sparkle in the dark.',
    guardian: {
      name: 'Echo',
      kind: 'banshee',
      threat: 'My scream will reach the parent faster than you! And you do not even know how to call it.',
      defeat: 'The scream dies away: the event has reached the parent.',
      why: 'The banshee’s scream flies upwards as an echo — the way a child calls its parent’s callback.',
      bio: 'She screams so that parents hear her three tiers up. At night she practises her voice on the bats — Lunatik has gone deaf twice already.',
    },
  },
  children: {
    intro:
      'A plain stone, yet crystals inside. A frame component is the same: a setting on the outside, and inside — the children the parent puts there.',
    outro: 'The settings are ready. In the next cave hundreds of keys hang on the walls.',
    guardian: {
      name: 'Stinger',
      kind: 'scorpion jeweller',
      threat: 'What lies in my shell is decided not by me but by whoever filled it. Reach in without asking — and I sting.',
      defeat: 'The scorpion lowers its sting and opens the shell full of gems.',
      why: 'The scorpion hides gems in its shell like in a casket — the way a frame component holds children.',
      bio: 'A jeweller with golden claws: he makes settings, and what goes into them is the customer’s choice. Once he was brought an eye to set — he set it without asking questions.',
    },
  },
  special: {
    intro: 'Every list item gets its own key, every field its own bookmark — a ref. Mix up the keys and the wrong doors will open.',
    outro: 'The keys are sorted. Tier II is done, and a secret passage shows in the wall…',
    guardian: {
      name: 'Keykeeper',
      kind: 'rat king',
      threat: 'Mix up the keys — and my rats will mix up your whole list!',
      defeat: 'The rats scatter, each one carrying its own key.',
      why: 'Every rat of the king has its own key on its tail — that is how React tells list items apart by key.',
      bio: 'King of a thousand rats, each with its own key on its tail. If two rats get the same key, he eats one of them — that is why his list is never mixed up.',
    },
  },
  context: {
    intro:
      'Dragging a parcel through five caves is tiring. Here they know a secret passage — Context: a value arrives straight where it is needed.',
    outro: 'The passage is behind you. Below, water drips steadily — the clock of the depths.',
    guardian: {
      name: 'Borer',
      kind: 'giant worm',
      threat: 'Why carry a parcel through five caves? I will gnaw a way straight through — and through you as well.',
      defeat: 'The worm crawls away and leaves the secret passage open.',
      why: 'The worm gnaws a passage through every level — the way Context delivers a value past the middlemen.',
      bio: 'He gnawed straight through the mountain because he was too lazy to go round it. He carries parcels right into the cave that needs them — sometimes together with the postman he swallowed on the way.',
    },
  },
  hooks: {
    intro:
      'Drops fall with the rhythm of a clock. Hooks live here: memory, effects, refs. Their order is strict — break it, and time goes out of step.',
    outro: 'The clock runs evenly. Further on an underground river roars — it brings data from far away.',
    guardian: {
      name: 'Hookclaw',
      kind: 'mantis',
      threat: 'My hooks grab only from the top and always in order. Break the order — and I grab you!',
      defeat: 'The mantis folds its legs: the order of hooks is kept.',
      why: 'The hooked legs of the mantis are hooks: they attach memory and effects to a component.',
      bio: 'She prays before every hunt — that is why she is called a praying mantis. She hooks her prey strictly in order: first the memory, then the effect, then you.',
    },
  },
  async: {
    intro:
      'Parcels from the outside world float down the black river — some day. Here you learn to wait for an answer, to catch errors and not to confuse old answers with new ones.',
    outro: 'The river is tamed: data arrives, errors are caught. Further on a draught whistles — the Cave of Speed.',
    guardian: {
      name: 'Fathom',
      kind: 'kraken',
      threat: 'My tentacles will bring an answer… some day. Or they will not! Can you guess when?',
      defeat: 'The kraken loosens its tentacles: the answer has come, the errors are caught.',
      why: 'The kraken’s tentacles reach far away and come back with their catch later — like a Promise.',
      bio: 'He promised to be back with an answer by supper — three hundred years ago. Supper has long gone cold, but the promise is still neither fulfilled nor rejected.',
    },
  },
  performance: {
    intro: 'A draught drives the bats at a furious speed. Here you learn not to do extra work: memo, stable references and React Compiler.',
    outro: 'The extra renders are caught. Ahead is a grotto where crystals grow in strict shapes.',
    guardian: {
      name: 'Gale',
      kind: 'werewolf',
      threat: 'I run faster than your redraws. Make a single extra render — and I catch you!',
      defeat: 'The werewolf is panting: you turned out to be faster.',
      why: 'The werewolf is the fastest of all and wastes no strength — the way memo skips extra renders.',
      bio: 'At full moon he runs so fast that he overtakes his own shadow and every re-render. He makes no needless moves: every extra step, he says, is an extra render.',
    },
  },
  types: {
    intro:
      'Every crystal grows in an exact shape — like props that follow a type. Here TypeScript and JSDoc guard the contract between parent and child.',
    outro: 'The contracts are signed. One last cave remains — the workshop where forms and patterns are forged.',
    guardian: {
      name: 'Facet',
      kind: 'crystal golem',
      threat: 'Wrong shape — no passage! My facets are more exact than any TypeScript.',
      defeat: 'The golem freezes: the contract of types is kept.',
      why: 'The golem grows along exact facets — the way props follow the type described for them.',
      bio: 'He has grown to his blueprints for a thousand years and never once stepped outside his edges. Once a moss of an undeclared type stuck to him — the golem refused to speak to it for three centuries.',
    },
  },
  patterns: {
    intro:
      'Anvils, moulds, tools. Here everything is put together: input fields, conditional rendering, HOCs and real projects — the “Smart Fridge” and Kosmo.',
    outro: 'Every cave is behind you. The Count is waiting in his lair for the final trial.',
    guardian: {
      name: 'Anvil',
      kind: 'minotaur smith',
      threat: 'In my labyrinth only those who know the patterns survive!',
      defeat: 'The minotaur bows his horns: you have mastered every pattern.',
      why: 'In his labyrinth workshop the minotaur forges forms and patterns — tools for every occasion.',
      bio: 'He forged his own labyrinth and then got lost in it — since then he draws patterns on the walls. His favourite pattern is “the guest who never came out”.',
    },
  },
};
