// Подписка на медиа-запрос CSS из JavaScript.
// useSyncExternalStore — официальный способ React читать внешние
// источники данных (здесь — window.matchMedia) без рассинхрона.
import { useCallback, useSyncExternalStore } from 'react';

export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Пользователь попросил систему уменьшить анимацию */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** Устройство с мышью: подсказки по наведению. На телефоне — по нажатию */
export function useHoverCapable() {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}
