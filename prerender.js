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
    
    // Dynamically fetch product routes from the backend API
    try {
        try {
            process.loadEnvFile(path.resolve(__dirname, '.env'));
        } catch (e) {}
        const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';
        
        console.log(`Fetching dynamic product routes from ${apiUrl}...`);
        const res = await fetch(`${apiUrl}/api/products`);
        const data = await res.json();
        const products = Array.isArray(data) ? data : (data.products || data.data || []);
        
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
                
                // 2. Keep ONLY the tag managed by react-helmet-async (data-rh="true")
                const titles = Array.from(document.querySelectorAll('title'));
                if (titles.length > 1) {
                    const helmetTitle = titles.find(t => t.hasAttribute('data-rh'));
                    const titleToKeep = helmetTitle || titles[titles.length - 1]; // fallback to last if no helmet
                    titles.forEach(t => { if (t !== titleToKeep) t.remove(); });
                }
                
                const metas = Array.from(document.querySelectorAll('meta[name="description"]'));
                if (metas.length > 1) {
                    const helmetMeta = metas.find(m => m.hasAttribute('data-rh'));
                    const metaToKeep = helmetMeta || metas[metas.length - 1];
                    metas.forEach(m => { if (m !== metaToKeep) m.remove(); });
                }
                
                const canonicals = Array.from(document.querySelectorAll('link[rel="canonical"]'));
                if (canonicals.length > 1) {
                    const helmetCanonical = canonicals.find(c => c.hasAttribute('data-rh'));
                    const canonicalToKeep = helmetCanonical || canonicals[canonicals.length - 1];
                    canonicals.forEach(c => { if (c !== canonicalToKeep) c.remove(); });
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
    
    console.log('🎉 Prerendering complete!');
});
