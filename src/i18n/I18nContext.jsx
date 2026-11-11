// Контекст языка: любой компонент может узнать текущий язык и перевести строку.
//   const { t } = useI18n();
//   <h2>{t('map.mapTitle')}</h2>
// Это ещё один пример темы «Context» из пещеры «Тайный ход»: язык нужен почти каждому
// компоненту, и передавать его пропсами через всё дерево было бы мучением.
//
//   lang      — код текущего языка ('ru', 'en', 'he', 'es', 'fr');
//   dir       — направление письма: 'ltr' или 'rtl' (иврит);
//   t         — функция перевода: t('адрес.строки', { подстановки });
//   setLang   — сменить язык (словарь подгружается, выбор сохраняется вместе с прогрессом);
//   languages — список всех языков для переключателя.
import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
import { useProgress } from '../state/ProgressContext.jsx';
import { DEFAULT_LANGUAGE, LANGUAGES, languageByCode } from './languages.js';
import { FALLBACK, loadDictionary } from './dictionaries.js';
import { createTranslator } from './translate.js';

const I18nContext = createContext(null);

/** initial — язык и словарь, подготовленные до отрисовки (см. main.jsx) */
export function I18nProvider({ initial, children }) {
  const { dispatch } = useProgress();
  const [state, setState] = useState(initial ?? { lang: DEFAULT_LANGUAGE, dictionary: FALLBACK });

  const setLang = useCallback(
    (code) => {
      if (!languageByCode(code)) return;
      // сначала загружаем словарь и только потом переключаемся — без «пустого» мгновения
      loadDictionary(code).then((dictionary) => {
        setState({ lang: code, dictionary });
        dispatch({ type: 'lang', lang: code });
      });
    },
    [dispatch],
  );

  // useMemo: новая функция t — только когда сменился язык. Иначе каждый эффект,
  // у которого t в зависимостях, срабатывал бы при любой перерисовке.
  const t = useMemo(() => createTranslator(state.lang, state.dictionary, FALLBACK), [state]);
  const dir = languageByCode(state.lang)?.dir ?? 'ltr';

  // Сообщаем браузеру язык и направление письма страницы; переводим заголовок вкладки
  useEffect(() => {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = dir;
    document.title = t('meta.title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  }, [state.lang, dir, t]);

  const value = useMemo(() => ({ lang: state.lang, dir, t, setLang, languages: LANGUAGES }), [state.lang, dir, t, setLang]);

  return <I18nContext value={value}>{children}</I18nContext>;
}

/** Хук доступа к языку и переводу */
export function useI18n() {
  const context = use(I18nContext);
  if (!context) throw new Error('useI18n нужно вызывать внутри <I18nProvider>');
  return context;
}
