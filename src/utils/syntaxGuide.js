// «Анатомия кода»: разбирает любой пример на синтаксические конструкции
// и объясняет каждую простыми словами. Работает для всего кода в игре —
// в уроках, словаре, разборах и заданиях — без ручной разметки.
//
// Как это устроено:
// 1. tokenizeLine режет строки на токены (теги, строки, скобки, имена…).
// 2. Проходим по токенам и смотрим на соседей и «стек» скобок и тегов:
//    одна и та же «{» бывает и выражением в атрибуте, и деструктуризацией,
//    и объектом — смысл определяет контекст.
// 3. Каждому токену назначаем id конструкции (cid), а для списка
//    собираем уникальные конструкции в порядке появления.
// Сами объяснения — в src/content/syntaxGuide.js: текст отдельно от логики, поэтому его можно переводить.
import { splitLines, tokenizeLine } from './highlight.js';
import { SYNTAX_GUIDE } from '../content/syntaxGuide.js';

/**
 * Описание конструкции по её id. guide — тексты на языке игрока (по умолчанию русские).
 * У хуков и методов описание собирается из шаблона: «useState — функция React».
 */
export function getConstruct(cid, guide = SYNTAX_GUIDE) {
  if (!cid) return null;
  if (cid.startsWith('react:')) {
    const name = cid.slice(6);
    const { simple, term } = guide.react[name];
    return {
      title: guide.reactTitle.replace('{name}', name),
      sample: name,
      simple: `${name}: ${simple}.`,
      term,
      why: name.startsWith('use') ? guide.hookWhy : undefined,
    };
  }
  if (cid.startsWith('method:')) {
    const name = cid.slice(7);
    const { simple, term } = guide.methods[name];
    return { title: `.${name}()`, sample: `.${name}()`, simple: `${name}: ${simple}.`, term };
  }
  return guide.constructs[cid] ?? null;
}

const STRUCTURAL = new Set([
  'block',
  'object',
  'jsx-expr',
  'double-brace',
  'destructure-props',
  'destructure-object',
  'destructure-array',
  'jsx-child-expr',
  'array',
  'index',
  'component-decl',
  'function-decl',
  'default-value',
  'fragment',
  'ternary',
  'comment',
]);

const OPS = {
  '...': 'spread',
  '?.': 'optional-chaining',
  '??': 'nullish',
  '&&': 'and',
  '||': 'or',
  '===': 'strict-equal',
  '!==': 'strict-equal',
};
const DESTRUCTURE = new Set(['destructure-props', 'destructure-object']);

function attrCid(name) {
  if (name === 'key') return 'key-attr';
  if (name === 'ref') return 'ref-attr';
  if (name === 'className') return 'classname-attr';
  if (name === 'htmlFor') return 'htmlfor-attr';
  if (name === 'style') return 'style-attr';
  if (name === 'children') return 'children-ident';
  if (name === 'value' || name === 'checked') return 'value-attr';
  if (name === 'defaultValue') return 'default-value-attr';
  if (/^on[A-Z]/.test(name)) return 'event-attr';
  if (name.startsWith('aria-')) return 'aria-attr';
  if (name.startsWith('data-')) return 'data-attr';
  return 'attr';
}

function keywordCid(word) {
  if (word === 'return') return 'return';
  if (word === 'const' || word === 'let' || word === 'var') return 'const';
  if (word === 'import' || word === 'from') return 'import';
  if (word === 'export' || word === 'default') return 'export';
  if (word === 'if' || word === 'else') return 'if';
  if (['true', 'false', 'null', 'undefined'].includes(word)) return 'literal';
  if (word === 'new') return 'new';
  if (word === 'typeof') return 'typeof';
  if (word === 'type' || word === 'interface') return 'ts-type';
  return 'keyword-other';
}

/**
 * Разбор кода: для каждого токена — его конструкция, плюс список конструкций.
 * @param {string} code — текст примера
 * @param {object} [guide] — объяснения на языке игрока (по умолчанию русские)
 * @returns {{ lines: {type:string, value:string, cid:string|null}[][], constructs: object[] }}
 */
