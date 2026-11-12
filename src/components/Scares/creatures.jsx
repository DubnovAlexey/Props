// Те, кто вдруг пробегает или спускается по экрану: гоблин с факелом, тролль с дубиной,
// крыса и паук на нити. Рисунки — SVG, как и хозяева пещер, но во весь рост.
// Все нарисованы мордой вправо: если существо бежит влево, его зеркалит Scares.jsx.
// Тяжёлых фильтров (g-flesh, g-stone) здесь нет нарочно: фигуры движутся, и телефон
// пересчитывал бы фильтр на каждом кадре. Из фильтров — только лёгкое свечение глаз и огня.
// Движение частей (ноги, руки, пламя) — классы из Scares.module.css.
import { useId } from 'react';
import { BLOOD, BLOOD_DARK, BLOOD_LIGHT, Splatter, Tips, Trail } from '../../mascot/guardians/gore.jsx';
import styles from './Scares.module.css';

const BONE = '#e8dfc2';

/** Конечность, которая качается вокруг сустава (x, y) — координаты в системе рисунка */
function Limb({ x, y, className, children }) {
  return (
    <g className={className} style={{ transformOrigin: `${x}px ${y}px` }}>
      {children}
    </g>
  );
}

/** Гоблин-кочегар бежит с факелом и окровавленным тесаком. size — высота в пикселях */
export function GoblinRunner({ size = 130 }) {
  // useId даёт уникальный id: градиенты разных рисунков не перепутаются
  const uid = `s${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const limb = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };

  return (
    <svg
      className={`${styles.creature} ${styles.goblin}`}
      viewBox="0 0 120 110"
      width={(size * 120) / 110}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${uid}torch`}>
          <stop offset="0" stopColor="#ffb84a" stopOpacity="0.8" />
          <stop offset="0.45" stopColor="#ff7a1f" stopOpacity="0.3" />
          <stop offset="1" stopColor="#ff7a1f" stopOpacity="0" />
        </radialGradient>
        {/* свет факела падает спереди: спина тёмная, морда и грудь освещены */}
        <linearGradient id={`${uid}skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2f3b1c" />
          <stop offset="0.6" stopColor="#52652f" />
          <stop offset="1" stopColor="#93a552" />
        </linearGradient>
      </defs>

      <circle className={styles.flameGlow} cx="102" cy="18" r="30" fill={`url(#${uid}torch)`} />

      <g className={styles.bob}>
        {/* дальняя рука с тесаком — в крови по самую рукоять */}
        <Limb x={66} y={50} className={styles.swingArm}>
          <path d="M66 50 L52 59 L40 51" stroke="#2f3b1c" strokeWidth="6" {...limb} />
          <path d="M41 52 L36 47" stroke="#3a2414" strokeWidth="2.8" {...limb} />
          <path d="M37 48 L22 34 L17.6 39.4 L30 52 Z" fill="#aeb7c2" stroke="#5d6570" strokeWidth="0.6" />
          <path d="M22 34 L17.6 39.4 L24 45.6 L28.4 40.6 Z" fill={BLOOD} stroke={BLOOD_DARK} strokeWidth="0.4" />
          <Trail d="M20.6 41 C20 44 21 46 20.4 49.4" width={1} />
        </Limb>

        <Limb x={54} y={72} className={styles.legB}>
          <path d="M54 72 L59 89 L53 104 L63 105.4" stroke="#2f3b1c" strokeWidth="6.6" {...limb} />
        </Limb>

        {/* сутулое тощее тело: рёбра и позвонки наружу */}
        <path d="M47 75 C43 61 53 45 70 42 C78 44 80 54 76 64 C72 74 62 81 47 75 Z" fill={`url(#${uid}skin)`} />
        <path d="M47 75 C45 65 51 53 61 47 C56 58 56 68 60 78 C55 78 50 77 47 75 Z" fill="#1c2411" opacity="0.6" />
        <path
          d="M61 56 C65 58 69 58 73 56 M59 62 C64 64.6 69 64.6 74 62 M58 68 C63 70.6 67 70.6 71 68.6"
          stroke="#222b15"
          strokeWidth="0.9"
          opacity="0.75"
          fill="none"
        />
        <g fill="#93a552" opacity="0.45">
          <circle cx="50.6" cy="62" r="1.5" />
          <circle cx="54" cy="54" r="1.5" />
          <circle cx="60" cy="47.6" r="1.5" />
        </g>
        <path d="M46.4 72 L43.6 88 L50 83 L53 92.4 L58 82 L63 89 L64.4 72 Z" fill="#3a2418" />
        <path d="M47 73.4 L64 73" stroke="#1d110b" strokeWidth="1.6" />

        <Limb x={54} y={72} className={styles.legA}>
          <path d="M54 72 L59 89 L53 104 L63 105.4" stroke="#5a6c36" strokeWidth="7" {...limb} />
          <path d="M62.6 104.6 L66.6 105.6 M62 106.4 L65.6 108" stroke={BONE} strokeWidth="0.9" {...limb} />
        </Limb>

        {/* голова: длинные рваные уши назад, нос крюком, оскал */}
        <path d="M75 30 L57 11 L71 37 Z" fill="#2f3b1c" />
        <path
          d="M68 42 C64 32 72 22 84 23 C92 24 97 30 97 36 L108 43.4 L98 46.4 C97 50 94 53.4 90 54.4 L78 54.4 C72 51.6 69 47 68 42 Z"
          fill={`url(#${uid}skin)`}
        />
        <path d="M73 35 L50 25 L70 43 Z" fill="#55683a" />
        <path d="M70 36.4 L57 30.4 L69 41 Z" fill="#7a3344" opacity="0.65" />
        <circle cx="57.6" cy="31" r="1.7" fill="none" stroke={BONE} strokeWidth="0.8" />
        <path d="M78 44 C82 47 86 47.6 90 46" stroke="#222b15" strokeWidth="1" opacity="0.6" fill="none" />
        <path d="M83 47.6 L98 46.4 C97 50 94 53.4 90 54.4 L81.6 53.6 Z" fill="#170607" />
        <path
          d="M85 47.5 L86.4 51 L87.8 47.3 Z M89 47.1 L90.4 50.6 L91.8 46.9 Z M93 46.8 L94.2 49.8 L95.6 46.6 Z M84.6 53.8 L85.8 50.4 L87.2 54 Z M90 54.3 L91.2 51 L92.6 54.2 Z"
          fill={BONE}
        />
        <Tips
          tips={[
            [86.4, 51, 1.7, 'down'],
            [90.4, 50.6, 1.6, 'down'],
          ]}
          width={1.5}
        />
        <Trail d="M95.6 49.6 C96.2 52.4 95.2 54.6 95.8 57.8" width={1.1} />
        <path d="M82 31.6 L94 34.4" stroke="#1c2411" strokeWidth="2.4" strokeLinecap="round" />
        <g filter="url(#g-glow)">
          <ellipse cx="88.4" cy="36" rx="2.7" ry="1.9" fill="#ffd23a" transform="rotate(-12 88.4 36)" />
        </g>
        <ellipse cx="88.9" cy="36" rx="0.65" ry="1.7" fill="#1a0a00" />
        <circle cx="102" cy="41.4" r="1" fill="#3c4a22" />
        {/* отсвет факела на морде */}
        <path d="M97 36 L107.4 43 M84 23.4 C91 24 96 29 97 35" stroke="#ffc878" strokeWidth="0.9" opacity="0.6" fill="none" />

        {/* ближняя рука несёт факел */}
        <Limb x={70} y={51} className={styles.torchArm}>
          <path d="M70 51 L84 60.4 L97 53" stroke="#5a6c36" strokeWidth="6.4" {...limb} />
          <path d="M85 60.6 L96.6 54" stroke="#ffc878" strokeWidth="0.9" opacity="0.55" {...limb} />
          <path d="M96.4 59 L101.4 30" stroke="#5a3a1e" strokeWidth="3.4" {...limb} />
          <circle cx="97" cy="53.4" r="4.2" fill="#5a6c36" />
          <path d="M98.4 33.4 L104.8 32.2 L103.6 25.6 L99.4 26.4 Z" fill="#241509" />
          <g className={styles.flame} filter="url(#g-glow)">
            <path d="M101.6 28 C94 22 97 12 102 4 C103 11 110 15 108.4 23 C108 26 105.6 28 101.6 28 Z" fill="#ff6a1f" />
            <path d="M102 27 C98 22 100.6 16 102.6 11 C103.6 16 106.6 19 105.6 23.6 C105.2 26 103.8 27 102 27 Z" fill="#ffd23a" />
            <path
              d="M102.4 26 C100.8 23 101.8 20.4 102.8 18 C103.4 20.4 104.6 22 104.2 24.2 C104 25.4 103.4 26 102.4 26 Z"
              fill="#fff6c8"
            />
          </g>
        </Limb>
      </g>
    </svg>
  );
}

