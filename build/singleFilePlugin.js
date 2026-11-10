// Плагин Vite для сборки «всё в одном файле» (npm run build:single).
// Обычная сборка — это страница плюс десятки файлов: скрипты, стили, шрифты.
// Такую папку неудобно пересылать, а открытая с диска (file://) она не работает:
// браузер не разрешает странице с диска подгружать скрипты-модули.
// Здесь всё вшивается прямо в страницу: скрипт и стили — в теги <script> и <style>,
// шрифты и значок — в виде data:-адресов (шрифты вшивает сам Vite, см. vite.config.js).
// Получается один файл Props.html: его можно скачать, переслать и открыть
// двойным щелчком — игра работает без интернета и без сервера.
//
// Работаем на шаге writeBundle — когда Vite уже полностью закончил со своими файлами
// (в том числе дописал в код служебные вставки для «ленивых» import()).
// Если вшивать раньше, в generateBundle, в файл попадает недоделанный код.
import { copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** Код внутри <script> не должен содержать «</script» и «<!--»: браузер принял бы их за конец тега */
function safeForScript(code) {
  return code.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
}

function safeForStyle(css) {
  return css.replace(/<\/style/gi, '<\\/style');
}

export default function singleFilePlugin({ fileName = 'Props.html', copyToDir = 'dist' } = {}) {
  let root = process.cwd();

  return {
    name: 'props-single-file',
    apply: 'build',
    enforce: 'post',

    configResolved(config) {
      root = config.root;
    },

    writeBundle(options, bundle) {
      const outDir = options.dir;
      const page = Object.values(bundle).find((file) => file.fileName.endsWith('.html'));
      if (!page) this.error('Сборка одним файлом: страница index.html не найдена');
      let html = String(page.source);

      // <script src="./assets/…js"> → <script>код</script>
      html = html.replace(/<script\b([^>]*?)\ssrc="\.\/([^"]+)"([^>]*)><\/script>/g, (tag, before, src, after) => {
        const chunk = bundle[src];
        if (!chunk) return tag;
        const attrs = `${before}${after}`.replace(/\scrossorigin(="[^"]*")?/g, '');
        // функция вместо строки: в коде встречается «$&», а в строке-замене это спецсимволы
        return `<script${attrs}>${safeForScript(chunk.code)}</script>`;
      });

      // <link rel="stylesheet" href="./assets/…css"> → <style>стили</style>
      html = html.replace(/<link\b[^>]*\srel="stylesheet"[^>]*>/g, (tag) => {
        const href = tag.match(/\shref="\.\/([^"]+)"/)?.[1];
        const asset = href && bundle[href];
        return asset ? `<style>${safeForStyle(String(asset.source))}</style>` : tag;
      });

      // Значок вкладки — тоже внутрь; ссылки на файлы установки (манифест, значок iPhone)
      // убираем: у копии с диска этих файлов нет, а установить её как приложение нельзя
      // Значок есть в двух размерах (webp 192 и png 64); в один файл кладём маленький png —
      // вкладке его хватает, а файл не раздувается. Большую картинку из разметки убираем.
      const favicon = readFileSync(join(root, 'public/favicon.png')).toString('base64');
      html = html
        .replace(/\s*<link rel="icon"[^>]*href="\.\/favicon\.webp"[^>]*>/, '')
        .replace(/href="\.\/favicon\.png"/, () => `href="data:image/png;base64,${favicon}"`)
        .replace(/\s*<link rel="(manifest|apple-touch-icon|modulepreload)"[^>]*>/g, '')
        .replace(/\s*<!-- Установка на телефон[^>]*-->/, '');

      // Самопроверка: в файле не должно остаться ссылок на соседние файлы и недоделанного кода
      const external = [...html.matchAll(/<(?:script|link)\b[^>]*\s(?:src|href)="\.\/([^"]+)"/g)].map((match) => match[1]);
      if (external.length) this.error(`Сборка одним файлом: остались ссылки на файлы: ${external.join(', ')}`);
      if (html.includes('__VITE_PRELOAD__')) this.error('Сборка одним файлом: в коде осталась служебная метка Vite');

      // Пишем итоговый файл и убираем из папки всё остальное — оно уже внутри
      for (const name of Object.keys(bundle)) rmSync(join(outDir, name), { force: true });
      rmSync(join(outDir, 'assets'), { recursive: true, force: true });
      writeFileSync(join(outDir, fileName), html);

      // Кладём копию рядом с обычной сборкой: с сайта её можно скачать по ссылке ./Props.html
      const siteDir = join(root, copyToDir);
      if (existsSync(siteDir)) copyFileSync(join(outDir, fileName), join(siteDir, fileName));
    },
  };
}
