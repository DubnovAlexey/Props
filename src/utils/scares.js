// «Неожиданности»: кто и когда вдруг появляется на экране.
// Здесь только расчёты — чистые функции без браузера и без React:
// им дают «случайность» (функцию random) и размеры экрана, а они возвращают,
// кого показать, через сколько и по какой траектории. Поэтому их легко проверить тестами.
// Рисует и запускает всё это components/Scares.
//
// Зачем это в учебной игре: короткий испуг переключает внимание. Мозг на секунду
// отвлекается от задачи, отдыхает — и возвращается к ней свежим.

/** Имя события, которым неожиданность можно вызвать вручную (кнопки в «Мастерской художника») */
export const SCARE_EVENT = 'props:scare';

// Чем больше weight, тем чаще выпадает. Крупные пугалки (банши, лицо из темноты) — реже:
// редкое пугает сильнее.
export const SCARE_KINDS = [
  { kind: 'bat', weight: 3, title: 'Мышь через весь экран' },
  { kind: 'perch', weight: 3, title: 'Мышь перелетает, в темноте горят глаза' },
  { kind: 'swarm', weight: 2, title: 'Стая мышей' },
  { kind: 'eyes', weight: 3, title: 'Глаза в темноте' },
  { kind: 'goblin', weight: 2, title: 'Гоблин с факелом' },
  { kind: 'troll', weight: 2, title: 'Тролль с дубиной' },
  { kind: 'rats', weight: 2, title: 'Крысы' },
  { kind: 'spider', weight: 2, title: 'Паук на нити' },
  { kind: 'banshee', weight: 1, title: 'Банши бросается в лицо' },
  { kind: 'apparition', weight: 2, title: 'Хозяин пещеры в темноте' },
  // Архивариус Формуляр (Скрипторий Графа) вписывает в Реестр каждого ученика — его перо пишет и здесь
  { kind: 'quill', weight: 2, title: 'Перо Формуляра пишет кровью' },
];

/** Пауза перед самой первой неожиданностью и между следующими, в миллисекундах */
export const SCARE_DELAY = {
  first: [12000, 25000],
  next: [30000, 75000],
};

const between = (random, min, max) => min + random() * (max - min);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const px = (value) => `${Math.round(value)}px`;
const ms = (value) => `${Math.round(value)}ms`;
const deg = (value) => `${Math.round(value * 10) / 10}deg`;

/** Через сколько миллисекунд показать следующую неожиданность */
export function nextDelay(random, first = false) {
  const [min, max] = first ? SCARE_DELAY.first : SCARE_DELAY.next;
  return Math.round(between(random, min, max));
}

/** Выбирает следующую неожиданность: с учётом весов и не ту же, что была только что */
export function pickScare(random, previous = null) {
  const pool = SCARE_KINDS.filter((item) => item.kind !== previous);
  const total = pool.reduce((sum, item) => sum + item.weight, 0);
  let roll = random() * total;
  for (const item of pool) {
    roll -= item.weight;
    if (roll < 0) return item.kind;
  }
  return pool[pool.length - 1].kind;
}

/**
 * Полёт мыши через экран: откуда, куда и как её болтает по дороге.
 * Мышь не летит по прямой: её бросает то вверх, то вниз (s1…s4) — так летают настоящие.
 */
function flight(random, { width, height, size, duration, ltr, delay = 0, y0, spread = 0.22 }) {
  const startY = y0 ?? between(random, 0.1, 0.55) * height;
  const endY = clamp(startY + between(random, -spread, spread) * height, 0.05 * height, 0.72 * height);
  const swing = between(random, 0.07, 0.15) * Math.min(height, 760);
  const sign = random() < 0.5 ? 1 : -1;
  return {
    '--x0': px(ltr ? -size - 30 : width + 30),
    '--x1': px(ltr ? width + 30 : -size - 30),
    '--y0': px(startY),
    '--y1': px(endY),
    '--s1': px(sign * swing),
    '--s2': px(-sign * swing * between(random, 0.4, 1)),
    '--s3': px(sign * swing * between(random, 0.5, 1.1)),
    '--s4': px(-sign * swing * between(random, 0.3, 0.8)),
    '--tilt': deg((ltr ? 1 : -1) * between(random, 6, 12)),
    '--dur': ms(duration),
    '--delay': ms(delay),
  };
}

