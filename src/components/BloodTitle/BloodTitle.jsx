// Заголовок «в крови»: буквы стоят неровно, будто выцарапаны когтем, нижняя кромка
// у них кровавая, а с нескольких букв свисают потёки и капельки — изредка капля срывается.
// Крови в меру: она украшает заголовок и не спорит с содержимым страницы.
// Как это устроено:
//  1. Текст заголовка остаётся обычным текстом — его читают и люди, и экранные читалки.
//     Каждая буква обёрнута в свой <span>, чтобы её можно было чуть повернуть и сдвинуть
//     (letterJitter). Слово — неразрывный блок: строка переносится только по пробелам.
//  2. После отрисовки (useLayoutEffect) измеряем, где на экране стоят буквы:
//     Range.getBoundingClientRect() отдаёт прямоугольник любого символа.
//  3. Выбираем несколько букв — для одного и того же текста всегда одни и те же,
//     чтобы потёки не «прыгали» при каждой перерисовке, — и рисуем под ними
//     маленькие SVG-потёки поверх заголовка.
//  4. Изменилась ширина (поворот телефона, перенос строки) или догрузился шрифт —
//     измеряем заново (ResizeObserver и document.fonts).
// Потёки — украшение: aria-hidden, клики сквозь них проходят.
//   as — какой тег рисовать ('h1' по умолчанию, можно 'h2'); остальные пропсы уходят в тег.
import { Children, cloneElement, isValidElement, useLayoutEffect, useRef, useState } from 'react';
import { letterJitter, pickDripLetters } from '../../utils/bloodDrips.js';
import styles from './BloodTitle.module.css';

// «Обычное слово»: только буквы, цифры и знаки препинания. Всё остальное (эмодзи, значки)
// на буквы не режем: эмодзи часто состоит из нескольких символов и развалился бы.
const PLAIN_WORD = /^[\p{L}\p{M}\p{N}\p{P}]+$/u;
// «Буква целиком»: сам символ и приставшие к нему знаки (ударение, огласовки в иврите)
const GRAPHEME = /\P{M}\p{M}*/gu;

/** Текст → слова-блоки с «пляшущими» буквами. Пробелы и эмодзи остаются как есть */
function roughText(text, keyPrefix) {
  return text.split(/(\s+)/).map((token, position) => {
    if (!PLAIN_WORD.test(token)) return token;
    const chars = token.match(GRAPHEME) ?? [];
    const jitter = letterJitter(chars, `${token}${position}`);
    return (
      <span key={`${keyPrefix}${position}`} className={styles.word}>
        {chars.map((char, index) => {
          const move = jitter[index];
          if (!move) return char;
          return (
            <span
              key={index}
              className={styles.letter}
              style={{ transform: `translateY(${move.shift}em) rotate(${move.rotate}deg) scale(${move.scale})` }}
            >
              {char}
            </span>
          );
        })}
      </span>
    );
  });
}

/** Обходит содержимое заголовка: строки делает «неровными», вложенные теги (например, <span>) — тоже */
function roughen(children, keyPrefix = 'w') {
  return Children.map(children, (child, index) => {
    if (typeof child === 'string' || typeof child === 'number') return roughText(String(child), `${keyPrefix}${index}-`);
    if (isValidElement(child) && typeof child.type === 'string') {
      return cloneElement(child, undefined, roughen(child.props.children, `${keyPrefix}${index}-`));
    }
    return child;
  });
}

/** Насколько шрифт опускается ниже строки (для букв вроде «р» и «у»), в пикселях */
function fontDescent(style) {
  try {
    const context = document.createElement('canvas').getContext('2d');
    context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const descent = context.measureText('Hg').fontBoundingBoxDescent;
    if (Number.isFinite(descent)) return descent;
  } catch {
    // старый браузер не умеет мерить шрифт — возьмём прикидку ниже
  }
  return parseFloat(style.fontSize) * 0.24;
}

/** Все буквы заголовка по порядку: в каком текстовом узле и на каком месте каждая стоит */
function collectLetters(element) {
  const letters = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.parentElement.closest('[data-drips]')) continue;
    for (let index = 0; index < node.data.length; index += 1) {
      letters.push({ node, index, char: node.data[index] });
    }
  }
  return letters;
}