/** Тролль-привратник ломится через пещеру и волочит шипастую дубину. size — высота в пикселях */
export function TrollRunner({ size = 190 }) {
  const uid = `s${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const limb = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };

  return (
    <svg
      className={`${styles.creature} ${styles.troll}`}
      viewBox="0 0 180 160"
      width={(size * 180) / 160}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${uid}hide`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2e342d" />
          <stop offset="0.55" stopColor="#4c544a" />
          <stop offset="1" stopColor="#737f6d" />
        </linearGradient>
      </defs>

      <g className={styles.bob}>
        {/* дальняя рука волочит дубину: шипы, железо, кровь */}
        <g className={styles.drag}>
          <path d="M62 64 L42 98 L35 124" stroke="#2a2f2a" strokeWidth="15" {...limb} />
          <path d="M40 119 L15 137 L3 147 C0 151 4 158 10 157 L26 151 L46 131 Z" fill="#4a3320" stroke="#2a1c10" strokeWidth="0.8" />
          <path d="M14 141 L34 126 M10 148 L26 138" stroke="#2a1c10" strokeWidth="0.8" opacity="0.7" />
          <path d="M22 132 L31 146" stroke="#6a6f78" strokeWidth="3.2" />
          <path d="M9 144 L1 139 L11 140.6 Z M13 155 L9 159.6 L17 155.4 Z M20 137 L16 130 L24 135 Z" fill="#8a9099" />
          <Splatter
            spots={[
              [8, 150, 2.3],
              [14, 146, 1.4],
              [19, 151, 1.7],
              [5, 154.4, 1],
              [24, 144, 1.1],
            ]}
          />
          <Trail d="M12 149 C16 147 20 147 24 149" width={1.6} />
          <circle cx="35" cy="126" r="9.5" fill="#2a2f2a" />
        </g>

        <Limb x={74} y={112} className={styles.legB}>
          <path d="M74 112 L80 134 L75 151 L91 152.6" stroke="#2a2f2a" strokeWidth="16" {...limb} />
        </Limb>

        {/* горбатая туша: камень, мох, старые шрамы */}
        <path
          d="M42 114 C28 84 44 46 82 40 C108 36 128 50 130 74 C132 98 118 118 96 122 C76 126 52 126 42 114 Z"
          fill={`url(#${uid}hide)`}
        />
        <path d="M42 114 C32 90 40 62 62 48 C52 70 52 96 62 122 C54 121 46 119 42 114 Z" fill="#161a16" opacity="0.55" />
        <path d="M58 56 L66 70 L60 84 M74 46 L80 60 L74 72 M94 44 L98 58" stroke="#161a16" strokeWidth="1.2" opacity="0.6" fill="none" />
        <path d="M66 46 C76 38 94 37 104 42 C94 45 80 47 66 46 Z" fill="#5d7a3a" opacity="0.8" />
        <path d="M46 78 C48 70 52 64 58 60 C56 68 54 76 50 84 Z" fill="#5d7a3a" opacity="0.5" />
        <path d="M96 122 C116 116 128 100 130 78 C124 96 112 110 92 116 Z" fill="#a8b59b" opacity="0.22" />
        <g fill="none" strokeLinecap="round">
          <path d="M84 60 L96 78 M90 58 L102 76 M96 57 L108 74" stroke={BLOOD_DARK} strokeWidth="2.6" />
          <path d="M84 60 L96 78 M90 58 L102 76 M96 57 L108 74" stroke={BLOOD} strokeWidth="1.3" />
        </g>

        {/* набедренная шкура с черепом-трофеем */}
        <path d="M50 114 L46 138 L58 130 L64 143 L74 129 L84 141 L92 127 L100 121 C84 126 64 126 50 114 Z" fill="#33241c" />
        <path d="M93 122 L93 127" stroke="#1a1210" strokeWidth="1" />
        <circle cx="93" cy="131.4" r="5.4" fill="#d9d0b8" />
        <path d="M90.4 135.4 H95.6 V138.6 H90.4 Z" fill="#c9c0a8" />
        <circle cx="91" cy="130.8" r="1.3" fill="#1a1210" />
        <circle cx="95" cy="130.8" r="1.3" fill="#1a1210" />

        <Limb x={74} y={112} className={styles.legA}>
          <path d="M74 112 L80 134 L75 151 L91 152.6" stroke="#4c544a" strokeWidth="17" {...limb} />
          <path d="M90 149.6 L95.4 151.6 M87 154 L92.4 156" stroke={BONE} strokeWidth="1.7" {...limb} />
        </Limb>

        {/* маленькая голова, утонувшая в плечах: тяжёлые брови, бивни в крови */}
        <path d="M115 56 L103 45 L113 67 Z" fill="#2e342d" />
        <path
          d="M112 62 C110 48 122 40 136 44 C147 47 153 58 150 68 L153 74 C151 84 141 89 129 87 C118 85 113 75 112 62 Z"
          fill="#565f52"
        />
        <path d="M121 73 L153 73 L150 85 C143 90 130 88.6 124 83 Z" fill="#69735f" />
        <path d="M121 55 C130 50 141 51 149 57 L148 61.6 C140 57 131 57 122 60.6 Z" fill="#1d221b" />
        <g filter="url(#g-glow)">
          <ellipse cx="138" cy="62" rx="2.9" ry="1.7" fill="#b6ff5a" />
        </g>
        <circle cx="138.7" cy="62" r="0.75" fill="#0c1404" />
        <path d="M147 63 L154 67.6 L148 71 Z" fill="#3a4138" />
        <path d="M125 75 L151 74" stroke="#120a0a" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M130 75 L128 60 L136 74 Z M143 74.4 L145 59 L150 73.6 Z" fill={BONE} />
        <Tips
          tips={[
            [128, 60, 5, 'up'],
            [145, 59, 5, 'up'],
          ]}
          width={2.6}
        />
        <Trail d="M138 76 C138.6 80 137.6 83 138.2 87.4" width={1.4} />
        <g fill="#3a4138">
          <circle cx="120" cy="66" r="1.3" />
          <circle cx="126" cy="50" r="1.1" />
        </g>

        {/* ожерелье из чужих зубов */}
        <path d="M88 62 C98 76 112 82 124 80" stroke="#1a1512" strokeWidth="1.2" fill="none" />
        <path d="M94 70 L95 76 L97 71 Z M102 75.6 L103 81.6 L105 76.6 Z M110 78.6 L111.4 84.4 L113 79.4 Z" fill={BONE} />

        {/* ближняя рука — до земли, кулак с когтями */}
        <Limb x={104} y={66} className={styles.swingArm}>
          <path d="M104 66 L116 100 L109 128" stroke="#4c544a" strokeWidth="16" {...limb} />
          <path d="M111 70 L122 100 L115 124" stroke="#a8b59b" strokeWidth="2" opacity="0.3" {...limb} />
          <path d="M108.6 104.4 L122.6 101 L123.6 108 L109.6 111.4 Z" fill="#5a5f68" stroke="#2c2f35" strokeWidth="0.6" />
          <circle cx="109" cy="131" r="10.5" fill="#4c544a" />
          <path d="M102 134 L116 135" stroke="#1d221b" strokeWidth="1" />
          <path d="M103 139.6 L101 145 M108.4 141.4 L107.6 147 M113.6 140.4 L114.8 145.6" stroke={BONE} strokeWidth="1.7" {...limb} />
        </Limb>
      </g>
    </svg>
  );
}

