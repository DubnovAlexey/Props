// «Набор крови» для портретов хозяев пещер: одни и те же приёмы и цвета у всех
// восемнадцати рисунков — так кровь выглядит одинаково, а в файлах art/ не
// приходится каждый раз заново описывать штрихи и цвета.
//   Trail    — потёк: кривая линия с тёмным краем и светлым бликом;
//   Drop     — капля, которая срывается и падает (анимация g-drip из Guardian.module.css);
//   Splatter — брызги: несколько пятен разного размера;
//   Tips     — кровь на остриях клыков и когтей: маленькие закрашенные треугольники.
// Все компоненты — обычные кусочки SVG: их вставляют прямо внутрь рисунка.

export const BLOOD = '#8c0a1b'; // свежая кровь
export const BLOOD_DARK = '#4a0410'; // запёкшийся край
export const BLOOD_LIGHT = '#d02f45'; // влажный блик

/** Потёк крови вдоль пути d. width — толщина, opacity — насколько свежий */
export function Trail({ d, width = 2, opacity = 0.95 }) {
  return (
    <g opacity={opacity} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={BLOOD_DARK} strokeWidth={width + 0.9} />
      <path d={d} stroke={BLOOD} strokeWidth={width} />
      <path d={d} stroke={BLOOD_LIGHT} strokeWidth={Math.max(0.35, width * 0.24)} opacity="0.45" />
    </g>
  );
}

/** Падающая капля. late — вторая «очередь», чтобы капли не падали одновременно */
export function Drop({ cx, cy, r = 1.6, late = false }) {
  return (
    <path
      className={late ? 'g-drip2' : 'g-drip'}
      d={`M${cx} ${cy - r * 1.9} C${cx + r * 0.9} ${cy - r * 0.5} ${cx + r} ${cy + r} ${cx} ${cy + r} C${cx - r} ${cy + r} ${cx - r * 0.9} ${cy - r * 0.5} ${cx} ${cy - r * 1.9} Z`}
      fill={BLOOD}
      stroke={BLOOD_DARK}
      strokeWidth="0.4"
    />
  );
}

/** Брызги: spots — массив [x, y, радиус] */
export function Splatter({ spots, opacity = 0.9 }) {
  return (
    <g opacity={opacity}>
      {spots.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={BLOOD} stroke={BLOOD_DARK} strokeWidth={r > 1.4 ? 0.5 : 0.25} />
      ))}
    </g>
  );
}

/**
 * Кровь на остриях. tips — массив [x, y, длина, направление]:
 * (x, y) — самый кончик клыка или когтя, длина — сколько острия в крови,
 * направление — куда смотрит остриё: 'down' (вниз), 'up' (вверх), 'left' или 'right'.
 */
export function Tips({ tips, width = 2.2 }) {
  const half = width / 2;
  const shape = ([x, y, length, direction = 'down']) => {
    if (direction === 'up') return `M${x} ${y} L${x + half} ${y + length} L${x - half} ${y + length} Z`;
    if (direction === 'left') return `M${x} ${y} L${x + length} ${y - half} L${x + length} ${y + half} Z`;
    if (direction === 'right') return `M${x} ${y} L${x - length} ${y - half} L${x - length} ${y + half} Z`;
    return `M${x} ${y} L${x - half} ${y - length} L${x + half} ${y - length} Z`;
  };
  return <path d={tips.map(shape).join(' ')} fill={BLOOD} stroke={BLOOD_DARK} strokeWidth="0.3" />;
}
