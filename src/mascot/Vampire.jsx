// Граф Пропсула — главный хозяин всех пещер и учитель. Нарисован на SVG вручную:
// масштабируется без потери качества и ничего не весит.
// Облик — злой и мрачный: впалые щёки, длинные клыки, красные глаза-щели.
// Страх и азарт держат внимание, а эмоция помогает запомнить (эмоциональная окраска).
// Настроение (mood) — это проп! Один компонент, разные «состояния лица»:
//   idle — парит, talk — говорит, happy — злорадствует, sad — хмурится,
//   point — указывает влево на важное, wave — взмахивает рукой.
import { useId } from 'react';
import styles from './Vampire.module.css';

export default function Vampire({ mood = 'idle', size = 120, className = '' }) {
  const u = `v${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg
      className={`${styles.vampire} ${styles[mood] ?? ''} ${className}`}
      viewBox="0 0 160 190"
      width={size}
      height={(size * 190) / 160}
      role="img"
      aria-label="Граф Пропсула"
    >
      <defs>
        <radialGradient id={`${u}skin`} cx="50%" cy="88%" r="80%">
          <stop offset="0" stopColor="#efeaf3" />
          <stop offset="0.5" stopColor="#b3abc2" />
          <stop offset="1" stopColor="#4c4560" />
        </radialGradient>
        <linearGradient id={`${u}cape`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1229" />
          <stop offset="1" stopColor="#07040b" />
        </linearGradient>
        <linearGradient id={`${u}lining`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8e1030" />
          <stop offset="1" stopColor="#3a0412" />
        </linearGradient>
        <radialGradient id={`${u}iris`} cx="40%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ff8a8a" />
          <stop offset="0.5" stopColor="#ff1f3d" />
          <stop offset="1" stopColor="#7a0012" />
        </radialGradient>
      </defs>

      <ellipse className={styles.shadow} cx="80" cy="183" rx="34" ry="5" />

      <g className={styles.body}>
        {/* Плащ с рваным краем: чёрный снаружи, кровавый внутри */}
        <g className={styles.cape}>
          <path
            d="M40 78 C28 110 20 150 14 180 L24 172 L32 182 L42 173 L52 184 L62 175 L72 186 L80 177 L88 186 L98 175 L108 184 L118 173 L128 182 L136 172 L146 180 C140 150 132 110 120 78 Z"
            fill={`url(#${u}cape)`}
          />
          <path
            d="M48 82 C40 112 34 146 30 168 L38 162 L46 170 L56 163 L66 171 L80 164 L94 171 L104 163 L114 170 L122 162 L130 168 C126 146 120 112 112 82 Z"
            fill={`url(#${u}lining)`}
          />
        </g>

        {/* Высокий острый воротник */}
        <path d="M58 80 L28 28 L66 64 Z" fill="#7a0f2a" stroke="#0b0610" strokeWidth="2" strokeLinejoin="round" />
        <path d="M102 80 L132 28 L94 64 Z" fill="#7a0f2a" stroke="#0b0610" strokeWidth="2" strokeLinejoin="round" />

        {/* Камзол, рубашка, шейный платок */}
        <path d="M60 82 C66 76 94 76 100 82 L110 160 C92 168 68 168 50 160 Z" fill="#17101f" />
        <path d="M72 80 L80 112 L88 80 Z" fill="#d9d2e0" />
        <path d="M80 86 L71 80 L72 94 Z M80 86 L89 80 L88 94 Z" fill="#9a0f2c" />
        <circle cx="80" cy="86" r="2.6" fill="#5a0618" />

        {/* Амулет с фигурными скобками — символ пропсов */}
        <path d="M67 82 Q80 104 93 82" fill="none" stroke="#b8902e" strokeWidth="1.5" />
        <circle cx="80" cy="113" r="9.5" fill="#c79a32" stroke="#5e4310" strokeWidth="1.5" />
        <text x="80" y="117" textAnchor="middle" fontSize="10" fontWeight="700" fill="#3a2400" fontFamily="monospace">
          {'{}'}
        </text>

        {/* Рука с когтями, которая отдыхает */}
        <path d="M100 88 C112 102 114 122 108 138" fill="none" stroke="#17101f" strokeWidth="12" strokeLinecap="round" />
        <circle cx="108" cy="141" r="5.5" fill="#b3abc2" />
        <path d="M105 145 L102 153 M108 146 L107 155 M111 145 L113 153" stroke="#d9d2e0" strokeWidth="1.6" strokeLinecap="round" />

        {/* Голова */}
        <g className={styles.head}>
          <path d="M56 50 L34 28 L58 64 Z" fill="#b3abc2" stroke="#4c4560" strokeWidth="1" />
          <path d="M104 50 L126 28 L102 64 Z" fill="#b3abc2" stroke="#4c4560" strokeWidth="1" />
          {/* узкое лицо с острым подбородком */}
          <path
            d="M80 26 C96 26 106 38 106 54 C106 66 100 76 92 82 C88 86 84 89 80 89 C76 89 72 86 68 82 C60 76 54 66 54 54 C54 38 64 26 80 26 Z"
            fill={`url(#${u}skin)`}
            stroke="#3a3448"
            strokeWidth="0.8"
          />
          {/* впалые щёки и тени под глазами */}
          <path
            d="M59 62 C62 70 67 75 72 78 M101 62 C98 70 93 75 88 78"
            stroke="#5a5270"
            strokeWidth="2.4"
            opacity="0.55"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M63 61 Q70 64 77 61 M83 61 Q90 64 97 61" stroke="#3a2a48" strokeWidth="1.6" opacity="0.6" fill="none" />
          {/* Волосы с «вдовьим мыском» */}
          <path d="M54 50 C52 26 70 18 80 18 C90 18 108 26 106 50 C102 38 94 32 86 31 L80 45 L74 31 C66 32 58 38 54 50 Z" fill="#0b0610" />
          {/* Злые брови */}
          <path className={styles.browLeft} d="M61 43 L76 49" stroke="#0b0610" strokeWidth="3.4" strokeLinecap="round" />
          <path className={styles.browRight} d="M99 43 L84 49" stroke="#0b0610" strokeWidth="3.4" strokeLinecap="round" />
          {/* Глаза: красная радужка, зрачок-щель (моргают) */}
          <g className={styles.eyes}>
            <path d="M63 56 Q70 50 77 56 Q70 60 63 56 Z" fill="#efe2dc" />
            <path d="M83 56 Q90 50 97 56 Q90 60 83 56 Z" fill="#efe2dc" />
            <g className={styles.irises}>
              <circle cx="70.5" cy="56" r="3.3" fill={`url(#${u}iris)`} />
              <circle cx="90.5" cy="56" r="3.3" fill={`url(#${u}iris)`} />
              <ellipse cx="70.5" cy="56" rx="0.9" ry="2.6" fill="#1a0005" />
              <ellipse cx="90.5" cy="56" rx="0.9" ry="2.6" fill="#1a0005" />
              <circle cx="71.7" cy="54.8" r="0.8" fill="#fff" />
              <circle cx="91.7" cy="54.8" r="0.8" fill="#fff" />
            </g>
          </g>
          {/* Злорадные глаза-щели (настроение happy) */}
          <g className={styles.happyEyes}>
            <path d="M63 57 Q70 52 77 55.5" fill="none" stroke="#ff2a3d" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M97 57 Q90 52 83 55.5" fill="none" stroke="#ff2a3d" strokeWidth="2.6" strokeLinecap="round" />
          </g>
          <path d="M80 58 C78 64 77 68 80 70 C82 70 83 69 82 67" fill="none" stroke="#6a6280" strokeWidth="1.4" strokeLinecap="round" />
          {/* Рот: жестокая усмешка с длинными клыками и капля крови */}
          <g className={styles.mouthSmile}>
            <path d="M68 74 Q80 80 92 74" fill="none" stroke="#2a0008" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M73.5 75.4 L75.4 83 L77.4 76.4 Z M82.6 76.4 L84.6 83 L86.5 75.4 Z" fill="#f4efe6" stroke="#8a8098" strokeWidth="0.5" />
            <path d="M91.5 75.5 q1 3 0 5.5" stroke="#b0001c" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </g>
          <g className={styles.mouthOpen}>
            <path d="M70 73 Q80 89 90 73 Q80 77 70 73 Z" fill="#2a0008" />
            <path d="M73.5 74 L75.4 82 L77.4 75 Z M82.6 75 L84.6 82 L86.5 74 Z" fill="#f4efe6" />
          </g>
        </g>

        {/* Рука-указка с когтем: вращается вокруг плеча */}
        <g className={styles.arm}>
          <path d="M60 88 L26 92" fill="none" stroke="#17101f" strokeWidth="12" strokeLinecap="round" />
          <path d="M30 91.6 L25 92.2" stroke="#d9d2e0" strokeWidth="12" strokeLinecap="butt" />
          <circle cx="20" cy="92" r="6" fill="#b3abc2" />
          <path d="M15 91 L4 88.5" stroke="#b3abc2" strokeWidth="3.6" strokeLinecap="round" />
          <path d="M5 88.7 L0 87.6" stroke="#efeaf3" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
