// Мини-разметка для текстов уроков (чистые функции, без React):
//   **жирный**      → <strong>
//   `код`           → <code>
//   [[props]]       → термин со всплывающей подсказкой
//   [[props|пропсы]]→ термин с другим текстом ссылки
// Строки, начинающиеся с «- », собираются в маркированный список.

const INLINE = /\*\*(.+?)\*\*|`([^`]+)`|\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g;

/** Разбивает строку на кусочки: текст, жирный, код, термин */
export function parseInline(text) {
  const tokens = [];
  let last = 0;
  for (const match of String(text).matchAll(INLINE)) {
    if (match.index > last) {
      tokens.push({ type: 'text', value: text.slice(last, match.index) });
    }
    const [whole, bold, code, termId, termLabel] = match;
    if (bold !== undefined) tokens.push({ type: 'bold', value: bold });
    else if (code !== undefined) tokens.push({ type: 'code', value: code });
    else tokens.push({ type: 'term', id: termId, label: termLabel ?? null });
    last = match.index + whole.length;
  }
  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });
  return tokens;
}

/** Все идентификаторы терминов в строке — нужно тестам, чтобы ловить опечатки */
export function termIdsIn(text) {
  return parseInline(text)
    .filter((token) => token.type === 'term')
    .map((token) => token.id);
}

/** Одно и то же слово? Регистр и пробелы по краям не важны: «Bundler» и «bundler» — одно слово */
export function sameWord(a, b) {
  return (
    String(a ?? '')
      .trim()
      .toLowerCase() ===
    String(b ?? '')
      .trim()
      .toLowerCase()
  );
}

/** Текст без разметки — для реплик Графа и подписей */
export function stripMarkup(text, labelFor = (id) => id) {
  return parseInline(text)
    .map((token) => (token.type === 'term' ? (token.label ?? labelFor(token.id)) : token.value))
    .join('');
}

/** Группирует строки в абзацы и списки */
export function groupBlocks(lines) {
  const blocks = [];
  for (const line of lines) {
    if (line.startsWith('- ')) {
      const previous = blocks[blocks.length - 1];
      if (previous?.type === 'ul') previous.items.push(line.slice(2));
      else blocks.push({ type: 'ul', items: [line.slice(2)] });
    } else {
      blocks.push({ type: 'p', text: line });
    }
  }
  return blocks;
}
