// Ранги ученика Графа. Видимый рост мотивирует продолжать.

export const RANKS = [
  { min: 0, title: 'Летучка-новичок', icon: '🦇' },
  { min: 150, title: 'Ученик склепа', icon: '🕯️' },
  { min: 400, title: 'Подмастерье пропсов', icon: '📦' },
  { min: 750, title: 'Хранитель потока', icon: '🌊' },
  { min: 1150, title: 'Магистр компонентов', icon: '🔮' },
  { min: 1600, title: 'Граф Пропсов', icon: '👑' },
];

/** Текущий ранг, следующий ранг и прогресс до него (0..1) */
export function rankFor(xp) {
  let index = 0;
  RANKS.forEach((rank, i) => {
    if (xp >= rank.min) index = i;
  });
  const current = RANKS[index];
  const next = RANKS[index + 1] ?? null;
  const progress = next ? (xp - current.min) / (next.min - current.min) : 1;
  return { current, next, progress, index };
}
