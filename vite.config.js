// Настройки сборщика Vite.
// base: './' — относительные пути к файлам. Благодаря этому собранная игра
// открывается и на GitHub Pages (https://<логин>.github.io/<репозиторий>/), и из любой папки.
// serviceWorkerPlugin — после сборки создаёт dist/sw.js для работы без интернета.
// Три вида сборки (режим выбирается флагом --mode):
//   обычная            — npm run build: папка dist/ для сайта (GitHub Pages) + sw.js;
//   single             — вся игра в одном файле dist-single/Props.html (см. build/singleFilePlugin.js);
//   artifact           — предпросмотр на claude.ai: шрифты с Google Fonts, без сервис-воркера.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import serviceWorkerPlugin from './build/serviceWorkerPlugin.js';
import singleFilePlugin from './build/singleFilePlugin.js';

// Шрифты с Google Fonts — только для сборки предпросмотра claude.ai (--mode artifact)
const GOOGLE_FONTS =
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n' +
  '    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500..700&family=Inter:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap" />';

const remoteFonts = () => ({
  name: 'props-remote-fonts',
  transformIndexHtml: (html) => html.replace('</title>', `</title>\n    ${GOOGLE_FONTS}`),
});

/** Какие плагины нужны в каждом режиме сборки */
function pluginsFor(mode) {
  // В предпросмотре claude.ai сервис-воркеры запрещены — для него sw.js не нужен
  if (mode === 'artifact') return [react(), remoteFonts()];
  // Одному файлу сервис-воркер тоже ни к чему: он и так целиком лежит на диске
  if (mode === 'single') return [react(), singleFilePlugin()];
  return [react(), serviceWorkerPlugin()];
}

/** Настройки сборки «всё в одном файле»: ничего не выносить в отдельные файлы */
const SINGLE_FILE_BUILD = {
  outDir: 'dist-single',
  assetsInlineLimit: Number.MAX_SAFE_INTEGER, // шрифты любого размера — внутрь стилей (data:-адреса)
  cssCodeSplit: false, // стили одним куском
  rollupOptions: { output: { codeSplitting: false } }, // «ленивые» части (свитки) — в общий скрипт
};

export default defineConfig(({ mode }) => ({
  plugins: pluginsFor(mode),
  base: './',
  // В одном файле папка public (значки, манифест) не нужна: значок вшивает плагин
  publicDir: mode === 'single' ? false : 'public',
  build: {
    // Контент игры (уроки, разбор кода, словарь) — это много текста.
    // Предупреждение о размере поднимаем: тяжёлые свитки и так грузятся отдельно.
    chunkSizeWarningLimit: mode === 'single' ? 4000 : 900,
    ...(mode === 'single' ? SINGLE_FILE_BUILD : {}),
  },
  test: {
    // Тесты проверяют чистую логику и контент, браузер им не нужен
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
}));
