// Блок кода с подсветкой, номерами строк и режимами:
//  • обычный — показать код (highlight — номера важных строк);
//  • anatomy — кнопка «Разобрать синтаксис»: каждая часть кода
//    становится кликабельной, а под кодом — список конструкций с объяснениями;
//  • onLineClick — строки становятся кнопками (задание «Найди ошибку»);
//  • renderSlot — вместо ___ рисуются пропуски (задание «Собери код»).
import { useMemo, useState } from 'react';
import { splitLines, tokenizeLine } from '../../utils/highlight.js';
import { explainCode } from '../../utils/syntaxGuide.js';
import { to } from '../../app/useHashRoute.js';
import styles from './CodeBlock.module.css';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';

function Tokens({ tokens, picked, onPick }) {
  return tokens.map((token, i) => {
    if (token.type === 'plain' && !token.cid) return token.value;
    const classes = [styles[`tok_${token.type}`]];
    if (onPick && token.cid) {
      classes.push(styles.explainable);
      if (token.cid === picked) classes.push(styles.picked);
    }
    return (
      <span key={i} className={classes.join(' ')} onClick={onPick && token.cid ? () => onPick(token.cid) : undefined}>
        {token.value}
      </span>
    );
  });
}

function AnatomyPanel({ constructs, picked, onPick }) {
  const { t } = useI18n();
  const { GLOSSARY_MAP } = useContent();
  const current = constructs.find((item) => item.cid === picked);
  const term = current?.term ? GLOSSARY_MAP[current.term] : null;
  return (
    <div className={styles.anatomy}>
      {current ? (
        <div className={styles.current} role="status">
          <div className={styles.currentHead}>
            <code>{current.sample}</code>
            <b>{current.title}</b>
          </div>
          <p>{current.simple}</p>
          {current.why && (
            <p className={styles.why}>
              <b>{t('code.why')} </b>
              {current.why}
            </p>
          )}
          {term && (
            <a className={styles.termLink} href={to.glossary(term.id)}>
              {t('code.inGlossary', { title: term.title })}
            </a>
          )}
        </div>
      ) : (
        <p className={styles.hint}>{t('code.hint')}</p>
      )}
      <ol className={styles.list}>
        {constructs.map((item, i) => (
          <li key={item.cid}>
            <button type="button" className={item.cid === picked ? styles.on : undefined} onClick={() => onPick(item.cid)}>
              <span className={styles.num}>{i + 1}</span>
              <code>{item.sample}</code>
              <span>{item.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function CodeBlock({
  code,
  title,
  highlight = [],
  onLineClick,
  lineStatus = {},
  renderSlot,
  disabled = false,
  anatomy = false,
}) {
  const { t } = useI18n();
  const { SYNTAX_GUIDE } = useContent();
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState(null);
  const canExplain = anatomy && !onLineClick && !renderSlot;
  const explained = useMemo(() => (open ? explainCode(code, SYNTAX_GUIDE) : null), [open, code, SYNTAX_GUIDE]);
  const lines = explained ? explained.lines : splitLines(code).map(tokenizeLine);
  const onPick = explained ? setPicked : null;
  let slotCounter = 0;

  function toggle() {
    setOpen((value) => !value);
    setPicked(null);
  }

  return (
    <figure className={`${styles.figure} ${open ? styles.opened : ''}`}>
      {(title || canExplain) && (
        <figcaption className={styles.title}>
          <span>{title ?? t('common.code')}</span>
          {canExplain && (
            <button type="button" className={styles.toggle} onClick={toggle} aria-expanded={open}>
              {open ? t('code.hide') : t('code.explain')}
            </button>
          )}
        </figcaption>
      )}
      <pre className={styles.pre}>
        <code className={styles.code}>
          {lines.map((tokens, index) => {
            const number = index + 1;
            const line = tokens.map((token) => token.value).join('');
            const className = [
              styles.line,
              highlight.includes(number) ? styles.highlighted : '',
              lineStatus[number] ? styles[lineStatus[number]] : '',
              onLineClick ? styles.clickable : '',
            ].join(' ');

            // Пропуски ___ превращаем в слоты
            const content = renderSlot ? (
              line
                .split('___')
                .flatMap((part, partIndex) =>
                  partIndex === 0
                    ? [<Tokens key={`t${partIndex}`} tokens={tokenizeLine(part)} />]
                    : [
                        <span key={`s${partIndex}`}>{renderSlot(slotCounter++)}</span>,
                        <Tokens key={`t${partIndex}`} tokens={tokenizeLine(part)} />,
                      ],
                )
            ) : (
              <Tokens tokens={tokens} picked={picked} onPick={onPick} />
            );

            const inner = (
              <>
                <span className={styles.lineNo} aria-hidden="true">
                  {number}
                </span>
                <span className={styles.text}>{content}</span>
              </>
            );

            return onLineClick ? (
              <button
                type="button"
                key={number}
                className={className}
                onClick={() => onLineClick(number)}
                disabled={disabled}
                aria-label={t('code.line', { n: number, text: line.trim() || t('code.emptyLine') })}
              >
                {inner}
              </button>
            ) : (
              <span key={number} className={className}>
                {inner}
              </span>
            );
          })}
        </code>
      </pre>
      {explained && <AnatomyPanel constructs={explained.constructs} picked={picked} onPick={setPicked} />}
    </figure>
  );
}
