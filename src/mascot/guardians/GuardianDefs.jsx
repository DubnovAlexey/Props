// Общие фильтры для хозяев пещер, Графа и летучих мышей.
// Рисуются ОДИН раз на страницу (в App), а все SVG ссылаются на них
// по id: url(#g-flesh), url(#g-glow)… Так фильтры не дублируются.
//   g-flesh — шершавая «живая» кожа: лёгкое искажение краёв + зерно;
//   g-stone — грубый камень (для тролля и голема): крупнее зерно;
//   g-glow  — свечение глаз, огня и магии;
//   g-blur  — мягкая дымка и тени;
//   t-rough — неровные, будто изъеденные кромки букв в заголовках (components/BloodTitle);
//   t-blood — градиент потёков на заголовках: сверху тонкая плёнка, к капле кровь густеет и темнеет;
//   g-ember — не фильтр, а градиент: красное зарево вокруг горящих глаз (мышь в «Неожиданностях»).
//             Градиент, а не размытие, потому что он одинаково рисуется во всех браузерах, включая iPhone.
export default function GuardianDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="g-flesh" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence type="turbulence" baseFrequency="0.035" numOctaves="2" seed="4" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="9" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="0.35" result="soft" />
          <feColorMatrix in="soft" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.4 1.42" result="specks" />
          <feComposite in="specks" in2="shape" operator="in" result="grain" />
          <feMerge>
            <feMergeNode in="shape" />
            <feMergeNode in="grain" />
          </feMerge>
        </filter>

        <filter id="g-stone" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="3" seed="2" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="4" xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" seed="5" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="0.5" result="soft" />
          <feColorMatrix in="soft" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.4 1.5" result="specks" />
          <feComposite in="specks" in2="shape" operator="in" result="grain" />
          <feMerge>
            <feMergeNode in="shape" />
            <feMergeNode in="grain" />
          </feMerge>
        </filter>

        <filter id="g-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="g-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>

        <linearGradient id="t-blood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopOpacity="0.72" style={{ stopColor: 'var(--blood)' }} />
          <stop offset="0.55" style={{ stopColor: 'var(--blood)' }} />
          <stop offset="1" style={{ stopColor: 'var(--blood-dark)' }} />
        </linearGradient>

        <radialGradient id="g-ember">
          <stop offset="0" stopColor="#ff5a4a" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ff2d3f" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff2d3f" stopOpacity="0" />
        </radialGradient>

        {/* Два шума сдвигают точки букв: крупный плавно «ведёт» штрихи, мелкий выгрызает кромку.
            Сдвиги маленькие — буквы остаются чёткими, но перестают быть ровными, как из типографии. */}
        <filter id="t-rough" x="-4%" y="-20%" width="108%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.08" numOctaves="2" seed="11" result="wave" />
          <feDisplacementMap in="SourceGraphic" in2="wave" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="warped" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="3" result="grit" />
          <feDisplacementMap in="warped" in2="grit" scale="1" xChannelSelector="G" yChannelSelector="R" />
        </filter>
      </defs>
    </svg>
  );
}
