// Термин со всплывающим окном-пояснением.
// Компьютер: окно появляется при наведении мыши или фокусе с клавиатуры.
// Телефон: при нажатии; закрывается повторным нажатием, тапом мимо или прокруткой.
// Окно рисуется через портал (createPortal) прямо в <body>, чтобы его
// не обрезали родители с overflow: hidden.
// Место для окна считает placeTip (src/utils/placeTip.js): над термином, под ним или — если
// текст длинный, а экран маленький — с ограничением высоты и прокруткой внутри окна.
// Почему термин — <span role="button">, а не <button>: кнопка в строке текста —
// неразрывный блок. Она не переносится по словам (длинный термин вылезал бы
// за край карточки на телефоне), а точка или запятая после неё могла уехать
// на новую строку в одиночку. <span> ведёт себя как обычный текст, а «кнопочное»
// поведение добавляем сами: role, tabIndex и клавиши Enter / пробел.
import Spelling from '../Spelling/Spelling.jsx';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHoverCapable } from '../../hooks/useMediaQuery.js';
import styles from './Term.module.css';
import { to } from '../../app/useHashRoute.js';
import { placeTip } from '../../utils/placeTip.js';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';

/**
 * Свободная часть экрана: между шапкой и нижней панелью телефона.
 * Шапка и панель помечены атрибутом data-fixed; скрытая панель (на компьютере) имеет нулевую высоту.
 */
function freeArea() {
  const header = document.querySelector('[data-fixed="top"]')?.getBoundingClientRect();
  const tabbar = document.querySelector('[data-fixed="bottom"]')?.getBoundingClientRect();
  return {
    top: header?.height ? Math.max(0, header.bottom) : 0,
    bottom: tabbar?.height ? Math.min(window.innerHeight, tabbar.top) : window.innerHeight,
    // clientWidth — ширина без полосы прокрутки: окно не залезет под неё
    width: document.documentElement.clientWidth,
  };
}

export default function Term({ id, children }) {
  const { t } = useI18n();
  const entry = useContent().GLOSSARY_MAP[id];
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
    // Термин может переноситься на две строки — привязываем окно к первой
    const anchor = anchorRef.current.getClientRects()[0] ?? anchorRef.current.getBoundingClientRect();
    // Размер окна берём из offsetWidth / offsetHeight, а не из getBoundingClientRect: окно появляется
    // с анимацией и в первый миг уменьшено на 15%. getBoundingClientRect вернул бы уменьшенный размер,
    // и окно, выросши до настоящего, вылезало бы за правый край экрана (так и было на телефоне).
    const tip = { width: tipRef.current.offsetWidth, height: tipRef.current.offsetHeight };
    setPosition(placeTip(anchor, tip, freeArea()));
  }, [open]);

  // Закрытие: тап мимо, Escape, прокрутка, изменение размера окна
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!anchorRef.current?.contains(event.target) && !tipRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    // Прокрутка страницы закрывает окно. А прокрутка внутри самого окна (длинное пояснение) — нет
    const close = (event) => {
      if (event?.target instanceof Node && tipRef.current?.contains(event.target)) return;
      setOpen(false);
    };
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
  // Мышь: окно уже открыто наведением, клик его не закрывает. Палец: открыть / закрыть
  const handleClick = () => (hoverCapable ? show() : setOpen((value) => !value));
  // У <span> нет встроенной реакции на клавиши — повторяем поведение кнопки
  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault(); // пробел не должен прокручивать страницу
    handleClick();
  };

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        ref={anchorRef}
        className={`${styles.term} ${open ? styles.active : ''}`}
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={hoverCapable ? show : undefined}
        onMouseLeave={hoverCapable ? hideSoon : undefined}
        onFocus={(event) => event.currentTarget.matches(':focus-visible') && show()}
        onBlur={hideSoon}
      >
        {children ?? entry.label}
      </span>
      {open &&
        createPortal(
          <div
            ref={tipRef}
            id={tipId}
            role="tooltip"
            className={styles.tip}
            style={
              position ? { top: position.top, left: position.left, maxHeight: position.maxHeight ?? undefined } : { visibility: 'hidden' }
            }
            onMouseEnter={hoverCapable ? show : undefined}
            onMouseLeave={hoverCapable ? hideSoon : undefined}
          >
            <div className={styles.head}>
              <span aria-hidden="true">🦇</span>
              <strong>{entry.title}</strong>
            </div>
            <Spelling entry={entry} />
            <p>
              <b>{t('common.simple')} </b>
              {entry.simple}
            </p>
            {entry.tech && (
              <p className={styles.tech}>
                <b>{t('common.tech')} </b>
                {entry.tech}
              </p>
            )}
            <a className={styles.more} href={to.glossary(id)} onClick={() => setOpen(false)}>
              {t('term.open')}
            </a>
          </div>,
          document.body,
        )}
    </>
  );
}
