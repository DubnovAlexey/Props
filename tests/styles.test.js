// Тесты стилей: каждая анимация, на которую ссылается CSS, действительно существует.
//
// Зачем. Сборщик переименовывает в файлах *.module.css не только классы, но и имена
// анимаций: «pop-in» превращается во что-то вроде «_pop-in_11ksg_85». Если @keyframes pop-in
// описан в общем файле src/styles/animations.css, переименованная ссылка никуда не ведёт —
// и анимация молча не запускается. Так в игре с самого начала не работала 21 анимация:
// у летучих мышей не махали крылья, Граф не моргал и не парил.
// Правило: модуль описывает свои @keyframes в том же файле, где их использует.
// (Запись global(имя) сборщик тоже понимает, но IntelliJ считает её ошибкой — не используем.)
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));

/** Все файлы папки и её подпапок с нужным окончанием */
function filesIn(dir, ending) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = `${dir}${entry.name}`;
    if (entry.isDirectory()) return filesIn(`${path}/`, ending);
    return entry.name.endsWith(ending) ? [path] : [];
  });
}

const withoutComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const keyframesIn = (css) => new Set([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((match) => match[1]));

// Слова, которые в записи animation означают не имя, а настройку
const KEYWORDS = new Set([
  ...['none', 'initial', 'inherit', 'unset', 'revert'],
  ...['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end'],
  ...['infinite', 'normal', 'reverse', 'alternate', 'alternate-reverse'],
  ...['forwards', 'backwards', 'both', 'running', 'paused'],
]);

/** Имена анимаций из значения свойства animation: { own: обычные, shared: записанные через global() } */
function animationNames(value) {
  const shared = [...value.matchAll(/\bglobal\(\s*([\w-]+)\s*\)/g)].map((match) => match[1]);
  // убираем все функции — var(), calc(), cubic-bezier(), steps(), global() — вместе с содержимым
  let rest = value;
  for (let previous = ''; previous !== rest;) {
    previous = rest;
    rest = rest.replace(/[\w-]+\([^()]*\)/g, ' ');
  }
  const own = rest
    .split(/[\s,]+/)
    .filter((word) => /^-?[a-z_][\w-]*$/i.test(word) && !KEYWORDS.has(word.toLowerCase()) && !word.startsWith('!'));
  return { own, shared };
}

/** Все значения animation / animation-name в тексте стилей */
const animationValues = (css) => [...css.matchAll(/(?<![\w-])animation(?:-name)?\s*:([^;{}]*)[;}]/g)].map((match) => match[1]);

describe('анимации в стилях', () => {
  const sharedKeyframes = keyframesIn(readFileSync(`${SRC}styles/animations.css`, 'utf8'));
  const all = filesIn(SRC, '.css');
  const modules = all.filter((path) => path.endsWith('.module.css'));
  const plain = all.filter((path) => !path.endsWith('.module.css'));

  it('разбор значения animation отличает имена от настроек', () => {
    expect(animationNames('flap 0.32s ease-in-out infinite')).toEqual({ own: ['flap'], shared: [] });
    expect(animationNames('global(pop-in) 0.3s ease both, glow 1.6s infinite')).toEqual({ own: ['glow'], shared: ['pop-in'] });
    expect(animationNames('across var(--dur) linear var(--delay, 0ms) both')).toEqual({ own: ['across'], shared: [] });
    expect(animationNames('none !important')).toEqual({ own: [], shared: [] });
    expect(animationNames('spin 1s cubic-bezier(0.3, 0.7, 0.4, 1) 2')).toEqual({ own: ['spin'], shared: [] });
  });

  it('стили найдены, общие анимации описаны', () => {
    expect(modules.length).toBeGreaterThan(20);
    expect(plain.length).toBeGreaterThanOrEqual(3);
    for (const name of ['fade-in-up', 'pop-in', 'shake']) expect(sharedKeyframes.has(name)).toBe(true);
  });

  it('в модульных стилях у каждой анимации свой @keyframes в том же файле', () => {
    const problems = [];
    for (const path of modules) {
      const css = withoutComments(readFileSync(path, 'utf8'));
      const ownKeyframes = keyframesIn(css);
      const file = path.slice(SRC.length);
      for (const value of animationValues(css)) {
        const { own, shared } = animationNames(value);
        for (const name of own) {
          if (ownKeyframes.has(name)) continue;
          problems.push(
            sharedKeyframes.has(name)
              ? `${file}: «${name}» описана только в animations.css — из модуля она недоступна, опиши @keyframes ${name} в этом файле`
              : `${file}: «${name}» — нет такого @keyframes в файле`,
          );
        }
        for (const name of shared)
          problems.push(`${file}: global(${name}) — IntelliJ считает это ошибкой; опиши @keyframes ${name} в этом файле`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('общие стили ссылаются только на анимации из animations.css', () => {
    const problems = [];
    for (const path of plain) {
      const css = withoutComments(readFileSync(path, 'utf8'));
      const known = new Set([...sharedKeyframes, ...keyframesIn(css)]);
      for (const value of animationValues(css)) {
        for (const name of animationNames(value).own) {
          if (!known.has(name)) problems.push(`${path.slice(SRC.length)}: «${name}» — нет такого @keyframes`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});
