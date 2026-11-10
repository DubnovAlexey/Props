// Разбор примера: «Почему так» · «Как ещё можно» · «Как нельзя».
// Вкладки, а не всё сразу: порция за порцией легче усваивается.
// Неправильные варианты показываем рядом с правильными — контраст
// помогает понять границы правила, а не заучить один шаблон.
import { useState } from 'react';
import { RichBlocks, RichText } from '../RichText/RichText.jsx';
import CodeBlock from '../CodeBlock/CodeBlock.jsx';
import styles from './SyntaxExplain.module.css';

export default function SyntaxExplain({ why, alt = [], wrong = [] }) {
  const tabs = [
    why && { id: 'why', label: 'Почему так' },
    alt.length > 0 && { id: 'alt', label: `Как ещё можно · ${alt.length}` },
    wrong.length > 0 && { id: 'wrong', label: `Как нельзя · ${wrong.length}` },
  ].filter(Boolean);
  const [tab, setTab] = useState(tabs[0]?.id);
  if (tabs.length === 0) return null;

  return (
    <section className={styles.box} aria-label="Разбор примера">
      <div className={styles.tabs} role="tablist">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`${styles.tab} ${styles[`tab_${item.id}`]} ${tab === item.id ? styles.active : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.id === 'why' ? '💡' : item.id === 'alt' ? '✓' : '✗'} {item.label}
          </button>
        ))}
      </div>

      {tab === 'why' && (
        <div className={styles.panel} role="tabpanel">
          <RichBlocks lines={[].concat(why)} />
        </div>
      )}

      {tab === 'alt' && (
        <div className={styles.panel} role="tabpanel">
          {alt.map((item, i) => (
            <div key={i} className={styles.variant}>
              <span className={styles.okLabel}>✓ Тоже работает</span>
              <CodeBlock code={item.code} anatomy />
              <p>
                <RichText text={item.note} />
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === 'wrong' && (
        <div className={styles.panel} role="tabpanel">
          {wrong.map((item, i) => (
            <div key={i} className={`${styles.variant} ${styles.bad}`}>
              <span className={styles.badLabel}>✗ Так нельзя</span>
              <CodeBlock code={item.code} anatomy />
              <p>
                <b>Почему: </b>
                <RichText text={item.why} />
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
