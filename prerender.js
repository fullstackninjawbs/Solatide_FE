import puppeteer from 'puppeteer';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
    "/",
    "/collections/dermal-pigmentation-research",
    "/pages/research-peptides-guide",
    "/collections/all",
    "/collections/research-solutions",
    "/pages/research-library",
    "/pages/research-compound-database",
    "/pages/faq",
    "/pages/contact-us",
    "/pages/refund-policy",
    "/pages/terms-of-services",
    "/pages/privacy-policy",
    "/pages/shipping-policy",
    "/collections/tissue-cellular-research-peptides",
    "/pages/concentration-calculator",
    "/pages/coa-lab-testing",
    "/pages/about",
    "/pages/coa",
    "/collections/glp-1-metabolic-peptides",
    "/pages/data-sharing-opt-out",
    "/pages/bpc-157-vs-tb-500",
    "/collections/bundles",
    "/pages/what-is-retatrutide",
    "/pages/what-is-cjc-1295",
    "/pages/semaglutide-research-overview",
    "/pages/what-is-nad-plus",
    "/pages/what-is-tb500",
    "/pages/retatrutide-research-overview",
    "/pages/tirzepatide-research-overview",
    "/pages/cagrilintide-research-overview",
    "/pages/what-is-ss-31",
    "/pages/what-is-semax",
    "/pages/cagrisema-comparison-guide",
    "/pages/cagrisema-research-overview",
    "/pages/what-is-ipamorelin",
    "/pages/what-is-bpc-157",
    "/pages/what-is-ghk-cu",
    "/pages/what-is-mots-c",
    "/pages/what-is-selank",
    "/pages/glp-1-research-overview",
    "/pages/cagrisema-vs-semaglutide",
    "/pages/cagrisema-vs-tirzepatide",
    "/pages/cagrisema-vs-retatrutide",
    "/pages/cjc-1295-vs-ipamorelin",
    "/pages/cjc-1295-vs-tesamorelin",
    "/pages/selank-vs-semax",
    "/pages/mots-c-vs-ss-31",
    "/pages/bpc-157-vs-kpv",
    "/pages/nad-plus-vs-mots-c",
    "/pages/tesamorelin-vs-ipamorelin",
    "/pages/what-is-tesamorelin",
    "/pages/what-is-kpv",
    "/pages/data-sharing-opt-out-1",
    "/pages/research-use-disclaimer",
    "/404"
];

const distDir = path.resolve(__dirname, 'dist-store');

if (!fs.existsSync(distDir)) {
    console.error(`Directory ${distDir} does not exist. Run npm run build:store first.`);
    process.exit(1);
}

// Save a backup of the pure index.html to use as the template for all routes
const templatePath = path.resolve(distDir, 'template.html');
fs.copyFileSync(path.resolve(distDir, 'index.html'), templatePath);
const template = fs.readFileSync(templatePath, 'utf-8');

const app = express();
app.use(express.static(distDir));

