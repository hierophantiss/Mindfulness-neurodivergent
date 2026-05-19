import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Anchor, Wind, Focus, Maximize, Heart, Info, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const { language } = useLanguage();

  const content = {
    title: { el: 'Ο Τετραπλός Άξονας', en: 'The Fourfold Axis' },
    subtitle: { 
      el: 'Ένα σύστημα ενσυνειδητότητας σχεδιασμένο για τη νευροδιαφορετικότητα.', 
      en: 'A mindfulness system designed for neurodivergent minds.' 
    },
    purpose: {
      el: 'Μια μέθοδος απελευθέρωσης της επίγνωσης, σχεδιασμένη με σεβασμό στη νευροδιαφορετικότητα. Ξεκινήστε την εξερεύνηση σας με μικρές πρακτικές αναπνοής, κίνησης και εστίασης στα παρακάτω κεφάλαια. Αντί για "άδειαμα του μυαλού", καλλιεργούμε την επίγνωση των τεσσάρων διαστάσεων της εμπειρίας.',
      en: 'An awareness unbinding method tailored for neurodivergence. Start your exploration with gentle micro-practices in breath, movement, and focus in the chapters below. Instead of "emptying the mind", we cultivate awareness across four dimensions of experience.'
    },
    features: {
      title: { el: 'Τι κάνει αυτό το εργαλείο διαφορετικό', en: 'What makes this tool different' },
      items: [
        { el: 'Δωρεάν, χωρίς λογαριασμό, χωρίς διαφημίσεις', en: 'Free, no account required, no ads' },
        { el: 'Σχεδιασμένο ειδικά για νευροδιαφορετικούς', en: 'Designed specifically for neurodivergent minds' },
        { el: 'Trauma-informed: σέβεται τα όριά σου', en: 'Trauma-informed: respects your boundaries' },
        { el: 'Λειτουργεί offline — εγκατάσταση στο κινητό', en: 'Works offline — installable on mobile devices' },
        { el: 'Τα δεδομένα σου μένουν μόνο στη συσκευή σου', en: 'Your data stays entirely on your device' }
      ]
    },
    trauma: {
      title: { el: 'Γιατί αυτός ο οδηγός είναι trauma-informed', en: 'Why this guide is trauma-informed' },
      items: [
        { el: 'Ξεκινά πάντα από το σώμα — όχι από τη σκέψη. Η γείωση δημιουργεί αίσθηση ασφάλειας πριν ζητηθεί οτιδήποτε άλλο.', en: 'Starts with the body — not thought. Grounding creates a sense of safety before anything else is asked.' },
        { el: 'Δεν ζητάει «άδειασμα του νου». Η προσοχή επιστρέφει, δεν ελέγχει. Κάθε αποτυχία είναι μέρος της άσκησης.', en: 'Never demands "emptying the mind". Attention returns gently. Every "failure" is part of the practice.' },
        { el: 'Σέβεται τα όρια — αν κάτι φέρνει δυσφορία, σταματάς.', en: 'Respects boundaries — if something brings discomfort, you simply stop.' },
        { el: 'Χρησιμοποιεί καλοσύνη αντί για κατάκριση.', en: 'Replaces judgment with kindness.' }
      ]
    },
    research: {
      title: { el: 'Γιατί αυτό λειτουργεί — Η έρευνα', en: 'Why this works — The research' },
      items: [
        { icon: '🧠', el: 'Η γείωση αλλάζει τον εγκέφαλο. 8 εβδομάδες πρακτικής ενσυνειδητότητας αυξάνουν το πάχος του φλοιού στην insula και τον ιππόκαμπο — περιοχές που συνδέουν αίσθηση, μνήμη και αυτορρύθμιση.', en: 'Grounding rewires the brain. 8 weeks of practice increases cortical thickness in the insula and hippocampus — linking sensation, memory, and regulation.' },
        { icon: '🫁', el: 'Η αργή εκπνοή ενεργοποιεί το πνευμονογαστρικό νεύρο. Η εκπνοή μεγαλύτερη από την εισπνοή (όπως το 4-2-6-1) ενεργοποιεί τον παρασυμπαθητικό κλάδο, μειώνει καρδιακό ρυθμό και κορτιζόλη.', en: 'Slow exhalation activates the vagus nerve. Longer out-breaths trigger the parasympathetic branch, reducing cortisol and heart rate.' },
        { icon: '👁', el: 'Η προσοχή μεταμορφώνει τη δομή. Η εστιασμένη προσοχή ενισχύει τον προμετωπιαίο φλοιό — θεμέλιο της αυτορρύθμισης και της ικανότητας «επιστροφής».', en: 'Attention builds structure. Focused attention strengthens the prefrontal cortex — the foundation of self-regulation.' },
        { icon: '🌊', el: 'Η ενσυνειδητότητα ρυθμίζει τον «αυτόματο πιλότο». Η πρακτική μειώνει τη δραστηριότητα του Default Mode Network — το δίκτυο που ευθύνεται για τη νοητική περιπλάνηση.', en: 'Practice regulates the "autopilot". It reduces activity in the Default Mode Network — the core network for rumination and mind-wandering.' },
        { icon: '❤️', el: 'Η καρδιακή συνοχή βελτιώνεται. Ρυθμική αναπνοή 5-5 (6 αναπνοές/λεπτό) συγχρονίζει τη μεταβλητότητα καρδιακού ρυθμού, μειώνοντας το άγχος.', en: 'Heart coherence improves. Rhythmic 5-5 breathing synchronizes heart rate variability, actively reducing anxiety.' },
        { icon: '⚡', el: 'Μικρές δόσεις, μεγάλα αποτελέσματα. Σύντομες αλλά συχνές πρακτικές (5 δευτ. × πολλές φορές) είναι πιο αποτελεσματικές από μεγάλες συνεδρίες, λόγω του spacing effect.', en: 'Small doses, big impact. Short but frequent interventions are highly effective, leveraging the neurological spacing effect.' }
      ]
    },
    axesTitle: { el: 'Οι 4 Άξονες', en: 'The 4 Axes' },
    axes: [
      {
        id: 'body',
        icon: Anchor,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        title: { el: 'Σώμα & Βαρύτητα', en: 'Body & Gravity' },
        desc: { 
          el: 'Η γείωση μέσω της αίσθησης του βάρους. Μαθαίνουμε να νιώθουμε την υποστήριξη της γης, παρέχοντας ένα αίσθημα ασφάλειας.',
          en: 'Grounding through the sensation of weight. We learn to feel the earth\'s support, providing a sense of safety.'
        }
      },
      {
        id: 'breath',
        icon: Wind,
        color: 'text-teal-400',
        bg: 'bg-teal-500/10',
        title: { el: 'Ανάσα', en: 'Breath' },
        desc: { 
          el: 'Ο ρυθμικός σύνδεσμος μεταξύ εσωτερικού και εξωτερικού κόσμου. Μια άγκυρα που είναι πάντα διαθέσιμη.',
          en: 'The rhythmic link between internal and external worlds. An anchor that is always available.'
        }
      },
      {
        id: 'attention',
        icon: Focus,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        title: { el: 'Προσοχή', en: 'Attention' },
        desc: { 
          el: 'Η ικανότητα να στρέφουμε τον προβολέα της συνείδησης. Αναγνωρίζουμε πότε η προσοχή "κολλάει" και την επιστρέφουμε.',
          en: 'The ability to direct the spotlight of consciousness. We recognize when attention gets "stuck" and return it.'
        }
      },
      {
        id: 'space',
        icon: Maximize,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        title: { el: 'Χώρος', en: 'Space' },
        desc: { 
          el: 'Η ανοιχτή επίγνωση. Συνειδητοποιούμε ότι δεν είμαστε οι σκέψεις μας, αλλά ο απεριόριστος χώρος.',
          en: 'Open awareness. We realize that we are not our thoughts, but the vast space.'
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
      el: 'Νευροδιαφορετικός ασκούμενος με πάνω από 20 χρόνια πρακτικής σε παραδόσεις ενσυνειδητότητας (Tai Chi, Σούφι διαλογισμό, Θιβετιανό Βουδισμό). Η μέθοδος γεννήθηκε από προσωπική ανάγκη για εργαλεία παρουσίας που λειτουργούν εκ των έσω.',
      en: 'A neurodivergent practitioner with over 20 years of experience in mindfulness traditions (Tai Chi, Sufism, Tibetan Buddhism). This method was born from a deep personal need for presence tools that actually work from within.'
    }
  };

  const l = language === 'el' ? 'el' : 'en';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 sm:p-4">
          <motion.div
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
                <h2 className="text-2xl md:text-3xl font-serif text-white italic tracking-tight">
                  {content.title[l]}
                </h2>
                <p className="text-sm text-white/40 leading-relaxed max-w-md">
                  {content.subtitle[l]}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all absolute right-4 top-6 sm:static sm:right-auto sm:top-auto"
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
                    {language === 'el' ? 'Καλώς ήρθατε' : 'Welcome'}
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
                    <div key={idx} className="flex gap-3 p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                      <div className="text-xl shrink-0 leading-none mt-0.5">{item.icon}</div>
                      <p className="text-xs text-white/60 leading-relaxed font-sans">
                        {item[l]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>


              {/* The 4 Axes grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold tracking-wider uppercase text-white/40 mb-3">
                   {content.axesTitle[l]}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {content.axes.map((axis) => (
                    <div key={axis.id} className="flex gap-3 px-4 py-3 rounded-3xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all items-center">
                      <div className={cn("w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center border transition-all duration-500", axis.bg, "border-white/5 group-hover:scale-110")}>
                        <axis.icon size={18} className={axis.color} />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-serif text-white italic font-medium">
                          {axis.title[l]}
                        </h4>
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
                  <p className="text-lg font-serif italic text-white mt-1">
                    {content.creatorName}
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed mt-3 font-sans max-w-sm">
                    {content.creatorDesc[l]}
                  </p>
                </div>
                
                <div className="flex flex-col items-center max-w-sm border-t border-white/5 pt-4">
                  <p className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-1">
                    {language === 'el' ? 'Πολιτικη Απορρητου' : 'Privacy Policy'}
                  </p>
                  <p className="text-[11px] text-white/30 leading-tight">
                    {language === 'el' 
                      ? 'Όλα τα δεδομένα σας (πρόοδος, ρυθμίσεις) αποθηκεύονται αποκλειστικά και τοπικά στη συσκευή σας. Δεν συλλέγουμε, δεν παρακολουθούμε και δεν μεταφέρουμε καμία προσωπική πληροφορία.'
                      : 'All your data (progress, settings) is stored exclusively and locally on your device. We do not collect, track, or transfer any personal information.'}
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
}
