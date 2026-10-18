// Countdown logic with no DOM and no intervals. Every function receives `now`,
// a monotonic clock reading in ms, and time is always derived from it: nothing
// is decremented per tick, so pauses, ±5 changes and throttled timers can never
// make the countdown drift.

export const SECOND_MS = 1_000;
export const MINUTE_MS = 60 * SECOND_MS;
export const STEP_MS = 5 * MINUTE_MS;
export const MIN_MS = 5 * MINUTE_MS;
/** A daily longer than this is a meeting in disguise: never allowed, not even as overtime extension. */
export const MAX_MS = 30 * MINUTE_MS;
export const DEFAULT_MS = 15 * MINUTE_MS;

export type Timer = {
  /** Duration RESET returns to. Only ±5 while idle changes it. */
  readonly configuredMs: number;
  /** Duration of the current session, including ±5 pressed after START. */
  readonly totalMs: number;
  /** Time consumed by the segments closed by a pause. */
  readonly elapsedMs: number;
  /** Clock reading when the running segment began; null when not running. */
  readonly startedAt: number | null;
};

export type Status = 'idle' | 'running' | 'paused';
export type Phase = 'normal' | 'warning' | 'timesup';

export type Snapshot = {
  readonly status: Status;
  readonly phase: Phase;
  /** Rounded up, so it reads 15:00 at START and 00:00 exactly at TIME'S UP. */
  readonly remainingSeconds: number;
  readonly overtimeSeconds: number;
  /** Share of the session consumed, from 0 to 1. */
  readonly progress: number;
  readonly canAdd: boolean;
  readonly canSubtract: boolean;
};

export function createTimer(configuredMs = DEFAULT_MS): Timer {
  return { configuredMs, totalMs: configuredMs, elapsedMs: 0, startedAt: null };
}

export function status(t: Timer): Status {
  if (t.startedAt !== null) return 'running';
  return t.elapsedMs > 0 ? 'paused' : 'idle';
}

export function elapsed(t: Timer, now: number): number {
  return t.elapsedMs + (t.startedAt === null ? 0 : now - t.startedAt);
}

export function remaining(t: Timer, now: number): number {
  return t.totalMs - elapsed(t, now);
}

export function phase(t: Timer, now: number): Phase {
  const used = elapsed(t, now);
  if (used >= t.totalMs) return 'timesup';
  // used / total >= 75 %, compared in integers to avoid float rounding.
  return used * 4 >= t.totalMs * 3 ? 'warning' : 'normal';
}

/** START and RESUME. */
export function start(t: Timer, now: number): Timer {
  return t.startedAt === null ? { ...t, startedAt: now } : t;
}

export function pause(t: Timer, now: number): Timer {
  return t.startedAt === null ? t : { ...t, elapsedMs: elapsed(t, now), startedAt: null };
}

export function reset(t: Timer): Timer {
  return createTimer(t.configuredMs);
}

export function canAdd(t: Timer): boolean {
  return t.totalMs + STEP_MS <= MAX_MS;
}

/** -5 is disabled when it would leave the session under 5 min or reach 00:00. */
export function canSubtract(t: Timer, now: number): boolean {
  return t.totalMs - STEP_MS >= MIN_MS && remaining(t, now) - STEP_MS > 0;
}

export function add(t: Timer): Timer {
  return canAdd(t) ? resize(t, t.totalMs + STEP_MS) : t;
}

export function subtract(t: Timer, now: number): Timer {
  return canSubtract(t, now) ? resize(t, t.totalMs - STEP_MS) : t;
}

// While idle, ±5 sets the duration RESET returns to; once started, it only
// extends or shortens the current session.
function resize(t: Timer, totalMs: number): Timer {
  return status(t) === 'idle' ? { ...t, configuredMs: totalMs, totalMs } : { ...t, totalMs };
}

export function read(t: Timer, now: number): Snapshot {
  const left = remaining(t, now);
  return {
    status: status(t),
    phase: phase(t, now),
    remainingSeconds: left > 0 ? Math.ceil(left / SECOND_MS) : 0,
    overtimeSeconds: left < 0 ? Math.floor(-left / SECOND_MS) : 0,
    progress: Math.min(1, elapsed(t, now) / t.totalMs),
    canAdd: canAdd(t),
    canSubtract: canSubtract(t, now),
  };
}
