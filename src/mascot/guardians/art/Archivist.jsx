// Упырь-архивариус Формуляр — хозяин Кафедры Графа (двадцать вопросов преподавателя и мини-тест).
// Ведёт реестр учеников Графа и принимает у них устный экзамен — без шпаргалок и без подсказок.
// Пенсне с треснувшим стеклом, костяное перо в крови, раскрытый журнал с кровавыми галочками и огарок свечи.
import { Drop, Trail } from '../gore.jsx';

// Строки реестра в журнале: y, длина строки, есть ли кровавая галочка
const ROWS = [
  [168, 34, true],
  [175, 30, true],
  [182, 36, false],
  [189, 28, true],
];

export default function Archivist({ u }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}skin`} cx="50%" cy="85%" r="75%">
          <stop offset="0" stopColor="#efe1bd" />
          <stop offset="0.45" stopColor="#b59f74" />
          <stop offset="0.82" stopColor="#5a4a33" />
          <stop offset="1" stopColor="#1c150d" />
        </radialGradient>
        <linearGradient id={`${u}robe`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2118" />
          <stop offset="1" stopColor="#070504" />
        </linearGradient>
        <linearGradient id={`${u}page`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9c79c" />
          <stop offset="1" stopColor="#7d6a45" />
        </linearGradient>
        <radialGradient id={`${u}flame`} cx="50%" cy="70%" r="60%">
          <stop offset="0" stopColor="#fff4c2" />
          <stop offset="0.5" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ff6a1f" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* корешки журналов на полке за спиной */}
      <g opacity="0.35">
        {[18, 30, 40, 54, 146, 158, 170].map((x, i) => (
          <rect key={x} x={x} y={i % 2 ? 22 : 28} width={i % 3 ? 10 : 12} height={i % 2 ? 60 : 54} fill="#3b2c1c" />
        ))}
        <path d="M14 84 L64 84 M140 84 L186 84" stroke="#5a4630" strokeWidth="3" />
      </g>

      <g filter="url(#g-flesh)">
        {/* мантия с высоким стоячим воротником */}
        <path d="M30 200 C34 160 56 138 100 134 C144 138 166 160 170 200 Z" fill={`url(#${u}robe)`} />
        <path d="M62 150 L74 104 L92 136 Z M138 150 L126 104 L108 136 Z" fill="#1a130c" />

        {/* вытянутая голова с запавшими щеками */}
        <path
          d="M100 34 C126 34 140 56 138 86 C137 108 128 128 112 140 C106 145 94 145 88 140 C72 128 63 108 62 86 C60 56 74 34 100 34 Z"
          fill={`url(#${u}skin)`}
        />
        <path
          d="M70 98 C76 112 84 120 90 122 M130 98 C124 112 116 120 110 122"
          stroke="#3b2e1d"
          strokeWidth="3"
          opacity="0.55"
          fill="none"
        />
        {/* морщины-строки на лбу — как линейки журнала */}
        <path d="M80 52 C92 49 108 49 120 52 M78 59 C92 56 108 56 122 59" stroke="#4a3a26" strokeWidth="1.1" opacity="0.6" fill="none" />

        {/* глубокие глазницы */}
        <ellipse cx="85" cy="80" rx="11" ry="9" fill="#0c0805" />
        <ellipse cx="115" cy="80" rx="11" ry="9" fill="#0c0805" />

        {/* нос-крючок */}
        <path d="M100 82 C97 92 95 100 98 106 L103 104 C104 98 103 90 100 82 Z" fill="#4b3b26" />

        {/* узкий рот, зашитый суровой ниткой: ухмылка экзаменатора */}
        <path d="M84 120 C92 126 108 126 118 116" stroke="#1a0f08" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M89 118 L91 126 M96 120 L97 128 M103 120 L103 128 M110 119 L109 126" stroke="#c8b48a" strokeWidth="1" />
      </g>

      {/* пенсне: левое стекло треснуло */}
      <g fill="none" stroke="#b08d4a" strokeWidth="1.6">
        <circle cx="85" cy="80" r="12.5" />
        <circle cx="115" cy="80" r="12.5" />
        <path d="M97.5 80 C99 77 101 77 102.5 80" />
        <path d="M127 82 C138 92 140 110 136 128" strokeWidth="0.8" opacity="0.7" />
      </g>
      <path d="M78 72 L86 80 L82 88 M86 80 L94 76" stroke="#e8f0ff" strokeWidth="0.7" opacity="0.55" fill="none" />

      {/* раскрытый журнал-реестр с кровавыми галочками */}
      <path d="M50 160 L98 156 L98 200 L46 200 Z" fill={`url(#${u}page)`} />
      <path d="M102 156 L150 160 L154 200 L102 200 Z" fill={`url(#${u}page)`} />
      <path d="M100 156 L100 200" stroke="#3b2c1c" strokeWidth="2" />
      {ROWS.map(([y, length, tick]) => (
        <g key={y}>
          <path d={`M56 ${y} L${56 + length} ${y - 0.5}`} stroke="#4a3a26" strokeWidth="1" opacity="0.7" />
          {tick && <path d={`M${60 + length} ${y - 1} l2 2.5 l4.5 -6`} stroke="#8c0a1b" strokeWidth="1.6" fill="none" />}
        </g>
      ))}
      <path d="M108 170 L140 171 M108 177 L134 178 M108 184 L142 185" stroke="#4a3a26" strokeWidth="1" opacity="0.7" />

      {/* костяная рука с пером: пальцы сжимают перо, перо водит по журналу (g-sway — ось вверху, у кончика
          пера: качается остриё, будто он пишет), с острия капает кровь */}
      <g className="g-sway">
        <path d="M150 150 C140 146 132 150 128 158 C126 162 130 166 136 164 C142 162 150 160 158 162 Z" fill="#a8946a" />
        <path d="M130 158 C134 156 138 156 142 158 M132 162 C136 160 140 160 144 161" stroke="#4a3a26" strokeWidth="1.2" fill="none" />
        <path d="M128 160 L156 120 C160 114 166 110 170 108 C166 116 162 124 158 128 Z" fill="#e8dcc0" />
        <path d="M128 160 L124 168" stroke="#2a1d10" strokeWidth="1.6" />
      </g>
      <Trail d="M124 168 C123.4 172 124.4 175 123.8 179" width={1.4} />
      <Drop cx={123.8} cy={182} r={1.5} />
      {/* свежая галочка в реестре — кровь ещё стекает */}
      <Drop cx={95} cy={186} r={1.1} late />

      {/* огарок свечи на краю журнала */}
      <rect x="40" y="140" width="9" height="20" rx="1.5" fill="#d8cbb0" />
      <path d="M40 146 C43 150 41 154 44 158" stroke="#b9ab8e" strokeWidth="1.2" fill="none" />
      <ellipse className="g-flicker" cx="44.5" cy="134" rx="5" ry="9" fill={`url(#${u}flame)`} filter="url(#g-glow)" />

      {/* блик на правом стекле пенсне вспыхивает и гаснет вместе с глазами */}
      <path className="g-eye" d="M108 73 C111 71 115 71 118 72" stroke="#fff6dc" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* жёлтые глаза за стёклами пенсне: читают тебя, как строку реестра */}
      <g className="g-eye" filter="url(#g-glow)" fill="#ffcf5a">
        <circle cx="86" cy="81" r="2.8" />
        <circle cx="116" cy="81" r="2.8" />
      </g>
    </>
  );
}
