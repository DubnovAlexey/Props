// Пещерный угорь Стремнина — хозяин Подземного водопада (поток данных вниз).
// Плывёт только вниз по течению — как данные в React.
const UPPER_TEETH = [118, 126, 134, 142, 150, 158, 166];
const LOWER_TEETH = [122, 130, 138, 146, 154, 162];

export default function Eel({ u }) {
  return (
    <>
      <defs>
        <linearGradient id={`${u}body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#06100d" />
          <stop offset="0.5" stopColor="#1f4a40" />
          <stop offset="1" stopColor="#081612" />
        </linearGradient>
        <radialGradient id={`${u}head`} cx="45%" cy="75%" r="75%">
          <stop offset="0" stopColor="#4f8a78" />
          <stop offset="0.5" stopColor="#1d3f36" />
          <stop offset="1" stopColor="#050c0a" />
        </radialGradient>
        <radialGradient id={`${u}maw`} cx="35%" cy="50%" r="70%">
          <stop offset="0" stopColor="#6a1420" />
          <stop offset="1" stopColor="#120206" />
        </radialGradient>
        <linearGradient id={`${u}fall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fe3d6" stopOpacity="0" />
          <stop offset="0.5" stopColor="#8fe3d6" stopOpacity="0.35" />
          <stop offset="1" stopColor="#8fe3d6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* струи водопада за спиной */}
      {[26, 44, 60, 150, 172, 188].map((x, i) => (
        <rect key={x} x={x} y={i % 2 ? -10 : 0} width={i % 3 ? 3 : 5} height="210" fill={`url(#${u}fall)`} />
      ))}

      <g filter="url(#g-flesh)">
        {/* тело уходит вниз — по течению */}
        <path
          d="M44 200 C40 160 52 122 86 98 C108 82 132 78 150 84 C132 92 118 104 108 120 C94 142 90 172 94 200 Z"
          fill={`url(#${u}body)`}
        />
        {/* пятна мурены */}
        {[
          [70, 150, 6],
          [62, 176, 5],
          [84, 128, 5],
          [80, 186, 4],
          [98, 108, 4],
          [74, 166, 3],
        ].map(([cx, cy, r]) => (
          <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={r} ry={r * 0.7} fill="#3f6f60" opacity="0.55" />
        ))}
        {/* спинной плавник */}
        <path d="M46 196 C40 160 48 126 74 104 C60 126 54 160 58 196 Z" fill="#0c1f1a" opacity="0.9" />

        {/* голова с распахнутой пастью */}
        <path
          d="M86 98 C104 72 140 60 176 66 C186 68 192 74 190 80 C170 82 150 88 138 96 C128 104 112 112 98 116 Z"
          fill={`url(#${u}head)`}
        />
        <path d="M98 116 C120 122 150 120 186 104 C182 118 164 132 140 136 C122 138 106 132 98 116 Z" fill={`url(#${u}head)`} />
        <path d="M110 108 C130 98 160 88 188 82 C190 94 186 100 184 104 C160 114 132 118 110 112 Z" fill={`url(#${u}maw)`} />
        <path d="M120 70 C140 64 160 62 176 66" stroke="#9fd8c8" strokeWidth="1" opacity="0.3" fill="none" />

        {/* иглы зубов */}
        <path
          d={UPPER_TEETH.map((x, i) => {
            const y = 101 - (x - 110) * 0.22;
            return `M${x - 2} ${y} L${x} ${y + (i % 2 ? 7 : 10)} L${x + 2} ${y} Z`;
          }).join(' ')}
          fill="#e8e2cf"
          stroke="#2a2418"
          strokeWidth="0.4"
        />
        <path
          d={LOWER_TEETH.map((x, i) => {
            const y = 115 - (x - 110) * 0.18;
            return `M${x - 2} ${y} L${x} ${y - (i % 2 ? 7 : 9)} L${x + 2} ${y} Z`;
          }).join(' ')}
          fill="#e8e2cf"
          stroke="#2a2418"
          strokeWidth="0.4"
        />
      </g>

      {/* мутный глаз */}
      <circle className="g-eye" cx="124" cy="84" r="5.5" fill="#bfeee4" filter="url(#g-glow)" />
      <circle cx="124.6" cy="84.3" r="2.4" fill="#04110d" />
      <circle cx="122.6" cy="82.4" r="0.9" fill="#fff" opacity="0.8" />

      {/* брызги */}
      <g className="g-drip" fill="#8fe3d6" opacity="0.7">
        <circle cx="176" cy="120" r="1.6" />
        <circle cx="168" cy="132" r="1.2" />
      </g>
    </>
  );
}
