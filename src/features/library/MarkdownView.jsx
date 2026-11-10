// Маленький рендерер Markdown для «Свитков Графа».
// Понимает то, что есть в руководстве: заголовки ###, абзацы, списки,
// таблицы, цитаты, блоки кода, ссылки, **жирный**, *курсив*, `код`,
// а также директивы ::diagram имя и ::scheme имя.
// Своя реализация вместо библиотеки: несколько десятков строк, ноль зависимостей
// и полный контроль — блоки кода сразу получают «анатомию» синтаксиса.
import CodeBlock from '../../components/CodeBlock/CodeBlock.jsx';
import Diagram from '../../components/Diagram/Diagram.jsx';
import Scheme from '../../components/Scheme/Scheme.jsx';
import { LIBRARY_SCHEMES } from '../../content/library/schemes.js';
import styles from './Library.module.css';

const LIST = /^(-|\*|\d+\.)\s+/;
const BLOCK_START = /^(```|::|#{3,6}\s|\||>|(-|\*|\d+\.)\s)/;

/** Текст → список блоков */
export function parseBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith('```')) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1; // закрывающие ```
      blocks.push({ type: 'code', lang, code: code.join('\n') });
      continue;
    }
    if (line.startsWith('::')) {
      const [kind, name] = line.slice(2).trim().split(/\s+/);
      blocks.push({ type: kind, name });
      i += 1;
      continue;
    }
    const heading = line.match(/^(#{3,6})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      i += 1;
      continue;
    }
    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(lines[i]);
        i += 1;
      }
      const cells = rows
        .filter((row) => !/^\|\s*:?-{3,}/.test(row))
        .map((row) =>
          row
            .replace(/^\||\|$/g, '')
            .split('|')
            .map((cell) => cell.trim()),
        );
      blocks.push({ type: 'table', head: cells[0], rows: cells.slice(1) });
      continue;
    }
    if (line.startsWith('>')) {
      const quote = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quote.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ type: 'quote', text: quote.join(' ') });
      continue;
    }
    if (LIST.test(line)) {
      const ordered = /^\d+\./.test(line);
      const items = [];
      while (i < lines.length && LIST.test(lines[i])) {
        items.push(lines[i].replace(LIST, ''));
        i += 1;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i])) {
          items[items.length - 1] += ` ${lines[i].trim()}`;
          i += 1;
        }
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }
    if (/^-{3,}$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      i += 1;
      continue;
    }
    const paragraph = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i])) {
      paragraph.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: 'p', text: paragraph.join(' ') });
  }
  return blocks;
}

const INLINE = /(`[^`]+`)|(\*\*.+?\*\*)|(\[[^\]]+\]\([^)\s]+\))|(\*[^*\s][^*]*?\*)/g;

/** Строка с разметкой → элементы React */
export function Inline({ text }) {
  const out = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const [token] = match;
    const key = match.index;
    if (match[1]) out.push(<code key={key}>{token.slice(1, -1)}</code>);
    else if (match[2])
      out.push(
        <strong key={key}>
          <Inline text={token.slice(2, -2)} />
        </strong>,
      );
    else if (match[3]) {
      const [, label, href] = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      out.push(
        <a key={key} href={href} target="_blank" rel="noopener noreferrer">
          <Inline text={label} />
        </a>,
      );
    } else
      out.push(
        <em key={key}>
          <Inline text={token.slice(1, -1)} />
        </em>,
      );
    last = match.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const CODE_LANGS = new Set(['jsx', 'js', 'tsx', 'ts']);

export default function MarkdownView({ markdown }) {
  const blocks = parseBlocks(markdown);
  return (
    <div className={styles.markdown}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading': {
            const Tag = block.level === 3 ? 'h3' : 'h4';
            return (
              <Tag key={i}>
                <Inline text={block.text} />
              </Tag>
            );
          }
          case 'p':
            return (
              <p key={i}>
                <Inline text={block.text} />
              </p>
            );
          case 'list': {
            const Tag = block.ordered ? 'ol' : 'ul';
            return (
              <Tag key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>
                    <Inline text={item} />
                  </li>
                ))}
              </Tag>
            );
          }
          case 'quote':
            return (
              <blockquote key={i}>
                <Inline text={block.text} />
              </blockquote>
            );
          case 'table':
            return (
              <div key={i} className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      {block.head.map((cell, j) => (
                        <th key={j}>
                          <Inline text={cell} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, j) => (
                          <td key={j}>
                            <Inline text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'code':
            return (
              <CodeBlock
                key={i}
                code={block.code}
                title={block.lang ? block.lang.toUpperCase() : 'Код'}
                anatomy={CODE_LANGS.has(block.lang)}
              />
            );
          case 'diagram':
            return <Diagram key={i} name={block.name} />;
          case 'scheme':
            return LIBRARY_SCHEMES[block.name] ? <Scheme key={i} scheme={LIBRARY_SCHEMES[block.name]} /> : null;
          case 'hr':
            return <hr key={i} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
