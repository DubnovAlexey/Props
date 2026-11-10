// «Живой» значок вкладки.
// Сам значок — картинка из коллекции владельца проекта: вампир Бальтазар
// (public/favicon.png, 64 px, и public/favicon.webp, 192 px). Картинку мы не перерисовываем,
// а только слегка оживляем:
//   • время от времени у вампира загораются красным глаза;
//   • изредка на заднем плане, у него за спиной, пролетает летучая мышь;
//   • иногда вздрагивает пламя свечи слева.
// Большую часть времени значок неподвижен и выглядит как сама картинка.
//
// Браузер не умеет сам оживлять значок, поэтому мы готовим кадры на холсте (canvas)
// и в нужные моменты подменяем адрес значка на следующий кадр.

/** Размер кадра в пикселях: вкладке хватает и на экране с высокой плотностью */
export const FAVICON_SIZE = 64;

// Что где находится на картинке — в долях стороны значка (0 — левый или верхний край, 1 — правый
// или нижний). Эти числа сняты с картинки Бальтазара: поменяешь картинку — сними их заново.
export const FAVICON_MAP = {
  eyes: [
    [0.45, 0.414],
    [0.595, 0.41],
  ], // зрачки
  candle: [0.046, 0.46], // пламя свечи
  head: { x: 0.51, y: 0.375, rx: 0.215, ry: 0.28 }, // голова с волосами — овал
  // плечи и плащ — многоугольник: мышь пролетает ЗА ними
  body: [
    [0.33, 0.47],
    [0.125, 0.645],
    [0, 0.79],
    [0, 1],
    [1, 1],
    [1, 0.77],
    [0.66, 0.525],
  ],
};

const rest = (ms) => ({ ms });
const glow = (eyes, ms) => ({ eyes, ms });
const flicker = (candle, ms) => ({ candle, ms });
/** Пролёт мыши слева направо за steps кадров; крылья через кадр то вверху, то внизу */
const fly = (steps, ms) => Array.from({ length: steps }, (_, i) => ({ bat: (i + 0.5) / steps, wingsUp: i % 2 === 0, ms }));

/**
 * Раскадровка, круг — около двадцати секунд.
 *   eyes    — насколько горят глаза, 0…1;
 *   candle  — насколько ярче обычного пламя свечи, 0…1;
 *   bat     — где летучая мышь на пути слева направо, 0…1 (нет поля — мыши нет);
 *   wingsUp — крылья мыши подняты или опущены;
 *   ms      — сколько миллисекунд держится кадр.
 */
export const FAVICON_FRAMES = [
  rest(3200),
  glow(0.35, 120), // глаза загораются…
  glow(0.7, 120),
  glow(1, 1100),
  glow(0.6, 150), // …и гаснут
  glow(0.25, 150),
  rest(2600),
  flicker(1, 110), // вздрогнула свеча
  flicker(0.4, 110),
  flicker(0.9, 110),
  rest(2200),
  glow(0.4, 120), // глаза вспыхнули, дрогнули и погасли
  glow(1, 500),
  glow(0.45, 110),
  glow(1, 800),
  glow(0.5, 150),
  glow(0.2, 150),
  rest(3000),
  ...fly(10, 120), // за спиной пролетает летучая мышь
  rest(2400),
];

/** Мягкое светящееся пятно: в середине яркое, к краю сходит на нет */
function spot(context, x, y, radius, inner, outer) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(1, outer);
  context.fillStyle = gradient;
  context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

/** Силуэт летучей мыши шириной width с центром в (x, y) */
function drawBat(context, x, y, width, wingsUp) {
  const u = width / 20; // рисунок задуман на сетке 20 × 10 клеток
  const tip = wingsUp ? -4 : 3; // куда смотрят кончики крыльев: вверх или вниз
  context.beginPath();
  context.ellipse(x, y, 1.7 * u, 2.7 * u, 0, 0, Math.PI * 2); // тело
  for (const side of [-1, 1]) {
    // ухо
    context.moveTo(x + side * 1.5 * u, y - 1.8 * u);
    context.lineTo(x + side * 1.1 * u, y - 4.6 * u);
    context.lineTo(x + side * 0.2 * u, y - 2.4 * u);
    context.closePath();
    // крыло: верхняя кромка дугой до кончика, нижняя — зубцами обратно к телу
    context.moveTo(x + side * 1.2 * u, y - 1.2 * u);
    context.quadraticCurveTo(x + side * 5 * u, y + (tip - 3) * u, x + side * 10 * u, y + tip * u);
    context.lineTo(x + side * 7.6 * u, y + (tip * 0.4 + 1.4) * u);
    context.lineTo(x + side * 6.2 * u, y + (tip * 0.3 + 3.2) * u);
    context.lineTo(x + side * 4.2 * u, y + 1.7 * u);
    context.lineTo(x + side * 2.8 * u, y + 3.2 * u);
    context.lineTo(x + side * 1.2 * u, y + 1.5 * u);
    context.closePath();
  }
  context.fillStyle = 'rgba(8, 5, 12, 0.95)';
  context.fill();
  // светлая кромка: без неё чёрный силуэт терялся бы на тёмной стене
  context.lineWidth = Math.max(0.7, width * 0.03);
  context.strokeStyle = 'rgba(200, 170, 215, 0.5)';
  context.stroke();
}

