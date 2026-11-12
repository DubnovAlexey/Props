// «Неожиданности»: время от времени по экрану кто-то пролетает или пробегает —
// летучая мышь с горящими глазами, стая, гоблин с факелом, тролль, крысы, паук на нити,
// а то из темноты выглянет хозяин пещеры или бросится в лицо банши.
// Зачем: короткий испуг переключает внимание — мозг на секунду отвлекается,
// отдыхает и возвращается к задаче свежим.
//
// Как устроено:
//  • кого и когда показать, по какой траектории — считает utils/scares.js (чистые функции);
//  • этот компонент заводит таймер, рисует одну неожиданность за раз и убирает её по окончании;
//  • слой не ловит нажатия: кнопки под пролетающей мышью работают как обычно.
// Неожиданностей нет, если: игрок выключил их (карта пещер → «Неожиданности»), попросил
// систему уменьшить движение, идёт мини-игра (Граф улетел) или вкладка не на экране.
// Пока игрок печатает ответ, появление откладывается — пугать посреди слова нечестно.
//   caveId — пещера, в которой сейчас игрок: из темноты выглядывает именно её хозяин.
import { useEffect, useEffectEvent, useState } from 'react';
import { useProgress } from '../../state/ProgressContext.jsx';
import { useMascotState } from '../../mascot/MascotContext.jsx';
import { useReducedMotion } from '../../hooks/useMediaQuery.js';
import { GUARDIANS } from '../../mascot/guardians/index.js';
import Guardian from '../../mascot/guardians/Guardian.jsx';
import Bat from '../../mascot/Bat.jsx';
import { sfx } from '../../audio/sfx.js';
import { buildScare, nextDelay, pickScare, SCARE_EVENT, SCARE_KINDS } from '../../utils/scares.js';
import { BloodQuill, GoblinRunner, HangingSpider, Rat, TrollRunner } from './creatures.jsx';
import styles from './Scares.module.css';

const RETRY_MS = 6000; // игрок печатает или вкладка скрыта — заглянем позже
const GUARDIAN_IDS = Object.keys(GUARDIANS);
const KNOWN = new Set(SCARE_KINDS.map((item) => item.kind));

let lastId = 0; // у каждой неожиданности свой номер: по нему React понимает, что пришла новая

/** Игрок сейчас набирает текст (ответ на задание, объяснение Лунатику)? */
function isTyping() {
  const element = document.activeElement;
  return Boolean(
    element &&
    (element.isContentEditable ||
      element.matches('textarea, input:not([type="radio"]):not([type="checkbox"]):not([type="button"]):not([type="range"])')),
  );
}

/** Одна летящая мышь: траектория приходит CSS-переменными в style */
function FlyingBat({ bat }) {
  return (
    <span className={styles.across} style={bat.style}>
      <span className={styles.swoop}>
        <span className={styles.flutter}>
          <Bat size={bat.size} fierce />
        </span>
      </span>
    </span>
  );
}

