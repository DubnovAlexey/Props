// «Мастерская художника» — вся графика игры на одной странице: Граф во всех
// настроениях и размерах, летучая мышь, заставка, хозяева пещер (живые и поверженные),
// схемы-картинки к урокам (на языке игры — так проверяют, что переведённые подписи влезли в рамки).
// Нужна, чтобы править рисунки и сразу видеть результат, не проходя пещеры.
// Страница служебная: открывается по адресу #gallery только в режиме разработки
// (npm run dev) и в сборку для игроков не попадает — см. src/App.jsx.
import { useContent } from '../../i18n/I18nContext.jsx';
import Vampire from '../../mascot/Vampire.jsx';
import Bat from '../../mascot/Bat.jsx';
import Guardian from '../../mascot/guardians/Guardian.jsx';
import CaveArt from '../home/CaveArt.jsx';
import Diagram, { DIAGRAM_NAMES } from '../../components/Diagram/Diagram.jsx';
import { GoblinRunner, HangingSpider, Rat, TrollRunner } from '../../components/Scares/creatures.jsx';
import { SCARE_EVENT, SCARE_KINDS } from '../../utils/scares.js';
import styles from './Gallery.module.css';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';

const MOODS = [
  { id: 'idle', label: 'idle — парит' },
  { id: 'talk', label: 'talk — говорит' },
  { id: 'happy', label: 'happy — злорадствует' },
  { id: 'sad', label: 'sad — хмурится' },
  { id: 'point', label: 'point — указывает' },
  { id: 'wave', label: 'wave — взмахивает' },
];

// Размеры, в которых Граф встречается в игре: колонка на широком экране, бестиарий, угол телефона, облачко
const GRAF_SIZES = [150, 86, 52, 34];

export default function GalleryPage() {
  const { CHAPTERS, COURSE } = useContent();
  return (
    <div className="stack">
      <header>
        <span className="eyebrow">Только для разработки</span>
        <BloodTitle>🎨 Мастерская художника</BloodTitle>
        <p className="muted">Вся графика игры. Тему (ночь / день) переключает кнопка в шапке.</p>
      </header>

      <section className="card stack">
        <h2>Граф Пропсула — настроения</h2>
        <div className={styles.row}>
          {MOODS.map((mood) => (
            <figure key={mood.id} className={styles.cell}>
              <Vampire mood={mood.id} size={230} />
              <figcaption>{mood.label}</figcaption>
            </figure>
          ))}
        </div>
        <h3>Размеры в игре</h3>
        <div className={styles.row}>
          {GRAF_SIZES.map((size) => (
            <figure key={size} className={styles.cell}>
              <Vampire mood="idle" size={size} />
              <figcaption>{size}px</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="card stack">
        <h2>Лунатик и стая</h2>
        <div className={styles.row}>
          {[140, 70, 42, 26].map((size) => (
            <figure key={size} className={styles.cell}>
              <Bat size={size} />
              <figcaption>{size}px</figcaption>
            </figure>
          ))}
          <figure className={styles.cell}>
            <Bat size={140} flapping={false} />
            <figcaption>крылья раскрыты</figcaption>
          </figure>
        </div>
      </section>

      <section className="card stack">
        <h2>Неожиданности</h2>
        <p className="muted small">
          Кнопка запускает неожиданность сразу — не дожидаясь расписания. Работает и тогда, когда в настройках они выключены.
        </p>
        <div className="row">
          {SCARE_KINDS.map((item) => (
            <button
              key={item.kind}
              type="button"
              className="btn btn-small"
              onClick={() => window.dispatchEvent(new CustomEvent(SCARE_EVENT, { detail: { kind: item.kind } }))}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className={styles.row}>
          <figure className={styles.cell}>
            <Bat size={170} fierce />
            <figcaption>злая мышь (fierce)</figcaption>
          </figure>
          <figure className={styles.cell}>
            <GoblinRunner size={170} />
            <figcaption>гоблин с факелом</figcaption>
          </figure>
          <figure className={styles.cell}>
            <TrollRunner size={220} />
            <figcaption>тролль с дубиной</figcaption>
          </figure>
          <figure className={styles.cell}>
            <Rat size={130} />
            <figcaption>крыса</figcaption>
          </figure>
          <figure className={styles.cell}>
            <HangingSpider size={150} />
            <figcaption>паук на нити</figcaption>
          </figure>
        </div>
      </section>

      <section className="card stack">
        <h2>Заставка карты</h2>
        <CaveArt />
      </section>

      <section className="card stack">
        <h2>Хозяева пещер</h2>
        <div className={styles.row}>
          {CHAPTERS.map((chapter) => (
            <figure key={chapter.id} className={styles.cell}>
              <div className={styles.pair}>
                <Guardian id={chapter.id} size={150} />
                <Guardian id={chapter.id} size={64} mood="defeated" />
              </div>
              <figcaption>
                {chapter.order}. {chapter.story.guardian.name}, {chapter.story.guardian.kind}
              </figcaption>
            </figure>
          ))}
          {/* хозяин Кафедры Графа — не пещеры, но рисуется так же */}
          <figure className={styles.cell}>
            <div className={styles.pair}>
              <Guardian id="course" size={150} />
              <Guardian id="course" size={64} mood="defeated" />
            </div>
            <figcaption>
              📋 {COURSE.guardian.name}, {COURSE.guardian.kind}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="card stack">
        <h2>Схемы к урокам</h2>
        <p className="muted small">
          Подписи — на языке игры (переключи язык глобусом в шапке). Ни одна надпись не должна вылезать за рамку рисунка.
        </p>
        <div className={styles.row}>
          {DIAGRAM_NAMES.map((name) => (
            <figure key={name} className={styles.cell} data-diagram={name}>
              <Diagram name={name} />
              <figcaption>{name}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
