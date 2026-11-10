// Плагин Vite: после сборки пишет dist/sw.js — сервис-воркер для офлайна.
// Он получает список ВСЕХ файлов сборки (с хэшами в именах) и кладёт их
// в кэш при установке. Новая сборка = новые имена = новая версия кэша.
// Шрифты для редких алфавитов (греческий, вьетнамский) не кэшируем заранее:
// браузер скачает их, только если понадобятся.
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

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // Страница: сначала сеть (свежая версия), без сети — из кэша
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('./', { ignoreVary: true })));
    return;
  }

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
