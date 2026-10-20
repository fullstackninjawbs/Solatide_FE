/* global process, Buffer */
/**
 * Solatide storefront prerender (Puppeteer).
 *
 * Captures each public route as static HTML that the client can HYDRATE (not re-render):
 *  - window.__PRERENDER__ = true while capturing, so client-only UI (popups, rotating banners,
 *    reveal animations, analytics) renders its deterministic first-render state.
 *  - Every public GET /api/* response the route used is embedded (slimmed + script-safe) as
 *    <script type="application/json" id="__INITIAL_ROUTE_DATA__">, and components initialise
 *    their state from it synchronously, so the first client render equals the captured DOM.
 *  - Adjacent text nodes inside #root get an empty comment separator (like React SSR's <!-- -->)
 *    so they do not merge when the HTML is parsed again.
 *
 * Failure policy (M-17): in deploy mode (default) ANY failed route — navigation error, page error,
 * console error, non-2xx API response, "Not Found"/404 title or noindex robots on an indexable
 * route — makes the process exit non-zero after listing the failures. Use --allow-failures for
 * local experiments. The static src/data/products.js catalogue is never used. The production API
 * is only used when PRERENDER_API_FALLBACK=1 (read-only public GETs).
 *
 * Usage:
 *   node prerender.js                     # deploy mode
 *   node prerender.js --allow-failures    # local experiments
 *   DIST_STORE_DIR=releases/x node prerender.js
 *   PRERENDER_ROUTES=/,/products/bpc-157-10mg node prerender.js --allow-failures   # subset
 */
import puppeteer from 'puppeteer';
import express from 'express';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARGS = new Set(process.argv.slice(2));
const ALLOW_FAILURES = ARGS.has('--allow-failures');
const PROD_ORIGIN = 'https://solatidebiosciences.com.au';

try {
    process.loadEnvFile(path.resolve(__dirname, '.env'));
} catch { /* optional */ }

