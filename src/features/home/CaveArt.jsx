// Вид изнутри пещеры наружу: каменная пасть со сталактитами,
// за ней — ночное небо и луна, у стены горит факел, с потолка капает вода.
// Чистая декорация, поэтому aria-hidden.
import { useId } from 'react';
import Bat from '../../mascot/Bat.jsx';
import styles from './CaveMap.module.css';

const OPENING = 'M42 162 C30 112 46 54 98 36 C142 22 184 46 192 98 C196 126 190 148 184 162 Z';
const STARS = [
  [72, 70, 0.9],
  [88, 52, 1.2],
  [112, 46, 0.8],
  [168, 92, 1],
  [176, 120, 0.7],
  [64, 108, 0.8],
  [100, 84, 0.6],
  [182, 70, 0.9],
];

export default function CaveArt() {
  const u = `c${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <div className={styles.art} aria-hidden="true">
      <svg viewBox="0 0 220 170" className={styles.caveArt}>
        <defs>
          <radialGradient id={`${u}sky`} cx="62%" cy="36%" r="70%">
            <stop offset="0" stopColor="#2b2452" />
            <stop offset="0.6" stopColor="#120f27" />
            <stop offset="1" stopColor="#06050e" />
          </radialGradient>
          <radialGradient id={`${u}moon`} cx="40%" cy="40%" r="60%">
            <stop offset="0" stopColor="#fff8dc" />
            <stop offset="0.7" stopColor="#e9dca8" />
            <stop offset="1" stopColor="#bfae76" />
          </radialGradient>
          <linearGradient id={`${u}rock`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2a2433" />
            <stop offset="0.5" stopColor="#17131d" />
            <stop offset="1" stopColor="#09070c" />
          </linearGradient>
          <radialGradient id={`${u}torch`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ffb85a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffb85a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* небо за пастью пещеры */}
        <path d={OPENING} fill={`url(#${u}sky)`} />
        {STARS.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} className={styles.star} cx={cx} cy={cy} r={r} fill="#f3eefc" />
        ))}
        <circle cx="146" cy="70" r="22" fill="#f6e9b4" opacity="0.25" filter="url(#g-blur)" />
        <circle className={styles.artMoon} cx="146" cy="70" r="17" fill={`url(#${u}moon)`} />
        <circle cx="140" cy="66" r="3" fill="#cdbd86" opacity="0.6" />
        <circle cx="152" cy="76" r="2.2" fill="#cdbd86" opacity="0.5" />
        <path d="M42 162 L70 128 L88 140 L112 116 L134 136 L156 122 L184 162 Z" fill="#0b0915" />

        {/* каменная рама: всё, кроме проёма */}
        <path fillRule="evenodd" d={`M0 0 H220 V170 H0 Z ${OPENING}`} fill={`url(#${u}rock)`} filter="url(#g-stone)" />
        {/* сталактиты и сталагмиты */}
        <path d="M72 46 L78 74 L86 42 Z M104 36 L108 58 L114 34 Z M132 30 L136 52 L142 32 Z M160 42 L163 64 L170 48 Z" fill="#141018" />
        <path d="M30 170 L40 138 L50 170 Z M184 170 L192 144 L200 170 Z M56 170 L62 152 L68 170 Z" fill="#141018" />
        <circle className={styles.drop} cx="108" cy="60" r="1.5" fill="#9fd8ff" />

        {/* факел на стене */}
        <circle cx="22" cy="86" r="30" fill={`url(#${u}torch)`} className={styles.torchGlow} />
        <path d="M18 120 L22 92 L27 92 L24 120 Z" fill="#3b2412" />
        <path
          className={styles.flame}
          d="M24 94 C14 86 18 74 23 66 C23 74 28 76 29 71 C34 79 33 89 24 94 Z"
          fill="#ffb43c"
          filter="url(#g-glow)"
        />
      </svg>
      <span className={styles.artBat1}>
        <Bat size={30} />
      </span>
      <span className={styles.artBat2}>
        <Bat size={22} />
      </span>
    </div>
  );
}
