// Крысиный король Ключник — хозяин Пещеры ключей (key и ref).
// У каждой крысы его свиты на хвосте свой ключ — как key у элемента списка.
import { Drop, Tips, Trail } from '../gore.jsx';

function Key({ x, y, r = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <circle cx="0" cy="0" r="4.5" fill="none" stroke="#c9a24a" strokeWidth="2" />
      <path d="M0 4.5 L0 18 M0 12 L4 12 M0 16 L3 16" stroke="#c9a24a" strokeWidth="2" fill="none" />
    </g>
  );
}

// Свита в темноте: пары красных глаз [x, y]
const PACK = [
  [20, 112],
  [176, 118],
  [31, 140],
  [167, 142],
  [14, 90],
  [184, 94],
];

export default function RatKing({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}fur`} cx="50%" cy="84%" r="78%">
          <stop offset="0" stopColor="#8a8379" />
          <stop offset="0.4" stopColor="#4a4540" />
          <stop offset="0.8" stopColor="#1c1a18" />
          <stop offset="1" stopColor="#080707" />
        </radialGradient>
        <linearGradient id={`${u}crown`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a3a1a" />
          <stop offset="0.5" stopColor="#a88a44" />
          <stop offset="1" stopColor="#3a2c10" />
        </linearGradient>
        <radialGradient id={`${u}ear`} cx="50%" cy="60%" r="60%">
          <stop offset="0" stopColor="#c98f86" />
          <stop offset="1" stopColor="#4a2a28" />
        </radialGradient>
      </defs>

      {/* свита следит из темноты: у каждой крысы — пара красных глаз */}
      <g className="g-eye" fill="#e0222e" filter="url(#g-glow)">
        {PACK.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="1.3" />
            <circle cx={x + 5.4} cy={y + 0.4} r="1.3" />
          </g>
        ))}
      </g>

      {/* узел хвостов внизу, на каждом — ключ */}
      <g stroke="#b98a80" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9">
        <path d="M60 200 C70 180 90 186 100 176 C110 166 130 172 140 200" />
        <path d="M40 196 C60 170 80 196 100 182 C120 168 140 194 160 170" />
        <path d="M30 180 C50 196 76 168 100 188" />
      </g>
      <Key x={36} y={174} r={-20} />
      <Key x={160} y={168} r={18} />
      <Key x={122} y={182} r={6} />

      <g filter="url(#g-flesh)">
        {/* уши с прожилками */}
        <ellipse cx="52" cy="58" rx="20" ry="24" fill={`url(#${u}ear)`} transform="rotate(-20 52 58)" />
        <ellipse cx="148" cy="58" rx="20" ry="24" fill={`url(#${u}ear)`} transform="rotate(20 148 58)" />
        <path d="M48 46 C52 56 50 66 54 74 M152 46 C148 56 150 66 146 74" stroke="#6a2a2a" strokeWidth="1" opacity="0.7" fill="none" />

        {/* голова, вытянутая к зрителю */}
        <path
          d="M100 44 C136 44 156 70 154 100 C152 124 136 138 124 146 C118 160 110 170 100 172 C90 170 82 160 76 146 C64 138 48 124 46 100 C44 70 64 44 100 44 Z"
          fill={`url(#${u}fur)`}
        />
        {/* клочья шерсти и проплешины */}
        <path
          d="M56 86 L48 80 M58 98 L48 98 M144 86 L152 80 M142 98 L152 98 M70 60 L66 52 M130 60 L134 52"
          stroke="#0e0c0b"
          strokeWidth="1.6"
        />
        <ellipse cx="128" cy="76" rx="8" ry="5" fill="#7a5a52" opacity="0.5" />
        <g filter="url(#g-blur)" opacity="0.8">
          <ellipse cx="80" cy="92" rx="14" ry="10" fill="#050404" />
          <ellipse cx="120" cy="92" rx="14" ry="10" fill="#050404" />
        </g>

        {/* корона из ржавой бронзы */}
        <path
          d="M64 46 L70 18 L82 36 L92 12 L100 32 L108 12 L118 36 L130 18 L136 46 Z"
          fill={`url(#${u}crown)`}
          stroke="#1a1206"
          strokeWidth="1.2"
        />
        <circle cx="92" cy="30" r="2.6" fill="#a8122a" />
        <circle cx="108" cy="30" r="2.6" fill="#a8122a" />

        {/* нос, усы, жёлтые резцы */}
        <ellipse cx="100" cy="150" rx="9" ry="6" fill="#a8626a" />
        <path d="M95 149 L97 151 M105 149 L103 151" stroke="#2a0a0e" strokeWidth="1.4" />
        <path
          d="M93 158 L93 177 Q96 180 99 177 L99 158 Z M101 158 L101 177 Q104 180 107 177 L107 158 Z"
          fill="#d7b75a"
          stroke="#3a2a08"
          strokeWidth="0.8"
        />
      </g>

      {/* рваное ухо, шрам через глаз, кровь на резцах и зубцах короны */}
      <path d="M33 43 L45 52 L35 59 Z" fill="#070606" />
      <Trail d="M35 45 L44 52" width={1.2} opacity={0.85} />
      <path d="M68 78 L92 108" stroke="#140a0a" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M69.2 77.4 L93.2 107.4" stroke="#b9767a" strokeWidth="0.5" opacity="0.7" />
      <path
        d="M93.5 169 L98.5 169 L98.5 177 Q96 179.6 93.5 177 Z M101.5 171 L106.5 171 L106.5 177 Q104 179.6 101.5 177 Z"
        fill="#99091e"
        opacity="0.9"
      />
      <Trail d="M104 179 C104.6 183.6 103.4 187.6 104 192" width={1.5} />
      <Drop cx={104} cy={195} r={1.5} />
      <Tips
        tips={[
          [92, 12, 6, 'up'],
          [130, 18, 5, 'up'],
        ]}
        width={3}
      />
      <Trail d="M92 18 C91.4 23 92.6 27 92 31" width={1.2} opacity={0.85} />

      <g className="g-sway" stroke="#d8d4cc" strokeWidth="0.8" opacity="0.6" fill="none">
        <path d="M88 150 C66 144 46 146 22 154 M88 154 C66 154 48 160 28 170 M112 150 C134 144 154 146 178 154 M112 154 C134 154 152 160 172 170" />
      </g>

      {/* красные глаза-бусины */}
      <g className="g-eye" filter="url(#g-glow)">
        <circle cx="80" cy="94" r="5.6" fill="#e0222e" />
        <circle cx="120" cy="94" r="5.6" fill="#e0222e" />
      </g>
      <circle cx="78.4" cy="92.4" r="1.4" fill="#fff" opacity="0.8" />
      <circle cx="118.4" cy="92.4" r="1.4" fill="#fff" opacity="0.8" />
    </>
  );
}
