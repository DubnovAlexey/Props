// Настройки сборщика Vite.
// base: './' — относительные пути к файлам. Благодаря этому собранная игра
// открывается и на GitHub Pages (https://<логин>.github.io/<репозиторий>/), и из любой папки.
// serviceWorkerPlugin — после сборки создаёт dist/sw.js для работы без интернета.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import serviceWorkerPlugin from './build/serviceWorkerPlugin.js';

// Шрифты с Google Fonts — только для сборки предпросмотра claude.ai (--mode artifact)
const GOOGLE_FONTS =
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n' +
  '    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500..700&family=Inter:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap" />';

const remoteFonts = () => ({
  name: 'props-remote-fonts',
  transformIndexHtml: (html) => html.replace('</title>', `</title>\n    ${GOOGLE_FONTS}`),
});

export default defineConfig(({ mode }) => ({
  // В предпросмотре claude.ai сервис-воркеры запрещены — для него sw.js не нужен
  plugins: mode === 'artifact' ? [react(), remoteFonts()] : [react(), serviceWorkerPlugin()],
  base: './',
  build: {
    // Контент игры (уроки, разбор кода, словарь) — это много текста.
    // Предупреждение о размере поднимаем: тяжёлые свитки и так грузятся отдельно.
    chunkSizeWarningLimit: 900,
  },
  test: {
    // Тесты проверяют чистую логику и контент, браузер им не нужен
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
}));
