// «Мастерская художника» — вся графика игры на одной странице: Граф во всех
// настроениях и размерах, летучая мышь, заставка, хозяева пещер (живые и поверженные).
// Нужна, чтобы править рисунки и сразу видеть результат, не проходя пещеры.
// Страница служебная: открывается по адресу #gallery только в режиме разработки
// (npm run dev) и в сборку для игроков не попадает — см. src/App.jsx.
import { CHAPTERS } from '../../content/chapters/index.js';
import Vampire from '../../mascot/Vampire.jsx';
import Bat from '../../mascot/Bat.jsx';
import Guardian from '../../mascot/guardians/Guardian.jsx';
import CaveArt from '../home/CaveArt.jsx';
import styles from './Gallery.module.css';

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
  return (
    <div className="stack">
      <header>
        <span className="eyebrow">Только для разработки</span>
        <h1>🎨 Мастерская художника</h1>
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
        </div>
      </section>
    </div>
  );
}
