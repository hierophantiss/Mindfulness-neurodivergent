import { Activity, Moon, Calendar, Telescope, Compass, type LucideIcon } from 'lucide-react';

export interface MoreLink {
  to: string;
  icon: LucideIcon;
  tone: string;
  label: string;
  desc: string;
  sub?: string;
}

// The rest of the app, in one list: the home page's "More" and the cat's sheet
// show the same places with the same words.
export function getMoreLinks(lang: 'el' | 'en', programSub?: string): MoreLink[] {
  const el = lang === 'el';
  return [
    { to: '/practice', icon: Activity, tone: 'text-teal-300',
      label: el ? 'Ασκήσεις' : 'Practices',
      desc: el ? 'Αναπνοές, κίνηση & Τάι Τσι, ψάλσιμο, μικροδόσεις' : 'Breathing, movement & Tai Chi, chanting, microdoses' },
    { to: '/sanctuary', icon: Moon, tone: 'text-[#b4abce]',
      label: el ? 'Καταφύγιο' : 'Sanctuary',
      desc: el ? 'Ήχοι φύσης και binaural για ύπνο, χαλάρωση ή εστίαση' : 'Nature sounds and binaural beats for sleep, rest or focus' },
    { to: '/program', icon: Calendar, tone: 'text-[#b0c4aa]',
      label: el ? 'Πρόγραμμα 8 εβδομάδων' : '8-week Program',
      desc: el ? 'Ένα μικρό βήμα τη μέρα, με σειρά' : 'One small step a day, in order',
      sub: programSub },
    { to: '/rabbithole', icon: Telescope, tone: 'text-[#a695b0]',
      label: el ? 'Κουνελότρυπα' : 'Rabbit Hole',
      desc: el ? 'Πιο βαθιά κείμενα, όταν η πρακτική σταθεροποιηθεί' : 'Deeper texts, for when your practice feels steady' },
    { to: '/method', icon: Compass, tone: 'text-[#8ba3ba]',
      label: el ? 'Η Μέθοδος' : 'The Method',
      desc: el ? 'Τι είναι ο Τετραπλός Άξονας και πώς δουλεύει' : 'What the Fourfold Axis is and how it works' },
  ];
}
