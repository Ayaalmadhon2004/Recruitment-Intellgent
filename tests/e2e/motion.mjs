// Motion checks. Start the app first (`pnpm build && pnpm start`) and run `pnpm e2e:motion`.
// 1) reducedMotion "reduce": nothing is hidden or stuck at opacity 0, and nothing still animates.
// 2) normal motion: layout shift (CLS) is 0 on Home, Audit, Report and Agent Strategy.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const base = process.env.BASE_URL ?? 'http://localhost:3000';
const pages = ['/', '/intake', '/report', '/agent-strategy'];
const browser = await chromium.launch();
let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.error(`FAIL ${msg}`);
};

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
  for (const path of pages) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(300);
    const problems = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('main *')) {
        const cs = getComputedStyle(el);
        const label = `${el.tagName}.${String(el.className).slice(0, 40)}`;
        if (
          cs.opacity === '0' &&
          cs.visibility !== 'hidden' &&
          !el.closest('[hidden], [aria-hidden="true"]')
        )
          out.push(`${label} has opacity 0`);
        if (cs.animationName !== 'none' && parseFloat(cs.animationDuration) > 0)
          out.push(`${label} still animates (${cs.animationName})`);
      }
      return out.slice(0, 5);
    });
    for (const p of problems) fail(`reduced ${path} @${viewport.width}: ${p}`);
  }
  await page.close();
}

for (const path of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3200); // the Home intro lasts 2.5s
  for (let y = 0; y < 4; y += 1) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(250);
  }
  const cls = await page.evaluate(() => window.__cls);
  if (cls > 0.0001) fail(`CLS ${cls.toFixed(4)} on ${path}`);
  else console.log(`ok CLS 0 on ${path}`);
  await page.close();
}

await browser.close();
if (failures) process.exit(1);
console.log('motion: all checks passed');
