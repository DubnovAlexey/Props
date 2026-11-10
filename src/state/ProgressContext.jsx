// Контекст прогресса: любой компонент может узнать опыт, ранги и
// расписание повторений, не получая всё это через десяток пропсов.
// Это живой пример темы «prop drilling и Context» из пещеры «Тайный ход».
import { createContext, use, useEffect, useMemo, useReducer } from 'react';
import { progressReducer, restore } from './progressReducer.js';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { dayKey } from '../utils/dates.js';
import { setSoundEnabled } from '../audio/sfx.js';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  // Третий аргумент useReducer — «ленивая» инициализация: читаем localStorage один раз
  const [progress, dispatch] = useReducer(progressReducer, null, () => restore(loadJSON()));

  // Сохраняем после каждого изменения
  useEffect(() => {
    saveJSON(progress);
  }, [progress]);

  // Отмечаем визит для серии дней
  useEffect(() => {
    dispatch({ type: 'visit', today: dayKey() });
  }, []);

  // Тема оформления — атрибут на <html>, его читают CSS-переменные
  useEffect(() => {
    document.documentElement.dataset.theme = progress.theme;
  }, [progress.theme]);

  // Звук: модуль sfx живёт вне React, поэтому сообщаем ему настройку
  useEffect(() => {
    setSoundEnabled(progress.sound !== false);
  }, [progress.sound]);

  // useMemo: новый объект value только при изменении прогресса
  const value = useMemo(() => ({ progress, dispatch }), [progress]);

  // React 19: сам контекст служит провайдером — <Ctx value={...}>
  return <ProgressContext value={value}>{children}</ProgressContext>;
}

/** Хук доступа к прогрессу. use() — API React 19 для чтения контекста */
export function useProgress() {
  const context = use(ProgressContext);
  if (!context) throw new Error('useProgress нужно вызывать внутри <ProgressProvider>');
  return context;
}
