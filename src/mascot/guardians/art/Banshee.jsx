// Банши Отголоска — хозяйка Пещеры эха (колбэки).
// Её крик летит наверх эхом — как ребёнок вызывает функцию родителя.
import { Drop, Trail } from '../gore.jsx';

const HAIR = [
  'M70 60 C44 40 30 10 12 0 C30 30 34 60 58 88 Z',
  'M80 52 C66 26 62 0 52 -10 C60 20 60 46 72 70 Z',
  'M120 52 C134 26 138 0 148 -10 C140 20 140 46 128 70 Z',
  'M130 60 C156 40 170 10 188 0 C170 30 166 60 142 88 Z',
  'M66 80 C36 80 14 70 0 60 C20 84 40 96 64 102 Z',
  'M134 80 C164 80 186 70 200 60 C180 84 160 96 136 102 Z',
];

export default function Banshee({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}face`} cx="50%" cy="80%" r="75%">
          <stop offset="0" stopColor="#e6eef3" />
          <stop offset="0.45" stopColor="#97aab8" />
          <stop offset="0.85" stopColor="#3a4a58" />
          <stop offset="1" stopColor="#111821" />
        </radialGradient>
        <linearGradient id={`${u}hair`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#b8c8d6" stopOpacity="0.75" />
          <stop offset="1" stopColor="#b8c8d6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${u}maw`} cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.8" stopColor="#0b0f16" />
          <stop offset="1" stopColor="#2a3848" />
        </radialGradient>
      </defs>

      {/* волны крика уходят вверх — к родителю */}
      <g fill="none" stroke="#a6e6ff" strokeWidth="2">
        <path className="g-wave" d="M70 40 Q100 24 130 40" />
        <path className="g-wave2" d="M60 52 Q100 30 140 52" />
      </g>

      {/* волосы, поднятые ветром */}
      <g className="g-sway">
        {HAIR.map((d) => (
          <path key={d} d={d} fill={`url(#${u}hair)`} />
        ))}
      </g>

      <g filter="url(#g-flesh)">
        {/* саван */}
        <path d="M40 200 C50 172 70 162 100 160 C130 162 150 172 160 200 Z" fill="#2b3946" opacity="0.85" />
        {/* измождённое лицо */}
        <path
          d="M100 50 C122 50 134 72 132 100 C130 132 118 162 100 172 C82 162 70 132 68 100 C66 72 78 50 100 50 Z"
          fill={`url(#${u}face)`}
        />
        <g filter="url(#g-blur)" opacity="0.85">
          <ellipse cx="86" cy="96" rx="11" ry="9" fill="#0b1118" />
          <ellipse cx="114" cy="96" rx="11" ry="9" fill="#0b1118" />
          <path d="M76 116 C80 128 84 136 88 142 M124 116 C120 128 116 136 112 142" stroke="#1a2430" strokeWidth="5" fill="none" />
        </g>
        <path d="M88 64 C94 60 106 60 112 64" stroke="#e6eef3" strokeWidth="1" opacity="0.3" fill="none" />
        {/* вены */}
        <path d="M78 70 C80 78 76 84 78 90 M122 72 C120 80 124 86 122 92" stroke="#3a5a78" strokeWidth="0.9" opacity="0.6" fill="none" />
        {/* рот в беззвучном крике */}
        <ellipse cx="100" cy="136" rx="11.5" ry="25" fill={`url(#${u}maw)`} />
        <path d="M91 118 L93 124 M109 118 L107 124 M92 154 L94 149 M108 154 L106 149" stroke="#c9d3da" strokeWidth="1.6" />
      </g>

      {/* кровавые слёзы из обоих глаз и кровь с треснувших губ */}
      <Trail d="M84 104 C83 116 85 128 83.4 142" width={2} />
      <Trail d="M116 104 C117 114 115.4 126 116.6 138" width={1.8} opacity={0.9} />
      <Trail d="M90.4 152 C89.4 157 90.6 161 89.8 166" width={1.3} opacity={0.85} />
      <Drop cx={83.4} cy={145.5} r={1.6} />
      <Drop cx={116.6} cy={141.5} r={1.4} late />

      {/* крошечные ледяные зрачки в провалах глаз */}
      <g className="g-eye" filter="url(#g-glow)" fill="#e6fbff">
        <circle cx="86" cy="97" r="2.4" />
        <circle cx="114" cy="97" r="2.4" />
      </g>
    </>
  );
}
