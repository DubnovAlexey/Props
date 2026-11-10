// Вид изнутри пещеры наружу: каменная пасть со сталактитами, за ней — ночь,
// луна в рваных тучах, зубцы гор и замок Графа с горящими окнами.
// У стены чадит факел, с потолка капает вода, на полу — череп того,
// кто не дошёл до конца. Чистая декорация, поэтому aria-hidden.
// Слои рисуются от дальних к ближним: небо → луна → тучи → горы и замок →
// туман → каменная рама пещеры → сталактиты → факел → череп → затемнение по краям.
import { useId } from 'react';
import Bat from '../../mascot/Bat.jsx';
import styles from './CaveMap.module.css';

// Проём пещеры: неровный, как выломанный в скале
const OPENING =
  'M40 162 C34 140 30 118 36 96 C38 86 44 80 46 70 C52 52 70 40 92 36 C104 30 120 28 136 32 C150 34 166 44 176 58 C186 70 192 86 192 102 C194 122 190 144 184 162 Z';

// Звёзды: [x, y, радиус]
const STARS = [
  [66, 74, 0.8],
  [78, 54, 1.1],
  [104, 44, 0.7],
  [174, 98, 0.9],
  [180, 124, 0.6],
  [58, 104, 0.7],
  [96, 82, 0.5],
  [184, 78, 0.8],
  [120, 96, 0.5],
  [70, 126, 0.6],
];

// Кратеры на луне: [x, y, rx, ry]
const CRATERS = [
  [143, 55, 3.4, 2.8],
  [156, 68, 2.4, 2],
  [147, 72, 1.6, 1.3],
  [158, 54, 1.4, 1.1],
  [138, 66, 1.2, 1],
];

// Сталактиты над проёмом: [x левого края, y основания, ширина, длина]
const STALACTITES = [
  [58, 50, 9, 24],
  [76, 40, 8, 34],
  [98, 33, 7, 20],
  [118, 30, 9, 30],
  [140, 32, 7, 18],
  [158, 42, 8, 26],
  [172, 54, 6, 15],
];

// Окна замка: [x, y]
const WINDOWS = [
  [86.6, 90],
  [89.6, 93.4],
  [81, 94.6],
  [94.4, 93],
];

