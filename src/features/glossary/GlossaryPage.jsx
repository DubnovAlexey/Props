// Словарь Графа: все термины игры простыми словами и технически.
// Поиск фильтрует список на лету — это «вычисляемое значение»:
// отфильтрованный список не хранится в состоянии, а считается при рендере.
import Spelling from '../../components/Spelling/Spelling.jsx';
import { useEffect, useState } from 'react';
import { GLOSSARY, GLOSSARY_MAP } from '../../content/glossary.js';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { PHRASES } from '../../mascot/phrases.js';
import CodeBlock from '../../components/CodeBlock/CodeBlock.jsx';
import styles from './Glossary.module.css';
import { to } from '../../app/useHashRoute.js';

const SORTED = [...GLOSSARY].sort((a, b) => a.title.localeCompare(b.title, 'ru'));

export default function GlossaryPage({ focusId }) {
  const [query, setQuery] = useState('');
  const { say } = useMascot();

  useEffect(() => {
    say(PHRASES.route.glossary, 'talk');
  }, [say]);

  useEffect(() => {
    if (!focusId) return;
    setQuery('');
    // ждём следующий кадр, чтобы список успел отрисоваться
    requestAnimationFrame(() => {
      document.getElementById(`term-${focusId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [focusId]);

  const needle = query.trim().toLowerCase();
  const list = needle
    ? SORTED.filter((entry) =>
        [entry.title, entry.simple, entry.tech ?? '', entry.en ?? '', entry.code ?? ''].join(' ').toLowerCase().includes(needle),
      )
    : SORTED;

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Словарь</span>
        <h1>Словарь Графа</h1>
        <p className="muted">
          {GLOSSARY.length} терминов. Те же пояснения всплывают, если навести мышь или нажать на подчёркнутое слово в уроке.
        </p>
      </div>

      <label className="visually-hidden" htmlFor="glossary-search">
        Поиск термина
      </label>
      <input
        id="glossary-search"
        className="input"
        type="search"
        placeholder="Найти термин: например, children или состояние"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {list.length === 0 && <p className="muted">Ничего не нашлось. Попробуй другое слово.</p>}

      <div className={styles.list}>
        {list.map((entry) => (
          <article key={entry.id} id={`term-${entry.id}`} className={`card ${styles.entry} ${entry.id === focusId ? styles.focused : ''}`}>
            <h2 className={styles.title}>{entry.title}</h2>
            <Spelling entry={entry} />
            <p>
              <b>Простыми словами:</b> {entry.simple}
            </p>
            {entry.tech && (
              <p className="muted">
                <b>Технически:</b> {entry.tech}
              </p>
            )}
            {entry.example && <CodeBlock code={entry.example} anatomy />}
            {entry.related?.length > 0 && (
              <div className="row small">
                <span className="muted">См. также:</span>
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
