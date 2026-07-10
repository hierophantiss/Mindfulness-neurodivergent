import express from 'express';
import fs from 'fs';
import 'dotenv/config';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { CHAPTERS_DATA } from "./src/data/chapters";
import { D as D_EL } from "./src/data/course-el";
import { D as D_EN } from "./src/data/course-en";


import { MICRODOSES_EXERCISES } from "./src/data/microdoses";
import { BREATH_PATTERNS } from "./src/data/breathPatterns";


async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add middleware for parsing JSON/forms with larger limit
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Enable CORS for all routes (important for sandboxed iframes in preview)
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,Range');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length, Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // API health check
  app.get('/api/health', (req, res) => {
    res.json({ status: "ok" });
  });

  // Gemini API Proxy
  app.post('/api/audio-log', express.json(), (req, res) => {
    try {
      const logLine = `[${new Date().toISOString()}] ${JSON.stringify(req.body)}\n`;
      fs.appendFileSync('audio-debug.log', logLine);
      res.json({ status: 'logged' });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: 'failed' });
    }
  });

  // Serve public folder statically (supports Accept-Ranges for iOS Safari)
  app.use(express.static(path.join(process.cwd(), 'public'), { redirect: false }));

  // Vite integration
  const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' || fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'));

  if (!isProduction) {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve high-performance static files from dist/client
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { redirect: false }));
    
    // THE FIX: This catch-all route ensures that any refresh on a sub-route
    // (e.g., /chapters, /practice) correctly returns the main index.html
    // so React Router can handle it on the client side.
    app.get('*all', (req, res, next) => {
      try {
        // If the request looks like an asset (has a file extension) and wasn't found by express.static, return 404
        if (req.path.match(/\.[a-zA-Z0-9]+$/)) {
          return next();
        }
        
        const prerenderedPath = path.join(distPath, req.path, 'index.html');
        
        // Prevent directory traversal just in case (though express req.path is usually safe)
        if (!prerenderedPath.startsWith(distPath)) {
          return res.sendFile(path.join(distPath, 'index.html'));
        }

        if (req.path !== '/' && fs.existsSync(prerenderedPath) && fs.statSync(prerenderedPath).isFile()) {
          res.sendFile(prerenderedPath);
        } else {
          res.sendFile(path.join(distPath, 'index.html'));
        }
      } catch (err) {
        console.error("Wildcard route error:", err);
        // Fallback to single page container
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
