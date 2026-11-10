// Обёртка над localStorage: браузер хранит прогресс между визитами.
// В приватном режиме или во встроенных окнах хранилище может быть
// недоступно — тогда тихо работаем без сохранения.

const KEY = 'props-castle/progress/v1';

export function loadJSON(key = KEY) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveJSON(value, key = KEY) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
