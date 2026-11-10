import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../hooks/useLanguage';
import { CONTACT_EMAIL } from '../lib/links';

// The accessibility statement: what the app already does, how it is checked,
// what does not work well yet, and how to say so. Kept honest: when something
// here changes, the date and the lists change with it.

type Block = { title: string; paras?: string[]; list?: string[] };

const T: Record<'el' | 'en', { title: string; updated: string; short: string; blocks: Block[]; contactTitle: string; contact: string; subject: string }> = {
  el: {
    title: 'Δήλωση προσβασιμότητας',
    updated: 'Τελευταία ενημέρωση: 10 Νοεμβρίου 2026',
    short: 'Η εφαρμογή φτιάχτηκε για ανθρώπους με νευροδιαφορετικό νου, και θέλει να μπορεί να τη χρησιμοποιήσει ο καθένας. Εδώ γράφεται τι κάνει ήδη, τι δεν κάνει ακόμα καλά, και πώς λες αν κάτι σε δυσκολεύει.',
    blocks: [
      {
        title: 'Ο στόχος',
        paras: [
          'Στόχος είναι το επίπεδο AA των οδηγιών WCAG 2.2, του διεθνούς προτύπου για την προσβασιμότητα στον ιστό. Η εφαρμογή το ακολουθεί σε μεγάλο μέρος, όχι όμως ακόμα παντού (δες παρακάτω). Είναι λοιπόν μερικώς συμβατή.',
          'Η δήλωση αφορά τον ιστότοπο neurodivergent-mindfulness.org και τις εφαρμογές για Windows και Android, που έχουν το ίδιο περιεχόμενο.',
        ],
      },
      {
        title: 'Τι κάνει ήδη',
        list: [
          'Δύο γλώσσες, ελληνικά και αγγλικά. Η γλώσσα κάθε σελίδας δηλώνεται, ώστε οι αναγνώστες οθόνης να τη διαβάζουν σωστά.',
          'Μειωμένη κίνηση: η εφαρμογή ακολουθεί τη ρύθμιση της συσκευής σου, και έχει και δικό της διακόπτη στις Ρυθμίσεις.',
          'Εύκολη ανάγνωση (Ρυθμίσεις): λίγο μεγαλύτερα γράμματα, περισσότερος χώρος ανάμεσα σε γράμματα, λέξεις και γραμμές, χωρίς πλάγια.',
          'Μεγέθυνση: μπορείς να μεγαλώσεις τη σελίδα από τον browser ή τη συσκευή· η εφαρμογή δεν το εμποδίζει.',
          'Πληκτρολόγιο: τα κουμπιά δουλεύουν με το πληκτρολόγιο, υπάρχει σύνδεσμος «Μετάβαση στο κύριο περιεχόμενο», και τα παράθυρα κρατούν την εστίαση μέσα τους και κλείνουν με Esc. Στα κεφάλαια, τα βελάκια γυρίζουν σελίδα.',
          'Ήχος: κανένας ήχος δεν ξεκινά μόνος του. Κάθε ηχητικό κεφάλαιο έχει και το κείμενό του, ώστε να το διαβάζεις αντί να το ακούς.',
          'Ησυχία: χωρίς διαφημίσεις και χωρίς αναδυόμενα μηνύματα. Κάθε άσκηση σταματά όποτε θέλεις.',
          'Βοήθεια με ένα πάτημα: το SOS είναι πάντα στην αρχική.',
        ],
      },
      {
        title: 'Πώς ελέγχεται',
        list: [
          'Σε κάθε αλλαγή, πριν ανέβει στον ιστότοπο, ένας αυτόματος έλεγχος (axe) περνά από όλες τις κύριες σελίδες, στα ελληνικά και στα αγγλικά, σε κινητό και σε υπολογιστή.',
          'Η αντίθεση των κειμένων με το φόντο μετρήθηκε με τα χρώματα που φαίνονται πραγματικά στην οθόνη.',
          'Η εφαρμογή δεν έχει ελεγχθεί ακόμα από ανεξάρτητο φορέα, ούτε συστηματικά από ανθρώπους που χρησιμοποιούν αναγνώστη οθόνης. Αυτό είναι το επόμενο βήμα.',
        ],
      },
      {
        title: 'Τι δεν δουλεύει ακόμα καλά',
        list: [
          'Τα κινούμενα σχέδια των ασκήσεων είναι οπτικά. Ο ρυθμός (εισπνοή, εκπνοή) γράφεται και με λέξεις, όμως ένας αναγνώστης οθόνης δεν περιγράφει όλη την κίνηση.',
          'Λίγα μικρά κείμενα (τέσσερα στον τελευταίο έλεγχο) έχουν λίγο χαμηλότερη αντίθεση από το όριο.',
          'Σε πολύ μικρές οθόνες (πλάτος 320 pixel), η τελευταία κάρτα της υποδοχής θέλει κύλιση.',
          'Τα βίντεο της Κουνελότρυπας και του Καταφυγίου παίζουν από το YouTube· οι υπότιτλοι εξαρτώνται από το κάθε βίντεο.',
          'Τα αρχεία PDF (το βιβλίο, η εβδομάδα σου) δεν έχουν ελεγχθεί ακόμα για αναγνώστες οθόνης.',
        ],
      },
    ],
    contactTitle: 'Αν κάτι σε δυσκολεύει',
    contact: 'Γράψε στον δημιουργό της εφαρμογής, Theodoros Bairaktaris. Πες τι προσπάθησες να κάνεις, σε ποια σελίδα και με ποια συσκευή. Κάθε τέτοιο μήνυμα διαβάζεται και μπαίνει στη λίστα για διόρθωση.',
    subject: 'Προσβασιμότητα',
  },
  en: {
    title: 'Accessibility statement',
    updated: 'Last updated: 10 November 2026',
    short: 'The app was made for neurodivergent minds, and it wants everyone to be able to use it. This page says what it already does, what does not work well yet, and how to tell if something gets in your way.',
    blocks: [
      {
        title: 'The aim',
        paras: [
          'The aim is level AA of WCAG 2.2, the international standard for web accessibility. The app meets it in large part, but not everywhere yet (see below), so it is partially conformant.',
          'This statement covers the website neurodivergent-mindfulness.org and the Windows and Android apps, which have the same content.',
        ],
      },
      {
        title: 'What it already does',
        list: [
          'Two languages, Greek and English. Each page declares its language, so screen readers read it correctly.',
          'Reduced motion: the app follows your device setting, and it also has its own switch in Settings.',
          'Easy reading (Settings): slightly larger letters, more space between letters, words and lines, no slanted text.',
          'Zoom: you can enlarge the page from the browser or the device; the app does not prevent it.',
          'Keyboard: the buttons work with the keyboard, there is a "Skip to main content" link, and dialogs keep the focus inside them and close with Esc. In the chapters, the arrow keys turn the page.',
          'Sound: no sound starts on its own. Every audio chapter also has its text, so you can read instead of listening.',
          'Quiet: no ads and no pop-up messages. Every practice stops whenever you want.',
          'Help in one tap: SOS is always on the home page.',
        ],
      },
      {
        title: 'How it is checked',
        list: [
          'With every change, before it goes live, an automatic check (axe) runs through all main pages, in Greek and English, on phone and computer.',
          'The contrast of text against its background was measured with the colours actually shown on screen.',
          'The app has not yet been reviewed by an independent body, nor systematically by people who use a screen reader. That is the next step.',
        ],
      },
      {
        title: 'What does not work well yet',
        list: [
          'The practice animations are visual. The rhythm (in-breath, out-breath) is also written in words, but a screen reader does not describe the whole movement.',
          'A few small texts (four at the last check) have slightly lower contrast than the threshold.',
          'On very small screens (320 pixels wide), the last card of the welcome needs scrolling.',
          'The videos in the Rabbit Hole and the Sanctuary play from YouTube; captions depend on each video.',
          'The PDF files (the book, your week) have not yet been checked for screen readers.',
        ],
      },
    ],
    contactTitle: 'If something gets in your way',
    contact: 'Write to the creator of the app, Theodoros Bairaktaris. Say what you were trying to do, on which page and with which device. Every such message is read and goes on the list to be fixed.',
    subject: 'Accessibility',
  },
};

