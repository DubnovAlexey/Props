// Тесты языков: выбор языка, функция перевода и — главное — полнота словарей.
// Русский словарь главный; каждый другой обязан повторять его ключ в ключ. Если в переводе
// потерялась строка или подстановка {имя}, игрок увидел бы пустое место или «{count}» —
// эти тесты ловят такое до того, как оно попадёт в игру.
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { DEFAULT_LANGUAGE, LANGUAGES, languageByCode, pickLanguage } from '../src/i18n/languages.js';
import { createTranslator, interpolate, isPluralForms, lookup } from '../src/i18n/translate.js';
import { frenchSpaces, mapStrings } from '../src/i18n/typography.js';
import { bootstrapLanguage, loadDictionary } from '../src/i18n/dictionaries.js';
import ru from '../src/i18n/ui/ru.js';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const OTHERS = LANGUAGES.map((language) => language.code).filter((code) => code !== 'ru');

/** Все «листья» словаря: [['map.title', 'Пещеры…'], …]. Формы числа считаются одним листом */
function leaves(node, prefix = '') {
  if (typeof node === 'string' || isPluralForms(node)) return [[prefix, node]];
  if (Array.isArray(node)) return node.flatMap((item, index) => leaves(item, `${prefix}[${index}]`));
  return Object.entries(node).flatMap(([key, value]) => leaves(value, prefix ? `${prefix}.${key}` : key));
}

/** Строки листа: одна строка или все формы числа */
const textsOf = (value) => (typeof value === 'string' ? [value] : Object.values(value));
const placeholders = (value) => [...new Set(textsOf(value).flatMap((text) => text.match(/\{\w+\}/g) ?? []))].sort();
const termIds = (value) =>
  [...new Set(textsOf(value).flatMap((text) => [...text.matchAll(/\[\[([\w-]+)/g)].map((match) => match[1])))].sort();

function filesIn(dir, endings) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = `${dir}${entry.name}`;
    if (entry.isDirectory()) return filesIn(`${path}/`, endings);
    return endings.some((ending) => entry.name.endsWith(ending)) ? [path] : [];
  });
}

describe('выбор языка', () => {
  it('в списке пять языков, иврит пишется справа налево', () => {
    expect(LANGUAGES.map((language) => language.code)).toEqual(['ru', 'en', 'he', 'es', 'fr']);
    expect(languageByCode('he').dir).toBe('rtl');
    expect(LANGUAGES.filter((language) => language.dir === 'rtl')).toHaveLength(1);
    expect(languageByCode('xx')).toBeNull();
    expect(DEFAULT_LANGUAGE).toBe('ru');
  });

  it('сохранённый выбор игрока важнее всего', () => {
    expect(pickLanguage('he', ['en-US'])).toBe('he');
    expect(pickLanguage('fr', [])).toBe('fr');
  });

  it('без выбора игрока берётся язык браузера — но только тот, на который уже переведены уроки', () => {
    const ready = LANGUAGES.filter((language) => language.ready).map((language) => language.code);
    expect(ready).toContain('ru');
    for (const language of LANGUAGES) {
      const picked = pickLanguage(null, [`${language.code}-XX`]);
      expect(picked).toBe(language.ready ? language.code : 'ru');
    }
    expect(pickLanguage(undefined, ['ru-RU', 'en'])).toBe('ru');
    expect(pickLanguage('нет такого', ['de-DE', 'ja'])).toBe('ru');
    expect(pickLanguage(null)).toBe('ru');
  });
});