const LOCAL_API = (process.env.PRERENDER_API_URL || process.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_FALLBACK = process.env.PRERENDER_API_FALLBACK === '1';
const CONCURRENCY = Math.max(1, Math.min(8, parseInt(process.env.PRERENDER_CONCURRENCY || '4', 10) || 4));

const distDir = path.resolve(__dirname, process.env.DIST_STORE_DIR || 'dist-store');
if (!fs.existsSync(distDir)) {
    console.error(`Directory ${distDir} does not exist. Run build first.`);
    process.exit(1);
}

// ─── Shared with src/utils/routeData.js (keep in sync) ───────────────────────────
const INTERNAL_FIELDS = new Set([
    'costPerItem', 'tagadaSync', 'syncStatus', 'pendingBatchDocs', 'slugHistory', 'hsCode',
    'lowStockThreshold', 'cloudinarySync', 'tagadaProductId', 'tagadaPriceId', 'barcode', 'tagadaUpdatedAt', '__v',
    'email', 'customerEmail', 'reviewerEmail', 'verificationToken', 'verifyToken', 'ipAddress',
]);
const CARD_FIELDS = [
    '_id', 'id', 'slug', 'name', 'price', 'compareAtPrice', 'image', 'imageUrl',
    'inStock', 'status', 'publishStatus', 'rating', 'ratingCount', 'reviewsCount',
    'sku', 'stockQuantity', 'stockQty', 'inventoryPolicy', 'continueSellingWhenOutOfStock',
];
const VARIANT_FIELDS = [
    '_id', 'id', 'sku', 'title', 'name', 'price', 'compareAtPrice', 'stockQty',
    'inventoryPolicy', 'continueSellingWhenOutOfStock', 'option1', 'option2', 'option3', 'tagadaVariantId',
];
const stripInternal = (v) => {
    if (Array.isArray(v)) return v.map(stripInternal);
    if (v && typeof v === 'object') {
        const out = {};
        for (const k of Object.keys(v)) if (!INTERNAL_FIELDS.has(k)) out[k] = stripInternal(v[k]);
        return out;
    }
    return v;
};
const pick = (o, fields) => {
    const out = {};
    for (const f of fields) if (o[f] !== undefined) out[f] = o[f];
    return out;
};
const toCardDto = (p) => {
    if (!p || typeof p !== 'object') return p;
    const out = pick(p, CARD_FIELDS);
    if (Array.isArray(p.images) && p.images.length > 0) out.images = [stripInternal(p.images[0])];
    if (Array.isArray(p.variants)) out.variants = p.variants.map((v) => pick(v || {}, VARIANT_FIELDS));
    return out;
};
// Product LIST endpoints are rendered as cards only → embed card DTOs; everything else is stripped.
const slimPayload = (key, body) => {
    if (/^\/api\/products\?/.test(key) && body && body.data && Array.isArray(body.data.products)) {
        return { success: body.success, data: { products: body.data.products.map(toCardDto) } };
    }
    return stripInternal(body);
};

/** Script-safe JSON for <script type="application/json"> (M-1 / HYD-5). */
export const serializeForScript = (obj) => JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

// ─── API helpers (read-only public GETs) ─────────────────────────────────────────
let apiBase = LOCAL_API;

const apiGet = async (p) => {
    const res = await fetch(`${apiBase}${p}`, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`GET ${p} -> HTTP ${res.status}`);
    return res.json();
};

const resolveApiBase = async () => {
    try {
        const res = await fetch(`${LOCAL_API}/api/products?limit=1`, { signal: AbortSignal.timeout(4000) });
        if (res.ok) return LOCAL_API;
        throw new Error(`HTTP ${res.status}`);
    } catch (e) {
        if (API_FALLBACK) {
            console.warn(`⚠️  Local API ${LOCAL_API} unreachable (${e.message}); PRERENDER_API_FALLBACK=1 → using ${PROD_ORIGIN} (read-only GETs).`);
            return PROD_ORIGIN;
        }
        console.error(`❌ Local API ${LOCAL_API} unreachable (${e.message}). Set PRERENDER_API_URL, start the API, or set PRERENDER_API_FALLBACK=1 to read from the production public API.`);
        process.exit(1);
    }
};

const fetchAllProducts = async () => {
    const all = [];
    for (let page = 1; page <= 50; page++) {
        const body = await apiGet(`/api/products?page=${page}&limit=50`);
        const list = body?.data?.products || body?.products || (Array.isArray(body?.data) ? body.data : []);
        all.push(...list);
        const pages = body?.data?.pagination?.pages || body?.pages || 1;
        if (page >= pages || list.length === 0) break;
    }
    return all;
};

// ─── Route list ──────────────────────────────────────────────────────────────────
// React-routed pages (src/routes/AppRoutes.jsx). CMS pages, products and collections come from the API.
const STATIC_ROUTES = [
    '/',
    '/collections/all',
    '/pages/about',
    '/pages/concentration-calculator',
    '/pages/faq',
    '/pages/shipping-policy',
    '/pages/privacy-policy',
    '/pages/coa',
    '/pages/terms-of-services',
    '/pages/refund-policy',
];
const NOT_FOUND_ROUTE = '/404';
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ROUTE_RE = /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$|^\/$/;

/** Resolve the output file for a route, refusing anything that escapes distDir (M-23 path traversal). */
const outputPathFor = (route) => {
    if (typeof route !== 'string' || !ROUTE_RE.test(route)) throw new Error(`Refusing unsafe route "${route}"`);
    const rel = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
    const resolved = path.resolve(distDir, rel);
    if (!resolved.startsWith(distDir + path.sep)) throw new Error(`Route "${route}" resolves outside distDir`);
    return resolved;
};

// ─── Static server with GET-only /api proxy ──────────────────────────────────────
const templatePath = path.resolve(distDir, 'index.html');
const template = fs.readFileSync(templatePath, 'utf-8');
if (template.includes('id="__INITIAL_ROUTE_DATA__"') || /<div id="root">\s*<[a-z]/i.test(template)) {
    console.error('❌ dist index.html is already prerendered. Run a fresh vite build before prerendering.');
    process.exit(1);
}

const app = express();
app.set('etag', false); // no 304s: every capture must see full API bodies
app.use('/api', async (req, res) => {
    if (req.method !== 'GET') {
        // Never forward writes (analytics, forms…) from the prerender to any API.
        res.status(405).json({ success: false, message: 'prerender proxy is read-only' });
        return;
    }
    try {
        const upstream = await fetch(`${apiBase}/api${req.url}`, { headers: { accept: 'application/json' } });
        const buf = Buffer.from(await upstream.arrayBuffer());
        res.status(upstream.status);
        const ct = upstream.headers.get('content-type');
        if (ct) res.setHeader('content-type', ct);
        res.send(buf);
    } catch (e) {
        res.status(502).json({ success: false, message: e.message });
    }
});
app.use(express.static(distDir, { index: false, redirect: false, extensions: false }));
app.use((req, res) => res.type('html').send(template));

// ─── Capture one route ───────────────────────────────────────────────────────────
const BLOCKED_TYPES = new Set(['image', 'font', 'media']);

async function captureRoute(browser, port, route) {
    const origin = `http://localhost:${port}`;
    const page = await browser.newPage();
    const problems = [];
    const apiResponses = new Map(); // key -> { status, text }
    const pending = new Set();
    try {
        await page.setViewport({ width: 1366, height: 900 });
        await page.setCacheEnabled(false);
        await page.evaluateOnNewDocument(() => { window.__PRERENDER__ = true; });
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const url = req.url();
            if (!url.startsWith(origin) || BLOCKED_TYPES.has(req.resourceType())) {
                req.abort('blockedbyclient').catch(() => {});
                return;
            }
            req.continue().catch(() => {});
        });
        page.on('response', (resp) => {
            const url = resp.url();
            if (!url.startsWith(`${origin}/api/`) || resp.request().method() !== 'GET') return;
            const u = new URL(url);
            const key = `${u.pathname}${u.search}`;
            const p = resp.text().then(
                (text) => { apiResponses.set(key, { status: resp.status(), text }); },
                () => { apiResponses.set(key, { status: resp.status(), text: null }); },
            ).finally(() => pending.delete(p));
            pending.add(p);
        });
        page.on('requestfailed', (req) => {
            const url = req.url();
            if (url.startsWith(`${origin}/api/`)) problems.push(`API request failed: ${url.slice(origin.length)} (${req.failure()?.errorText})`);
        });
        page.on('pageerror', (err) => problems.push(`page error: ${err.message}`));
        page.on('console', (msg) => {
            if (msg.type() !== 'error') return;
            const text = msg.text();
            const locUrl = msg.location()?.url || '';
            // Requests we deliberately blocked (third parties, images, fonts) are not app errors.
            if (/Failed to load resource/i.test(text) && !locUrl.startsWith(`${origin}/api/`)) return;
            problems.push(`console error: ${text.slice(0, 300)}`);
        });

        const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle0', timeout: 60000 });
        if (!response || !response.ok()) problems.push(`navigation HTTP ${response ? response.status() : 'n/a'}`);
        await page.waitForFunction(
            () => document.querySelector('#root > *') && !document.querySelector('#root .animate-spin'),
            { timeout: 20000 },
        ).catch(() => problems.push('page did not settle (spinner still visible or empty #root)'));
        await Promise.allSettled([...pending]);
        await new Promise((r) => setTimeout(r, 250));

        const state = await page.evaluate((prerenderedPath) => {
            const isReactOwned = (el) => Object.keys(el).some((k) => k.startsWith('__reactFiber$') || k.startsWith('__reactMarker$') || k.startsWith('__reactProps$'));
            const dedupe = (selector) => {
                const els = [...document.head.querySelectorAll(selector)];
                if (els.length <= 1) return;
                const owned = els.filter(isReactOwned);
                const keep = owned.length ? owned[owned.length - 1] : els[els.length - 1];
                els.forEach((el) => { if (el !== keep) el.remove(); });
            };

            // 1. Runtime-injected third-party scripts (GTM inserts gtm.js) must not be duplicated.
            document.querySelectorAll('script[src*="googletagmanager.com/gtm.js"]').forEach((s) => s.remove());
            // 2. Head: exactly one of each SEO tag (React-owned wins over the static template one).
            ['title', 'meta[name="description"]', 'link[rel="canonical"]', 'meta[name="robots"]',
                'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:url"]',
                'meta[property="og:image"]', 'meta[property="og:type"]', 'meta[name="twitter:card"]',
                'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'meta[name="twitter:image"]'].forEach(dedupe);
            // 3. Non-blocking font CSS: Puppeteer captured the post-onload media="all".
            const fonts = document.getElementById('gfonts-css');
            if (fonts) fonts.setAttribute('media', 'print');
            // 4. Separate adjacent text nodes (React SSR emits <!-- --> for the same reason).
            const root = document.getElementById('root');
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            const texts = [];
            while (walker.nextNode()) texts.push(walker.currentNode);
            let separators = 0;
            for (const t of texts) {
                if (t.nextSibling && t.nextSibling.nodeType === Node.TEXT_NODE && t.parentNode.nodeName !== 'SCRIPT' && t.parentNode.nodeName !== 'STYLE') {
                    t.parentNode.insertBefore(document.createComment(' '), t.nextSibling);
                    separators++;
                }
            }
            // 5. Mark which path this markup belongs to (main.jsx hydrates only on that path).
            root.setAttribute('data-prerendered-path', prerenderedPath);

            const metas = (name) => [...document.head.querySelectorAll(`meta[name="${name}"]`)].map((m) => m.getAttribute('content'));
            return {
                title: document.title,
                robots: metas('robots'),
                descriptions: metas('description'),
                canonicals: [...document.head.querySelectorAll('link[rel="canonical"]')].map((l) => l.getAttribute('href')),
                h1: document.querySelectorAll('h1').length,
                separators,
                rootChildren: root.children.length,
            };
        }, route);

        // API responses: all must be 2xx JSON; embed the ones the route used.
        const routeData = {};
        for (const [key, { status, text }] of apiResponses) {
            if (status < 200 || status >= 300) {
                problems.push(`API ${key} -> HTTP ${status}`);
                continue;
            }
            try {
                routeData[key] = slimPayload(key, JSON.parse(text));
            } catch {
                problems.push(`API ${key} returned non-JSON`);
            }
        }

        const isNotFoundRoute = route === NOT_FOUND_ROUTE;
        const looksNotFound = /not found|404/i.test(state.title) || state.robots.some((r) => /noindex/i.test(r || ''));
        if (!isNotFoundRoute) {
            if (looksNotFound) problems.push(`renders a not-found/noindex state (title="${state.title}", robots=${JSON.stringify(state.robots)})`);
            if (state.robots.length !== 1) problems.push(`expected exactly 1 robots meta, found ${state.robots.length}`);
            if (state.canonicals.length !== 1 || !state.canonicals[0]) problems.push(`expected exactly 1 non-empty canonical, found ${JSON.stringify(state.canonicals)}`);
            if (state.descriptions.length !== 1) problems.push(`expected exactly 1 meta description, found ${state.descriptions.length}`);
        } else if (!state.robots.some((r) => /noindex/i.test(r || ''))) {
            problems.push('404 page is missing noindex');
        }
        if (state.rootChildren === 0) problems.push('#root is empty');

        let html = await page.content();
        html = finaliseHtml(html, routeData, port);
        return { route, html, state, problems, routeData };
    } catch (e) {
        problems.push(`exception: ${e.message}`);
        return { route, html: null, state: null, problems, routeData: {} };
    } finally {
        await page.close().catch(() => {});
    }
}

