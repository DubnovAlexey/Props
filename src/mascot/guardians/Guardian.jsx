// Портрет хозяина пещеры. Один компонент — восемнадцать чудищ:
// какого рисовать, решает проп id (это id пещеры).
//   size  — размер в пикселях;
//   mood  — 'idle' (дышит и сверлит взглядом) или 'defeated' (побеждён, тускнеет);
//   label — подпись для экранных читалок; без неё портрет декоративный.
// Свет падает снизу, как от факела: так лица выглядят страшнее,
// а сильная эмоция помогает запомнить тему (эмоциональная окраска).
import { useId } from 'react';
import { GUARDIANS } from './index.js';
import styles from './Guardian.module.css';

export default function Guardian({ id, size = 120, mood = 'idle', label, className = '' }) {
  // useId даёт уникальный id: градиенты разных портретов не перепутаются
  const uid = `g${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const entry = GUARDIANS[id];
  if (!entry) return null;
  const { Art, light } = entry;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`${styles.guardian} ${styles[mood] ?? ''} ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <radialGradient id={`${uid}bg`} cx="50%" cy="88%" r="80%">
          <stop offset="0" stopColor={light} stopOpacity="0.5" />
          <stop offset="0.42" stopColor="#0c0a10" />
          <stop offset="1" stopColor="#030205" />
        </radialGradient>
        {/* свет снизу: верх тонет во тьме, низ подсвечен цветом пещеры */}
        <linearGradient id={`${uid}top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${uid}rim`} cx="50%" cy="100%" r="65%">
          <stop offset="0" stopColor={light} stopOpacity="0.42" />
          <stop offset="1" stopColor={light} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}vig`} cx="50%" cy="50%" r="50%">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.7" />
        </radialGradient>
        <linearGradient id={`${uid}fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.72" stopColor="#020103" stopOpacity="0" />
          <stop offset="1" stopColor="#020103" stopOpacity="0.85" />
        </linearGradient>
        <clipPath id={`${uid}clip`}>
          <circle cx="100" cy="100" r="100" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}clip)`}>
        <rect width="200" height="200" fill={`url(#${uid}bg)`} />
        <g className={styles.body}>
          <Art u={uid} />
        </g>
        <rect width="200" height="200" fill={`url(#${uid}top)`} />
        <rect width="200" height="200" fill={`url(#${uid}rim)`} className={styles.rim} />
        <rect width="200" height="200" fill={`url(#${uid}fade)`} />
        <rect width="200" height="200" fill={`url(#${uid}vig)`} />
      </g>
    </svg>
  );
}
