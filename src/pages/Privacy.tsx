import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

// Privacy, and what the app is and is not. The page the app stores link to as
// the privacy policy; it says the same as "About", in full.
const CONTACT_EMAIL = 'bairaktaris.theodoros@gmail.com';

type Block = { title: string; paras?: string[]; list?: string[]; after?: string[] };

const T: Record<'el' | 'en', { title: string; updated: string; short: string; blocks: Block[]; crisisTitle: string; crisis: string[]; crisisAbroad: string; contactTitle: string; contact: string; back: string }> = {
  el: {
    title: 'Απόρρητο και όροι',
    updated: 'Τελευταία ενημέρωση: 31 Οκτωβρίου 2026',
    short: 'Με λίγα λόγια: ό,τι κάνεις στην εφαρμογή μένει στη συσκευή σου. Η εφαρμογή δεν έχει λογαριασμό, δεν συλλέγει προσωπικά δεδομένα, δεν έχει διαφημίσεις ούτε παρακολούθηση.',
    blocks: [
      {
        title: 'Τι κρατά η εφαρμογή, και πού',
        paras: ['Για να θυμάται πού σταμάτησες, η εφαρμογή κρατά στη συσκευή σου, στον αποθηκευτικό χώρο του browser:'],
        list: [
          'την πρόοδό σου στα κεφάλαια και στο Πρόγραμμα 8 εβδομάδων,',
          'ό,τι γράφεις στο Ημερολόγιο,',
          'ποιες ασκήσεις έκανες, πότε και για πόση ώρα,',
          'τις απαντήσεις σου στο «Πώς νιώθεις τώρα;»,',
          'τις ρυθμίσεις σου (γλώσσα, εύκολη ανάγνωση, μείωση κίνησης, ταχύτητα ακρόασης),',
          'τα κεφάλαια που άκουσες, ώστε να παίζουν και χωρίς σύνδεση.',
        ],
        after: ['Τίποτα από αυτά δεν φεύγει από τη συσκευή. Δεν το βλέπει ούτε ο δημιουργός της εφαρμογής ούτε κανείς άλλος.'],
      },
      {
        title: 'Τι δεν κάνει η εφαρμογή',
        list: [
          'Δεν ζητά λογαριασμό, όνομα ή email.',
          'Δεν βάζει cookies και δεν έχει εργαλεία που μετρούν τι κάνει ο κάθε επισκέπτης.',
          'Δεν έχει διαφημίσεις.',
          'Δεν πουλά και δεν μοιράζεται δεδομένα, γιατί δεν έχει.',
          'Φορτώνει τις γραμματοσειρές από τον ίδιο τον ιστότοπο, όχι από τη Google.',
        ],
      },
      {
        title: 'Οι υπηρεσίες από τις οποίες περνάει',
        list: [
          'Φιλοξενία: ο ιστότοπος φιλοξενείται στο Cloudflare. Όπως κάθε διακομιστής, βλέπει τη διεύθυνση IP της συσκευής για να στείλει τη σελίδα, και κρατά συνολικά στατιστικά (π.χ. πόσες επισκέψεις έγιναν μια μέρα), όχι στατιστικά ανά άτομο.',
          'Ήχος: τα κεφάλαια και το ακουστικό βιβλίο έρχονται μέσα από τον ίδιο τον ιστότοπο.',
          'Βίντεο: στην Κουνελότρυπα και στο Καταφύγιο, οι εικόνες των βίντεο έρχονται από το YouTube, και τα βίντεο παίζουν από το YouTube, στη λειτουργία του χωρίς cookies παρακολούθησης. Όταν ανοίγεις αυτά τα βίντεο, το YouTube (Google) βλέπει τη διεύθυνση IP σου και ισχύει η δική του πολιτική απορρήτου.',
          'Email: αν γράψεις στον δημιουργό, το μήνυμα φεύγει από το δικό σου email και κρατιέται μόνο για να σου απαντήσει.',
        ],
      },
      {
        title: 'Τα δεδομένα σου, στο χέρι σου',
        list: [
          'Αντίγραφο: Ρυθμίσεις → Αποθήκευση Δεδομένων φτιάχνει ένα αρχείο με όλα όσα κρατά η εφαρμογή. Το αρχείο είναι δικό σου και μένει όπου το αποθηκεύσεις. Το επαναφέρεις από Ρυθμίσεις → Ανάκτηση.',
          'Διαγραφή: Ρυθμίσεις → Διαγραφή Δεδομένων σβήνει τα πάντα από τη συσκευή. Το ίδιο κάνει και η διαγραφή των δεδομένων του ιστότοπου από τον browser, ή η απεγκατάσταση της εφαρμογής.',
          'Δεν χρειάζεται να ζητήσεις διαγραφή από κανέναν: αντίγραφο των δεδομένων σου δεν υπάρχει πουθενά αλλού.',
        ],
      },
      {
        title: 'Τι είναι και τι δεν είναι η εφαρμογή',
        paras: [
          'Είναι ένας οδηγός ενσυνειδητότητας και αυτορρύθμισης, για την ευεξία. Δεν είναι θεραπεία, ιατρική συμβουλή, διάγνωση ή ιατρική συσκευή, και δεν αντικαθιστά επαγγελματία υγείας.',
          'Όπου αναφέρεται έρευνα, λέει τι βρήκαν συγκεκριμένες μελέτες. Η μέθοδος του Τετραπλού Άξονα ως σύνολο δεν έχει μελετηθεί.',
          'Σταμάτα κάθε άσκηση αν νιώσεις ζάλη, δυσφορία ή πίεση, και γύρνα στη φυσική σου αναπνοή. Αν έχεις καρδιακό ή αναπνευστικό πρόβλημα, αν είσαι έγκυος, ή αν το κράτημα της αναπνοής σε αγχώνει, ρώτα πρώτα επαγγελματία υγείας για τις ασκήσεις με κράτημα.',
          'Η εφαρμογή είναι γραμμένη για ενήλικες.',
        ],
      },
      {
        title: 'Άδεια χρήσης',
        paras: ['Η εφαρμογή και το βιβλίο είναι δωρεάν. Το βιβλίο διατίθεται με την άδεια Creative Commons BY-NC-ND 4.0: μπορείς να το μοιραστείς, με αναφορά στον δημιουργό, χωρίς αλλαγές και όχι για εμπορική χρήση.'],
      },
    ],
    crisisTitle: 'Αν χρειάζεσαι βοήθεια τώρα',
    crisis: [
      'Η εφαρμογή δεν είναι υπηρεσία υποστήριξης. Αν κινδυνεύεις ή χρειάζεσαι βοήθεια αυτή τη στιγμή:',
      '112 · έκτακτη ανάγκη, σε όλη την Ευρώπη',
      '1018 · Κλίμακα, 24ωρη γραμμή',
      '197 · δωρεάν, 24ωρη ψυχοκοινωνική στήριξη',
    ],
    crisisAbroad: 'Εκτός Ελλάδας: findahelpline.com',
    contactTitle: 'Υπεύθυνος και επικοινωνία',
    contact: 'Theodoros Bairaktaris, δημιουργός της εφαρμογής. Για οτιδήποτε σχετικό με το απόρρητο:',
    back: 'Πίσω',
  },
  en: {
    title: 'Privacy and terms',
    updated: 'Last updated: 31 October 2026',
    short: 'In short: whatever you do in the app stays on your device. The app has no account, collects no personal data, and has no ads and no tracking.',
    blocks: [
      {
        title: 'What the app keeps, and where',
        paras: ['To remember where you stopped, the app keeps on your device, in the browser’s storage:'],
        list: [
          'your progress in the chapters and in the 8-week Program,',
          'what you write in the Journal,',
          'which practices you did, when and for how long,',
          'your answers to “How do you feel right now?”,',
          'your settings (language, easy reading, reduced motion, listening speed),',
          'the chapters you listened to, so they play offline too.',
        ],
        after: ['None of this leaves the device. Neither the creator of the app nor anyone else sees it.'],
      },
      {
        title: 'What the app does not do',
        list: [
          'It does not ask for an account, a name or an email.',
          'It sets no cookies and has no tools that measure what each visitor does.',
          'It has no ads.',
          'It does not sell or share data, because it has none.',
          'It loads its fonts from the site itself, not from Google.',
        ],
      },
      {
        title: 'The services it passes through',
        list: [
          'Hosting: the site is hosted on Cloudflare. Like any server, it sees the device’s IP address in order to send the page, and it keeps overall statistics (for example, how many visits there were in a day), not statistics per person.',
          'Audio: the chapters and the audiobook come through the site itself.',
          'Videos: in the Rabbit Hole and the Sanctuary, the video pictures come from YouTube, and the videos play from YouTube, in its mode without tracking cookies. When you open these videos, YouTube (Google) sees your IP address and its own privacy policy applies.',
          'Email: if you write to the creator, the message goes from your own email and is kept only to reply to you.',
        ],
      },
      {
        title: 'Your data, in your hands',
        list: [
          'Copy: Settings → Save Data makes a file with everything the app keeps. The file is yours and stays wherever you save it. You restore it from Settings → Restore.',
          'Deletion: Settings → Clear Data erases everything from the device. So does clearing the site’s data in the browser, or uninstalling the app.',
          'You do not need to ask anyone to delete anything: no copy of your data exists anywhere else.',
        ],
      },
      {
        title: 'What the app is and is not',
        paras: [
          'It is a guide to mindfulness and self-regulation, for wellbeing. It is not therapy, medical advice, diagnosis or a medical device, and it does not replace a health professional.',
          'Where research is mentioned, it says what particular studies found. The Fourfold Axis method as a whole has not been studied.',
          'Stop any practice if you feel dizzy, uncomfortable or pressured, and return to your natural breath. If you have a heart or breathing condition, if you are pregnant, or if holding the breath makes you anxious, ask a health professional first about the practices with a hold.',
          'The app is written for adults.',
        ],
      },
      {
        title: 'Licence',
        paras: ['The app and the book are free. The book is available under the Creative Commons BY-NC-ND 4.0 licence: you may share it, crediting the author, without changes and not for commercial use.'],
      },
    ],
    crisisTitle: 'If you need help now',
    crisis: [
      'The app is not a support service. If you are in danger or need help right now:',
      '112 · emergency number across Europe',
      'Greece: 1018 · Klimaka, 24-hour line',
    ],
    crisisAbroad: 'Elsewhere: findahelpline.com',
    contactTitle: 'Who is responsible, and contact',
    contact: 'Theodoros Bairaktaris, creator of the app. For anything about privacy:',
    back: 'Back',
  },
};