/** Крыса с окровавленной мордой. size — длина в пикселях */
export function Rat({ size = 60 }) {
  const leg = { stroke: '#8a6470', strokeWidth: 1.8, strokeLinecap: 'round', fill: 'none' };

  return (
    <svg
      className={`${styles.creature} ${styles.rat}`}
      viewBox="-4 0 76 30"
      width={size}
      height={(size * 30) / 76}
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.tail} d="M12 21 C2 22 -2 14 4 6" stroke="#8a6470" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <Limb x={20} y={22} className={styles.legB}>
        <path d="M20 22 L17 28" {...leg} />
      </Limb>
      <Limb x={50} y={23} className={styles.legA}>
        <path d="M50 23 L47 28.4" {...leg} />
      </Limb>
      <path d="M10 22 C8 10 22 3 38 5 C50 6 58 12 66 19 L62 23 C52 25 28 26 10 22 Z" fill="#40323a" />
      <path d="M14 22.6 C28 25 50 24.6 62 23 L59 20.6 C46 22.4 28 22.8 14 22.6 Z" fill="#1d1519" opacity="0.6" />
      <path d="M14 12 C22 6 36 5 48 8" stroke="#7a6670" strokeWidth="1" opacity="0.55" fill="none" strokeLinecap="round" />
      <Limb x={24} y={23} className={styles.legA}>
        <path d="M24 23 L27 28.4" {...leg} />
      </Limb>
      <Limb x={54} y={23} className={styles.legB}>
        <path d="M54 23 L57 28.4" {...leg} />
      </Limb>
      <ellipse cx="48" cy="7.6" rx="4" ry="4.6" fill="#5a3f48" />
      <ellipse cx="48.4" cy="8" rx="2.2" ry="2.8" fill="#8a5a66" />
      <g filter="url(#g-glow)">
        <circle cx="57" cy="14.2" r="1.5" fill="#ff2d3f" />
      </g>
      <path d="M64 20 L70.4 17 M64.4 21 L70.6 21.8 M63.6 21.8 L68.6 25" stroke="#b9a9ae" strokeWidth="0.5" />
      <path d="M61.4 22.8 L65.6 21.2 L64.6 23.8 Z" fill={BLOOD} />
      <path d="M63 23 L63.7 25.6 L64.7 23 Z" fill={BONE} />
      <circle cx="66.2" cy="19.4" r="1.3" fill="#a06a78" />
    </svg>
  );
}

