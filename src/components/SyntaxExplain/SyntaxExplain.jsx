// Разбор примера: «Почему так» · «Как ещё можно» · «Как нельзя».
// Вкладки, а не всё сразу: порция за порцией легче усваивается.
// Неправильные варианты показываем рядом с правильными — контраст
// помогает понять границы правила, а не заучить один шаблон.
import { useState } from 'react';
import { RichBlocks, RichText } from '../RichText/RichText.jsx';
import CodeBlock from '../CodeBlock/CodeBlock.jsx';
import styles from './SyntaxExplain.module.css';
import { useI18n } from '../../i18n/I18nContext.jsx';

export default function SyntaxExplain({ why, alt = [], wrong = [] }) {
  const { t } = useI18n();
  const tabs = [
    why && { id: 'why', label: t('syntax.why') },
    alt.length > 0 && { id: 'alt', label: t('syntax.alt', { count: alt.length }) },
    wrong.length > 0 && { id: 'wrong', label: t('syntax.wrong', { count: wrong.length }) },
  ].filter(Boolean);
  const [tab, setTab] = useState(tabs[0]?.id);
  if (tabs.length === 0) return null;

  return (
    <section className={styles.box} aria-label={t('syntax.label')}>
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
              <span className={styles.okLabel}>{t('syntax.works')}</span>
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
              <span className={styles.badLabel}>{t('syntax.bad')}</span>
              <CodeBlock code={item.code} anatomy />
              <p>
                <b>{t('syntax.because')} </b>
                <RichText text={item.why} />
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
