const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const importGenAI = "import { GoogleGenAI, Modality } from '@google/genai';\n";
if (!code.includes('@google/genai')) {
  code = importGenAI + code;
}

const ttsEndpoint = `
  app.post('/api/tts', express.json(), async (req, res) => {
    try {
      const { text, language } = req.body;
      if (!text) return res.status(400).json({ error: 'Text is required' });

      // Check if API key exists
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      }
      
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      // We'll use a calmer voice: 'Aoede' or 'Kore'
      const voiceName = 'Aoede'; 
      
      // We instruct the model to speak calmly and softly in the desired language
      const prompt = \`Read the following text calmly, softly, and with a slow, reassuring pace, suitable for a mindfulness meditation app. Language: \${language === 'el' ? 'Greek' : 'English'}. Text: \\n\\n\${text}\`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        res.json({ audio: base64Audio });
      } else {
        res.status(500).json({ error: 'Failed to generate audio' });
      }
    } catch (error) {
      console.error("TTS Error:", error);
      res.status(500).json({ error: 'TTS generation failed' });
    }
  });
`;

code = code.replace(
  "  // Serve public folder statically",
  ttsEndpoint + "\n  // Serve public folder statically"
);

fs.writeFileSync('server.ts', code);
