// Оборотень Вихрь — хозяин Пещеры скорости (memo и производительность).
// Быстрее всех и не тратит сил зря — как memo пропускает лишние рендеры.
import { Drop, Splatter, Tips, Trail } from '../gore.jsx';

const FUR =
  'M100 30 L110 44 L126 30 L130 50 L150 42 L146 62 L168 66 L154 82 L170 96 L150 104 L162 122 L140 124 L146 146 L124 140 L120 164 L100 150 L80 164 L76 140 L54 146 L60 124 L38 122 L50 104 L30 96 L46 82 L32 66 L54 62 L50 42 L70 50 L74 30 L90 44 Z';

// брызги крови на шерсти у пасти: [x, y, радиус]
const BLOOD_SPOTS = [
  [73, 132, 1.6],
  [127, 134, 1.4],
  [69, 143, 1.1],
  [131, 146, 1.2],
  [100, 163, 1.6],
  [92, 167, 1],
];

export default function Werewolf({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}fur`} cx="50%" cy="78%" r="75%">
          <stop offset="0" stopColor="#7a7880" />
          <stop offset="0.45" stopColor="#3c3a40" />
          <stop offset="0.85" stopColor="#141317" />
          <stop offset="1" stopColor="#060608" />
        </radialGradient>
        <radialGradient id={`${u}snout`} cx="50%" cy="70%" r="65%">
          <stop offset="0" stopColor="#8e8a8c" />
          <stop offset="0.6" stopColor="#4a464a" />
          <stop offset="1" stopColor="#1c1a1d" />
        </radialGradient>
        <radialGradient id={`${u}maw`} cx="50%" cy="30%" r="70%">
          <stop offset="0" stopColor="#6a1018" />
          <stop offset="1" stopColor="#140204" />
        </radialGradient>
        <linearGradient id={`${u}fang`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2ead6" />
          <stop offset="1" stopColor="#a8987a" />
        </linearGradient>
      </defs>

      {/* луна за спиной */}
      <circle cx="50" cy="44" r="30" fill="#f1e7b8" opacity="0.18" filter="url(#g-blur)" />

      <g filter="url(#g-flesh)">
        {/* уши: одно разорвано */}
        <path d="M58 64 L40 12 L80 46 Z" fill="#26242a" />
        <path d="M60 56 L48 26 L72 46 Z" fill="#4a1a20" />
        <path d="M142 64 L160 12 L148 22 L152 30 L120 46 Z" fill="#26242a" />
        <path d="M140 56 L150 28 L128 46 Z" fill="#4a1a20" />

        {/* голова — рваная шерсть */}
        <path d={FUR} fill={`url(#${u}fur)`} />
        <path d="M60 80 L70 86 M140 80 L130 86 M56 104 L66 106 M144 104 L134 106" stroke="#0a0a0c" strokeWidth="1.6" />
        <g filter="url(#g-blur)" opacity="0.85">
          <ellipse cx="78" cy="88" rx="15" ry="8" fill="#050506" />
          <ellipse cx="122" cy="88" rx="15" ry="8" fill="#050506" />
        </g>
        {/* злые брови-складки */}
        <path d="M60 80 L94 90 L100 86 L106 90 L140 80 L136 74 L106 84 L100 82 L94 84 L64 74 Z" fill="#0c0b0e" />

        {/* морда с оскалом */}
        <path d="M76 100 C80 92 120 92 124 100 C132 122 126 146 100 156 C74 146 68 122 76 100 Z" fill={`url(#${u}snout)`} />
        <path
          d="M86 102 C90 110 92 116 92 122 M114 102 C110 110 108 116 108 122 M80 112 C86 114 90 118 92 124 M120 112 C114 114 110 118 108 124"
          stroke="#1c1a1d"
          strokeWidth="1.6"
          opacity="0.85"
          fill="none"
        />
        <path d="M90 104 C94 98 106 98 110 104 C108 110 92 110 90 104 Z" fill="#0b0a0c" />
        <path d="M94 101 C97 100 101 100 103 101" stroke="#fff" strokeWidth="0.9" opacity="0.5" />

        <path d="M78 128 C88 124 112 124 122 128 C120 146 110 156 100 158 C90 156 80 146 78 128 Z" fill={`url(#${u}maw)`} />
        {/* клыки и резцы */}
        <path d="M80 128 L84 146 L88 129 Z M120 128 L116 146 L112 129 Z" fill={`url(#${u}fang)`} stroke="#2a2418" strokeWidth="0.6" />
        <path
          d="M90 127 L92 133 L94 127 Z M96 126 L98 132 L100 126 Z M100 126 L102 132 L104 126 Z M106 127 L108 133 L110 127 Z"
          fill={`url(#${u}fang)`}
          stroke="#2a2418"
          strokeWidth="0.5"
        />
        <path d="M88 154 L90 144 L93 155 Z M112 154 L110 144 L107 155 Z" fill={`url(#${u}fang)`} stroke="#2a2418" strokeWidth="0.5" />
      </g>

      {/* кровь на клыках и морде, шрам через глаз, следы чужих когтей на щеке */}
      <Tips
        tips={[
          [84, 146, 7],
          [116, 146, 7],
          [92, 133, 3],
          [108, 133, 3],
          [90, 144, 4, 'up'],
          [110, 144, 4, 'up'],
        ]}
        width={3}
      />
      <Trail d="M79 134 C76 142 78 150 76 158" width={2} />
      <Trail d="M121 134 C124 141 122 147 123.6 153" width={1.6} opacity={0.9} />
      <Splatter spots={BLOOD_SPOTS} />
      <Drop cx={76} cy={161.5} r={1.7} />
      <Drop cx={123.6} cy={156.5} r={1.4} late />
      <path d="M64 72 L90 104" stroke="#08080a" strokeWidth="2" strokeLinecap="round" />
      <path d="M65.2 71.4 L91.2 103.4" stroke="#a0787c" strokeWidth="0.5" opacity="0.7" />
      <path d="M138 100 L150 118 M144 98 L156 116 M150 96 L160 112" stroke="#6a0c18" strokeWidth="1.5" strokeLinecap="round" />

      {/* нити слюны */}
      <path
        d="M84 140 C86 146 88 148 90 152 M116 140 C114 146 112 148 110 152"
        stroke="#e6e6ea"
        strokeWidth="0.6"
        opacity="0.6"
        fill="none"
      />

      {/* жёлтые глаза хищника */}
      <g className="g-eye" filter="url(#g-glow)">
        <path d="M66 90 Q78 82 90 92 Q78 96 66 90 Z" fill="#ffd34a" />
        <path d="M134 90 Q122 82 110 92 Q122 96 134 90 Z" fill="#ffd34a" />
      </g>
      <circle cx="79" cy="90" r="2" fill="#140c00" />
      <circle cx="121" cy="90" r="2" fill="#140c00" />
    </>
  );
}
