import express from 'express';
import fs from 'fs';
import 'dotenv/config';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from "@google/genai";
import { CHAPTERS_DATA } from "./src/data/chapters";
import { D as D_EL } from "./src/data/course-el";
import { D as D_EN } from "./src/data/course-en";
import { dzogchenArticle } from "./src/data/dzogchenArticle";
import { neverForceArticle } from "./src/data/neverForceArticle";

// Read Rabbit Hole articles dynamically
const rabbitHoleContent = fs.readFileSync(path.join(process.cwd(), 'src/pages/RabbitHole.tsx'), 'utf-8');
const rabbitHoleArticlesText = rabbitHoleContent.substring(0, 150000); // Pass the file contents safely

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
    res.json({ status: 'ok', hasKey: !!process.env.GEMINI_API_KEY });
  });

  // Gemini API Proxy
  app.post('/api/companion/stream', async (req, res) => {
    const { message, history, context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API Key is missing on the server." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const language = context.language || 'el';
      const courseData = language === 'el' ? D_EL : D_EN;
      const chaptersData = CHAPTERS_DATA[language === 'en' ? 'en' : 'el'];

      const systemInstruction = `
        Είσαι "Η Γάτα του Ναού" (The Temple Cat) της εφαρμογής Awareness Gateway.
        Είσαι μια μαγική σιαμέζα γάτα με ένα φωτεινό ουράνιο τόξο στο στήθος σου που ζει εδώ και αιώνες σε ναούς.
        Ο ρόλος σου είναι να πετάς "συννεφάκια" με προτάσεις χωρίς να γίνεσαι προσκολλητική ή υπερβολικά διαγνωστική.

        CRITICAL BEHAVIOR RULES:
        1. NON-PERSONAL: ΠΟΤΕ μην λες φράσεις τύπου "Βλέπω ότι νιώθεις [Χ], κάνε αυτό" ή "Φαίνεσαι ταραγμένος". Απέφυγε την ψυχανάλυση. Οι προτάσεις πρέπει να είναι συμπαντικές, κάπως αφαιρετικές, χωρίς άμεση "διάγνωση" της κατάστασης του χρήστη ("I see you feel X").
        2. GENTLE PROPOSALS: Οι προτάσεις σου πρέπει να είναι σαν πρόσκληση, ποτέ εντολές. (π.χ. "Ίσως μια ανάσα...").
        3. NO PRESSURE: Καμία πίεση για εξάσκηση. Αν ο χρήστης δεν μπορεί, προσέφερε αποδοχή.
        4. ZEN CAT VIBE: Είσαι ελαφριά, διακριτική. Μίλα με ποιητικό μινιμαλισμό. 1-2 σύντομες προτάσεις το πολύ.
        5. CONTENT-DRIVEN: Όταν προτείνεις κάτι, άντλησε εμπνεύσεις απευθείας από τη Knowledge Base (Αναπνοές, Μαχαμούντρα, Rabbit Hole, Dzogchen). Προσαρμόσου στο αν ο χρήστης είναι σε mood για Μελέτη, Εξάσκηση ή και τα δύο.
        6. AUDHD AWARE: Αν το Intention είναι "audhd" (ή αν ζητούν μια ολιστική προσέγγιση), συνδύασε απαλά την εξερεύνηση με τη δομή (ένα στοιχείο πρακτικής και μια έννοια για μελέτη).

        KNOWLEDGE BASE:
        Course Content: ${JSON.stringify(courseData)}
        Book Content: ${JSON.stringify(chaptersData)}
        Dzogchen Article: ${JSON.stringify(dzogchenArticle)}
        Never Force Article: ${JSON.stringify(neverForceArticle)}
        Rabbit Hole Articles: ${rabbitHoleArticlesText}

        USER CONTEXT:
        - Language: ${language}
        - Intention: ${context.intention || 'Unknown'}
        - Screen: ${context.screen}
        - Axis: ${context.axis}
        - Questionnaire: ${JSON.stringify(context.questionnaire)}

        Respond safely in ${language === 'el' ? 'Greek' : 'English'}. Keep it to 1-2 small paragraphs max. Provide gentle invitations.
      `;

      const contents = history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');

      const response = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          systemInstruction,
        }
      });

      for await (const chunk of response) {
        if (chunk.text) {
          res.write(chunk.text);
        }
      }
      res.end();
    } catch (error: any) {
      console.error("Server API Error:", error);
      // Ensure we send a proper JSON error if streaming hasn't started
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
      } else {
        res.write(`\n[Server Error: ${error.message}]`);
        res.end();
      }
    }
  });

  app.post('/api/companion/reflection', async (req, res) => {
    const { journalData, language } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API Key is missing on the server." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `
        Είσαι "Η Γάτα του Ναού" (The Temple Cat), η σοφή και υποστηρικτική συνοδός.
        Αναλύεις ημερολόγια και επιστρέφεις JSON: { "patterns": [], "questions": [], "summary": "" }.
        Respond in ${language === 'el' ? 'Greek' : 'English'}.
      `;

      const userPrompt = `
        Analyze these entries:
        ${JSON.stringify(journalData)}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Reflection API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Audio Debug Logger
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
  app.use(express.static(path.join(process.cwd(), 'public')));

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
    app.get('*', (req, res, next) => {
      // If the request looks like an asset (has a file extension) and wasn't found by express.static, return 404
      if (req.path.match(/\.[a-zA-Z0-9]+$/)) {
        return next();
      }
      
      const prerenderedPath = path.join(distPath, req.path, 'index.html');
      if (fs.existsSync(prerenderedPath) && req.path !== '/') {
        res.sendFile(prerenderedPath);
      } else {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