/** Бегун вдоль нижнего края: откуда и куда бежит */
function run(random, { width, bodyWidth, duration, ltr, delay = 0 }) {
  return {
    '--x0': px(ltr ? -bodyWidth - 20 : width + 20),
    '--x1': px(ltr ? width + 20 : -bodyWidth - 20),
    '--dur': ms(duration),
    '--delay': ms(delay),
  };
}

/**
 * Готовит одну неожиданность: размеры, траектории (CSS-переменные) и длительность.
 * @param {string} kind — вид из SCARE_KINDS
 * @param {() => number} random — источник случайных чисел 0..1
 * @param {{ width: number, height: number, caveId?: string|null, guardianIds?: string[] }} view —
 *   размеры экрана; caveId — пещера, в которой сейчас игрок; guardianIds — все хозяева пещер
 * @returns {object} описание для components/Scares; duration — сколько миллисекунд она длится
 */
export function buildScare(kind, random, view) {
  const { width, height, caveId = null, guardianIds = [] } = view;
  const phone = width < 700;
  const ltr = random() < 0.5;

  switch (kind) {
    case 'bat': {
      const size = phone ? between(random, 96, 124) : between(random, 130, 180);
      // «не быстро, но как летает мышь»: на широком экране путь длиннее — и времени больше
      const duration = clamp(3000 + width * 1.5, 3600, 5600) + between(random, -300, 400);
      return { kind, duration, bats: [{ key: 0, size: Math.round(size), style: flight(random, { width, height, size, duration, ltr }) }] };
    }

    case 'swarm': {
      const count = phone ? 7 : 10;
      const base = clamp(1700 + width * 0.9, 2100, 3200);
      const y0 = between(random, 0.3, 0.6) * height;
      const bats = Array.from({ length: count }, (_, key) => {
        const size = between(random, 22, phone ? 40 : 50);
        const delay = between(random, 0, 800);
        const duration = base + between(random, -250, 350);
        return {
          key,
          size: Math.round(size),
          style: flight(random, { width, height, size, duration, ltr, delay, y0: y0 + between(random, -110, 110), spread: 0.3 }),
          end: delay + duration,
        };
      });
      return { kind, duration: Math.max(...bats.map((bat) => bat.end)), bats };
    }

    case 'perch': {
      // Мышь прилетает, садится — тело тает в темноте, горят одни глаза, — перелетает
      // на другое место, глаза горят уже там, и улетает.
      const size = Math.round(phone ? between(random, 84, 100) : between(random, 110, 140));
      const spot = (from, to, top, bottom) => ({
        x: clamp(between(random, from, to) * width, 8, width - size - 8),
        y: between(random, top, bottom) * height,
      });
      const a = ltr ? spot(0.04, 0.22, 0.12, 0.3) : spot(0.68, 0.9, 0.12, 0.3);
      const b = ltr ? spot(0.58, 0.86, 0.44, 0.7) : spot(0.04, 0.3, 0.44, 0.7);
      const exitLeft = random() < 0.5;
      return {
        kind,
        duration: 9500,
        size,
        style: {
          '--sx': px(ltr ? -size - 30 : width + 30),
          '--sy': px(between(random, 0.2, 0.5) * height),
          '--ax': px(a.x),
          '--ay': px(a.y),
          '--bx': px(b.x),
          '--by': px(b.y),
          '--ex': px(exitLeft ? -size - 30 : width + 30),
          '--ey': px(between(random, -0.1, 0.25) * height),
          '--dur': '9500ms',
        },
      };
    }

    case 'eyes': {
      const count = phone ? 4 : 6;
      const pairs = Array.from({ length: count }, (_, key) => {
        // На широком экране глаза держатся тёмных краёв, на телефоне — где угодно
        const x = phone ? between(random, 4, 82) : random() < 0.5 ? between(random, 2, 20) : between(random, 76, 93);
        const delay = between(random, 0, 1700);
        return {
          key,
          style: {
            '--x': `${Math.round(x * 10) / 10}%`,
            '--y': `${Math.round(between(random, 12, 82) * 10) / 10}%`,
            '--w': px(between(random, 9, phone ? 14 : 17)),
            '--tilt': deg(between(random, -9, 9)),
            '--delay': ms(delay),
            '--dur': ms(between(random, 3300, 4200)),
          },
        };
      });
      return { kind, duration: 6000, pairs };
    }

    case 'goblin': {
      const size = phone ? 100 : 136; // высота рисунка
      const duration = clamp(1900 + width * 1.1, 2300, 3600);
      return { kind, duration, size, flip: !ltr, style: run(random, { width, bodyWidth: (size * 120) / 110, duration, ltr }) };
    }

    case 'troll': {
      const size = phone ? 136 : 196;
      const duration = clamp(3800 + width * 2, 4800, 7200);
      return { kind, duration, size, flip: !ltr, style: run(random, { width, bodyWidth: (size * 180) / 160, duration, ltr }) };
    }

    case 'rats': {
      const count = 3 + Math.floor(random() * 3);
      const base = clamp(1100 + width * 0.7, 1400, 2400);
      let delay = 0;
      const rats = Array.from({ length: count }, (_, key) => {
        const size = Math.round(between(random, phone ? 46 : 54, phone ? 60 : 74)); // длина крысы
        const duration = base + between(random, -150, 250);
        const rat = { key, size, style: run(random, { width, bodyWidth: size, duration, ltr, delay }), end: delay + duration };
        delay += between(random, 150, 340);
        return rat;
      });
      return { kind, duration: Math.max(...rats.map((rat) => rat.end)), flip: !ltr, rats };
    }

    case 'quill': {
      // Костяное перо Формуляра летит через экран, выводя за собой кровавую строку-волну.
      // Строка — путь в системе координат шириной с экран: перо и чернила идут вместе, за одно время.
      const size = phone ? 92 : 128;
      const duration = clamp(2600 + width * 1.3, 3400, 5600);
      const amp = phone ? 8 : 12;
      const waves = Math.max(3, Math.round(width / 260));
      const step = width / (waves * 2);
      let d = `M0 ${amp}`;
      for (let i = 0; i < waves * 2; i += 1)
        d += ` Q${Math.round(step * (i + 0.5))} ${i % 2 ? amp * 2 : 0} ${Math.round(step * (i + 1))} ${amp}`;
      return {
        kind,
        duration,
        size,
        flip: !ltr,
        ink: { width: Math.round(width), height: amp * 2, d },
        style: {
          '--y': px(clamp(between(random, 0.22, 0.62) * height, 70, height - 120)),
          '--lane': px(width),
          '--size': px(size),
          '--amp': px(amp),
          '--dur': `${Math.round(duration)}ms`,
          // перо качается вверх-вниз в такт волнам строки: половина волны — один взмах
          '--half': `${Math.round(duration / (waves * 2))}ms`,
        },
      };
    }

    case 'spider': {
      const size = phone ? 66 : 88;
      return {
        kind,
        duration: 6400,
        size,
        style: {
          '--x': px(clamp(between(random, 0.1, 0.9) * width - size / 2, 6, width - size - 6)),
          '--depth': px(between(random, 0.2, 0.42) * height),
          '--dur': '6400ms',
        },
      };
    }

    case 'banshee': {
      const size = Math.round(Math.min(width * 0.86, phone ? 300 : 400));
      return {
        kind,
        duration: 2900,
        size,
        guardianId: 'callbacks', // банши Отголоска — хозяйка Пещеры эха
        style: {
          '--x': px(between(random, 0.34, 0.66) * width),
          '--y': px(between(random, 0.32, 0.5) * height),
          '--dx': px((ltr ? -1 : 1) * width * 0.5),
          '--size': px(size),
          '--dur': '2900ms',
        },
      };
    }

    case 'apparition': {
      // В пещере из темноты смотрит её хозяин, на остальных страницах — случайный
      const guardianId = guardianIds.includes(caveId) ? caveId : guardianIds[Math.floor(random() * guardianIds.length)];
      const size = phone ? 230 : 330;
      return {
        kind,
        duration: 4200,
        size,
        guardianId,
        style: {
          // лицо наполовину выглядывает из-за края экрана
          '--x': px(ltr ? size * 0.2 : width - size * 0.2),
          '--y': px(between(random, 0.32, 0.72) * height),
          '--size': px(size),
          '--dur': '4200ms',
        },
      };
    }

    default:
      return null;
  }
}
