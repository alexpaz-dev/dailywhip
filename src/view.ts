// Paints a timer snapshot. The only module that touches the timer's DOM; it
// keeps its element references, so it works the same once the timer has moved
// into the floating window.

import { formatClock, formatDate } from './format';
import type { Snapshot, Status } from './timer';

const BLOCKS = 20;

const TOGGLE_LABELS: Record<Status, string> = { idle: 'START', running: 'PAUSE', paused: 'RESUME' };

export function createView(app: HTMLElement) {
  const el = <T extends HTMLElement = HTMLElement>(id: string) => app.querySelector(`#${id}`) as T;
  const date = el('date');
  const clock = el('clock');
  const timesUp = el('timesup');
  const overtime = el('overtime');
  const progress = el('progress');
  const buttons = {
    toggle: el<HTMLButtonElement>('toggle'),
    minus: el<HTMLButtonElement>('minus'),
    plus: el<HTMLButtonElement>('plus'),
    reset: el<HTMLButtonElement>('reset'),
  };
  const blocks = Array.from({ length: BLOCKS }, () => progress.appendChild(document.createElement('span')));

  function render(s: Snapshot, today: Date) {
    app.dataset.phase = s.phase;
    setText(date, formatDate(today));
    // At 00:00 the message takes the clock's place: the zero adds nothing.
    const over = s.phase === 'timesup';
    clock.hidden = over;
    timesUp.hidden = !over;
    setText(clock, formatClock(s.remainingSeconds));
    setText(overtime, `+${formatClock(s.overtimeSeconds)}`);
    setText(buttons.toggle, TOGGLE_LABELS[s.status]);
    buttons.minus.disabled = !s.canSubtract;
    buttons.plus.disabled = !s.canAdd;
    buttons.reset.disabled = s.status === 'idle';
    const filled = Math.floor(s.progress * BLOCKS);
    blocks.forEach((block, i) => block.classList.toggle('on', i < filled));
    progress.setAttribute('aria-valuenow', String(Math.round(s.progress * 100)));
  }

  return { buttons, render };
}

function setText(el: HTMLElement, text: string) {
  if (el.textContent !== text) el.textContent = text;
}
