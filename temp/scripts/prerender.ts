import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// Load prerenderer as CJS to avoid ESM issues across node versions and platforms
const Prerenderer = require('@prerenderer/prerenderer');
const JSDOMRenderer = require('@prerenderer/renderer-jsdom');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

async function run() {
  const routesPath = path.join(ROOT_DIR, 'src', 'prerender-paths.json');
  let routes = ['/'];
  try {
    routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
  } catch(e) {
    console.log('No prerender paths found, using default [/]');
  }

  const prerenderer = new Prerenderer({
    staticDir: path.join(ROOT_DIR, 'dist'),
    renderer: new JSDOMRenderer(),
    server: {
      host: '127.0.0.1',
      port: 0 // Assign dynamic port to prevent EADDRINUSE
    }
  });

  try {
    console.log(`Starting prerenderer for ${routes.length} routes...`);
    await prerenderer.initialize();
    
    const renderedRoutes = await prerenderer.renderRoutes(routes);
    
    for (const route of renderedRoutes) {
      let outDir = path.join(ROOT_DIR, 'dist', route.route);
      if (route.route === '/') {
          outDir = path.join(ROOT_DIR, 'dist');
      }
      const file = path.join(outDir, 'index.html');
      if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true });
      }
      fs.writeFileSync(file, route.html.trim());
    }
    console.log('✅ Prerendering completed successfully.');
  } catch (err) {
    console.error('Error during prerendering:', err);
    process.exit(1);
  } finally {
    prerenderer.destroy();
  }
}

run();
