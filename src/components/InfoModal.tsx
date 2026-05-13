import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Anchor, Wind, Focus, Maximize, Heart, Info } from 'lucide-react';
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
      el: 'Αυτή η εφαρμογή είναι ένας trauma-informed οδηγός που στοχεύει στην αποενοχοποίηση της προσοχής. Αντί για "άδειαμα του μυαλού", καλλιεργούμε την επίγνωση των τεσσάρων διαστάσεων της εμπειρίας.',
      en: 'This app is a trauma-informed guide that aims to destigmatize attention. Instead of "emptying the mind", we cultivate awareness across four dimensions of experience.'
    },
    axes: [
      {
        id: 'body',
        icon: Anchor,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        title: { el: 'Σώμα & Βαρύτητα', en: 'Body & Gravity' },
        desc: { 
          el: 'Η γείωση μέσω της αίσθησης του βάρους. Μαθαίνουμε να νιώθουμε την υποστήριξη της γης, παρέχοντας ένα αίσθημα ασφάλειας στο νευρικό σύστημα.',
          en: 'Grounding through the sensation of weight. We learn to feel the earth\'s support, providing a sense of safety to the nervous system.'
        }
      },
      {
        id: 'breath',
        icon: Wind,
        color: 'text-teal-400',
        bg: 'bg-teal-500/10',
        title: { el: 'Ανάσα', en: 'Breath' },
        desc: { 
          el: 'Ο ρυθμικός σύνδεσμος μεταξύ εσωτερικού και εξωτερικού κόσμου. Μια άγκυρα που είναι πάντα διαθέσιμη, χωρίς πίεση για έλεγχο.',
          en: 'The rhythmic link between internal and external worlds. An anchor that is always available, without pressure to control.'
        }
      },
      {
        id: 'attention',
        icon: Focus,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        title: { el: 'Προσοχή', en: 'Attention' },
        desc: { 
          el: 'Η ικανότητα να στρέφουμε τον προβολέα της συνείδησης. Αναγνωρίζουμε πότε η προσοχή "κολλάει" και μαθαίνουμε να την μετακινούμε απαλά.',
          en: 'The ability to direct the spotlight of consciousness. We recognize when attention gets "stuck" and learn to move it gently.'
        }
      },
      {
        id: 'space',
        icon: Maximize,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        title: { el: 'Χώρος', en: 'Space' },
        desc: { 
          el: 'Η ανοιχτή επίγνωση. Συνειδητοποιούμε ότι δεν είμαστε οι σκέψεις μας, αλλά ο απεριόριστος χώρος μέσα στον οποίο αυτές εμφανίζονται.',
          en: 'Open awareness. We realize that we are not our thoughts, but the vast space in which they appear.'
        }
      }
    ],
    footer: {
      el: 'Σχεδιάστηκε με αγάπη για ΔΕΠΥ & Αυτιστικά άτομα.',
      en: 'Designed with love for ADHD & Autistic individuals.'
    }
  };

  const l = language === 'el' ? 'el' : 'en';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="relative w-full max-w-xl bg-[#0a1a1a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 w-fit">
                  <Info size={12} className="text-teal-400" />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-teal-400/80 uppercase">
                    {language === 'el' ? 'ΠΛΗΡΟΦΟΡΙΕΣ' : 'INFORMATION'}
                  </span>
                </div>
                <h2 className="text-3xl font-serif text-white italic tracking-tight">
                  {content.title[l]}
                </h2>
                <p className="text-sm text-white/40 leading-relaxed max-w-md">
                  {content.subtitle[l]}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
              <div className="space-y-6">
                <p className="text-sm text-white/60 leading-relaxed italic bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  {content.purpose[l]}
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {content.axes.map((axis) => (
                    <div key={axis.id} className="flex gap-4 p-5 rounded-[1.8rem] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all">
                      <div className={cn("w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center border transition-all duration-500", axis.bg, "border-white/5 group-hover:scale-110")}>
                        <axis.icon size={28} className={axis.color} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-serif text-white italic font-medium">
                          {axis.title[l]}
                        </h4>
                        <p className="text-xs text-white/40 leading-relaxed font-sans">
                          {axis.desc[l]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col items-center gap-3 text-center opacity-40">
                  <Heart size={16} className="text-rose-400" />
                  <p className="text-[10px] font-bold tracking-widest uppercase">
                    {content.footer[l]}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
