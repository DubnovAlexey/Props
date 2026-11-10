// Весь прогресс ученика и чистая функция-редьюсер для его изменения.
// Редьюсер получает старое состояние и действие и возвращает НОВОЕ
// состояние, не меняя старое (неизменяемость — та же идея, что у пропсов).
import { schedule } from '../utils/leitner.js';
import { daysBetween } from '../utils/dates.js';

export const XP = {
  correct: 10, // верно с первой попытки
  correctWithHint: 6, // верно, но с подсказкой
  attempt: 2, // ошибся, но попробовал — смелость тоже награждаем
  step: 5, // пройден этап главы (разминка, урок, заклинание…)
  chapter: 30, // глава завершена
  explain: 15, // объяснил Лунатику своими словами
};

export const initialProgress = {
  version: 1,
  xp: 0,
  chapters: {}, // { [id]: { warmup, lesson, spell, explain, break, practiceBest, done } }
  items: {}, // расписание Лейтнера: { 'task:passing-3': {...}, 'term:props': {...} }
  stats: { answered: 0, correct: 0 },
  streak: { count: 0, lastDay: null },
  journal: {}, // объяснения Лунатику: { [chapterId]: 'текст' }
  exam: { best: null, attempts: 0 },
  breakBest: 0,
  theme: 'night',
  sound: true,
};

/** Восстанавливаем сохранённый прогресс, подставляя недостающие поля */
export function restore(saved) {
  if (!saved || saved.version !== initialProgress.version) return initialProgress;
  return {
    ...initialProgress,
    ...saved,
    stats: { ...initialProgress.stats, ...saved.stats },
    streak: { ...initialProgress.streak, ...saved.streak },
    exam: { ...initialProgress.exam, ...saved.exam },
  };
}

function withChapter(state, chapterId, patch) {
  const previous = state.chapters[chapterId] ?? {};
  return { ...state.chapters, [chapterId]: { ...previous, ...patch } };
}

export function progressReducer(state, action) {
  switch (action.type) {
    case 'visit': {
      // Серия дней подряд: вчера был — серия растёт, пропустил — начинается заново
      const { lastDay, count } = state.streak;
      if (lastDay === action.today) return state;
      const gap = lastDay ? daysBetween(lastDay, action.today) : null;
      return { ...state, streak: { count: gap === 1 ? count + 1 : 1, lastDay: action.today } };
    }

    case 'answer': {
      const { itemId, correct, xp = 0, now = Date.now() } = action;
      return {
        ...state,
        xp: state.xp + xp,
        items: { ...state.items, [itemId]: schedule(state.items[itemId], correct, now) },
        stats: {
          answered: state.stats.answered + 1,
          correct: state.stats.correct + (correct ? 1 : 0),
        },
      };
    }

    case 'card': {
      // Карточка термина: «вспомнил» / «не вспомнил» — только расписание, без статистики
      const { itemId, remembered, now = Date.now() } = action;
      return {
        ...state,
        xp: state.xp + (remembered ? 3 : 1),
        items: { ...state.items, [itemId]: schedule(state.items[itemId], remembered, now) },
      };
    }

    case 'step': {
      // Этап главы засчитывается один раз — повторное прохождение опыт не даёт
      const { chapterId, step, xp = XP.step } = action;
      if (state.chapters[chapterId]?.[step]) return state;
      return { ...state, xp: state.xp + xp, chapters: withChapter(state, chapterId, { [step]: true }) };
    }

    case 'practice': {
      const { chapterId, score } = action;
      const previous = state.chapters[chapterId] ?? {};
      const firstTime = !previous.done;
      return {
        ...state,
        xp: state.xp + (firstTime ? XP.chapter : 0),
        chapters: withChapter(state, chapterId, {
          done: true,
          practiceBest: Math.max(previous.practiceBest ?? 0, score),
        }),
      };
    }

    case 'journal':
      return { ...state, journal: { ...state.journal, [action.chapterId]: action.text } };

    case 'exam': {
      const best = state.exam.best === null ? action.score : Math.max(state.exam.best, action.score);
      return { ...state, exam: { best, attempts: state.exam.attempts + 1 } };
    }

    case 'break':
      return { ...state, breakBest: Math.max(state.breakBest, action.score) };

    case 'theme':
      return { ...state, theme: action.theme };

    case 'sound':
      return { ...state, sound: action.sound };

    case 'reset':
      return { ...initialProgress, theme: state.theme, sound: state.sound };

    default:
      return state;
  }
}
