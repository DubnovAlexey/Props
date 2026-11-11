// Загрузка языка: словаря интерфейса и уроков.
// Русский словарь вшит в основной код: он нужен всегда — и как язык по умолчанию, и как
// запасной (если в другом языке забыли строку). Остальные словари лежат отдельными
// кусками кода и подгружаются, только когда язык выбран: import.meta.glob — способ сборщика
// Vite сказать «возьми все файлы по шаблону и грузи каждый по требованию».
import { pickLanguage } from './languages.js';
import { frenchSpaces, mapStrings } from './typography.js';
import { loadContent } from '../content/index.js';
import ru from './ui/ru.js';

const loaders = import.meta.glob(['./ui/*.js', '!./ui/ru.js']);

/** Запасной словарь — русский */
export const FALLBACK = ru;

/**
 * Загружает словарь языка. Если загрузить не вышло (нет сети и файла нет в офлайн-копии) —
 * отдаёт русский: игра остаётся рабочей, просто на русском.
 */
export async function loadDictionary(lang) {
  if (lang === 'ru') return ru;
  const load = loaders[`./ui/${lang}.js`];
  if (!load) return ru;
  try {
    const dictionary = (await load()).default;
    // во французском пробел перед «:», «;», «!», «?» и в кавычках должен быть неразрывным
    return lang === 'fr' ? mapStrings(dictionary, frenchSpaces) : dictionary;
  } catch {
    return ru;
  }
}

/**
 * Всё, что нужно для языка: словарь интерфейса и уроки (content — см. src/content/index.js).
 * Грузим оба сразу и ждём оба: так страница не окажется наполовину на одном языке, наполовину на другом.
 */
export async function loadLanguage(lang) {
  const [dictionary, content] = await Promise.all([loadDictionary(lang), loadContent(lang)]);
  return { lang, dictionary, content };
}

/**
 * Готовит язык к запуску игры: выбирает его и загружает словарь и уроки ДО первой отрисовки,
 * чтобы страница не мигнула русским текстом перед тем, как переключиться.
 * @param {string|null|undefined} saved — язык, сохранённый вместе с прогрессом
 * @param {readonly string[]} [browserLanguages] — языки браузера
 */
export function bootstrapLanguage(saved, browserLanguages) {
  return loadLanguage(pickLanguage(saved, browserLanguages));
}
