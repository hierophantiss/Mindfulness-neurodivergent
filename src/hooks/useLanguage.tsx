import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'el' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { el: 'Αρχική', en: 'Home' },
  'nav.chapters': { el: 'Το Βιβλίο', en: 'Book' },
  'nav.program': { el: 'Νευρικό Σύστημα', en: 'Nervous System' },
  'nav.practice': { el: 'Πρακτική', en: 'Practice' },
  'nav.journal': { el: 'Ημερολόγιο', en: 'Journal' },
  
  // Home
  'home.introTitle': { el: 'Καλώς ήρθατε στο N-Mindfulness', en: 'Welcome to N-Mindfulness' },
  'home.introText': { el: 'Η μέθοδός μας είναι μια μέθοδος «αυτο-χαλάρωσης» και όχι πιεστικής αυτο-συγκέντρωσης. Δεν απαιτεί να αδειάσεις το μυαλό σου, ούτε να μείνεις ακίνητος. Μαθαίνουμε να βγαίνουμε από τον "αυτόματο πιλότο" και να δημιουργούμε χώρο, ρυθμίζοντας το νευρικό σύστημα.', en: 'Our method is one of "auto-relaxation" rather than forced concentration. It does not require you to empty your mind, nor to stay perfectly still. We learn how to step out of the "autopilot" and create space, regulating the nervous system.' },
  
  // Welcome Modal
  'welcome.title': { el: 'Καλώς ήρθατε στο N-Mindfulness', en: 'Welcome to N-Mindfulness' },
  'welcome.p1': { el: 'Η μέθοδός μας προσφέρει «αυτο-χαλάρωση» και όχι πιεστική αυτο-συγκέντρωσης. Δεν απαιτεί να αδειάσεις το μυαλό σου, ούτε να αναμετρηθείς με τις σκέψεις σου. Δεν υπάρχει βιασύνη, βία ή "αποτυχία".', en: 'Our method is one of "auto-relaxation" rather than forced concentration. It does not require you to empty your mind or fight your thoughts. There is no rush, no violence, and no "failure".' },
  'welcome.p3': { el: 'Μαθαίνουμε πώς να βγαίνουμε από τον «αυτόματο πιλότο» (DMN) και να δημιουργούμε χώρο. Χρησιμοποιούμε τη βαρύτητα ως σταθερή άγκυρα, την ανοιχτή προσοχή και την απλή καλοσύνη για να ρυθμίσουμε το νευρικό μας σύστημα.', en: 'We learn how to voluntarily step out of the "autopilot" (DMN) and create space. We use gravity as a stable anchor, open attention, and simple kindness to regulate our nervous system.' },
  'welcome.startBtn': { el: 'Ας ξεκινήσουμε', en: 'Let\'s begin' },
  'welcome.closeBtn': { el: 'Κλείσιμο', en: 'Close' },
  'skip_to_content': { el: 'Μετάβαση στο κύριο περιεχόμενο', en: 'Skip to main content' },
  'nav.intro': { el: 'Εισαγωγή', en: 'Intro' },

  // Onboarding

  'onboarding.s1.title': { el: 'Το μυαλό σου δεν είναι χαλασμένο', en: 'Your mind isn\'t broken' },
  'onboarding.s1.body': { el: 'Απλά λειτουργεί αλλιώς. Αυτή η εφαρμογή σε βοηθά να μάθεις να ρυθμίζεις το νευρικό σου σύστημα: να ηρεμείς όταν είσαι σε υπερδιέγερση, να ενεργοποιείσαι όταν έχεις «παγώσει». Με σύντομες πρακτικές σχεδιασμένες για νευροδιαφορετικά μυαλά — ADHD, αυτισμό, δυσπραξία.', en: 'It just works differently. This app helps you learn to regulate your nervous system: to calm down when you\'re overstimulated, to re-energize when you\'ve shut down. With short practices designed for neurodivergent minds — ADHD, autism, dyspraxia.' },
  
  'onboarding.s2.title': { el: 'Τέσσερις δρόμοι, όχι ένας «σωστός»', en: 'Four paths, no single "right way"' },
  'onboarding.s2.body': { el: 'Δεν υπάρχει ένας σωστός τρόπος διαλογισμού. Υπάρχουν τέσσερις δρόμοι — Σώμα, Αναπνοή, Προσοχή, Χώρος — και η εφαρμογή σε βοηθά να βρεις ποιος ταιριάζει στην κατάστασή σου τώρα. Πες της πώς νιώθεις, και θα σου προτείνει μια άσκηση 2–5 λεπτών. Όχι 20λεπτες συνεδρίες, όχι ενοχές αν χάσεις μέρες.', en: 'There\'s no one correct way to meditate. There are four paths — Body, Breath, Attention, Space — and the app helps you find the one that fits your state right now. Tell it how you feel, and it suggests a 2–5 minute practice. No 20-minute sessions, no guilt if you miss days.' },

  'onboarding.s3.title': { el: 'Όλα μένουν στη συσκευή σου', en: 'Everything stays on your device' },
  'onboarding.s3.body': { el: 'Χωρίς λογαριασμό, χωρίς tracking, χωρίς διαφημίσεις, χωρίς AI. Εντελώς δωρεάν. Τα δεδομένα σου είναι δικά σου — μπορείς να τα εξάγεις ή να τα σβήσεις όποτε θέλεις.', en: 'No account, no tracking, no ads, no AI. Completely free. Your data is yours — export it or delete it whenever you want.' },

  'onboarding.next': { el: 'Επόμενο', en: 'Next' },
  'onboarding.skip': { el: 'Παράλειψη', en: 'Skip' },
  'onboarding.start': { el: 'Ας ξεκινήσουμε', en: 'Let\'s begin' },
  'home.methodBtn': { el: 'Η Μέθοδος & τα Σύμβολα', en: 'The Method & Symbols' },
  'home.methodBtnSub': { el: 'Ο Ελέφαντας & η Μαϊμού', en: 'The Elephant & The Monkey' },
  'home.rabbitHole': { el: 'Κουνελότρυπα', en: 'Rabbit Hole' },
  'home.rabbitHoleSub': { el: 'IFS, Αλληγορίες & Χάρτες του Νου', en: 'IFS, Allegories & Maps of Mind' },
  'home.needCalm': { el: 'Χρειάζομαι ηρεμία τώρα', en: 'I need calm now' },
  'home.needCalmSub': { el: 'Αναπνοή, SOS ή μικρή δόση', en: 'Breath, SOS, or a micro dose' },
  'home.read': { el: 'Θέλω να μάθω', en: 'I want to learn' },
  'home.readSub': { el: 'Κεφάλαια & Πρόγραμμα', en: 'Chapters & 8-week program' },
  'home.practice': { el: 'Θέλω να ασκηθώ', en: 'I want to practice' },
  'home.practiceSub': { el: 'Ασκήσεις & Micro-samples', en: 'Exercises & Micro-samples' },
  'home.downloadPdfTitle': { el: 'Βιβλίο', en: 'Book' },
  'home.downloadPdfSub': { el: 'PDF Λήψη', en: 'PDF Download' },
  'home.installAppTitle': { el: 'Εφαρμογή', en: 'App' },
  'home.installAppSub': { el: 'Εγκατάσταση (PWA)', en: 'Install (PWA)' },
  
  // Settings / PWA
  'alert.music': { el: 'Η μουσική συγκέντρωσης θα προστεθεί σύντομα!', en: 'Focus music will be added soon!' },
  'alert.notifications': { el: 'Οι ειδοποιήσεις θα προστεθούν σύντομα!', en: 'Notifications will be added soon!' },
  'alert.pwa': { el: 'Η προσθήκη στην αρχική οθόνη (PWA) θα συμπληρωθεί σύντομα!', en: 'Add to Home Screen (PWA) will be implemented soon!' }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/el')) return 'el';
      if (path.startsWith('/en')) return 'en';
    }
    const saved = localStorage.getItem('mindfulness_lang');
    if (saved === 'en' || saved === 'el') return saved;
    // Autodetect based on system language
    if (typeof navigator !== 'undefined' && navigator.language) {
      if (navigator.language.startsWith('el')) return 'el';
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('mindfulness_lang', lang);
    setLanguageState(lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
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
