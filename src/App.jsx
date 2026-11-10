// Корень приложения: провайдеры, шапка, страница по адресу и Граф.
// Обрати внимание на <ChapterPage key={param} />: при переходе в другую
// пещеру меняется key, и React создаёт страницу заново со свежим
// состоянием — тот самый приём «сброс через key» из пещеры 8 («Пещера памяти»).
import { lazy, Suspense, useEffect } from 'react';
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
import GuardianDefs from './mascot/guardians/GuardianDefs.jsx';
import Ambience from './components/Ambience/Ambience.jsx';
import Scares from './components/Scares/Scares.jsx';
import NotFound from './app/NotFound.jsx';
import ErrorBoundary from './app/ErrorBoundary.jsx';

// Свитки (теория) грузятся только когда нужны: это отдельный кусок кода
const LibraryPage = lazy(() => import('./features/library/LibraryPage.jsx'));

// «Мастерская художника» (#gallery) — служебная страница со всей графикой игры.
// import.meta.env.DEV при сборке превращается в false, и сборщик выбрасывает
// эту ветку целиком: в игру для игроков страница не попадает.
const GalleryPage = import.meta.env.DEV ? lazy(() => import('./features/gallery/GalleryPage.jsx')) : null;

/** Какую страницу показать для адреса */
function Page({ route }) {
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
        <Suspense fallback={<p className="muted">🕯️ Граф достаёт свитки…</p>}>
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
  if (!section || section === 'chapter' || section === 'exam') return 'map';
  return section;
}

export default function App() {
  const route = useHashRoute();

  // Новый раздел — начинаем сверху страницы (кроме перехода к термину словаря)
  useEffect(() => {
    if (!route.query.term) window.scrollTo(0, 0);
  }, [route.path, route.query.term]);

  const section = sectionOf(route);

  return (
    <ProgressProvider>
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
        <Scares caveId={route.parts[0] === 'chapter' ? route.parts[1] : null} />
      </MascotProvider>
    </ProgressProvider>
  );
}
