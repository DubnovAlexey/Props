// Как забрать игру с собой: установить на телефон или компьютер (значок на экране,
// работа без интернета) или скачать одним файлом.
// Сами инструкции — в словарях интерфейса (раздел install.devices), на каждом языке свои;
// страница только рисует их. Раздел для устройства, с которого открыта игра, показываем первым.
import { useEffect } from 'react';
import { useInstallPrompt, useOfflineReady } from '../../hooks/useInstallPrompt.js';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { RichText } from '../../components/RichText/RichText.jsx';
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

// Порядок разделов инструкции. Шаги написаны для человека, который никогда ничего
// не устанавливал из браузера: что нажать, как это выглядит и что появится на экране.
const DEVICES = ['ios', 'android', 'desktop'];

export default function InstallPage() {
  const { canInstall, installed, install } = useInstallPrompt();
  const offlineReady = useOfflineReady();
  const { say } = useMascot();
  const { t } = useI18n();
  const device = detectDevice();
  // Раздел своего устройства — первым; порядок остальных не меняем
  const devices = [...DEVICES].sort((a, b) => Number(b === device) - Number(a === device));

  useEffect(() => {
    say(t('mascot.route.install'), 'talk');
  }, [say, t]);

  if (IS_SINGLE_FILE) {
    return (
      <div className="stack">
        <header>
          <span className="eyebrow">{t('install.singleEyebrow')}</span>
          <BloodTitle>{t('install.singleTitle')}</BloodTitle>
          <p className="muted">{t('install.singleText')}</p>
        </header>
        <p className="card small">{t('install.singleNote')}</p>
      </div>
    );
  }

  return (
    <div className="stack">
      <header>
        <span className="eyebrow">{t('install.eyebrow')}</span>
        <BloodTitle>{t('install.title')}</BloodTitle>
        <p className="muted">{t('install.intro')}</p>
      </header>

      {offlineReady && (
        <p className="card" role="status">
          {t('install.saved')}
        </p>
      )}

      {installed && <p className="card">{t('install.installed')}</p>}

      {insideFrame && (
        <p className="card small">
          <Bat size={30} /> {t('install.framed')}
        </p>
      )}

      {canInstall && (
        <button type="button" className="btn btn-primary" onClick={install}>
          {t('install.button')}
        </button>
      )}

      {devices.map((id) => {
        // одним запросом берём весь раздел: заголовок, шаги и примечание
        const item = t(`install.devices.${id}`);
        return (
          <section key={id} className="card stack">
            {id === device && <span className="eyebrow">{t('install.yours')}</span>}
            <h2>{item.title}</h2>
            <ol>
              {item.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {item.note && <p className="muted small">{item.note}</p>}
          </section>
        );
      })}

      {CAN_DOWNLOAD && (
        <section className="card stack">
          <h2>{t('install.downloadTitle')}</h2>
          <p>
            <RichText text={t('install.downloadText')} />
          </p>
          <div className="row">
            <a className="btn" href={DOWNLOAD_URL} download="Props.html">
              {t('install.download')}
            </a>
          </div>
          <p className="muted small">{t('install.downloadNote')}</p>
        </section>
      )}

      <section className="card stack">
        <h2>{t('install.checkTitle')}</h2>
        <p>{t('install.checkText')}</p>
        <p className="muted small">{t('install.checkNote')}</p>
      </section>
    </div>
  );
}
