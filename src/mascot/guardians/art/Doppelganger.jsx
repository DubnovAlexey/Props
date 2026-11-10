// Тень-двойник — хозяин Зеркального грота (виртуальный DOM).
// Копия без плоти, как виртуальный DOM — лёгкая копия страницы в памяти.
import { Trail } from '../gore.jsx';

const SILHOUETTE =
  'M100 46 C124 46 138 64 138 88 C138 108 128 122 118 128 C140 134 160 146 170 170 L176 200 L24 200 L30 170 C40 146 60 134 82 128 C72 122 62 108 62 88 C62 64 76 46 100 46 Z';

export default function Doppelganger({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}glass`} cx="50%" cy="40%" r="65%">
          <stop offset="0" stopColor="#2a3446" />
          <stop offset="0.6" stopColor="#0d121b" />
          <stop offset="1" stopColor="#030407" />
        </radialGradient>
        <linearGradient id={`${u}frame`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a4c30" />
          <stop offset="0.5" stopColor="#b59d63" />
          <stop offset="1" stopColor="#3a2f1a" />
        </linearGradient>
      </defs>

      {/* старое зеркало в бронзовой раме, по стеклу — трещины */}
      <ellipse cx="100" cy="100" rx="80" ry="94" fill={`url(#${u}glass)`} stroke={`url(#${u}frame)`} strokeWidth="9" />
      <path
        d="M58 30 L74 64 L66 86 L84 112 M150 42 L134 72 L144 96 M40 130 L62 142 L58 164"
        stroke="#dfe8f5"
        strokeWidth="1"
        opacity="0.35"
        fill="none"
      />

      {/* удар по стеклу: лучи трещин и выпавший осколок */}
      <path d="M146 60 L160 40 L166 58 Z" fill="#020305" />
      <path
        d="M146 60 L160 40 M146 60 L174 70 M146 60 L132 44 M146 60 L140 86 M146 60 L164 94 M146 60 L122 62"
        stroke="#dfe8f5"
        strokeWidth="0.8"
        opacity="0.45"
        fill="none"
      />

      {/* «копия» — призрачное отражение, сдвинутое в сторону */}
      <path d={SILHOUETTE} fill="#9fb2cc" opacity="0.08" transform="translate(9 3)" />

      <g filter="url(#g-flesh)">
        <path d={SILHOUETTE} fill="#06070b" />
        {/* дымные края тени */}
        <path
          className="g-sway"
          d="M62 90 C50 80 52 64 44 56 M138 90 C150 80 148 64 156 56 M84 50 C80 38 86 28 80 18"
          stroke="#06070b"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
      </g>

      {/* слишком широкая улыбка, полная белого света */}
      <g filter="url(#g-glow)">
        <path d="M74 106 C88 122 112 122 126 106 C114 116 86 116 74 106 Z" fill="#eaf6ff" opacity="0.9" />
      </g>
      <path
        d="M80 110 L82 114 M88 113 L89 117 M96 114 L96 118 M104 114 L104 118 M112 113 L111 117 M120 110 L118 114"
        stroke="#06070b"
        strokeWidth="1.4"
      />

      {/* кровавый отпечаток ладони на стекле — изнутри зеркала */}
      <g opacity="0.8">
        <ellipse cx="54" cy="152" rx="7" ry="8.4" fill="#99091e" />
        <path
          d="M49 146 L45.6 134 M53 143.6 L51.6 130 M57.4 143.6 L58.6 131 M61.4 146.4 L65 136.6 M61 153.6 L68.6 149.4"
          stroke="#99091e"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path d="M50 148 L50.6 152 M56 149 L56.4 154" stroke="#4a0410" strokeWidth="0.7" />
      </g>
      <Trail d="M51.4 160 C52 166 50.8 171 51.6 177" width={1.6} opacity={0.85} />
      <Trail d="M57.2 160 C57.6 164 56.8 167 57.4 170" width={1.2} opacity={0.8} />
      <Trail d="M124.6 108 C125.6 113 124.6 118 125.4 123" width={1.3} opacity={0.9} />

      {/* пустые светящиеся глаза */}
      <g className="g-eye" filter="url(#g-glow)" fill="#f2f9ff">
        <path d="M78 86 Q87 79 96 86 Q87 90 78 86 Z" />
        <path d="M104 86 Q113 79 122 86 Q113 90 104 86 Z" />
      </g>
    </>
  );
}
