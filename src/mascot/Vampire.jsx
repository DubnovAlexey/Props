// Граф Пропсула — главный хозяин всех пещер и учитель. Нарисован на SVG вручную:
// масштабируется без потери качества и ничего не весит.
// Облик — жёсткий и мрачный: худое вытянутое лицо, провалы щёк и глазниц,
// длинные клыки в крови, горящие глаза-щели, плащ, который тает в темноте.
// Свет падает снизу, как от факела: подбородок светлый, лоб тонет в тени.
// Страх и азарт держат внимание, а эмоция помогает запомнить (эмоциональная окраска).
// Настроение (mood) — это проп! Один компонент, разные «состояния лица»:
//   idle — парит, talk — говорит, happy — злорадствует, sad — хмурится,
//   point — указывает влево на важное, wave — взмахивает рукой.
// Какие части двигаются и как — в Vampire.module.css (классы body, cape, eyes, arm…).
import { useId } from 'react';
import styles from './Vampire.module.css';
import { useI18n } from '../i18n/I18nContext.jsx';

// Пятна крови на шейном платке: [x, y, радиус]
const BLOOD_SPOTS = [
  [77.6, 89.5, 1.5],
  [82.8, 93.2, 1.1],
  [79.4, 95.6, 0.8],
  [84.6, 87.6, 0.7],
];