export function explainCode(code, guide = SYNTAX_GUIDE) {
  const lines = splitLines(code).map((line, li) => tokenizeLine(line).map((token) => ({ ...token, cid: null, line: li })));
  const tokens = lines.flat().filter((token) => token.type !== 'plain' || token.value.trim());
  const lineText = (li) => lines[li].map((token) => token.value).join('');
  const stack = []; // открытые теги, скобки { и [
  let tagMode = null; // 'open' | 'close' — внутри <Тег …> или </Тег>

  tokens.forEach((token, k) => {
    const { type, value } = token;
    const prev = tokens[k - 1];
    const prev2 = tokens[k - 2];
    const next = tokens[k + 1];
    const top = stack[stack.length - 1];
    const inJsxText = !tagMode && top?.kind === 'tag';

    switch (type) {
      case 'comment':
      case 'number':
        token.cid = type;
        break;
      case 'string':
        if (prev?.value === '=' && prev2?.type === 'attr') token.cid = 'attr-string';
        else token.cid = value.startsWith('\x60') ? 'template' : 'string';
        break;
      case 'arrow':
        token.cid = 'arrow';
        break;
      case 'op':
        token.cid = value === '...' && DESTRUCTURE.has(top?.cid) ? 'rest' : OPS[value];
        break;
      case 'tag':
        if (value === '/>' || value === '>') {
          if (prev?.type === 'punct' && prev.value === '<') {
            // <> или </> — фрагмент
            token.cid = 'fragment';
            prev.cid = 'fragment';
            if (value === '>') stack.push({ kind: 'tag' });
            else if (stack.length && stack[stack.length - 1].kind === 'tag') stack.pop();
          } else if (tagMode === 'open') {
            token.cid = value === '/>' ? 'jsx-selfclose' : 'jsx-tag-end';
            if (value === '>') stack.push({ kind: 'tag' });
            tagMode = null;
          } else if (tagMode === 'close') {
            token.cid = 'jsx-close';
            tagMode = null;
          } else {
            token.cid = value === '>' ? 'compare' : null;
          }
        } else if (value.startsWith('</')) {
          token.cid = 'jsx-close';
          tagMode = 'close';
          const index = stack.map((item) => item.kind).lastIndexOf('tag');
          if (index !== -1) stack.splice(index);
        } else {
          token.cid = /^<[A-Z]/.test(value) ? 'jsx-component' : 'jsx-tag';
          tagMode = 'open';
        }
        break;
      case 'keyword':
        if (value === 'function') {
          const isComponent = next?.type === 'ident' && /^[A-Z]/.test(next.value);
          token.cid = isComponent ? 'component-decl' : 'function-decl';
          if (next?.type === 'ident') next.cid = token.cid;
        } else {
          token.cid = keywordCid(value);
        }
        break;
      case 'attr':
        token.cid = attrCid(value);
        break;
      case 'ident':
        if (token.cid) break; // имя функции уже размечено
        if (Object.hasOwn(guide.react, value)) token.cid = `react:${value}`;
        else if (prev?.value === '.' && Object.hasOwn(guide.methods, value)) token.cid = `method:${value}`;
        else if (value === 'props') token.cid = 'props-ident';
        else if (value === 'children') token.cid = 'children-ident';
        else if (value === 'console') token.cid = 'console';
        else if (/^on[A-Z]/.test(value)) token.cid = 'callback-prop';
        else if (/^handle[A-Z]/.test(value)) token.cid = 'handler';
        else if (/^set[A-Z]/.test(value)) token.cid = 'setter';
        else if ((value === 'e' || value === 'event') && next?.value === '.') token.cid = 'event-obj';
        break;
      case 'punct':
        if (value === '{') {
          let cid = 'block';
          if (prev?.value === '=' && prev2?.type === 'attr') cid = next?.value === '{' ? 'double-brace' : 'jsx-expr';
          else if (prev?.value === '{' && top?.cid === 'double-brace') cid = 'object';
          else if (inJsxText) cid = 'jsx-child-expr';
          else if (!prev || prev.type === 'comment' || prev.value === ';' || (prev.line !== token.line && prev.value === '}'))
            // фрагмент вида {isOpen && <Modal />} — вставка значения в разметку
            cid = /<[A-Za-z>]/.test(lineText(token.line)) ? 'jsx-child-expr' : 'block';
          else if (prev?.type === 'keyword' && ['const', 'let', 'var'].includes(prev.value)) cid = 'destructure-object';
          else if (prev?.value === 'import' || prev?.value === 'export') cid = prev.value;
          else if (prev?.value === '(' || (prev?.value === ',' && top?.cid === 'params'))
            cid = isParams(tokens, k) ? 'destructure-props' : 'object';
          else if ([':', ',', '[', '=', 'return', '(', '??', '||', '&&', '?'].includes(prev?.value)) cid = 'object';
          token.cid = cid;
          stack.push({ kind: 'brace', cid });
        } else if (value === '}') {
          if (top?.kind === 'brace') token.cid = stack.pop().cid;
        } else if (value === '[') {
          let cid = 'array';
          if (prev?.type === 'keyword' && ['const', 'let'].includes(prev.value)) cid = 'destructure-array';
          else if (prev && (prev.type === 'ident' || prev.value === ']' || prev.value === ')')) cid = 'index';
          token.cid = cid;
          stack.push({ kind: 'bracket', cid });
        } else if (value === ']') {
          if (top?.kind === 'bracket') token.cid = stack.pop().cid;
        } else if (value === '=' && DESTRUCTURE.has(top?.cid) && prev?.type === 'ident') {
          token.cid = 'default-value';
        } else if (value === '?') {
          token.cid = 'ternary';
        } else if (value === '!' && next?.value !== '=') {
          token.cid = 'not';
        } else if (value === '<' && !(next?.type === 'tag' && (next.value === '>' || next.value === '/>'))) {
          token.cid = 'compare';
        }
        break;
      default:
        break;
    }
  });

  // Для «структурных» конструкций показываем шаблон ({ … }), для остальных — сам кусочек кода
  const seen = new Map();
  for (const token of tokens) {
    if (token.cid && !seen.has(token.cid)) {
      const info = getConstruct(token.cid, guide);
      const sample = STRUCTURAL.has(token.cid) ? (info?.sample ?? token.value) : token.value;
      if (info) seen.set(token.cid, { cid: token.cid, ...info, sample });
    }
  }
  return { lines, constructs: [...seen.values()] };
}

/** «{» после «(» — это параметры функции? Ищем «function» раньше или «=>» после закрывающей «)» */
function isParams(tokens, k) {
  for (let i = k - 1; i >= Math.max(0, k - 4); i--) {
    if (tokens[i].value === 'function' || tokens[i].value === 'memo') return true;
  }
  let depth = 0;
  for (let i = k; i < tokens.length; i++) {
    const v = tokens[i].value;
    if (v === '(') depth++;
    if (v === ')') {
      if (depth === 0) return tokens[i + 1]?.value === '=>' || tokens[i + 1]?.value === ':';
      depth--;
    }
  }
  return false;
}