// Лапы паука: левые; правые получаются зеркалом (100 − x)
const SPIDER_LEGS = [
  [
    [46, 62],
    [28, 44],
    [16, 52],
  ],
  [
    [45, 65],
    [22, 58],
    [8, 70],
  ],
  [
    [45, 68],
    [24, 74],
    [12, 90],
  ],
  [
    [47, 71],
    [34, 84],
    [30, 98],
  ],
];

const legPath = (points, mirror) => points.map(([x, y], i) => `${i ? 'L' : 'M'}${mirror ? 100 - x : x} ${y}`).join(' ');

/** Паук спускается на нити головой вниз: на брюхе — кровавая метка, клыки в крови. size — в пикселях */
export function HangingSpider({ size = 84 }) {
  return (
    <svg className={styles.creature} viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" focusable="false">
      {[false, true].flatMap((mirror) =>
        SPIDER_LEGS.map((points, i) => (
          <g
            key={`${mirror}-${i}`}
            className={styles.twitch}
            style={{ transformOrigin: '50px 66px', animationDelay: `${(i * 0.13 + (mirror ? 0.2 : 0)).toFixed(2)}s` }}
          >
            <path d={legPath(points, mirror)} stroke="#2a1d36" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={legPath(points, mirror)} stroke="#6b5288" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
          </g>
        )),
      )}

      {/* брюхо с кровавой меткой — «песочные часы» */}
      <ellipse cx="50" cy="38" rx="19" ry="22" fill="#2a1d36" />
      <ellipse cx="43" cy="30" rx="7" ry="10" fill="#6b5288" opacity="0.35" />
      <path d="M46 29 L54 29 L51.2 38 L54 47 L46 47 L48.8 38 Z" fill={BLOOD_LIGHT} stroke={BLOOD_DARK} strokeWidth="0.6" />
      <path
        d="M33 26 L29 22 M31 34 L26 32 M31 44 L26 46 M67 26 L71 22 M69 34 L74 32 M69 44 L74 46"
        stroke="#4a3760"
        strokeWidth="0.9"
        strokeLinecap="round"
      />

      {/* головогрудь: восемь глаз, клыки */}
      <ellipse cx="50" cy="66" rx="10" ry="9" fill="#36263f" />
      <g filter="url(#g-glow)" fill="#ff2d3f">
        <circle cx="45" cy="69.6" r="1.4" />
        <circle cx="48.4" cy="70.6" r="1.5" />
        <circle cx="51.6" cy="70.6" r="1.5" />
        <circle cx="55" cy="69.6" r="1.4" />
        <circle cx="46.6" cy="66" r="0.9" />
        <circle cx="53.4" cy="66" r="0.9" />
      </g>
      <path d="M46.6 74 L45.2 82 L48.8 75.4 Z M53.4 74 L54.8 82 L51.2 75.4 Z" fill={BONE} />
      <Tips
        tips={[
          [45.2, 82, 3, 'down'],
          [54.8, 82, 3, 'down'],
        ]}
        width={1.6}
      />
    </svg>
  );
}

