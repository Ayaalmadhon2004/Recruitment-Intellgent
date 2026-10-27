// Runs axe (WCAG 2.0/2.1/2.2 A and AA) on every built Storybook story. Run `pnpm build-storybook` first.
// Needs Playwright with Chromium available to `require` (preinstalled in the cloud environment).
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { extname, join, normalize } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const axePath = require.resolve('axe-core/axe.min.js');

const root = new URL('../storybook-static', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };

const server = createServer((req, res) => {
  const path = normalize(join(root, decodeURIComponent((req.url ?? '/').split('?')[0])));
  const file = existsSync(path) && statSync(path).isDirectory() ? join(path, 'index.html') : path;
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://localhost:${server.address().port}`;

const index = JSON.parse(readFileSync(join(root, 'index.json'), 'utf8'));
const ids = Object.values(index.entries).filter((e) => e.type === 'story').map((e) => e.id);
const only = process.argv[2];
const targets = only ? ids.filter((id) => id.includes(only)) : ids;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
// Entrance animations start semi-transparent; axe would read that as low contrast. Real users who see them
// are not affected, and users who ask for reduced motion get no animation at all.
await page.emulateMedia({ reducedMotion: 'reduce' });
let bad = 0;
for (const id of targets) {
  await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`);
  await page.waitForTimeout(400);
  await page.addScriptTag({ path: axePath });
  const result = await page.evaluate(() =>
    globalThis.axe.run(document.querySelector('#storybook-root') ?? document.body, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
    }),
  );
  if (result.violations.length) {
    bad += 1;
    console.log(`VIOLATIONS ${id}`);
    for (const v of result.violations) {
      console.log(`  ${v.id} (${v.impact}) ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')} - ${v.help}`);
    }
  }
}
await browser.close();
server.close();
console.log(`a11y: ${targets.length} stories checked, ${bad} with violations`);
process.exit(bad ? 1 : 0);
