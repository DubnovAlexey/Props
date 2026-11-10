// Декоративные мыши, которые лениво пролетают по небу в шапке.
// Данные о мышах — массив объектов, а каждая мышь получает их пропсами.
import Bat from './Bat.jsx';
import styles from './Bat.module.css';

const FLOCK = [
  { top: 10, size: 26, duration: 26, delay: 0 },
  { top: 34, size: 18, duration: 34, delay: 9 },
  { top: 20, size: 22, duration: 30, delay: 17 },
];

export default function FlyingBats({ count = FLOCK.length }) {
  return (
    <div className={styles.sky} aria-hidden="true">
      {FLOCK.slice(0, count).map((bat, i) => (
        <span
          key={i}
          className={styles.drifter}
          style={{ top: bat.top, animationDuration: `${bat.duration}s`, animationDelay: `${bat.delay}s` }}
        >
          <Bat size={bat.size} />
        </span>
      ))}
    </div>
  );
}
