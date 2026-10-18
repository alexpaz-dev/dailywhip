// Captures the main window and the real floating window in each phase, to
// review the design without Windows. Playwright's fake clock jumps straight to
// WARNING and TIME'S UP, and every capture first waits for the expected text,
// so the script also checks the floating window end to end.
// Usage: pnpm screenshots (SCALE=1.25 to check Windows display scaling).
import { mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const OUT = 'screenshots';
const SCALE = Number(process.env.SCALE ?? 2);

mkdirSync(OUT, { recursive: true });
const server = await createServer({ logLevel: 'silent', server: { port: 5199 } });
await server.listen();
const browser = await chromium.launch();
const errors = [];

// Polls from Node: the page's own timers are fake.
async function waitFor(check, label) {
  for (let i = 0; i < 100; i++) {
    if (await check()) return;
    await sleep(50);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

const waitForText = (page, selector, text) =>
  waitFor(async () => (await page.locator(selector).textContent()) === text, `${selector} = "${text}"`);

try {
  const context = await browser.newContext({ viewport: { width: 400, height: 520 }, deviceScaleFactor: SCALE });
  context.on('weberror', (error) => errors.push(error.error().message));
  context.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  await context.clock.install({ time: new Date('2026-10-18T09:00:00') });

  const main = await context.newPage();
  await main.goto(server.resolvedUrls.local[0]);
  await main.screenshot({ path: `${OUT}/main.png` });

  const opened = context.waitForEvent('page');
  await main.click('#toggle'); // START opens the floating window
  const pip = await opened;
  await pip.setViewportSize({ width: 300, height: 250 }); // the size openPip() requests
  await main.screenshot({ path: `${OUT}/main-floating.png` });

  const shot = async (name) => {
    await sleep(100); // a frozen animation frame can take a moment to paint
    await pip.screenshot({ path: `${OUT}/pip-${name}.png` });
  };
  // CSS animations ignore the fake clock: pause each one at a chosen time (ms).
  // whip-lash starts after the 400 ms entrance; its frames are in styles.css.
  const freeze = (times) =>
    pip.evaluate((t) => {
      for (const a of document.getAnimations()) {
        if (a.animationName in t) a.currentTime = t[a.animationName];
        a.pause();
      }
    }, times);
  const blinkIs = (value) =>
    waitFor(async () => (await pip.locator('#app').getAttribute('data-blink')) === value, `blink ${value}`);

  await waitForText(pip, '#clock', '15:00');
  await shot('1-start');
  await context.clock.fastForward('07:00');
  await waitForText(pip, '#clock', '08:00');
  await shot('2-normal');
  await context.clock.fastForward('05:00'); // 12:00 of 15:00: WARNING
  await waitForText(pip, '#clock', '03:00');
  await freeze({ 'whip-in': 300 }); // third of four jumps
  await shot('3a-warning-whip-entering');
  await freeze({ blink: 250, 'whip-in': 400, 'whip-lash': 400 });
  await shot('3b-warning-whip-rest');
  await freeze({ blink: 750, 'whip-lash': 3100 });
  await shot('3c-warning-dark-whip-crack');
  // Clicks leave the mouse hovering the bolt; move it away to see its state.
  await pip.click('#blink');
  await blinkIs('off');
  await pip.mouse.move(0, 0);
  await freeze({ 'whip-lash': 2950 });
  await shot('3d-warning-no-blink-whip-swing');
  await pip.click('#blink');
  await blinkIs('on');
  await pip.mouse.move(0, 0);
  await context.clock.fastForward('05:35'); // 17:35: TIME'S UP
  await waitForText(pip, '#overtime', '+02:35');
  await freeze({ blink: 750, 'whip-frenzy': 350, 'whip-shake': 0 });
  await shot('4-timesup-dark-whip-crack');

  // Windows "Animation effects" off: no blinking until the user turns it on.
  const reduced = await browser.newContext({ reducedMotion: 'reduce' });
  await reduced.clock.install(); // freezes the render loop so the phase set below sticks
  const page = await reduced.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  if ((await page.locator('#app').getAttribute('data-blink')) !== 'off') {
    errors.push('Blinking should start off when the system reduces motion');
  }
  const whip = await page.evaluate(() => {
    document.getElementById('app').dataset.phase = 'warning';
    const style = getComputedStyle(document.getElementById('whip'));
    return { display: style.display, animation: style.animationName };
  });
  if (whip.display !== 'block' || whip.animation !== 'none') {
    errors.push(`With reduced motion the whip should show still, got ${JSON.stringify(whip)}`);
  }
  await reduced.close();
} finally {
  await browser.close();
  await server.close();
}

if (errors.length > 0) {
  console.error(`Page errors:\n${errors.join('\n')}`);
  process.exit(1);
}
console.log(`Screenshots in ${OUT}/ (scale ${SCALE})`);
