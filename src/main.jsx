// Точка входа: здесь React «оживляет» страницу index.html.
// Общие стили подключаем ДО компонентов: тогда стили компонентов
// (*.module.css) идут в каскаде позже и могут переопределять общие.
// Шрифты — из node_modules: сборщик положит их рядом с приложением (офлайн).
// В сборке для предпросмотра claude.ai (npm run build:artifact) шрифты берутся
// с Google Fonts, поэтому этот блок там выключен (см. .env.artifact).
if (!import.meta.env.VITE_REMOTE_FONTS) {
  import('@fontsource-variable/inter');
  import('@fontsource-variable/cormorant-garamond');
  import('@fontsource-variable/jetbrains-mono');
}
import './styles/variables.css';
import './styles/global.css';
import './styles/animations.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// StrictMode — «строгий учитель» режима разработки: дважды вызывает
// компоненты, чтобы поймать нечистый код. В собранной версии не работает.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Офлайн-режим: сервис-воркер кэширует игру после первого открытия.
// Регистрируем только в собранной версии (в разработке он бы мешал
// обновлениям). Внутри предпросмотра claude.ai сервис-воркеры запрещены —
// ошибку тихо пропускаем, игра просто работает онлайн.
if (import.meta.env.PROD && !import.meta.env.VITE_ARTIFACT && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
