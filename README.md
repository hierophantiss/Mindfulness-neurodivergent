# Awareness Gateway | ⚛️
### *Μαθαίνοντας να Ιππεύεις τον Άνεμο*
#### Trauma-Informed Mindfulness specifically crafted for Neurodivergent Minds (ADHD & Autism)

**Awareness Gateway** is a premium digital sanctuary and a comprehensive guide designed to navigate the complexities of the neurodivergent experience through the lens of mindfulness. It moves away from "one-size-fits-all" approaches, offering a modular, clinical, and poetic framework for self-regulation and awareness.

---

## 🌟 The Core Philosophy: The Fourfold Axis

The application is built around the **Fourfold Axis of Consciousness**, a structured path to re-associating with the self:

1.  **Gravity / Body (Βαρύτητα & Σώμα):** Grounding in the physical vessel. Learning to feel the weight of existence as a source of stability.
2.  **Breath (Ανάσα):** Navigating the internal rhythms. Using the breath not as a chore, but as a bridge to the nervous system.
3.  **Attention (Προσοχή):** Cultivating the "observer." Training the ability to hold focus without the weight of judgment.
4.  **Space (Χώρος):** Open presence. Recognizing that we are the space in which every thought, emotion, and sensation arises and dissolves.

---

## 🗺️ Sitemap & Navigation Flow

The app is structured to provide both structured learning and spontaneous regulation.

### 🏠 Core Hub
- **Dashboard (`/dashboard`):** The primary daily anchor. Features dynamic "soft" theming based on the day of the week, mindful stats, and personalized practice suggestions based on user intention.
- **Onboarding (`/onboarding`):** A gentle introduction that sets the user's focus and intent.

### 📚 Wisdom & Education
- **The Method (`/method`):** Deep dive into the Fourfold Axis philosophy.
- **Know Thyself (`/chapters`):** 16+ educational modules (Chapters) covering neurodivergence, nervous system regulation, and awareness techniques.
- **The Rabbit Hole (`/rabbithole`):** For those seeking the philosophical and scientific roots behind the practices.

### 🧘 Practice & Structure
- **8-Week Program (`/program`):** A structured, progressive journey from foundational grounding to advanced open awareness.
- **Practice Sanctuary (`/practice`):**
    - **Invisible Microdoses:** Brief, subtle exercises (15-60 sec) for "stealth" regulation.
    - **Movement & Body:** Yoga, stretching, and somatic grounding.
    - **Breathwork:** 4-7-8, Box Breathing, and specialized ADHD-friendly rhythms.
    - **Attention:** Training the focused and open gaze.

### 🕯️ Reflective & Rest Spaces
- **Digital Journal (`/journal`):** A space for reflection, supported by **Gemini AI** which analyzes patterns and suggests inquiry questions.
- **The Sanctuary (`/sanctuary`):** A low-stimulation environment with an integrated ambient sound engine (Ocean, Rain, Fire, Cat Purring).

### ⚙️ Utilities
- **Settings (`/settings`):** Language switching (Greek/English), accessibility controls, and theme customization.
- **FAQ (`/faq`):** Common questions about the method and the app.

---

## 🤖 Intelligence Layer: The Companion

Awareness Gateway features **Companion Intelligence**, powered by Google's **Gemini-3-Flash**. 

1.  **The Guide:** A persistent AI companion available via the `CompanionSheet` which offers real-time program customization and support.
2.  **Pattern Recognition:** The journal service uses LLM prompts to find recurring themes in user reflections and offer "Mirror Questions" for deeper inquiry.
3.  **Security First:** All AI interactions are proxied through a secure Express backend. API keys never reach the client-side, ensuring a production-grade infrastructure.

---

## 🎨 Design Language

-   **Aesthetic:** "Dark-Mode First" (#0f1117) with Teal accents (#1D9E75).
-   **Typography:** Editorial Serif (*Playfair Display*) for headings to evoke calm; *Space Grotesk* for technical UI; *Inter* for general readability.
-   **Philosophy:** Low-contrast, high-spacing. Designed to prevent sensory overload ("Sensory-Safe UI").
-   **Animation:** Staggered list entrances and route fades using `motion/react` to provide a sense of "breathing" within the interface.

---

## 💻 Tech Stack

-   **Frontend:** React 18, Vite, React Router, Tailwind CSS.
-   **Animation:** `motion/react` (Framer Motion).
-   **Backend:** Node.js / Express (Proxying AI requests).
-   **AI:** Google Generative AI (Gemini SDK).
-   **Persistence:** LocalStorage (Preferences & Progress).

---

## 📄 License & Credits

**Author:** [Theodoros Bairaktaris](https://github.com/theodorosbair)  
**License:** [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)

© 2025-2026 Awareness Gateway. All rights reserved.
