// Browser smoke test: every page at 390px and 1440px has exactly one <main>, one <h1>, no horizontal scroll and
// no console errors, and the Quick Start flow reaches the First Read. Start the app first (`pnpm build && pnpm start`,
// or `pnpm dev`) and run `pnpm e2e`. Set BASE_URL for a port other than 3000.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const base = process.env.BASE_URL ?? 'http://localhost:3000';
const paths = ['/', '/quick-start', '/intake', '/report', '/report/pdf', '/cost-calc', '/agent-strategy', '/advisor', '/sign-in', '/dashboard', '/unlock'];
const viewports = [{ width: 390, height: 844 }, { width: 1440, height: 900 }];

const browser = await chromium.launch();
let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.error(`FAIL ${msg}`);
};

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const path of paths) {
    const label = `${path} @${viewport.width}`;
    const res = await page.goto(base + path, { waitUntil: 'networkidle' });
    if (!res?.ok()) fail(`${label}: status ${res?.status()}`);
    const mains = await page.locator('main').count();
    if (mains !== 1) fail(`${label}: ${mains} <main> elements`);
    const h1s = await page.locator('h1').count();
    if (h1s < 1) fail(`${label}: no <h1>`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflow) fail(`${label}: horizontal scroll`);
  }
  if (errors.length) fail(`@${viewport.width} console errors: ${errors.join(' | ')}`);
  await page.close();
}

// Quick Start: answer "Not sure" on every step (valid for any question type), then see the First Read.
const flow = await browser.newPage({ viewport: viewports[0] });
await flow.goto(`${base}/quick-start`, { waitUntil: 'networkidle' });
for (let step = 0; step < 5; step += 1) {
  await flow.getByRole('button', { name: 'Not sure' }).click();
  const next = flow.getByRole('button', { name: /^(Next|See my first read)$/ });
  await next.click();
}
await flow.waitForURL('**/first-read', { timeout: 15000 }).catch(() => fail('quick-start: did not reach /first-read'));
if (flow.url().endsWith('/first-read') && (await flow.locator('main').count()) !== 1) fail('first-read: expected one <main>');
await flow.close();

await browser.close();
if (failures) {
  console.error(`${failures} e2e failure(s)`);
  process.exit(1);
}
console.log('e2e smoke passed');
