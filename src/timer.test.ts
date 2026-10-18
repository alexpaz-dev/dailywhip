import { describe, expect, it } from 'vitest';
import {
  MINUTE_MS,
  SECOND_MS,
  add,
  createTimer,
  pause,
  read,
  reset,
  start,
  subtract,
  type Timer,
} from './timer';

const min = (m: number) => m * MINUTE_MS;
const sec = (s: number) => s * SECOND_MS;

/** A timer started at t=0 and left running. */
function running(totalMin = 15): Timer {
  return start(createTimer(min(totalMin)), 0);
}

describe('initial state', () => {
  it('is 15:00, stopped, normal and empty', () => {
    expect(read(createTimer(), 0)).toEqual({
      status: 'idle',
      phase: 'normal',
      remainingSeconds: 15 * 60,
      overtimeSeconds: 0,
      progress: 0,
      canAdd: true,
      canSubtract: true,
    });
  });
});

describe('start, pause, resume, reset', () => {
  it('counts down from the clock, not from ticks', () => {
    const t = running();
    expect(read(t, sec(1)).remainingSeconds).toBe(14 * 60 + 59);
    expect(read(t, min(10)).remainingSeconds).toBe(5 * 60);
  });

  it('keeps the remaining time while paused and resumes from it', () => {
    let t = pause(running(), min(4));
    expect(read(t, min(60))).toMatchObject({ status: 'paused', remainingSeconds: 11 * 60 });
    t = start(t, min(60));
    expect(read(t, min(61)).remainingSeconds).toBe(10 * 60);
  });

  it('does not drift across many pauses', () => {
    let t = createTimer();
    let now = 0;
    for (let i = 0; i < 100; i++) {
      t = start(t, now);
      now += 1_234.5;
      t = pause(t, now);
      now += 777;
    }
    expect(t.elapsedMs).toBeCloseTo(123_450, 6);
  });

  it('ignores START while running and PAUSE while stopped', () => {
    const t = running();
    expect(start(t, min(3))).toBe(t);
    const idle = createTimer();
    expect(pause(idle, min(3))).toBe(idle);
  });

  it('resets to the configured duration', () => {
    const t = reset(pause(running(), min(5)));
    expect(read(t, min(5))).toMatchObject({ status: 'idle', remainingSeconds: 15 * 60, progress: 0 });
  });
});

describe('±5 while stopped', () => {
  it('changes the configured duration', () => {
    const t = add(createTimer());
    expect(t.configuredMs).toBe(min(20));
    expect(read(reset(t), 0).remainingSeconds).toBe(20 * 60);
  });

  it('never goes below 5 or above 30 minutes', () => {
    expect(read(createTimer(min(5)), 0).canSubtract).toBe(false);
    expect(subtract(createTimer(min(5)), 0).totalMs).toBe(min(5));
    const max = add(add(add(createTimer())));
    expect(max.totalMs).toBe(min(30));
    expect(read(max, 0).canAdd).toBe(false);
    expect(add(max).totalMs).toBe(min(30));
  });
});

describe('±5 after START', () => {
  it('adds 5 minutes and recalculates the progress (brief example)', () => {
    const t = add(running());
    expect(read(t, min(7))).toMatchObject({ remainingSeconds: 13 * 60, progress: 0.35, phase: 'normal' });
  });

  it('only changes the current session: RESET returns to the configured duration', () => {
    const t = add(running());
    expect(t.configuredMs).toBe(min(15));
    expect(reset(t).totalMs).toBe(min(15));
  });

  it('goes back to normal when +5 drops the progress under 75 %', () => {
    const t = running();
    expect(read(t, min(12)).phase).toBe('warning');
    expect(read(add(t), min(12)).phase).toBe('normal');
  });

  it('disables -5 when it would reach 00:00', () => {
    const t = running();
    expect(read(t, min(10)).canSubtract).toBe(false); // exactly 05:00 left
    expect(subtract(t, min(10))).toBe(t);
    expect(read(t, min(10) - sec(1)).canSubtract).toBe(true); // 05:01 left
    expect(read(subtract(t, min(10) - sec(1)), min(10) - sec(1)).remainingSeconds).toBe(1);
  });

  it('never extends the session beyond 30 minutes', () => {
    const t = add(add(add(running())));
    expect(t.totalMs).toBe(min(30));
    expect(read(t, min(1)).canAdd).toBe(false);
  });
});

describe('phases', () => {
  it('enters WARNING exactly at 75 % (03:45 left out of 15:00)', () => {
    const t = running();
    expect(read(t, min(11.25) - 1).phase).toBe('normal');
    expect(read(t, min(11.25))).toMatchObject({ phase: 'warning', remainingSeconds: 3 * 60 + 45 });
  });

  it("shows 00:00 and TIME'S UP at the end, then counts the overtime", () => {
    const t = running();
    expect(read(t, min(15))).toMatchObject({ phase: 'timesup', remainingSeconds: 0, overtimeSeconds: 0, progress: 1 });
    expect(read(t, min(15) + sec(155))).toMatchObject({ remainingSeconds: 0, overtimeSeconds: 155, progress: 1 });
  });

  it("+5 in TIME'S UP grants an extension and recalculates the phase", () => {
    const t = running();
    expect(read(t, min(15.5)).phase).toBe('timesup');
    const extended = add(t);
    expect(read(extended, min(15.5))).toMatchObject({ phase: 'warning', remainingSeconds: 4 * 60 + 30 });
    expect(read(extended, min(21))).toMatchObject({ phase: 'timesup', overtimeSeconds: 60 });
  });

  it("-5 is disabled in TIME'S UP", () => {
    expect(read(running(), min(16)).canSubtract).toBe(false);
  });
});
