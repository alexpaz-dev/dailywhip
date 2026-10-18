import { describe, expect, it } from 'vitest';
import { initialBlink } from './blink';

describe('initialBlink', () => {
  it('follows the system setting when nothing was chosen', () => {
    expect(initialBlink(null, false)).toBe(true);
    expect(initialBlink(null, true)).toBe(false);
  });

  it('keeps the explicit choice, whatever the system says', () => {
    expect(initialBlink('off', false)).toBe(false);
    expect(initialBlink('on', true)).toBe(true);
  });
});
