// Сборка «Свитков Графа» из полного руководства docs/guide.md.
// Режет руководство по разделам «## N. …» на отдельные файлы
// src/content/library/sections/sNN.md и пишет оглавление sections.json.
// Заглушки «[embedded content: …]» превращаются в строки-директивы:
//   ::diagram имя   — готовая SVG-иллюстрация (components/Diagram)
//   ::scheme имя    — схема из src/content/library/schemes.js
// Запуск: npm run library   (после правки docs/guide.md)
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'src/content/library/sections');

const PLACEHOLDERS = {
  'путь пропа · 4 шага': '::scheme prop-path',
  'путь пропа от JSX до DOM · 5 шагов': '::scheme jsx-to-dom',
  'дерево компонентов · данные сверху вниз': '::diagram tree',
  'цикл перерисовки · 5 шагов': '::scheme rerender',
  'данные вниз, события вверх': '::diagram flow',
  'подъём состояния · до и после': '::diagram lifting',
  'ErrorModal · куда попадает каждый проп': '::diagram modal',
  'memo · когда рендер пропускается': '::diagram memo',
  'prop drilling и Context · сравнение': '::diagram drilling',
  'Умный холодильник · дерево компонентов': '::scheme fridge',
  'Kosmo, преферанс · от движка до карты': '::scheme kosmo',
};

/** Какие пещеры опираются на раздел руководства (для ссылок «Теория») */
const SECTION_CAVES = {
  1: ['passing'],
  2: ['components', 'vdom'],
  3: ['passing'],
  4: ['js-basics', 'passing'],
  5: ['flow'],
  6: ['state'],
  7: ['callbacks'],
  8: ['children'],
  9: ['special'],
  10: ['performance'],
  11: ['types'],
  12: ['context'],
  13: ['patterns'],
  14: ['patterns', 'async'],
  15: ['patterns'],
};

const source = readFileSync(join(root, 'docs/guide.md'), 'utf8');
const unknown = [];
const text = source
  .replace(/&#91;embedded content: (.+?)\\\]/g, (_, name) => {
    const directive = PLACEHOLDERS[name.trim()];
    if (!directive) unknown.push(name);
    return directive ?? '';
  })
  .replace(/\\\]/g, ']')
  .replace(/&#91;/g, '[');

if (unknown.length) {
  console.error('Неизвестные заглушки схем:', unknown);
  process.exit(1);
}

const parts = text.split(/^## /m).slice(1);
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const sections = parts.map((part) => {
  const newline = part.indexOf('\n');
  const heading = part.slice(0, newline).trim();
  const body = part.slice(newline + 1).trim();
  const match = heading.match(/^(\d+)\.\s*(.+)$/);
  const num = Number(match[1]);
  const id = `s${String(num).padStart(2, '0')}`;
  writeFileSync(join(OUT, `${id}.md`), body + '\n');
  return { id, num, title: match[2], caves: SECTION_CAVES[num] ?? [], size: body.length };
});

writeFileSync(join(root, 'src/content/library/sections.json'), JSON.stringify(sections, null, 2) + '\n');
console.log(`Готово: ${sections.length} разделов → src/content/library/sections/`);
