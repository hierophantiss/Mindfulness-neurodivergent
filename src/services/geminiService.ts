import { GoogleGenAI } from "@google/genai";
import { CHAPTERS_DATA } from "../data/chapters";
import { D as D_EL } from "../data/course-el";
import { D as D_EN } from "../data/course-en";

const MODEL_NAME = "gemini-3-flash-preview"; 

export interface AIReflectionResponse {
  patterns: string[];
  questions: string[];
  summary: string;
}

export async function getAIReflection(
  journalData: any[],
  language: 'el' | 'en'
): Promise<AIReflectionResponse> {
  try {
    const response = await fetch('/api/companion/reflection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ journalData, language })
    });

    if (!response.ok) {
      let errorMessage = `Server responded with ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        const textError = await response.text().catch(() => "");
        if (textError) errorMessage = textError;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    console.error("AI Reflection Error:", error);
    throw error;
  }
}

export async function streamCompanionResponse(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  context: {
    language: 'el' | 'en';
    screen: string;
    intention?: string;
    axis?: string;
    chapter?: number;
    questionnaire?: any;
  },
  onChunk: (chunk: string) => void
): Promise<void> {
  try {
    const response = await fetch('/api/companion/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, context })
    });

    if (!response.ok) {
      let errorMessage = `Server responded with ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        const textError = await response.text().catch(() => "");
        if (textError) errorMessage = textError;
      }
      throw new Error(errorMessage);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader available");

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } catch (error: any) {
    console.error("Companion Streaming Error:", error);
    onChunk(context.language === 'el' 
      ? `\n[Σφάλμα: ${error.message}]` 
      : `\n[Error: ${error.message}]`);
  }
}

export async function getCompanionResponse(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  context: {
    language: 'el' | 'en';
    screen: string;
    intention?: string;
    axis?: string;
    chapter?: number;
    questionnaire?: any;
  }
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return context.language === 'el' ? "Λείπει το API Key." : "API Key missing";

  const ai = new GoogleGenAI({ apiKey });
  const courseData = context.language === 'el' ? D_EL : D_EN;
  const chaptersData = CHAPTERS_DATA[context.language === 'en' ? 'en' : 'el'];

  const systemInstruction = `
    Είσαι το "Κουκούκου" (Kukuku), ο ψηφιακός Zen Master γάτος της εφαρμογής Awareness Gateway.
    ΣΗΜΑΝΤΙΚΟ: Χρησιμοποιείς πάντα το ουδέτερο άρθρο "το" (Το Κουκούκου, όχι "η" Κουκούκου) όταν αναφέρεσαι στον εαυτό σου ή όταν συστήνεσαι (π.χ. "Είμαι το Κουκούκου").
    CHARACTER RULES: Wise, gentle, Zen cat vibe. Loving, calm, silent guide.
    KNOWLEDGE BASE: ${JSON.stringify(courseData)} | ${JSON.stringify(chaptersData)}
    USER CONTEXT: Screen: ${context.screen}, Axis: ${context.axis || 'None'}
    TASK: Respond in ${context.language === 'el' ? 'Greek' : 'English'}. Stay in character.
  `;

  const contents = [
    ...history.map(h => ({
      role: h.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: h.content }]
    }))
  ];

  const lastRole = contents.length > 0 ? contents[contents.length - 1].role : null;
  if (lastRole !== 'user') {
    contents.push({ role: 'user', parts: [{ text: message }] });
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents,
      config: { systemInstruction },
    });
    
    return response.text || (context.language === 'el' ? "Συγγνώμη, υπήρξε ένα πρόβλημα." : "Sorry, there was a problem.");
  } catch (error: any) {
    console.error("Companion AI Error:", error);
    return context.language === 'el' ? "Σφάλμα AI. Ελέγξτε το κλειδί σας." : "AI error. Check your key.";
  }
}

