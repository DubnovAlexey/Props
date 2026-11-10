// «Насест» Графа: где он сидит, что говорит и куда указывает.
// • Широкий экран: Граф летает вдоль страницы рядом с ключевым моментом
//   и сразу показывает облачко с главной мыслью.
// • Телефон: Граф сидит в углу. Реплики появляются ненадолго, а у ключевых
//   моментов он показывает рукой и значок «!» — текст открывается по нажатию,
//   чтобы облачко не закрывало кнопки на маленьком экране.
// • При смене раздела Граф превращается в летучую мышь и «перелетает».
import { useEffect, useLayoutEffect, useState } from 'react';
import Vampire from './Vampire.jsx';
import Bat from './Bat.jsx';
import { useMascotState } from './MascotContext.jsx';
import { useMediaQuery, useReducedMotion } from '../hooks/useMediaQuery.js';
import styles from './MascotDock.module.css';

const SPEECH_MS_PHONE = 4500;

export default function MascotDock({ routeKey }) {
  const { speech, focus, hidden } = useMascotState();
  const wide = useMediaQuery('(min-width: 1180px)');
  const reducedMotion = useReducedMotion();
  const [top, setTop] = useState(null);
  const [arriving, setArriving] = useState(false);
  const [speechOpen, setSpeechOpen] = useState(true);
  const [tipOpen, setTipOpen] = useState(false);

  // Смена раздела → короткий перелёт в облике мыши
  useEffect(() => {
    if (reducedMotion) return undefined;
    setArriving(true);
    const timer = setTimeout(() => setArriving(false), 900);
    return () => clearTimeout(timer);
  }, [routeKey, reducedMotion]);

  // Новая реплика → облачко; на телефоне оно само прячется
  useEffect(() => {
    setSpeechOpen(true);
    if (wide) return undefined;
    const timer = setTimeout(() => setSpeechOpen(false), SPEECH_MS_PHONE);
    return () => clearTimeout(timer);
  }, [speech.id, wide]);

  // Новый ключевой момент: на телефоне — только значок «!», текст по нажатию
  useEffect(() => {
    setTipOpen(false);
  }, [focus]);

  // Широкий экран: держимся на уровне ключевого момента при прокрутке
  useLayoutEffect(() => {
    if (!wide || !focus?.el) {
      setTop(null);
      return undefined;
    }
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Рука Графа примерно в 80px от верха картинки — совмещаем её с серединой блока
        const rect = focus.el.getBoundingClientRect();
        const desired = rect.top + rect.height / 2 - 80;
        setTop(Math.max(76, Math.min(window.innerHeight - 390, desired)));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [wide, focus]);

  if (hidden) return null;

  const pointing = Boolean(focus);
  const showTip = pointing && (wide || tipOpen);
  const text = showTip ? focus.text : speechOpen ? speech.text : '';
  const mood = pointing ? 'point' : speech.mood;
  const dockStyle = wide && top !== null ? { top: `${top}px` } : undefined;

  function toggle() {
    if (pointing && !wide) setTipOpen((open) => !open);
    else setSpeechOpen((open) => !open);
  }

  function close() {
    if (showTip) setTipOpen(false);
    else setSpeechOpen(false);
  }

  return (
    <aside className={`${styles.dock} ${wide ? styles.wide : styles.corner}`} style={dockStyle} aria-label="Граф Пропсула">
      {text && (
        <div className={`${styles.bubble} ${showTip ? styles.bubblePoint : ''}`} role="status" key={showTip ? text : speech.id}>
          {/* На телефоне облачко — плашка под шапкой, поэтому рядом мини-портрет Графа */}
          {!wide && (
            <span className={styles.bubbleFace} aria-hidden="true">
              <Vampire mood={mood} size={34} />
            </span>
          )}
          <div className={styles.bubbleText}>
            {showTip && <span className={styles.bubbleLabel}>Граф указывает:</span>}
            <p>{text}</p>
          </div>
          <button type="button" className={styles.close} onClick={close} aria-label="Скрыть реплику">
            ×
          </button>
        </div>
      )}

      <button
        type="button"
        className={styles.avatar}
        onClick={toggle}
        aria-label={pointing ? 'Граф указывает на важное: показать подсказку' : 'Граф Пропсула: показать или скрыть реплику'}
      >
        {arriving ? (
          <span className={styles.arriving}>
            <Bat size={wide ? 70 : 48} />
          </span>
        ) : (
          <span className={styles.appear}>
            <Vampire mood={mood} size={wide ? 150 : 52} />
          </span>
        )}
        {pointing && !wide && !tipOpen && (
          <span className={styles.badge} aria-hidden="true">
            !
          </span>
        )}
      </button>
    </aside>
  );
}
