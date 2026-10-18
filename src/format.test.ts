import { describe, expect, it } from 'vitest';
import { formatClock, formatDate } from './format';

describe('formatClock', () => {
  it('formats MM:SS', () => {
    expect(formatClock(15 * 60)).toBe('15:00');
    expect(formatClock(3 * 60 + 45)).toBe('03:45');
    expect(formatClock(65)).toBe('01:05');
    expect(formatClock(0)).toBe('00:00');
  });
});

describe('formatDate', () => {
  it('formats the brief example', () => {
    expect(formatDate(new Date(2026, 9, 18))).toBe('SUN 18 OCT 2026');
  });

  it('pads the day so the width never changes', () => {
    expect(formatDate(new Date(2026, 0, 1))).toBe('THU 01 JAN 2026');
  });
});
