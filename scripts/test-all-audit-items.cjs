const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function runComprehensiveAudit() {
  console.log('====================================================');
  console.log('🚀 RUNNING COMPREHENSIVE AUDIT VERIFICATION SUITE');
  console.log('====================================================\n');

  // ----------------------------------------------------------------
  // PART 1: ALL 28 PRODUCTS - SCHEMA AVAILABILITY & PRICE FORMATTING
  // ----------------------------------------------------------------
  console.log('📦 PART 1: VALIDATING ALL PRERENDERED PRODUCT SCHEMAS...\n');
  const productsDir = path.resolve(__dirname, '../dist-store/products');
  const productFiles = fs.readdirSync(productsDir).filter(f => f.endsWith('.html'));

  let productErrors = 0;
  console.log(`Found ${productFiles.length} product HTML files in dist-store/products:\n`);

  productFiles.forEach((file) => {
    const content = fs.readFileSync(path.join(productsDir, file), 'utf8');
    
    // Find all JSON-LD scripts and pick the Product one
    const scripts = content.match(/<script type="application\/ld\+json">(.*?)<\/script>/gs) || [];
    let productSchema = null;
    for (const s of scripts) {
      const jsonStr = s.replace(/<script type="application\/ld\+json">|<\/script>/g, '');
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed['@type'] === 'Product') {
          productSchema = parsed;
          break;
        }
      } catch {}
    }

    if (!productSchema) {
      console.error(`❌ [${file}] No Product JSON-LD schema found!`);
      productErrors++;
      return;
    }

    try {
      const offer = productSchema.offers;
      const availability = offer?.availability;
      const price = offer?.price;
      const currency = offer?.priceCurrency;

      const isPriceValid = /^\d+\.\d{2}$/.test(price);
      const isAud = currency === 'AUD';
      const isAvailabilityValid = availability === 'https://schema.org/InStock' || availability === 'https://schema.org/OutOfStock' || availability === 'https://schema.org/BackOrder';

      if (!isPriceValid || !isAud || !isAvailabilityValid) {
        console.error(`❌ [${file}] Invalid schema values: price="${price}", currency="${currency}", availability="${availability}"`);
        productErrors++;
      } else {
        const statusBadge = availability.includes('InStock') ? '✅ InStock' : (availability.includes('BackOrder') ? '📦 BackOrder' : '⚠️ OutOfStock');
        console.log(`  ${file.replace('.html', '').padEnd(50)} | ${statusBadge.padEnd(12)} | Price: ${price} ${currency}`);
      }
    } catch (e) {
      console.error(`❌ [${file}] Failed to parse Product JSON-LD:`, e.message);
      productErrors++;
    }
  });

  if (productErrors === 0) {
    console.log(`\n🎉 PART 1 PASSED: All ${productFiles.length} products have valid InStock/OutOfStock status and clean numeric AUD prices!\n`);
  } else {
    console.error(`\n❌ PART 1 FAILED: Found ${productErrors} product schema issues.\n`);
  }

  // ----------------------------------------------------------------
  // PART 2: METADATA DEDUPLICATION - RAW HTML & HYDRATED DOM
  // ----------------------------------------------------------------
  console.log('----------------------------------------------------');
  console.log('📄 PART 2: VALIDATING METADATA DEDUPLICATION ON CMS PAGES...\n');

  const cmsTestSlugs = [
    'what-is-cjc-1295',
    'what-is-retatrutide',
    'glp1-receptor-pathways',
    'cagrilintide-research-overview',
    'what-is-bpc-157'
  ];

  console.log('A) RAW HTML HEAD INSPECTION:');
  cmsTestSlugs.forEach((slug) => {
    const filePath = path.resolve(__dirname, `../dist-store/pages/${slug}.html`);
    if (!fs.existsSync(filePath)) {
      console.error(`  ❌ Raw HTML file not found: pages/${slug}.html`);
      return;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    const headMatch = html.match(/<head>(.*?)<\/head>/s);
    const head = headMatch ? headMatch[1] : html;

    const titles = (head.match(/<title[^>]*>.*?<\/title>/gi) || []).length;
    const descriptions = (head.match(/<meta\s+name=["']description["'][^>]*>/gi) || []).length;
    const canonicals = (head.match(/<link\s+rel=["']canonical["'][^>]*>/gi) || []).length;
    const ogTitles = (head.match(/<meta\s+property=["']og:title["'][^>]*>/gi) || []).length;
    const ogTypes = (head.match(/<meta\s+property=["']og:type["'][^>]*>/gi) || []).length;

    console.log(`  pages/${slug}.html -> Titles: ${titles}, Descriptions: ${descriptions}, Canonicals: ${canonicals}, OG Titles: ${ogTitles}, OG Types: ${ogTypes}`);

    if (titles !== 1 || descriptions !== 1 || canonicals !== 1 || ogTitles !== 1) {
      console.error(`    ❌ DUPLICATE METADATA FOUND in raw HTML for ${slug}!`);
    } else {
      console.log(`    ✅ Perfect single metadata in raw HTML.`);
    }
  });

  console.log('\nB) HYDRATED BROWSER DOM INSPECTION (Puppeteer):');
  // Start simple static HTTP server for dist-store
  const http = require('http');
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    let file = path.join(__dirname, '../dist-store', reqPath);
    if (!fs.existsSync(file) && !file.endsWith('.html')) file += '.html';
    if (!fs.existsSync(file)) file = path.join(__dirname, '../dist-store/200.html');
    
    const ext = path.extname(file);
    const contentType = ext === '.html' ? 'text/html' : ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'text/plain';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(file));
  });

  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;

  const browser = await puppeteer.launch({ headless: 'new' });
  for (const slug of cmsTestSlugs) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}/pages/${slug}`, { waitUntil: 'networkidle0' });

    const domCounts = await page.evaluate(() => {
      const titles = document.querySelectorAll('title').length;
      const descriptions = document.querySelectorAll('meta[name="description"]').length;
      const canonicals = document.querySelectorAll('link[rel="canonical"]').length;
      const ogTitles = document.querySelectorAll('meta[property="og:title"]').length;
      const ogTypes = document.querySelectorAll('meta[property="og:type"]').length;
      return { titles, descriptions, canonicals, ogTitles, ogTypes };
    });

    console.log(`  [Hydrated DOM] /pages/${slug} -> Titles: ${domCounts.titles}, Descriptions: ${domCounts.descriptions}, Canonicals: ${domCounts.canonicals}, OG Titles: ${domCounts.ogTitles}`);

    if (domCounts.titles > 1 || domCounts.descriptions > 1 || domCounts.canonicals > 1 || domCounts.ogTitles > 1) {
      console.error(`    ❌ DUPLICATE METADATA IN HYDRATED DOM on ${slug}!`);
    } else {
      console.log(`    ✅ Perfectly deduplicated in hydrated DOM.`);
    }
    await page.close();
  }

  await browser.close();
  server.close();

  // ----------------------------------------------------------------
  // PART 3: NGINX CONFIG AUDIT FOR /_t/c/v3/ AND LEGACY ROUTES
  // ----------------------------------------------------------------
  console.log('\n----------------------------------------------------');
  console.log('🌐 PART 3: NGINX CONFIGURATION AUDIT FOR /_t/c/v3/ AND POLICIES...\n');

  const nginxFile = path.resolve(__dirname, '../../solatide.nginx.conf');
  const nginxContent = fs.readFileSync(nginxFile, 'utf8');

  const checks = [
    { label: '410 handler for /_t/ tracking links', pattern: /location\s+\^\~\s+\/_t\/\s*\{\s*return\s+410/ },
    { label: '301 redirect for /policies/shipping-policy', pattern: /location\s*=\s*\/policies\/shipping-policy\s*\{\s*return\s+301/ },
    { label: '301 redirect for /policies/refund-policy', pattern: /location\s*=\s*\/policies\/refund-policy\s*\{\s*return\s+301/ },
    { label: '301 redirect for /policies/privacy-policy', pattern: /location\s*=\s*\/policies\/privacy-policy\s*\{\s*return\s+301/ },
    { label: '301 redirect for /policies/terms-of-service', pattern: /location\s*=\s*\/policies\/terms-of-service\s*\{\s*return\s+301/ },
    { label: '301 redirect for /collections/frontpage', pattern: /location\s*=\s*\/collections\/frontpage\s*\{\s*return\s+301/ },
    { label: '410 handler for legacy .atom feeds', pattern: /location\s+~\*\s+\^\/collections\/.*\.atom\$\s*\{\s*return\s+410/ },
  ];

  checks.forEach(check => {
    if (check.pattern.test(nginxContent)) {
      console.log(`  ✅ ${check.label}`);
    } else {
      console.error(`  ❌ MISSING: ${check.label}`);
    }
  });

  console.log('\n====================================================');
  console.log('🏁 AUDIT VERIFICATION COMPLETE!');
  console.log('====================================================');
}

runComprehensiveAudit().catch(console.error);
