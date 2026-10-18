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
async function waitForText(page, selector, text) {
  for (let i = 0; i < 100; i++) {
    if ((await page.locator(selector).textContent()) === text) return;
    await sleep(50);
  }
  throw new Error(`${selector} never showed "${text}"`);
}

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

  const capture = async (name, forward, selector, text) => {
    if (forward) await context.clock.fastForward(forward);
    await waitForText(pip, selector, text);
    await pip.screenshot({ path: `${OUT}/pip-${name}.png` });
  };
  await capture('1-start', null, '#clock', '15:00');
  await capture('2-normal', '07:00', '#clock', '08:00');
  await capture('3-warning', '05:00', '#clock', '03:00'); // 12:00 of 15:00
  await capture('4-timesup', '05:35', '#timesup', "TIME'S UP! +02:35");
} finally {
  await browser.close();
  await server.close();
}

if (errors.length > 0) {
  console.error(`Page errors:\n${errors.join('\n')}`);
  process.exit(1);
}
console.log(`Screenshots in ${OUT}/ (scale ${SCALE})`);
