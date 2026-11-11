// Перевод «Свитков Графа»: заголовки разделов и подписи схем — в накладке языка (library),
// сами разделы — в src/content/i18n/<язык>/library/sNN.md. Тест следит, чтобы перевод ложился
// на оригинал: у каждого заголовка есть раздел и наоборот, в разделе нет русских букв, в нём те же
// схемы (::scheme, ::diagram), столько же блоков кода и заголовков, что в оригинале, а подписи схем
// переведены поле в поле. Язык с ready: true обязан перевести свитки целиком.
import { describe, expect, it } from 'vitest';
import RU_SECTIONS from '../src/content/library/sections.json';
import { LIBRARY_SCHEMES } from '../src/content/library/schemes.js';
import { languageByCode } from '../src/i18n/languages.js';
import { localize, overlayProblems } from '../src/utils/localize.js';

const RU_TEXT = import.meta.glob('../src/content/library/sections/*.md', { query: '?raw', import: 'default', eager: true });
const TRANSLATED = import.meta.glob('../src/content/i18n/*/library/*.md', { query: '?raw', import: 'default', eager: true });
const OVERLAYS = Object.fromEntries(
  Object.entries(import.meta.glob('../src/content/i18n/*/index.js', { eager: true, import: 'default' })).map(([path, overlay]) => [
    path.split('/').at(-2),
    overlay,
  ]),
);

const CYRILLIC = /[а-яё]/i;
const ruText = (id) => RU_TEXT[`../src/content/library/sections/${id}.md`];
const translatedIds = (lang) =>
  Object.keys(TRANSLATED)
    .filter((path) => path.split('/').at(-3) === lang)
    .map((path) => path.split('/').at(-1).replace('.md', ''));

/** Что в разделе должно совпасть с оригиналом: схемы по порядку, число блоков кода и заголовков */
const skeleton = (markdown) => ({
  directives: markdown.split('\n').filter((line) => line.startsWith('::')),
  codeBlocks: markdown.split('\n').filter((line) => line.startsWith('```')).length,
  headings: markdown.split('\n').filter((line) => /^#{3,6}\s/.test(line)).length,
});

/** Все строки значения: перевод схем не должен оставить русских букв */
const strings = (value) =>
  typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];

describe('свитки Графа: русский оригинал', () => {
  it('у каждого раздела оглавления есть текст, а схемы раздела описаны', () => {
    for (const section of RU_SECTIONS) {
      const text = ruText(section.id);
      expect(text, section.id).toBeTruthy();
      for (const line of skeleton(text).directives.filter((item) => item.startsWith('::scheme'))) {
        expect(LIBRARY_SCHEMES[line.split(' ')[1]], line).toBeTruthy();
      }
    }
  });
});

for (const [lang, overlay] of Object.entries(OVERLAYS)) {
  const library = overlay.library ?? {};
  const titles = library.titles ?? {};
  const ids = translatedIds(lang);

  describe(`свитки Графа: ${lang}`, () => {
    it('у каждого переведённого заголовка есть раздел, у каждого раздела — заголовок', () => {
      expect(Object.keys(titles).sort()).toEqual([...ids].sort());
      for (const id of ids)
        expect(
          RU_SECTIONS.some((section) => section.id === id),
          id,
        ).toBe(true);
    });

    it('в переведённых разделах нет русских букв, а схемы, код и заголовки — как в оригинале', () => {
      for (const id of ids) {
        const text = TRANSLATED[`../src/content/i18n/${lang}/library/${id}.md`];
        const leftovers = text.split('\n').filter((line) => CYRILLIC.test(line));
        expect(leftovers, `${lang}/${id}`).toEqual([]);
        expect(CYRILLIC.test(titles[id]), `${lang}/${id}: заголовок`).toBe(false);
        expect(skeleton(text), `${lang}/${id}`).toEqual(skeleton(ruText(id)));
      }
    });

    it('подписи схем переведены поле в поле и без русских букв', () => {
      expect(overlayProblems(LIBRARY_SCHEMES, library.schemes ?? {})).toEqual([]);
      for (const name of Object.keys(library.schemes ?? {})) {
        const leftovers = strings(localize(LIBRARY_SCHEMES[name], library.schemes[name])).filter((text) => CYRILLIC.test(text));
        expect(leftovers, `${lang}: схема ${name}`).toEqual([]);
      }
    });

    if (languageByCode(lang)?.ready) {
      it('«готовый» язык перевёл свитки целиком', () => {
        expect(ids).toHaveLength(RU_SECTIONS.length);
        expect(Object.keys(library.schemes ?? {}).sort()).toEqual(Object.keys(LIBRARY_SCHEMES).sort());
      });
    }
  });
}