/** Рисует неожиданность по её описанию из buildScare */
function ScareView({ scare }) {
  const facing = scare.flip ? styles.flip : styles.facing;

  switch (scare.kind) {
    case 'bat':
    case 'swarm':
      return scare.bats.map((bat) => <FlyingBat key={bat.key} bat={bat} />);

    case 'perch':
      return (
        <span className={styles.percher} style={scare.style}>
          <span className={styles.percherBody}>
            <Bat size={scare.size} fierce />
          </span>
          <span className={styles.percherEyes}>
            <i />
            <i />
          </span>
        </span>
      );

    case 'eyes':
      return scare.pairs.map((pair) => (
        <span key={pair.key} className={styles.lurker} style={pair.style}>
          <i />
          <i />
        </span>
      ));

    case 'goblin':
    case 'troll': {
      const Runner = scare.kind === 'goblin' ? GoblinRunner : TrollRunner;
      return (
        <span className={styles.runner} style={scare.style}>
          <span className={facing}>
            <Runner size={scare.size} />
          </span>
        </span>
      );
    }

    case 'rats':
      return scare.rats.map((rat) => (
        <span key={rat.key} className={styles.runner} style={rat.style}>
          <span className={facing}>
            <Rat size={rat.size} />
          </span>
        </span>
      ));

    case 'quill':
      // Строка крови рисуется вслед за пером: обе анимации идут одно и то же время (--dur)
      return (
        <span className={`${styles.quillLane} ${scare.flip ? styles.quillBack : ''}`} style={scare.style}>
          <svg className={styles.quillInk} viewBox={`0 0 ${scare.ink.width} ${scare.ink.height}`} aria-hidden="true">
            <path d={scare.ink.d} pathLength="1" />
          </svg>
          <span className={styles.quillPen}>
            <span className={styles.quillBob}>
              <BloodQuill size={scare.size} />
            </span>
          </span>
        </span>
      );

    case 'spider':
      return (
        <span className={styles.dropper} style={scare.style}>
          <span className={styles.dangle}>
            <span className={styles.thread} />
            <HangingSpider size={scare.size} />
          </span>
        </span>
      );

    case 'banshee':
    case 'apparition':
      return (
        <span className={`${styles.ghost} ${scare.kind === 'banshee' ? styles.lunge : styles.loom}`} style={scare.style}>
          <Guardian id={scare.guardianId} size={scare.size} />
        </span>
      );

    default:
      return null;
  }
}

export default function Scares({ caveId = null }) {
  const { progress } = useProgress();
  const { hidden } = useMascotState();
  const reducedMotion = useReducedMotion();
  const [scare, setScare] = useState(null);

  // По расписанию неожиданности идут, только когда всё разрешено.
  // Вручную (кнопкой в «Мастерской художника») их можно вызвать и при выключенной настройке.
  const scheduled = !reducedMotion && progress.scares !== false && !hidden;

  // useEffectEvent: функция видит свежий caveId, но сама не заставляет эффекты
  // перезапускаться — иначе таймер сбрасывался бы при каждом переходе между страницами.
  const launch = useEffectEvent((kind, manual = false) => {
    const next = buildScare(kind, Math.random, {
      width: window.innerWidth,
      height: window.innerHeight,
      caveId,
      guardianIds: GUARDIAN_IDS,
    });
    if (!next) return 0;
    lastId += 1;
    setScare({ ...next, id: lastId, manual });
    sfx.scare(kind);
    return next.duration;
  });

  // Расписание: первая — через 12–25 секунд, дальше — через 30–75 после предыдущей
  useEffect(() => {
    if (!scheduled) return undefined;
    let timer = 0;
    let previous = null;

    const fire = () => {
      if (document.hidden || isTyping()) {
        timer = setTimeout(fire, RETRY_MS);
        return;
      }
      previous = pickScare(Math.random, previous);
      const duration = launch(previous);
      timer = setTimeout(fire, duration + nextDelay(Math.random));
    };

    timer = setTimeout(fire, nextDelay(Math.random, true));
    return () => clearTimeout(timer);
  }, [scheduled]);

  // Вызов вручную: window.dispatchEvent(new CustomEvent('props:scare', { detail: { kind: 'troll' } }))
  useEffect(() => {
    if (reducedMotion) return undefined;
    const onScare = (event) => {
      const kind = event.detail?.kind;
      launch(KNOWN.has(kind) ? kind : pickScare(Math.random), true);
    };
    window.addEventListener(SCARE_EVENT, onScare);
    return () => window.removeEventListener(SCARE_EVENT, onScare);
  }, [reducedMotion]);

  // Отыграла — убираем со сцены
  useEffect(() => {
    if (!scare) return undefined;
    const timer = setTimeout(() => setScare(null), scare.duration + 200);
    return () => clearTimeout(timer);
  }, [scare]);

  // Настройку выключили или началась мини-игра посреди пролёта — прячем сразу
  const visible = scare && (scare.manual || scheduled) && !reducedMotion ? scare : null;
  if (!visible) return null;

  return (
    <div className={styles.layer} aria-hidden="true" data-scare={visible.kind}>
      {/* key: новая неожиданность — новые элементы, анимации стартуют с начала */}
      <ScareView key={visible.id} scare={visible} />
    </div>
  );
}
