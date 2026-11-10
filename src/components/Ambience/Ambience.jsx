// Антураж пещеры за всем содержимым: своды со сталактитами, факелы по краям,
// капли воды, туман у пола, плывущие искры и чьи-то глаза в темноте.
// Слой фиксирован, не ловит клики и прячет движение, если пользователь
// попросил меньше анимаций (prefers-reduced-motion).
// Ощущение лёгкой угрозы держит внимание — но фон остаётся тёмным и спокойным,
// чтобы не мешать читать.
import styles from './Ambience.module.css';

const STALACTITES =
  'M0 0 H1440 V18 L1424 30 L1410 20 L1392 58 L1376 22 L1350 34 L1332 18 L1310 72 L1292 24 L1270 30 L1252 16 L1236 46 L1220 20 L1190 28 L1172 14 L1150 64 L1130 22 L1104 30 L1086 16 L1066 40 L1048 18 L1020 26 L1002 12 L980 80 L960 20 L936 28 L918 14 L900 44 L882 18 L856 24 L838 12 L816 58 L796 22 L770 30 L752 14 L734 38 L716 18 L690 26 L672 12 L652 70 L632 20 L606 28 L588 14 L570 42 L552 16 L526 24 L508 12 L486 62 L466 20 L440 28 L422 14 L404 36 L386 18 L360 26 L342 12 L320 74 L300 20 L274 28 L256 14 L238 40 L220 16 L194 24 L176 12 L154 56 L134 20 L108 28 L90 14 L72 38 L54 18 L28 26 L12 14 L0 22 Z';

const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i * 1.7) % 12}s`,
  duration: `${14 + (i % 5) * 3}s`,
  size: 2 + (i % 3),
}));

export default function Ambience() {
  return (
    <div className={styles.ambience} aria-hidden="true">
      <div className={styles.depth} />
      <div className={`${styles.torch} ${styles.torchLeft}`} />
      <div className={`${styles.torch} ${styles.torchRight}`} />

      <svg className={styles.ceiling} viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path d={STALACTITES} />
      </svg>
      <span className={`${styles.drop} ${styles.drop1}`} />
      <span className={`${styles.drop} ${styles.drop2}`} />
      <span className={`${styles.drop} ${styles.drop3}`} />

      <div className={`${styles.wall} ${styles.wallLeft}`} />
      <div className={`${styles.wall} ${styles.wallRight}`} />

      {/* глаза в темноте: моргают редко и в разное время */}
      <span className={`${styles.eyes} ${styles.eyes1}`}>
        <i />
        <i />
      </span>
      <span className={`${styles.eyes} ${styles.eyes2}`}>
        <i />
        <i />
      </span>

      {EMBERS.map((ember) => (
        <span
          key={ember.left}
          className={styles.ember}
          style={{
            left: ember.left,
            width: ember.size,
            height: ember.size,
            animationDelay: ember.delay,
            animationDuration: ember.duration,
          }}
        />
      ))}

      <div className={`${styles.mist} ${styles.mist1}`} />
      <div className={`${styles.mist} ${styles.mist2}`} />
      <div className={styles.vignette} />
    </div>
  );
}
