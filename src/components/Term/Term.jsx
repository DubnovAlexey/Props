// Термин со всплывающим окном-пояснением.
// Компьютер: окно появляется при наведении мыши или фокусе с клавиатуры.
// Телефон: при нажатии; закрывается повторным нажатием, тапом мимо или прокруткой.
// Окно рисуется через портал (createPortal) прямо в <body>, чтобы его
// не обрезали родители с overflow: hidden.
import Spelling from '../Spelling/Spelling.jsx';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GLOSSARY_MAP } from '../../content/glossary.js';
import { useHoverCapable } from '../../hooks/useMediaQuery.js';
import styles from './Term.module.css';
import { to } from '../../app/useHashRoute.js';

export default function Term({ id, children }) {
  const entry = GLOSSARY_MAP[id];
  const hoverCapable = useHoverCapable();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const anchorRef = useRef(null);
  const tipRef = useRef(null);
  const closeTimer = useRef(0);
  const tipId = useId();

  // Считаем позицию после отрисовки окна, но до того, как его увидит пользователь
  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    const anchor = anchorRef.current.getBoundingClientRect();
    const tip = tipRef.current.getBoundingClientRect();
    const gap = 8;
    let top = anchor.top - tip.height - gap;
    if (top < gap) top = anchor.bottom + gap; // сверху нет места — показываем снизу
    let left = anchor.left + anchor.width / 2 - tip.width / 2;
    left = Math.max(gap, Math.min(window.innerWidth - tip.width - gap, left));
    setPosition({ top, left });
  }, [open]);

  // Закрытие: тап мимо, Escape, прокрутка, изменение размера окна
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!anchorRef.current?.contains(event.target) && !tipRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    const close = () => setOpen(false);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, { passive: true, capture: true });
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, { capture: true });
      window.removeEventListener('resize', close);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  if (!entry) return children ?? id; // неизвестный термин — просто текст (тесты ловят такие опечатки)

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };

  return (
    <>
      <button
        type="button"
        ref={anchorRef}
        className={`${styles.term} ${open ? styles.active : ''}`}
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onClick={() => (hoverCapable ? show() : setOpen((value) => !value))}
        onMouseEnter={hoverCapable ? show : undefined}
        onMouseLeave={hoverCapable ? hideSoon : undefined}
        onFocus={(event) => event.currentTarget.matches(':focus-visible') && show()}
        onBlur={hideSoon}
      >
        {children ?? entry.label}
      </button>
      {open &&
        createPortal(
          <div
            ref={tipRef}
            id={tipId}
            role="tooltip"
            className={styles.tip}
            style={position ? { top: position.top, left: position.left } : { visibility: 'hidden' }}
            onMouseEnter={hoverCapable ? show : undefined}
            onMouseLeave={hoverCapable ? hideSoon : undefined}
          >
            <div className={styles.head}>
              <span aria-hidden="true">🦇</span>
              <strong>{entry.title}</strong>
            </div>
            <Spelling entry={entry} />
            <p>
              <b>Простыми словами: </b>
              {entry.simple}
            </p>
            {entry.tech && (
              <p className={styles.tech}>
                <b>Технически: </b>
                {entry.tech}
              </p>
            )}
            <a className={styles.more} href={to.glossary(id)} onClick={() => setOpen(false)}>
              Открыть в словаре →
            </a>
          </div>,
          document.body,
        )}
    </>
  );
}
