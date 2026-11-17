import React, { createContext, useContext, useState, useEffect } from 'react';
import { readText, writeText } from '../lib/storage';

type Language = 'el' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/** Text used on many screens (one screen's own text sits beside its code). */
export const translations: Record<string, Record<Language, string>> = {
  // Layout
  'skip_to_content': { el: 'Μετάβαση στο κύριο περιεχόμενο', en: 'Skip to main content' },
  // Onboarding
  'onboarding.s1.title': { el: 'Για νου που τρέχει ή κλειδώνει', en: 'For minds that race or lock in' },
  'onboarding.s1.body': { el: 'Το μυαλό σου δεν είναι χαλασμένο, απλώς λειτουργεί αλλιώς. Σύντομες πρακτικές για νευροδιαφορετικούς ενήλικες και για όσους ζουν με τραύμα.', en: 'Your mind isn\'t broken, it just works differently. Short practices for neurodivergent adults and for anyone living with trauma.' },
  'onboarding.s2.title': { el: 'Δεν χρειάζεται να αδειάσεις το μυαλό σου', en: "You don't have to empty your mind" },
  'onboarding.s2.body': { el: 'Ούτε να μείνεις ακίνητος/η. Αν ο διαλογισμός δεν σου βγήκε ως τώρα, εδώ ξεκινάς αλλιώς: από το σώμα. Τέσσερα απλά βήματα, με αυτή τη σειρά: Σώμα, Αναπνοή, Προσοχή, Χώρος.', en: 'Nor to stay still. If meditation hasn\'t worked for you before, this starts differently: with the body. Four simple steps, in this order: Body, Breath, Attention, Space.' },
  'onboarding.s3.title': { el: 'Τι να περιμένεις', en: 'What to expect' },
  'onboarding.s3.body': { el: 'Δωρεάν, χωρίς λογαριασμό, χωρίς διαφημίσεις. Όλα μένουν στη συσκευή σου. Δεν μετράμε σερί: λίγα δευτερόλεπτα αρκούν, και αν χάσεις μέρες δεν πειράζει. Δεν είναι θεραπεία και δεν την αντικαθιστά.', en: "Free, no account, no ads. Everything stays on your device. We don't count streaks: a few seconds are enough, and missing days is fine. It is not therapy and does not replace it." },
  'onboarding.next': { el: 'Επόμενο', en: 'Next' },
  'onboarding.skip': { el: 'Παράλειψη', en: 'Skip' },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/el')) return 'el';
      if (path.startsWith('/en')) return 'en';
    }
    const saved = readText('mindfulness_lang');
    if (saved === 'en' || saved === 'el') return saved;
    // Autodetect based on system language
    if (typeof navigator !== 'undefined' && navigator.language) {
      if (navigator.language.startsWith('el')) return 'el';
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    writeText('mindfulness_lang', lang);
    setLanguageState(lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    // Installing the app gives it the name and shortcuts in this language.
    document.querySelector('link[rel="manifest"]')?.setAttribute('href', language === 'el' ? '/manifest-el.json' : '/manifest.json');
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
