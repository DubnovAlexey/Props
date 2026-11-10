// Свой хук: умеет ли браузер установить игру как приложение (PWA).
// Chrome, Edge и Android присылают событие beforeinstallprompt — сохраняем его
// и показываем свою кнопку. В Safari на iPhone события нет: там ставят
// вручную через «Поделиться → На экран Домой» (инструкция на странице установки).
import { useEffect, useState } from 'react';

export function useInstallPrompt() {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => window.matchMedia?.('(display-mode: standalone)').matches ?? false);

  useEffect(() => {
    const onPrompt = (event) => {
      event.preventDefault(); // не показывать стандартную плашку — у нас своя кнопка
      setPrompt(event);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function install() {
    if (!prompt) return false;
    prompt.prompt();
    const choice = await prompt.userChoice;
    setPrompt(null);
    return choice.outcome === 'accepted';
  }

  return { canInstall: Boolean(prompt), installed, install };
}

/**
 * Свой хук: сохранена ли игра на устройстве для работы без интернета.
 * navigator.serviceWorker.ready — Promise, который выполнится, когда сервис-воркер
 * установился и включился (а он включается только после того, как сохранил все файлы).
 * В режиме разработки воркера нет — Promise не выполнится, и ответ останется «нет».
 */
export function useOfflineReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;
    let alive = true; // компонент ещё на экране? (чтобы не менять состояние после ухода со страницы)
    navigator.serviceWorker.ready.then(() => alive && setReady(true)).catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return ready;
}
