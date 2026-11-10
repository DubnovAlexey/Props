// Гигантский червь Сквозник — хозяин Тайного хода (Context).
// Прогрызает ход сквозь все уровни — как Context доставляет значение мимо посредников.
// Пасть — кольца зубов, как у миноги: каждое кольцо глубже предыдущего.
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

      {/* свет из глотки */}
      <circle className="g-eye" cx="100" cy="106" r="9" fill="#ff5a3c" filter="url(#g-glow)" opacity="0.85" />

      {/* слизь */}
      <path className="g-drip" d="M70 150 q1 8 -1 14" stroke="#e8c0a8" strokeWidth="2" opacity="0.6" fill="none" />
      <path className="g-drip" d="M126 154 q1 6 -1 11" stroke="#e8c0a8" strokeWidth="1.6" opacity="0.5" fill="none" />
    </>
  );
}
