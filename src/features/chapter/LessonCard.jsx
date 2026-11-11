// Одна карточка урока. Порции по 3–5 мыслей — столько рабочая память
// удерживает без перегрузки (приём «разбиение на кусочки»).
// Порядок блоков: мысль → схема → код с анатомией → разбор «почему / как ещё /
// как нельзя» → аналогия → ключевой момент. От простого к сложному.
import { RichBlocks, RichText } from '../../components/RichText/RichText.jsx';
import CodeBlock from '../../components/CodeBlock/CodeBlock.jsx';
import KeyPoint from '../../components/KeyPoint/KeyPoint.jsx';
import Diagram from '../../components/Diagram/Diagram.jsx';
import Scheme from '../../components/Scheme/Scheme.jsx';
import SyntaxExplain from '../../components/SyntaxExplain/SyntaxExplain.jsx';
import { sameWord, termIdsIn } from '../../utils/richText.js';
import styles from './Chapter.module.css';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';

/** Термины карточки с настоящими написаниями: «пропсы → props» */
function TermStrip({ card }) {
  const { t } = useI18n();
  const { GLOSSARY_MAP } = useContent();
  const texts = [...(card.body ?? []), ...(card.after ?? []), card.key ?? '', card.analogy ?? ''];
  const ids = [...new Set(texts.flatMap((text) => termIdsIn(text)))];
  // Показываем термин, только если есть что добавить к его названию: английское написание или запись в коде.
  // В английской игре название и написание часто совпадают («React», «Vite») — такие строки не нужны.
  const entries = ids.map((id) => GLOSSARY_MAP[id]).filter((entry) => (entry?.en && !sameWord(entry.en, entry.title)) || entry?.code);
  if (entries.length === 0) return null;
  return (
    <div className={styles.termStrip}>
      <span className={styles.termStripTitle}>
        <span aria-hidden="true">🔤</span> {t('lesson.spelling')}
      </span>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <span className={styles.termRu}>{entry.title}</span>
            {entry.en && !sameWord(entry.en, entry.title) && (
              <>
                <span aria-hidden="true"> → </span>
                <span lang="en">{entry.en}</span>
              </>
            )}
            {entry.code && entry.code !== entry.en && <code>{entry.code}</code>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Глубина карточки по её месту в уроке: основа → глубже → тонкости */
function depthOf(index, total) {
  const position = (index + 1) / total;
  if (position <= 0.4) return { labelKey: 'lesson.stageBase', icon: '🌱' };
  if (position <= 0.8) return { labelKey: 'lesson.stageDeeper', icon: '🔍' };
  return { labelKey: 'lesson.stageNuance', icon: '🦇' };
}

export default function LessonCard({ card, index, total }) {
  const { t } = useI18n();
  const depth = depthOf(index, total);
  return (
    <article className={`card ${styles.lessonCard}`}>
      <div className={styles.cardMeta}>
        <span className="eyebrow">{t('lesson.card', { n: index + 1, total })}</span>
        <span className={styles.depth}>
          <span aria-hidden="true">{depth.icon}</span> {t(depth.labelKey)}
        </span>
      </div>
      <h2>{card.title}</h2>
      <RichBlocks lines={card.body} />
      <TermStrip card={card} />
      {card.diagram && <Diagram name={card.diagram} caption={card.diagramCaption} />}
      {card.scheme && <Scheme scheme={card.scheme} />}
      {card.code && <CodeBlock code={card.code} title={card.codeTitle ?? t('common.example')} highlight={card.highlight} anatomy />}
      {(card.why || card.alt || card.wrong) && <SyntaxExplain why={card.why} alt={card.alt} wrong={card.wrong} />}
      {card.after && <RichBlocks lines={card.after} />}
      {card.analogy && (
        <p className={styles.analogy}>
          <span aria-hidden="true">🦇</span>{' '}
          <span>
            <b>{t('lesson.analogy')}</b> <RichText text={card.analogy} />
          </span>
        </p>
      )}
      {card.key && <KeyPoint text={card.key} />}
    </article>
  );
}
