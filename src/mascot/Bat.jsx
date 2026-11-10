// Летучая мышь-вампир (зовут Лунатик) — помощник Графа.
// Крылья — перепонки на костях-пальцах, глаза горят, клыки торчат.
// Цвета берутся из CSS-переменных, поэтому мышь подстраивается под тему.
import styles from './Bat.module.css';

export default function Bat({ size = 48, flapping = true, className = '', label }) {
  return (
    <svg
      className={`${styles.bat} ${flapping ? styles.flapping : ''} ${className}`}
      viewBox="0 0 64 40"
      width={size}
      height={(size * 40) / 64}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <g className={styles.wingLeft}>
        <path d="M30 18 C24 6 12 3 1 8 L5 13 L3 19 L9 18 L9 25 L15 21 L18 27 L22 22 L26 26 L30 23 Z" />
        <path className={styles.bone} d="M30 18 L4 9 M28 19 L5 13 M27 20 L9 18 M27 21 L15 21 M28 22 L22 22" />
      </g>
      <g className={styles.wingRight}>
        <path d="M34 18 C40 6 52 3 63 8 L59 13 L61 19 L55 18 L55 25 L49 21 L46 27 L42 22 L38 26 L34 23 Z" />
        <path className={styles.bone} d="M34 18 L60 9 M36 19 L59 13 M37 20 L55 18 M37 21 L49 21 M36 22 L42 22" />
      </g>
      <ellipse className={styles.fur} cx="32" cy="23" rx="5.5" ry="8" />
      <circle className={styles.fur} cx="32" cy="14" r="5.5" />
      {/* высокие острые уши */}
      <path className={styles.fur} d="M28 11 L26.5 2.5 L31 9.5 Z M36 11 L37.5 2.5 L33 9.5 Z" />
      {/* морда-«пятачок» и горящие глаза */}
      <path className={styles.snout} d="M30.4 15.4 Q32 13.8 33.6 15.4 Q32 16.8 30.4 15.4 Z" />
      <circle className={styles.eye} cx="29.6" cy="13" r="1.4" />
      <circle className={styles.eye} cx="34.4" cy="13" r="1.4" />
      <path d="M30.6 17.2 L31.3 20.4 L32 17.2 Z M32 17.2 L32.7 20.4 L33.4 17.2 Z" fill="#f4efe6" />
      {/* когти на сгибах крыльев */}
      <path className={styles.claw} d="M1 8 L-0.6 6.2 M63 8 L64.6 6.2" />
    </svg>
  );
}
