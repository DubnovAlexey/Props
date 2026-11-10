// «Живой» значок вкладки.
// Сам значок — картинка из коллекции владельца проекта («самый злобный вампир»):
// public/favicon.png (64 px) и public/favicon.webp (192 px). Картинку мы не перерисовываем,
// а только оживляем: кровавая рамка разгорается и гаснет, вампир изредка дёргается
// «в лицо», сверху вниз скатывается капля крови.
//
// Браузер не умеет сам оживлять значок, поэтому мы готовим несколько кадров на холсте
// (canvas) и раз в доли секунды подменяем адрес значка на следующий кадр.
// Эффекты не привязаны к содержимому картинки (где глаза, где рот) — если владелец
// поменяет картинку, оживление продолжит работать.

/** Размер кадра в пикселях: вкладке хватает и на экране с высокой плотностью */
export const FAVICON_SIZE = 64;

/**
 * Раскадровка. Большую часть времени значок почти неподвижен — рамка лишь тлеет.
 *   rim   — яркость кровавой рамки, 0…1;
 *   zoom  — увеличение картинки от центра (1 — обычный размер): рывок «в лицо»;
 *   flash — красная вспышка поверх картинки, 0…1;
 *   drop  — где капля крови, доля высоты значка (нет поля — капли нет);
 *   ms    — сколько миллисекунд держится кадр.
 */
export const FAVICON_FRAMES = [
  { rim: 0.3, ms: 2600 },
  { rim: 0.6, ms: 220 }, // рамка разгорается…
  { rim: 0.95, ms: 280 },
  { rim: 0.6, ms: 220 }, // …и гаснет
  { rim: 0.3, ms: 1500 },
  { rim: 0.8, zoom: 1.1, ms: 110 }, // рывок «в лицо»
  { rim: 1, zoom: 1.24, flash: 0.5, ms: 160 },
  { rim: 0.8, zoom: 1.1, ms: 110 },
  { rim: 0.3, ms: 1200 },
  { rim: 0.45, drop: 0.14, ms: 170 }, // капля крови скатывается сверху вниз
  { rim: 0.45, drop: 0.38, ms: 150 },
  { rim: 0.45, drop: 0.64, ms: 150 },
  { rim: 0.45, drop: 0.9, ms: 150 },
];

/**
 * Рисует один кадр.
 * @param {CanvasRenderingContext2D} context — «кисть» холста
 * @param {CanvasImageSource} image — картинка значка
 * @param {{ rim?: number, zoom?: number, flash?: number, drop?: number }} frame — кадр из FAVICON_FRAMES
 * @param {number} [size] — сторона холста в пикселях
 */
export function drawFaviconFrame(context, image, frame, size = FAVICON_SIZE) {
  const { rim = 0.3, zoom = 1, flash = 0, drop } = frame;
  context.clearRect(0, 0, size, size);

  // Картинка. При zoom > 1 она больше холста и выходит за края — получается «наезд»
  const side = size * zoom;
  context.drawImage(image, (size - side) / 2, (size - side) / 2, side, side);

  // Красная вспышка
  if (flash > 0) {
    context.fillStyle = `rgba(190, 10, 30, ${0.4 * flash})`;
    context.fillRect(0, 0, size, size);
  }

  // Кровавое зарево по краям: середина чистая, к краям густеет
  const glow = context.createRadialGradient(size / 2, size / 2, size * 0.3, size / 2, size / 2, size * 0.74);
  glow.addColorStop(0, 'rgba(214, 22, 50, 0)');
  glow.addColorStop(1, `rgba(214, 22, 50, ${0.85 * rim})`);
  context.fillStyle = glow;
  context.fillRect(0, 0, size, size);

  // Рамка
  const line = size * 0.07;
  context.lineWidth = line;
  context.strokeStyle = `rgba(179, 18, 43, ${0.45 + 0.55 * rim})`;
  context.strokeRect(line / 2, line / 2, size - line, size - line);

  // Капля крови: острый верх, круглый низ, влажный блик
  if (typeof drop === 'number') {
    const x = size / 2;
    const y = size * drop;
    const r = size * 0.1;
    context.beginPath();
    context.moveTo(x, y - r * 2.4);
    context.bezierCurveTo(x + r * 1.3, y - r * 0.4, x + r, y + r, x, y + r);
    context.bezierCurveTo(x - r, y + r, x - r * 1.3, y - r * 0.4, x, y - r * 2.4);
    context.closePath();
    context.fillStyle = '#d02f45';
    context.fill();
    context.lineWidth = size * 0.02;
    context.strokeStyle = '#4a0410';
    context.stroke();
    context.beginPath();
    context.arc(x - r * 0.32, y + r * 0.05, r * 0.26, 0, Math.PI * 2);
    context.fillStyle = 'rgba(255, 205, 210, 0.85)';
    context.fill();
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
