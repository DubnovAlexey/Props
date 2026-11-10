// Скорпион-ювелир Жало — хозяин Грота самоцветов (children и композиция).
// Прячет самоцветы в панцире, как в шкатулке, — как рамка держит children.
import { Splatter, Tips, Trail } from '../gore.jsx';

const TAIL = [
  [100, 168, 13],
  [118, 150, 12],
  [134, 126, 11],
  [142, 98, 10.5],
  [140, 70, 10],
  [128, 46, 9.5],
  [110, 32, 9],
];

function Claw({ u }) {
  return (
    <>
      <path d="M74 120 C60 112 50 102 40 92" stroke="#3a1c06" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path
        d="M40 92 C12 82 6 52 22 36 C28 54 38 62 52 66 C44 54 44 42 52 32 C64 48 64 72 54 88 Z"
        fill={`url(#${u}shell)`}
        stroke="#140800"
        strokeWidth="1"
      />
      <path d="M24 40 C26 52 34 60 44 64" stroke="#f0b560" strokeWidth="1" opacity="0.35" fill="none" />
      {/* зазубрины на клешне */}
      <path d="M44 56 L47 58 L44 61 M48 46 L51 48 L48 51" stroke="#140800" strokeWidth="1" fill="none" />
    </>
  );
}

// брызги крови под клешнёй: [x, y, радиус]
const BLOOD_SPOTS = [
  [30, 72, 1.3],
  [46, 82, 1],
  [60, 97, 1.2],
  [24, 60, 0.9],
];

export default function Scorpion({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}shell`} cx="45%" cy="35%" r="75%">
          <stop offset="0" stopColor="#d99a3c" />
          <stop offset="0.5" stopColor="#6e3a10" />
          <stop offset="1" stopColor="#170900" />
        </radialGradient>
        <radialGradient id={`${u}gem1`} cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="#b9fff6" />
          <stop offset="1" stopColor="#0e8b80" />
        </radialGradient>
        <radialGradient id={`${u}gem2`} cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ffb3cf" />
          <stop offset="1" stopColor="#a1123f" />
        </radialGradient>
        <radialGradient id={`${u}gem3`} cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="#d7c6ff" />
          <stop offset="1" stopColor="#4a2cbf" />
        </radialGradient>
      </defs>

      <g filter="url(#g-flesh)">
        {/* хвост — над головой, жало целит в тебя */}
        {TAIL.map(([cx, cy, r]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r={r} fill={`url(#${u}shell)`} stroke="#140800" strokeWidth="1" />
            <path
              d={`M${cx - r * 0.6} ${cy - r * 0.4} Q${cx} ${cy - r} ${cx + r * 0.6} ${cy - r * 0.4}`}
              stroke="#f0b560"
              strokeWidth="1"
              opacity="0.4"
              fill="none"
            />
          </g>
        ))}
        <path d="M104 26 C90 30 86 46 92 58 C94 48 98 40 112 34 Z" fill="#1c0b02" stroke="#000" strokeWidth="0.6" />

        {/* клешни */}
        <Claw u={u} />
        <g transform="translate(200 0) scale(-1 1)">
          <Claw u={u} />
        </g>

        {/* лапы */}
        <path
          d="M78 150 L54 160 L46 182 M80 160 L62 176 L58 198 M122 150 L146 160 L154 182 M120 160 L138 176 L142 198"
          stroke="#2a1404"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* панцирь-шкатулка */}
        <path
          d="M68 102 C68 80 84 70 100 70 C116 70 132 80 132 102 C132 132 118 152 100 158 C82 152 68 132 68 102 Z"
          fill={`url(#${u}shell)`}
          stroke="#140800"
          strokeWidth="1.2"
        />
        <path
          d="M74 110 C86 116 114 116 126 110 M76 126 C88 132 112 132 124 126"
          stroke="#140800"
          strokeWidth="1.6"
          opacity="0.8"
          fill="none"
        />
        <path d="M80 80 C90 74 110 74 120 80" stroke="#f7c77a" strokeWidth="1.2" opacity="0.35" fill="none" />
      </g>

      {/* самоцветы внутри панциря — его children */}
      <g>
        <path d="M86 132 L92 124 L98 132 L92 140 Z" fill={`url(#${u}gem1)`} stroke="#063a35" strokeWidth="0.6" />
        <path d="M104 134 L110 126 L118 132 L112 142 Z" fill={`url(#${u}gem2)`} stroke="#4a0018" strokeWidth="0.6" />
        <path d="M96 144 L100 138 L106 144 L100 150 Z" fill={`url(#${u}gem3)`} stroke="#1c0e55" strokeWidth="0.6" />
        <path d="M90 126 L91 128 M108 128 L109 130" stroke="#fff" strokeWidth="1" opacity="0.8" />
      </g>

      {/* кровь на левой клешне и на жале */}
      <Trail d="M24.6 42 C28.6 54 38 61 50 65" width={1.7} opacity={0.9} />
      <Tips
        tips={[
          [22, 36, 7, 'up'],
          [52, 32, 6, 'up'],
          [92, 58.6, 7],
        ]}
        width={3}
      />
      <Splatter spots={BLOOD_SPOTS} />

      {/* капля яда на жале */}
      <circle className="g-drip" cx="92" cy="60" r="2" fill="#b6f06a" filter="url(#g-glow)" />

      {/* глаза */}
      <g className="g-eye" filter="url(#g-glow)" fill="#ffbf3a">
        <circle cx="93" cy="88" r="3.4" />
        <circle cx="107" cy="88" r="3.4" />
        <circle cx="80" cy="94" r="1.8" />
        <circle cx="120" cy="94" r="1.8" />
      </g>
      <circle cx="93" cy="88" r="1.2" fill="#1a0800" />
      <circle cx="107" cy="88" r="1.2" fill="#1a0800" />
    </>
  );
}
