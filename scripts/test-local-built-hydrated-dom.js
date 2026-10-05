import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist-store');

const app = express();

// Proxy /api requests to the running backend
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
        res.status(500).json({ error: e.message });
    }
});

app.use(express.static(distDir));

import fs from 'fs';

// Fallback to route.html or 200.html
app.use((req, res) => {
  let cleanRoute = req.path;
  if (cleanRoute.endsWith('/')) cleanRoute = cleanRoute.slice(0, -1);
  if (!cleanRoute) cleanRoute = '/index';

  const filePath = path.join(distDir, `${cleanRoute}.html`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(distDir, '200.html'));
  }
});

const PORT = 4567;
const server = app.listen(PORT, async () => {
  console.log(`🚀 Testing Local Built Storefront Hydrated DOM on http://localhost:${PORT}...\n`);
  const browser = await puppeteer.launch({ headless: 'new' });

  const testPaths = [
    '/products/retatrutide-10mg',
    '/collections/all',
    '/pages/about'
  ];

  let totalErrors = 0;

  for (const testPath of testPaths) {
    const url = `http://localhost:${PORT}${testPath}`;
    console.log(`==================================================`);
    console.log(`Testing Hydrated DOM for Local Built Route: ${testPath}`);
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 2000)); // wait 2s post-hydration

      const metadata = await page.evaluate(() => {
        return {
          titles: [...document.querySelectorAll('title')].map(x => x.textContent.trim()),
          canonicals: [...document.querySelectorAll('link[rel="canonical"]')].map(x => x.getAttribute('href')),
          descriptions: [...document.querySelectorAll('meta[name="description"]')].map(x => x.getAttribute('content')),
          ogTitles: [...document.querySelectorAll('meta[property="og:title"]')].map(x => x.getAttribute('content')),
          ogDescriptions: [...document.querySelectorAll('meta[property="og:description"]')].map(x => x.getAttribute('content')),
          ogImages: [...document.querySelectorAll('meta[property="og:image"]')].map(x => x.getAttribute('content'))
        };
      });

      console.log('HYDRATED DOM METADATA SUMMARY:');
      console.log(`- Titles (${metadata.titles.length}):`, metadata.titles);
      console.log(`- Canonicals (${metadata.canonicals.length}):`, metadata.canonicals);
      console.log(`- Descriptions (${metadata.descriptions.length}):`, metadata.descriptions);
      console.log(`- OG Titles (${metadata.ogTitles.length}):`, metadata.ogTitles);

      const pass = 
        metadata.titles.length === 1 &&
        metadata.canonicals.length === 1 &&
        metadata.descriptions.length === 1 &&
        metadata.ogTitles.length <= 1;

      if (pass) {
        console.log(`✅ RESULT: PASS (Single metadata owner verified)`);
      } else {
        console.log(`❌ RESULT: FAIL (Duplicate metadata detected)`);
        totalErrors++;
      }
    } catch (err) {
      console.error(`❌ ERROR:`, err.message);
      totalErrors++;
    } finally {
      await page.close();
    }
    console.log(`==================================================\n`);
  }

  await browser.close();
  server.close();

  if (totalErrors === 0) {
    console.log('🎉 LOCAL BUILT HYDRATED DOM TEST PASSED 100%!');
    process.exit(0);
  } else {
    console.error(`🚨 DETECTED ${totalErrors} HYDRATED DOM ERRORS!`);
    process.exit(1);
  }
});
