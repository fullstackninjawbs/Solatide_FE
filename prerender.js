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

const app = express();
app.use(express.static(distDir));
app.use((req, res) => {
    res.sendFile(path.resolve(distDir, 'index.html'));
});

const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`Started local server on port ${port} for prerendering...`);
    
    const browser = await puppeteer.launch({ headless: 'new' });
    
    for (const route of routes) {
        try {
            console.log(`Prerendering ${route}...`);
            const page = await browser.newPage();
            await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle0' });
            
            // Wait an extra second to guarantee react-helmet has mutated the head
            await new Promise(r => setTimeout(r, 1000));
            
            const html = await page.content();
            
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
    console.log('🎉 Prerendering complete!');
});