/**
 * Костяное перо архивариуса Формуляра (Скрипторий Графа): чёрное воронье опахало на костяном стержне,
 * остриё в крови, с него срываются капли. Остриё смотрит вправо-вниз — туда перо и пишет.
 * size — длина пера в пикселях.
 */
export function BloodQuill({ size = 120 }) {
  return (
    <svg
      className={`${styles.creature} ${styles.quill}`}
      viewBox="0 0 120 60"
      width={size}
      height={size / 2}
      aria-hidden="true"
      focusable="false"
    >
      {/* опахало: чёрное воронье перо с синеватым отливом и рваными бородками */}
      <path d="M4 6 C26 2 52 8 76 22 C88 29 98 36 104 42 C92 40 78 38 64 32 C44 24 24 18 4 6 Z" fill="#14141c" />
      <path d="M4 6 C22 14 40 24 60 30 C74 35 88 39 104 42" stroke="#2c3550" strokeWidth="1.2" fill="none" />
      <path
        d="M14 9 L10 2 M24 12 L22 4 M34 15 L33 7 M44 19 L45 11 M54 23 L57 15 M20 13 L14 18 M32 17 L27 23 M46 22 L42 29"
        stroke="#0a0a10"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* костяной стержень и остриё */}
      <path d="M2 4 C40 18 80 32 112 50" stroke={BONE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M104 44 L117 54 L109 50 Z" fill={BONE} />
      {/* кровь на острие и стекающая капля */}
      <path d="M108 48 L117 54 L111 51.5 Z" fill={BLOOD} />
      <circle className={styles.quillDrop} cx="116" cy="57" r="1.8" fill={BLOOD_DARK} />
    </svg>
  );
}
