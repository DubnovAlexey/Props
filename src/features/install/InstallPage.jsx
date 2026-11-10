// Как установить игру на телефон или компьютер и играть без интернета.
import { useEffect } from 'react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt.js';
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

export default function InstallPage() {
  const { canInstall, installed, install } = useInstallPrompt();
  const { say } = useMascot();

  useEffect(() => {
    say(PHRASES.route.install, 'talk');
  }, [say]);

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

      <section className="card stack">
        <h2>Android: Chrome, Edge, Samsung Internet</h2>
        <ol>
          <li>Открой игру по её адресу.</li>
          <li>Нажми кнопку «Установить игру» выше или меню ⋮ → «Установить приложение» («Добавить на главный экран»).</li>
          <li>Значок появится на главном экране.</li>
        </ol>
      </section>

      <section className="card stack">
        <h2>iPhone и iPad: Safari</h2>
        <ol>
          <li>Открой игру в Safari.</li>
          <li>Нажми «Поделиться» (квадрат со стрелкой вверх).</li>
          <li>Выбери «На экран Домой» и подтверди.</li>
        </ol>
      </section>

      <section className="card stack">
        <h2>Компьютер: Chrome или Edge</h2>
        <ol>
          <li>Открой игру по её адресу.</li>
          <li>Нажми значок установки справа в адресной строке или кнопку выше.</li>
        </ol>
        <p className="muted small">Прогресс хранится в этом браузере. На другом устройстве начнётся свой прогресс.</p>
      </section>
    </div>
  );
}
