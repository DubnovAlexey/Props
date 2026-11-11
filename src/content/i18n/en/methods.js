// Английский перевод страницы «Методика» (оригинал — src/content/methods.js).
// what — что это, inGame — где в игре, tip — как применять самому. Ключи — id приёмов.
export const METHODS = {
  retrieval: {
    name: 'Active recall',
    what: 'Trying to pull knowledge out of memory strengthens it more than rereading (the testing effect).',
    inGame: 'After every lesson comes a practice of 8 tasks, not a second reading.',
    tip: 'Close your notes and try to reproduce the main points from memory, then check yourself.',
  },
  spaced: {
    name: 'Spaced repetition',
    what: 'It is best to repeat at growing intervals, on the edge of forgetting (the Ebbinghaus forgetting curve).',
    inGame: 'The Crypt of Repetition: five Leitner “coffins” — every day, every other day, after 3 days, a week, 16 days.',
    tip: 'Come back to a topic tomorrow, then in 3 days and in a week — 10 minutes is enough.',
  },
  interleaving: {
    name: 'Interleaving',
    what: 'Tasks on different topics mixed together teach you to tell topics apart and choose an approach, not to solve “by the chapter’s template”.',
    inGame: 'Working on mistakes and the Count’s Trial take tasks from different caves, mixed together.',
    tip: 'When you solve tasks, mix the topics: props, state and context in one go.',
  },
  pretest: {
    name: 'A warm-up before the lesson',
    what: 'Trying to answer before the explanation kindles curiosity, and the lesson sticks better even if the guess is wrong.',
    inGame: 'Every cave starts with a guessing question.',
    tip: 'Before reading a chapter, ask yourself the question it answers and try to guess.',
  },
  feedback: {
    name: 'Immediate feedback',
    what: 'An explanation right after the answer corrects a mistake before it takes root.',
    inGame: 'After every task comes a breakdown: why it is right and why the chosen option is wrong.',
    tip: 'Check yourself at once and go over not only the mistakes but the lucky guesses too.',
  },
  chunking: {
    name: 'Chunking',
    what: 'Working memory holds about 4 new items. Large material is better given in portions.',
    inGame: 'A lesson is split into cards with one idea each, and a cave into short steps.',
    tip: 'Split a topic into parts of 3–5 ideas and do not move on until you understand the current one.',
  },
  dual: {
    name: 'Dual coding',
    what: 'A word plus a picture is remembered better than a word alone: memory gets two “hooks”.',
    inGame: 'Diagrams and animations: a prop parcel travels down, a callback bell rings up.',
    tip: 'Draw a diagram of components and prop arrows for every project of your own.',
  },
  loci: {
    name: 'The memory palace',
    what: 'The brain remembers places very well. Knowledge tied to a place is easier to recall (the method of loci).',
    inGame: 'Every topic lives in its own cave with its own colour and icon.',
    tip: 'When recalling a topic, “walk into” its cave in your mind: the Cave of Echoes means callbacks, the Gem Grotto means children.',
  },
  isolation: {
    name: 'The isolation effect',
    what: 'What stands out against the rest is remembered better (the von Restorff effect).',
    inGame: 'Key points are highlighted in gold, and the Count flies up to them and points with his hand.',
    tip: 'In your notes highlight only 1–2 main ideas per page, not everything in a row.',
  },
  mnemonics: {
    name: 'Mnemonics and rhymes',
    what: 'Rhythm and rhyme make a rule “sticky”, and what is said aloud is remembered better than what is read silently.',
    inGame: 'Every cave has a rhymed spell and a “Read aloud” button.',
    tip: 'Make up your own rhyme for a rule you keep forgetting.',
  },
  generation: {
    name: 'The generation effect',
    what: 'What you assembled or wrote yourself is remembered better than what you only saw.',
    inGame: 'The “Assemble the code” and “Type the answer” tasks.',
    tip: 'Retype examples by hand instead of copying them, and change them to fit your own task.',
  },
  protege: {
    name: 'Explain it to someone',
    what: 'Explaining in your own words, you find the gaps in your understanding yourself (self-explanation and the protégé effect).',
    inGame: 'The “Explain it to Lunatik” step in every cave; your explanations are saved to a journal.',
    tip: 'Tell the topic to a friend, a cat or a rubber duck — out loud.',
  },
  zeigarnik: {
    name: 'The Zeigarnik effect',
    what: 'The unfinished is remembered and “pulls” harder than the finished.',
    inGame: 'Progress bars, the “N tasks left” counter, the progress rings of the caves.',
    tip: 'End a session at an interesting spot — it will be easier to start tomorrow.',
  },
  emotion: {
    name: 'Emotions and humour',
    what: 'What is emotionally coloured is remembered better than what is neutral.',
    inGame: 'The scary but kind Count Propsula, his jokes and the bats.',
    tip: 'Tie dry rules to funny images — the more absurd, the better.',
  },
  breaks: {
    name: 'Breaks for the brain',
    what: 'A short change of activity relieves tired attention and helps knowledge settle.',
    inGame: 'The “Catch the bats” mini-game after every cave and in the “Break” section.',
    tip: 'Every 25 minutes take a 5-minute break without your phone: stand up, walk around, look into the distance.',
  },
  motivation: {
    name: 'Visible progress',
    what: 'Experience, ranks and a streak of days turn study into a path where you can see how far you have come.',
    inGame: 'Experience for answers and even for attempts, ranks from “Fledgling bat” to “Count of Props”, a streak of days.',
    tip: 'Mark every study day in a calendar and do not break the chain.',
  },
};

export const STUDY_PLAN = [
  'Warm-up: guess the answer before the lesson (1 minute).',
  'The lesson, card by card: read, look at the diagrams, linger on the golden “key points” (7–10 minutes).',
  'The spell: say the rhyme aloud three times (1 minute).',
  'Practice: 8 tasks with a breakdown of every answer (7–10 minutes).',
  'Explain it to Lunatik in your own words (2–3 minutes).',
  'Break: “Catch the bats” or 5 minutes of rest.',
  'Tomorrow: look into the Crypt of Repetition for 10 minutes.',
];
