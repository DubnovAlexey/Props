// Простая подсветка JSX/JS-кода по строкам.
// Регулярное выражение находит «кусочки» кода (токены), остальное — пробелы.
// Порядок групп важен: комментарии и строки проверяются первыми,
// многосимвольные операторы (... ?. ?? && ||) — раньше одиночных знаков.

const TOKEN = new RegExp(
  [
    String.raw`(\/\/.*$|\/\*.*?\*\/|#(?=\s).*$)`, // 1 комментарий (// … , /* … */, # … в терминале)
    String.raw`('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|\x60(?:[^\x60\\]|\\.)*\x60)`, // 2 строка
    String.raw`(=>)`, // 3 стрелка
    String.raw`(\.\.\.|\?\.|\?\?|&&|\|\||===|!==)`, // 4 составной оператор
    String.raw`(<\/?[A-Za-z][\w.]*|\/?>)`, // 5 тег JSX
    String.raw`\b(const|let|var|function|return|if|else|import|export|default|from|new|typeof|true|false|null|undefined|async|await|for|of|in|while|try|catch|class|extends|this|type|interface)\b`, // 6 ключевое слово
    String.raw`\b(\d+(?:\.\d+)?)\b`, // 7 число
    String.raw`([A-Za-z_$][\w$-]*)(?==(?![=>]))`, // 8 атрибут перед «=»
    String.raw`([A-Za-z_$][\w$]*)`, // 9 имя (идентификатор)
    String.raw`([{}()[\];,.:?!&|+*=<>-])`, // 10 знак
  ].join('|'),
  'g',
);

const TYPES = ['comment', 'string', 'arrow', 'op', 'tag', 'keyword', 'number', 'attr', 'ident', 'punct'];

/** Разбивает строку кода на токены { type, value } */
export function tokenizeLine(line) {
  const tokens = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN)) {
    if (match.index > last) tokens.push({ type: 'plain', value: line.slice(last, match.index) });
    const groupIndex = match.slice(1).findIndex((group) => group !== undefined);
    tokens.push({ type: TYPES[groupIndex] ?? 'plain', value: match[0] });
    last = match.index + match[0].length;
  }
  if (last < line.length) tokens.push({ type: 'plain', value: line.slice(last) });
  return tokens;
}

/** Код → массив строк (без лишнего перевода строки в конце) */
export function splitLines(code) {
  return String(code).replace(/\n+$/, '').split('\n');
}
