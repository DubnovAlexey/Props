// Гигантский червь Сквозник — хозяин Тайного хода (Context).
// Прогрызает ход сквозь все уровни — как Context доставляет значение мимо посредников.
// Пасть — кольца зубов, как у миноги: каждое кольцо глубже предыдущего.
import { Drop, Splatter, Trail } from '../gore.jsx';

function ring(r, n, len, offset = 0) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((i + offset) / n) * Math.PI * 2;
    const w = (Math.PI * 2 * r) / n / 2.4;
    const bx = 100 + r * Math.cos(a);
    const by = 106 + r * Math.sin(a);
    const tx = 100 + (r - len) * Math.cos(a);
    const ty = 106 + (r - len) * Math.sin(a);
    const px = -Math.sin(a) * w;
    const py = Math.cos(a) * w;
    return `M${(bx + px).toFixed(1)} ${(by + py).toFixed(1)} L${tx.toFixed(1)} ${ty.toFixed(1)} L${(bx - px).toFixed(1)} ${(by - py).toFixed(1)} Z`;
  }).join(' ');
}

// брызги крови на плоти вокруг пасти: [x, y, радиус]
const BLOOD_SPOTS = [
  [152, 90, 1.6],
  [158, 116, 1.2],
  [46, 128, 1.8],
  [62, 162, 1.3],
  [130, 162, 1.5],
  [70, 60, 1.1],
];

export default function Worm({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}flesh`} cx="50%" cy="62%" r="60%">
          <stop offset="0" stopColor="#c48a7c" />
          <stop offset="0.55" stopColor="#7a4036" />
          <stop offset="1" stopColor="#24100c" />
        </radialGradient>
        <radialGradient id={`${u}throat`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff3d2e" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="#5a0606" />
          <stop offset="1" stopColor="#0d0101" />
        </radialGradient>
        <linearGradient id={`${u}tooth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe4c6" />
          <stop offset="1" stopColor="#9a8456" />
        </linearGradient>
      </defs>

      {/* стенка тоннеля */}
      <circle cx="100" cy="106" r="96" fill="#140c09" />
      <path d="M12 80 L30 70 L26 92 M178 70 L188 92 L170 96 M40 180 L60 170 L56 192" stroke="#2c1d15" strokeWidth="3" fill="none" />

      <g filter="url(#g-flesh)">
        {/* кольчатое тело */}
        <circle cx="100" cy="106" r="80" fill={`url(#${u}flesh)`} />
        {[74, 66, 58].map((r) => (
          <circle key={r} cx="100" cy="106" r={r} fill="none" stroke="#3a1a14" strokeWidth="2.4" opacity="0.7" />
        ))}
        <path d="M44 82 C60 60 84 50 104 50" stroke="#f0c0b0" strokeWidth="1.6" opacity="0.3" fill="none" />

        {/* пасть с кольцами зубов */}
        <circle cx="100" cy="106" r="50" fill={`url(#${u}throat)`} />
        <path d={ring(50, 22, 13)} fill={`url(#${u}tooth)`} stroke="#2a1608" strokeWidth="0.6" />
        <path d={ring(36, 16, 10, 0.5)} fill={`url(#${u}tooth)`} stroke="#2a1608" strokeWidth="0.6" opacity="0.92" />
        <path d={ring(23, 11, 8)} fill={`url(#${u}tooth)`} stroke="#2a1608" strokeWidth="0.6" opacity="0.8" />
      </g>

      {/* кровь стекает с верхних зубов, между кольцами тянутся нити слизи */}
      <Trail d="M94.7 70 C94 79 95.6 88 94.6 97" width={1.5} opacity={0.85} />
      <Trail d="M110.6 71.4 C111.4 78 110.2 84 111 90" width={1.3} opacity={0.8} />
      <Trail d="M126 80 C127 86 125.6 91 126.4 96" width={1.2} opacity={0.75} />
      <path
        d="M82 76 C85 98 80 122 84 138 M118 74 C114 98 120 120 116 140 M66 100 C86 104 114 104 134 100"
        stroke="#e8c0a8"
        strokeWidth="0.8"
        opacity="0.32"
        fill="none"
      />
      <Splatter spots={BLOOD_SPOTS} />
      <Drop cx={94.6} cy={100.5} r={1.5} />
      <Drop cx={76} cy={152} r={1.6} late />

      {/* свет из глотки */}
      <circle className="g-eye" cx="100" cy="106" r="9" fill="#ff5a3c" filter="url(#g-glow)" opacity="0.85" />

      {/* слизь */}
      <path className="g-drip" d="M70 150 q1 8 -1 14" stroke="#e8c0a8" strokeWidth="2" opacity="0.6" fill="none" />
      <path className="g-drip" d="M126 154 q1 6 -1 11" stroke="#e8c0a8" strokeWidth="1.6" opacity="0.5" fill="none" />
    </>
  );
}
