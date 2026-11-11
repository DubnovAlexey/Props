// Языки игры и выбор языка при запуске. Чистые функции, без браузера — их проверяют тесты.
//
//   code  — код языка (он же имя файла словаря в ./ui/);
//   name  — как язык называет себя сам: так он записан в переключателе;
//   dir   — направление письма: 'ltr' — слева направо, 'rtl' — справа налево (иврит);
//   ready — переведены ли уже уроки. Пока переведён только интерфейс (кнопки, меню, реплики
//           Графа), язык сам не включается: его можно выбрать вручную в переключателе.
//           Перевёл уроки — поставь ready: true, и язык начнёт подхватываться из настроек браузера.
export const LANGUAGES = [
  { code: 'ru', name: 'Русский', dir: 'ltr', ready: true },
  { code: 'en', name: 'English', dir: 'ltr', ready: true }, // уроки и свитки переведены 11.11.2026
  { code: 'he', name: 'עברית', dir: 'rtl', ready: false },
  { code: 'es', name: 'Español', dir: 'ltr', ready: false },
  { code: 'fr', name: 'Français', dir: 'ltr', ready: false },
];

/** Язык по умолчанию и запасной: его словарь всегда под рукой */
export const DEFAULT_LANGUAGE = 'ru';

/** Описание языка по коду или null, если такого языка в игре нет */
export function languageByCode(code) {
  return LANGUAGES.find((language) => language.code === code) ?? null;
}

/**
 * Какой язык включить при запуске.
 * 1. Тот, что игрок выбрал сам (он сохранён вместе с прогрессом).
 * 2. Иначе — первый из языков браузера, на который уже переведены уроки (ready).
 * 3. Иначе — русский.
 * @param {string|null|undefined} saved — сохранённый выбор игрока
 * @param {readonly string[]} [browserLanguages] — языки браузера, например ['he-IL', 'en-US']
 */
export function pickLanguage(saved, browserLanguages = []) {
  if (languageByCode(saved)) return saved;
  for (const tag of browserLanguages) {
    // 'en-US' → 'en'; старый код иврита 'iw' → 'he'
    const code = String(tag).toLowerCase().split('-')[0].replace(/^iw$/, 'he');
    if (languageByCode(code)?.ready) return code;
  }
  return DEFAULT_LANGUAGE;
}
