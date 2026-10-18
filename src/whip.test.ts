import { describe, expect, it } from 'vitest';
import { FRAME_H, FRAME_W, FRAMES, spriteSheet } from './whip';

describe('whip frames', () => {
  it('are 48×32 and only use the palette', () => {
    expect(FRAMES).toHaveLength(5);
    for (const rows of FRAMES) {
      expect(rows).toHaveLength(FRAME_H);
      for (const row of rows) expect(row).toMatch(new RegExp(`^[WGK.]{${FRAME_W}}$`));
    }
  });

  // Drawn at 2× in the bottom-left corner, these margins keep the whip clear
  // of the -5 and RESET buttons, even while it shakes in TIME'S UP.
  it('leave the top 4 rows and the right column empty', () => {
    for (const rows of FRAMES) {
      expect(rows.slice(0, 4).join('')).toMatch(/^\.+$/);
      for (const row of rows) expect(row.at(-1)).toBe('.');
    }
  });
});

describe('spriteSheet', () => {
  it('lays the frames side by side, one rect per run of pixels', () => {
    const blank = '.'.repeat(FRAME_W);
    const frame = (first: string) => [first + blank.slice(first.length), ...Array(FRAME_H - 1).fill(blank)];
    const svg = spriteSheet([frame('WW'), frame('.K')]);
    expect(svg).toContain('viewBox="0 0 96 32"');
    expect(svg).toContain('<path fill="#ffffff" d="M0 0h2v1h-2z"/>');
    expect(svg).toContain('<path fill="#000000" d="M49 0h1v1h-1z"/>');
  });
});