/**
 * Рисует один кадр.
 * @param {CanvasRenderingContext2D} context — «кисть» холста
 * @param {CanvasImageSource} image — картинка значка
 * @param {{ eyes?: number, candle?: number, bat?: number, wingsUp?: boolean }} frame — кадр из FAVICON_FRAMES
 * @param {number} [size] — сторона холста в пикселях
 */
export function drawFaviconFrame(context, image, frame, size = FAVICON_SIZE) {
  const { eyes = 0, candle = 0, bat, wingsUp = true } = frame;
  const { head, body } = FAVICON_MAP;
  context.clearRect(0, 0, size, size);
  context.drawImage(image, 0, 0, size, size);

  // Летучая мышь — на заднем плане. Чтобы она пролетала ЗА вампиром, запрещаем рисовать
  // там, где его голова и плечи: два «трафарета» (clip) оставляют только фон.
  if (typeof bat === 'number') {
    context.save();
    context.beginPath();
    context.rect(0, 0, size, size);
    context.ellipse(head.x * size, head.y * size, head.rx * size, head.ry * size, 0, 0, Math.PI * 2);
    context.clip('evenodd'); // всё, кроме головы
    context.beginPath();
    context.rect(0, 0, size, size);
    body.forEach(([x, y], index) => (index ? context.lineTo(x * size, y * size) : context.moveTo(x * size, y * size)));
    context.closePath();
    context.clip('evenodd'); // …и кроме плеч
    // путь: слева направо, дугой вверх — как раз над головой, за которой мышь на миг скрывается
    const x = (-0.2 + 1.4 * bat) * size;
    const y = (0.27 - 0.16 * Math.sin(Math.PI * bat)) * size;
    drawBat(context, x, y, size * 0.4, wingsUp);
    context.restore();
  }

  // Свет складывается с картинкой («lighter»): тёмное остаётся тёмным, светлое разгорается
  if (eyes > 0 || candle > 0) {
    context.save();
    context.globalCompositeOperation = 'lighter';
    if (candle > 0) {
      const [x, y] = FAVICON_MAP.candle;
      spot(context, x * size, y * size, size * 0.2, `rgba(255, 170, 70, ${0.5 * candle})`, 'rgba(255, 120, 30, 0)');
    }
    for (const [x, y] of eyes > 0 ? FAVICON_MAP.eyes : []) {
      // широкое красное зарево и маленькое раскалённое ядро
      spot(context, x * size, y * size, size * 0.13, `rgba(255, 30, 40, ${0.55 * eyes})`, 'rgba(255, 30, 40, 0)');
      spot(context, x * size, y * size, size * 0.05, `rgba(255, 190, 150, ${0.95 * eyes})`, 'rgba(255, 60, 40, 0)');
    }
    context.restore();
  }
}

/**
 * Запускает оживление значка. Возвращает функцию, которая его останавливает.
 * Тем, кто попросил систему уменьшить движение, значок оставляем неподвижным.
 * Если картинка не загрузилась или холст недоступен — тоже: значок просто остаётся как был.
 */
export function startLiveFavicon() {
  if (typeof document === 'undefined') return () => {};
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return () => {};

  const source = document.querySelector('link[rel="icon"][type="image/png"]') ?? document.querySelector('link[rel="icon"]');
  if (!source) return () => {};

  let timer = 0;
  let stopped = false;
  const image = new Image();

  image.onload = () => {
    if (stopped) return;
    let urls;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = FAVICON_SIZE;
      canvas.height = FAVICON_SIZE;
      const context = canvas.getContext('2d');
      // Кадры готовим один раз: дальше только переключаем готовые адреса
      urls = FAVICON_FRAMES.map((frame) => {
        drawFaviconFrame(context, image, frame);
        return canvas.toDataURL('image/png');
      });
    } catch {
      return; // холст недоступен — значок остаётся неподвижным
    }

    // В разметке значок записан в двух размерах, и браузер сам выбирает, какой показать.
    // Чтобы он наверняка показывал оживлённый, оставляем один <link> и меняем адрес у него.
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    document.querySelectorAll('link[rel="icon"]').forEach((old) => old.remove());
    document.head.append(link);

    let index = 0;
    const tick = () => {
      link.href = urls[index];
      timer = setTimeout(tick, FAVICON_FRAMES[index].ms);
      index = (index + 1) % urls.length;
    };
    tick();
  };
  image.src = source.href;

  return () => {
    stopped = true;
    clearTimeout(timer);
  };
}
