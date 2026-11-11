// "How it is done", step by step, for the movements drawn from Theodoros's own
// videos. Each text says what the figure on the page does. The steps follow the
// practice's own phases (some start with the exhale; flows have pauses), and
// each breath step carries its length from the rhythm.
// Loaded only by the practice page (PracticeBreath).

type L = { el: string; en: string };
type Kind = 'stance' | 'in' | 'holdIn' | 'out' | 'holdOut' | 'care';

const HOLD_IN: L = {
  el: 'Μένεις λίγο εκεί, χωρίς να σφίγγεις.',
  en: 'Stay there a moment, without tightening.',
};
const HOLD_OUT: L = {
  el: 'Μένεις ήσυχα και νιώθεις το βάρος του σώματος στα πόδια.',
  en: 'Rest, and feel the weight of the body in your feet.',
};

const STEPS: Record<string, Partial<Record<Kind, L>>> = {
  '5-5': {
    stance: {
      el: 'Στέκεσαι με τα πόδια στο άνοιγμα των ώμων και τα γόνατα μαλακά· τα χέρια κρέμονται χαλαρά στο πλάι. Γίνεται και σε καρέκλα.',
      en: 'Stand with your feet shoulder-width apart and your knees soft; the arms hang loosely at your sides. It can also be done on a chair.',
    },
    in: {
      el: 'Τα χέρια ανεβαίνουν σε μεγάλο τόξο από το πλάι, τεντωμένα αλλά χαλαρά, ώσπου οι παλάμες ενώνονται πάνω από το κεφάλι.',
      en: 'The arms rise in a wide arc out to the sides, long but relaxed, until the palms meet above the head.',
    },
    out: {
      el: 'Οι ενωμένες παλάμες κατεβαίνουν από τη μέση, μπροστά από το πρόσωπο, ως το στήθος· εκεί χωρίζουν και τα χέρια ξαναπέφτουν στο πλάι.',
      en: 'The joined palms come down the middle, past the face, to the chest; there they part and the arms settle at your sides again.',
    },
    care: {
      el: 'Οι ώμοι μένουν κάτω, μακριά από τα αυτιά. Αν πονούν, σήκωσε τα χέρια μόνο όσο είναι άνετο.',
      en: 'The shoulders stay down, away from the ears. If they hurt, raise the arms only as far as is comfortable.',
    },
  },
  'be-like-a-flower-5-5': {
    stance: {
      el: 'Στέκεσαι με τα πόδια στο άνοιγμα των ώμων και τα γόνατα μαλακά· οι παλάμες ενωμένες μπροστά στο στήθος. Γίνεται και σε καρέκλα.',
      en: 'Stand with your feet shoulder-width apart and your knees soft; the palms joined in front of the chest. It can also be done on a chair.',
    },
    out: {
      el: 'Οι ενωμένες παλάμες ανεβαίνουν από τη μέση ως πάνω από το κεφάλι· εκεί χωρίζουν και τα χέρια ανοίγουν στο πλάι, ως το ύψος των ώμων.',
      en: 'The joined palms rise up the middle to above the head; there they part and the arms open out to the sides, to shoulder height.',
    },
    in: {
      el: 'Τα χέρια κατεβαίνουν στο πλάι, μαζεύονται μπροστά στην κοιλιά με τις παλάμες προς τα πάνω, και ανεβαίνουν μαζί ως το στήθος, όπου ενώνονται ξανά.',
      en: 'The arms come down at the sides, gather in front of the belly with the palms up, and rise together to the chest, where they join again.',
    },
    care: {
      el: 'Οι ώμοι μένουν χαλαροί, και η κίνηση ακολουθεί την ανάσα, όχι το αντίθετο.',
      en: 'The shoulders stay loose, and the movement follows the breath, not the other way round.',
    },
  },
  'tai-chi-cloud-hands': {
    stance: {
      el: 'Όρθια στάση, πόδια λίγο πιο ανοιχτά από τους ώμους, γόνατα λίγο λυγισμένα. Το ένα χέρι ψηλά μπροστά από το πρόσωπο, το άλλο χαμηλά μπροστά από την κοιλιά, με την παλάμη προς τα κάτω.',
      en: 'Standing, feet a little wider than the shoulders, knees slightly bent. One hand high in front of the face, the other low in front of the belly, palm down.',
    },
    in: {
      el: 'Στρίβεις από τη μέση προς τη μία πλευρά και το βάρος πηγαίνει στο πόδι εκείνης της πλευράς. Το πάνω χέρι περνά μπροστά από το πρόσωπο και ανοίγει στο πλάι, το κάτω περνά μπροστά από την κοιλιά. Στο τέλος της στροφής αλλάζουν θέση: όποιο ήταν κάτω ανεβαίνει.',
      en: 'Turn from the waist to one side and the weight goes to that foot. The upper hand passes in front of the face and opens out to the side, the lower one passes in front of the belly. At the end of the turn they change places: the one that was low rises.',
    },
    out: {
      el: 'Το ίδιο προς την άλλη πλευρά: το βάρος περνά στο άλλο πόδι, τα χέρια ξαναγράφουν τον κύκλο τους και στο τέλος αλλάζουν πάλι θέση, σαν να γυρίζεις μια μπάλα.',
      en: 'The same to the other side: the weight passes to the other foot, the hands draw their circle again and at the end change places once more, as if turning a ball.',
    },
    care: {
      el: 'Τα γόνατα μένουν μαλακά και κοιτάζουν μπροστά· στρίβει η μέση, όχι τα γόνατα.',
      en: 'The knees stay soft and face forward; the waist turns, not the knees.',
    },
  },
  'qigong-lifting-sky': {
    stance: {
      el: 'Στέκεσαι με τα πόδια στο άνοιγμα των ώμων και τα γόνατα μαλακά· τα χέρια κρέμονται στο πλάι. Γίνεται και σε καρέκλα.',
      en: 'Stand with your feet shoulder-width apart and your knees soft; the arms hang at your sides. It can also be done on a chair.',
    },
    in: {
      el: 'Τα χέρια έρχονται μπροστά από την κοιλιά, παλάμες προς τα πάνω, τα δάχτυλα το ένα προς το άλλο. Ανεβαίνουν μπροστά από το στήθος· στο ύψος του προσώπου οι παλάμες γυρίζουν μπροστά, και τα χέρια συνεχίζουν ψηλά ώσπου τεντώνονται πάνω από το κεφάλι σε ανοιχτό V, παλάμες στον ουρανό.',
      en: 'The hands come in front of the belly, palms up, fingers towards each other. They rise in front of the chest; at the height of the face the palms turn forward, and the arms go on up until they stretch above the head in a wide V, palms to the sky.',
    },
    holdIn: {
      el: 'Μένεις λίγο στο τέντωμα, χωρίς να σφίγγεις.',
      en: 'Stay in the stretch a moment, without tightening.',
    },
    out: {
      el: 'Τα χέρια κατεβαίνουν τεντωμένα σε μεγάλο τόξο από το πλάι· οι παλάμες σπρώχνουν απαλά προς τα έξω, ώσπου τα χέρια κρέμονται ξανά.',
      en: 'The long arms come down in a wide arc out to the sides; the palms push gently outwards, until the arms hang again.',
    },
    care: {
      el: 'Αν πονούν οι ώμοι, σήκωσε τα χέρια μόνο ως εκεί που είναι άνετο.',
      en: 'If your shoulders hurt, raise the arms only as far as is comfortable.',
    },
  },
  lotus: {
    stance: {
      el: 'Στέκεσαι με τα πόδια λίγο πιο ανοιχτά από τους ώμους και τα γόνατα μαλακά· οι παλάμες ενωμένες μπροστά στο στήθος. Γίνεται και σε καρέκλα.',
      en: 'Stand with your feet a little wider than the shoulders and your knees soft; the palms joined in front of the chest. It can also be done on a chair.',
    },
    in: {
      el: 'Οι ενωμένες παλάμες ανεβαίνουν από τη μέση, μπροστά από το πρόσωπο, ως πάνω από το κεφάλι. Εκεί χωρίζουν, τα χέρια στέκονται ίσια προς τα πάνω και ανοίγουν σε ανοιχτό V, με τις παλάμες στον ουρανό, σαν λωτός που ανθίζει.',
      en: 'The joined palms rise up the middle, past the face, to above the head. There they part, the arms stand straight up and open into a wide V, palms to the sky, like a lotus opening.',
    },
    out: {
      el: 'Τα χέρια ξαναέρχονται ίσια προς τα πάνω, οι παλάμες ενώνονται πάνω από το κεφάλι και κατεβαίνουν μαζί από τη μέση ως το στήθος.',
      en: 'The arms come back straight up, the palms meet above the head and come down the middle together to the chest.',
    },
    care: {
      el: 'Οι ώμοι μένουν χαλαροί· αν πονούν, άνοιξε τα χέρια λιγότερο.',
      en: 'The shoulders stay loose; if they hurt, open the arms less.',
    },
  },
};
STEPS['lotus-bloom-5-5'] = STEPS.lotus;

