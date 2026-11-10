// Как забрать игру с собой: установить на телефон или компьютер (значок на экране,
// работа без интернета) или скачать одним файлом.
// Инструкции для разных устройств — это данные (массив DEVICES), а страница их рисует.
// Раздел для устройства, с которого открыта игра, показываем первым.
import { useEffect } from 'react';
import { useInstallPrompt, useOfflineReady } from '../../hooks/useInstallPrompt.js';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { PHRASES } from '../../mascot/phrases.js';
import Bat from '../../mascot/Bat.jsx';

const insideFrame = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

// Сборка «всё в одном файле» (npm run build:single) — игра открыта прямо с диска
const IS_SINGLE_FILE = Boolean(import.meta.env.VITE_SINGLE);
// Файл для скачивания лежит рядом с игрой только в собранной версии сайта
const CAN_DOWNLOAD = import.meta.env.PROD && !import.meta.env.VITE_ARTIFACT && !IS_SINGLE_FILE;

/** С какого устройства открыта игра: 'ios', 'android' или 'desktop' */
function detectDevice() {
  const agent = navigator.userAgent;
  // iPad с iPadOS представляется компьютером Mac — отличаем по сенсорному экрану
  if (/iPhone|iPad|iPod/.test(agent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(agent)) return 'android';
  return 'desktop';
}

const DEVICES = [
  {
    id: 'ios',
    title: 'iPhone и iPad',
    steps: [
      'Открой игру в Safari по её адресу.',
      'Нажми «Поделиться» — квадрат со стрелкой вверх.',
      'Выбери «На экран „Домой“» и подтверди.',
    ],
    note: 'На iPhone это важно сделать: если не заходить на сайт неделю, Safari может стереть прогресс. У игры на экране «Домой» прогресс хранится надёжно. Он свой, отдельный от вкладки Safari.',
  },
  {
    id: 'android',
    title: 'Android: Chrome, Edge, Samsung Internet',
    steps: [
      'Открой игру по её адресу.',
      'Нажми кнопку «Установить игру» выше или меню ⋮ → «Установить приложение» («Добавить на главный экран»).',
      'Значок появится на главном экране.',
    ],
  },
  {
    id: 'desktop',
    title: 'Компьютер: Chrome или Edge',
    steps: ['Открой игру по её адресу.', 'Нажми значок установки справа в адресной строке или кнопку «Установить игру» выше.'],
  },
];

export default function InstallPage() {
  const { canInstall, installed, install } = useInstallPrompt();
  const offlineReady = useOfflineReady();
  const { say } = useMascot();
  const device = detectDevice();
  // Раздел своего устройства — первым; порядок остальных не меняем
  const devices = [...DEVICES].sort((a, b) => Number(b.id === device) - Number(a.id === device));

  useEffect(() => {
    say(PHRASES.route.install, 'talk');
  }, [say]);

  if (IS_SINGLE_FILE) {
    return (
      <div className="stack">
        <header>
          <span className="eyebrow">Автономная копия</span>
          <h1>📦 Вся игра — в одном файле</h1>
          <p className="muted">
            Ты играешь в копии, которая целиком лежит на этом устройстве: интернет ей не нужен. Файл можно переслать другу или положить на
            флешку — он откроется в любом современном браузере.
          </p>
        </header>
        <p className="card small">
          Прогресс этой копии хранится в браузере, которым открыт файл. Перенесёшь файл на другое устройство — там игра начнётся с начала.
        </p>
      </div>
    );
  }

  return (
    <div className="stack">
      <header>
        <span className="eyebrow">Офлайн-режим</span>
        <h1>📲 Пещеры — в кармане</h1>
        <p className="muted">
          Игру можно установить как приложение: значок на экране, полный экран и работа без интернета. Всё, что нужно, сохраняется на
          устройстве после первого открытия.
        </p>
      </header>

      {offlineReady && (
        <p className="card" role="status">
          ✓ Игра сохранена на этом устройстве: она откроется и без интернета.
        </p>
      )}

      {installed && <p className="card">✓ Игра уже установлена — открывай её значком на экране.</p>}

      {insideFrame && (
        <p className="card small">
          <Bat size={30} /> Сейчас игра открыта внутри другой страницы (например, в предпросмотре claude.ai). Оттуда установка невозможна:
          открой игру по её собственному адресу — например, на GitHub Pages — и вернись сюда.
        </p>
      )}

      {canInstall && (
        <button type="button" className="btn btn-primary" onClick={install}>
          📲 Установить игру
        </button>
      )}

      {devices.map((item) => (
        <section key={item.id} className="card stack">
          {item.id === device && <span className="eyebrow">Твоё устройство</span>}
          <h2>{item.title}</h2>
          <ol>
            {item.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {item.note && <p className="muted small">{item.note}</p>}
        </section>
      ))}

      {CAN_DOWNLOAD && (
        <section className="card stack">
          <h2>Скачать одним файлом</h2>
          <p>
            Вся игра — один файл <b>Props.html</b> (около 2 МБ). На компьютере он открывается двойным щелчком и работает без интернета. Его
            удобно переслать одногруппникам или положить на флешку.
          </p>
          <div className="row">
            <a className="btn" href="./Props.html" download="Props.html">
              ⬇️ Скачать Props.html
            </a>
          </div>
          <p className="muted small">
            На телефоне надёжнее установить игру как приложение (см. выше): в файле, открытом с телефона, прогресс может не сохраняться. У
            скачанной копии прогресс свой — с сайтом он не связан.
          </p>
        </section>
      )}

      <p className="muted small">Прогресс хранится на устройстве, в браузере. На другом устройстве начнётся свой прогресс.</p>
    </div>
  );
}
