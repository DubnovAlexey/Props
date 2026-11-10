// Летучая мышь-вампир (зовут Лунатик) — помощник Графа.
// Крылья — рваные перепонки на костях-пальцах, уши торчком, глаза-щели горят,
// пасть оскалена, на клыке — капля крови.
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
      {/* Крыло: перепонка с прорехами (fillRule="evenodd" вырезает дырки), тень у тела, кости, коготь на сгибе */}
      <g className={styles.wingLeft}>
        <path
          className={styles.membrane}
          fillRule="evenodd"
          d="M29.6 17 C24.5 11 19 8.2 14 8 L1 12.4 Q6.2 15.8 6.6 23.2 Q11.6 21.6 15.2 27.6 Q21.4 22.6 29.2 26.6 Z M9.2 15.4 L10.8 18.2 L8.4 17.4 Z M18.4 20.2 L20.2 23.2 L17.4 22.4 Z"
        />
        <path className={styles.shade} d="M29.6 17 C26.2 13 23 10.8 20 9.8 L21.4 24.6 Q25 23.4 29.2 26.6 Z" />
        <path
          className={styles.bone}
          d="M29.6 17 C24.5 11 19 8.2 14 8 M14 8 L1 12.4 M14 8 L6.6 23.2 M14 8 L15.2 27.6 M21.6 11.4 L22.8 24"
        />
        <path className={styles.claw} d="M14 8 L13 5.8" />
      </g>
      <g className={styles.wingRight}>
        <path
          className={styles.membrane}
          fillRule="evenodd"
          d="M34.4 17 C39.5 11 45 8.2 50 8 L63 12.4 Q57.8 15.8 57.4 23.2 Q52.4 21.6 48.8 27.6 Q42.6 22.6 34.8 26.6 Z M54.8 15.4 L53.2 18.2 L55.6 17.4 Z M45.6 20.2 L43.8 23.2 L46.6 22.4 Z"
        />
        <path className={styles.shade} d="M34.4 17 C37.8 13 41 10.8 44 9.8 L42.6 24.6 Q39 23.4 34.8 26.6 Z" />
        <path
          className={styles.bone}
          d="M34.4 17 C39.5 11 45 8.2 50 8 M50 8 L63 12.4 M50 8 L57.4 23.2 M50 8 L48.8 27.6 M42.4 11.4 L41.2 24"
        />
        <path className={styles.claw} d="M50 8 L51 5.8" />
      </g>

      {/* Тело в клочьях шерсти */}
      <path
        className={styles.fur}
        d="M32 15 C35.6 15 37 19 36.6 23.6 C36.2 27.4 34.6 30.4 32 31.6 C29.4 30.4 27.8 27.4 27.4 23.6 C27 19 28.4 15 32 15 Z"
      />
      <path className={styles.fur} d="M29.2 28.4 L30.1 33 L31.1 29.8 L32 34 L32.9 29.8 L33.9 33 L34.8 28.4 Z" />
      <path className={styles.chest} d="M32 19.6 C33.7 21.6 33.9 25 32 27.8 C30.1 25 30.3 21.6 32 19.6 Z" />

      {/* Голова: высокие острые уши, нахмуренные брови */}
      <circle className={styles.fur} cx="32" cy="13.4" r="5.2" />
      <path className={styles.fur} d="M27.6 12 L25 1.6 L31.2 8.8 Z M36.4 12 L39 1.6 L32.8 8.8 Z" />
      <path className={styles.earInner} d="M28 10.4 L26.5 4.8 L29.9 8.8 Z M36 10.4 L37.5 4.8 L34.1 8.8 Z" />
      <path className={styles.brow} d="M28 10.8 L31 12.3 M36 10.8 L33 12.3" />

      {/* Глаза-щели горят; нос-листок; оскал с клыками, на клыке кровь */}
      <ellipse className={styles.eye} cx="29.7" cy="13.1" rx="1.5" ry="0.95" transform="rotate(18 29.7 13.1)" />
      <ellipse className={styles.eye} cx="34.3" cy="13.1" rx="1.5" ry="0.95" transform="rotate(-18 34.3 13.1)" />
      <path className={styles.snout} d="M31 15 L32 14 L33 15 L32 15.8 Z" />
      <path className={styles.mouth} d="M29.6 16.5 Q32 20.8 34.4 16.5 Q32 17.6 29.6 16.5 Z" />
      <path d="M30.2 16.9 L30.9 20.5 L31.6 17.3 Z M32.4 17.3 L33.1 20.5 L33.8 16.9 Z" fill="#f4efe6" />
      <path d="M30.65 19.4 L30.9 20.9 L31.15 19.4 Z" fill="#b3001d" />
    </svg>
  );
}
