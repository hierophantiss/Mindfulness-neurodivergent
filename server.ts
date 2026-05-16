import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add middleware for parsing JSON/forms with larger limit
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Gemini Proxy Routes
  app.post('/api/ai/reflection', async (req, res) => {
    try {
      const { journalData, language } = req.body;
      const { getAIReflection } = await import('./src/services/geminiService.ts');
      const result = await getAIReflection(journalData, language);
      res.json(result);
    } catch (error: any) {
      console.error('Reflection API Error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  app.post('/api/ai/companion', async (req, res) => {
    try {
      const { message, history, context } = req.body;
      const { streamCompanionResponse } = await import('./src/services/geminiService.ts');
      
      // Set headers for streaming
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');

      await streamCompanionResponse(message, history, context, (chunk) => {
        res.write(chunk);
      });
      
      res.end();
    } catch (error: any) {
      console.error('Companion API Error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
      } else {
        res.end();
      }
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
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
    app.use(express.static(distPath));
    
    // THE FIX: This catch-all route ensures that any refresh on a sub-route
    // (e.g., /chapters, /practice) correctly returns the main index.html
    // so React Router can handle it on the client side.
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