export default function Privacy() {
  const { language } = useLanguage();
  const t = T[language === 'en' ? 'en' : 'el'];

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 pt-2">
        <Link to="/" aria-label={t.back} className="btn-zen !px-3 !py-3">
          <ArrowLeft size={20} />
        </Link>
      </div>

      <header className="flex flex-col gap-3">
        <h1 className="font-display text-[38px] desk:text-[52px] leading-[1.05] text-ink">{t.title}</h1>
        <p className="text-[13px] text-ink/60">{t.updated}</p>
        <p className="text-[16.5px] leading-relaxed text-ink/90">{t.short}</p>
      </header>

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
          {b.after?.map(p => <p key={p} className="text-[15.5px] leading-relaxed text-ink/90">{p}</p>)}
        </section>
      ))}

      <section aria-labelledby="privacy-crisis" className="card-relief rounded-3xl p-5 flex flex-col gap-2.5 border-[var(--tint-rose-line)]">
        <h2 id="privacy-crisis" className="font-display text-[22px] text-[var(--tint-rose-ink)]">{t.crisisTitle}</h2>
        <p className="text-[15px] leading-relaxed text-ink/80">{t.crisis[0]}</p>
        <ul className="flex flex-col gap-1.5">
          {t.crisis.slice(1).map(line => {
            const num = line.match(/\d{3,4}/)?.[0];
            return (
              <li key={line} className="text-[15.5px] text-ink/90">
                {num ? <>{line.slice(0, line.indexOf(num))}<a href={`tel:${num}`} className="font-medium text-[var(--tint-rose-ink)] underline underline-offset-4">{num}</a>{line.slice(line.indexOf(num) + num.length)}</> : line}
              </li>
            );
          })}
        </ul>
        <p className="text-[14px] text-ink/70">
          <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ink/90">{t.crisisAbroad}</a>
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-[24px] leading-snug text-ink">{t.contactTitle}</h2>
        <p className="text-[15.5px] leading-relaxed text-ink/80">{t.contact}</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-[15.5px] text-sign-gold underline underline-offset-4 break-all">{CONTACT_EMAIL}</a>
      </section>
    </div>
  );
}
