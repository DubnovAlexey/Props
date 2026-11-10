// Плагин Vite: после сборки пишет dist/sw.js — сервис-воркер для офлайна.
// Он получает список ВСЕХ файлов сборки (с хэшами в именах) и кладёт их
// в кэш при установке. Новая сборка = новые имена = новая версия кэша.
// Шрифты для редких алфавитов (греческий, вьетнамский) не кэшируем заранее:
// браузер скачает их, только если понадобятся.
//
// Как это работает у игрока:
//  1. Первый заход по сети — воркер устанавливается и сохраняет игру целиком.
//  2. Дальше игра открывается и без интернета — из сохранённой копии.
//  3. Вышла новая версия — воркер скачивает её в фоне и включает при следующем
//     запуске игры. Открытую игру он не трогает: иначе у неё «из-под ног»
//     пропали бы файлы старой версии (например, ещё не открытые свитки).
const SKIP = /(greek|vietnamese|latin-ext)/;

export default function serviceWorkerPlugin() {
  return {
    name: 'props-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      const files = Object.keys(bundle).filter((name) => !name.endsWith('.map') && !SKIP.test(name));
      const precache = [
        './',
        ...files.map((name) => `./${name}`),
        './manifest.webmanifest',
        './favicon.svg',
        './icons/icon-192.png',
        './icons/icon-512.png',
      ];
      const version = Date.now().toString(36);
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: swSource(version, precache),
      });
    },
  };
}

function swSource(version, precache) {
  return `// Сервис-воркер «Пещер Графа Пропсулы» (создан сборкой, не правь вручную).
const CACHE = 'props-${version}';
const PRECACHE = ${JSON.stringify(precache, null, 2)};
const NAVIGATION_TIMEOUT = 4000; // сколько ждём сеть при открытии игры, мс

// Адрес самой игры («оболочки»): папка, где лежит sw.js, и index.html в ней
const SHELL = new URL('./', self.location).pathname;

self.addEventListener('install', (event) => {
  // cache: 'reload' — берём файлы с сервера, минуя обычный кэш браузера.
  // Иначе сразу после обновления сайта в копию могла бы попасть старая
  // страница со ссылками на файлы, которых уже нет, — и без сети игра не открылась бы.
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' })))),
  );
  // skipWaiting() нарочно не вызываем: новая версия включится при следующем запуске
});

self.addEventListener('activate', (event) => {
  // Мы — новая версия, старых вкладок уже нет: чужие кэши можно удалить
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

/** Запрос в сеть, который не ждёт дольше timeout миллисекунд */
function fetchWithTimeout(request, timeout) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), timeout);
    fetch(request).then(
      (response) => {
        clearTimeout(timer);
        resolve(response);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Открытие самой игры: сначала сеть (свежая версия). Сети нет или она «висит» —
  // показываем сохранённую страницу СВОЕЙ версии: её файлы точно лежат в нашем кэше.
  const isShell = request.mode === 'navigate' && (url.pathname === SHELL || url.pathname === SHELL + 'index.html');
  if (isShell) {
    event.respondWith(
      fetchWithTimeout(request, NAVIGATION_TIMEOUT).catch(() =>
        caches.open(CACHE).then((cache) => cache.match('./', { ignoreVary: true })),
      ),
    );
    return;
  }

  // Остальные переходы (например, скачивание файла) — обычным путём, через сеть
  if (request.mode === 'navigate') return;

  // Файлы с хэшем в имени не меняются: сначала кэш, потом сеть (и кладём в кэш).
  // ignoreVary: сервер может ответить «Vary: Origin», а скрипты-модули
  // запрашиваются с заголовком Origin — без флага кэш их бы «не узнал».
  event.respondWith(
    caches.match(request, { ignoreVary: true }).then(
      (cached) =>
        cached ??
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
`;
}
