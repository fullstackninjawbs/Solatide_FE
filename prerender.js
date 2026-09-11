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
    "/pages/affiliate-program",
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
    "/blogs/research-insights/nnmt-inhibition-5-amino-1mq",
    "/blogs/research-insights/retatrutide-vs-semaglutide-research",
    "/pages/what-is-nad-plus",
    "/pages/what-is-tb500",
    "/pages/retatrutide-research-overview",
    "/pages/tirzepatide-research-overview",
    "/pages/cagrilintide-research-overview",
    "/pages/what-is-ss-31",
    "/pages/what-is-semax",
    "/pages/cagrisema-comparison-guide",
    "/pages/cagrisema-research-overview",
    "/pages/what-is-ipamorelin"
];

const distDir = path.resolve(__dirname, 'dist-store');

if (!fs.existsSync(distDir)) {
    console.error(`Directory ${distDir} does not exist. Run npm run build:store first.`);
    process.exit(1);
}

// Save a backup of the pure index.html to use as the template for all routes
const templatePath = path.resolve(distDir, 'template.html');
fs.copyFileSync(path.resolve(distDir, 'index.html'), templatePath);

const app = express();
app.use(express.static(distDir));

// Proxy /api requests to the real backend so the frontend can fetch products during prerendering
app.use('/api', async (req, res) => {
    try {
        const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';
        const fetchRes = await fetch(`${apiUrl}/api${req.url}`, {
            method: req.method,
            headers: {
                ...req.headers,
                host: new URL(apiUrl).host
            }
        });
        const data = await fetchRes.arrayBuffer();
        res.status(fetchRes.status);
        fetchRes.headers.forEach((value, key) => res.setHeader(key, value));
        res.send(Buffer.from(data));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.use((req, res) => {
    res.sendFile(templatePath);
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
        const res = await fetch(`${apiUrl}/api/pages`);
        if (res.ok) {
            const pages = await res.json();
            let count = 0;
            if (Array.isArray(pages)) {
                for (const page of pages) {
                    if (page.slug) {
                        routes.push(`/page/${page.slug}`);
                        count++;
                    }
                }
            }
            console.log(`✅ Added ${count} custom page routes for prerendering!`);
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

                    // If still multiple, keep only the first one
                    const remainingTitles = Array.from(document.querySelectorAll('title'));
                    if (remainingTitles.length > 1) {
                        for (let i = 1; i < remainingTitles.length; i++) {
                            remainingTitles[i].remove();
                        }
                    }
                }

                const metas = Array.from(document.querySelectorAll('meta[name="description"]'));
                if (metas.length > 1) {
                    // Keep the first one, remove the rest
                    for (let i = 1; i < metas.length; i++) {
                        metas[i].remove();
                    }
                }

                const canonicals = Array.from(document.querySelectorAll('link[rel="canonical"]'));
                if (canonicals.length > 1) {
                    for (let i = 1; i < canonicals.length; i++) {
                        canonicals[i].remove();
                    }
                }
            });

            let html = await page.content();

            // Determine file path
            let routeDir;
            if (route === '/') {
                routeDir = distDir;
            } else {
                // Remove leading slash for joining
                routeDir = path.join(distDir, route.substring(1));
                fs.mkdirSync(routeDir, { recursive: true });
            }

            const filePath = path.join(routeDir, 'index.html');
            fs.writeFileSync(filePath, html);
            console.log(`✅ Saved ${filePath}`);

            await page.close();
        } catch (error) {
            console.error(`❌ Failed to prerender ${route}:`, error.message);
        }
    }

    await browser.close();
    server.close();

    // Clean up our temporary template file
    if (fs.existsSync(templatePath)) {
        fs.unlinkSync(templatePath);
    }

    // Generate sitemap.xml
    try {
        console.log('Generating sitemap.xml...');
        // Fallback to the production URL if the environment variable isn't set (since this runs in Node, not the browser, window.location is unavailable)
        const baseUrl = process.env.VITE_STOREFRONT_URL || 'https://solatidebiosciences.com.au';
        const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route === '/' ? '' : route}</loc>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml);
        console.log('✅ Saved sitemap.xml');
    } catch (e) {
        console.error('❌ Failed to generate sitemap.xml:', e.message);
    }

    console.log('🎉 Prerendering complete!');
});
