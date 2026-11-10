// Минотавр-кузнец Наковальня — хозяин Подземной мастерской (формы и паттерны).
// Куёт в лабиринте-мастерской формы и паттерны — инструменты на все случаи.
import { Drop, Splatter, Trail } from '../gore.jsx';

function Horn({ u }) {
  return (
    <>
      <path
        d="M66 72 C42 68 18 52 10 22 C26 40 44 46 62 50 C68 56 70 64 66 72 Z"
        fill={`url(#${u}horn)`}
        stroke="#1a1208"
        strokeWidth="1"
      />
      <path d="M26 38 L30 44 M38 46 L41 52 M50 50 L52 56" stroke="#3a2c18" strokeWidth="1.2" />
    </>
  );
}

// брызги крови на фартуке: [x, y, радиус]
const BLOOD_SPOTS = [
  [84, 180, 1.8],
  [112, 186, 1.4],
  [100, 176, 1.1],
  [122, 178, 1],
];

export default function Minotaur({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}fur`} cx="50%" cy="82%" r="78%">
          <stop offset="0" stopColor="#8a5030" />
          <stop offset="0.4" stopColor="#4a2414" />
          <stop offset="0.8" stopColor="#1c0c06" />
          <stop offset="1" stopColor="#080402" />
        </radialGradient>
        <linearGradient id={`${u}horn`} x1="1" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3a2f1f" />
          <stop offset="0.5" stopColor="#9a8a64" />
          <stop offset="1" stopColor="#e6d8b4" />
        </linearGradient>
        <radialGradient id={`${u}snout`} cx="50%" cy="80%" r="70%">
          <stop offset="0" stopColor="#9a6a50" />
          <stop offset="0.6" stopColor="#4a2a1a" />
          <stop offset="1" stopColor="#1a0c06" />
        </radialGradient>
      </defs>

      {/* искры из горна */}
      <g className="g-flicker" filter="url(#g-glow)" fill="#ffb347">
        <circle cx="30" cy="160" r="1.6" />
        <circle cx="44" cy="146" r="1.2" />
        <circle cx="164" cy="152" r="1.6" />
        <circle cx="176" cy="168" r="1.2" />
        <circle cx="150" cy="176" r="1" />
      </g>

      <g filter="url(#g-flesh)">
        {/* плечи и кожаный фартук */}
        <path d="M10 200 C20 170 54 156 100 156 C146 156 180 170 190 200 Z" fill="#20100a" />
        <path d="M70 168 L130 168 L136 200 L64 200 Z" fill="#3a2414" />

        <Horn u={u} />
        <g transform="translate(200 0) scale(-1 1)">
          <Horn u={u} />
        </g>
        {/* уши */}
        <path d="M54 84 C40 80 30 86 26 96 C38 98 48 94 58 92 Z M146 84 C160 80 170 86 174 96 C162 98 152 94 142 92 Z" fill="#3a1d10" />

        {/* голова быка */}
        <path
          d="M100 44 C130 44 148 62 150 88 C152 112 140 126 134 140 C128 160 116 174 100 176 C84 174 72 160 66 140 C60 126 48 112 50 88 C52 62 70 44 100 44 Z"
          fill={`url(#${u}fur)`}
        />
        <path d="M80 56 C84 50 90 48 96 52 C100 46 108 46 112 52 C118 48 124 52 122 58" stroke="#140804" strokeWidth="2" fill="none" />
        <path d="M60 100 L74 118 M64 96 L70 104" stroke="#4a1408" strokeWidth="2" />
        <g filter="url(#g-blur)" opacity="0.85">
          <ellipse cx="80" cy="96" rx="15" ry="9" fill="#050201" />
          <ellipse cx="120" cy="96" rx="15" ry="9" fill="#050201" />
        </g>
        <path d="M62 86 L94 96 L100 92 L106 96 L138 86 L134 80 L106 88 L100 86 L94 88 L66 80 Z" fill="#0c0503" />

        {/* морда, ноздри, кольцо в носу */}
        <path
          d="M72 130 C72 116 86 110 100 110 C114 110 128 116 128 130 C128 152 116 166 100 166 C84 166 72 152 72 130 Z"
          fill={`url(#${u}snout)`}
        />
        <ellipse cx="88" cy="140" rx="6.5" ry="4.5" fill="#0b0503" />
        <ellipse cx="112" cy="140" rx="6.5" ry="4.5" fill="#0b0503" />
        <path d="M84 120 C92 116 108 116 116 120" stroke="#e0b090" strokeWidth="1" opacity="0.35" fill="none" />
      </g>
      <circle cx="100" cy="152" r="9" fill="none" stroke="#8a8f99" strokeWidth="3" />
      <path d="M93 147 A9 9 0 0 1 107 147" stroke="#d6dbe2" strokeWidth="1" fill="none" opacity="0.6" />

      {/* кровь на рогах и из ноздри; на лбу — раскалённое клеймо-лабиринт */}
      <Trail d="M11 24 C18 34 28 41 40 45" width={2.2} opacity={0.9} />
      <Trail d="M189 24 C182 34 172 41 160 45" width={1.6} opacity={0.8} />
      <Trail d="M88 144 C87.4 150 88.6 155 88 160" width={1.6} />
      <Splatter spots={BLOOD_SPOTS} />
      <Drop cx={88} cy={163.5} r={1.6} />
      <Drop cx={22} cy={44} r={1.5} late />
      <g className="g-flicker" filter="url(#g-glow)" fill="none" stroke="#ff7a3a" strokeWidth="1.3" strokeLinejoin="round">
        <path d="M93 60 H107 V73 H96 V65 H103 V69 H100" />
      </g>

      {/* пар из ноздрей */}
      <g className="g-sway" fill="#d8d0c8" opacity="0.22" filter="url(#g-blur)">
        <ellipse cx="80" cy="150" rx="10" ry="5" />
        <ellipse cx="120" cy="150" rx="10" ry="5" />
      </g>

      {/* налитые кровью глаза */}
      <g className="g-eye" filter="url(#g-glow)">
        <ellipse cx="80" cy="97" rx="6.4" ry="4" fill="#ff3a1f" />
        <ellipse cx="120" cy="97" rx="6.4" ry="4" fill="#ff3a1f" />
      </g>
      <circle cx="80" cy="97" r="1.6" fill="#1a0200" />
      <circle cx="120" cy="97" r="1.6" fill="#1a0200" />
    </>
  );
}