export default function Accessibility() {
  const { language } = useLanguage();
  const t = T[language === 'en' ? 'en' : 'el'];

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <div className="pt-2">
        <PageHeader back="/" title={t.title} lead={t.short}>
          <p className="text-[13px] text-ink/60">{t.updated}</p>
        </PageHeader>
      </div>

      {t.blocks.map(b => (
        <section key={b.title} className="flex flex-col gap-3">
          <h2 className="font-display text-[24px] leading-snug text-ink">{b.title}</h2>
          {b.paras?.map(p => <p key={p} className="text-[15.5px] leading-relaxed text-ink/80">{p}</p>)}
          {b.list && (
            <ul className="flex flex-col gap-2.5">
              {b.list.map(item => (
                <li key={item} className="flex gap-3 text-[15.5px] leading-relaxed text-ink/80">
                  <span className="mt-[11px] w-1.5 h-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className="card-relief rounded-3xl p-5 flex flex-col gap-2.5">
        <h2 className="font-display text-[24px] leading-snug text-ink">{t.contactTitle}</h2>
        <p className="text-[15.5px] leading-relaxed text-ink/80">{t.contact}</p>
        <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.subject)}`} className="text-[15.5px] text-sign-gold underline underline-offset-4 break-all">{CONTACT_EMAIL}</a>
      </section>
    </div>
  );
}