// Proxy /api requests to the real backend so the frontend can fetch products during prerendering
app.use('/api', async (req, res) => {
    try {
        const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';
        const proxyHeaders = { ...req.headers };
        delete proxyHeaders['accept-encoding'];
        proxyHeaders.host = new URL(apiUrl).host;

        const fetchRes = await fetch(`${apiUrl}/api${req.url}`, {
            method: req.method,
            headers: proxyHeaders
        });
        const data = await fetchRes.arrayBuffer();
        res.status(fetchRes.status);
        fetchRes.headers.forEach((value, key) => {
            const k = key.toLowerCase();
            if (k !== 'content-encoding' && k !== 'content-length' && k !== 'transfer-encoding') {
                res.setHeader(key, value);
            }
        });
        res.send(Buffer.from(data));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.use((req, res) => {
    // Serve the pristine template from memory instead of reading from disk, 
    // because dist-store/index.html gets overwritten by the prerendered '/' route!
    res.send(template);
});

const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`Started local server on port ${port} for prerendering...`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        process.loadEnvFile(path.resolve(__dirname, '.env'));
    } catch (e) { }
    const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';

    // Dynamically fetch product routes from the backend API
    try {

        console.log(`Fetching dynamic product routes from ${apiUrl}...`);
        const res = await fetch(`${apiUrl}/api/products`);
        const data = await res.json();

        let products = [];
        if (Array.isArray(data)) {
            products = data;
        } else if (data.products && Array.isArray(data.products)) {
            products = data.products;
        } else if (data.data && Array.isArray(data.data.products)) {
            products = data.data.products;
        } else if (data.data && Array.isArray(data.data)) {
            products = data.data;
        }

        let count = 0;
        for (const product of products) {
            if (product.slug) {
                routes.push(`/products/${product.slug}`);
                count++;
            } else if (product.id || product._id) {
                routes.push(`/products/${product.slug || product.id || product._id}`);
                count++;
            }
        }
        console.log(`✅ Added ${count} product routes for prerendering!`);
    } catch (e) {
        console.error('❌ Failed to fetch dynamic product routes from API:', e.message);
        console.error('Ensure your backend server is running on port 5000 during the build!');
    }

    // Dynamically fetch custom pages from the backend API
    try {
        console.log(`Fetching dynamic custom page routes from ${apiUrl}...`);
        let res = await fetch(`${apiUrl}/api/v1/pages`);
        if (!res.ok) {
            res = await fetch(`${apiUrl}/api/pages`);
        }
        if (res.ok) {
            const pages = await res.json();
            let count = 0;
            if (Array.isArray(pages)) {
                for (const page of pages) {
                    if (page.slug) {
                        routes.push(`/pages/${page.slug}`);
                        count++;
                    }
                }
            }
            console.log(`✅ Added ${count} custom page routes for prerendering!`);
        } else {
            console.error(`❌ Failed to fetch dynamic page routes from API (Status ${res.status})`);
        }
    } catch (e) {
        console.error('❌ Failed to fetch dynamic page routes from API:', e.message);
    }

    for (const route of routes) {
        try {
            console.log(`Prerendering ${route}...`);
            const page = await browser.newPage();
            await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle0' });

            // Wait an extra second to guarantee react-helmet has mutated the head
            await new Promise(r => setTimeout(r, 1000));

            // Clean up the DOM before capturing HTML
            await page.evaluate(() => {
                // 1. Remove dynamically injected GTM scripts so they don't duplicate when a user visits the static page
                document.querySelectorAll('script[src*="gtm.js"]').forEach(s => s.remove());

                // 2. Remove default static tags if helmet injected dynamic ones
                const titles = Array.from(document.querySelectorAll('title'));
                if (titles.length > 1) {
                    // The default title from index.html
                    const defaultTitle = titles.find(t => t.textContent.includes('Solatide Biosciences – Research Grade Peptides'));
                    if (defaultTitle) defaultTitle.remove();

                    // If still multiple, keep only the LAST one (which Helmet injects at the end)
                    const remainingTitles = Array.from(document.querySelectorAll('title'));
                    if (remainingTitles.length > 1) {
                        for (let i = 0; i < remainingTitles.length - 1; i++) {
                            remainingTitles[i].remove();
                        }
                    }
                }

                const metas = Array.from(document.querySelectorAll('meta[name="description"]'));
                if (metas.length > 1) {
                    // Keep the LAST one (which Helmet injects), remove the rest
                    for (let i = 0; i < metas.length - 1; i++) {
                        metas[i].remove();
                    }
                }

                const canonicals = Array.from(document.querySelectorAll('link[rel="canonical"]'));
                if (canonicals.length > 1) {
                    for (let i = 0; i < canonicals.length - 1; i++) {
                        canonicals[i].remove();
                    }
                }

                // Tag all SEO elements with data-rh="true" so React Helmet Async hydrates them in place without creating duplicates!
                document.querySelectorAll('title, link[rel="canonical"], meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]').forEach(el => {
                    el.setAttribute('data-rh', 'true');
                });
            });

            let html = await page.content();

            // Deduplicate meta tags, title tags, canonicals, and OpenGraph tags
            const prodOrigin = 'https://solatidebiosciences.com.au';
            html = html.replace(/http:\/\/localhost:\d+/g, prodOrigin);
            html = html.replace(/http:\/\/127\.0\.0\.1:\d+/g, prodOrigin);

            // Replace legacy /policies/ URLs with canonical /pages/ URLs
            html = html
                .replace(/href="\/policies\/shipping-policy"/gi, 'href="/pages/shipping-policy"')
                .replace(/href="\/policies\/refund-policy"/gi, 'href="/pages/refund-policy"')
                .replace(/href="\/policies\/terms-of-service"/gi, 'href="/pages/terms-of-services"')
                .replace(/href="\/policies\/privacy-policy"/gi, 'href="/pages/privacy-policy"');

            // Deduplicate title tags (keep LAST)
            const titleMatches = [...html.matchAll(/<title[^>]*>.*?<\/title>/gi)];
            if (titleMatches.length > 1) {
                const lastTitle = titleMatches[titleMatches.length - 1][0];
                html = html.replace(/<title[^>]*>.*?<\/title>/gi, '');
                html = html.replace('</head>', `  ${lastTitle}\n</head>`);
            }

            // Deduplicate canonicals and meta tags (keep LAST)
            const metaPatterns = [
                /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/gi,
                /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gi,
                /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/gi,
                /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/gi,
                /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/gi,
                /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/gi,
                /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/gi,
                /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/gi,
                /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/gi,
            ];

            for (const pattern of metaPatterns) {
                const matches = [...html.matchAll(pattern)];
                if (matches.length > 1) {
                    const lastMatch = matches[matches.length - 1][0];
                    html = html.replace(pattern, '');
                    html = html.replace('</head>', `  ${lastMatch}\n</head>`);
                }
            }

            // Format HTML head & structural elements with clean newlines for readable View Source (Ctrl + U)
            html = html.replace(/(<\/(?:title|meta|link|script|style|header|nav|main|section|article|footer|div|p|h1|h2|h3|h4|h5|h6|ul|ol|li)>)(<)/gi, '$1\n$2');
            html = html.replace(/(<meta[^>]*>)(<)/gi, '$1\n$2');
            html = html.replace(/(<link[^>]*>)(<)/gi, '$1\n$2');
            html = html.replace(/(<head[^>]*>)/gi, '$1\n');
            html = html.replace(/(<\/head>)/gi, '\n$1\n');
            html = html.replace(/(<body[^>]*>)/gi, '$1\n');
            html = html.replace(/(<\/body>)/gi, '\n$1\n');

            // Determine file path
            let filePath;
            if (route === '/') {
                // Save as home.html AND index.html so default Nginx setups serve the full prerendered homepage with internal links
                filePath = path.join(distDir, 'home.html');
                fs.writeFileSync(path.join(distDir, 'index.html'), html);
            } else {
                // Save as clean flat file (e.g. /collections/all -> distDir/collections/all.html)
                // This prevents Nginx from treating routes as directories and issuing 301 redirects to trailing slashes!
                const cleanRoute = route.startsWith('/') ? route.substring(1) : route;
                const parentDir = path.join(distDir, path.dirname(cleanRoute));
                fs.mkdirSync(parentDir, { recursive: true });
                filePath = path.join(distDir, `${cleanRoute}.html`);
            }

            fs.writeFileSync(filePath, html);
            console.log(`✅ Saved ${filePath}`);

            await page.close();
        } catch (error) {
            console.error(`❌ Failed to prerender ${route}:`, error.message);
        }
    }

    await browser.close();
    server.close();

    // Save 200.html, checkout.html, and admin application shells
    if (fs.existsSync(templatePath)) {
        const shellContent = fs.readFileSync(templatePath, 'utf-8');
        fs.writeFileSync(path.resolve(distDir, '200.html'), shellContent);
        fs.writeFileSync(path.resolve(distDir, 'checkout.html'), shellContent);

        const adminDir = path.resolve(distDir, 'admin');
        fs.mkdirSync(adminDir, { recursive: true });
        fs.writeFileSync(path.resolve(distDir, 'admin.html'), shellContent);
        fs.writeFileSync(path.resolve(adminDir, 'login.html'), shellContent);

        fs.unlinkSync(templatePath);
        console.log('✅ Created 200.html, checkout.html, and admin shells as SPA fallbacks');
    }

    // Generate sitemap.xml
    try {
        console.log('Generating sitemap.xml...');
        const baseUrl = process.env.VITE_STOREFRONT_URL || 'https://solatidebiosciences.com.au';

        // Exclude utility, admin, 404, and non-canonical routes
        const excludedRoutes = new Set(['/404', '/404.html', '/checkout', '/admin', '/order']);
        
        // Deduplicate and filter canonical routes
        const canonicalRoutes = Array.from(new Set(routes)).filter(route => {
            if (!route || typeof route !== 'string') return false;
            if (excludedRoutes.has(route) || route.startsWith('/admin') || route.startsWith('/checkout') || route.startsWith('/order')) {
                return false;
            }
            return true;
        });

        const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${canonicalRoutes.map(route => `  <url>
    <loc>${baseUrl}${route === '/' ? '' : route}</loc>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml);
        console.log(`✅ Saved sitemap.xml with ${canonicalRoutes.length} unique canonical URLs`);
    } catch (e) {
        console.error('❌ Failed to generate sitemap.xml:', e.message);
    }

    console.log('🎉 Prerendering complete!');
});
