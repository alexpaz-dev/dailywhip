// PROTOTYPE ONLY. Measures how often the screen really refreshes, to find out
// whether Chrome throttles the countdown while the main window is minimized.
// It never affects the time shown: that is always derived from the clock.

const WINDOW_MS = 60_000;

export function createRefreshMonitor() {
  let last: number | null = null;
  let worst = 0;
  let recent: { at: number; gap: number }[] = [];

  return {
    reset() {
      last = null;
      worst = 0;
      recent = [];
    },
    tick(now: number) {
      if (last !== null) {
        const gap = now - last;
        worst = Math.max(worst, gap);
        recent.push({ at: now, gap });
        recent = recent.filter((r) => now - r.at <= WINDOW_MS);
      }
      last = now;
    },
    summary(): string {
      const recentWorst = recent.reduce((max, r) => Math.max(max, r.gap), 0);
      return `refresco máx. ${Math.round(recentWorst)} ms (1 min) · ${Math.round(worst)} ms (total)`;
    },
  };
}

export function createEventLog(list: HTMLElement) {
  return (message: string) => {
    const item = document.createElement('li');
    item.textContent = `${new Date().toLocaleTimeString('es-ES')} · ${message}`;
    list.prepend(item);
  };
}