export default function Vampire({ mood = 'idle', size = 120, className = '' }) {
  const { t } = useI18n();
  // useId даёт уникальную приставку: градиенты двух Графов на странице не перепутаются
  const u = `v${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg
      className={`${styles.vampire} ${styles[mood] ?? ''} ${className}`}
      viewBox="0 0 160 190"
      width={size}
      height={(size * 190) / 160}
      role="img"
      aria-label={t('common.count')}
    >
      <defs>
        {/* кожа: тёплый свет снизу, холодная тень сверху */}
        <radialGradient id={`${u}skin`} cx="50%" cy="104%" r="100%">
          <stop offset="0" stopColor="#f3e6d6" />
          <stop offset="0.34" stopColor="#cfc5cc" />
          <stop offset="0.68" stopColor="#8b8299" />
          <stop offset="1" stopColor="#4a4260" />
        </radialGradient>
        {/* плащ растворяется в темноте: к низу цвет становится прозрачным */}
        <linearGradient id={`${u}cloak`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1327" />
          <stop offset="0.55" stopColor="#0b0711" />
          <stop offset="0.86" stopColor="#060309" stopOpacity="0.92" />
          <stop offset="1" stopColor="#060309" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${u}lining`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8132f" />
          <stop offset="0.5" stopColor="#5e0718" />
          <stop offset="0.88" stopColor="#2c030b" stopOpacity="0.9" />
          <stop offset="1" stopColor="#2c030b" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${u}collar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e0208" />
          <stop offset="0.55" stopColor="#6b0a1c" />
          <stop offset="1" stopColor="#9a1128" />
        </linearGradient>
        <radialGradient id={`${u}iris`} cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor="#ffd9c8" />
          <stop offset="0.3" stopColor="#ff4256" />
          <stop offset="0.78" stopColor="#c40c24" />
          <stop offset="1" stopColor="#5a0010" />
        </radialGradient>
        <radialGradient id={`${u}socket`} cx="50%" cy="45%" r="55%">
          <stop offset="0" stopColor="#0a0510" stopOpacity="0.95" />
          <stop offset="0.65" stopColor="#1a1024" stopOpacity="0.62" />
          <stop offset="1" stopColor="#1a1024" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${u}blood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d0122f" />
          <stop offset="1" stopColor="#6c0011" />
        </linearGradient>
        <radialGradient id={`${u}gold`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#f6dc8a" />
          <stop offset="0.55" stopColor="#b98a2c" />
          <stop offset="1" stopColor="#5a3c0d" />
        </radialGradient>
        <radialGradient id={`${u}aura`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#8a0a22" stopOpacity="0.34" />
          <stop offset="1" stopColor="#8a0a22" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${u}cloth`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#efe9f1" />
          <stop offset="1" stopColor="#9d94aa" />
        </linearGradient>
      </defs>

      <ellipse className={styles.shadow} cx="80" cy="184" rx="38" ry="4.5" />

      <g className={styles.body}>
        {/* багровое зарево за головой */}
        <circle cx="80" cy="46" r="46" fill={`url(#${u}aura)`} />

        {/* Плащ на широких плечах: чёрный снаружи, кровавый внутри, рваный край тает в темноте */}
        <g className={styles.cape}>
          <path
            d="M30 96 C24 120 18 150 12 178 L20 171 L26 184 L34 172 L42 186 L50 173 L58 187 L66 174 L74 188 L80 176 L86 188 L94 174 L102 187 L110 173 L118 186 L126 172 L134 184 L140 171 L148 178 C142 150 136 120 130 96 C120 86 100 82 80 82 C60 82 40 86 30 96 Z"
            fill={`url(#${u}cloak)`}
          />
          {/* кровавая подкладка видна в распахе плаща */}
          <path
            d="M65 87 C59 110 54 142 50 180 L58 172 L64 182 L72 172 L80 180 L88 172 L96 182 L102 172 L110 180 C106 142 101 110 95 87 Z"
            fill={`url(#${u}lining)`}
          />
          {/* складки плаща и холодный блик на плечах */}
          <path
            d="M38 100 C33 124 28 150 24 170 M122 100 C127 124 132 150 136 170 M50 92 C46 118 43 146 41 168 M110 92 C114 118 117 146 119 168"
            stroke="#2a1c3a"
            strokeWidth="1"
            opacity="0.75"
            fill="none"
          />
          <path
            d="M30 96 C40 86.5 60 82.6 80 82.6 C100 82.6 120 86.5 130 96"
            stroke="#55456f"
            strokeWidth="1.1"
            opacity="0.65"
            fill="none"
          />
        </g>

        {/* Высокий острый воротник за головой: чёрный, с кровавым нутром */}
        <path d="M47 93 L32 15 Q50 45 71.5 73 L66.5 90 Z" fill="#0b0710" />
        <path d="M113 93 L128 15 Q110 45 88.5 73 L93.5 90 Z" fill="#0b0710" />
        <path d="M51.5 89 L37.5 27 Q52.5 52 69.6 74 L65.6 87.5 Z" fill={`url(#${u}collar)`} />
        <path d="M108.5 89 L122.5 27 Q107.5 52 90.4 74 L94.4 87.5 Z" fill={`url(#${u}collar)`} />

        {/* Камзол: уходит вниз и тоже тает в темноте */}
        <path d="M69 86 C73 82.5 87 82.5 91 86 L99 176 L92 170 L86 180 L80 171 L74 180 L68 170 L61 176 Z" fill={`url(#${u}cloak)`} />
        <path d="M69 86 C73 82.5 87 82.5 91 86 L99 176 L92 170 L86 180 L80 171 L74 180 L68 170 L61 176 Z" fill="#0c0812" opacity="0.55" />
        <path d="M71 90 L78.6 124 M89 90 L81.4 124" stroke="#33264a" strokeWidth="1.1" opacity="0.85" fill="none" />
        {[130, 141, 152].map((y) => (
          <circle key={y} cx="80" cy={y} r="1.4" fill="#57441c" stroke="#1a1206" strokeWidth="0.4" />
        ))}

        {/* Шея в тени подбородка */}
        <path d="M73.5 72 L72.5 85 Q80 89 87.5 85 L86.5 72 Z" fill="#6f667f" />
        <path d="M73.5 72 L73 79.5 Q80 84 87 79.5 L86.5 72 Z" fill="#241c30" opacity="0.8" />

        {/* Шейный платок: белый, в пятнах крови */}
        <path d="M72 81 L80 86 L88 81 L90 97 L84.5 105 L80 99.5 L75.5 105 L70 97 Z" fill={`url(#${u}cloth)`} />
        <path d="M80 86 L80 99.5 M75.2 88.6 L74 98 M84.8 88.6 L86 98" stroke="#7b728c" strokeWidth="0.7" opacity="0.7" fill="none" />
        {BLOOD_SPOTS.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#8a0015" />
        ))}
        <path d="M77.6 90.6 L77.3 94.6" stroke="#8a0015" strokeWidth="0.9" strokeLinecap="round" />

        {/* Старинный медальон с фигурными скобками — символ пропсов */}
        <path d="M70 88 Q80 110 90 88" fill="none" stroke="#8a6620" strokeWidth="1.1" />
        <circle cx="80" cy="113.5" r="7" fill={`url(#${u}gold)`} stroke="#33220a" strokeWidth="1.2" />
        <circle cx="80" cy="113.5" r="5.2" fill="none" stroke="#5a3d10" strokeWidth="0.5" opacity="0.85" />
        <text x="80" y="116.4" textAnchor="middle" fontSize="7.4" fontWeight="700" fill="#2a1900" fontFamily="monospace">
          {'{}'}
        </text>

        {/* Голова */}
        <g className={styles.head} transform="translate(80 80) scale(0.9) translate(-80 -80)">
          {/* острые уши */}
          <path d="M59.5 47 C55.2 44 52.4 36 52 25 C56.2 29.5 59.4 34.5 60.6 39.5 Z" fill="#9a91a9" stroke="#3a3248" strokeWidth="0.6" />
          <path
            d="M100.5 47 C104.8 44 107.6 36 108 25 C103.8 29.5 100.6 34.5 99.4 39.5 Z"
            fill="#9a91a9"
            stroke="#3a3248"
            strokeWidth="0.6"
          />
          <path
            d="M58.6 43 C56.4 39.6 54.8 35 54.2 30.4 M101.4 43 C103.6 39.6 105.2 35 105.8 30.4"
            stroke="#4a4160"
            strokeWidth="0.8"
            fill="none"
          />

          {/* узкое вытянутое лицо с острым подбородком */}
          <path
            d="M80 18 C92 18 100.6 26 101.6 38 C102.3 45 101.1 51 98.6 56.6 C96 62.6 91.6 71.6 86 76.8 C83 79.6 77 79.6 74 76.8 C68.4 71.6 64 62.6 61.4 56.6 C58.9 51 57.7 45 58.4 38 C59.4 26 68 18 80 18 Z"
            fill={`url(#${u}skin)`}
            stroke="#2b2438"
            strokeWidth="0.8"
          />

          {/* тени: лоб, виски, провалы щёк, глазницы */}
          <path
            d="M60 36 C62 25 70 19.5 80 19.5 C90 19.5 98 25 100 36 C93 31.5 86.5 30.5 80 33.5 C73.5 30.5 67 31.5 60 36 Z"
            fill="#241c33"
            opacity="0.5"
          />
          <path d="M60.6 53.4 C64.2 60.6 69.2 68.6 74.8 74.6 C71.2 67.6 68.8 61.4 67.8 54.8 Z" fill="#2a2238" opacity="0.46" />
          <path d="M99.4 53.4 C95.8 60.6 90.8 68.6 85.2 74.6 C88.8 67.6 91.2 61.4 92.2 54.8 Z" fill="#2a2238" opacity="0.46" />
          <ellipse cx="70" cy="45.4" rx="9.8" ry="6.8" fill={`url(#${u}socket)`} />
          <ellipse cx="90" cy="45.4" rx="9.8" ry="6.8" fill={`url(#${u}socket)`} />
          {/* морщины: лоб, складка между бровей, носогубные складки, вена на виске */}
          <path
            d="M70.5 27.5 Q80 25 89.5 27.5 M78.7 36.6 L79.3 41 M81.3 36.6 L80.7 41 M74.4 60.6 C72.4 63.4 71.4 66.4 71.7 69.4 M85.6 60.6 C87.6 63.4 88.6 66.4 88.3 69.4"
            stroke="#3a3248"
            strokeWidth="0.85"
            opacity="0.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M61.4 37 C62.8 35.4 62.2 33.4 63.8 31.8 M98.6 37 C97.2 35.4 97.8 33.4 96.2 31.8"
            stroke="#5c6ea8"
            strokeWidth="0.6"
            opacity="0.55"
            fill="none"
          />

          {/* волосы, зачёсанные назад, с «вдовьим мыском» и сединой на висках */}
          <path
            d="M58.2 40 C55.4 22 67 9.5 80 9.5 C93 9.5 104.6 22 101.8 40 C99.6 31 94 25.6 87.6 24.2 L80 33.4 L72.4 24.2 C66 25.6 60.4 31 58.2 40 Z"
            fill="#07040b"
          />
          <path
            d="M66 16.4 C71.6 12.8 77.6 11.8 84 12.6 M88 14 C92 15.6 95.4 18.4 97.6 22"
            stroke="#3b3352"
            strokeWidth="1"
            opacity="0.7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M60.4 33.6 C61.4 28.4 64 24.8 67.6 22.6 M99.6 33.6 C98.6 28.4 96 24.8 92.4 22.6"
            stroke="#7d7690"
            strokeWidth="0.9"
            opacity="0.75"
            fill="none"
            strokeLinecap="round"
          />

          {/* тяжёлые злые брови */}
          <path className={styles.browLeft} d="M59.6 37.2 L78 42.4 L77.2 45 L61 40.4 Z" fill="#07040b" />
          <path className={styles.browRight} d="M100.4 37.2 L82 42.4 L82.8 45 L99 40.4 Z" fill="#07040b" />

          {/* Глаза: кровавая радужка горит, зрачок-щель (моргают) */}
          <g className={styles.eyes}>
            <path d="M63.4 46.4 Q70 41.8 76.8 46.6 Q70 49.8 63.4 46.4 Z" fill="#cdc2c4" />
            <path d="M83.2 46.6 Q90 41.8 96.6 46.4 Q90 49.8 83.2 46.6 Z" fill="#cdc2c4" />
            <g className={styles.irises}>
              <g className={styles.glow} filter="url(#g-glow)">
                <circle cx="70.2" cy="46" r="2.7" fill={`url(#${u}iris)`} />
                <circle cx="89.8" cy="46" r="2.7" fill={`url(#${u}iris)`} />
              </g>
              <ellipse cx="70.2" cy="46" rx="0.75" ry="2.5" fill="#150004" />
              <ellipse cx="89.8" cy="46" rx="0.75" ry="2.5" fill="#150004" />
              <circle cx="71.2" cy="44.9" r="0.6" fill="#fff" />
              <circle cx="90.8" cy="44.9" r="0.6" fill="#fff" />
            </g>
            {/* веки: верхнее тяжёлое, под глазами — тёмные круги */}
            <path
              d="M63.2 46.4 Q70 41.4 77 46.6 M83 46.6 Q90 41.4 96.8 46.4"
              stroke="#140a14"
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M64.6 49.4 Q70 51.6 75.6 49.6 M84.4 49.6 Q90 51.6 95.4 49.4"
              stroke="#3a2a48"
              strokeWidth="1"
              opacity="0.7"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Злорадные глаза-щели (настроение happy) */}
          <g className={styles.happyEyes} filter="url(#g-glow)">
            <path d="M63.6 47.2 Q70 42.6 76.8 45.8" fill="none" stroke="#ff2a3d" strokeWidth="2.3" strokeLinecap="round" />
            <path d="M96.4 47.2 Q90 42.6 83.2 45.8" fill="none" stroke="#ff2a3d" strokeWidth="2.3" strokeLinecap="round" />
          </g>

          {/* Нос с горбинкой: снизу свет, сбоку тень */}
          <path
            d="M80 43.4 C79.2 50 77.8 56 76.4 60 C77.6 62.3 82.4 62.3 83.6 60 C82.2 56 80.8 50 80 43.4 Z"
            fill="#a39aaf"
            opacity="0.5"
          />
          <path d="M81.5 46 C82.3 52 83.1 57 83.8 59.8" stroke="#463e59" strokeWidth="1" opacity="0.65" fill="none" strokeLinecap="round" />
          <path d="M77 61.8 Q80 63.6 83 61.8" stroke="#f6eadd" strokeWidth="0.9" opacity="0.85" fill="none" strokeLinecap="round" />
          <ellipse cx="78.3" cy="61" rx="1" ry="0.7" fill="#1a1222" />
          <ellipse cx="81.7" cy="61" rx="1" ry="0.7" fill="#1a1222" />

          {/* Рот: тонкая жестокая усмешка, длинные клыки в крови */}
          <g className={styles.mouthSmile}>
            <path d="M71.4 67.4 C75 65.9 78 65.5 80 66.5 C82 65.5 85 65.9 88.6 67.4 C85 69 75 69 71.4 67.4 Z" fill="#4c0f1d" />
            <path
              d="M70.2 67.2 C74 69.9 86 69.9 89.8 67.2 M70.2 67.2 L69 66 M89.8 67.2 L91 66"
              stroke="#1b050b"
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M75.4 72 Q80 73.4 84.6 72" stroke="#6d6280" strokeWidth="0.8" opacity="0.6" fill="none" strokeLinecap="round" />
            <path d="M74.6 68.3 L76.3 76 L78 68.7 Z M82 68.7 L83.7 76 L85.4 68.3 Z" fill="#f3ede1" stroke="#7d7488" strokeWidth="0.4" />
            <path d="M75.75 73.4 L76.3 76 L76.85 73.4 Z M83.15 73.4 L83.7 76 L84.25 73.4 Z" fill="#b3001d" />
          </g>
          <g className={styles.mouthOpen}>
            <path
              d="M71 66.8 C74.5 65.5 85.5 65.5 89 66.8 C88 74.6 84.6 78.2 80 78.2 C75.4 78.2 72 74.6 71 66.8 Z"
              fill="#1a0308"
              stroke="#1b050b"
              strokeWidth="0.8"
            />
            <ellipse cx="80" cy="75.4" rx="4.2" ry="1.9" fill="#7c1126" />
            <path d="M74.4 66.6 L76.2 74.4 L78 67 Z M82 67 L83.8 74.4 L85.6 66.6 Z" fill="#f3ede1" />
            <path d="M76.9 77.4 L77.7 74.4 L78.5 77.7 Z M81.5 77.7 L82.3 74.4 L83.1 77.4 Z" fill="#e4dccb" />
            <path d="M75.65 71.8 L76.2 74.4 L76.75 71.8 Z M83.25 71.8 L83.8 74.4 L84.35 71.8 Z" fill="#b3001d" />
          </g>

          {/* Кровь: струйка из угла рта и капля, которая срывается с подбородка */}
          <path d="M72 68.6 C71.3 71.6 72.3 74.2 71.6 77" stroke={`url(#${u}blood)`} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <circle className={styles.drip} cx="71.6" cy="78.6" r="1.15" fill="#b3001d" />
        </g>

        {/* Рука-указка: вращается вокруг плеча. Вытянутый палец с когтем указывает на важное */}
        <g className={styles.arm}>
          {/* рисунок сдвинут на плечо плаща: ось вращения руки — точка (54, 94.8), см. .arm в стилях */}
          <g transform="translate(-6 6)">
            {/* круглое «плечо» прячет угол рукава, когда рука поворачивается */}
            <circle cx="60" cy="88.8" r="7.3" fill="#0f0a16" />
            <path d="M62 81.6 L30 84.6 L30 93.6 L62 96 Z" fill="#0f0a16" />
            <path d="M34 85.2 L33.6 93.4 M40 84.6 L39.6 94" stroke="#2a1c3a" strokeWidth="0.8" opacity="0.8" fill="none" />
            <path d="M30 84.2 L25.4 84.8 L25.4 93.4 L30 94 Z" fill={`url(#${u}cloth)`} />
            <circle cx="27.4" cy="91.6" r="0.8" fill="#8a0015" />
            {/* кисть: ладонь, большой палец, три поджатых пальца */}
            <path
              d="M25.4 85.6 C22 85 18.6 85.6 16.8 87.4 C15.6 88.8 15.8 91.2 17.2 92.4 C19.6 93.7 23 93.3 25.4 92.6 Z"
              fill="#b6adbc"
              stroke="#5c5370"
              strokeWidth="0.4"
            />
            <path
              d="M22.4 85.6 C21 82.8 19.4 81.2 17.6 80.8 C16.9 81.8 18.4 84.2 19.8 86.2 Z"
              fill="#c4bcc9"
              stroke="#5c5370"
              strokeWidth="0.4"
            />
            <path d="M17.6 80.8 L15.8 79 L17.9 81.9 Z" fill="#24101a" />
            <circle cx="15.8" cy="90.6" r="1.9" fill="#a9a0b1" stroke="#5c5370" strokeWidth="0.4" />
            <circle cx="17.8" cy="92.7" r="1.8" fill="#a9a0b1" stroke="#5c5370" strokeWidth="0.4" />
            <circle cx="20.4" cy="93.6" r="1.7" fill="#a9a0b1" stroke="#5c5370" strokeWidth="0.4" />
            {/* указательный палец: суставы и длинный коготь в крови */}
            <path
              d="M17.6 86.4 C13 85.3 8.6 84.8 4.4 84.9 C3.3 85 3.3 86.5 4.4 86.7 C8.6 87.1 13 87.9 17.2 88.9 Z"
              fill="#c9c1cd"
              stroke="#5c5370"
              strokeWidth="0.4"
            />
            <path d="M12.4 85.3 L12.2 87.5 M8.2 84.9 L8.1 87" stroke="#5c5370" strokeWidth="0.5" opacity="0.8" />
            <path d="M4.9 84.8 L-1.4 84.5 L4.7 86.8 Z" fill="#24101a" />
            <path d="M1.2 84.7 L-1.4 84.5 L1.1 85.5 Z" fill="#b3001d" />
          </g>
        </g>
      </g>
    </svg>
  );
}
