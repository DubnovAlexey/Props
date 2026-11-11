// Английский перевод учебного содержимого — «накладка» на русский оригинал.
// Как она накладывается и что в ней может быть — см. buildContent в src/content/index.js.
// Чего здесь нет, то в игре остаётся на русском; что уже переведено — видно по этому файлу.
import { CHAPTER_STORY, EPILOGUE, FINALE, PROLOGUE, TIERS } from './story.js';
import { CHAPTERS } from './chapters/index.js';
import { FACTS } from './facts.js';
import { METHODS, STUDY_PLAN } from './methods.js';
import { BREAK_ROUNDS } from './breakRounds.js';
import { GLOSSARY } from './glossary.js';
import { SYNTAX_GUIDE } from './syntaxGuide.js';
import { DIAGRAM_TEXT } from './diagrams.js';

export default {
  tiers: TIERS,
  finale: FINALE,
  prologue: PROLOGUE,
  epilogue: EPILOGUE,
  story: CHAPTER_STORY,
  chapters: CHAPTERS,
  facts: FACTS,
  methods: METHODS,
  studyPlan: STUDY_PLAN,
  breakRounds: BREAK_ROUNDS,
  glossary: GLOSSARY,
  syntaxGuide: SYNTAX_GUIDE,
  diagrams: DIAGRAM_TEXT,
};
