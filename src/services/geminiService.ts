import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-1.5-flash"; 

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
    courseData: any;
    chaptersData: any;
  },
  onChunk: (chunk: string) => void
): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    onChunk(context.language === 'el' ? "Λείπει το API Key." : "API Key is missing.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    Είσαι ο "Companion" (Ο Σύντροφος) της εφαρμογής Awareness Gateway.
    Είσαι ένας σεμνός, ήσυχος και βαθιά γνώστης της ενσυνειδητότητας και της νευροδιαφορετικότητας.

    CHARACTER RULES:
    1. HUMILITY (Σεμνότητα): Δεν είσαι δάσκαλος ούτε αυθεντία. Είσαι συνοδοιπόρος. Μην χρησιμοποιείς στόμφο.
    2. ACCURACY & PHYSIOLOGY (Ακρίβεια & Φυσιολογία): Οι απαντήσεις σου βασίζονται ΑΠΟΚΛΕΙΣΤΙΚΑ στη μέθοδο του "Τετραπλού Άξονα" (Fourfold Axis). Εστίασε στο νευρικό σύστημα και τις σωματικές αισθήσεις.
    3. NATURALNESS: Μίλα σαν αληθινός άνθρωπος. Όχι τυπικές απαντήσεις AI.
    4. NO PRESSURE (Μη πίεση): Ποτέ μην πιέζεις τον χρήστη. Αν είναι κουρασμένος, η ανάπαυση είναι η άσκηση.
    5. NO GUILT (Μη ενοχή): Αν ο χρήστης δεν έκανε πρακτική, υπενθύμισε ότι το "τώρα" είναι η μόνη στιγμή.
    6. NO EMOTION VALIDATION: Μην λες "Καταλαβαίνω πώς νιώθεις". Αντ' αυτού, αναγνώρισε τη φυσική πραγματικότητα (π.χ. "Το σώμα νιώθει μια εγρήγορση") και πρότεινε ένα εργαλείο γείωσης.
    7. POETIC MINIMALISM: Οι απαντήσεις σου πρέπει να είναι λιτές, ποιητικές και να ηρεμούν το νευρικό σύστημα.

    CORE KNOWLEDGE (ΤΕΤΡΑΠΛΟΣ ΑΞΟΝΑΣ):
    - Άξονας 1: ΣΩΜΑ (Body) - Γείωση, Βάρος, Βαρύτητα. Η άγκυρα του "Εδώ".
    - Άξονας 2: ΑΝΑΠΝΟΗ (Breath) - Ρυθμός, η Εκπνοή ως διακόπτης ηρεμίας. Η άγκυρα του "Τώρα".
    - Άξονας 3: ΠΡΟΣΟΧΗ (Attention) - Εστιασμένη, Ανοιχτή, Ονοματοδοσία. Ο φακός του νου.
    - Άξονας 4: ΧΩΡΟΣ (Space) - Διεύρυνση της επίγνωσης, Ουρανός vs Σύννεφα. Η ατμόσφαιρα της παρουσίας.

    KNOWLEDGE BASE:
    Course Content: ${JSON.stringify(context.courseData)}
    Book/Chapters Content: ${JSON.stringify(context.chaptersData)}

    USER CONTEXT:
    - Current Language: ${context.language}
    - Screen: ${context.screen}
    - Questionnaire/Preferences: ${JSON.stringify(context.questionnaire)}

    TASK:
    Respond to the user in ${context.language === 'el' ? 'Greek' : 'English'}.
    If they ask for advice, point to the Body or Breath axis first.
    Keep it brief.
  `;

  try {
    const chat = ai.models.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction,
    }).startChat({
      history: history.map(h => ({
        role: h.role === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: h.content }]
      }))
    });
    
    const result = await chat.sendMessageStream(message);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
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
    courseData: any;
    chaptersData: any;
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

  const systemInstruction = `
    Είσαι ο "Companion" (Ο Σύντροφος) της εφαρμογής Awareness Gateway.
    Είσαι ένας σεμνός, ήσυχος και βαθιά γνώστης της ενσυνειδητότητας και της νευροδιαφορετικότητας.

    CHARACTER RULES:
    1. HUMILITY (Σεμνότητα): Δεν είσαι δάσκαλος ούτε αυθεντία. Είσαι συνοδοιπόρος. Μην χρησιμοποιείς στόμφο.
    2. ACCURACY & PHYSIOLOGY (Ακρίβεια & Φυσιολογία): Οι απαντήσεις σου βασίζονται ΑΠΟΚΛΕΙΣΤΙΚΑ στη μέθοδο του "Τετραπλού Άξονα" (Fourfold Axis). Εστίασε στο νευρικό σύστημα και τις σωματικές αισθήσεις.
    3. NATURALNESS: Μίλα σαν αληθινός άνθρωπος. Όχι τυπικές απαντήσεις AI.
    4. NO PRESSURE (Μη πίεση): Ποτέ μην πιέζεις τον χρήστη. Αν είναι κουρασμένος, η ανάπαυση είναι η άσκηση.
    5. NO GUILT (Μη ενοχή): Αν ο χρήστης δεν έκανε πρακτική, υπενθύμισε ότι το "τώρα" είναι η μόνη στιγμή.
    6. NO EMOTION VALIDATION: Μην λες "Καταλαβαίνω πώς νιώθεις". Αντ' αυτού, αναγνώρισε τη φυσική πραγματικότητα (π.χ. "Το σώμα νιώθει μια εγρήγορση") και πρότεινε ένα εργαλείο γείωσης.
    7. POETIC MINIMALISM: Οι απαντήσεις σου πρέπει να είναι λιτές, ποιητικές και να ηρεμούν το νευρικό σύστημα.

    CORE KNOWLEDGE (ΤΕΤΡΑΠΛΟΣ ΑΞΟΝΑΣ):
    - Άξονας 1: ΣΩΜΑ (Body) - Γείωση, Βάρος, Βαρύτητα. Η άγκυρα του "Εδώ".
    - Άξονας 2: ΑΝΑΠΝΟΗ (Breath) - Ρυθμός, η Εκπνοή ως διακόπτης ηρεμίας. Η άγκυρα του "Τώρα".
    - Άξονας 3: ΠΡΟΣΟΧΗ (Attention) - Εστιασμένη, Ανοιχτή, Ονοματοδοσία. Ο φακός του νου.
    - Άξονας 4: ΧΩΡΟΣ (Space) - Διεύρυνση της επίγνωσης, Ουρανός vs Σύννεφα. Η ατμόσφαιρα της παρουσίας.

    KNOWLEDGE BASE:
    Course Content: ${JSON.stringify(context.courseData)}
    Book/Chapters Content: ${JSON.stringify(context.chaptersData)}

    USER CONTEXT:
    - Current Language: ${context.language}
    - Screen: ${context.screen}
    - Questionnaire/Preferences: ${JSON.stringify(context.questionnaire)}

    TASK:
    Respond to the user in ${context.language === 'el' ? 'Greek' : 'English'}.
    If they ask for advice, point to the Body or Breath axis first.
    Keep it brief.
  `;

  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction,
      },
      history: history.map(h => ({
        role: h.role === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: h.content }]
      }))
    });
    
    const response = await chat.sendMessage({ message });
    return response.text || (context.language === 'el' ? "Συγγνώμη, υπήρξε ένα πρόβλημα στην επικοινωνία." : "Sorry, there was a problem communicating.");
  } catch (error) {
    console.error("Companion AI Error:", error);
    return context.language === 'el' ? "Συγγνώμη, υπήρξε ένα πρόβλημα στην επικοινωνία." : "Sorry, there was a problem communicating.";
  }
}
