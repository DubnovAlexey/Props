// Мини-игра «Поймай мышей» — перемена для мозга.
// Короткая смена деятельности снимает усталость внимания, а надписи на
// мышах заставляют ещё раз быстро вспомнить материал (лёгкое повторение).
import { sfx } from '../../audio/sfx.js';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import Bat from '../../mascot/Bat.jsx';
import { pick } from '../../utils/random.js';
import { useReducedMotion } from '../../hooks/useMediaQuery.js';
import { useMascot } from '../../mascot/MascotContext.jsx';
import styles from './BatCatcher.module.css';
import { useContent, useI18n } from '../../i18n/I18nContext.jsx';
import { RichText } from '../../components/RichText/RichText.jsx';

// Пропсы: onScore(очки) — вызывается сам, когда время вышло (например, чтобы записать рекорд);
//         onFinish(очки) — по кнопке «дальше» (её подпись — finishLabel). Оба необязательные.
export default function BatCatcher({ roundId, duration = 20, onScore, onFinish, finishLabel }) {
  const { t } = useI18n();
  const { BREAK_ROUNDS } = useContent();
  // В состоянии — только id раунда: сам раунд (с надписями на языке игрока) берём из содержимого
  const [currentId, setCurrentId] = useState(() => (BREAK_ROUNDS[roundId] ? roundId : pick(Object.keys(BREAK_ROUNDS))));
  const round = BREAK_ROUNDS[currentId];
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState('intro'); // intro → play → over
  const [timeLeft, setTimeLeft] = useState(duration);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState({ good: 0, bad: 0 });
  const [bats, setBats] = useState([]);
  const nextId = useRef(0);
  const timers = useRef([]);
  const { hide, show } = useMascot();

  // На время игры Граф улетает, чтобы не закрывать мышей
  useEffect(() => {
    if (phase !== 'play') return undefined;
    hide();
    return show;
  }, [phase, hide, show]);

  // Игровой цикл: появляются мыши, тикает таймер
  useEffect(() => {
    if (phase !== 'play') return undefined;
    const spawn = setInterval(() => {
      const good = Math.random() < 0.55;
      const id = nextId.current++;
      const bat = {
        id,
        good,
        label: pick(good ? round.good : round.bad),
        top: 4 + Math.random() * 72,
        left: 4 + Math.random() * 56,
        duration: 4.4 + Math.random() * 2.4,
        fromLeft: Math.random() < 0.5,
        state: 'fly',
      };
      setBats((list) => [...list.slice(-8), bat]);
      // Без анимации мышь висит 2,6 секунды и исчезает
      if (reducedMotion) timers.current.push(setTimeout(() => removeBat(id), 2600));
    }, 850);
    const tick = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      clearInterval(spawn);
      clearInterval(tick);
    };
  }, [phase, round, reducedMotion]);

  useEffect(() => {
    if (phase === 'play' && timeLeft <= 0) {
      setPhase('over');
      setBats([]);
    }
  }, [phase, timeLeft]);

  // Время вышло — сообщаем счёт родителю. useEffectEvent даёт функцию, которая всегда
  // видит свежие score и onScore, но не заставляет эффект срабатывать при их изменении:
  // эффект зависит только от фазы игры и выполняется ровно один раз за раунд.
  const reportScore = useEffectEvent(() => onScore?.(score));
  useEffect(() => {
    if (phase === 'over') reportScore();
  }, [phase]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function removeBat(id) {
    setBats((list) => list.filter((bat) => bat.id !== id));
  }

  function catchBat(bat) {
    if (bat.state !== 'fly') return;
    setScore((value) => Math.max(0, value + (bat.good ? 1 : -1)));
    setCaught((value) => (bat.good ? { ...value, good: value.good + 1 } : { ...value, bad: value.bad + 1 }));
    setBats((list) => list.map((item) => (item.id === bat.id ? { ...item, state: bat.good ? 'caught' : 'wrong' } : item)));
    if (bat.good) sfx.catch();
    else sfx.wrong();
    timers.current.push(setTimeout(() => removeBat(bat.id), 450));
  }

  function start() {
    setScore(0);
    setCaught({ good: 0, bad: 0 });
    setTimeLeft(duration);
    setBats([]);
    setPhase('play');
  }

  function another() {
    setCurrentId(pick(Object.keys(BREAK_ROUNDS).filter((id) => id !== currentId)));
    setPhase('intro');
  }

  return (
    <div className={`card ${styles.wrap}`}>
      <div className={styles.top}>
        <div>
          <span className="eyebrow">{t('break.eyebrow', { seconds: duration })}</span>
          <h2 className={styles.title}>{round.title}</h2>
        </div>
        {phase === 'play' && (
          <div className={styles.hud} aria-live="polite">
            <span className="chip">⏳ {timeLeft}</span>
            <span className="chip">🦇 {score}</span>
          </div>
        )}
      </div>

      <div className={styles.arena}>
        <div className={styles.moon} aria-hidden="true" />

        {phase === 'intro' && (
          <div className={styles.overlay}>
            <p>
              <RichText text={t('break.rules')} />
            </p>
            <button type="button" className="btn btn-primary" onClick={start}>
              {t('break.go')}
            </button>
          </div>
        )}

        {phase === 'play' &&
          bats.map((bat) => (
            <button
              key={bat.id}
              type="button"
              className={[
                styles.flyer,
                reducedMotion ? styles.still : bat.fromLeft ? styles.ltr : styles.rtl,
                bat.state !== 'fly' ? styles[bat.state] : '',
              ].join(' ')}
              style={{
                top: `${bat.top}%`,
                left: reducedMotion ? `${bat.left}%` : undefined,
                animationDuration: reducedMotion ? undefined : `${bat.duration}s`,
              }}
              onAnimationEnd={reducedMotion ? undefined : (event) => event.target === event.currentTarget && removeBat(bat.id)}
              onClick={() => catchBat(bat)}
            >
              <Bat size={42} flapping={bat.state === 'fly'} className={!bat.fromLeft && !reducedMotion ? styles.flip : ''} />
              <span className={styles.batLabel}>{bat.label}</span>
            </button>
          ))}

        {phase === 'over' && (
          <div className={styles.overlay}>
            <p className={styles.result}>
              <RichText text={t('break.score', { score })} />
            </p>
            <p className="muted">{t('break.result', { good: caught.good, bad: caught.bad })}</p>
            <div className="row">
              <button type="button" className="btn" onClick={start}>
                {t('break.again')}
              </button>
              <button type="button" className="btn" onClick={another}>
                {t('break.another')}
              </button>
              {onFinish && (
                <button type="button" className="btn btn-primary" onClick={() => onFinish(score)}>
                  {finishLabel ?? t('common.next')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
