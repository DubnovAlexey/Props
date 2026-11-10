// Схемы к урокам (двойное кодирование: слово + картинка запоминаются
// лучше, чем одно слово). Все цвета — CSS-переменные темы.
// <Diagram name="flow" /> — выбор схемы по имени, как в таблице маршрутов.
import styles from './Diagram.module.css';

/** Прямоугольник с заголовком и подписью. main — акцентный вариант */
function Box({ x, y, w, h, title, sub, main = false, good = false, mono = false }) {
  const tone = good ? styles.good : main ? styles.main : styles.box;
  const cx = x + w / 2;
  return (
    <g>
      <rect className={tone} x={x} y={y} width={w} height={h} rx="10" />
      <text className={styles.title} x={cx} y={sub ? y + h / 2 - 3 : y + h / 2 + 5} textAnchor="middle">
        {title}
      </text>
      {sub && (
        <text className={mono ? styles.mono : styles.sub} x={cx} y={y + h / 2 + 15} textAnchor="middle">
          {sub}
        </text>
      )}
    </g>
  );
}

function Markers({ id }) {
  return (
    <defs>
      <marker id={`${id}-a`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" className={styles.markerEdge} />
      </marker>
      <marker id={`${id}-u`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" className={styles.markerUp} />
      </marker>
    </defs>
  );
}

const down = (id) => ({ className: styles.edge, markerEnd: `url(#${id}-a)` });
const up = (id) => ({ className: styles.edgeUp, markerEnd: `url(#${id}-u)` });

function JsxDiagram() {
  return (
    <svg viewBox="0 0 320 236" role="img" aria-label="JSX превращается в вызов jsx и затем в объект-элемент">
      <Markers id="dj" />
      <Box x={10} y={8} w={300} h={52} title="1. Ты пишешь JSX" sub={'<Card title="Сыр" />'} mono />
      <path d="M160 60V86" {...down('dj')} />
      <circle className={styles.dot} cx="160" cy="62" r="4">
        <animate attributeName="cy" values="62;84;62" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <Box x={10} y={88} w={300} h={52} title="2. Сборщик делает вызов функции" sub="jsx(Card, { title: 'Сыр' })" mono />
      <path d="M160 140V166" {...down('dj')} />
      <Box x={10} y={168} w={300} h={58} title="3. Получается элемент — объект" sub="{ type: Card, props: { title: 'Сыр' } }" mono main />
    </svg>
  );
}

function TreeDiagram() {
  return (
    <svg viewBox="0 0 320 222" role="img" aria-label="Дерево компонентов: App, Header, ProductList и карточки с ключами">
      <path className={styles.edge} d="M160 46V62H80V80M160 62H240V80M240 118V134H158V150M240 134V150" />
      <Box x={110} y={8} w={100} h={38} title="App" main />
      <Box x={20} y={80} w={120} h={38} title="Header" />
      <Box x={180} y={80} w={120} h={38} title="ProductList" />
      <Box x={128} y={150} w={60} h={46} title="Card" sub="key=1" mono />
      <Box x={210} y={150} w={60} h={46} title="Card" sub="key=2" mono />
      <text className={styles.sub} x="160" y="216" textAnchor="middle">
        Родитель решает, какие пропсы получат дети
      </text>
    </svg>
  );
}

function FlowDiagram() {
  return (
    <svg viewBox="0 0 320 234" role="img" aria-label="Пропсы идут вниз от родителя к ребёнку, вызовы функций идут вверх">
      <Markers id="df" />
      <Box x={50} y={8} w={220} h={54} title="Родитель" sub="хранит данные и функции" main />
      <path d="M115 62V170" {...down('df')} />
      <g className={styles.travelDown}>
        <rect className={styles.parcel} x="93" y="70" width="44" height="22" rx="5" />
        <text className={styles.parcelText} x="115" y="85" textAnchor="middle">
          props
        </text>
      </g>
      <path d="M205 170V62" {...up('df')} />
      <circle className={`${styles.dotUp} ${styles.travelUp}`} cx="205" cy="160" r="5" />
      <text className={styles.label} x="12" y="112">
        данные
      </text>
      <text className={styles.label} x="12" y="128">
        вниз ↓
      </text>
      <text className={styles.labelUp} x="216" y="112">
        onDelete(7)
      </text>
      <text className={styles.labelUp} x="216" y="128">
        вызов вверх ↑
      </text>
      <Box x={50} y={172} w={220} h={54} title="Ребёнок" sub="показывает и сообщает о событиях" />
    </svg>
  );
}

function StateDiagram() {
  return (
    <svg viewBox="0 0 320 226" role="img" aria-label="Пропсы приходят снаружи, состояние живёт внутри компонента">
      <Markers id="ds" />
      <path d="M86 4V58" {...down('ds')} />
      <text className={styles.label} x="98" y="22">
        пропсы: step = 1
      </text>
      <text className={styles.sub} x="98" y="38" textAnchor="start">
        приходят снаружи, только чтение
      </text>
      <rect className={styles.box} x="16" y="60" width="288" height="156" rx="14" />
      <text className={styles.title} x="32" y="84">
        Компонент Counter
      </text>
      <text className={styles.sub} x="32" y="118" textAnchor="start">
        читает пропсы:
      </text>
      <text className={styles.mono} x="32" y="136" textAnchor="start">
        step
      </text>
      <rect className={styles.main} x="150" y="96" width="140" height="104" rx="12" />
      <text className={styles.title} x="220" y="122" textAnchor="middle">
        состояние
      </text>
      <text className={styles.mono} x="220" y="146" textAnchor="middle">
        count = 3
      </text>
      <text className={styles.sub} x="220" y="168" textAnchor="middle">
        своя память,
      </text>
      <text className={styles.sub} x="220" y="184" textAnchor="middle">
        меняется через setCount
      </text>
    </svg>
  );
}

function LiftingDiagram() {
  return (
    <svg viewBox="0 0 320 214" role="img" aria-label="До и после подъёма состояния в общего родителя">
      <Markers id="dl" />
      <text className={styles.label} x="10" y="16">
        До
      </text>
      <path className={styles.edge} d="M80 58V76H42V100M80 76H118V100" />
      <Box x={30} y={24} w={100} h={34} title="Страница" />
      <Box x={8} y={100} w={70} h={50} title="Поиск" sub="query" mono />
      <Box x={84} y={100} w={70} h={50} title="Список" sub="не видит" />
      <text className={styles.labelBad} x="119" y="168" textAnchor="middle">
        ✗ соседи не делятся
      </text>

      <line className={styles.divider} x1="162" x2="162" y1="6" y2="180" />

      <text className={styles.label} x="172" y="16">
        После
      </text>
      <Box x={186} y={24} w={120} h={46} title="Страница" sub="query" mono main />
      <path d="M220 70V104" {...down('dl')} />
      <path d="M284 70V104" {...down('dl')} />
      <path d="M232 104V72" {...up('dl')} />
      <Box x={168} y={106} w={70} h={44} title="Поиск" />
      <Box x={246} y={106} w={70} h={44} title="Список" />
      <text className={styles.labelGood} x="242" y="168" textAnchor="middle">
        ✓ данные у общего родителя
      </text>
      <text className={styles.sub} x="160" y="204" textAnchor="middle">
        Сплошная — пропсы вниз, пунктир — onQueryChange вверх
      </text>
    </svg>
  );
}

function ModalDiagram() {
  return (
    <svg viewBox="0 0 320 244" role="img" aria-label="Какой проп управляет какой частью модального окна">
      <rect className={styles.backdrop} x="6" y="8" width="192" height="226" rx="12" />
      <rect className={styles.dialog} x="22" y="34" width="160" height="170" rx="10" />
      <text className={styles.title} x="38" y="60">
        Ошибка
      </text>
      <line className={styles.divider} x1="22" x2="182" y1="72" y2="72" />
      <rect className={styles.slot} x="34" y="84" width="136" height="64" rx="8" />
      <text className={styles.sub} x="46" y="110" textAnchor="start">
        Введите имя
      </text>
      <text className={styles.sub} x="46" y="128" textAnchor="start">
        и название блюда.
      </text>
      <rect className={styles.box} x="98" y="160" width="72" height="30" rx="8" />
      <text className={styles.small} x="134" y="180" textAnchor="middle">
        Понятно
      </text>

      <path className={styles.leader} d="M198 22H212" />
      <text className={styles.prop} x="216" y="26">
        isOpen
      </text>
      <text className={styles.sub} x="216" y="41" textAnchor="start">
        показать или нет
      </text>
      <path className={styles.leader} d="M100 55H212" />
      <text className={styles.prop} x="216" y="59">
        title
      </text>
      <text className={styles.sub} x="216" y="74" textAnchor="start">
        текст заголовка
      </text>
      <path className={styles.leaderMain} d="M170 116H212" />
      <text className={styles.propMain} x="216" y="120">
        children
      </text>
      <text className={styles.sub} x="216" y="135" textAnchor="start">
        что между тегами
      </text>
      <path className={styles.leader} d="M170 175H212" />
      <text className={styles.prop} x="216" y="179">
        onClose
      </text>
      <text className={styles.sub} x="216" y="194" textAnchor="start">
        что сделать по клику
      </text>
    </svg>
  );
}

function DrillingDiagram() {
  return (
    <svg viewBox="0 0 320 250" role="img" aria-label="Передача user через все уровни и доступ через Context">
      <Markers id="dd" />
      <text className={styles.label} x="8" y="14">
        Drilling
      </text>
      <Box x={10} y={22} w={120} h={34} title="App" />
      <path d="M70 56V76" {...down('dd')} />
      <text className={styles.prop} x="78" y="70">
        user
      </text>
      <Box x={10} y={78} w={120} h={34} title="Page" />
      <path d="M70 112V132" {...down('dd')} />
      <text className={styles.prop} x="78" y="126">
        user
      </text>
      <Box x={10} y={134} w={120} h={34} title="List" />
      <path d="M70 168V188" {...down('dd')} />
      <text className={styles.prop} x="78" y="182">
        user
      </text>
      <Box x={10} y={190} w={120} h={34} title="Card" />

      <line className={styles.divider} x1="150" x2="150" y1="4" y2="230" />

      <text className={styles.label} x="164" y="14">
        Context
      </text>
      <Box x={164} y={22} w={132} h={34} title="Провайдер" main />
      <path d="M230 56V76" className={styles.edge} />
      <Box x={164} y={78} w={132} h={34} title="Page" />
      <path d="M230 112V132" className={styles.edge} />
      <Box x={164} y={134} w={132} h={34} title="List" />
      <path d="M230 168V188" className={styles.edge} />
      <Box x={164} y={190} w={132} h={34} title="Card" sub="useContext" mono />
      <path d="M296 39H312V207H300" className={styles.tunnel} markerEnd="url(#dd-u)" />
      <text className={styles.sub} x="160" y="244" textAnchor="middle">
        Пунктир — значение из Context в обход промежуточных
      </text>
    </svg>
  );
}

function MemoDiagram() {
  return (
    <svg viewBox="0 0 320 252" role="img" aria-label="Как memo решает, перерисовывать ли компонент">
      <Markers id="dm" />
      <Box x={60} y={6} w={200} h={34} title="Родитель перерисовался" />
      <path d="M160 40V56" {...down('dm')} />
      <polygon className={styles.box} points="160,58 222,82 160,106 98,82" />
      <text className={styles.title} x="160" y="87" textAnchor="middle">
        memo?
      </text>
      <path d="M222 82H246" {...down('dm')} />
      <text className={styles.small} x="232" y="76" textAnchor="middle">
        нет
      </text>
      <Box x={248} y={66} w={66} h={34} title="Рендер" />
      <path d="M160 106V124" {...down('dm')} />
      <text className={styles.small} x="170" y="120">
        да
      </text>
      <polygon className={styles.box} points="160,126 246,160 160,194 74,160" />
      <text className={styles.title} x="160" y="157" textAnchor="middle">
        Пропсы равны?
      </text>
      <text className={styles.mono} x="160" y="174" textAnchor="middle">
        Object.is
      </text>
      <path d="M246 160H281V102" {...down('dm')} />
      <text className={styles.small} x="262" y="154" textAnchor="middle">
        нет
      </text>
      <path d="M160 194V210" {...down('dm')} />
      <text className={styles.small} x="170" y="206">
        да
      </text>
      <Box x={70} y={212} w={180} h={34} title="Пропустить рендер" good />
    </svg>
  );
}

const DIAGRAMS = {
  jsx: JsxDiagram,
  tree: TreeDiagram,
  flow: FlowDiagram,
  state: StateDiagram,
  lifting: LiftingDiagram,
  modal: ModalDiagram,
  drilling: DrillingDiagram,
  memo: MemoDiagram,
};

export const DIAGRAM_NAMES = Object.keys(DIAGRAMS);

export default function Diagram({ name, caption }) {
  const Chosen = DIAGRAMS[name];
  if (!Chosen) return null;
  return (
    <figure className={styles.figure}>
      <Chosen />
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