export default function CaveArt() {
  const u = `c${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <div className={styles.art} aria-hidden="true">
      <svg viewBox="0 0 220 170" className={styles.caveArt}>
        <defs>
          <radialGradient id={`${u}sky`} cx="68%" cy="38%" r="75%">
            <stop offset="0" stopColor="#3b3468" />
            <stop offset="0.5" stopColor="#17132e" />
            <stop offset="1" stopColor="#05040c" />
          </radialGradient>
          {/* багровая полоса у горизонта */}
          <linearGradient id={`${u}dusk`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.55" stopColor="#5a1026" stopOpacity="0" />
            <stop offset="0.9" stopColor="#5a1026" stopOpacity="0.5" />
            <stop offset="1" stopColor="#2a0612" stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id={`${u}moon`} cx="38%" cy="36%" r="68%">
            <stop offset="0" stopColor="#fffbe6" />
            <stop offset="0.6" stopColor="#e8dcae" />
            <stop offset="1" stopColor="#a39563" />
          </radialGradient>
          <radialGradient id={`${u}halo`} cx="50%" cy="50%" r="50%">
            <stop offset="0.45" stopColor="#f6e9b4" stopOpacity="0.4" />
            <stop offset="1" stopColor="#f6e9b4" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${u}mist`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8b80b8" stopOpacity="0" />
            <stop offset="0.6" stopColor="#8b80b8" stopOpacity="0.26" />
            <stop offset="1" stopColor="#8b80b8" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id={`${u}rock`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2c2536" />
            <stop offset="0.5" stopColor="#17131d" />
            <stop offset="1" stopColor="#070509" />
          </linearGradient>
          <radialGradient id={`${u}torch`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ffa64a" stopOpacity="0.62" />
            <stop offset="0.5" stopColor="#ff7a2a" stopOpacity="0.2" />
            <stop offset="1" stopColor="#ff7a2a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${u}flame`} cx="50%" cy="80%" r="75%">
            <stop offset="0" stopColor="#fff6c2" />
            <stop offset="0.42" stopColor="#ffb43c" />
            <stop offset="0.86" stopColor="#e2531c" />
            <stop offset="1" stopColor="#e2531c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${u}vignette`} cx="55%" cy="50%" r="72%">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.62" />
          </radialGradient>
          <linearGradient id={`${u}bone`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e7d9bd" />
            <stop offset="1" stopColor="#7d7260" />
          </linearGradient>
          <clipPath id={`${u}hole`}>
            <path d={OPENING} />
          </clipPath>
        </defs>

        {/* Всё, что видно в проёме пещеры */}
        <g clipPath={`url(#${u}hole)`}>
          <rect width="220" height="170" fill={`url(#${u}sky)`} />
          <rect width="220" height="170" fill={`url(#${u}dusk)`} />
          {STARS.map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} className={styles.star} cx={cx} cy={cy} r={r} fill="#f3eefc" />
          ))}

          {/* луна: ореол, диск, кратеры, тень по краю */}
          <circle cx="148" cy="62" r="36" fill={`url(#${u}halo)`} />
          <circle className={styles.artMoon} cx="148" cy="62" r="19" fill={`url(#${u}moon)`} />
          {CRATERS.map(([cx, cy, rx, ry]) => (
            <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#b9a875" opacity="0.55" />
          ))}
          <path d="M160 46.8 C169 54 170 68 162 76.6 C166 68 165.6 56 160 46.8 Z" fill="#3a3352" opacity="0.4" />

          {/* стая мышей на фоне луны и рваные тучи */}
          <path
            d="M131 51 q2.2 -2.8 4.4 0 q2.2 -2.8 4.4 0 q-2.2 -1 -4.4 1 q-2.2 -2 -4.4 -1 Z M146 44 q1.6 -2 3.2 0 q1.6 -2 3.2 0 q-1.6 -0.8 -3.2 0.8 q-1.6 -1.6 -3.2 -0.8 Z M121 60 q1.4 -1.8 2.8 0 q1.4 -1.8 2.8 0 q-1.4 -0.7 -2.8 0.7 q-1.4 -1.4 -2.8 -0.7 Z"
            fill="#05040a"
          />
          <path
            d="M108 70 C122 63 138 65 150 69 C162 73 176 71 194 64 C182 75 164 79 150 76.6 C136 74.4 122 76 108 70 Z"
            fill="#0b0916"
            opacity="0.62"
          />
          <path d="M96 52 C108 47 120 49 130 52 C122 56.6 108 57 96 52 Z" fill="#0b0916" opacity="0.5" />

          {/* дальние горы и замок Графа на вершине */}
          <path
            d="M30 150 L56 112 L70 124 L88 99 L104 122 L120 104 L138 126 L156 108 L176 132 L194 118 L198 164 L30 164 Z"
            fill="#131028"
          />
          <path
            d="M83 100 L83 86 L85 86 L85 84 L87 84 L87 80.5 L88.2 76 L89.4 80.5 L89.4 84 L91.4 84 L91.4 86 L93.2 86 L93.2 100 Z M79 100 L79 91 L80.6 87 L82.2 91 L82.2 100 Z M94 100 L94 89.6 L95.6 85.6 L97.2 89.6 L97.2 100 Z"
            fill="#0a0816"
          />
          {WINDOWS.map(([x, y]) => (
            <rect key={`${x}-${y}`} className={styles.window} x={x} y={y} width="1" height="1.7" fill="#ffb347" />
          ))}

          {/* ближние горы и туман в долине */}
          <path d="M30 164 L50 138 L66 148 L84 128 L100 146 L118 132 L136 150 L154 136 L174 152 L190 142 L198 164 Z" fill="#07060f" />
          <rect x="30" y="126" width="170" height="38" fill={`url(#${u}mist)`} />
        </g>

        {/* каменная рама: всё, кроме проёма (fillRule="evenodd" вырезает дыру) */}
        <path fillRule="evenodd" d={`M0 0 H220 V170 H0 Z ${OPENING}`} fill={`url(#${u}rock)`} filter="url(#g-stone)" />
        {/* лунный свет на кромке проёма и трещины в скале */}
        <path d={OPENING} fill="none" stroke="#a79be0" strokeOpacity="0.3" strokeWidth="1.4" />
        <path
          d="M8 30 L20 46 L16 62 L24 74 M198 18 L206 40 L201 60 M204 98 L212 116 L208 134 M10 112 L18 126 L14 142 M96 8 L104 18 L118 14"
          stroke="#000"
          strokeWidth="1"
          opacity="0.4"
          fill="none"
        />

        {/* сталактиты (с лунным бликом по краю) и сталагмиты */}
        {STALACTITES.map(([x, y, width, length]) => (
          <g key={x}>
            <path d={`M${x} ${y} L${x + width * 0.45} ${y + length} L${x + width} ${y - 1} Z`} fill="#100c16" />
            <path d={`M${x + width} ${y - 1} L${x + width * 0.45} ${y + length}`} stroke="#8f86c9" strokeOpacity="0.35" strokeWidth="0.7" />
          </g>
        ))}
        <path
          d="M24 170 L37 130 L50 170 Z M186 170 L195 136 L205 170 Z M54 170 L61 148 L68 170 Z M118 170 L123 156 L128 170 Z"
          fill="#0d0a12"
        />
        <circle className={styles.drop} cx="79.6" cy="75" r="1.4" fill="#9fd8ff" />

        {/* паутина в углу */}
        <path
          d="M0 0 L30 5 M0 0 L24 17 M0 0 L13 26 M0 0 L3 31 M22 3.6 Q20 10 17.6 12.6 Q13 15 9.6 19 Q6 22 2.2 23 M12 2 Q11 5.6 9.6 7 Q7 8.6 5.2 10.6 Q3 12 1.2 12.6"
          stroke="#cfc8e6"
          strokeWidth="0.5"
          opacity="0.28"
          fill="none"
        />

        {/* факел на стене: отсвет, древко в железном кольце, пламя */}
        <circle cx="23" cy="88" r="38" fill={`url(#${u}torch)`} className={styles.torchGlow} />
        <path d="M18.4 124 L21.4 95 L27 95 L24.6 124 Z" fill="#3b2412" />
        <path d="M20.2 97.4 H28 V100.6 H20.2 Z" fill="#5b564e" />
        <path d="M13 108 L20.4 104 L20.4 107 L15 110.4 Z" fill="#4a463f" />
        <g className={styles.flame}>
          <path
            d="M24.2 97 C12.6 88 16.6 73 23.6 62 C23 73 29.6 76.4 30.6 70 C37 80.6 36 92 24.2 97 Z"
            fill={`url(#${u}flame)`}
            filter="url(#g-glow)"
          />
          <path
            d="M24.2 95 C19 90 20.4 81.4 24 76 C25 81.4 28.2 83.4 28.8 80 C31.4 86.4 30.4 91.6 24.2 95 Z"
            fill="#fff6c2"
            opacity="0.9"
          />
        </g>

        {/* череп и кость на полу — чья-то пещера оказалась последней */}
        <g transform="translate(-2 -3.4)">
          <path d="M132 167.4 L170 160.6" stroke="#8d8370" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="132" cy="166.6" r="1.7" fill="#8d8370" />
          <circle cx="132.6" cy="168.4" r="1.6" fill="#8d8370" />
          <path
            d="M144 158.6 C143.6 151.4 149.4 147 156 148 C162.4 149 165.6 154.4 164.6 159.6 C164.2 162.2 162.6 163.4 161.6 164.2 L160.8 167.6 L148.2 167.6 L147.4 164.4 C145.4 163.4 144.2 161.4 144 158.6 Z"
            fill={`url(#${u}bone)`}
          />
          <ellipse cx="150.4" cy="157.8" rx="2.3" ry="2.7" fill="#120c10" />
          <ellipse cx="157.8" cy="158.4" rx="2.3" ry="2.7" fill="#120c10" />
          <path d="M153.6 161 L154.9 163.6 L152.6 163.6 Z" fill="#120c10" />
          <path
            d="M149.4 165 V167.4 M151.8 165 V167.4 M154.2 165 V167.4 M156.6 165 V167.4 M159 165 V167.4 M148.4 165 H160.4"
            stroke="#3a3128"
            strokeWidth="0.6"
          />
          <path d="M157 149 L158.6 152.4 L157.4 154.6" stroke="#3a3128" strokeWidth="0.5" fill="none" />
        </g>

        {/* затемнение по краям собирает взгляд на проёме */}
        <rect width="220" height="170" fill={`url(#${u}vignette)`} />
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
