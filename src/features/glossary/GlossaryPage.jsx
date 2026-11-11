// Словарь Графа: все термины игры простыми словами и технически.
// Поиск фильтрует список на лету — это «вычисляемое значение»:
// отфильтрованный список не хранится в состоянии, а считается при рендере.
import Spelling from '../../components/Spelling/Spelling.jsx';
import { useEffect, useMemo, useState } from 'react';
import { useMascot } from '../../mascot/MascotContext.jsx';

import CodeBlock from '../../components/CodeBlock/CodeBlock.jsx';
import styles from './Glossary.module.css';
import { to } from '../../app/useHashRoute.js';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';
import { scrollToElement } from '../../utils/scroll.js';

export default function GlossaryPage({ focusId }) {
  const { t, lang } = useI18n();
  const { GLOSSARY, GLOSSARY_MAP } = useContent();
  // По алфавиту языка игрока. useMemo: сортировать 117 терминов при каждом нажатии клавиши незачем
  const sorted = useMemo(() => [...GLOSSARY].sort((a, b) => a.title.localeCompare(b.title, lang)), [GLOSSARY, lang]);
  const [query, setQuery] = useState('');
  const { say } = useMascot();

  useEffect(() => {
    say(t('mascot.route.glossary'), 'talk');
  }, [say, t]);

  useEffect(() => {
    if (!focusId) return;
    setQuery('');
    // ждём следующий кадр, чтобы список успел отрисоваться
    requestAnimationFrame(() => {
      scrollToElement(document.getElementById(`term-${focusId}`), 'center');
    });
  }, [focusId]);

  const needle = query.trim().toLowerCase();
  const list = needle
    ? sorted.filter((entry) =>
        [entry.title, entry.simple, entry.tech ?? '', entry.en ?? '', entry.code ?? ''].join(' ').toLowerCase().includes(needle),
      )
    : sorted;

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">{t('glossary.eyebrow')}</span>
        <BloodTitle>{t('glossary.title')}</BloodTitle>
        <p className="muted">{t('glossary.intro', { terms: t('glossary.terms', { count: GLOSSARY.length }) })}</p>
      </div>

      <label className="visually-hidden" htmlFor="glossary-search">
        {t('glossary.searchLabel')}
      </label>
      <input
        id="glossary-search"
        className="input"
        type="search"
        placeholder={t('glossary.searchPlaceholder')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {list.length === 0 && <p className="muted">{t('glossary.empty')}</p>}

      <div className={styles.list}>
        {list.map((entry) => (
          <article key={entry.id} id={`term-${entry.id}`} className={`card ${styles.entry} ${entry.id === focusId ? styles.focused : ''}`}>
            <h2 className={styles.title}>{entry.title}</h2>
            <Spelling entry={entry} />
            <p>
              <b>{t('common.simple')}</b> {entry.simple}
            </p>
            {entry.tech && (
              <p className="muted">
                <b>{t('common.tech')}</b> {entry.tech}
              </p>
            )}
            {entry.example && <CodeBlock code={entry.example} anatomy />}
            {entry.related?.length > 0 && (
              <div className="row small">
                <span className="muted">{t('glossary.related')}</span>
                {entry.related.map((id) => (
                  <a key={id} className="chip" href={to.glossary(id)}>
                    {GLOSSARY_MAP[id]?.label ?? id}
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
