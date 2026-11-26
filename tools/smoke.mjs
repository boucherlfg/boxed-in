// Smoke test: load the game in headless Chromium and fail on any error at launch.
//
// Usage: node tools/smoke.mjs [--dir <site root>] [--base </sub/path/>] [--wait <ms>] [--out <dir>]
//
// The site is served under --base (default "/") so that absolute-path bugs (e.g. "/src/main.js")
// are caught: the preview on GitHub Pages lives under /<repo>/pr-N/, not at the domain root.
//
// Fails (exit 1) on: console.error, uncaught exception, failed request, HTTP status >= 400.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1]]);
    return acc;
  }, [])
);
const dir = path.resolve(args.dir ?? '.');
const base = (args.base ?? '/').replace(/\/?$/, '/');
const waitMs = Number(args.wait ?? 1500);
const outDir = path.resolve(args.out ?? 'artifacts');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (!pathname.startsWith(base)) {
    res.writeHead(404).end('outside base path');
    return;
  }
  let rel = pathname.slice(base.length);
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  const file = path.resolve(dir, rel);
  if (!file.startsWith(dir + path.sep) && file !== dir) {
    res.writeHead(403).end();
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const target = `http://127.0.0.1:${port}${base}`;

const problems = [];
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`console.error: ${msg.text()}`);
  });
  page.on('pageerror', (err) => problems.push(`uncaught exception: ${err.message}`));
  page.on('requestfailed', (req) =>
    problems.push(`request failed: ${req.url()} (${req.failure()?.errorText})`));
  page.on('response', (res) => {
    if (res.status() >= 400) problems.push(`HTTP ${res.status()}: ${res.url()}`);
  });

  await page.goto(target, { waitUntil: 'load' });
  await page.waitForTimeout(waitMs);

  fs.mkdirSync(outDir, { recursive: true });
  await page.screenshot({ path: path.join(outDir, 'smoke.png') });
} catch (e) {
  problems.push(`smoke harness error: ${e.message}`);
} finally {
  await browser.close();
  server.close();
}

const report = { target, ok: problems.length === 0, problems };
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'smoke-report.json'), JSON.stringify(report, null, 2));

if (report.ok) {
  console.log(`SMOKE OK (${target})`);
} else {
  console.error(`SMOKE FAILED (${target})`);
  for (const p of problems) console.error(` - ${p}`);
  process.exit(1);
}
