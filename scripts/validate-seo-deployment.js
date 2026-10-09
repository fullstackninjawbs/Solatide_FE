import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = process.env.DIST_STORE_DIR
  ? path.resolve(process.env.DIST_STORE_DIR)
  : path.resolve(__dirname, '../dist-store');

console.log(`🔍 Running Post-Build SEO Deployment Validation Suite on: ${distDir}\n`);

let errors = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    errors++;
  }
}

// 1. Validate Homepage (dist-store/index.html & home.html)
console.log('1. Validating Pre-rendered Homepage...');
const indexPath = path.join(distDir, 'index.html');
const homePath = path.join(distDir, 'home.html');

assert(fs.existsSync(indexPath), 'dist-store/index.html exists');
assert(fs.existsSync(homePath), 'dist-store/home.html exists');

if (fs.existsSync(indexPath)) {
  const html = fs.readFileSync(indexPath, 'utf-8');
  assert(html.includes('canonical'), 'Homepage HTML contains canonical link tag');
  assert(html.includes('https://solatidebiosciences.com.au'), 'Canonical points to production origin https://solatidebiosciences.com.au');
  assert(!html.includes('http://localhost'), 'Homepage HTML contains ZERO localhost references');
  assert(html.includes('<a href='), 'Homepage HTML contains pre-rendered internal <a href="..."> links');

  const canonicalCount = (html.match(/<link\s+rel="canonical"/gi) || []).length;
  const titleCount = (html.match(/<title/gi) || []).length;
  const descCount = (html.match(/<meta\s+name="description"/gi) || []).length;
  const ogTitleCount = (html.match(/<meta\s+property="og:title"/gi) || []).length;

  assert(canonicalCount === 1, `Homepage HTML contains EXACTLY 1 canonical tag (found: ${canonicalCount})`);
  assert(titleCount === 1, `Homepage HTML contains EXACTLY 1 title tag (found: ${titleCount})`);
  assert(descCount === 1, `Homepage HTML contains EXACTLY 1 meta description tag (found: ${descCount})`);
  assert(ogTitleCount <= 1, `Homepage HTML contains at most 1 og:title tag (found: ${ogTitleCount})`);
}

// 2. Validate Application Fallback Shells (dist-store/200.html, checkout.html)
console.log('\n2. Validating Application Fallback Shells...');
assert(fs.existsSync(path.join(distDir, '200.html')), 'dist-store/200.html SPA fallback shell exists');
assert(fs.existsSync(path.join(distDir, 'checkout.html')), 'dist-store/checkout.html application shell exists');

// 3. Validate Sitemap (dist-store/sitemap.xml)
console.log('\n3. Validating XML Sitemap...');
const sitemapPath = path.join(distDir, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'dist-store/sitemap.xml exists');

if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, 'utf-8');
  const locMatches = xml.match(/<loc>(.*?)<\/loc>/g) || [];
  const urls = locMatches.map(m => m.replace(/<\/?loc>/g, ''));
  const uniqueUrls = new Set(urls);
  
  assert(urls.length > 0, `Sitemap contains ${urls.length} total URL entries`);
  assert(urls.length === uniqueUrls.size, 'Sitemap contains ZERO duplicate URLs');
  assert(!xml.includes('/404'), 'Sitemap excludes /404 utility pages');
  assert(!xml.includes('/checkout'), 'Sitemap excludes private /checkout pages');
}

// 4. Validate Asset Resolution (/assets/logo.webp & favicon.png)
console.log('\n4. Validating Static Assets...');
assert(fs.existsSync(path.join(distDir, 'favicon.png')), 'dist-store/favicon.png exists for Googlebot compatibility');
assert(fs.existsSync(path.join(distDir, 'assets/logo.webp')), 'dist-store/assets/logo.webp exists for Schema Organization logo');

// 5. Validate HTML sitemap links (/pages/sitemap)
console.log('\n5. Validating HTML Sitemap Links...');
const htmlSitemapPath = path.join(distDir, 'pages/sitemap.html');
if (fs.existsSync(htmlSitemapPath)) {
  const htmlContent = fs.readFileSync(htmlSitemapPath, 'utf-8');
  assert(!htmlContent.includes('/policies/shipping-policy'), 'HTML sitemap contains ZERO legacy /policies/shipping-policy links');
  assert(!htmlContent.includes('/policies/refund-policy'), 'HTML sitemap contains ZERO legacy /policies/refund-policy links');
  assert(htmlContent.includes('/pages/shipping-policy'), 'HTML sitemap contains updated /pages/shipping-policy link');
  assert(htmlContent.includes('/pages/refund-policy'), 'HTML sitemap contains updated /pages/refund-policy link');
}

// 6. Validate Product Schema Offer Prices (Google Search Console & Merchant Listings compliance)
console.log('\n6. Validating Product Schema Offer Prices...');
const sampleProductPath = path.join(distDir, 'products/retatrutide-10mg.html');
if (fs.existsSync(sampleProductPath)) {
  const htmlContent = fs.readFileSync(sampleProductPath, 'utf-8');
  const priceMatch = htmlContent.match(/"price":\s*"([^"]+)"/);
  const currencyMatch = htmlContent.match(/"priceCurrency":\s*"([^"]+)"/);
  
  assert(priceMatch !== null, 'Product schema contains "price" field');
  if (priceMatch) {
    const priceVal = priceMatch[1];
    assert(/^\d+\.\d{2}$/.test(priceVal), `Product schema price "${priceVal}" is a pure 2-decimal floating point string`);
  }
  assert(currencyMatch !== null && currencyMatch[1] === 'AUD', 'Product schema priceCurrency is "AUD"');
}