describe('функция перевода', () => {
  const dictionary = {
    title: 'Пещеры',
    cave: 'Пещера {n} из {total}',
    caves: { one: '{count} пещера', few: '{count} пещеры', many: '{count} пещер', other: '{count} пещеры' },
    steps: ['раз', 'два'],
    deep: { inner: { leaf: 'лист' } },
  };
  const t = createTranslator('ru', dictionary);

  it('достаёт строку по адресу и подставляет значения', () => {
    expect(t('title')).toBe('Пещеры');
    expect(t('deep.inner.leaf')).toBe('лист');
    expect(t('cave', { n: 3, total: 18 })).toBe('Пещера 3 из 18');
    expect(lookup(dictionary, 'deep.inner')).toEqual({ leaf: 'лист' });
    expect(lookup(dictionary, 'title.oops')).toBeUndefined();
  });

  it('незнакомая подстановка остаётся видна, а не исчезает молча', () => {
    expect(interpolate('Привет, {name}! {oops}', { name: 'Граф' })).toBe('Привет, Граф! {oops}');
    // в подставляемом тексте фигурные скобки не трогаем: это может быть код из задания
    expect(interpolate('Ответ: {answer}', { answer: '{props.name}' })).toBe('Ответ: {props.name}');
  });

  it('формы числа выбираются по правилам языка', () => {
    expect([1, 2, 5, 11, 21, 22, 25].map((count) => t('caves', { count }))).toEqual([
      '1 пещера',
      '2 пещеры',
      '5 пещер',
      '11 пещер',
      '21 пещера',
      '22 пещеры',
      '25 пещер',
    ]);
    const english = createTranslator('en', { caves: { one: '{count} cave', other: '{count} caves' } });
    expect([1, 2, 18].map((count) => english('caves', { count }))).toEqual(['1 cave', '2 caves', '18 caves']);
    // формы, которой в словаре нет, заменяет other
    const sparse = createTranslator('ru', { caves: { other: 'пещер: {count}' } });
    expect(sparse('caves', { count: 1 })).toBe('пещер: 1');
  });

  it('списки отдаются как есть; нет строки — берётся запасной словарь, нет и там — виден адрес', () => {
    expect(t('steps')).toEqual(['раз', 'два']);
    const partial = createTranslator('en', { title: 'Caves' }, dictionary);
    expect(partial('title')).toBe('Caves');
    expect(partial('deep.inner.leaf')).toBe('лист');
    expect(partial('nope.at.all')).toBe('nope.at.all');
  });
});

describe('французская типографика', () => {
  it('пробел перед двоеточием, «;», «!», «?» и в кавычках становится неразрывным', () => {
    expect(frenchSpaces('Rang : {rank} ; « Props » ? Oui !')).toBe('Rang : {rank} ; « Props » ? Oui !');
    expect(frenchSpaces('Sans ponctuation double')).toBe('Sans ponctuation double');
  });

  it('обходит весь словарь, сохраняя его устройство', () => {
    expect(mapStrings({ a: 'x :', b: ['y !', { c: 'z ?' }], n: 5 }, frenchSpaces)).toEqual({
      a: 'x :',
      b: ['y !', { c: 'z ?' }],
      n: 5,
    });
  });
});

