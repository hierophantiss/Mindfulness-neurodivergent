import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Shield, Anchor, Wind, Focus, Maximize, ArrowRight, Heart, Sparkles, Compass } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';
import { RainbowInfinity } from '../components/RainbowInfinity';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [intention, setIntention] = useState<'calm' | 'focus' | 'decompress' | null>(null);
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  const handleComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    localStorage.setItem('hasSeenIntro', 'true');
    if (intention) {
      localStorage.setItem('n_mindfulness_intention', intention);
    }
    navigate('/dashboard', { replace: true });
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      handleComplete();
    }
  };

  const steps = [
    {
      id: 'welcome',
      content: (
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4 mx-auto animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <RainbowInfinity size={56} className="opacity-90" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif italic text-white tracking-tight">
              {language === 'el' ? 'Καλώς ορίσατε' : 'Welcome'}
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-sans max-w-md mx-auto leading-relaxed">
              {language === 'el' 
                ? 'Στον χώρο ηρεμίας που σχεδιάστηκε για νευροδιαφορετικά άτομα.' 
                : 'To a space of calm designed for neurodivergent minds.'}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'app-intro',
      content: (
        <div className="flex flex-col items-center text-center space-y-8 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 mb-2 mx-auto">
            <Compass size={32} className="text-teal-400 animate-[spin_30s_linear_infinite]" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-serif italic text-white tracking-tight">
              {language === 'el' ? 'Ένα Ψηφιακό Καταφύγιο' : 'A Digital Sanctuary'}
            </h2>
            <p className="text-base text-white/60 font-sans leading-relaxed">
              {language === 'el' 
                ? 'Η εφαρμογή μας είναι ένας ασφαλής χώρος επιβράδυνσης. Περιλαμβάνει 7 μοναδικά τμήματα: από θεωρία και πρακτικές αναπνοής, κίνησης ή προσοχής, μέχρι το προσωπικό σας Ημερολόγιο και ατμοσφαιρικούς ήχους περιβάλλοντος για απόλυτη χαλάρωση.' 
                : 'Our application is a safe space for slowing down. It includes 7 unique sections: from theory and practices of breath, movement, or attention, to your personal Journal and atmospheric ambient sounds for complete relaxation.'}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'companion-intro',
      content: (
        <div className="flex flex-col items-center text-center space-y-8 max-w-lg mx-auto">
          <div className="relative w-24 h-24 rounded-full bg-teal-500/10 flex items-center justify-center border-2 border-teal-400/40 p-1 mx-auto shadow-[0_0_25px_rgba(20,184,166,0.15)]">
            <img 
              src="/favicon-96x96-v3.png" 
              alt="Companion" 
              className="w-20 h-20 object-cover rounded-full"
            />
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-teal-400 flex items-center justify-center text-stone-950">
              <Sparkles size={12} className="animate-pulse" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-serif italic text-white tracking-tight">
              {language === 'el' ? 'Μια Φιλική Συντροφιά' : 'A Friendly Companion'}
            </h2>
            <p className="text-base text-white/60 font-sans leading-relaxed">
              {language === 'el' 
                ? 'Στην κάτω δεξιά γωνία κατοικεί ο ψηφιακός σας συνοδός (η μικρή μας γάτα). Είναι πάντα εκεί για να ελέγξει πώς νιώθετε, να συζητήσει μαζί σας, να απαντήσει στις ερωτήσεις σας και να προτείνει ασκήσεις κομμένες και ραμμένες στις ανάγκες σας.' 
                : 'Living in the bottom-right corner is your digital companion (our little cat). Always there to check in on how you feel, talk with you, answer your questions, and suggest exercises tailored precisely to your needs.'}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'philosophy',
      content: (
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-2 mx-auto">
            <Shield size={32} className="text-indigo-400" />
          </div>
          <div className="space-y-4 w-full max-w-lg mx-auto">
            <h2 className="text-3xl font-serif italic text-white tracking-tight">
              {language === 'el' ? 'Αποενοχοποίηση της Προσοχής' : 'Destigmatizing Attention'}
            </h2>
            <p className="text-base text-white/50 font-sans leading-relaxed">
              {language === 'el' 
                ? 'Εδώ δεν χρειάζεται να "αδειάσετε το μυαλό σας" ούτε να ελέγξετε τις σκέψεις σας. Μαθαίνουμε να παρατηρούμε με ευγένεια, χωρίς κριτική.'
                : 'Here you do not need to "empty your mind" or control your thoughts. We learn to observe with kindness, without judgment.'}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'axes',
      content: (
        <div className="flex flex-col items-center text-center space-y-10 w-full max-w-xl mx-auto">
          <div className="space-y-2">
            <h2 className="text-3xl font-serif italic text-white tracking-tight">
              {language === 'el' ? 'Ο Τετραπλός Άξονας' : 'The Fourfold Axis'}
            </h2>
            <p className="text-sm text-white/40">
              {language === 'el' ? 'Τα εργαλεία της επίγνωσής μας' : 'Our tools of awareness'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            {[
              { icon: Anchor, color: 'text-indigo-400', bg: 'bg-indigo-500/10', title: { el: 'Σώμα', en: 'Body' } },
              { icon: Wind, color: 'text-teal-400', bg: 'bg-teal-500/10', title: { el: 'Ανάσα', en: 'Breath' } },
              { icon: Focus, color: 'text-amber-400', bg: 'bg-amber-500/10', title: { el: 'Προσοχή', en: 'Attention' } },
              { icon: Maximize, color: 'text-rose-400', bg: 'bg-rose-500/10', title: { el: 'Χώρος', en: 'Space' } }
            ].map((axis, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn("flex flex-col items-center p-6 rounded-3xl border border-white/5", axis.bg)}
              >
                <axis.icon size={28} className={axis.color} />
                <span className="mt-4 font-serif italic text-white/90 text-lg">
                  {language === 'el' ? axis.title.el : axis.title.en}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'intention',
      content: (
        <div className="flex flex-col items-center text-center space-y-8 w-full max-w-xl mx-auto">
          <div className="space-y-4 max-w-md mx-auto">
             <h2 className="text-3xl font-serif italic text-white tracking-tight leading-snug">
               {language === 'el' ? 'Πώς νιώθετε συνήθως;' : 'How do you usually feel?'}
             </h2>
             <p className="text-sm text-white/50 font-sans leading-relaxed">
               {language === 'el' 
                 ? 'Επιλέξτε αυτό που σας απασχολεί περισσότερο, για να διαμορφώσουμε τις προτάσεις σας.'
                 : 'Choose what concerns you most, so we can tailor your suggestions.'}
             </p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
            {[
              { id: 'calm', icon: Anchor, title: { el: 'Αναζητώ Ηρεμία', en: 'I seek Calmness' }, sub: { el: 'Άγχος & Υπερδιέγερση', en: 'Anxiety & Overstimulation' } },
              { id: 'focus', icon: Focus, title: { el: 'Θέλω να Εστιάσω', en: 'I want to Focus' }, sub: { el: 'ΔΕΠΥ & Οργάνωση', en: 'ADHD & Organization' } },
              { id: 'decompress', icon: Wind, title: { el: 'Χρειάζομαι Χώρο', en: 'I need Space' }, sub: { el: 'Αποφόρτιση & Χαλάρωση', en: 'Decompression & Rest' } }
            ].map((opt) => (
              <button 
                key={opt.id}
                onClick={() => setIntention(opt.id as any)}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 text-left active:scale-[0.98] group",
                   intention === opt.id 
                    ? "bg-teal-500/20 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.1)]" 
                    : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10"
                )}
              >
                 <div className={cn(
                   "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                   intention === opt.id ? "bg-teal-400/20 text-teal-400" : "bg-white/5 text-white/40 group-hover:text-white/60"
                 )}>
                   <opt.icon size={20} />
                 </div>
                 <div className="flex flex-col">
                   <span className={cn(
                     "font-serif italic text-lg transition-colors",
                     intention === opt.id ? "text-white" : "text-white/80"
                   )}>
                     {language === 'el' ? opt.title.el : opt.title.en}
                   </span>
                   <span className="text-[10px] uppercase tracking-widest text-white/40 font-black mt-0.5">
                     {language === 'el' ? opt.sub.el : opt.sub.en}
                   </span>
                 </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'ready',
      content: (
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-md mx-auto">
            <h2 className="text-4xl font-serif italic text-white tracking-tight">
              {language === 'el' ? 'Είστε έτοιμοι;' : 'Are you ready?'}
            </h2>
            <p className="text-lg text-white/50 font-sans leading-relaxed">
              {language === 'el' 
                ? 'Κάθε βήμα εδώ είναι προσωπικό. Ακολουθήστε τον δικό σας ρυθμό.'
                : 'Every step here is personal. Follow your own pace.'}
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a1118] text-white flex flex-col justify-between overflow-hidden">
      
      {/* Top bar with language toggle for convenience */}
      <div className="pt-safe px-6 py-6 flex justify-end">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'el' : 'en')}
          className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold tracking-widest text-white/40 hover:bg-white/5 hover:text-white transition-all duration-300 active:scale-95"
        >
          {language === 'en' ? 'ΕΛ' : 'EN'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.3, 1] }}
            className="w-full max-w-2xl"
          >
            {steps[step].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="px-6 pb-20 pt-6 flex flex-col items-center gap-8 z-10 relative">
        {/* Progress indicators */}
        <div className="flex gap-3">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-700",
                i === step ? "w-8 bg-teal-400" : i < step ? "w-2 bg-teal-400/40" : "w-2 bg-white/10"
              )}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={nextStep}
          className="flex items-center gap-3 px-8 py-4 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30 transition-all font-medium group active:scale-95"
        >
          <span>
            {step === steps.length - 1 
              ? (language === 'el' ? 'Έναρξη' : 'Begin') 
              : (steps[step].id === 'intention' && !intention)
                ? (language === 'el' ? 'Παράλειψη' : 'Skip')
                : (language === 'el' ? 'Συνέχεια' : 'Continue')}
          </span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Ambient background effects */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />
    </div>
  );
}