function finaliseHtml(html, routeData, port) {
    // Production origin instead of the local capture server.
    html = html.replace(new RegExp(`http://localhost:${port}`, 'g'), PROD_ORIGIN).replace(/http:\/\/127\.0\.0\.1:\d+/g, PROD_ORIGIN);

    // Embed per-route initial data (script-safe JSON) before </head>.
    const keys = Object.keys(routeData);
    if (keys.length > 0) {
        const payload = serializeForScript({ v: 1, data: routeData });
        html = html.replace('</head>', `<script type="application/json" id="__INITIAL_ROUTE_DATA__">${payload}</script>\n</head>`);
    }

    // Readable <head> only. NEVER touch <body>: whitespace inside #root would break hydration.
    const headEnd = html.indexOf('</head>');
    if (headEnd > 0) {
        let head = html.slice(0, headEnd);
        head = head
            .replace(/(<\/(?:title|script|style)>)(<)/gi, '$1\n$2')
            .replace(/(<(?:meta|link)\b[^>]*>)(<)/gi, '$1\n$2');
        html = `${head}\n${html.slice(headEnd)}`;
    }
    return html;
}

// ─── Main ────────────────────────────────────────────────────────────────────────
const main = async () => {
    apiBase = await resolveApiBase();
    console.log(`Prerender mode: ${ALLOW_FAILURES ? 'EXPERIMENT (--allow-failures)' : 'DEPLOY (fail on any route failure)'}; API: ${apiBase}`);

    const lastmod = new Map(); // route -> ISO date
    const routes = [...STATIC_ROUTES];
    const addRoute = (r, updatedAt) => {
        if (!routes.includes(r)) routes.push(r);
        if (updatedAt && !Number.isNaN(Date.parse(updatedAt))) lastmod.set(r, new Date(updatedAt).toISOString().slice(0, 10));
    };

    const products = await fetchAllProducts();
    let productCount = 0;
    for (const p of products) {
        if (p.publishStatus && p.publishStatus !== 'active') continue;
        if (!p.slug || !SLUG_RE.test(p.slug)) {
            console.warn(`⚠️  Skipping product with missing/unsafe slug: ${JSON.stringify(p.slug || p._id)}`);
            continue;
        }
        addRoute(`/products/${p.slug}`, p.updatedAt);
        productCount++;
    }
    console.log(`✅ ${productCount} product routes`);

    const pagesBody = await apiGet('/api/v1/pages');
    const pages = Array.isArray(pagesBody) ? pagesBody : (pagesBody.data || []);
    for (const pg of pages) {
        if (!pg.slug || !SLUG_RE.test(pg.slug)) {
            console.warn(`⚠️  Skipping CMS page with missing/unsafe slug: ${JSON.stringify(pg.slug || pg._id)}`);
            continue;
        }
        addRoute(`/pages/${pg.slug}`, pg.updatedAt);
    }
    console.log(`✅ ${pages.length} CMS page routes`);

    const colBody = await apiGet('/api/products/collections');
    const collections = Array.isArray(colBody) ? colBody : (colBody.data || []);
    for (const c of collections) {
        if (!c.slug || !SLUG_RE.test(c.slug)) continue;
        addRoute(`/collections/${c.slug}`, c.updatedAt);
    }
    console.log(`✅ ${collections.length} collection routes`);

    // Subset for experiments.
    let targetRoutes = [...routes, NOT_FOUND_ROUTE];
    if (process.env.PRERENDER_ROUTES) {
        const subset = process.env.PRERENDER_ROUTES.split(',').map((s) => s.trim()).filter(Boolean);
        targetRoutes = subset;
    }
    // Validate every route's output path up-front (path traversal guard).
    const unsafe = [];
    for (const r of targetRoutes) {
        try { outputPathFor(r); } catch (e) { unsafe.push(e.message); }
    }
    if (unsafe.length) {
        console.error(`❌ Unsafe routes:\n  ${unsafe.join('\n  ')}`);
        process.exit(1);
    }

    const server = app.listen(0);
    await new Promise((r) => server.once('listening', r));
    const port = server.address().port;
    console.log(`Local capture server on port ${port}; ${targetRoutes.length} routes; concurrency ${CONCURRENCY}`);

    const browser = await puppeteer.launch({
        headless: true,
        // --no-sandbox is required when running as root in CI/containers; prefer an unprivileged user.
        args: process.env.PRERENDER_SANDBOX === '1' ? [] : ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const results = [];
    let next = 0;
    await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
        while (next < targetRoutes.length) {
            const route = targetRoutes[next++];
            let result = await captureRoute(browser, port, route);
            if (result.problems.some((p) => /exception|did not settle|navigation/.test(p))) {
                // One retry for transient timeouts.
                result = await captureRoute(browser, port, route);
            }
            results.push(result);
            console.log(`${result.problems.length ? '❌' : '✅'} ${route}${result.problems.length ? `\n     - ${result.problems.join('\n     - ')}` : ''}`);
        }
    }));
    await browser.close();
    server.close();

    // ─── Write files ───────────────────────────────────────────────────────────
    const written = [];
    for (const r of results) {
        if (!r.html) continue;
        const file = outputPathFor(r.route);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, r.html);
        if (r.route === '/') fs.writeFileSync(path.join(distDir, 'home.html'), r.html); // legacy nginx fallback
        written.push(r);
    }

    // SPA shells for never-prerendered routes (checkout, order status, review verification).
    const shell = template.replace('<title>', '<meta name="robots" content="noindex, nofollow" />\n  <title>');
    fs.writeFileSync(path.join(distDir, '200.html'), shell);
    fs.writeFileSync(path.join(distDir, 'checkout.html'), shell);
    // App shell for a live product/collection/page that has no prerendered file yet (created or
    // renamed, rebuild still running). Served by nginx only via X-Accel-Redirect from the redirect
    // resolver. NO robots meta: the app sets title/robots/canonical itself, so Google indexes it.
    fs.writeFileSync(path.join(distDir, 'app-shell.html'), template);
    // Static "back shortly" page nginx shows with HTTP 503 while the API is unreachable, so Google
    // retries the URL later instead of dropping it as a 404. Self-contained: no app JS, no API.
    fs.writeFileSync(path.join(distDir, '503.html'), `<!doctype html>
<html lang="en-AU">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>Back shortly | Solatide Biosciences</title>
  <style>
    body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f8fafc;color:#1e293b;font-family:Arial,Helvetica,sans-serif;text-align:center;padding:24px;box-sizing:border-box}
    main{max-width:460px}
    img{width:180px;height:auto;margin-bottom:28px}
    h1{color:#1a3a6b;font-size:26px;margin:0 0 12px}
    p{font-size:16px;line-height:1.6;margin:0 0 24px;color:#475569}
    a{display:inline-block;background:#1F54A1;color:#fff;padding:12px 26px;border-radius:40px;text-decoration:none}
  </style>
</head>
<body>
  <main>
    <img src="/assets/logo.webp" alt="Solatide Biosciences" width="180" height="60" />
    <h1>We'll be right back</h1>
    <p>This page is temporarily unavailable. Please try again in a minute.</p>
    <a href="">Try again</a>
  </main>
</body>
</html>
`);
    // The admin SPA is served by hub.solatidebiosciences.com.au only (M-19): never emit admin shells.
    for (const stale of ['admin.html', path.join('admin', 'login.html')]) {
        fs.rmSync(path.join(distDir, stale), { force: true });
    }
    fs.rmSync(path.join(distDir, 'admin'), { recursive: true, force: true });
    fs.rmSync(path.join(distDir, 'template.html'), { force: true });

    // ─── Sitemap: successfully written, indexable routes only ───────────────────
    const failed = results.filter((r) => r.problems.length > 0);
    const indexable = written
        .filter((r) => r.problems.length === 0 && r.route !== NOT_FOUND_ROUTE)
        .filter((r) => !r.state.robots.some((x) => /noindex/i.test(x || '')))
        .map((r) => r.route)
        .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
    if (!process.env.PRERENDER_ROUTES) {
        const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((route) => `  <url>
    <loc>${PROD_ORIGIN}${route === '/' ? '' : route}</loc>${lastmod.has(route) ? `
    <lastmod>${lastmod.get(route)}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>
`;
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml);
        console.log(`✅ sitemap.xml: ${indexable.length} URLs (${[...lastmod.keys()].filter((r) => indexable.includes(r)).length} with lastmod)`);
    }

    // ─── Precompressed variants (L-13): regenerate from the FINAL files ─────────
    const compressTargets = [];
    const walk = (dir) => {
        for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, ent.name);
            if (ent.isDirectory()) walk(full);
            else if (/\.(html|xml)$/.test(ent.name)) compressTargets.push(full);
        }
    };
    walk(distDir);
    for (const file of compressTargets) {
        fs.rmSync(`${file}.gz`, { force: true });
        fs.rmSync(`${file}.br`, { force: true });
        const buf = fs.readFileSync(file);
        fs.writeFileSync(`${file}.gz`, zlib.gzipSync(buf, { level: 9 }));
        fs.writeFileSync(`${file}.br`, zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }));
    }
    console.log(`✅ Regenerated .gz/.br for ${compressTargets.length} HTML/XML files`);

    const summary = { routes: results.length, written: written.length, failed: failed.length, sitemapUrls: indexable.length };
    fs.writeFileSync(path.join(distDir, '..', '.prerender-report.json'), JSON.stringify({ summary, failed: failed.map((f) => ({ route: f.route, problems: f.problems })) }, null, 2));
    console.log(`\nPrerender summary: ${JSON.stringify(summary)}`);
    if (failed.length) {
        console.error(`\n❌ ${failed.length} route(s) failed:\n${failed.map((f) => `  ${f.route}\n    - ${f.problems.join('\n    - ')}`).join('\n')}`);
        if (!ALLOW_FAILURES) {
            console.error('\nDeploy mode: failing the build. (Use --allow-failures for local experiments.)');
            process.exit(1);
        }
    }
    console.log('🎉 Prerendering complete!');
};

main().catch((e) => {
    console.error('❌ Prerender crashed:', e);
    process.exit(1);
});
