// Корень приложения: провайдеры, шапка, страница по адресу и Граф.
// Обрати внимание на <ChapterPage key={param} />: при переходе в другую
// пещеру меняется key, и React создаёт страницу заново со свежим
// состоянием — тот самый приём «сброс через key» из пещеры 8 («Пещера памяти»).
import { lazy, Suspense, useLayoutEffect } from 'react';
import { useHashRoute } from './app/useHashRoute.js';
import { ProgressProvider } from './state/ProgressContext.jsx';
import { MascotProvider } from './mascot/MascotContext.jsx';
import MascotDock from './mascot/MascotDock.jsx';
import Header from './components/Layout/Header.jsx';
import TabBar from './components/Layout/TabBar.jsx';
import CaveMap from './features/home/CaveMap.jsx';
import ChapterPage from './features/chapter/ChapterPage.jsx';
import ReviewPage from './features/review/ReviewPage.jsx';
import ExamPage from './features/exam/ExamPage.jsx';
import GlossaryPage from './features/glossary/GlossaryPage.jsx';
import MethodsPage from './features/methods/MethodsPage.jsx';
import BreakPage from './features/break/BreakPage.jsx';
import BestiaryPage from './features/bestiary/BestiaryPage.jsx';
import InstallPage from './features/install/InstallPage.jsx';
import CoursePage from './features/course/CoursePage.jsx';
import LearnPage from './features/learn/LearnPage.jsx';
import GuardianDefs from './mascot/guardians/GuardianDefs.jsx';
import Ambience from './components/Ambience/Ambience.jsx';
import Scares from './components/Scares/Scares.jsx';
import NotFound from './app/NotFound.jsx';
import ErrorBoundary from './app/ErrorBoundary.jsx';
import { I18nProvider, useI18n } from './i18n/I18nContext.jsx';
import { scrollToTop } from './utils/scroll.js';

// Свитки (теория) грузятся только когда нужны: это отдельный кусок кода
const LibraryPage = lazy(() => import('./features/library/LibraryPage.jsx'));

// «Мастерская художника» (#gallery) — служебная страница со всей графикой игры.
// import.meta.env.DEV при сборке превращается в false, и сборщик выбрасывает
// эту ветку целиком: в игру для игроков страница не попадает.
const GalleryPage = import.meta.env.DEV ? lazy(() => import('./features/gallery/GalleryPage.jsx')) : null;

/** Какую страницу показать для адреса */
function Page({ route }) {
  const { t } = useI18n();
  const [section, param] = route.parts;
  switch (section) {
    case undefined:
      return <CaveMap />;
    case 'chapter':
      return <ChapterPage key={param} chapterId={param} />;
    case 'review':
      return <ReviewPage />;
    case 'exam':
      return <ExamPage />;
    case 'course':
      return <CoursePage focus={Number(route.query.question) || null} />;
    case 'learn':
      return <LearnPage />;
    case 'glossary':
      return <GlossaryPage focusId={route.query.term} />;
    case 'methods':
      return <MethodsPage />;
    case 'break':
      return <BreakPage />;
    case 'bestiary':
      return <BestiaryPage />;
    case 'install':
      return <InstallPage />;
    case 'library':
      return (
        <Suspense fallback={<p className="muted">{t('loading.library')}</p>}>
          <LibraryPage key={param ?? 'index'} topic={param} />
        </Suspense>
      );
    case 'gallery':
      return GalleryPage ? (
        <Suspense fallback={<p className="muted">🎨 Развешиваем картины…</p>}>
          <GalleryPage />
        </Suspense>
      ) : (
        <NotFound />
      );
    default:
      return <NotFound />;
  }
}

/** Раздел меню, который подсвечивать */
function sectionOf(route) {
  const [section] = route.parts;
  if (!section || section === 'chapter' || section === 'exam' || section === 'course' || section === 'learn') return 'map';
  return section;
}

// i18n — язык и словарь, подготовленные в main.jsx до отрисовки
export default function App({ i18n }) {
  const route = useHashRoute();

  // Новый раздел — начинаем сверху страницы (кроме перехода к термину словаря).
  // Прокручиваем сразу, без плавной анимации, и до показа страницы — см. src/utils/scroll.js
  useLayoutEffect(() => {
    if (!route.query.term && !route.query.question) scrollToTop();
  }, [route.path, route.query.term, route.query.question]);

  const section = sectionOf(route);

  return (
    <ProgressProvider>
      <I18nProvider initial={i18n}>
        <MascotProvider>
          <GuardianDefs />
          <Ambience />
          <Header section={section} />
          <main className="page" id="main">
            {/* Ошибка на одной странице не должна гасить всю игру: шапка и меню остаются */}
            <ErrorBoundary resetKey={route.path}>
              <Page route={route} />
            </ErrorBoundary>
          </main>
          <TabBar section={section} />
          <MascotDock routeKey={route.path} />
          {/* «Неожиданности»: в пещере из темноты выглядывает её хозяин — поэтому передаём id пещеры */}
          {/* В Скриптории Графа из темноты выглядывает его хозяин — архивариус Формуляр (ключ портрета course) */}
          <Scares caveId={route.parts[0] === 'chapter' ? route.parts[1] : route.parts[0] === 'course' ? 'course' : null} />
        </MascotProvider>
      </I18nProvider>
    </ProgressProvider>
  );
}