const LABEL: Record<Kind, L> = {
  stance: { el: 'Στάση', en: 'Stance' },
  in: { el: 'Εισπνοή', en: 'Inhale' },
  holdIn: { el: 'Κράτημα', en: 'Hold' },
  out: { el: 'Εκπνοή', en: 'Exhale' },
  holdOut: { el: 'Παύση', en: 'Pause' },
  care: { el: 'Προσοχή', en: 'Take care' },
};

export type Step = { label: string; text: string };

/** The steps for a movement, in the order of its own phases; null if it has none. */
export function movementSteps(
  movementType: string,
  phases: { dur: number; armFrom?: number; armTo?: number }[],
  language: 'el' | 'en',
): Step[] | null {
  const m = STEPS[movementType];
  if (!m) return null;
  const say = (l: L) => (language === 'el' ? l.el : l.en);
  const secs = (ms: number) => {
    const s = String(Math.round(ms / 100) / 10);
    return language === 'el' ? `${s.replace('.', ',')}″` : `${s} s`;
  };
  const out: Step[] = [];
  if (m.stance) out.push({ label: say(LABEL.stance), text: say(m.stance) });
  for (const ph of phases) {
    const from = Number(ph.armFrom ?? 0), to = Number(ph.armTo ?? 0);
    const kind: Kind = to > from ? 'in' : to < from ? 'out' : from >= 0.5 ? 'holdIn' : 'holdOut';
    const text = m[kind] ?? (kind === 'holdIn' ? HOLD_IN : kind === 'holdOut' ? HOLD_OUT : null);
    if (text) out.push({ label: `${say(LABEL[kind])} (${secs(ph.dur)})`, text: say(text) });
  }
  if (m.care) out.push({ label: say(LABEL.care), text: say(m.care) });
  return out;
}
