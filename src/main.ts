import './styles.css';
import { createEventLog, createRefreshMonitor } from './diagnostics';
import { formatClock, formatDate } from './format';
import { openPip, pipSupported } from './pip';
import * as timer from './timer';

const TICK_MS = 250;
const BLOCKS = 20;

const byId = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

const host = byId('host');
const app = byId('app');
const date = byId('date');
const clock = byId('clock');
const timesUp = byId('timesup');
const toggle = byId<HTMLButtonElement>('toggle');
const minus = byId<HTMLButtonElement>('minus');
const plus = byId<HTMLButtonElement>('plus');
const reset = byId<HTMLButtonElement>('reset');
const refresh = byId('refresh');
const floating = byId('floating');
const floatButton = byId<HTMLButtonElement>('float');
const progress = byId('progress');
const blocks = Array.from({ length: BLOCKS }, () => progress.appendChild(document.createElement('span')));

const log = createEventLog(byId('log'));
const monitor = createRefreshMonitor();

const now = () => performance.now();
let state = timer.createTimer();
let pip: Window | null = null;
let opening = false;
let loop: { win: Window; id: number } | null = null;

function setText(el: HTMLElement, text: string) {
  if (el.textContent !== text) el.textContent = text;
}

function render() {
  const s = timer.read(state, now());
  app.dataset.phase = s.phase;
  setText(date, formatDate(new Date()));
  setText(clock, formatClock(s.remainingSeconds));
  timesUp.hidden = s.phase !== 'timesup';
  setText(timesUp, `TIME'S UP! +${formatClock(s.overtimeSeconds)}`);
  setText(toggle, s.status === 'running' ? 'PAUSE' : s.status === 'paused' ? 'RESUME' : 'START');
  minus.disabled = !s.canSubtract;
  plus.disabled = !s.canAdd;
  reset.disabled = s.status === 'idle';
  const filled = Math.floor(s.progress * BLOCKS);
  blocks.forEach((block, i) => block.classList.toggle('on', i < filled));
  setText(refresh, monitor.summary());
}

function update(next: timer.Timer) {
  state = next;
  render();
}

// The tick runs on the window being looked at: Chrome throttles the timers of
// a minimized or covered main window, but the floating one stays visible.
function runLoop(win: Window) {
  if (loop && !loop.win.closed) loop.win.clearInterval(loop.id);
  monitor.reset();
  const id = win.setInterval(() => {
    monitor.tick(now());
    render();
  }, TICK_MS);
  loop = { win, id };
}

async function float() {
  if (pip || opening || !pipSupported) return;
  opening = true;
  try {
    pip = await openPip(app, dock);
  } catch (error) {
    log(`no se pudo abrir la ventana flotante: ${(error as Error).message}`);
    return;
  } finally {
    opening = false;
  }
  floating.hidden = false;
  floatButton.hidden = true;
  log('ventana flotante abierta');
  runLoop(pip);
}

// Runs whenever the floating window closes, whoever closed it.
function dock() {
  pip = null;
  host.append(app);
  floating.hidden = true;
  floatButton.hidden = false;
  log('ventana flotante cerrada');
  runLoop(window);
  render();
}

toggle.addEventListener('click', () => {
  const current = timer.status(state);
  if (current === 'running') {
    update(timer.pause(state, now()));
  } else {
    update(timer.start(state, now()));
    // START doubles as "float": one click and the timer is on top.
    if (current === 'idle') void float();
  }
});
minus.addEventListener('click', () => update(timer.subtract(state, now())));
plus.addEventListener('click', () => update(timer.add(state)));
reset.addEventListener('click', () => update(timer.reset(state)));
floatButton.addEventListener('click', () => void float());
byId('dock').addEventListener('click', () => pip?.close());

document.addEventListener('visibilitychange', () => {
  log(document.visibilityState === 'hidden' ? 'ventana principal oculta o minimizada' : 'ventana principal visible');
});

byId('support').textContent = pipSupported
  ? 'Ventana flotante: disponible.'
  : 'Ventana flotante: no disponible en este navegador. Usa Chrome o Edge de escritorio.';
byId('mode').textContent = matchMedia('(display-mode: standalone)').matches
  ? 'Modo: app instalada.'
  : 'Modo: pestaña del navegador.';
floatButton.hidden = !pipSupported;

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch((error: Error) => log(`service worker: ${error.message}`));
}

runLoop(window);
render();
