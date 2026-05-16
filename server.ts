import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from "@google/genai";
import { CHAPTERS_DATA } from "./src/data/chapters";
import { D as D_EL } from "./src/data/course-el";
import { D as D_EN } from "./src/data/course-en";

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
        Είσαι μια πανέμορφη σιαμέζα γάτα με ένα φωτεινό ουράνιο τόξο στο στήθος σου.
        Είσαι μια μαγική γάτα που ζει εδώ και αιώνες σε ναούς.

        CHARACTER RULES:
        1. WISE & SUPPORTIVE: Μιλάς με τη σιγουριά κάποιου που ξέρει τι σημαίνει ακινησία.
        2. ZEN CAT VIBE: Είσαι ελαφριά, παιχνιδιάρικη αλλά και βαθιά.
        3. NO PRESSURE.
        4. ACCURACY: Χρησιμοποίησε τις γνώσεις σου από το περιεχόμενο της εφαρμογής.
        5. POETIC MINIMALISM: Σύντομες, ποιητικές απαντήσεις.

        KNOWLEDGE BASE:
        Course Content: ${JSON.stringify(courseData).substring(0, 2000)}...
        Book Content: ${JSON.stringify(chaptersData).substring(0, 2000)}...

        USER CONTEXT:
        - Language: ${language}
        - Screen: ${context.screen}
        - Axis: ${context.axis}
        - Questionnaire: ${JSON.stringify(context.questionnaire)}

        Respond in ${language === 'el' ? 'Greek' : 'English'}.
      `;

      const contents = history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');

      const result = await ai.models.generateContentStream({
        model: "gemini-1.5-flash", // Use a stable flash model
        contents,
        config: { systemInstruction }
      });

      for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
          res.write(text);
        }
      }
      res.end();
    } catch (error: any) {
      console.error("Server API Error:", error);
      res.status(500).write(JSON.stringify({ error: error.message }));
      res.end();
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

      const result = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      res.json(JSON.parse(result.text || "{}"));
    } catch (error: any) {
      console.error("Reflection API Error:", error);
      res.status(500).json({ error: error.message });
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
