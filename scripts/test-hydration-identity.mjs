#!/usr/bin/env node
/**
 * Hydration regression test (adapted from audit-2026-10-12/tests/identity.mjs).
 *
 * Serves a built dist-store with nginx-like semantics (try_files $uri $uri.html =404 →
 * 404.html with status 404), holds the entry bundle until every prerendered element in #root is
 * tagged, releases it and then asserts per route:
 *   - ≥ 95% of prerendered elements are still the same DOM nodes after hydration
 *   - no spinner (.animate-spin) ever appears inside #root
 *   - no hydration / recoverable errors (console.error or page errors)
 *   - <head> has exactly one title, canonical, meta description and robots meta
 *     (404 route: HTTP 404, exactly one robots meta containing noindex, no canonical)
 *
 * GET /api/* is proxied read-only to the production public API (components may refresh data in
 * the background); everything else is served from the local build.
 *
 * Usage: node scripts/test-hydration-identity.mjs [--dist dist-store] [route ...]
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const distArgIdx = argv.indexOf('--dist');
const distDir = path.resolve(__dirname, '..', distArgIdx >= 0 ? argv[distArgIdx + 1] : (process.env.DIST_STORE_DIR || 'dist-store'));
const routeArgs = argv.filter((a, i) => !a.startsWith('--') && (distArgIdx < 0 || i !== distArgIdx + 1));
const API_UPSTREAM = process.env.HYDRATION_API_UPSTREAM || 'https://solatidebiosciences.com.au';
const MIN_RETAINED = 95;

const pickProducts = () => {
    const dir = path.join(distDir, 'products');
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.html')).sort() : [];
    const preferred = ['bpc-157-10mg', 'retatrutide-5mg', 'semaglutide-5mg'];
    const chosen = preferred.filter((p) => files.includes(`${p}.html`));
    for (const f of files) if (chosen.length < 3 && !chosen.includes(f.replace(/\.html$/, ''))) chosen.push(f.replace(/\.html$/, ''));
    return chosen.map((s) => `/products/${s}`);
};

const NOT_FOUND_PROBE = '/this-page-does-not-exist';
const routes = routeArgs.length ? routeArgs : [
    '/',
    ...pickProducts(),
    '/collections/all',
    '/collections/glp-1-metabolic-peptides',
    '/pages/faq',
    '/pages/about',
    '/pages/what-is-cjc-1295',
    '/pages/sitemap',
    '/pages/concentration-calculator',
    '/pages/coa',
    '/pages/refund-policy',
    NOT_FOUND_PROBE,
];

// ─── nginx-like static server ────────────────────────────────────────────────────
const MIME = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
    '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
    '.xml': 'application/xml', '.txt': 'text/plain', '.woff2': 'font/woff2',
};
const safeFile = (rel) => {
    const p = path.resolve(distDir, `.${rel}`);
    if (!p.startsWith(distDir)) return null;
    try { return fs.statSync(p).isFile() ? p : null; } catch { return null; }
};
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname.startsWith('/api/')) {
        if (req.method !== 'GET') { res.writeHead(405); res.end(); return; }
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
    if (file) {
        res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache' });
        fs.createReadStream(file).pipe(res);
        return;
    }
    const nf = safeFile('/404.html');
    res.writeHead(404, { 'content-type': MIME['.html'] });
    if (nf) fs.createReadStream(nf).pipe(res); else res.end('not found');
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;

// ─── Test ────────────────────────────────────────────────────────────────────────
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const rows = [];
for (const route of routes) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (msg) => {
        if (msg.type() !== 'error') return;
        const t = msg.text();
        if (/Failed to load resource/i.test(t)) return; // blocked/absent third-party assets
        errors.push(t.slice(0, 300));
    });
    let release;
    const gate = new Promise((r) => { release = r; });
    await page.setRequestInterception(true);
    page.on('request', async (req) => {
        const u = req.url();
        if (!u.startsWith(BASE)) { req.abort().catch(() => {}); return; } // no third parties in tests
        if (/\/assets\/index-[^/]+\.js$/.test(u)) await gate;
        req.continue().catch(() => {});
    });
    let status = null;
    page.on('response', (r) => { if (r.url() === `${BASE}${route}`) status = r.status(); });
    const nav = page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 90000 }).catch((e) => errors.push(`goto: ${e.message}`));
    await page.waitForSelector('#root > *', { timeout: 30000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 500));
    const before = await page.evaluate(() => {
        const root = document.getElementById('root');
        const all = root.querySelectorAll('*');
        all.forEach((el) => { el.__pre = 1; });
        window.__removed = 0;
        window.__spinnerSeen = !!root.querySelector('.animate-spin');
        new MutationObserver((ms) => {
            for (const m of ms) {
                m.removedNodes.forEach((n) => {
                    if (n.nodeType !== 1) return;
                    window.__removed += 1 + n.querySelectorAll('*').length;
                    (window.__removedSamples = window.__removedSamples || []).push(`<${n.tagName.toLowerCase()} class="${(n.getAttribute('class') || '').slice(0, 60)}"> in <${m.target.tagName.toLowerCase()} class="${(m.target.getAttribute('class') || '').slice(0, 60)}"> "${(n.textContent || '').trim().slice(0, 50)}"`);
                });
            }
            if (root.querySelector('.animate-spin')) window.__spinnerSeen = true;
        }).observe(root, { childList: true, subtree: true });
        return { count: all.length };
    });
    release();
    await nav;
    await new Promise((r) => setTimeout(r, 2500));
    const after = await page.evaluate(() => {
        const root = document.getElementById('root');
        const all = [...root.querySelectorAll('*')];
        const head = document.head;
        const metas = (n) => [...head.querySelectorAll(`meta[name="${n}"]`)].map((m) => m.getAttribute('content'));
        return {
            count: all.length,
            kept: all.filter((e) => e.__pre).length,
            removed: window.__removed,
            spinner: window.__spinnerSeen,
            titles: head.querySelectorAll('title').length,
            title: document.title,
            canonicals: [...head.querySelectorAll('link[rel="canonical"]')].map((l) => l.getAttribute('href')),
            descriptions: metas('description').length,
            removedSamples: (window.__removedSamples || []).slice(0, 8),
            robots: metas('robots'),
        };
    });
    const pct = before.count ? Math.round((1000 * after.kept) / before.count) / 10 : 0;
    const hydrationErrors = errors.filter((e) => /hydrat|#418|#423|#425|recoverable|Minified React error/i.test(e));
    const isNotFound = route === NOT_FOUND_PROBE;
    const failures = [];
    if (isNotFound) {
        if (status !== 404) failures.push(`status ${status} (expected 404)`);
        if (after.robots.length !== 1 || !/noindex/i.test(after.robots[0] || '')) failures.push(`robots ${JSON.stringify(after.robots)}`);
        if (after.canonicals.length !== 0) failures.push(`canonical present ${JSON.stringify(after.canonicals)}`);
        if (after.titles !== 1) failures.push(`titles=${after.titles}`);
    } else {
        if (status !== 200) failures.push(`status ${status}`);
        if (pct < MIN_RETAINED) failures.push(`retained ${pct}% < ${MIN_RETAINED}%`);
        if (after.titles !== 1) failures.push(`titles=${after.titles}`);
        if (after.canonicals.length !== 1) failures.push(`canonicals=${after.canonicals.length}`);
        if (after.descriptions !== 1) failures.push(`descriptions=${after.descriptions}`);
        if (after.robots.length !== 1 || /noindex/i.test(after.robots[0] || '')) failures.push(`robots ${JSON.stringify(after.robots)}`);
    }
    if (after.spinner) failures.push('spinner shown');
    if (hydrationErrors.length) failures.push(`hydration errors: ${hydrationErrors.length}`);
    if (process.env.HYDRATION_DEBUG && after.removedSamples.length) console.log(route + ' removed subtrees:', after.removedSamples);
    rows.push({ route, status, pre: before.count, post: after.count, kept: after.kept, pct, removed: after.removed, spinner: after.spinner, hydErr: hydrationErrors.length, head: `t${after.titles}/c${after.canonicals.length}/d${after.descriptions}/r${after.robots.length}`, ok: failures.length === 0, failures, errors });
    await page.close();
}
await browser.close();
server.close();

// ─── Report ──────────────────────────────────────────────────────────────────────
console.log('\n| Route | HTTP | Prerendered nodes | Retained | % | Removed | Spinner | Hydration errors | Head t/c/d/r | Result |');
console.log('|---|---|---|---|---|---|---|---|---|---|');
for (const r of rows) {
    console.log(`| ${r.route} | ${r.status} | ${r.pre} | ${r.kept} | ${r.pct}% | ${r.removed} | ${r.spinner ? 'YES' : 'no'} | ${r.hydErr} | ${r.head} | ${r.ok ? 'PASS' : `FAIL: ${r.failures.join('; ')}`} |`);
}
const failed = rows.filter((r) => !r.ok);
for (const r of failed) {
    if (r.errors.length) console.log(`\n${r.route} console errors:\n  ${r.errors.slice(0, 5).join('\n  ')}`);
}
console.log(`\n${rows.length - failed.length}/${rows.length} routes passed.`);
process.exit(failed.length ? 1 : 0);
