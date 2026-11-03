// "What would you change?": an email to the creator with the five questions
// of the user test already in it. It opens in the person's own email app;
// the app sends nothing and keeps nothing. The only details added are the
// kind of device and whether the app is installed, so that a problem can be
// placed, and the person sees them before sending.
import { CONTACT_EMAIL } from './links';

type Lang = 'el' | 'en';

const TEXT = {
  el: {
    subject: 'Τι θα άλλαζες; (Ενσυνειδητότητα για Νευροδιαφορετικούς)',
    intro: 'Γράψε όσα θέλεις, με όποια σειρά θέλεις. Όποια ερώτηση δεν σου λέει κάτι, άφησέ τη.',
    questions: [
      'Τι νόμιζες ότι είναι, όταν την πρωτοάνοιξες;',
      'Πού κόλλησες ή μπερδεύτηκες;',
      'Τι έκανες πρώτο; Ξαναγύρισες σε αυτό;',
      'Πότε βοήθησε, αν βοήθησε;',
      'Ένα πράγμα που θα άλλαζες:',
    ],
    installed: 'εγκατεστημένη',
    browser: 'στον browser',
    device: 'Συσκευή',
  },
  en: {
    subject: 'What would you change? (Neurodivergent Mindfulness)',
    intro: 'Write as much as you like, in any order. Skip any question that says nothing to you.',
    questions: [
      'What did you think it was when you first opened it?',
      'Where did you get stuck or confused?',
      'What did you do first? Did you come back to it?',
      'When did it help, if it did?',
      'One thing you would change:',
    ],
    installed: 'installed',
    browser: 'in the browser',
    device: 'Device',
  },
};

export function deviceKind(ua: string): string {
  if (/iPad|iPhone|iPod/.test(ua)) return 'iPhone/iPad';
  if (/Android/.test(ua)) return 'Android';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Macintosh|Mac OS X/.test(ua)) return 'Mac';
  if (/Linux/.test(ua)) return 'Linux';
  return '?';
}

export function feedbackBody(lang: Lang, device: string, installed: boolean): string {
  const t = TEXT[lang];
  const qs = t.questions.map((q, i) => `${i + 1}. ${q}\n\n`).join('\n');
  return `${t.intro}\n\n${qs}\n—\n${t.device}: ${device} · ${installed ? t.installed : t.browser}`;
}

export function feedbackMailto(lang: Lang): string {
  const installed = typeof window !== 'undefined' && !!window.matchMedia?.('(display-mode: standalone)').matches;
  const device = typeof navigator !== 'undefined' ? deviceKind(navigator.userAgent) : '?';
  const t = TEXT[lang];
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(feedbackBody(lang, device, installed))}`;
}
