import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prerender() {
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) return;

  // Serve the static files
  const app = express();
  app.use(express.static(distPath));
  // SPA fallback
  app.get('*all', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  const server = app.listen(3001, async () => {
    console.log('Server started for prerendering...');
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const routes = ['/', '/intro', '/method', '/chapters', '/program', '/practice', '/faq', '/rabbithole', '/journal', '/dashboard', '/media'];

    for (const route of routes) {
      const page = await browser.newPage();
      await page.goto(`http://localhost:3001${route}`, { 
        waitUntil: 'networkidle2',
        timeout: 60000 
      });
      
      const html = await page.content();
      
      const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
      const fullPath = path.join(distPath, routePath);
      
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, html);
      console.log(`Prerendered: ${route}`);
      
      await page.close();
    }

    await browser.close();
    server.close();
    console.log('Prerendering completed.');
  });
}

prerender().catch(console.error);
