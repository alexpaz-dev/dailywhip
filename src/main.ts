import '@fontsource/press-start-2p/latin-400.css';
import './styles.css';
import { loadBlink, saveBlink } from './blink';
import { openPip, pipSupported } from './pip';
import * as timer from './timer';
import { createView } from './view';

const TICK_MS = 250;

const byId = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

const app = byId('app');
const dock = byId('dock');
const docked = byId('docked');
const floating = byId('floating');
const view = createView(app);

const now = () => performance.now();
let state = timer.createTimer();
let pip: Window | null = null;
let opening = false;
let loop: { win: Window; id: number } | null = null;

function render() {
  view.render(timer.read(state, now()), new Date());
}

function update(next: timer.Timer) {
  state = next;
  render();
}

// The tick runs on the window being looked at: Chrome throttles the timers of
// a minimized or covered main window, but the floating one stays visible.
function runLoop(win: Window) {
  if (loop && !loop.win.closed) loop.win.clearInterval(loop.id);
  loop = { win, id: win.setInterval(render, TICK_MS) };
}

async function float() {
  if (pip || opening || !pipSupported) return;
  opening = true;
  try {
    pip = await openPip(app, onPipClosed);
  } catch (error) {
    console.error('Could not open the floating window', error);
    return;
  } finally {
    opening = false;
  }
  docked.hidden = true;
  floating.hidden = false;
  runLoop(pip);
}

// Runs whenever the floating window closes, whoever closed it.
function onPipClosed() {
  pip = null;
  dock.append(app);
  floating.hidden = true;
  docked.hidden = false;
  runLoop(window);
  render();
}

let blink = loadBlink();
view.renderBlink(blink);

const { toggle, minus, plus, reset } = view.buttons;
view.buttons.blink.addEventListener('click', () => {
  blink = !blink;
  saveBlink(blink);
  view.renderBlink(blink);
});
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
byId('float').addEventListener('click', () => void float());
byId('bring-back').addEventListener('click', () => pip?.close());

docked.hidden = !pipSupported;
byId('unsupported').hidden = pipSupported;

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch((error) => console.error('Service worker registration failed', error));
}

runLoop(window);
render();