/** Измеряет буквы и возвращает потёки: где висит каждый и какой он длины */
function measureDrips(element) {
  const style = getComputedStyle(element);
  const fontSize = parseFloat(style.fontSize);
  const descent = fontDescent(style);
  const box = element.getBoundingClientRect();
  const letters = collectLetters(element);
  const chosen = pickDripLetters(letters.map((letter) => letter.char));
  const range = document.createRange();

  return chosen.flatMap(({ index, shift, length }) => {
    const { node, index: offset } = letters[index];
    range.setStart(node, offset);
    range.setEnd(node, offset + 1);
    const rect = range.getBoundingClientRect();
    if (!rect.width) return []; // буква не на экране (например, заголовок скрыт)
    // короткая капелька тоньше длинного потёка
    const width = Math.min(5, Math.max(2.6, fontSize * (length > 0.3 ? 0.11 : 0.085)));
    return [
      {
        key: `${index}`,
        left: Math.round((rect.left - box.left + rect.width * shift - width / 2) * 10) / 10,
        // верх потёка — на линии строки, чуть заходя в букву, чтобы не было щели
        top: Math.round((rect.bottom - box.top - descent - fontSize * 0.07) * 10) / 10,
        width: Math.round(width * 10) / 10,
        length: Math.round(Math.max(width * 1.8, fontSize * length) * 10) / 10,
        delay: Math.round((shift * 9 + index) % 7) + 2,
      },
    ];
  });
}

/**
 * Контур потёка — как у настоящей капли, стекающей с края. Сверху кровь чуть растекается
 * под буквой (на flare в каждую сторону), ниже собирается в тонкую «шейку»,
 * а внизу набухает круглой каплей. w — ширина капли, l — длина.
 */
function dripPath(w, l, flare) {
  const c = w / 2; // середина
  const neck = w * 0.17; // полуширина шейки
  const r = w / 2; // радиус капли
  return [
    `M${-flare} 0 H${w + flare}`,
    `C${w} ${l * 0.05} ${c + neck} ${l * 0.18} ${c + neck} ${l * 0.5}`,
    `C${c + neck} ${l * 0.74} ${w} ${l * 0.8} ${w} ${l - r}`,
    `A${r} ${r} 0 0 1 0 ${l - r}`,
    `C0 ${l * 0.8} ${c - neck} ${l * 0.74} ${c - neck} ${l * 0.5}`,
    `C${c - neck} ${l * 0.18} 0 ${l * 0.05} ${-flare} 0 Z`,
  ].join(' ');
}

export default function BloodTitle({ as: Tag = 'h1', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [drips, setDrips] = useState([]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || typeof element.getBoundingClientRect !== 'function') return undefined;

    const update = () => {
      const next = measureDrips(element);
      // Новый массив — только если потёки действительно сдвинулись: иначе получился бы
      // бесконечный круг «измерил → перерисовал → измерил»
      setDrips((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    document.fonts?.ready.then(update).catch(() => {});
    return () => observer.disconnect();
    // children в зависимостях: сменился текст заголовка — потёки ищем заново
  }, [children]);

  return (
    <Tag ref={ref} className={`${styles.title} ${className}`} {...rest}>
      <span className={styles.rough}>{roughen(children)}</span>
      <span className={styles.drips} data-drips aria-hidden="true">
        {drips.map((drip) => {
          const flare = drip.width * 0.5;
          const boxWidth = drip.width + flare * 2 + 2;
          return (
            <svg
              key={drip.key}
              className={styles.drip}
              style={{ left: drip.left - flare - 1, top: drip.top, width: boxWidth, height: drip.length + 2 }}
              viewBox={`${-flare - 1} 0 ${boxWidth} ${drip.length + 2}`}
            >
              {/* t-blood — общий градиент из GuardianDefs: сверху тонкая плёнка, к капле кровь густеет */}
              <path d={dripPath(drip.width, drip.length, flare)} className={styles.streak} fill="url(#t-blood)" />
              {/* влажный блик на капле */}
              <circle cx={drip.width * 0.34} cy={drip.length - drip.width * 0.58} r={drip.width * 0.13} className={styles.glint} />
              {/* капля, которая изредка срывается вниз */}
              <circle
                cx={drip.width / 2}
                cy={drip.length - drip.width * 0.4}
                r={drip.width * 0.34}
                className={styles.falling}
                style={{ animationDelay: `${drip.delay}s`, animationDuration: `${9 + drip.delay}s` }}
              />
            </svg>
          );
        })}
      </span>
    </Tag>
  );
}
