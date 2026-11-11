// Ключевой момент урока. Когда блок появляется на экране, Граф
// подлетает к нему и указывает рукой (на телефоне — показывает облачко).
// Яркое выделение главного — «эффект изоляции» (фон Ресторфф):
// то, что выделяется на фоне остального, запоминается лучше.
import { useEffect, useRef } from 'react';
import Bat from '../../mascot/Bat.jsx';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { RichText } from '../RichText/RichText.jsx';
import { stripMarkup } from '../../utils/richText.js';
import { GLOSSARY_MAP } from '../../content/glossary.js';
import styles from './KeyPoint.module.css';
import { useI18n } from '../../i18n/I18nContext.jsx';

const labelFor = (id) => GLOSSARY_MAP[id]?.label ?? id;

export default function KeyPoint({ text, label }) {
  const { t } = useI18n();
  const ref = useRef(null);
  const { pointAt, release } = useMascot();

  useEffect(() => {
    const element = ref.current;
    const plain = stripMarkup(text, labelFor);
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? pointAt(element, plain) : release(element)), {
      threshold: 0.6,
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      release(element);
    };
  }, [text, pointAt, release]);

  return (
    <aside ref={ref} className={styles.key}>
      <div className={styles.label}>
        <Bat size={30} />
        <span>{label ?? t('keyPoint')}</span>
      </div>
      <p className={styles.text}>
        <RichText text={text} />
      </p>
    </aside>
  );
}
