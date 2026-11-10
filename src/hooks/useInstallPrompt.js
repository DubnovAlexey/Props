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
