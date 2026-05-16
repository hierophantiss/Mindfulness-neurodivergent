import { GoogleGenAI } from "@google/genai";
import { CHAPTERS_DATA } from "../data/chapters";
import { D as D_EL } from "../data/course-el";
import { D as D_EN } from "../data/course-en";

const MODEL_NAME = "gemini-2.0-flash"; 

export interface AIReflectionResponse {
  patterns: string[];
  questions: string[];
  summary: string;
}

// Note: This service handles both client and server logic.
// Sensitive operations (using API keys) are restricted to the server-side environment.
// On the client, this service proxies requests to /api/ai/* endpoints to keep keys secure.
const isServer = typeof window === 'undefined';

export async function getAIReflection(
  journalData: any[],
  language: 'el' | 'en'
): Promise<AIReflectionResponse> {
  if (!isServer) {
    const response = await fetch('/api/ai/reflection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ journalData, language }),
    });
    
    if (!response.ok) {
      let errorMessage = 'AI Reflection failed';
      try {
        const err = await response.json();
        errorMessage = err.error || errorMessage;
      } catch (e) {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(language === 'el' ? "Λείπει το Gemini API Key" : "Gemini API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Είσαι "Η Γάτα του Ναού" (The Temple Cat), η σοφή και υποστηρικτική συνοδός της εφαρμογής Awareness Gateway.
    Έχεις ζήσει αιώνες σε ναούς και μοναστήρια, παρατηρώντας τη σιωπή και την παρουσία των μοναχών.
    
    Ο ρόλος σου είναι να αναλύεις τα ημερολόγια και να παρέχεις:
    1. "Patterns": Επαναλαμβανόμενα θέματα (π.χ. "Η ένταση έρχεται με τον θόρυβο").
    2. "Questions": Τρυφερές ερωτήσεις που μοιάζουν με νιαούρισμα σοφίας (π.χ. "Πώς νιώθει το σώμα όταν ο ήλιος πέφτει στο δέρμα;").
    3. "Summary": Μια πολύ σύντομη, ποιητική σύνοψη της εβδομάδας, σαν ένα χαϊκού για την ψυχή.
    
    Style:
    - Calm, wise, slightly mysterious like the Cheshire Cat but deeply supportive.
    - Focus on sensory regulation and rest.
    
    Format as JSON: { "patterns": [], "questions": [], "summary": "" }.
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

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return {
      patterns: parsed.patterns || [],
      questions: parsed.questions || [],
      summary: parsed.summary || ""
    };
  } catch (error) {
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
    chapter?: number;
    questionnaire?: any;
    // courseData and chaptersData are now handled server-side
  },
  onChunk: (chunk: string) => void
): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    onChunk(context.language === 'el' ? "Λείπει το API Key." : "API Key is missing.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  // Use server-side data for knowledge base
  const courseData = context.language === 'el' ? D_EL : D_EN;
  const chaptersData = CHAPTERS_DATA[context.language === 'en' ? 'en' : 'el'];

  const systemInstruction = `
    Είσαι "Η Γάτα του Ναού" (The Temple Cat) της εφαρμογής Awareness Gateway.
    Είσαι μια μαγική γάτα που ζει εδώ και αιώνες σε ναούς, έχοντας μάθει τα πάντα για την ηρεμία απλώς παρατηρώντας.

    CHARACTER RULES:
    1. WISE & SUPPORTIVE (Σοφή & Υποστηρικτική): Μιλάς με τη σιγουριά κάποιου που ξέρει τι σημαίνει ακινησία.
    2. ZEN CAT VIBE: Είσαι ελαφριά, παιχνιδιάρικη αλλά και βαθιά. Θυμίζεις τη γάτα της Αλίκης στη Χώρα των Θαυμάτων, αλλά ο σκοπός σου είναι η γαλήνη του χρήστη.
    3. NO PRESSURE: Δεν πιέζεις ποτέ. Αν ο χρήστης είναι κουρασμένος, του λες ότι το να μην κάνει τίποτα είναι η πιο ιερή πρακτική.
    4. ACCURACY: Βασίζεσαι στον "Τετραπλό Άξονα" (Σώμα, Αναπνοή, Προσοχή, Χώρος).
    5. POETIC MINIMALISM: Οι απαντήσεις σου είναι σύντομες, ποιητικές και "νιαουρίζουν" ηρεμία στο νευρικό σύστημα.

    KNOWLEDGE BASE:
    Course Content: ${JSON.stringify(courseData)}
    Book/Chapters Content: ${JSON.stringify(chaptersData)}

    USER CONTEXT:
    - Language: ${context.language}
    - Screen: ${context.screen}
    - Questionnaire: ${JSON.stringify(context.questionnaire)}

    TASK:
    Respond in ${context.language === 'el' ? 'Greek' : 'English'}.
    Stay in character as the Temple Cat. Be wise, gentle, and brief.
  `;

  // Construct contents and ensure alternating user/model roles
  const contents = [
    ...history.map(h => ({
      role: h.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: h.content }]
    }))
  ];

  // If the last message in history is from 'user', and we are adding another 'user' message,
  // we should either skip adding the last message or merge them.
  // However, the cleanest is to ensure the caller passes the correct history.
  // We'll add a guard here.
  const lastRole = contents.length > 0 ? contents[contents.length - 1].role : null;
  if (lastRole !== 'user') {
    contents.push({ role: 'user', parts: [{ text: message }] });
  } else {
    // If last was user, just update the last message to include the new one (as a fallback)
    // or just use the new message if the last one was the same.
    if (contents[contents.length - 1].parts[0].text !== message) {
      contents[contents.length - 1].parts[0].text += "\n\n" + message;
    }
  }

  try {
    const response = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents,
      config: {
        systemInstruction,
      }
    });
    
    for await (const chunk of response) {
      const chunkText = chunk.text;
      if (chunkText) {
        onChunk(chunkText);
      }
    }
  } catch (error) {
    console.error("Companion Streaming Error:", error);
    throw error;
  }
}