// 7. Validate Single H1 Across ALL Pre-rendered Pages (Screaming Frog / SEO Best Practice)
console.log('\n7. Validating Single H1 Heading Across ALL Pre-rendered Pages...');
function getHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.name.endsWith('.html') && !file.name.includes('200.html') && !file.name.includes('checkout.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(distDir);
let multiH1Pages = [];
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const h1Matches = content.match(/<h1[^>]*>/gi) || [];
  if (h1Matches.length > 1) {
    multiH1Pages.push({ file: path.relative(distDir, file), count: h1Matches.length });
  }
}

assert(multiH1Pages.length === 0, `All ${htmlFiles.length} pre-rendered pages have at most 1 <h1> tag (violations: ${multiH1Pages.map(p => `${p.file} (${p.count})`).join(', ') || 'none'})`);

// 8. Validate Open Graph & Twitter Metadata on Research Pages
console.log('\n8. Validating Open Graph & Twitter Metadata on Research Pages...');
const researchSlugs = [
  'tirzepatide-research-overview',
  'what-is-bpc-157',
  'what-is-ghk-cu',
  'what-is-mots-c',
  'what-is-selank',
  'glp-1-research-overview',
  'cagrisema-vs-semaglutide',
  'cagrisema-vs-tirzepatide',
  'cagrisema-vs-retatrutide',
  'cjc-1295-vs-ipamorelin',
  'cjc-1295-vs-tesamorelin',
  'selank-vs-semax',
  'mots-c-vs-ss-31',
  'bpc-157-vs-kpv',
  'nad-plus-vs-mots-c',
  'tesamorelin-vs-ipamorelin',
  'what-is-tesamorelin',
  'what-is-kpv'
];

let missingOgPages = [];
for (const slug of researchSlugs) {
  const pPath = path.join(distDir, 'pages', `${slug}.html`);
  if (fs.existsSync(pPath)) {
    const content = fs.readFileSync(pPath, 'utf-8');
    const hasOgTitle = content.includes('property="og:title"');
    const hasOgDesc = content.includes('property="og:description"');
    const hasOgUrl = content.includes('property="og:url"');
    const hasOgImage = content.includes('property="og:image"');
    const hasTwTitle = content.includes('name="twitter:title"');
    const hasTwCard = content.includes('name="twitter:card"');
    if (!hasOgTitle || !hasOgDesc || !hasOgUrl || !hasOgImage || !hasTwTitle || !hasTwCard) {
      missingOgPages.push(slug);
    }
  }
}
assert(missingOgPages.length === 0, `All 18 research pages have complete Open Graph and Twitter metadata (missing: ${missingOgPages.join(', ') || 'none'})`);

// 9. Validate WebP Image Signature for /assets/logo.webp
console.log('\n9. Validating Binary Format for /assets/logo.webp...');
const logoPath = path.join(distDir, 'assets/logo.webp');
if (fs.existsSync(logoPath)) {
  const buf = fs.readFileSync(logoPath);
  const isWebP = buf.length >= 12 && buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP';
  assert(isWebP, `/assets/logo.webp begins with RIFF/WEBP header (not PNG bytes). File size: ${buf.length} bytes`);
}

// 10. Validate Policy Page Metadata (Deduplication & Missing Descriptions)
console.log('\n10. Validating Policy & CMS Page Metadata...');
const dataSharingPath = path.join(distDir, 'pages/data-sharing-opt-out.html');
if (fs.existsSync(dataSharingPath)) {
  const content = fs.readFileSync(dataSharingPath, 'utf-8');
  const canonicalCount = (content.match(/<link\s+rel="canonical"/gi) || []).length;
  const titleCount = (content.match(/<title/gi) || []).length;
  const ogTitleCount = (content.match(/property="og:title"/gi) || []).length;
  assert(canonicalCount === 1, `/pages/data-sharing-opt-out has EXACTLY 1 canonical tag (found: ${canonicalCount})`);
  assert(titleCount === 1, `/pages/data-sharing-opt-out has EXACTLY 1 title tag (found: ${titleCount})`);
  assert(ogTitleCount <= 1, `/pages/data-sharing-opt-out has at most 1 og:title tag (found: ${ogTitleCount})`);
}

const bpcTbPath = path.join(distDir, 'pages/bpc-157-vs-tb-500.html');
if (fs.existsSync(bpcTbPath)) {
  const content = fs.readFileSync(bpcTbPath, 'utf-8');
  const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  assert(descMatch && descMatch[1].trim().length > 10, `/pages/bpc-157-vs-tb-500 has non-empty meta description: "${descMatch ? descMatch[1] : 'missing'}"`);
  assert(content.includes('property="og:description"'), '/pages/bpc-157-vs-tb-500 contains og:description');
}

console.log('\n==================================================');
if (errors === 0) {
  console.log('🎉 ALL SEO DEPLOYMENT VALIDATION CHECKS PASSED 100%!');
  process.exit(0);
} else {
  console.error(`🚨 DISCREPANCIES DETECTED: ${errors} check(s) failed.`);
  process.exit(1);
}
