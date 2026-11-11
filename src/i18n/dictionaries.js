// Загрузка словарей интерфейса.
// Русский словарь вшит в основной код: он нужен всегда — и как язык по умолчанию, и как
// запасной (если в другом языке забыли строку). Остальные словари лежат отдельными
// кусками кода и подгружаются, только когда язык выбран: import.meta.glob — способ сборщика
// Vite сказать «возьми все файлы по шаблону и грузи каждый по требованию».
import { pickLanguage } from './languages.js';
import { frenchSpaces, mapStrings } from './typography.js';
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
 * Готовит язык к запуску игры: выбирает его и загружает словарь ДО первой отрисовки,
 * чтобы страница не мигнула русским текстом перед тем, как переключиться.
 * @param {string|null|undefined} saved — язык, сохранённый вместе с прогрессом
 * @param {readonly string[]} [browserLanguages] — языки браузера
 */
export async function bootstrapLanguage(saved, browserLanguages) {
  const lang = pickLanguage(saved, browserLanguages);
  return { lang, dictionary: await loadDictionary(lang) };
}