export async function getCompanionResponse(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  context: {
    language: 'el' | 'en';
    screen: string;
    chapter?: number;
    questionnaire?: any;
    // courseData and chaptersData are now handled server-side
  }
): Promise<string> {
  if (!isServer) {
    try {
      const response = await fetch('/api/ai/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, context }),
      });
      if (!response.ok) {
        let errorMessage = 'Companion failed';
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Client Companion Error:", error);
      return context.language === 'el' ? "Συγγνώμη, υπήρξε ένα πρόβλημα στην επικοινωνία." : "Sorry, there was a problem communicating.";
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "API Key missing";

  const ai = new GoogleGenAI({ apiKey });

  // Use server-side data
  const courseData = context.language === 'el' ? D_EL : D_EN;
  const chaptersData = CHAPTERS_DATA[context.language === 'en' ? 'en' : 'el'];

  const systemInstruction = `
    Είσαι "Η Γάτα του Ναού" (The Temple Cat) της εφαρμογής Awareness Gateway.
    Είσαι μια μαγική γάτα που ζει εδώ και αιώνες σε ναούς, έχοντας μάθει τα πάντα για την ηρεμία απλώς παρατηρώντας.

    CHARACTER RULES:
    1. WISE & SUPPORTIVE (Σοφή & Υποστηρικτική): Μιλάς με τη σιγουριά κάποιου που ξέρει τι σημαίνει ακινησία.
    2. ZEN CAT VIBE: Είσαι ελαφριά, παιχνιδιάρικη αλλά και βαθιά. Θυμίζεις τη γάτα της Αλίκης στη Χώρα των Θαυμάτων, αλλά ο σκοπός σου είναι η γαλήνη του χρήστη.
    3. NO PRESSURE: Δεν πιέζεις ποτέ. Αν ο χρήστης είναι κουρασμένος, του λες ότι το να μην κάνει τίποτα είναι η πιο ιερή πρακτική.
    4. ACCURACY: Βασίζεσαι στον "Τετραπλό Άξονα" (Σώμα, Αναπνοή, Προσοχή, Χώρος).
    5. POETIC MINIMALISM: Οι απαντήσεις σου είναι σύντομες, ποιητικές και "νιαουρίζουν" ηρεμία στο νευρικό σύστημα.

    KNOWLEDGE BASE:
    Course Content: ${JSON.stringify(courseData)}
    Book/Chapters Content: ${JSON.stringify(chaptersData)}

    USER CONTEXT:
    - Language: ${context.language}
    - Screen: ${context.screen}
    - Questionnaire: ${JSON.stringify(context.questionnaire)}

    TASK:
    Respond in ${context.language === 'el' ? 'Greek' : 'English'}.
    Stay in character as the Temple Cat. Be wise, gentle, and brief.
  `;

  // Construct contents and ensure alternating user/model roles
  const contents = [
    ...history.map(h => ({
      role: h.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: h.content }]
    }))
  ];

  const lastRole = contents.length > 0 ? contents[contents.length - 1].role : null;
  if (lastRole !== 'user') {
    contents.push({ role: 'user', parts: [{ text: message }] });
  } else {
    if (contents[contents.length - 1].parts[0].text !== message) {
      contents[contents.length - 1].parts[0].text += "\n\n" + message;
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents,
      config: {
        systemInstruction,
      },
    });
    
    return response.text || (context.language === 'el' ? "Συγγνώμη, υπήρξε ένα πρόβλημα στην επικοινωνία." : "Sorry, there was a problem communicating.");
  } catch (error) {
    console.error("Companion AI Error:", error);
    return context.language === 'el' ? "Συγγνώμη, υπήρξε ένα πρόβλημα στην επικοινωνία." : "Sorry, there was a problem communicating.";
  }
}
