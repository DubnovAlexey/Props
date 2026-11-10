// Крот-почтальон Землерой — хозяин Грота посылок (передача пропсов).
// Роет ходы от родителя к ребёнку и носит посылки. Морда — жуткая «звезда»
// из мокрых щупалец, как у настоящего звездоноса.
import { Drop, Splatter, Tips, Trail } from '../gore.jsx';

const RAYS = Array.from({ length: 20 }, (_, i) => [i * 18, i % 2 ? 11 : 14]);
const CLAWS = [
  'M22 156 C12 140 10 124 15 108 C19 126 25 140 31 152 Z',
  'M32 150 C26 132 26 114 32 99 C35 117 38 134 41 148 Z',
  'M43 147 C40 128 42 110 49 96 C50 114 51 131 51 146 Z',
  'M53 149 C53 131 57 114 65 102 C64 120 62 136 60 150 Z',
];

// брызги крови на лапе и шерсти: [x, y, радиус]
const BLOOD_SPOTS = [
  [28, 160, 1.6],
  [44, 156, 1.1],
  [92, 163, 1],
  [112, 161, 1.2],
];

function Paw({ u }) {
  return (
    <>
      <path d="M14 200 C8 174 18 150 40 148 C56 148 66 162 62 182 L58 200 Z" fill="#7d5a50" />
      <path d="M20 170 C30 162 46 160 58 166" stroke="#3a2620" strokeWidth="2" opacity="0.6" fill="none" />
      {CLAWS.map((d) => (
        <path key={d} d={d} fill={`url(#${u}claw)`} stroke="#241a10" strokeWidth="0.8" />
      ))}
    </>
  );
}

export default function Mole({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}fur`} cx="50%" cy="82%" r="75%">
          <stop offset="0" stopColor="#5e4a3a" />
          <stop offset="0.45" stopColor="#30241b" />
          <stop offset="0.8" stopColor="#15100b" />
          <stop offset="1" stopColor="#060403" />
        </radialGradient>
        <radialGradient id={`${u}ray`} cx="30%" cy="50%" r="75%">
          <stop offset="0" stopColor="#d77a78" />
          <stop offset="0.6" stopColor="#8e3438" />
          <stop offset="1" stopColor="#3a0e12" />
        </radialGradient>
        <linearGradient id={`${u}claw`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#cdbf9e" />
          <stop offset="0.6" stopColor="#6a5a3c" />
          <stop offset="1" stopColor="#1e170c" />
        </linearGradient>
      </defs>

      <g filter="url(#g-flesh)">
        <path
          d="M100 42 C142 42 168 74 168 114 C168 152 142 184 100 188 C58 184 32 152 32 114 C32 74 58 42 100 42 Z"
          fill={`url(#${u}fur)`}
        />
        <path
          d="M60 60 C70 54 80 52 88 52 M118 54 C130 56 140 62 146 70 M50 90 C46 100 44 110 46 120 M150 90 C154 100 156 110 154 120"
          stroke="#070504"
          strokeWidth="2"
          opacity="0.6"
          fill="none"
        />

        {/* ремень почтальона и посылка с сургучом */}
        <path d="M34 150 C70 130 130 116 166 112 L168 122 C132 126 72 140 38 160 Z" fill="#3a2212" />
        <rect x="132" y="148" width="30" height="24" rx="2" fill="#6e5530" transform="rotate(-8 147 160)" />
        <path d="M134 158 L160 154 M146 147 L150 172" stroke="#2a1d0c" strokeWidth="1.6" />
        <circle cx="148" cy="160" r="4" fill="#8a1424" />

        {/* тень вокруг морды */}
        <circle cx="100" cy="117" r="30" fill="#050302" opacity="0.6" filter="url(#g-blur)" />

        {/* звезда из мокрых щупалец разной длины */}
        {RAYS.map(([a, len]) => (
          <ellipse
            key={a}
            cx={100 + len}
            cy="117"
            rx={len * 0.75}
            ry="2.8"
            fill={`url(#${u}ray)`}
            stroke="#2a080b"
            strokeWidth="0.6"
            transform={`rotate(${a} 100 117)`}
          />
        ))}
        {RAYS.map(([a, len]) => (
          <circle key={`t${a}`} cx={100 + len * 1.7} cy="117" r="1.3" fill="#2a080b" transform={`rotate(${a} 100 117)`} />
        ))}
        <circle cx="100" cy="117" r="8" fill="#a8484c" stroke="#2a080b" strokeWidth="0.8" />
        <circle cx="96.5" cy="117" r="1.7" fill="#1a0406" />
        <circle cx="103.5" cy="117" r="1.7" fill="#1a0406" />
        <path d="M95 112 C98 110 102 110 105 112" stroke="#fff" strokeWidth="0.8" opacity="0.45" fill="none" />

        {/* пасть с грязными резцами */}
        <path d="M84 142 C94 150 106 150 116 142 C112 158 88 158 84 142 Z" fill="#1e0606" />
        <path d="M94 144 L96.5 154 L99 144 Z M101 144 L103.5 154 L106 144 Z" fill="#cdbf9e" stroke="#2a1e0c" strokeWidth="0.6" />

        <Paw u={u} />
        <g transform="translate(200 0) scale(-1 1)">
          <Paw u={u} />
        </g>
      </g>

      {/* кровь на когтях левой лапы, на резцах и на шерсти под пастью */}
      <Trail d="M15.6 112 C17.4 124 21.4 138 26.4 150" width={1.8} opacity={0.9} />
      <Trail d="M32.6 103 C33 118 35.4 133 38.4 146" width={1.6} opacity={0.85} />
      <Trail d="M49 100 C48.2 114 48.6 130 49.6 144" width={1.4} opacity={0.8} />
      <Tips
        tips={[
          [96.5, 154.4, 4],
          [103.5, 154.4, 4],
        ]}
        width={2.2}
      />
      <Trail d="M103.5 154 C104 159 102.8 163 103.6 168" width={1.4} />
      <Splatter spots={BLOOD_SPOTS} />
      <Drop cx={103.6} cy={171} r={1.5} />

      {/* крошечные слепые глазки, но злые */}
      <g className="g-eye" filter="url(#g-glow)">
        <circle cx="74" cy="90" r="2.4" fill="#ff3a3a" />
        <circle cx="126" cy="90" r="2.4" fill="#ff3a3a" />
      </g>
    </>
  );
}
