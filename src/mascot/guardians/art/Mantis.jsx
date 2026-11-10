// Богомол Крюкохват — хозяин Часового грота (хуки).
// Его лапы-крюки — это хуки (hooks — «крючки»): цепляют компоненту память и эффекты.
function Arm({ u }) {
  return (
    <>
      {/* бедро вверх, голень с шипами сложена вниз, на конце — крюк */}
      <path d="M70 150 C56 126 40 96 30 66 L40 62 C50 90 66 120 80 144 Z" fill={`url(#${u}leg)`} stroke="#0c1404" strokeWidth="1" />
      <path d="M32 64 C40 88 46 112 48 134 L40 136 C36 112 30 90 24 70 Z" fill={`url(#${u}leg)`} stroke="#0c1404" strokeWidth="1" />
      <path d="M44 136 C46 146 42 154 34 158 C38 150 40 144 40 136 Z" fill="#c8e86a" stroke="#0c1404" strokeWidth="0.8" />
      {/* шипы по внутреннему краю */}
      <path
        d="M40 76 L46 74 L42 80 Z M43 88 L49 86 L45 92 Z M46 100 L52 98 L47 104 Z M47 112 L53 110 L48 116 Z M48 124 L54 122 L49 128 Z"
        fill="#e6f5b0"
      />
    </>
  );
}

export default function Mantis({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}head`} cx="50%" cy="70%" r="70%">
          <stop offset="0" stopColor="#8fbf45" />
          <stop offset="0.5" stopColor="#3f611a" />
          <stop offset="1" stopColor="#0d1705" />
        </radialGradient>
        <linearGradient id={`${u}leg`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1d2e0a" />
          <stop offset="0.5" stopColor="#6c9a2c" />
          <stop offset="1" stopColor="#1d2e0a" />
        </linearGradient>
        <radialGradient id={`${u}eye`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#efff9a" />
          <stop offset="0.5" stopColor="#8fbf1f" />
          <stop offset="1" stopColor="#2a3d05" />
        </radialGradient>
      </defs>

      {/* усики */}
      <path className="g-sway" d="M94 64 C86 40 70 20 52 4 M106 64 C114 40 130 20 148 4" stroke="#2a3d0a" strokeWidth="1.8" fill="none" />

      <g filter="url(#g-flesh)">
        {/* грудь */}
        <path d="M84 138 C84 160 88 184 92 200 L108 200 C112 184 116 160 116 138 Z" fill="#2e4712" />
        <Arm u={u} />
        <g transform="translate(200 0) scale(-1 1)">
          <Arm u={u} />
        </g>

        {/* треугольная голова */}
        <path
          d="M40 70 C60 56 140 56 160 70 C150 94 122 130 100 142 C78 130 50 94 40 70 Z"
          fill={`url(#${u}head)`}
          stroke="#0c1404"
          strokeWidth="1.2"
        />
        <path d="M60 70 C80 64 120 64 140 70" stroke="#d6f08a" strokeWidth="1" opacity="0.3" fill="none" />
        <path
          d="M100 76 L100 120 M84 84 C90 100 94 112 98 126 M116 84 C110 100 106 112 102 126"
          stroke="#14210a"
          strokeWidth="1.2"
          opacity="0.7"
          fill="none"
        />
        {/* жвалы */}
        <path
          d="M92 134 C90 142 94 148 99 150 C97 144 97 140 98 136 Z M108 134 C110 142 106 148 101 150 C103 144 103 140 102 136 Z"
          fill="#1a0e04"
        />
      </g>

      {/* огромные фасеточные глаза с «зрачком», который следит */}
      <g className="g-eye" filter="url(#g-glow)">
        <ellipse cx="48" cy="74" rx="17" ry="21" fill={`url(#${u}eye)`} transform="rotate(-18 48 74)" />
        <ellipse cx="152" cy="74" rx="17" ry="21" fill={`url(#${u}eye)`} transform="rotate(18 152 74)" />
      </g>
      <ellipse cx="52" cy="78" rx="3.4" ry="5" fill="#0a1000" />
      <ellipse cx="148" cy="78" rx="3.4" ry="5" fill="#0a1000" />
      <path d="M38 64 L58 84 M40 76 L56 70 M142 64 L162 84 M144 70 L160 76" stroke="#2a3d05" strokeWidth="0.5" opacity="0.5" />
    </>
  );
}
