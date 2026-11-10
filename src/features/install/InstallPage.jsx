// Как забрать игру с собой: установить на телефон или компьютер (значок на экране,
// работа без интернета) или скачать одним файлом.
// Инструкции для разных устройств — это данные (массив DEVICES), а страница их рисует.
// Раздел для устройства, с которого открыта игра, показываем первым.
import { useEffect } from 'react';
import { useInstallPrompt, useOfflineReady } from '../../hooks/useInstallPrompt.js';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { PHRASES } from '../../mascot/phrases.js';
import Bat from '../../mascot/Bat.jsx';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';

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
// Адрес файла — константой: он появляется рядом с игрой только после сборки (npm run build)
const DOWNLOAD_URL = './Props.html';

/** С какого устройства открыта игра: 'ios', 'android' или 'desktop' */
function detectDevice() {
  const agent = navigator.userAgent;
  // iPad с iPadOS представляется компьютером Mac — отличаем по сенсорному экрану
  if (/iPhone|iPad|iPod/.test(agent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(agent)) return 'android';
  return 'desktop';
}

// Шаги написаны для человека, который никогда ничего не устанавливал из браузера:
// что нажать, как это выглядит и что появится на экране.
const DEVICES = [
  {
    id: 'ios',
    title: '📱 iPhone и iPad',
    steps: [
      'Открой игру в браузере Safari (синий значок с компасом).',
      'Нажми кнопку «Поделиться» — квадрат со стрелкой вверх, обычно внизу экрана.',
      'Прокрути список и выбери «На экран „Домой“».',
      'Нажми «Добавить» справа вверху.',
      'На экране телефона появится значок Props. Открой игру с него один раз при включённом интернете и подожди полминуты — игра сохранится в телефон.',
    ],
    note: 'На iPhone это важно сделать: если не заходить на сайт неделю, Safari может стереть прогресс. У игры на экране «Домой» прогресс хранится надёжно. Он свой, отдельный от вкладки Safari.',
  },
  {
    id: 'android',
    title: '🤖 Android',
    steps: [
      'Открой игру в браузере Chrome.',
      'Нажми кнопку «Установить игру» выше. Если её нет — нажми три точки ⋮ справа вверху и выбери «Добавить на гл. экран» или «Установить приложение».',
      'Подтверди — «Установить».',
      'Значок Props появится на главном экране. Открой игру с него один раз при включённом интернете.',
    ],
  },
  {
    id: 'desktop',
    title: '💻 Компьютер: Windows или Mac',
    steps: [
      'Проще всего — скачать игру одним файлом (кнопка «Скачать Props.html» ниже) и дважды щёлкнуть по нему: игра откроется в браузере без интернета.',
      'Другой способ — установить как приложение: в Chrome или Edge нажми значок установки в правой части адресной строки (монитор со стрелкой) или кнопку «Установить игру» выше.',
    ],
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
          <BloodTitle>📦 Вся игра — в одном файле</BloodTitle>
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
        <BloodTitle>📲 Пещеры — в кармане</BloodTitle>
        <p className="muted">
          По ссылке игра работает в любом браузере — ставить ничего не обязательно. Но если её установить, появится значок на экране, как у
          обычного приложения, и игра будет работать без интернета. Ниже — три способа, по шагам.
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
            <a className="btn" href={DOWNLOAD_URL} download="Props.html">
              ⬇️ Скачать Props.html
            </a>
          </div>
          <p className="muted small">
            На телефоне надёжнее установить игру как приложение (см. выше): в файле, открытом с телефона, прогресс может не сохраняться. У
            скачанной копии прогресс свой — с сайтом он не связан.
          </p>
        </section>
      )}

      <section className="card stack">
        <h2>Как проверить, что получилось</h2>
        <p>Включи авиарежим (или отключи Wi‑Fi) и открой игру — она должна работать.</p>
        <p className="muted small">Прогресс хранится на том устройстве, где ты играешь: на телефоне — свой, на компьютере — свой.</p>
      </section>
    </div>
  );
}