describe('словари интерфейса', () => {
  const ruLeaves = leaves(ru);

  it('русский словарь: строки не пустые (кроме предупреждения о переводе и пустых примечаний)', () => {
    expect(ruLeaves.length).toBeGreaterThan(300);
    const empty = ruLeaves.filter(([, value]) => textsOf(value).some((text) => text === '')).map(([key]) => key);
    // «нулевые» места в списках по номеру (уровень 0, гробик 0) и примечания, которых у устройства нет
    expect(empty.sort()).toEqual(
      ['install.devices.android.note', 'install.devices.desktop.note', 'lang.notice', 'practice.levels[0]', 'review.boxes[0]'].sort(),
    );
  });

  it.each(OTHERS)('%s: загружается и повторяет русский словарь ключ в ключ', async (lang) => {
    const dictionary = await loadDictionary(lang);
    expect(dictionary).not.toBe(ru);
    const own = new Map(leaves(dictionary));
    const problems = [];

    for (const [key, ruValue] of ruLeaves) {
      const value = own.get(key);
      if (value === undefined) {
        problems.push(`${key}: нет перевода`);
        continue;
      }
      if (isPluralForms(ruValue) !== isPluralForms(value)) problems.push(`${key}: форма числа в одном словаре и строка в другом`);
      if (placeholders(ruValue).join() !== placeholders(value).join()) {
        problems.push(`${key}: подстановки ${placeholders(value).join(' ') || '—'} вместо ${placeholders(ruValue).join(' ') || '—'}`);
      }
      if (termIds(ruValue).join() !== termIds(value).join()) problems.push(`${key}: другие ссылки на термины [[…]]`);
      for (const text of textsOf(value)) {
        if (/[А-Яа-яЁё]/.test(text)) problems.push(`${key}: остался русский текст`);
        // строка пустая там же, где и в русском (исключение — предупреждение о переводе)
        const ruEmpty = textsOf(ruValue).every((item) => item === '');
        if (key !== 'lang.notice' && (text === '') !== ruEmpty) problems.push(`${key}: пустая строка`);
      }
    }
    for (const key of own.keys())
      if (!ruLeaves.some(([ruKey]) => ruKey === key)) problems.push(`${key}: лишний ключ, которого нет в русском словаре`);

    expect(problems).toEqual([]);
    // предупреждение «уроки пока на русском» есть во всех языках, кроме русского
    expect(lookup(dictionary, 'lang.notice').length).toBeGreaterThan(20);
  });

  it.each(OTHERS)('%s: у каждой формы числа есть все нужные языку варианты', async (lang) => {
    const dictionary = await loadDictionary(lang);
    const needed = new Intl.PluralRules(lang).resolvedOptions().pluralCategories;
    for (const [key, value] of leaves(dictionary)) {
      if (!isPluralForms(value)) continue;
      // целые числа, которые встречаются в игре, не дают форму «many» у испанского и французского
      for (const category of needed.filter((item) => item !== 'many' || lang === 'ru')) {
        expect(Object.keys(value), `${lang} ${key}`).toContain(category);
      }
    }
  });

  it('иврит: в переведённых строках действительно есть ивритские буквы', async () => {
    const dictionary = new Map(leaves(await loadDictionary('he')));
    const latinOnly = ruLeaves
      .filter(([, ruValue]) => textsOf(ruValue).some((text) => /[А-Яа-яЁё]/.test(text)))
      .filter(([key]) => !textsOf(dictionary.get(key)).some((text) => /[֐-׿]/.test(text)))
      .map(([key]) => key);
    // там, где в русском словаре слова, в ивритском не должно остаться одной латиницы
    expect(latinOnly).toEqual([]);
  });

  it('французский: перед «:», «;», «!», «?» стоит пробел, и после загрузки он неразрывный', async () => {
    const source = (await import('../src/i18n/ui/fr.js')).default;
    const glued = leaves(source)
      .flatMap(([key, value]) => textsOf(value).map((text) => [key, text]))
      // знак, приклеенный к слову: «mot:» вместо «mot :». Разметку **…** перед проверкой убираем
      .filter(([, text]) => /[\p{L}\p{N}»)][:;!?]/u.test(text.replace(/\*\*/g, '')))
      .map(([key]) => key);
    expect(glued).toEqual([]);

    const loaded = leaves(await loadDictionary('fr')).flatMap(([, value]) => textsOf(value));
    expect(loaded.some((text) => text.includes(' :'))).toBe(true);
    for (const text of loaded) expect(text).not.toMatch(/ [:;!?»]|« /);
  });

  it('испанский: вопросы и восклицания открываются перевёрнутым знаком', async () => {
    const texts = leaves(await loadDictionary('es')).flatMap(([key, value]) => textsOf(value).map((text) => [key, text]));
    const problems = texts
      .filter(([, text]) => (text.includes('?') && !text.includes('¿')) || (text.includes('!') && !text.includes('¡')))
      .map(([key]) => key);
    expect(problems).toEqual([]);
  });

  it('запуск: язык и словарь готовятся вместе; незнакомый язык не ломает игру', async () => {
    const saved = await bootstrapLanguage('es', ['ru-RU']);
    expect(saved.lang).toBe('es');
    expect(lookup(saved.dictionary, 'nav.map')).toBe('Mapa');
    const auto = await bootstrapLanguage(null, ['en-US']);
    expect(auto.lang).toBe('ru'); // уроки на английский ещё не переведены
    expect(await loadDictionary('xx')).toBe(ru);
  });
});

describe('строки интерфейса в коде', () => {
  const sources = filesIn(SRC, ['.js', '.jsx'])
    .filter((path) => !path.includes('/i18n/ui/'))
    .map((path) => [path.slice(SRC.length), readFileSync(path, 'utf8')]);
  const all = sources.map(([, code]) => code).join('\n');

  it('каждый адрес строки, который просит код, есть в словаре', () => {
    const problems = [];
    for (const [file, code] of sources) {
      // t('map.title') и t('map.title', {…})
      for (const [, key] of code.matchAll(/\bt\(\s*'([\w.]+)'/g)) {
        if (lookup(ru, key) === undefined) problems.push(`${file}: t('${key}') — нет в словаре`);
      }
      // t(`nav.${item.section}`) — проверяем, что есть раздел с таким началом
      for (const [, prefix] of code.matchAll(/\bt\(\s*`([\w.]+)\.\$\{/g)) {
        if (typeof lookup(ru, prefix) !== 'object') problems.push(`${file}: t(\`${prefix}.…\`) — нет такого раздела`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('в словаре нет забытых строк, которые никто не показывает', () => {
    const dynamic = [...all.matchAll(/`([\w.]+)\.\$\{/g)].map((match) => `${match[1]}.`);
    const unused = leaves(ru)
      .map(([key]) => key.replace(/\[\d+\].*$/, '')) // элемент списка → сам список
      .filter((key, index, list) => list.indexOf(key) === index)
      .filter((key) => !dynamic.some((prefix) => key.startsWith(prefix)))
      // адрес упомянут в коде целиком: 'map.title' — или его раздел берут целиком: t('exam.verdicts')
      .filter((key) => {
        const parts = key.split('.');
        return !parts.some((_, i) => all.includes(`'${parts.slice(0, parts.length - i).join('.')}'`));
      });
    expect(unused).toEqual([]);
  });
});
