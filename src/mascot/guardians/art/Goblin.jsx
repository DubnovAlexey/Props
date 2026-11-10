// Гоблин-кочегар Шнырь — хозяин Кострового грота (устройство проекта).
// Держит факел — как npm и Vite держат проект: без них ничего не горит.
import { Drop, Splatter, Tips, Trail } from '../gore.jsx';

const UPPER = [70, 78, 86, 94, 100, 106, 114, 122, 130];
const upperY = (x) => 141 - (x - 100) ** 2 * 0.00694;
// длина зуба: неровные, один выбит, один сломан
const LEN = [7, 9, 6, 0, 10, 8, 4, 9, 7];
// брызги крови на ошейнике: [x, y, радиус]
const BLOOD_SPOTS = [
  [126, 150, 1.4],
  [96, 172, 1.6],
  [108, 176, 1.1],
  [86, 178, 0.9],
];

export default function Goblin({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}sk`} cx="45%" cy="84%" r="78%">
          <stop offset="0" stopColor="#a7ad62" />
          <stop offset="0.35" stopColor="#626d2e" />
          <stop offset="0.72" stopColor="#2a3010" />
          <stop offset="1" stopColor="#0b0d04" />
        </radialGradient>
        <linearGradient id={`${u}ear`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#12160a" />
          <stop offset="1" stopColor="#55602a" />
        </linearGradient>
        <radialGradient id={`${u}mo`} cx="50%" cy="25%" r="75%">
          <stop offset="0" stopColor="#4a0a0a" />
          <stop offset="1" stopColor="#0d0101" />
        </radialGradient>
        <linearGradient id={`${u}tooth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8c896" />
          <stop offset="1" stopColor="#7d6c3e" />
        </linearGradient>
        <radialGradient id={`${u}eye`} cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor="#fff4a0" />
          <stop offset="0.55" stopColor="#ffc22e" />
          <stop offset="1" stopColor="#b3401a" />
        </radialGradient>
        <radialGradient id={`${u}fl`} cx="50%" cy="78%" r="70%">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="0.4" stopColor="#ffb43c" />
          <stop offset="0.85" stopColor="#e2531c" />
          <stop offset="1" stopColor="#e2531c" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g filter="url(#g-flesh)">
        {/* плечи в рваной коже и ошейник с шипами */}
        <path d="M30 200 C38 176 66 166 100 166 C134 166 162 176 170 200 Z" fill="#1a170e" />
        <path d="M60 174 C80 166 120 166 140 174 L138 184 C118 177 82 177 62 184 Z" fill="#33200f" />
        {[70, 86, 100, 114, 130].map((x) => (
          <path key={x} d={`M${x - 3} 176 L${x} 167 L${x + 3} 176 Z`} fill="#7c8189" />
        ))}

        {/* уши: длинные, одно порвано */}
        <path d="M62 80 C50 73 40 67 34 64 L30 71 L25 59 C18 55 12 50 6 46 C18 64 36 84 58 104 Z" fill={`url(#${u}ear)`} />
        <path d="M58 87 C44 79 30 69 18 59 C30 71 42 85 56 98 Z" fill="#2b1410" opacity="0.6" />
        <g transform="translate(200 0) scale(-1 1)">
          <path d="M62 80 C50 73 36 64 6 46 C18 64 36 84 58 104 Z" fill={`url(#${u}ear)`} />
          <path d="M58 87 C44 79 30 69 18 59 C30 71 42 85 56 98 Z" fill="#2b1410" opacity="0.6" />
        </g>

        {/* голова */}
        <path d="M100 40 C134 40 152 64 150 98 C148 130 132 156 100 168 C68 156 52 130 50 98 C48 64 66 40 100 40 Z" fill={`url(#${u}sk)`} />
        <path
          d="M84 46 C86 54 82 60 86 68 M118 44 C116 52 122 58 118 66 M100 42 C98 50 102 54 100 60"
          stroke="#2a340f"
          strokeWidth="1.3"
          opacity="0.7"
          fill="none"
        />
        <path d="M76 62 Q100 54 124 62 M80 71 Q100 64 120 71" stroke="#151905" strokeWidth="2" opacity="0.6" fill="none" />

        {/* объём: впадины щёк, носогубные складки, тень глазниц */}
        <g filter="url(#g-blur)" opacity="0.8">
          <ellipse cx="66" cy="124" rx="10" ry="15" fill="#0a0c03" opacity="0.55" />
          <ellipse cx="134" cy="124" rx="10" ry="15" fill="#0a0c03" opacity="0.55" />
          <path d="M88 122 C80 128 74 136 72 146 M112 122 C120 128 126 136 128 146" stroke="#0a0c03" strokeWidth="4" fill="none" />
          <ellipse cx="81" cy="97" rx="17" ry="11" fill="#050601" />
          <ellipse cx="119" cy="97" rx="17" ry="11" fill="#050601" />
        </g>
        <path d="M66 140 C80 160 120 160 134 140" stroke="#ffb46a" strokeWidth="2" opacity="0.3" fill="none" />

        {/* глазницы и злые брови */}
        <ellipse cx="81" cy="99" rx="14" ry="9" fill="#070803" />
        <ellipse cx="119" cy="99" rx="14" ry="9" fill="#070803" />
        <path
          d="M62 88 C74 82 88 86 98 98 L100 102 L102 98 C112 86 126 82 138 88 C134 80 122 76 110 82 C106 84 102 88 100 92 C98 88 94 84 90 82 C78 76 66 80 62 88 Z"
          fill="#0f1204"
        />

        {/* крючковатый нос */}
        <path d="M100 96 C104 110 114 124 111 133 C108 138 98 138 94 133 C94 124 97 110 100 96 Z" fill="#3b4418" />
        <path d="M96 133 C100 136 106 136 110 132" stroke="#e0a060" strokeWidth="1.5" opacity="0.45" fill="none" />
        <ellipse cx="98" cy="132" rx="2.2" ry="1.4" fill="#0b0d03" />
        <ellipse cx="106" cy="132" rx="2.2" ry="1.4" fill="#0b0d03" />

        {/* бородавки и зашитый шрам */}
        {[
          [68, 118, 2.6],
          [133, 112, 2.2],
          [127, 122, 1.8],
          [74, 66, 1.6],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#5f6a2e" stroke="#1c2008" strokeWidth="0.7" />
        ))}
        <path d="M58 104 L77 124" stroke="#3a0f0a" strokeWidth="2.4" />
        <path d="M61 110 L65 106 M65 115 L69 111 M69 120 L73 116" stroke="#1f0a06" strokeWidth="1.2" />

        {/* пасть: дёсны, гнилые зубы, язык */}
        <path d="M64 132 C80 144 120 144 136 132 C130 152 116 160 100 160 C84 160 70 152 64 132 Z" fill={`url(#${u}mo)`} />
        <ellipse cx="100" cy="153" rx="15" ry="4.5" fill="#5a1414" />
        <path d="M66 133 C80 145 120 145 134 133 C120 140 80 140 66 133 Z" fill="#6a1a1a" />
        <path
          d={UPPER.map((x, i) =>
            LEN[i] ? `M${x - 3.6} ${upperY(x) - 0.5} L${x} ${upperY(x) + LEN[i]} L${x + 3.6} ${upperY(x) - 0.5} Z` : '',
          ).join(' ')}
          fill={`url(#${u}tooth)`}
          stroke="#2a1e0c"
          strokeWidth="0.7"
        />
        <path d="M78 157 L82 143 L86 157 Z M114 157 L118 143 L122 157 Z" fill={`url(#${u}tooth)`} stroke="#2a1e0c" strokeWidth="0.7" />
        <path d="M80 147 L81.5 151 M116 147 L117.5 151" stroke="#fff" strokeWidth="0.7" opacity="0.5" />
      </g>

      <path className="g-drip" d="M90 157 q1 7 -1 12" stroke="#d9e3a0" strokeWidth="1.6" opacity="0.7" fill="none" />

      {/* налитые кровью жёлтые глаза со зрачком-щелью */}
      <g className="g-eye" filter="url(#g-glow)">
        <path d="M70 99 Q81 90 92 99 Q81 105 70 99 Z" fill={`url(#${u}eye)`} />
        <path d="M108 99 Q119 90 130 99 Q119 105 108 99 Z" fill={`url(#${u}eye)`} />
      </g>
      <ellipse cx="81" cy="98.6" rx="1.7" ry="4.6" fill="#170b00" />
      <ellipse cx="119" cy="98.6" rx="1.7" ry="4.6" fill="#170b00" />
      <circle cx="78" cy="97" r="0.9" fill="#fff" opacity="0.8" />
      <circle cx="116" cy="97" r="0.9" fill="#fff" opacity="0.8" />

      {/* кровь: на клыках, из угла пасти по подбородку, из шрама на щеке; лопнувшие сосуды в глазах */}
      <Tips
        tips={[
          [78, 146.6, 5],
          [100, 151, 5.5],
          [122, 146.6, 5],
          [82, 143, 5, 'up'],
          [118, 143, 5, 'up'],
        ]}
        width={3}
      />
      <Trail d="M131.5 140 C131 147 127 153 121.5 158.5" width={2} />
      <Trail d="M70 117 C70.6 121 69.4 124.4 70 128.5" width={1.4} opacity={0.85} />
      <Splatter spots={BLOOD_SPOTS} />
      <Drop cx={121} cy={162} r={1.7} />
      <path
        d="M71.6 99.2 L75.6 98.2 M73 100.6 L76 100 M128.4 99.2 L124.4 98.2 M127 100.6 L124 100"
        stroke="#b3001d"
        strokeWidth="0.5"
        opacity="0.8"
      />

      {/* факел */}
      <path d="M24 200 L35 160 L44 162 L35 200 Z" fill="#3b2412" />
      <g className="g-flicker">
        <path d="M40 162 C24 152 28 132 37 116 C37 130 44 134 46 125 C55 139 55 154 40 162 Z" fill={`url(#${u}fl)`} filter="url(#g-glow)" />
        <path d="M40 157 C34 151 36 141 40 135 C42 143 46 145 47 141 C49 149 46 155 40 157 Z" fill="#fff3b0" opacity="0.9" />
      </g>
    </>
  );
}
