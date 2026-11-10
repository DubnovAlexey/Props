// Сороконожка Сотня — хозяйка Пещеры стай (массивы).
// Сегменты тела идут по порядку, как элементы массива: на каждом — свой индекс.
import { Drop, Splatter, Trail } from '../gore.jsx';

const SEGMENTS = [
  [70, 192, 34, 16],
  [80, 171, 33, 15],
  [90, 151, 31, 15],
  [97, 132, 29, 14],
  [101, 114, 27, 13],
];

// брызги крови под жвалами: [x, y, радиус]
const BLOOD_SPOTS = [
  [96, 131, 1.3],
  [106, 134, 1],
  [90, 136, 0.9],
];

export default function Centipede({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}seg`} cx="50%" cy="30%" r="75%">
          <stop offset="0" stopColor="#b5452a" />
          <stop offset="0.5" stopColor="#6a1d10" />
          <stop offset="1" stopColor="#1a0503" />
        </radialGradient>
        <radialGradient id={`${u}head`} cx="50%" cy="70%" r="70%">
          <stop offset="0" stopColor="#c4502e" />
          <stop offset="0.5" stopColor="#6e1e0f" />
          <stop offset="1" stopColor="#160402" />
        </radialGradient>
      </defs>

      {/* усики */}
      <path className="g-sway" d="M88 70 C72 46 58 30 40 16" stroke="#2a0a05" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path className="g-sway" d="M112 70 C128 46 142 30 160 16" stroke="#2a0a05" strokeWidth="2.6" fill="none" strokeLinecap="round" />

      <g filter="url(#g-flesh)">
        {/* лапы — за сегментами */}
        {SEGMENTS.map(([cx, cy, rx]) => (
          <g key={`l${cy}`} stroke="#3a0d06" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d={`M${cx - rx + 4} ${cy} L${cx - rx - 14} ${cy - 7} L${cx - rx - 23} ${cy + 10}`} />
            <path d={`M${cx + rx - 4} ${cy} L${cx + rx + 14} ${cy - 7} L${cx + rx + 23} ${cy + 10}`} />
          </g>
        ))}
        {/* сегменты-элементы массива */}
        {SEGMENTS.map(([cx, cy, rx, ry]) => (
          <g key={`s${cy}`}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${u}seg)`} stroke="#120302" strokeWidth="1.2" />
            <path
              d={`M${cx - rx * 0.6} ${cy - ry * 0.35} Q${cx} ${cy - ry * 1.05} ${cx + rx * 0.6} ${cy - ry * 0.35}`}
              stroke="#e0855a"
              strokeWidth="1.5"
              opacity="0.45"
              fill="none"
            />
          </g>
        ))}

        {/* голова и ядовитые клешни */}
        <ellipse cx="100" cy="86" rx="31" ry="24" fill={`url(#${u}head)`} stroke="#120302" strokeWidth="1.2" />
        <path d="M74 82 C80 72 120 72 126 82" stroke="#e8946a" strokeWidth="1.4" opacity="0.35" fill="none" />
        <path
          d="M86 100 C70 104 63 118 71 131 C74 120 80 112 91 108 Z"
          fill="#2a0805"
          stroke="#e07040"
          strokeWidth="0.6"
          strokeOpacity="0.4"
        />
        <path
          d="M114 100 C130 104 137 118 129 131 C126 120 120 112 109 108 Z"
          fill="#2a0805"
          stroke="#e07040"
          strokeWidth="0.6"
          strokeOpacity="0.4"
        />
        <path d="M93 104 L100 115 L107 104 Z" fill="#120302" />
      </g>

      {/* индексы на сегментах: 0, 1, 2… — массив! */}
      {SEGMENTS.slice()
        .reverse()
        .map(([cx, cy], i) => (
          <text key={`t${cy}`} x={cx} y={cy + 3.5} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#ffd2b0" opacity="0.35">
            {i}
          </text>
        ))}

      {/* добыча в жвалах — обглоданная кость; кровь на клешнях */}
      <path d="M77 123.6 L123 127.6" stroke="#d6ccb6" strokeWidth="3" strokeLinecap="round" />
      <path d="M77 123.6 L123 127.6" stroke="#8d8370" strokeWidth="0.6" opacity="0.7" transform="translate(0 1.1)" />
      <circle cx="76" cy="122.2" r="2.2" fill="#d6ccb6" />
      <circle cx="75.6" cy="125.4" r="2" fill="#d6ccb6" />
      <circle cx="124" cy="126.2" r="2.2" fill="#d6ccb6" />
      <circle cx="124.2" cy="129.4" r="2" fill="#d6ccb6" />
      <Trail d="M78 107 C74 113 71.8 121 71.6 129" width={1.8} opacity={0.9} />
      <Trail d="M122 107 C126 113 128.2 121 128.4 129" width={1.8} opacity={0.9} />
      <Splatter spots={BLOOD_SPOTS} />
      <Drop cx={100} cy={132.5} r={1.5} late />

      <path className="g-drip" d="M71 131 l0 8" stroke="#9be36a" strokeWidth="1.6" fill="none" />
      <path className="g-drip" d="M129 131 l0 8" stroke="#9be36a" strokeWidth="1.6" fill="none" />

      {/* гроздья глаз */}
      <g className="g-eye" filter="url(#g-glow)" fill="#ffb347">
        <circle cx="85" cy="82" r="3" />
        <circle cx="79" cy="87" r="2.2" />
        <circle cx="80" cy="78" r="2" />
        <circle cx="115" cy="82" r="3" />
        <circle cx="121" cy="87" r="2.2" />
        <circle cx="120" cy="78" r="2" />
      </g>
    </>
  );
}
