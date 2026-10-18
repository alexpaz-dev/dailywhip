// Blinking in WARNING and TIME'S UP, remembered per browser. Without a saved
// choice it follows the system: off when Windows has "Animation effects"
// disabled, which browsers report as prefers-reduced-motion.

const KEY = 'dailywhip.blink';

/** An explicit choice always wins over the system setting. */
export function initialBlink(saved: string | null, reducedMotion: boolean): boolean {
  return saved === null ? !reducedMotion : saved === 'on';
}

export function loadBlink(): boolean {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {
    // Storage blocked: follow the system setting.
  }
  return initialBlink(saved, matchMedia('(prefers-reduced-motion: reduce)').matches);
}

export function saveBlink(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // Storage blocked: the choice still applies until the window closes.
  }
}
