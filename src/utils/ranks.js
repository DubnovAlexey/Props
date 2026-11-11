// Ранги ученика Графа. Видимый рост мотивирует продолжать.

// Названия рангов — в словарях интерфейса: t('ranks')[id]
export const RANKS = [
  { min: 0, id: 0, icon: '🦇' },
  { min: 150, id: 1, icon: '🕯️' },
  { min: 400, id: 2, icon: '📦' },
  { min: 750, id: 3, icon: '🌊' },
  { min: 1150, id: 4, icon: '🔮' },
  { min: 1600, id: 5, icon: '👑' },
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
