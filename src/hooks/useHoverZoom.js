// Портрет под мышью вырастает по-настоящему: хозяин пещеры (и Граф в бестиарии) примерно в 2,5 раза,
// целиком, поверх соседей и в пределах окна. Растёт из своего места и туда же уходит.
// Правило владельца (14.11.2026): картинки стоят в небольших окошках — при наведении они должны серьёзно
// увеличиваться, чтобы их можно было рассмотреть, а не «чуть-чуть дёргаться».
//
// Какие картинки растут, решает сам рисунок: проп zoom у <Guardian> и <Vampire> ставит на <svg> атрибут
// data-zoom. Хук включается один раз в App и слушает весь документ — портреты появляются и исчезают
// вместе со страницами, а слушатель один.
//
// Почему копия, а не сам портрет: портреты стоят в карточках с overflow: hidden и в кольцах карты пещер —
// выросший на месте портрет обрезался бы. Копия — тот же живой рисунок (cloneNode): глаза горят, хозяин
// дышит. Она не ловит мышь, поэтому щелчок по портрету делает то же, что раньше (ведёт в пещеру, бестиарий…).
// Только для настоящей мыши: у пальца нет наведения, на телефоне всё как было.
// «Уменьшить движение»: крупный портрет появляется сразу, без анимации.
import { useEffect } from 'react';
import { peekBox } from '../utils/peekBox.js';

const PICTURES = '[data-zoom]';
const DELAY = 140; // мышь просто пролетела мимо — не мигаем

export function useHoverZoom() {
  useEffect(() => {
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = null; // { picture, peek, from }
    let pending = null; // портрет, над которым мышь, пока идёт задержка
    let timer = 0;

    function close(instant) {
      clearTimeout(timer);
      pending = null;
      if (!current) return;
      const { peek, from } = current;
      current = null;
      if (instant || still.matches) {
        peek.remove();
        return;
      }
      peek.style.transform = from; // уходит туда же, откуда выросла
      peek.style.opacity = '0';
      peek.addEventListener('transitionend', () => peek.remove(), { once: true });
      setTimeout(() => peek.remove(), 400); // на случай, если анимация не дошла
    }

    function open(picture) {
      if (current?.picture === picture) return;
      close(true);
      if (!picture.isConnected) return;
      const rect = picture.getBoundingClientRect();
      if (rect.width < 24) return;
      const box = peekBox(rect, rect.width / rect.height, { width: window.innerWidth, height: window.innerHeight });
      const peek = document.createElement('div');
      peek.className = 'zoom-peek';
      peek.setAttribute('aria-hidden', 'true');
      Object.assign(peek.style, {
        left: `${box.left}px`,
        top: `${box.top}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
      });
      // Копия рисунка: градиенты она берёт у оригинала по тем же id, поэтому оригинал остаётся на месте
      const copy = picture.cloneNode(true);
      copy.removeAttribute('data-zoom');
      copy.removeAttribute('role');
      copy.removeAttribute('aria-label');
      copy.setAttribute('aria-hidden', 'true');
      copy.setAttribute('width', '100%');
      copy.setAttribute('height', '100%');
      peek.append(copy);
      // Растёт из своего места: старт — там, где стоит маленький портрет
      const from = `translate(${rect.left - box.left}px, ${rect.top - box.top}px) scale(${rect.width / box.width}, ${rect.height / box.height})`;
      if (!still.matches) {
        peek.style.transform = from;
        peek.style.opacity = '0.4';
      }
      document.body.append(peek);
      current = { picture, peek, from };
      if (!still.matches) {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            peek.style.transform = 'none';
            peek.style.opacity = '1';
          }),
        );
      }
    }

    // Внутри рисунка мышь всё время переходит с одной его части на другую — задержка от этого не начинается заново
    const onOver = (event) => {
      if (!mouse.matches || event.pointerType !== 'mouse') return;
      const picture = event.target.closest?.(PICTURES);
      if (!picture || picture === pending || current?.picture === picture) return;
      clearTimeout(timer);
      pending = picture;
      timer = setTimeout(() => {
        pending = null;
        open(picture);
      }, DELAY);
    };
    const onOut = (event) => {
      const picture = event.target.closest?.(PICTURES);
      if (!picture || picture.contains(event.relatedTarget)) return;
      if (pending === picture) {
        clearTimeout(timer);
        pending = null;
      }
      if (current?.picture === picture) close(false);
    };
    const closeNow = () => close(true);
    const onKey = (event) => {
      if (event.key === 'Escape') close(true);
    };

    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    document.addEventListener('click', closeNow, true); // щелчок ведёт дальше — копия не мешает
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', closeNow, { passive: true });
    window.addEventListener('resize', closeNow);
    window.addEventListener('hashchange', closeNow); // другая страница — старого портрета уже нет
    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('click', closeNow, true);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', closeNow);
      window.removeEventListener('resize', closeNow);
      window.removeEventListener('hashchange', closeNow);
      close(true);
    };
  }, []);
}
