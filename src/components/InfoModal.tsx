import { useFocusTrap } from '../hooks/useFocusTrap';
import { useAccessibility } from '../hooks/useAccessibility';
import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Anchor, Wind, Focus, Maximize, Heart, Info, CheckCircle2, BookOpen, Sparkles, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AXIS_COLOR } from '../data/stateCheckin';

// Where "Send me a message" goes. One place to change it later.
const CONTACT_EMAIL = 'bairaktaris.theodoros@gmail.com';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
    const { reduceMotion } = useAccessibility();
  const modalRef = useFocusTrap(isOpen, onClose);
  

  const { language } = useLanguage();

  const content = {
    title: { el: 'Ο Τετραπλός Άξονας', en: 'The Fourfold Axis' },
    subtitle: {
      el: 'Ένα σύστημα ενσυνειδητότητας σχεδιασμένο για τη νευροδιαφορετικότητα.',
      en: 'A mindfulness system designed for neurodivergent minds.'
    },
    purpose: {
      el: 'Μια μέθοδος σταδιακής επανασύνδεσης με τέσσερα κέντρα της εμπειρίας: Σώμα, Αναπνοή, Προσοχή, Χώρος. Σχεδιασμένη με σεβασμό στη νευροδιαφορετικότητα. Ξεκίνα με μικρές πρακτικές. Αντί για «άδειασμα του μυαλού», έρχεσαι σε επαφή με το καθένα και σιγά σιγά τα συντονίζεις.',
      en: 'A method of gradual reconnection with four centres of experience: Body, Breath, Attention, Space. Designed with respect for neurodivergence. Start with small practices. Instead of “emptying the mind”, you come into contact with each one and, little by little, attune them.'
    },
    features: {
      title: { el: 'Τι κάνει αυτό το εργαλείο διαφορετικό', en: 'What makes this tool different' },
      items: [
        { el: 'Δωρεάν, χωρίς λογαριασμό, χωρίς διαφημίσεις', en: 'Free, no account required, no ads' },
        { el: 'Σχεδιασμένο ειδικά για νευροδιαφορετικούς', en: 'Designed specifically for neurodivergent minds' },
        { el: 'Με φροντίδα για όσους ζουν με τραύμα: σέβεται τα όριά σου', en: 'Trauma-informed: respects your boundaries' },
        { el: 'Λειτουργεί offline — εγκατάσταση στο κινητό', en: 'Works offline — installable on mobile devices' },
        { el: 'Τα δεδομένα σου μένουν μόνο στη συσκευή σου', en: 'Your data stays entirely on your device' }
      ]
    },
    trauma: {
      title: { el: 'Πώς φροντίζει όσους ζουν με τραύμα', en: 'Why this guide is trauma-informed' },
      items: [
        { el: 'Ξεκινά πάντα από το σώμα — όχι από τη σκέψη. Η γείωση δημιουργεί αίσθηση ασφάλειας πριν ζητηθεί οτιδήποτε άλλο.', en: 'Starts with the body — not thought. Grounding creates a sense of safety before anything else is asked.' },
        { el: 'Δεν ζητάει «άδειασμα του νου». Η προσοχή επιστρέφει, δεν ελέγχει. Δεν υπάρχουν λάθη, μόνο πειράματα.', en: 'Never demands “emptying the mind”. Attention returns, it does not control. There are no mistakes, only experiments.' },
        { el: 'Σέβεται τα όρια — αν κάτι φέρνει δυσφορία, σταματάς.', en: 'Respects boundaries — if something brings discomfort, you simply stop.' },
        { el: 'Χρησιμοποιεί καλοσύνη αντί για κατάκριση.', en: 'Replaces judgment with kindness.' },
        { el: 'Δεν αντικαθιστά θεραπεία, διάγνωση ή φαρμακευτική αγωγή. Η στήριξη ενός θεραπευτή μπορεί να αποδειχθεί πολύτιμη.', en: 'It does not replace therapy, diagnosis or medication. The support of a therapist can prove valuable.' }
      ]
    },
    research: {
      title: { el: 'Τι λέει η έρευνα', en: 'What the research says' },
      items: [
        { el: 'Σε προγράμματα ενσυνειδητότητας 8 εβδομάδων έχουν βρεθεί αλλαγές σε περιοχές του εγκεφάλου που σχετίζονται με την αυτορρύθμιση.', en: '8-week mindfulness programmes have been linked to changes in brain areas involved in self-regulation.' },
        { el: 'Η αργή, μακριά εκπνοή συνδέεται με την ηρεμιστική πλευρά του νευρικού συστήματος.', en: 'A slow, long exhale is linked to the calming side of the nervous system.' },
        { el: 'Σε έμπειρους διαλογιστές, η πρακτική συνδέεται με πιο ήσυχο «αυτόματο πιλότο» — το δίκτυο που σχετίζεται με τη νοητική περιπλάνηση.', en: 'In experienced meditators, practice is linked to a quieter “autopilot” — the network involved in mind-wandering.' },
        { el: 'Οι σύντομες, συχνές πρακτικές γίνονται πιο εύκολα συνήθεια από τις σπάνιες μεγάλες.', en: 'Short, frequent practices become a habit more easily than rare long sessions.' }
      ],
      more: { el: 'Δες την έρευνα και τα όριά της →', en: 'See the research and its limits →' }
    },
    axesTitle: { el: 'Οι τέσσερις άξονες', en: 'The four axes' },
    axes: [
      {
        id: 'body' as const,
        icon: Anchor,
        title: { el: 'Σώμα', en: 'Body' },
        desc: {
          el: 'Η αίσθηση ότι κατοικείς σε ένα σώμα που αγγίζει, νιώθει και συνδέεται με τη γη μέσω της βαρύτητας.',
          en: 'The sense that you inhabit a body that touches, feels and connects to the earth through gravity.'
        }
      },
      {
        id: 'breath' as const,
        icon: Wind,
        title: { el: 'Αναπνοή', en: 'Breath' },
        desc: {
          el: 'Η επίγνωση του ρυθμού της ζωής σου, της συνεχούς ροής εισπνοής και εκπνοής που σε συνδέει με τον κόσμο.',
          en: 'Awareness of the rhythm of your life, the continuous flow of inhale and exhale that connects you to the world.'
        }
      },
      {
        id: 'attention' as const,
        icon: Focus,
        title: { el: 'Προσοχή', en: 'Attention' },
        desc: {
          el: 'Η ικανότητα να κατευθύνεις το φως της επίγνωσής σου: να εστιάζεις, να ανοίγεις ή να παρατηρείς.',
          en: 'The ability to direct the light of your awareness: to focus, to open or to observe.'
        }
      },
      {
        id: 'space' as const,
        icon: Maximize,
        title: { el: 'Χώρος', en: 'Space' },
        desc: {
          el: 'Η αίσθηση του ανοιχτού πεδίου μέσα και γύρω σου, στο οποίο σκέψεις, αισθήματα και αισθήσεις εμφανίζονται και εξαφανίζονται.',
          en: 'The sense of the open field within and around you, in which thoughts, feelings and sensations appear and disappear.'
        }
      }
    ],
    footer: {
      el: 'Σχεδιασμένο για νευροδιαφορετικούς.',
      en: 'Designed for neurodivergent individuals.'
    },
    creatorLabel: {
      el: 'ΔΗΜΙΟΥΡΓΟΣ',
      en: 'CREATOR'
    },
    creatorName: 'Theodoros Bairaktaris',
    creatorDesc: {
      el: 'Νευροδιαφορετικός ασκούμενος, με πάνω από 20 χρόνια πρακτικής σε παραδόσεις ενσυνειδητότητας (Tai Chi, σουφικός διαλογισμός, θιβετιανός βουδισμός).',
      en: 'A neurodivergent practitioner with over 20 years of practice in mindfulness traditions (Tai Chi, Sufi meditation, Tibetan Buddhism).'
    },
    creatorQuote: {
      el: '«Δεν είμαι δάσκαλος. Η πρακτική ήρθε από αλλού· η μετάφραση είναι δική μου, και η ευθύνη της επίσης.»',
      en: '“I am not a teacher. The practice came from elsewhere; the translation is mine, and so is the responsibility for it.”'
    },
    contact: {
      title: { el: 'Επικοινωνία', en: 'Contact' },
      text: { el: 'Σχόλια, ιδέες ή κάτι που δεν δούλεψε; Θα χαρώ να το μάθω.', en: 'Comments, ideas, or something that did not work? I would be glad to hear it.' },
      button: { el: 'Στείλε μου μήνυμα', en: 'Send me a message' },
      subject: { el: 'Για την εφαρμογή Ενσυνειδητότητας', en: 'About the Mindfulness app' },
      note: { el: 'Το μήνυμα φεύγει από το δικό σου email· η εφαρμογή δεν το βλέπει.', en: 'The message goes from your own email; the app never sees it.' },
      urgent: { el: 'Δεν είναι υπηρεσία υποστήριξης. Αν χρειάζεσαι άμεση βοήθεια, κάλεσε το 112.', en: 'This is not a support service. If you need help right now, call your local emergency number (112 in Europe).' }
    },
    privacy: {
      title: { el: 'Απόρρητο', en: 'Privacy' },
      text: {
        el: 'Όλα τα δεδομένα σου (πρόοδος, ημερολόγιο, ρυθμίσεις) μένουν μόνο στη συσκευή σου. Δεν συλλέγουμε, δεν παρακολουθούμε και δεν στέλνουμε πουθενά τις πληροφορίες σου. Η σελίδα φορτώνει γραμματοσειρές από τη Google και, αν κατεβάσεις τη φωνή ακρόασης, τα αρχεία της από το Hugging Face και δύο δημόσια δίκτυα αρχείων· αυτές οι υπηρεσίες βλέπουν μόνο ότι ζητήθηκε ένα αρχείο.',
        en: 'All your data (progress, journal, settings) stays only on your device. We do not collect, track or send your information anywhere. The page loads fonts from Google and, if you download the read-aloud voice, its files from Hugging Face and two public file networks; these services only see that a file was requested.'
      }
    }
  };

  const l = language === 'el' ? 'el' : 'en';

  // Rendered on <body>, so it sits above the bottom navigation.
  const modal = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 sm:p-4">
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a1a1a] border border-white/10 shape-cloud-2 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 md:p-8 pb-4 flex flex-col sm:flex-row items-start justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 w-fit mb-2">
                  <Info size={12} className="text-teal-400" />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-teal-400/80 uppercase">
                    {language === 'el' ? 'ΠΛΗΡΟΦΟΡΙΕΣ' : 'INFORMATION'}
                  </span>
                </div>
                <h2 id="info-modal-title" className="text-2xl md:text-3xl font-medium text-white tracking-tight">
                  {content.title[l]}
                </h2>
                <p className="text-sm text-white/40 leading-relaxed max-w-md">
                  {content.subtitle[l]}
                </p>
              </div>
              <button 
                onClick={onClose}
                aria-label="Close modal"
                className="w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400 absolute right-4 top-6 sm:static sm:right-auto sm:top-auto"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 custom-scrollbar space-y-8">
              
              {/* Welcome Description */}
              <div className="bg-gradient-to-r from-teal-500/10 to-[#4a9eca]/10 border border-teal-500/20 rounded-3xl p-5 md:p-6">
                <div className="flex items-center gap-2 text-teal-100 mb-2">
                  <Sparkles size={18} className="text-teal-400" />
                  <h3 className="text-sm font-medium tracking-wide">
                    {language === 'el' ? 'Καλώς ήρθες' : 'Welcome'}
                  </h3>
                </div>
                <p className="text-[14px] text-teal-50/90 leading-relaxed font-light">
                  {content.purpose[l]}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold tracking-wider uppercase text-teal-400/80 mb-3 flex items-center gap-2">
                   {content.features.title[l]}
                </h3>
                <ul className="space-y-2">
                  {content.features.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                       <CheckCircle2 size={16} className="text-teal-400/60 mt-0.5 shrink-0" />
                       <span className="text-sm text-white/70 leading-relaxed font-sans">{item[l]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trauma Informed */}
              <div className="space-y-3 bg-indigo-500/5 p-5 md:p-6 rounded-[2rem] border border-indigo-500/10">
                <h3 className="text-sm font-bold tracking-wider uppercase text-indigo-400/80 mb-3 flex items-center gap-2">
                   <Heart size={16} className="text-indigo-400/60" />
                   {content.trauma.title[l]}
                </h3>
                <ul className="space-y-3">
                  {content.trauma.items.map((item, idx) => (
                    <li key={idx} className="flex flex-col gap-1">
                       <span className="text-sm text-white/80 leading-relaxed font-sans flex items-start gap-2">
                         <span className="text-indigo-400 mt-1.5">•</span> {item[l]}
                       </span>
                    </li>
                  ))}
                </ul>
              </div>

               {/* Research Section */}
               <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider uppercase text-amber-400/80 mb-3 flex items-center gap-2">
                   <BookOpen size={16} className="text-amber-400/60" />
                   {content.research.title[l]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {content.research.items.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                      <p className="text-xs text-white/60 leading-relaxed font-sans">
                        {item[l]}
                      </p>
                    </div>
                  ))}
                </div>
                <Link to="/methodology" onClick={onClose} className="inline-block text-[12px] text-teal-400/80 hover:text-teal-300 transition-colors ml-1">
                  {content.research.more[l]}
                </Link>
              </div>


              {/* The 4 Axes grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold tracking-wider uppercase text-white/40 mb-3">
                   {content.axesTitle[l]}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {content.axes.map((axis) => (
                    <div key={axis.id} className="flex gap-3 px-4 py-3 rounded-3xl bg-white/[0.02] border border-white/5 items-start">
                      <div className="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center border border-white/5 bg-white/[0.03]">
                        <axis.icon size={18} style={{ color: AXIS_COLOR[axis.id] }} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm text-white font-medium">
                          {axis.title[l]}
                        </h4>
                        <p className="text-xs text-white/50 leading-relaxed">{axis.desc[l]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Creator & Privacy Section */}
              <div className="pt-6 border-t border-white/5 mt-8 flex flex-col items-center gap-3 text-center">
                <div className="flex flex-col items-center max-w-lg mb-4">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-teal-400 opacity-60">
                    {content.creatorLabel[l]}
                  </p>
                  <p className="text-lg font-medium text-white mt-1">
                    {content.creatorName}
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed mt-3 font-sans max-w-sm">
                    {content.creatorDesc[l]}
                  </p>
                  <p className="text-xs text-white/65 leading-relaxed mt-2 font-sans italic max-w-sm">
                    {content.creatorQuote[l]}
                  </p>
                </div>

                <div className="w-full max-w-sm flex flex-col items-center gap-3 border-t border-white/5 pt-5 pb-1">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-teal-400 opacity-60">
                    {content.contact.title[l]}
                  </p>
                  <p className="text-xs text-white/55 leading-relaxed">{content.contact.text[l]}</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(content.contact.subject[l])}`}
                    className="inline-flex items-center gap-2 px-5 min-h-[44px] rounded-full bg-white/[0.05] border border-white/[0.12] text-[13px] text-white/85 hover:bg-white/[0.09] transition-colors"
                  >
                    <Mail size={15} className="text-white/60" />
                    {content.contact.button[l]}
                  </a>
                  <p className="text-[11px] text-white/35 leading-relaxed">{content.contact.note[l]}</p>
                  <p className="text-[11px] text-white/45 leading-relaxed">{content.contact.urgent[l]}</p>
                </div>
                
                <div className="flex flex-col items-center max-w-sm border-t border-white/5 pt-4">
                  <p className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-1">
                    {content.privacy.title[l]}
                  </p>
                  <p className="text-[11px] text-white/35 leading-relaxed">
                    {content.privacy.text[l]}
                  </p>
                </div>

                <p className="text-[10px] font-bold tracking-widest uppercase opacity-30 mt-6 pb-2">
                  {content.footer[l]}
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
  return typeof document !== 'undefined' ? createPortal(modal, document.body) : null;
}
