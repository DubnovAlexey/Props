// Тролль-привратник Глыба — хозяин Грота у входа (компоненты и JSX).
// Сложен из каменных глыб — как интерфейс из компонентов.
const lowerY = (x) => 172 - (x - 100) ** 2 * 0.01229;
const TEETH = [66, 75, 84, 93, 102, 111, 120, 129];

export default function Troll({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}st`} cx="50%" cy="86%" r="80%">
          <stop offset="0" stopColor="#a9b4bd" />
          <stop offset="0.35" stopColor="#6b7680" />
          <stop offset="0.7" stopColor="#343b43" />
          <stop offset="1" stopColor="#0d0f12" />
        </radialGradient>
        <linearGradient id={`${u}tusk`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f0e6cc" />
          <stop offset="1" stopColor="#8f7f5c" />
        </linearGradient>
        <radialGradient id={`${u}mo`} cx="50%" cy="20%" r="80%">
          <stop offset="0" stopColor="#3a1212" />
          <stop offset="1" stopColor="#0a0202" />
        </radialGradient>
      </defs>

      <g filter="url(#g-stone)">
        {/* плечи-валуны */}
        <path d="M0 200 C6 166 40 152 72 150 L128 150 C160 152 194 166 200 200 Z" fill={`url(#${u}st)`} />
        <path d="M30 176 L58 166 L70 182 M170 176 L142 166 L130 182" stroke="#0b0d10" strokeWidth="2.4" fill="none" />

        {/* уши-осколки с железным кольцом */}
        <path d="M40 96 L20 80 L36 116 Z" fill="#59636d" />
        <path d="M160 96 L180 80 L164 116 Z" fill="#59636d" />
        <circle cx="26" cy="104" r="5" fill="none" stroke="#7d848c" strokeWidth="2.2" />

        {/* голова */}
        <path
          d="M100 30 C138 30 160 52 162 86 C164 108 170 128 166 146 C160 170 134 184 100 186 C66 184 40 170 34 146 C30 128 36 108 38 86 C40 52 62 30 100 30 Z"
          fill={`url(#${u}st)`}
        />
        {/* швы между глыбами + подсветка снизу */}
        <path
          d="M46 74 L74 66 L92 78 M112 60 L132 66 L154 80 M40 116 L64 120 L70 132 M136 132 L142 118 L162 112 M96 36 L100 52 L92 64"
          stroke="#0b0d10"
          strokeWidth="2.4"
          fill="none"
        />
        <path d="M46 76 L74 68 L92 80 M112 62 L132 68 L154 82" stroke="#c3ccd3" strokeWidth="1" opacity="0.25" fill="none" />

        {/* мох */}
        <path d="M58 42 C68 30 90 30 96 38 C86 40 76 46 66 54 C60 50 56 46 58 42 Z" fill="#4c7a2a" opacity="0.85" />
        <path d="M128 40 C138 36 150 44 152 54 C144 50 136 48 128 48 Z" fill="#3e6a22" opacity="0.8" />

        {/* тяжёлая надбровная плита и ямы глаз */}
        <path
          d="M44 90 C60 76 84 76 100 86 C116 76 140 76 156 90 C146 100 124 96 112 100 C106 98 94 98 88 100 C76 96 54 100 44 90 Z"
          fill="#23282e"
        />
        <ellipse cx="76" cy="101" rx="12" ry="7" fill="#050607" />
        <ellipse cx="124" cy="101" rx="12" ry="7" fill="#050607" />

        {/* сломанный нос */}
        <path d="M90 102 C88 114 78 124 84 132 C92 138 108 138 116 132 C122 124 112 114 110 102 C104 106 96 106 90 102 Z" fill="#5f6a74" />
        <ellipse cx="92" cy="130" rx="4" ry="2.5" fill="#0b0c0e" />
        <ellipse cx="108" cy="130" rx="4" ry="2.5" fill="#0b0c0e" />

        {/* пасть с выдвинутой челюстью */}
        <path d="M54 146 C76 136 124 136 146 146 C142 162 124 172 100 172 C76 172 58 162 54 146 Z" fill={`url(#${u}mo)`} />
        <path
          d={TEETH.map((x) => {
            const y = lowerY(x + 4) - 1;
            return `M${x} ${y} L${x} ${y - 8} Q${x + 4} ${y - 12} ${x + 8} ${y - 8} L${x + 8} ${y} Z`;
          }).join(' ')}
          fill="#cfc6ac"
          stroke="#2a2418"
          strokeWidth="0.8"
        />
        {/* клыки */}
        <path d="M70 152 C63 132 65 114 74 102 C76 118 78 134 81 152 Z" fill={`url(#${u}tusk)`} stroke="#2a2418" strokeWidth="0.8" />
        <path d="M130 152 C137 132 135 114 126 102 C124 118 122 134 119 152 Z" fill={`url(#${u}tusk)`} stroke="#2a2418" strokeWidth="0.8" />
      </g>

      <g className="g-eye" filter="url(#g-glow)">
        <ellipse cx="76" cy="101" rx="5.5" ry="3.6" fill="#ff3b2f" />
        <ellipse cx="124" cy="101" rx="5.5" ry="3.6" fill="#ff3b2f" />
      </g>
      <circle cx="76" cy="101" r="1.4" fill="#2a0000" />
      <circle cx="124" cy="101" r="1.4" fill="#2a0000" />
    </>
  );
}
