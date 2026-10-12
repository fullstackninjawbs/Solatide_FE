/* global process */
/**
 * Post-prerender SEO/deployment validator. Exits non-zero on ANY failure.
 *
 * Checks (dist-store or $DIST_STORE_DIR):
 *  - sitemap.xml: valid, no duplicates, every <loc> has a prerendered file, no URL is the source of an
 *    nginx `return 301` in ../solatide.nginx.conf, no /404 /checkout /admin /order URLs
 *  - every indexable prerendered HTML file: exactly 1 <title> (not "Not Found"/404), 1 meta description,
 *    1 canonical equal to its own URL, 1 robots meta without noindex, exactly 1 <h1>, valid JSON-LD
 *  - every HTML file: no empty canonical, embedded JSON blobs contain no literal "</script" and parse,
 *    no localhost references
 *  - 404.html: exactly one robots meta (noindex), no canonical
 *  - SPA shells (200.html, checkout.html): noindex; no admin shells in the store build
 *  - precompressed .gz/.br of each HTML file decompress to the same bytes (no stale pre-prerender shells)
 *  - expected product/CMS/collection URLs are derived from the files themselves (no hardcoded slugs)
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = process.env.DIST_STORE_DIR
  ? path.resolve(process.env.DIST_STORE_DIR)
  : path.resolve(__dirname, '../dist-store');
const nginxConf = process.env.NGINX_CONF || path.resolve(__dirname, '../../solatide.nginx.conf');
const ORIGIN = 'https://solatidebiosciences.com.au';

console.log(`🔍 SEO deployment validation: ${distDir}\n`);

let errors = 0;
let checks = 0;
const fail = (msg) => { errors++; console.error(`  ❌ ${msg}`); };
const assert = (cond, msg) => { checks++; if (!cond) fail(msg); };

if (!fs.existsSync(distDir)) {
  console.error(`dist directory not found: ${distDir}`);
  process.exit(1);
}

const all = (re, s) => [...s.matchAll(re)];
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[2] ?? m[3]) : null;
};
const decode = (s) => s && s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const headOf = (html) => html.split(/<\/head>/i)[0];
const inspect = (html) => {
  const head = headOf(html);
  const metas = all(/<meta\b[^>]*>/gi, head).map((m) => m[0]);
  return {
    titles: all(/<title[^>]*>([\s\S]*?)<\/title>/gi, head).map((m) => decode(m[1].trim())),
    descs: metas.filter((t) => /\sname\s*=\s*["']description["']/i.test(t)).map((t) => attr(t, 'content')),
    robots: metas.filter((t) => /\sname\s*=\s*["']robots["']/i.test(t)).map((t) => attr(t, 'content')),
    canon: all(/<link\b[^>]*rel\s*=\s*["']canonical["'][^>]*>/gi, html).map((m) => attr(m[0], 'href')),
    h1: all(/<h1\b/gi, html).length,
    ld: all(/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, html).map((m) => m[1]),
    json: all(/<script[^>]*type\s*=\s*["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi, html).map((m) => m[1]),
  };
};

// ─── Collect HTML files ─────────────────────────────────────────────────────────
const htmlFiles = [];
const walk = (dir) => {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) { if (ent.name !== 'assets') walk(full); } else if (ent.name.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(distDir);
const rel = (f) => path.relative(distDir, f).split(path.sep).join('/');
const SHELLS = new Set(['200.html', 'checkout.html']);
const urlForFile = (r) => (r === 'index.html' ? ORIGIN : `${ORIGIN}/${r.replace(/\.html$/, '')}`);

// ─── 1. Required files ──────────────────────────────────────────────────────────
console.log('1. Required files');
for (const f of ['index.html', '404.html', '200.html', 'checkout.html', 'sitemap.xml', 'robots.txt', 'favicon.png', 'assets/logo.webp']) {
  assert(fs.existsSync(path.join(distDir, f)), `${f} exists`);
}
assert(!fs.existsSync(path.join(distDir, 'admin.html')) && !fs.existsSync(path.join(distDir, 'admin')), 'no admin shells in the store build (M-19)');
const adminChunks = fs.existsSync(path.join(distDir, 'assets')) ? fs.readdirSync(path.join(distDir, 'assets')).filter((f) => /^(AdminLayout|AdminRoutes|Dashboard|ProductForm|OrderList)-/.test(f)) : [];
assert(adminChunks.length === 0, `no admin chunks in assets (found: ${adminChunks.join(', ') || 'none'})`);
assert(!fs.existsSync(path.join(distDir, 'mock_import.csv')), 'mock_import.csv is not published (L-7)');
const logoPath = path.join(distDir, 'assets/logo.webp');
if (fs.existsSync(logoPath)) {
  const buf = fs.readFileSync(logoPath);
  assert(buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP', '/assets/logo.webp is a real WebP');
}

// ─── 2. nginx 301 sources ───────────────────────────────────────────────────────
const redirectSources = new Set();
if (fs.existsSync(nginxConf)) {
  // Only the storefront server block (the hub block redirects "/" to /admin on its own host).
  const conf = fs.readFileSync(nginxConf, 'utf8').split(/\n\s*server\s*\{/).find((b) => b.includes('dist-store-current')) || '';
  for (const m of conf.matchAll(/location\s*=\s*(\S+)\s*\{\s*return\s+30[18]\b/g)) redirectSources.add(m[1]);
} else {
  console.warn(`  ⚠️  nginx config not found at ${nginxConf}; skipping redirect-source check`);
}

// ─── 3. Sitemap ─────────────────────────────────────────────────────────────────
console.log('2. sitemap.xml');
let sitemapUrls = [];
const sitemapPath = path.join(distDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  assert(/^<\?xml[^>]*\?>\s*<urlset\b/.test(xml) && /<\/urlset>\s*$/.test(xml), 'sitemap.xml is a urlset document');
  sitemapUrls = all(/<loc>([^<]+)<\/loc>/g, xml).map((m) => m[1].trim());
  const lastmods = all(/<lastmod>([^<]+)<\/lastmod>/g, xml).map((m) => m[1]);
  assert(sitemapUrls.length > 0, `sitemap has URLs (${sitemapUrls.length})`);
  assert(new Set(sitemapUrls).size === sitemapUrls.length, 'sitemap has no duplicate URLs');
  assert(lastmods.every((d) => /^\d{4}-\d{2}-\d{2}/.test(d)), 'every <lastmod> is an ISO date');
  for (const u of sitemapUrls) {
    if (!u.startsWith(ORIGIN)) { fail(`sitemap URL not on ${ORIGIN}: ${u}`); continue; }
    const p = u.slice(ORIGIN.length) || '/';
    if (/^\/(404|checkout|admin|order)(\/|$)/.test(p)) fail(`sitemap contains private/utility URL ${u}`);
    const file = p === '/' ? path.join(distDir, 'index.html') : path.join(distDir, `${p.slice(1)}.html`);
    if (!fs.existsSync(file)) fail(`sitemap URL has no prerendered file: ${u}`);
    if (redirectSources.has(p)) fail(`sitemap URL is an nginx 301 source: ${u}`);
  }
  checks += sitemapUrls.length * 3;
}

// ─── 4. Per-file checks ─────────────────────────────────────────────────────────
console.log('3. Prerendered HTML files');
const sitemapSet = new Set(sitemapUrls);
let indexableCount = 0;
for (const file of htmlFiles) {
  const r = rel(file);
  if (r === 'home.html') continue; // legacy duplicate of index.html (nginx 301s /home.html → /)
  const html = fs.readFileSync(file, 'utf8');
  const info = inspect(html);
  checks++;
  if (html.includes('http://localhost') || html.includes('http://127.0.0.1')) fail(`${r}: contains localhost URL`);
  if (info.canon.some((c) => !c)) fail(`${r}: empty canonical href`);
  for (const blob of info.json) {
    if (/<\/script/i.test(blob)) fail(`${r}: embedded JSON contains a literal "</script"`);
    try { JSON.parse(blob); } catch { fail(`${r}: embedded JSON does not parse`); }
  }

  if (SHELLS.has(r)) {
    if (!(info.robots.length === 1 && /noindex/i.test(info.robots[0]))) fail(`${r}: SPA shell must have exactly one noindex robots meta (${JSON.stringify(info.robots)})`);
    if (/<div id="root"[^>]*>\s*<[a-z]/i.test(html)) fail(`${r}: SPA shell must have an empty #root`);
    continue;
  }
  if (r === '404.html') {
    if (!(info.robots.length === 1 && /noindex/i.test(info.robots[0]))) fail(`404.html: expected exactly one noindex robots meta (${JSON.stringify(info.robots)})`);
    if (info.canon.length !== 0) fail('404.html: must not have a canonical link');
    if (info.titles.length !== 1) fail(`404.html: ${info.titles.length} titles`);
    continue;
  }

  // Indexable page
  indexableCount++;
  const url = urlForFile(r);
  if (info.titles.length !== 1) fail(`${r}: ${info.titles.length} <title> tags`);
  if (info.titles.some((t) => /not found|\b404\b/i.test(t))) fail(`${r}: "Not Found" title "${info.titles[0]}"`);
  if (info.descs.length !== 1 || !(info.descs[0] || '').trim()) fail(`${r}: ${info.descs.length} meta descriptions (need exactly 1 non-empty)`);
  if (info.canon.length !== 1) fail(`${r}: ${info.canon.length} canonical links`);
  else if (info.canon[0] !== url) fail(`${r}: canonical ${info.canon[0]} != ${url}`);
  if (info.robots.length !== 1) fail(`${r}: ${info.robots.length} robots metas`);
  else if (/noindex/i.test(info.robots[0])) fail(`${r}: robots noindex on an indexable page`);
  if (info.h1 !== 1) fail(`${r}: ${info.h1} <h1> tags`);
  for (const ld of info.ld) {
    try {
      const j = JSON.parse(ld);
      const items = Array.isArray(j) ? j : [j];
      for (const it of items) {
        if (!it['@context'] || !it['@type']) fail(`${r}: JSON-LD missing @context/@type`);
        if (it['@type'] === 'Product' && it.offers) {
          if (!/^\d+\.\d{2}$/.test(String(it.offers.price)) || Number(it.offers.price) <= 0) fail(`${r}: Product offer price invalid (${it.offers.price})`);
          if (it.offers.priceCurrency !== 'AUD') fail(`${r}: Product priceCurrency ${it.offers.priceCurrency}`);
        }
      }
    } catch { fail(`${r}: invalid JSON-LD`); }
  }
  if (sitemapUrls.length && !sitemapSet.has(url)) fail(`${r}: indexable page missing from sitemap (${url})`);
  // Legacy policy links must point at canonical /pages/* (L-3)
  if (/href="\/policies\//.test(html)) fail(`${r}: links to legacy /policies/* URLs`);
}
console.log(`  checked ${htmlFiles.length} HTML files (${indexableCount} indexable)`);

// ─── 5. Precompressed variants are fresh (L-13) ─────────────────────────────────
console.log('4. Precompressed HTML');
for (const file of htmlFiles) {
  const src = fs.readFileSync(file);
  for (const [ext, fn] of [['.gz', zlib.gunzipSync], ['.br', zlib.brotliDecompressSync]]) {
    const p = `${file}${ext}`;
    if (!fs.existsSync(p)) continue;
    checks++;
    try {
      if (!fn(fs.readFileSync(p)).equals(src)) fail(`${rel(p)} is stale (does not match ${rel(file)})`);
    } catch { fail(`${rel(p)} does not decompress`); }
  }
}

console.log('\n==================================================');
if (errors === 0) {
  console.log(`🎉 SEO deployment validation passed (${checks} checks, ${sitemapUrls.length} sitemap URLs, ${indexableCount} indexable files).`);
  process.exit(0);
}
console.error(`🚨 ${errors} validation failure(s).`);
process.exit(1);
