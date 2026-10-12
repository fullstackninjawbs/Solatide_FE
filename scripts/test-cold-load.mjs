#!/usr/bin/env node
/**
 * Cold-load integrity probe (QA items 1 & 2).
 *
 * Watches the DOM continuously from first paint until the page settles and fails if, at ANY
 * moment, it shows sample/placeholder catalogue data or wrong head tags:
 *   - product links that are numeric ids (/products/1), prices below $1, "Sold Out" on a product
 *     the API reports in stock, any React error (#418/#423/#425 or "[hydration]")
 *   - after JS: exactly one title / meta description / canonical / og:title / og:description /
 *     og:url / twitter:title / twitter:description (and the same in raw HTML).
 *
 * Usage:
 *   node scripts/test-cold-load.mjs                 # serves ./dist-store locally (nginx-like), /api proxied read-only to production
 *   node scripts/test-cold-load.mjs --live          # against https://solatidebiosciences.com.au
 *   node scripts/test-cold-load.mjs /pages/faq ...  # custom routes
 * Exit code 1 on any failure.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const LIVE = argv.includes('--live');
const API_UPSTREAM = process.env.API_UPSTREAM || 'https://solatidebiosciences.com.au';
const distDir = path.resolve(__dirname, '..', process.env.DIST_STORE_DIR || 'dist-store');
const routeArgs = argv.filter((a) => !a.startsWith('--'));
const routes = routeArgs.length ? routeArgs : [
    '/', '/collections/all', '/collections/glp-1-metabolic-peptides', '/products/retatrutide-5mg', '/products/bpc-157-10mg',
    '/pages/data-sharing-opt-out', '/pages/bpc-157-vs-tb-500', '/pages/retatrutide-vs-semaglutide-research', '/pages/faq',
];
const HEAD_TAGS = {
    title: 'title', description: 'meta[name="description"]', canonical: 'link[rel="canonical"]',
    'og:title': 'meta[property="og:title"]', 'og:description': 'meta[property="og:description"]', 'og:url': 'meta[property="og:url"]',
    'twitter:title': 'meta[name="twitter:title"]', 'twitter:description': 'meta[name="twitter:description"]',
};

// ─── nginx-like static server for the local build ────────────────────────────
let BASE = 'https://solatidebiosciences.com.au';
let server = null;
if (!LIVE) {
    const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.woff2': 'font/woff2' };
    const safeFile = (rel) => { const p = path.resolve(distDir, `.${rel}`); if (!p.startsWith(distDir)) return null; try { return fs.statSync(p).isFile() ? p : null; } catch { return null; } };
    server = http.createServer(async (req, res) => {
        const url = new URL(req.url, 'http://x');
        if (url.pathname.startsWith('/api/')) {
            if (req.method !== 'GET') { res.writeHead(204); res.end(); return; } // never write upstream
            try {
                const up = await fetch(`${API_UPSTREAM}${url.pathname}${url.search}`, { headers: { accept: 'application/json' } });
                res.writeHead(up.status, { 'content-type': up.headers.get('content-type') || 'application/json' });
                res.end(Buffer.from(await up.arrayBuffer()));
            } catch (e) { res.writeHead(502); res.end(e.message); }
            return;
        }
        let pathname = decodeURIComponent(url.pathname);
        if (pathname === '/') pathname = '/index.html';
        const file = safeFile(pathname) || safeFile(`${pathname}.html`);
        if (file) { res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache' }); fs.createReadStream(file).pipe(res); return; }
        const nf = safeFile('/404.html'); res.writeHead(404, { 'content-type': MIME['.html'] }); if (nf) fs.createReadStream(nf).pipe(res); else res.end('not found');
    });
    await new Promise((r) => server.listen(0, r));
    BASE = `http://localhost:${server.address().port}`;
}

// In-stock truth from the public API (to detect a false "Sold Out")
const apiProducts = await fetch(`${API_UPSTREAM}/api/products?limit=100`).then((r) => r.json()).then((j) => j?.data?.products || j?.data || []).catch(() => []);
const inStockSlugs = apiProducts.filter((p) => p.inStock !== false && (p.stockQuantity > 0 || (p.variants || []).some((v) => v.stockQty > 0) || p.inventoryPolicy === 'continue')).map((p) => p.slug);

const countRaw = (html) => {
    const head = html.split(/<\/head>/i)[0];
    const c = (re) => (head.match(re) || []).length;
    return {
        title: c(/<title[\s>]/gi), description: c(/<meta[^>]+name="description"/gi), canonical: c(/<link[^>]+rel="canonical"/gi),
        'og:title': c(/property="og:title"/gi), 'og:description': c(/property="og:description"/gi), 'og:url': c(/property="og:url"/gi),
        'twitter:title': c(/name="twitter:title"/gi), 'twitter:description': c(/name="twitter:description"/gi),
    };
};

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
let failed = 0;
for (const route of routes) {
    const problems = [];
    const raw = await fetch(BASE + route).then(async (r) => ({ status: r.status, html: await r.text() }));
    const rawCounts = countRaw(raw.html);
    for (const [k, n] of Object.entries(rawCounts)) if (n !== 1) problems.push(`raw ${k}=${n}`);

    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    const errors = [];
    page.on('console', (m) => { const t = m.text(); if (m.type() === 'error' && /Minified React error|#418|#423|#425|\[hydration\]|hydrat/i.test(t)) errors.push(t.slice(0, 200)); });
    page.on('pageerror', (e) => errors.push(`pageerror: ${String(e.message).slice(0, 200)}`));
    // Continuous watcher installed before any page script runs
    await page.evaluateOnNewDocument((inStock) => {
        window.__badSeen = [];
        const scan = () => {
            const root = document.getElementById('root'); if (!root) return;
            root.querySelectorAll('a[href]').forEach((a) => { const h = a.getAttribute('href'); if (/^\/products\/\d+(\/|\?|$)/.test(h)) window.__badSeen.push(`numeric product link ${h}`); });
            const txt = root.innerText || '';
            const prices = txt.match(/\$\s?0\.\d{2}/g); if (prices) window.__badSeen.push(`sub-$1 price ${prices.slice(0, 3).join(',')}`);
            root.querySelectorAll('a[href^="/products/"]').forEach((a) => {
                const slug = a.getAttribute('href').split('/')[2]?.split('?')[0];
                if (inStock.includes(slug) && /sold out/i.test(a.closest('div,article,li')?.innerText || '')) window.__badSeen.push(`false Sold Out on ${slug}`);
            });
        };
        new MutationObserver(scan).observe(document, { childList: true, subtree: true, characterData: true });
        document.addEventListener('DOMContentLoaded', scan);
    }, inStockSlugs);
    await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 90000 });
    await new Promise((r) => setTimeout(r, 2500));
    const seen = [...new Set(await page.evaluate(() => window.__badSeen))];
    const dom = await page.evaluate((tags) => Object.fromEntries(Object.entries(tags).map(([k, s]) => [k, document.querySelectorAll(s).length])), HEAD_TAGS);
    for (const [k, n] of Object.entries(dom)) if (n !== 1) problems.push(`DOM ${k}=${n}`);
    problems.push(...seen.slice(0, 5), ...errors.slice(0, 3));
    await page.close();
    if (problems.length) failed++;
    console.log(`${problems.length ? 'FAIL' : 'PASS'}  ${route} [${raw.status}]${problems.length ? '  — ' + problems.join(' | ') : ''}`);
}
await browser.close();
server?.close();
console.log(`\n${routes.length - failed}/${routes.length} routes passed (${LIVE ? 'LIVE production' : 'local dist-store'})`);
process.exit(failed ? 1 : 0);
