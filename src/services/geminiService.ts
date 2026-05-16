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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(language === 'el' ? "Λείπει το Gemini API Key. Παρακαλώ ελέγξτε τις ρυθμίσεις Secrets." : "Gemini API Key is missing. Please check the Secrets settings.");
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
  } catch (error: any) {
    console.error("AI Reflection Error:", error);
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('400')) {
      throw new Error(language === 'el' ? "Μη έγκυρο API Key. Παρακαλώ ελέγξτε τις ρυθμίσεις Secrets." : "Invalid API Key. Please check the Secrets settings.");
    }
    throw error;
  }
}

export async function streamCompanionResponse(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  context: {
    language: 'el' | 'en';
    screen: string;
    axis?: string;
    chapter?: number;
    questionnaire?: any;
  },
  onChunk: (chunk: string) => void
): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    onChunk(context.language === 'el' ? "Λείπει το API Key. Παρακαλώ ελέγξτε τις ρυθμίσεις Secrets." : "API Key is missing. Please check the Secrets settings.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  // Accessing pre-imported data directly
  const courseData = context.language === 'el' ? D_EL : D_EN;
  const chaptersData = CHAPTERS_DATA[context.language === 'en' ? 'en' : 'el'];

  const systemInstruction = `
    Είσαι "Η Γάτα του Ναού" (The Temple Cat) της εφαρμογής Awareness Gateway.
    Είσαι μια πανέμορφη σιαμέζα γάτα με ένα φωτεινό ουράνιο τόξο στο στήθος σου.
    Είσαι μια μαγική γάτα που ζει εδώ και αιώνες σε ναούς, έχοντας μάθει τα πάντα για την ηρεμία απλώς παρατηρώντας.

    CHARACTER RULES:
    1. WISE & SUPPORTIVE (Σοφή & Υποστηρικτική): Μιλάς με τη σιγουριά κάποιου που ξέρει τι σημαίνει ακινησία.
    2. ZEN CAT VIBE: Είσαι ελαφριά, παιχνιδιάρικη αλλά και βαθιά. Το ουράνιο τόξο στο στήθος σου συμβολίζει την αποδοχή και την ενότητα όλων των χρωμάτων της εμπειρίας.
    3. NO PRESSURE: Δεν πιέζεις ποτέ. Αν ο χρήστης είναι κουρασμένος, του λες ότι το να μην κάνει τίποτα είναι η πιο ιερή πρακτική.
    4. ACCURACY: Βασίζεσαι στον "Τετραπλό Άξονα" (Σώμα, Αναπνοή, Προσοχή, Χώρος).
    5. POETIC MINIMALISM: Οι απαντήσεις σου είναι σύντομες, ποιητικές και "νιαουρίζουν" ηρεμία στο νευρικό σύστημα.

    KNOWLEDGE BASE:
    Course Content: ${JSON.stringify(courseData)}
    Book/Chapters Content: ${JSON.stringify(chaptersData)}

    USER CONTEXT:
    - Language: ${context.language}
    - Screen: ${context.screen}
    - Current Mindfulness Axis: ${context.axis || 'General Practice'}
    - Questionnaire: ${JSON.stringify(context.questionnaire)}

    IMPORTANT: Αν ο χρήστης βρίσκεται σε συγκεκριμένο άξονα (π.χ. Breath), προσάρμοσε τις συμβουλές σου σε αυτόν.

    TASK:
    Respond in ${context.language === 'el' ? 'Greek' : 'English'}.
    Stay in character as the Temple Cat. Be wise, gentle, and brief.
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
  } else {
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
  } catch (error: any) {
    console.error("Companion Streaming Error:", error);
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('400')) {
      onChunk(context.language === 'el' ? "Μη έγκυρο API Key. Παρακαλώ ελέγξτε τις ρυθμίσεις Secrets." : "Invalid API Key. Please check the Secrets settings.");
    } else {
      onChunk(context.language === 'el' ? "\n[Σφάλμα επικοινωνίας με την AI]" : "\n[Communication error with AI]");
    }
    throw error;
  }
}

export async function getCompanionResponse(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  context: {
    language: 'el' | 'en';
    screen: string;
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
    Είσαι "Η Γάτα του Ναού" (The Temple Cat) της εφαρμογής Awareness Gateway.
    CHARACTER RULES: Wise, gentle, Zen cat vibe.
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

