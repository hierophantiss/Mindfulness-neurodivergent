import { GoogleGenAI } from "@google/genai";

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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(language === 'el' ? "Λείπει το Gemini API Key" : "Gemini API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    You are an empathetic, insightful mindfulness coach specializing in neurodivergent awareness (ADHD, sensory processing).
    Your goal is to analyze journal entries and provide:
    1. "Patterns": Subtle recurring themes in mood, tension, or notes.
    2. "Questions": Gentle, supportive inquiry to deepen self-awareness.
    3. "Summary": A very brief, poetic summary of the week's energy.
    
    Keep the tone:
    - Calm and non-judgmental.
    - Minimalist and poetic (italic serif style).
    - Supportive of neurodivergent needs (rest, sensory regulation).
    
    Format the response as JSON with fields: "patterns" (array of strings), "questions" (array of strings), "summary" (string).
    Respond in ${language === 'el' ? 'Greek' : 'English'}.
  `;

  const userPrompt = `
    Analyze these journal entries for the week:
    ${JSON.stringify(journalData, null, 2)}
    
    Please detect any correlations between sensory environment, moods, and body tension mentioned in the notes or tags.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      patterns: result.patterns || [],
      questions: result.questions || [],
      summary: result.summary || ""
    };
  } catch (error) {
    console.error("AI Reflection Error:", error);
    throw error;
  }
}
