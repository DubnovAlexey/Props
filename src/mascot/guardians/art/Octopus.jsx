// Спрут Глубинник — хозяин Подземной реки (данные с сервера).
// Щупальца тянутся вдаль и возвращаются с добычей позже — как Promise.
const ARMS = [
  'M70 124 C50 140 30 150 8 146 C22 160 46 160 66 146 Z',
  'M78 130 C68 156 50 176 26 190 C46 192 70 176 84 150 Z',
  'M92 134 C90 160 84 182 76 204 L94 204 C98 180 100 160 100 136 Z',
  'M108 134 C110 160 116 182 124 204 L106 204 C102 180 100 160 100 136 Z',
  'M122 130 C132 156 150 176 174 190 C154 192 130 176 116 150 Z',
  'M130 124 C150 140 170 150 192 146 C178 160 154 160 134 146 Z',
];
const SUCKERS = [
  [24, 152],
  [40, 154],
  [54, 150],
  [44, 178],
  [58, 168],
  [70, 158],
  [88, 170],
  [86, 188],
  [112, 170],
  [114, 188],
  [142, 168],
  [156, 178],
  [130, 158],
  [146, 154],
  [160, 152],
  [176, 152],
];

export default function Octopus({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}skin`} cx="50%" cy="80%" r="75%">
          <stop offset="0" stopColor="#a8538f" />
          <stop offset="0.45" stopColor="#5a1d4c" />
          <stop offset="0.85" stopColor="#1c0718" />
          <stop offset="1" stopColor="#080207" />
        </radialGradient>
        <radialGradient id={`${u}eye`} cx="45%" cy="40%" r="65%">
          <stop offset="0" stopColor="#ffe9a0" />
          <stop offset="0.6" stopColor="#d9a024" />
          <stop offset="1" stopColor="#5a3a00" />
        </radialGradient>
      </defs>

      <g filter="url(#g-flesh)">
        {/* щупальца */}
        <g className="g-sway">
          {ARMS.map((d) => (
            <path key={d} d={d} fill={`url(#${u}skin)`} stroke="#140411" strokeWidth="0.8" />
          ))}
        </g>
        {SUCKERS.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" fill="#e8b2d4" stroke="#5a1d4c" strokeWidth="0.8" opacity="0.8" />
        ))}
        {/* свиток с ответом в щупальце — «пришёл позже» */}
        <rect x="160" y="132" width="20" height="13" rx="2" fill="#cdbb8e" transform="rotate(14 170 138)" />
        <path d="M164 136 L176 139 M163 140 L172 142" stroke="#5a4a2a" strokeWidth="1" />

        {/* мантия-голова */}
        <path
          d="M100 18 C142 18 162 50 160 84 C158 108 146 122 132 130 L68 130 C54 122 42 108 40 84 C38 50 58 18 100 18 Z"
          fill={`url(#${u}skin)`}
        />
        <path d="M70 40 C80 30 92 26 104 26 M60 70 C58 60 60 50 64 44" stroke="#e8a6d0" strokeWidth="1.2" opacity="0.25" fill="none" />
        {/* бородавки-сосочки и морщины */}
        {[
          [80, 54],
          [116, 46],
          [132, 66],
          [66, 82],
          [100, 72],
          [142, 92],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.2" fill="#6e2a5e" />
        ))}
        <g filter="url(#g-blur)" opacity="0.8">
          <ellipse cx="74" cy="108" rx="16" ry="11" fill="#070106" />
          <ellipse cx="126" cy="108" rx="16" ry="11" fill="#070106" />
        </g>
        {/* тяжёлые веки */}
        <path
          d="M56 104 C62 92 86 92 92 104 C84 100 64 100 56 104 Z M108 104 C114 92 138 92 144 104 C136 100 116 100 108 104 Z"
          fill="#2a0a24"
        />
      </g>

      {/* глаза с горизонтальным зрачком */}
      <g className="g-eye" filter="url(#g-glow)">
        <ellipse cx="74" cy="110" rx="13" ry="8" fill={`url(#${u}eye)`} />
        <ellipse cx="126" cy="110" rx="13" ry="8" fill={`url(#${u}eye)`} />
      </g>
      <rect x="64" y="108.4" width="20" height="3.6" rx="1.8" fill="#0d0500" />
      <rect x="116" y="108.4" width="20" height="3.6" rx="1.8" fill="#0d0500" />
    </>
  );
}
