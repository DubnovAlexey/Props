// Жаба-алхимик Бородавка — хозяйка Пещеры алхимика (объекты и деструктуризация).
// Раскладывает яды по колбам — как деструктуризация раскладывает объект.
import { Drop, Splatter, Trail } from '../gore.jsx';

const WARTS = [
  [40, 110, 5],
  [52, 96, 3],
  [30, 128, 4],
  [160, 108, 5],
  [150, 96, 3],
  [170, 126, 4],
  [84, 94, 3],
  [116, 92, 3.5],
  [100, 102, 2.5],
  [70, 156, 3],
  [132, 156, 3],
  [56, 140, 2.5],
  [146, 142, 2.5],
  [26, 104, 2.5],
  [176, 110, 2.5],
];

// Игольчатые зубы по верхнему краю пасти: x каждого зуба
const NEEDLES = [44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124, 132, 140, 148, 156];
// верхний край пасти — дуга: чем дальше от середины, тем ниже
const lipY = (x) => 140 - 12.4 * (1 - ((x - 100) / 66) ** 2);
// к углам пасти зубы короче
const needleLength = (x) => 1.6 + 5.6 * (1 - ((x - 100) / 70) ** 2);
// брызги крови у угла пасти: [x, y, радиус]
const BLOOD_SPOTS = [
  [57, 153, 1.3],
  [42, 158, 1],
  [53, 171, 1.5],
];

function Eye({ cx, u }) {
  return (
    <>
      <circle className="g-eye" cx={cx} cy="74" r="15" fill={`url(#${u}eye)`} filter="url(#g-glow)" />
      <ellipse cx={cx} cy="75" rx="11" ry="2.6" fill="#120700" />
      <circle cx={cx - 5} cy="70" r="1.8" fill="#fff8d8" opacity="0.75" />
      {/* тяжёлое злое веко, опущенное к носу */}
      <path
        d={`M${cx - 19} 66 C${cx - 10} 54 ${cx + 10} 56 ${cx + 19} 72 C${cx + 8} 64 ${cx - 8} 62 ${cx - 19} 66 Z`}
        fill="#2d3311"
        transform={cx > 100 ? `translate(${2 * cx} 0) scale(-1 1)` : undefined}
      />
    </>
  );
}

export default function Toad({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}sk`} cx="50%" cy="88%" r="80%">
          <stop offset="0" stopColor="#a6a157" />
          <stop offset="0.4" stopColor="#5d622a" />
          <stop offset="0.75" stopColor="#262b0f" />
          <stop offset="1" stopColor="#0b0d04" />
        </radialGradient>
        <radialGradient id={`${u}eye`} cx="45%" cy="45%" r="62%">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="0.45" stopColor="#e8761a" />
          <stop offset="1" stopColor="#5a1a00" />
        </radialGradient>
        <radialGradient id={`${u}mo`} cx="50%" cy="25%" r="75%">
          <stop offset="0" stopColor="#4a0f24" />
          <stop offset="1" stopColor="#0a0105" />
        </radialGradient>
        <radialGradient id={`${u}belly`} cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#c8be7e" />
          <stop offset="1" stopColor="#5f5a30" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      <g filter="url(#g-flesh)">
        <path d="M0 200 C10 150 50 134 100 134 C150 134 190 150 200 200 Z" fill="#1d220d" />
        <ellipse cx="100" cy="174" rx="52" ry="26" fill={`url(#${u}belly)`} opacity="0.55" />

        <path
          d="M16 122 C16 84 52 62 100 62 C148 62 184 84 184 122 C184 150 150 170 100 170 C50 170 16 150 16 122 Z"
          fill={`url(#${u}sk)`}
        />
        <circle cx="60" cy="76" r="25" fill={`url(#${u}sk)`} stroke="#141808" strokeWidth="1" />
        <circle cx="140" cy="76" r="25" fill={`url(#${u}sk)`} stroke="#141808" strokeWidth="1" />

        {/* объём: тени под глазами и в углах пасти, слизь */}
        <g filter="url(#g-blur)" opacity="0.75">
          <ellipse cx="60" cy="98" rx="20" ry="6" fill="#070903" />
          <ellipse cx="140" cy="98" rx="20" ry="6" fill="#070903" />
          <ellipse cx="34" cy="140" rx="12" ry="8" fill="#070903" />
          <ellipse cx="166" cy="140" rx="12" ry="8" fill="#070903" />
        </g>
        <path d="M40 92 C60 86 80 86 92 90 M108 90 C120 86 140 86 160 92" stroke="#e8f0b0" strokeWidth="1" opacity="0.18" fill="none" />

        {WARTS.map(([cx, cy, r]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r={r} fill="#6d6a2e" />
            <circle cx={cx + r * 0.2} cy={cy + r * 0.2} r={r * 0.45} fill="#2e2d10" />
            <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.22} fill="#e8e6b0" opacity="0.35" />
          </g>
        ))}

        {/* пасть с опущенными углами — злая гримаса */}
        <path d="M34 140 C60 124 140 124 166 140 C132 150 68 150 34 140 Z" fill={`url(#${u}mo)`} />
        <path
          d="M22 146 C40 132 70 124 100 124 C130 124 160 132 178 146"
          stroke="#080a02"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M58 136 C80 130 120 130 142 136" stroke="#e8e0a0" strokeWidth="1" opacity="0.2" fill="none" />
      </g>

      {/* мелкие игольчатые зубы и кровь последнего ужина в углу пасти */}
      <path
        d={NEEDLES.map((x) => `M${x - 2.3} ${lipY(x) + 0.6} L${x} ${lipY(x) + 0.6 + needleLength(x)} L${x + 2.3} ${lipY(x) + 0.6} Z`).join(
          ' ',
        )}
        fill="#dcd6ac"
        stroke="#2a2a10"
        strokeWidth="0.5"
      />
      <Trail d="M50 143.5 C48 150 49.6 156 48.6 164" width={2} />
      <Splatter spots={BLOOD_SPOTS} />
      <Drop cx={48.6} cy={167.5} r={1.7} late />

      {/* слюна и пузыри яда */}
      <path className="g-drip" d="M76 146 C76 154 78 160 77 168" stroke="#cfe38a" strokeWidth="2" opacity="0.55" fill="none" />
      <path className="g-drip" d="M126 146 C126 152 128 158 127 164" stroke="#cfe38a" strokeWidth="1.6" opacity="0.5" fill="none" />
      <g filter="url(#g-glow)" opacity="0.8">
        <circle cx="154" cy="156" r="4" fill="#8b3dbd" />
        <circle cx="164" cy="146" r="2.5" fill="#a85bd8" />
        <circle cx="146" cy="166" r="3" fill="#8b3dbd" />
      </g>

      <Eye cx={60} u={u} />
      <Eye cx={140} u={u} />
    </>
  );
}
