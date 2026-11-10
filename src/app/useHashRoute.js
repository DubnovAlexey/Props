// Мини-роутер на «хэше» адреса: #chapter-flow, #review, #glossary-props.
// Почему хэш: GitHub Pages отдаёт только статические файлы, и адреса после #
// никогда не приводят к ошибке 404. Почему простые имена (без слэшей):
// так адрес проходит везде, в том числе в предпросмотре на claude.ai.
// Старый формат #/chapter/flow тоже понимаем — на всякий случай.
import { useEffect, useState } from 'react';

/** Готовые ссылки на экраны игры — не нужно помнить формат адреса */
export const to = {
  map: () => '#map',
  chapter: (id) => `#chapter-${id}`,
  review: () => '#review',
  exam: () => '#exam',
  glossary: (termId) => (termId ? `#glossary-${termId}` : '#glossary'),
  methods: () => '#methods',
  break: () => '#break',
  bestiary: () => '#bestiary',
  library: (topic) => (topic ? `#library-${topic}` : '#library'),
  install: () => '#install',
};

/** Разбирает хэш в объект { path, parts, query } */
export function parseHash(hash) {
  const raw = decodeURIComponent((hash || '').replace(/^#/, ''));

  // старый формат: /chapter/flow?term=props
  if (raw.startsWith('/')) {
    const [pathPart, queryPart = ''] = raw.split('?');
    const parts = pathPart.split('/').filter(Boolean);
    return { path: '/' + parts.join('/'), parts, query: Object.fromEntries(new URLSearchParams(queryPart)) };
  }

  if (!raw || raw === 'map') return { path: 'map', parts: [], query: {} };
  if (raw.startsWith('chapter-')) return { path: raw, parts: ['chapter', raw.slice('chapter-'.length)], query: {} };
  if (raw.startsWith('library-')) return { path: raw, parts: ['library', raw.slice('library-'.length)], query: {} };
  if (raw.startsWith('glossary-')) return { path: 'glossary', parts: ['glossary'], query: { term: raw.slice('glossary-'.length) } };
  return { path: raw, parts: [raw], query: {} };
}

/** Хук: возвращает текущий маршрут и обновляет компонент при его смене */
export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return parseHash(hash);
}
