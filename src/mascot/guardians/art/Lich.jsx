// Лич-чародей Мортис — хозяин Грота заклинаний (функции и замыкания).
// Хранит заклинания впрок и произносит позже — как функцию передают и вызывают потом.
const TOP = [74, 82, 90, 98, 106, 114, 122];

export default function Lich({ u }) {
  return (
    <>
      <defs>
        <linearGradient id={`${u}hood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b1f3d" />
          <stop offset="1" stopColor="#07040c" />
        </linearGradient>
        <radialGradient id={`${u}bone`} cx="50%" cy="82%" r="72%">
          <stop offset="0" stopColor="#efe6d2" />
          <stop offset="0.45" stopColor="#b9ae95" />
          <stop offset="0.8" stopColor="#5d5545" />
          <stop offset="1" stopColor="#1d1a14" />
        </radialGradient>
        <radialGradient id={`${u}orb`} cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#f6eaff" />
          <stop offset="0.4" stopColor="#b37bff" />
          <stop offset="1" stopColor="#5b1fbf" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* капюшон */}
      <path
        d="M100 14 C152 18 182 66 182 120 C182 160 168 190 160 200 L40 200 C32 190 18 160 18 120 C18 66 48 18 100 14 Z"
        fill={`url(#${u}hood)`}
      />
      <path d="M100 40 C134 42 154 70 154 104 C154 140 136 168 100 176 C64 168 46 140 46 104 C46 70 66 42 100 40 Z" fill="#040206" />
      <path className="g-sway" d="M44 52 C34 40 42 28 34 14" stroke="#9b5cff" strokeWidth="3" opacity="0.25" fill="none" />
      <path className="g-sway" d="M158 56 C170 44 160 30 168 16" stroke="#9b5cff" strokeWidth="2.4" opacity="0.2" fill="none" />

      <g filter="url(#g-flesh)">
        {/* череп */}
        <path
          d="M100 50 C130 50 148 72 148 100 C148 120 140 132 130 138 L128 158 L72 158 L70 138 C60 132 52 120 52 100 C52 72 70 50 100 50 Z"
          fill={`url(#${u}bone)`}
        />
        <path
          d="M58 112 C66 126 78 132 86 132 M142 112 C134 126 122 132 114 132"
          stroke="#3a3427"
          strokeWidth="3"
          opacity="0.6"
          fill="none"
        />
        <path d="M92 52 L96 64 L90 72 L98 82" stroke="#2b2620" strokeWidth="1.6" fill="none" />

        {/* глазницы и нос */}
        <path d="M64 96 C68 82 88 82 94 96 C92 108 72 112 64 96 Z" fill="#0a0608" />
        <path d="M106 96 C112 82 132 82 136 96 C128 112 108 108 106 96 Z" fill="#0a0608" />
        <path d="M100 106 C95 116 92 124 96 127 L100 123 L104 127 C108 124 105 116 100 106 Z" fill="#120c08" />

        {/* оскал */}
        <rect x="70" y="136" width="60" height="24" rx="3" fill="#0a0608" />
        {TOP.map((x, i) => (
          <rect
            key={x}
            x={x}
            y="137"
            width="6.5"
            height={i % 3 === 1 ? 8 : 10}
            rx="1.5"
            fill="#e0d6bd"
            stroke="#3a3427"
            strokeWidth="0.8"
          />
        ))}
        {TOP.slice(0, 6).map((x) => (
          <rect key={x} x={x + 3} y="149" width="6.5" height="9" rx="1.5" fill="#cfc4a8" stroke="#3a3427" strokeWidth="0.8" />
        ))}
      </g>

      {/* фиолетовые огни в глазницах */}
      <g className="g-eye" filter="url(#g-glow)">
        <circle cx="80" cy="96" r="4.6" fill="#c8a2ff" />
        <circle cx="120" cy="96" r="4.6" fill="#c8a2ff" />
      </g>
      <circle cx="80" cy="96" r="1.6" fill="#ffffff" />
      <circle cx="120" cy="96" r="1.6" fill="#ffffff" />

      {/* костлявая рука с заклинанием */}
      <circle className="g-flicker" cx="152" cy="166" r="17" fill={`url(#${u}orb)`} filter="url(#g-glow)" />
      <path
        d="M136 188 L142 172 M144 190 L150 173 M152 192 L158 175 M160 188 L165 174"
        stroke="#cfc5ae"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M130 200 C132 192 160 190 170 200 Z" fill="#b9ae95" />
    </>
  );
}
