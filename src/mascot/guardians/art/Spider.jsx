// Паучиха Тенета — хозяйка Пещеры памяти (состояние).
// Помнит каждую нить паутины — как состояние помнит значения между рендерами.
// Лапы: [плечо, колено, стопа]; рисуются толстыми штрихами с бликом.
import { Drop, Tips, Trail } from '../gore.jsx';

const LEGS = [
  ['M86 112', 'C66 82 48 70 30 74', 'C16 88 10 108 4 128'],
  ['M84 120', 'C60 104 36 102 20 112', 'C10 128 8 150 6 172'],
  ['M86 128', 'C66 128 48 138 40 152', 'C34 166 34 182 36 200'],
  ['M90 134', 'C80 146 72 160 70 176', 'C70 186 72 194 74 202'],
];

export default function Spider({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}abd`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#4a3640" />
          <stop offset="0.45" stopColor="#1c1216" />
          <stop offset="1" stopColor="#050304" />
        </radialGradient>
        <radialGradient id={`${u}head`} cx="50%" cy="70%" r="70%">
          <stop offset="0" stopColor="#6a4652" />
          <stop offset="0.6" stopColor="#241519" />
          <stop offset="1" stopColor="#040203" />
        </radialGradient>
        <radialGradient id={`${u}eye`} cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ff8a8a" />
          <stop offset="0.4" stopColor="#d1132f" />
          <stop offset="1" stopColor="#3a0008" />
        </radialGradient>
      </defs>

      {/* паутина */}
      <g stroke="#cfc6dc" strokeWidth="0.6" opacity="0.18" fill="none">
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <line key={a} x1="100" y1="100" x2={100 + 140 * Math.cos((a * Math.PI) / 180)} y2={100 + 140 * Math.sin((a * Math.PI) / 180)} />
        ))}
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <line
            key={`n${a}`}
            x1="100"
            y1="100"
            x2={100 - 140 * Math.cos((a * Math.PI) / 180)}
            y2={100 - 140 * Math.sin((a * Math.PI) / 180)}
          />
        ))}
        {[30, 54, 80].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} />
        ))}
      </g>

      {/* добыча в коконе висит на нити: паучиха помнит каждого */}
      <path d="M36 0 L41 30" stroke="#cfc6dc" strokeWidth="0.7" opacity="0.5" />
      <g transform="rotate(-14 42 44)">
        <ellipse cx="42" cy="44" rx="7" ry="14" fill="#cfc6dc" opacity="0.5" />
        <path d="M36 36 L48 39 M35.4 42 L48.6 45 M35.6 48 L48.4 51 M37 54 L47 56" stroke="#efe9f6" strokeWidth="0.7" opacity="0.55" />
        <path d="M41 46 C40.4 50 41.6 53 41 57" stroke="#99091e" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
      </g>

      <g filter="url(#g-flesh)">
        {/* брюшко с алыми «песочными часами» */}
        <circle cx="100" cy="52" r="42" fill={`url(#${u}abd)`} />
        <path d="M100 30 L113 45 L100 54 L87 45 Z M100 58 L111 72 L89 72 Z" fill="#c0142f" />
        <path d="M78 34 C86 24 100 20 112 24" stroke="#fff" strokeWidth="1.5" opacity="0.2" fill="none" />

        {/* восемь лап: волосатые, с бликом */}
        {[false, true].map((mirror) => (
          <g key={String(mirror)} transform={mirror ? 'translate(200 0) scale(-1 1)' : undefined}>
            {LEGS.map((leg) => (
              <g key={leg[0]}>
                <path d={leg.join(' ')} stroke="#0d0809" strokeWidth="7" strokeLinecap="round" fill="none" />
                <path d={leg.join(' ')} stroke="#8a5866" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.85" />
                <path
                  d={leg.join(' ')}
                  stroke="#0d0809"
                  strokeWidth="11"
                  strokeDasharray="1 5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.5"
                />
              </g>
            ))}
          </g>
        ))}

        {/* голова и хелицеры с клыками */}
        <ellipse cx="100" cy="114" rx="30" ry="26" fill={`url(#${u}head)`} />
        <path d="M84 126 C78 138 82 152 93 155 C95 145 96 135 98 126 Z" fill="#1f1418" />
        <path d="M116 126 C122 138 118 152 107 155 C105 145 104 135 102 126 Z" fill="#1f1418" />
        <path
          d="M92 152 C89 160 91 166 96 171 C96 163 96 157 96 152 Z M108 152 C111 160 109 166 104 171 C104 163 104 157 104 152 Z"
          fill="#d9d2c0"
          stroke="#1a1012"
          strokeWidth="0.6"
        />
      </g>

      {/* кровь на клыках и хелицерах */}
      <Trail d="M88 132 C86 140 87 147 91 152" width={1.6} opacity={0.9} />
      <Trail d="M112 132 C114 140 113 147 109 152" width={1.6} opacity={0.9} />
      <Tips
        tips={[
          [96, 171, 6.5],
          [104, 171, 6.5],
        ]}
        width={2.8}
      />
      <Drop cx={100} cy={180} r={1.5} late />

      {/* капли яда */}
      <circle className="g-drip" cx="96" cy="174" r="1.8" fill="#9be36a" />
      <circle className="g-drip" cx="104" cy="174" r="1.6" fill="#9be36a" />

      {/* восемь глаз: два больших и шесть мелких */}
      <g className="g-eye" filter="url(#g-glow)">
        <circle cx="91" cy="106" r="6" fill={`url(#${u}eye)`} />
        <circle cx="109" cy="106" r="6" fill={`url(#${u}eye)`} />
        {[
          [80, 101, 2.6],
          [120, 101, 2.6],
          [84, 94, 2.2],
          [116, 94, 2.2],
          [94, 96, 2],
          [106, 96, 2],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#e01a3a" />
        ))}
      </g>
      <circle cx="89" cy="104" r="1.6" fill="#fff" opacity="0.8" />
      <circle cx="107" cy="104" r="1.6" fill="#fff" opacity="0.8" />
    </>
  );
}
