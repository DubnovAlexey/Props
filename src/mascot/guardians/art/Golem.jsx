// Кристальный голем Грань — хозяин Кристального грота (типы пропсов).
// Растёт по точным граням — как пропсы по описанному типу.
// Грани — многоугольники разной яркости: так получается объём кристалла.
const FACETS = [
  ['70,56 100,44 100,80 76,84', '#7fd9ef'],
  ['100,44 130,56 124,84 100,80', '#3fa9c8'],
  ['56,84 76,84 82,118 58,112', '#2a87a6'],
  ['124,84 144,84 142,112 118,118', '#1b6680'],
  ['76,84 100,80 124,84 118,118 100,124 82,118', '#4ab9d6'],
  ['58,112 82,118 88,150 66,140', '#185b73'],
  ['118,118 142,112 134,140 112,150', '#0f4457'],
  ['82,118 100,124 118,118 112,150 100,158 88,150', '#2a8fae'],
];
const SPIKES = [
  ['56,84 44,30 70,56', '#9ff0ff'],
  ['70,56 74,10 100,44', '#c9fbff'],
  ['100,44 120,2 130,56', '#7fe3f8'],
  ['130,56 160,24 144,84', '#4fc5e0'],
];

export default function Golem({ u }) {
  return (
    <>
      <defs>
        <linearGradient id={`${u}rock`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3238" />
          <stop offset="1" stopColor="#0a0d10" />
        </linearGradient>
      </defs>

      <g filter="url(#g-stone)">
        {/* каменные плечи с вросшими кристаллами */}
        <path d="M0 200 L10 160 L44 146 L76 156 L124 156 L156 146 L190 160 L200 200 Z" fill={`url(#${u}rock)`} />
        <path d="M24 170 L34 140 L42 168 Z M164 168 L172 138 L180 170 Z" fill="#3fa9c8" opacity="0.8" />
        <path d="M44 146 L60 172 M156 146 L140 172 M90 160 L100 182 L112 160" stroke="#05070a" strokeWidth="2" fill="none" />
      </g>

      {/* кристальная корона и голова из граней */}
      {SPIKES.map(([points, fill]) => (
        <polygon key={points} points={points} fill={fill} stroke="#05222c" strokeWidth="0.8" opacity="0.95" />
      ))}
      {FACETS.map(([points, fill]) => (
        <polygon key={points} points={points} fill={fill} stroke="#05222c" strokeWidth="0.8" />
      ))}
      <path d="M72 58 L98 48 M58 86 L74 86" stroke="#f2fdff" strokeWidth="1.2" opacity="0.6" />

      {/* трещина-рот со светом изнутри */}
      <g filter="url(#g-glow)">
        <path
          d="M84 134 L92 128 L98 136 L104 128 L110 136 L116 130 L112 140 L104 136 L98 144 L92 136 L86 140 Z"
          fill="#9ef6ff"
          opacity="0.9"
        />
      </g>

      {/* щели глаз с ледяным огнём */}
      <g className="g-eye" filter="url(#g-glow)" fill="#e6feff">
        <path d="M74 100 L94 96 L92 104 Z" />
        <path d="M126 100 L106 96 L108 104 Z" />
      </g>
    </>
  );
}
