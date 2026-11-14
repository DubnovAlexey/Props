// Портрет под мышью растёт по-настоящему (правило владельца, 14.11.2026): портрет и квадрат ≈ 2,5×,
// широкая картинка ≈ 3×, целиком и в пределах окна. Проверяем расчёт места — src/utils/peekBox.js.
import { describe, expect, it } from 'vitest';
import { peekBox, ZOOM_MARGIN } from '../src/utils/peekBox.js';

const view = { width: 1366, height: 900 };

describe('peekBox — где стоит выросший портрет', () => {
  it('портрет хозяина 112×112 в бестиарии вырастает до 280×280 по центру себя', () => {
    const rect = { left: 600, top: 300, width: 112, height: 112 };
    const box = peekBox(rect, 1, view);
    expect(box.width).toBeCloseTo(280);
    expect(box.height).toBeCloseTo(280);
    expect(box.left + box.width / 2).toBeCloseTo(rect.left + rect.width / 2);
    expect(box.top + box.height / 2).toBeCloseTo(rect.top + rect.height / 2);
  });

  it('Граф (160:190) растёт в 2,5 раза, пропорции сохранены — ничего не обрезано', () => {
    const box = peekBox({ left: 400, top: 300, width: 86, height: 102 }, 160 / 190, view);
    expect(box.width).toBeCloseTo(215);
    expect(box.width / box.height).toBeCloseTo(160 / 190);
  });

  it('широкая картинка растёт сильнее — в 3 раза', () => {
    const box = peekBox({ left: 500, top: 300, width: 200, height: 100 }, 2, view);
    expect(box.width).toBeCloseTo(600);
  });

  it('портрет у края окна сдвигается внутрь и не уходит под край', () => {
    for (const rect of [
      { left: 4, top: 4, width: 132, height: 132 },
      { left: 1300, top: 840, width: 58, height: 58 },
    ]) {
      const box = peekBox(rect, 1, view);
      expect(box.left).toBeGreaterThanOrEqual(ZOOM_MARGIN);
      expect(box.top).toBeGreaterThanOrEqual(ZOOM_MARGIN);
      expect(box.left + box.width).toBeLessThanOrEqual(view.width - ZOOM_MARGIN + 1e-9);
      expect(box.top + box.height).toBeLessThanOrEqual(view.height - ZOOM_MARGIN + 1e-9);
    }
  });

  it('на узком экране большой портрет ужимается до окна, но остаётся крупнее себя', () => {
    const phone = { width: 360, height: 640 };
    const box = peekBox({ left: 100, top: 200, width: 132, height: 132 }, 1, phone);
    expect(box.width).toBeLessThanOrEqual(360 - ZOOM_MARGIN * 2 + 1e-9);
    expect(box.width).toBeGreaterThan(132 * 2);
  });
});
