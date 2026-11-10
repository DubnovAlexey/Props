// Отрисовка мини-разметки уроков: **жирный**, `код`, [[термин|подпись]].
// interactive={false} — термины без всплывающих окон (например, внутри
// кнопки варианта ответа: кнопку нельзя вкладывать в кнопку).
import Term from '../Term/Term.jsx';
import { groupBlocks, parseInline } from '../../utils/richText.js';
import { GLOSSARY_MAP } from '../../content/glossary.js';

export function RichText({ text, interactive = true }) {
  return parseInline(text).map((token, i) => {
    if (token.type === 'bold') return <strong key={i}>{token.value}</strong>;
    if (token.type === 'code') return <code key={i}>{token.value}</code>;
    if (token.type === 'term') {
      const label = token.label ?? GLOSSARY_MAP[token.id]?.label ?? token.id;
      return interactive ? (
        <Term key={i} id={token.id}>
          {label}
        </Term>
      ) : (
        <span key={i} className="term-plain">
          {label}
        </span>
      );
    }
    return token.value;
  });
}

/** Несколько абзацев и списков: строки с «- » становятся пунктами */
export function RichBlocks({ lines, interactive = true }) {
  return groupBlocks(lines).map((block, i) =>
    block.type === 'ul' ? (
      <ul key={i}>
        {block.items.map((item, j) => (
          <li key={j}>
            <RichText text={item} interactive={interactive} />
          </li>
        ))}
      </ul>
    ) : (
      <p key={i}>
        <RichText text={block.text} interactive={interactive} />
      </p>
    ),
  );
}
