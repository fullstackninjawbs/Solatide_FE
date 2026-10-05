import puppeteer from 'puppeteer';

const testUrls = [
  'https://solatidebiosciences.com.au/products/retatrutide-10mg',
  'https://solatidebiosciences.com.au/collections/all',
  'https://solatidebiosciences.com.au/pages/about'
];

async function runHydratedDOMTest() {
  console.log('🚀 Running Hydrated DOM Metadata Inspection Test...\n');
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const url of testUrls) {
    console.log(`==================================================`);
    console.log(`Testing Hydrated DOM for: ${url}`);
    const page = await browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
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
      console.log(`- OG Descriptions (${metadata.ogDescriptions.length}):`, metadata.ogDescriptions);
      console.log(`- OG Images (${metadata.ogImages.length}):`, metadata.ogImages);

      const pass = 
        metadata.titles.length === 1 &&
        metadata.canonicals.length === 1 &&
        metadata.descriptions.length === 1 &&
        metadata.ogTitles.length <= 1;

      if (pass) {
        console.log(`✅ RESULT: PASS (Single ownership metadata verified)`);
      } else {
        console.log(`❌ RESULT: FAIL (Overlapping metadata detected)`);
      }
    } catch (err) {
      console.error(`❌ ERROR testing ${url}:`, err.message);
    } finally {
      await page.close();
    }
    console.log(`==================================================\n`);
  }

  await browser.close();
}

runHydratedDOMTest();
