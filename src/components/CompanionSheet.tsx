import React, { useState, useEffect } from 'react';
import { useCompanion } from '../hooks/useCompanion';
import { CHAPTERS_DATA, CHAPTER_PRACTICES } from '../data/chapters';
import { MOOD_ROUTES } from '../data/moods';
import { KNOWLEDGE_CONCEPTS } from '../data/concepts';
import { KNOWLEDGE_FAQ } from '../data/faq';
import { D as D_EL } from '../data/course-el';
import { D as D_EN } from '../data/course-en';
import { getCompanionResponse, streamCompanionResponse } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';

/* Companion Sheet states/flows */
type FlowState = 'main' | 'mood' | 'hub' | 'explore' | 'options' | 'guide' | 'questionnaire';

export default function CompanionSheet() {
  const { sheetVisible, setSheetVisible, companionData, trackActivity, updateCompanionData } = useCompanion();
  const { language } = useLanguage();
  const { reduceMotion } = useAccessibility();
  const [flow, setFlow] = useState<FlowState>('main');
  const [history, setHistory] = useState<FlowState[]>([]);
  const navigate = useNavigate();

  const handleClose = () => {
    setSheetVisible(false);
    // reset flow after animation out
    setTimeout(() => {
      setFlow('main');
      setHistory([]);
    }, 300);
  };

  const navTo = (dest: FlowState) => {
    setHistory(prev => [...prev, flow]);
    setFlow(dest);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setFlow(prev);
    } else {
      setFlow('main');
    }
  };

  // Render varying content based on the flow
  const renderContent = () => {
    switch (flow) {
      case 'main': return <MainFlow navTo={navTo} onClose={handleClose} />;
      case 'mood': return <MoodFlow goBack={goBack} onClose={handleClose} navigate={navigate} navTo={navTo} />;
      case 'hub': return <HubFlow goBack={goBack} onClose={handleClose} navigate={navigate} />;
      case 'options': return <OptionsFlow goBack={goBack} onClose={handleClose} />;
      case 'explore': return <ExploreFlow goBack={goBack} onClose={handleClose} />;
      case 'guide': return <GuideFlow goBack={goBack} onClose={handleClose} />;
      case 'questionnaire': return <QuestionnaireFlow goBack={goBack} />;
      default: return <MainFlow navTo={navTo} onClose={handleClose} />;
    }
  };

  return (
    <AnimatePresence>
      {sheetVisible && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[9998]"
            onClick={handleClose}
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-h-[85dvh] bg-stone-100 dark:bg-stone-900 shadow-2xl rounded-t-3xl border border-stone-200 dark:border-stone-800 z-[9999] flex flex-col overflow-hidden max-w-2xl mx-auto pb-[env(safe-area-inset-bottom)]"
          >
            {/* Grab Handle */}
            <div role="button" className="flex justify-center p-3 cursor-pointer touch-none" onClick={handleClose}>
              <div className="w-10 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full" />
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {renderContent()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MainFlow({ navTo, onClose }: { navTo: (state: FlowState) => void, onClose: () => void }) {
  const { companionData } = useCompanion();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { reduceMotion } = useAccessibility();
  
  // Calculate specific dynamic messages
  const now = new Date();
  let daysSince = 0;
  if (companionData.lastSeen) {
    daysSince = Math.floor((now.getTime() - new Date(companionData.lastSeen).getTime()) / 86400000);
  }

  // Find resume chapter
  let resumeChapterNum: number | null = null;
  let resumeScroll = 0;
  
  const progKeys = Object.keys(companionData.chapterProgress);
  for (let key of progKeys) {
    const num = parseInt(key);
    const prog = companionData.chapterProgress[num];
    if (prog && !prog.completed && prog.scrollPct > 0.05 && prog.scrollPct < 0.95 && prog.scrollPct > resumeScroll) {
      resumeScroll = prog.scrollPct;
      resumeChapterNum = num;
    }
  }

  let nextChapterNum: number | null = null;
  const currentLang = language === 'en' && CHAPTERS_DATA['en'] ? 'en' : 'el';
  const totalChapters = CHAPTERS_DATA[currentLang].length;
  let completedCount = 0;
  
  for (let i = 1; i <= totalChapters; i++) {
    if (companionData.chapterProgress[i]?.completed) {
      completedCount++;
    } else if (!nextChapterNum) {
      nextChapterNum = i;
    }
  }

  let message = {
    primary: language === 'el' ? 'Πώς θέλεις να συνεχίσουμε σήμερα;' : 'How do you want to continue today?',
    secondary: '',
    actionLabel: language === 'el' ? '📖 Βιβλιοθήκη' : '📖 Library',
    actionRoute: '/chapters',
    secondaryActionLabel: language === 'el' ? '🫁 Αναπνοή' : '🫁 Breath',
    secondaryActionRoute: '/practice/breath/sos-breath'
  };

  const progW = companionData.programProgress?.week || 0;
  const progD = companionData.programProgress?.day || 0;
  const hasProgram = progW > 0;

  if (hasProgram) {
    message.primary = language === 'el' ? (daysSince >= 1 ? 'Καλώς ήρθες πίσω!' : 'Πώς θέλεις να συνεχίσουμε;') : (daysSince >= 1 ? 'Welcome back!' : 'How do you want to continue?');
    message.secondary = language === 'el' ? `Πρόγραμμα 8 Εβδομάδων: Εβδομάδα ${progW}, Ημέρα ${progD + 1}` : `8-Week Program: Week ${progW}, Day ${progD + 1}`;
    message.actionLabel = language === 'el' ? '▶ Συνέχεια' : '▶ Continue';
    message.actionRoute = `/program/week/${progW}`;
    
    if (resumeChapterNum || nextChapterNum) {
      const chNum = resumeChapterNum || nextChapterNum;
      message.secondaryActionLabel = String(language === 'el' ? '📖 Βιβλιοθήκη' : '📖 Library');
      message.secondaryActionRoute = `/chapters/${chNum}`;
    }
  } else if (daysSince >= 2) {
    message.primary = language === 'el' ? 'Καλώς ήρθες πίσω!' : 'Welcome back!';
    if (resumeChapterNum) {
      const ch = CHAPTERS_DATA[currentLang][resumeChapterNum - 1];
      message.secondary = language === 'el' ? `Είχες μείνει στο «${ch?.title}». Θέλεις να συνεχίσεις;` : `You left off at "${ch?.title}". Want to continue?`;
      message.actionLabel = `${ch?.icon} ${language === 'el' ? 'Συνέχισε' : 'Continue'}`;
      message.actionRoute = `/chapters/${resumeChapterNum}`;
    } else if (nextChapterNum) {
      const ch = CHAPTERS_DATA[currentLang][nextChapterNum - 1];
      message.secondary = language === 'el' ? `Το επόμενο βήμα: «${ch?.title}»` : `Next step: "${ch?.title}"`;
      message.actionLabel = `${ch?.icon} ${language === 'el' ? 'Πάμε' : 'Let\'s go'}`;
      message.actionRoute = `/chapters/${nextChapterNum}`;
    }
  } else if (resumeChapterNum) {
    const ch = CHAPTERS_DATA[currentLang][resumeChapterNum - 1];
    message.primary = language === 'el' ? `Βρίσκεσαι στο «${ch?.title}»` : `You are on "${ch?.title}"`;
    message.secondary = language === 'el' ? 'Συνέχισε την ανάγνωση από εκεί που έμεινες.' : 'Continue reading where you left off.';
    message.actionLabel = `${ch?.icon} ${language === 'el' ? 'Συνέχισε' : 'Continue'}`;
    message.actionRoute = `/chapters/${resumeChapterNum}`;
  } else if (completedCount >= totalChapters && !hasProgram) {
    message.primary = language === 'el' ? 'Ολοκλήρωσες όλα τα κεφάλαια! 🎉' : 'You completed all chapters! 🎉';
    message.secondary = language === 'el' ? 'Είσαι έτοιμος για το Πρόγραμμα 8 Εβδομάδων.' : 'You are ready for the 8-Week Program.';
    message.actionLabel = language === 'el' ? '🗓️ Ξεκίνα Πρόγραμμα' : '🗓️ Start Program';
    message.actionRoute = '/program';
    message.secondaryActionLabel = language === 'el' ? '🎯 Ασκήσεις' : '🎯 Exercises';
    message.secondaryActionRoute = '/practice';
  } else if (nextChapterNum) {
    const ch = CHAPTERS_DATA[currentLang][nextChapterNum - 1];
    message.primary = language === 'el' ? `Το ταξίδι συνεχίζεται: «${ch?.title}»` : `The journey continues: "${ch?.title}"`;
    message.secondary = language === 'el' ? `${completedCount}/${totalChapters} κεφάλαια ολοκληρωμένα` : `${completedCount}/${totalChapters} chapters completed`;
    message.actionLabel = `${ch?.icon} ${language === 'el' ? 'Ξεκίνα' : 'Start'}`;
    message.actionRoute = `/chapters/${nextChapterNum}`;
  }
  
  return (
    <div className="space-y-6 animate-fade-in text-stone-800 dark:text-stone-200">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-stone-800/60">
         <div className="flex items-center gap-3">
           <div className="flex -space-x-1">
             <div className={`w-6 h-6 rounded-full bg-teal-500/20 mix-blend-multiply dark:mix-blend-lighten ${reduceMotion ? '' : 'animate-pulse'}`} />
             <div className={`w-6 h-6 rounded-full bg-indigo-500/20 mix-blend-multiply dark:mix-blend-lighten ${reduceMotion ? '' : 'animate-pulse delay-75'}`} />
           </div>
           <h2 className="font-display font-medium text-lg leading-none tracking-tight">
             {language === 'el' ? 'Καθοδήγηση' : 'Guidance'}
           </h2>
         </div>
         <div className="flex items-center gap-1.5">
            <button onClick={() => navTo('options')} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition text-stone-400 hover:text-stone-700 dark:hover:text-stone-300">⚙️</button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition text-stone-400 hover:text-stone-700 dark:hover:text-stone-300">✕</button>
         </div>
      </div>

      <div className="relative bg-gradient-to-br from-teal-50/80 to-stone-50/40 dark:from-teal-950/30 dark:to-stone-900/40 p-5 rounded-3xl border border-teal-100/50 dark:border-teal-900/30 shadow-sm backdrop-blur-sm overflow-hidden">
        {/* Decorative blur in background */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <p className="font-semibold text-[17px] text-teal-950 dark:text-teal-50 mb-1.5 tracking-tight">{message.primary}</p>
          {message.secondary && (
            <p className="text-stone-600 dark:text-stone-300 text-[14px] mb-5 font-medium leading-relaxed">{message.secondary}</p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <button 
              onClick={() => { onClose(); navigate(message.actionRoute); }}
              className="flex-1 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white shadow-sm py-2.5 px-4 rounded-xl font-medium transition-transform active:scale-[0.98] text-center text-sm"
            >
              {message.actionLabel}
            </button>
            {message.secondaryActionLabel && (
              <button 
                onClick={() => { onClose(); navigate(message.secondaryActionRoute!); }}
                className="flex-1 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 py-2.5 px-4 rounded-xl font-medium transition-transform active:scale-[0.98] text-center shadow-sm text-sm"
              >
                {message.secondaryActionLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
         <button onClick={() => navTo('mood')} className="group flex flex-col items-center gap-2.5 p-4 bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 rounded-3xl hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all shadow-sm active:scale-[0.98]">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-100/50 dark:bg-indigo-900/30 text-2xl group-hover:scale-110 transition-transform">💭</div>
            <span className="font-semibold text-[13px] text-stone-700 dark:text-stone-300 tracking-wide">{language === 'el' ? 'Πώς νιώθεις;' : 'How do you feel?'}</span>
         </button>
         <button onClick={() => navTo('hub')} className="group flex flex-col items-center gap-2.5 p-4 bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 rounded-3xl hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all shadow-sm active:scale-[0.98]">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-100/50 dark:bg-emerald-900/30 text-2xl group-hover:scale-110 transition-transform">🧭</div>
            <span className="font-semibold text-[13px] text-stone-700 dark:text-stone-300 tracking-wide">{language === 'el' ? 'Τι να κάνω;' : 'What to do?'}</span>
         </button>
      </div>
    </div>
  );
}

function MoodFlow({ goBack, onClose, navigate, navTo }: { goBack: () => void, onClose: () => void, navigate: any, navTo: (dest: FlowState) => void }) {
  const { trackActivity } = useCompanion();
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const { language } = useLanguage();

  const handleMoodSelect = (mood: any) => {
    trackActivity('mood_report', { mood: mood.id });
    setSelectedMoodId(mood.id);
  };

  const getLabel = (opt: any) => opt?.[language] || opt?.el || opt;

  if (selectedMoodId) {
    const route = MOOD_ROUTES[selectedMoodId];
    if (route) {
      return (
         <div className="space-y-6 animate-fade-in text-stone-800 dark:text-stone-200">
           <div className="flex items-center gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
             <button onClick={() => setSelectedMoodId(null)} className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center">←</button>
             <h2 className="font-display text-lg font-medium">{getLabel(route.label)}</h2>
           </div>
           
           <div className="space-y-4">
             <p className="font-medium text-lg leading-snug">{getLabel(route.response?.msg)}</p>
             
             {route.response?.task && (
               <div className="bg-teal-50/50 dark:bg-teal-900/10 border-l-[3px] border-teal-600/60 p-4 rounded-r-2xl">
                 <p className="font-mono text-sm opacity-90">{getLabel(route.response.task)}</p>
               </div>
             )}
             
             {route.response?.wisdom && (
               <p className="text-[15px] italic opacity-60">"{getLabel(route.response.wisdom)}"</p>
             )}
           </div>

           <div className="pt-2">
             <div className={`grid gap-2 ${route.actions.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
               {route.actions.map((act: any, idx: number) => {
                 const lbl = getLabel(act.label);
                 const isIconLbl = typeof lbl === 'string' && lbl.includes(' ') && ['🫁', '🆘', '📋', '🧍', '👁', '✦', '🤚', '💛', '🧠', '📖', '🎯', '🌙'].some(emoji => lbl.startsWith(emoji));
                 return (
                  <button
                    key={idx}
                    onClick={() => {
                       onClose();
                       if (act.route) navigate(act.route);
                    }}
                    className="flex flex-col items-center justify-center text-center py-4 px-3 rounded-2xl font-semibold text-xs tracking-wider uppercase transition-colors border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 h-24"
                  >
                    {isIconLbl ? (
                      <>
                        <span className="text-2xl mb-1">{lbl.split(' ')[0]}</span>
                        <span>{lbl.split(' ').slice(1).join(' ')}</span>
                      </>
                    ) : lbl}
                  </button>
                 )
               })}
             </div>
             <button onClick={onClose} className="w-full mt-3 py-4 bg-teal-200/50 hover:bg-teal-200/80 dark:bg-teal-900/40 dark:hover:bg-teal-900/60 text-teal-900 dark:text-teal-100 rounded-2xl font-bold text-[13px] tracking-widest uppercase transition-colors">
                {language === 'el' ? 'ΣΥΝΕΧΕΙΑ ➔' : 'CONTINUE ➔'}
             </button>
           </div>
         </div>
      );
    }
  }

  const moodsToShow = Object.keys(MOOD_ROUTES);

  return (
    <div className="space-y-6 animate-fade-in text-stone-800 dark:text-stone-200">
      <div className="flex items-center gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <button onClick={goBack} className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center hover:bg-stone-300 dark:hover:bg-stone-700 transition">←</button>
        <h2 className="font-display text-lg font-medium tracking-tight">
          {language === 'el' ? 'Συνομιλία με τον Καθοδηγητή' : 'Chat with Guide'}
        </h2>
      </div>

      <div className="flex flex-col gap-3">
         <button 
           onClick={() => navTo('guide')}
           className="flex items-center gap-4 p-4 bg-teal-600 dark:bg-teal-700 text-white rounded-2xl hover:bg-teal-700 dark:hover:bg-teal-800 transition-all shadow-sm active:scale-[0.98]"
         >
           <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 text-xl font-bold">✨</div>
           <div className="text-left">
             <div className="font-bold text-[15px]">{language === 'el' ? 'Ρώτησε κάτι' : 'Ask something'}</div>
             <div className="text-[12px] opacity-80">{language === 'el' ? 'Πώς να διαχειριστώ αυτό που νιώθω;' : 'How to manage what I feel?'}</div>
           </div>
         </button>

         <button 
           onClick={() => navTo('questionnaire')}
           className="flex items-center gap-4 p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-all shadow-sm active:scale-[0.98]"
         >
           <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-900 text-xl font-bold">📝</div>
           <div className="text-left">
             <div className="font-bold text-[15px] text-stone-800 dark:text-stone-200">{language === 'el' ? 'Προσαρμογή Προγράμματος' : 'Program Customization'}</div>
             <div className="text-[12px] opacity-80 text-stone-500 dark:text-stone-400">{language === 'el' ? 'Φτιάξε το δικό σου ρυθμό' : 'Set your own pace'}</div>
           </div>
         </button>
      </div>
      
      <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
        <p className="text-[13px] font-medium text-stone-500 dark:text-stone-400 mb-3 ml-1">{language === 'el' ? 'Ή επίλεξε μια διάθεση:' : 'Or pick a mood:'}</p>
        <div className="grid grid-cols-2 gap-2">
           {moodsToShow.map(id => {
             const rt = MOOD_ROUTES[id];
             return (
               <button key={id} onClick={() => handleMoodSelect({ id })} className="flex flex-col items-center justify-center gap-1 p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors text-center w-full">
                 <span className="text-2xl drop-shadow-sm mb-1">{rt.icon}</span>
                 <span className="font-medium text-[11px] leading-tight text-stone-600 dark:text-stone-400">{getLabel(rt.label)}</span>
               </button>
             )
           })}
        </div>
      </div>
    </div>
  );
}

function HubFlow({ goBack, onClose, navigate }: { goBack: () => void, onClose: () => void, navigate: any }) {
  const { companionData } = useCompanion();
  const { language } = useLanguage();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={goBack} className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center">←</button>
        <h2 className="font-display text-lg font-medium">{language === 'el' ? 'Πυξίδα / Προτάσεις' : 'Compass / Suggestions'}</h2>
      </div>

      <div className="flex flex-col gap-2">
        <button 
           onClick={() => { onClose(); navigate(companionData.programProgress?.week > 0 ? `/program/week/${companionData.programProgress.week}` : '/program'); }} 
           className="p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-left hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors w-full relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="text-xl mb-1 relative z-10">🗓️</div>
          <div className="font-medium text-stone-900 dark:text-stone-100 relative z-10">{language === 'el' ? 'Πρόγραμμα 8 Εβδομάδων' : '8-Week Program'}</div>
          <div className="text-xs opacity-70 text-stone-600 dark:text-stone-400 mt-1 relative z-10">
            {companionData.programProgress?.week > 0 
              ? `${language === 'el' ? 'Εβδομάδα' : 'Week'} ${companionData.programProgress.week}, ${language === 'el' ? 'Ημέρα' : 'Day'} ${companionData.programProgress.day + 1}` 
              : (language === 'el' ? 'Ξεκινήστε το ταξίδι σας' : 'Start your journey')}
          </div>
        </button>

        <button 
           onClick={() => { onClose(); navigate(`/chapters/${companionData.lastChapter || 1}`); }} 
           className="p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-left hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors w-full"
        >
          <div className="text-xl mb-1">📖</div>
          <div className="font-medium text-stone-900 dark:text-stone-100">{language === 'el' ? 'Συνέχισε το διάβασμα' : 'Continue reading'}</div>
          <div className="text-xs opacity-70 text-stone-600 dark:text-stone-400 mt-1">{language === 'el' ? 'Είσαι στο Κεφάλαιο ' : 'You are at Chapter '}{companionData.lastChapter || 1}</div>
        </button>

        <button 
           onClick={() => { onClose(); navigate(`/practice/breath/sos-breath`); }} 
           className="p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-left hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors w-full"
        >
          <div className="text-xl mb-1">🫁</div>
          <div className="font-medium text-stone-900 dark:text-stone-100">{language === 'el' ? 'Αναπνοή SOS' : 'SOS Breath'}</div>
          <div className="text-xs opacity-70 text-stone-600 dark:text-stone-400 mt-1">{language === 'el' ? 'Χρειάζομαι ηρεμία τώρα.' : 'I need calm right now.'}</div>
        </button>
        
        <button 
           onClick={() => { onClose(); navigate(`/practice`); }} 
           className="p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-left hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors w-full"
        >
          <div className="text-xl mb-1">🎯</div>
          <div className="font-medium text-stone-900 dark:text-stone-100">{language === 'el' ? 'Ασκήσεις & Micro-doses' : 'Exercises & Micro-doses'}</div>
          <div className="text-xs opacity-70 text-stone-600 dark:text-stone-400 mt-1">{language === 'el' ? 'Για βαθύτερη εξάσκηση' : 'For deeper practice'}</div>
        </button>
      </div>
    </div>
  );
}

function OptionsFlow({ goBack, onClose }: { goBack: () => void, onClose: () => void }) {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in text-stone-800 dark:text-stone-200">
      <div className="flex items-center gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <button onClick={goBack} className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center hover:bg-stone-300 dark:hover:bg-stone-700 transition">←</button>
        <h2 className="font-display text-lg font-medium">{language === 'el' ? 'Ρυθμίσεις / Επιλογές' : 'Settings / Options'}</h2>
      </div>

      <div className="space-y-4">
         <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl p-4 flex items-center justify-between">
           <div>
             <div className="font-medium">{language === 'el' ? 'Εισαγωγή' : 'Introduction'}</div>
             <div className="text-xs opacity-70 mt-1">{language === 'el' ? 'Βασικές αρχές ενσυνειδητότητας' : 'Core principles of mindfulness'}</div>
           </div>
           
           <button 
              onClick={() => {
                onClose();
                localStorage.removeItem('N_MINDFULNESS_SEEN_INTRO');
                window.dispatchEvent(new Event('show-welcome-modal'));
              }}
              className="px-4 py-2 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-100 rounded-xl font-medium text-xs uppercase hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors"
           >
             {language === 'el' ? 'ΠΡΟΒΟΛΗ' : 'VIEW'}
           </button>
         </div>
      </div>
    </div>
  );
}

function ExploreFlow({ goBack, onClose }: { goBack: () => void, onClose: () => void }) {
  const { language } = useLanguage();
  const location = useLocation();
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  const getLabel = (opt: any) => opt?.[language] || opt?.el || opt;
  
  // Determine Relevant Concepts based on location
  const currentPath = location.pathname;
  let relevantConcepts: any[] = [];
  
  if (currentPath.includes('/chapters/')) {
    const chapterMatch = currentPath.match(/\/chapters\/(\d+)/);
    if (chapterMatch) {
      const chapterNum = parseInt(chapterMatch[1]);
      relevantConcepts = Object.keys(KNOWLEDGE_CONCEPTS).filter(key => 
        KNOWLEDGE_CONCEPTS[key].chapters?.includes(chapterNum)
      ).map(key => ({ id: key, ...KNOWLEDGE_CONCEPTS[key] }));
    }
  } else if (currentPath.includes('/practice')) {
    // If practicing, show concepts mostly related to body/breath
    relevantConcepts = Object.keys(KNOWLEDGE_CONCEPTS).filter(key => 
      ['grounding', 'interoception', 'vagus_nerve', 'binaural_beats', 'habituation'].includes(key)
    ).map(key => ({ id: key, ...KNOWLEDGE_CONCEPTS[key] }));
  }

  // Fallback: If no specific concepts for this page, show some foundational ones
  if (relevantConcepts.length === 0) {
    relevantConcepts = Object.keys(KNOWLEDGE_CONCEPTS).filter(key => 
      ['neuroplasticity', 'dmn', 'grounding', 'interoception', 'parasympathetic'].includes(key)
    ).map(key => ({ id: key, ...KNOWLEDGE_CONCEPTS[key] }));
  }

  return (
    <div className="space-y-6 animate-fade-in text-stone-800 dark:text-stone-200">
      <div className="flex items-center gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <button onClick={goBack} className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center hover:bg-stone-300 dark:hover:bg-stone-700 transition">←</button>
        <h2 className="font-display text-lg font-medium">{language === 'el' ? 'Επιστημονικοί Όροι' : 'Scientific Terms'}</h2>
      </div>

      {!selectedConcept ? (
        <div className="space-y-4">
          <p className="text-[14px] text-stone-600 dark:text-stone-400 mb-4 px-1">
            {language === 'el' 
              ? 'Λέξεις και έννοιες που σχετίζονται με αυτό που διαβάζεις τώρα.' 
              : 'Words and concepts related to what you are reading now.'}
          </p>
          
          <div className="space-y-2">
            {relevantConcepts.map(c => (
              <button 
                key={c.id} 
                onClick={() => setSelectedConcept(c.id)}
                className="w-full relative group text-left p-4 bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 hover:border-teal-300 dark:hover:border-teal-700 rounded-3xl transition duration-300 shadow-sm hover:shadow active:scale-[0.99] overflow-hidden flex items-center justify-between"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-50/0 via-teal-50/50 to-teal-50/0 dark:from-teal-900/0 dark:via-teal-900/20 dark:to-teal-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative z-10 pr-2">
                  <div className="font-semibold text-teal-900 dark:text-teal-300 mb-1">{getLabel(c)?.title}</div>
                  <div className="text-[13px] text-stone-500 dark:text-stone-400 font-medium leading-snug">{getLabel(c)?.short}</div>
                </div>
                <div className="relative z-10 w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-700/50 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-teal-900 transition-colors">
                   <span className="text-teal-600 dark:text-teal-400 text-xs font-bold">➔</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5 animate-fade-in">
           <button onClick={() => setSelectedConcept(null)} className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full text-[13px] font-semibold text-stone-700 dark:text-stone-300 transition-colors inline-flex items-center gap-2">
             <span>←</span> {language === 'el' ? 'Πίσω στη Λίστα' : 'Back to List'}
           </button>
           
           <div className="pt-2">
             <div className="inline-block px-3 py-1 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-3">
               {language === 'el' ? 'Ορισμος' : 'Definition'}
             </div>
             <h3 className="text-3xl font-display font-medium text-teal-950 dark:text-teal-100 leading-tight mb-4">
               {getLabel(KNOWLEDGE_CONCEPTS[selectedConcept])?.title}
             </h3>
             
             <p className="text-[16px] text-stone-700 dark:text-stone-300 opacity-95 leading-relaxed whitespace-pre-wrap font-medium">
               {getLabel(KNOWLEDGE_CONCEPTS[selectedConcept])?.full}
             </p>
           </div>
           
           {getLabel(KNOWLEDGE_CONCEPTS[selectedConcept])?.ndNote && (
             <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-800/50 rounded-2xl md:rounded-3xl mt-6 relative overflow-hidden shadow-sm">
               <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-400 dark:bg-amber-600"></div>
               <h4 className="font-bold text-amber-800 dark:text-amber-500 text-[11px] uppercase tracking-widest mb-2 flex items-center gap-2">
                 <span className="text-base">💡</span>
                 {language === 'el' ? 'Σημειωση Νευροδιαφορετικοτητας' : 'Neurodivergence Note'}
               </h4>
               <p className="text-[14px] font-medium text-amber-950 dark:text-amber-100/80 leading-relaxed">
                 {getLabel(KNOWLEDGE_CONCEPTS[selectedConcept]).ndNote}
               </p>
             </div>
           )}

           {getLabel(KNOWLEDGE_CONCEPTS[selectedConcept])?.science && (
             <div className="text-[13px] mt-6 p-4 bg-stone-100 dark:bg-stone-800/50 rounded-2xl md:rounded-3xl flex items-start gap-3 border border-stone-200 dark:border-stone-700/50">
               <div className="w-8 h-8 rounded-full bg-white dark:bg-stone-700 flex items-center justify-center shrink-0 shadow-sm">
                 <span className="text-base">🔬</span> 
               </div>
               <div className="font-medium text-stone-600 dark:text-stone-400 leading-relaxed pt-1">
                 {getLabel(KNOWLEDGE_CONCEPTS[selectedConcept]).science}
               </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
}

function QuestionnaireFlow({ goBack }: { goBack: () => void }) {
  const { language } = useLanguage();
  const { updateCompanionData, companionData } = useCompanion();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({
    intensity: 'standard',
    focus: [],
    dailyTime: 10
  });

  const steps = [
    {
      title: language === 'el' ? 'Ποιος είναι ο στόχος σου;' : 'What is your goal?',
      options: [
        { id: 'anxiety', label: language === 'el' ? 'Μείωση Άγχους' : 'Reduce Anxiety', icon: '🌊' },
        { id: 'focus', label: language === 'el' ? 'Καλύτερη Συγκέντρωση' : 'Better Focus', icon: '👁' },
        { id: 'rest', label: language === 'el' ? 'Ανάπαυση / Ύπνος' : 'Rest / Sleep', icon: '🌙' },
        { id: 'awareness', label: language === 'el' ? 'Αυτογνωσία' : 'Self-Awareness', icon: '✦' },
      ],
      multi: true
    },
    {
      title: language === 'el' ? 'Τι ένταση προτιμάς;' : 'What intensity do you prefer?',
      options: [
        { id: 'gentle', label: language === 'el' ? 'Ήπια (Μικρά βήματα)' : 'Gentle (Small steps)', icon: '🌱' },
        { id: 'standard', label: language === 'el' ? 'Ισορροπημένη' : 'Balanced', icon: '⚖️' },
        { id: 'deep', label: language === 'el' ? 'Εντατική (Βαθύτερη εξάσκηση)' : 'Intensive (Deeper practice)', icon: '🔥' },
      ],
      multi: false
    },
    {
      title: language === 'el' ? 'Πόσο χρόνο μπορείς να διαθέτεις καθημερινά;' : 'How much time can you give daily?',
      options: [
        { id: 5, label: language === 'el' ? '5 λεπτά' : '5 minutes', icon: '🕔' },
        { id: 10, label: language === 'el' ? '10 λεπτά' : '10 minutes', icon: '🕙' },
        { id: 20, label: language === 'el' ? '20+ λεπτά' : '20+ minutes', icon: '⌛' },
      ],
      multi: false
    }
  ];

  const [completed, setCompleted] = useState(false);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      updateCompanionData({
        questionnaire: { ...answers, completed: true }
      });
      // Also sync for dashboard (legacy key used by dashboard)
      if (answers.focus && answers.focus.length > 0) {
        localStorage.setItem('n_mindfulness_intention', answers.focus[0]);
      }
      setCompleted(true);
    }
  };

  const toggleOption = (id: any) => {
    const currentStep = steps[step];
    if (currentStep.multi) {
      setAnswers((prev: any) => ({
        ...prev,
        focus: prev.focus.includes(id) 
          ? prev.focus.filter((i: any) => i !== id)
          : [...prev.focus, id]
      }));
    } else {
      const field = step === 1 ? 'intensity' : 'dailyTime';
      setAnswers((prev: any) => ({ ...prev, [field]: id }));
      setTimeout(handleNext, 300);
    }
  };

  if (completed) {
    return (
      <div className="space-y-6 animate-fade-in py-8 text-center text-stone-800 dark:text-stone-200">
        <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">✅</div>
        <h3 className="text-2xl font-serif italic text-teal-950 dark:text-teal-100 mb-2">
          {language === 'el' ? 'Το πρόγραμμα ανανεώθηκε!' : 'Program Updated!'}
        </h3>
        <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-xs mx-auto">
          {language === 'el' 
            ? 'Οι προτάσεις σου έχουν προσαρμοστεί με βάση τις νέες σου προτιμήσεις.' 
            : 'Your suggestions have been adjusted based on your new preferences.'}
        </p>
        <button 
          onClick={goBack}
          className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold tracking-widest uppercase transition-all"
        >
          {language === 'el' ? 'ΕΠΙΣΤΡΟΦΗ ➔' : 'RETURN ➔'}
        </button>
      </div>
    );
  }

  const curStep = steps[step];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center transition hover:bg-stone-300 dark:hover:bg-stone-700">←</button>
          <h2 className="font-display text-lg font-medium tracking-tight">{language === 'el' ? 'Προσαρμογή' : 'Customization'}</h2>
        </div>
        <div className="text-xs font-bold text-stone-400">{step + 1} / {steps.length}</div>
      </div>

      <div className="py-2">
        <h3 className="text-2xl font-display font-medium text-stone-800 dark:text-stone-100 mb-6 leading-tight">
          {curStep.title}
        </h3>

        <div className="grid gap-3">
          {curStep.options.map(opt => {
            const isSelected = curStep.multi 
              ? answers.focus.includes(opt.id)
              : (step === 1 ? answers.intensity === opt.id : answers.dailyTime === opt.id);
            
            return (
              <button
                key={String(opt.id)}
                onClick={() => toggleOption(opt.id)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${
                  isSelected 
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-900 dark:text-teal-100' 
                    : 'border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:border-stone-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                  <span className="font-bold text-[15px]">{opt.label}</span>
                </div>
                {isSelected && <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {curStep.multi && (
        <button 
          disabled={answers.focus.length === 0}
          onClick={handleNext}
          className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:grayscale"
        >
          {language === 'el' ? 'ΕΠΟΜΕΝΟ ➔' : 'NEXT ➔'}
        </button>
      )}
    </div>
  );
}

function GuideFlow({ goBack, onClose }: { goBack: () => void, onClose: () => void }) {
  const { language } = useLanguage();
  const { companionData, updateCompanionData } = useCompanion();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [companionData.chatHistory, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading || isOffline) return;

    const userMsg = input.trim();
    setInput('');
    setLoading(true);

    const newUserHistory = [...(companionData.chatHistory || []), {
      role: 'user' as const,
      content: userMsg,
      timestamp: new Date().toISOString()
    }];

    updateCompanionData({ chatHistory: newUserHistory });

    try {
      // Detect axis and specific context from URL
      const path = location.pathname;
      let axis = 'General';
      let specificContext = '';

      if (path.includes('/practice/body')) {
        axis = 'Body (Soma)';
        if (path.includes('grounding')) specificContext = 'Grounding Practice';
        else if (path.includes('body-scan')) specificContext = 'Body Scan';
      } 
      else if (path.includes('/practice/breath')) {
        axis = 'Breath (Anapnoe)';
        if (path.includes('sos-breath')) specificContext = 'SOS Breath';
        else if (path.includes('box-breathing')) specificContext = 'Box Breathing';
      }
      else if (path.includes('/practice/attention')) {
        axis = 'Attention (Prosochi)';
        if (path.includes('anchor')) specificContext = 'Breath Anchor';
      }
      else if (path.includes('/practice/space')) {
        axis = 'Space (Choros)';
        if (path.includes('sensory')) specificContext = 'Sensory Exploration';
      }
      else if (path.includes('/chapters/')) {
        const chMatch = path.match(/\/chapters\/(\d+)/);
        if (chMatch) specificContext = `Reading Chapter ${chMatch[1]}`;
      }

      const fullAxis = specificContext ? `${axis} - ${specificContext}` : axis;

      // New client-side streaming implementation
      updateCompanionData(prev => ({
        ...prev,
        chatHistory: [
          ...(prev.chatHistory || []),
          {
            role: 'assistant' as const,
            content: '',
            timestamp: new Date().toISOString()
          }
        ]
      }));

      let assistantContent = '';
      await streamCompanionResponse(
        userMsg,
        (companionData.chatHistory || []).filter(m => m.role !== 'system').map(m => ({ role: m.role as any, content: m.content })),
        {
          language,
          screen: companionData.lastScreen,
          axis: fullAxis,
          questionnaire: companionData.questionnaire,
        },
        (chunk) => {
          assistantContent += chunk;
          updateCompanionData(prev => {
            const newHistory = [...(prev.chatHistory || [])];
            if (newHistory.length > 0) {
              newHistory[newHistory.length - 1] = {
                ...newHistory[newHistory.length - 1],
                content: assistantContent
              };
            }
            return { ...prev, chatHistory: newHistory };
          });
        }
      );
    } catch (err) {
      console.error(err);
      updateCompanionData(prev => ({
        ...prev,
        chatHistory: [
          ...(prev.chatHistory || []),
          {
            role: 'assistant' as const,
            content: language === 'el' ? "Συγγνώμη, υπήρξε ένα πρόβλημα στην επικοινωνία." : "Sorry, there was a problem communicating.",
            timestamp: new Date().toISOString()
          }
        ]
      }));
    } finally {
      setLoading(false);
    }
  };

  const history = companionData.chatHistory || [];

  return (
    <div className="flex flex-col h-[70dvh] -mx-5 -mb-6 animate-fade-in relative bg-stone-50 dark:bg-stone-900/40">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center transition hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-90 overflow-hidden ring-1 ring-teal-500/20">
            <img 
              src="/temple-cat.png" 
              alt="" 
              className="w-full h-full object-cover" 
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/favicon-96x96.png'; }}
            />
          </button>
          <div className="flex flex-col">
            <h2 className="font-display text-lg font-medium leading-none tracking-tight text-pine-900 dark:text-pine-50">{language === 'el' ? 'Η Γάτα του Ναού' : 'The Temple Cat'}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400 font-bold">{language === 'el' ? 'Ενσυνείδητη Παρουσία' : 'Mindful Presence'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-8 space-y-8 scroll-smooth custom-scrollbar">
        {history.length === 0 && (
          <div className="text-center py-10 px-6 max-w-sm mx-auto">
            <div className="w-20 h-20 bg-teal-500/10 dark:bg-teal-500/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-soft-pulse overflow-hidden ring-2 ring-teal-500/20">
              <img 
                src="/temple-cat.png" 
                alt="Magical Cat" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/favicon-96x96.png'; }}
              />
            </div>
            <p className="text-stone-500 dark:text-stone-400 font-serif italic text-[17px] leading-relaxed">
              {language === 'el' 
                ? '«Νιώσε το βάρος σου στο έδαφος... Πώς μπορώ να σε συντροφεύσω στη σιωπή του ναού μας σήμερα;»' 
                : '"Feel your weight on the ground... How can I accompany you in the silence of our temple today?"'}
            </p>
            <div className="mt-8 grid grid-cols-1 gap-2">
               {[
                 language === 'el' ? 'Νιώθω ένταση στο σώμα' : 'I feel tension in my body',
                 language === 'el' ? 'Πώς να κάνω την αναπνοή SOS;' : 'How to do SOS breath?',
                 language === 'el' ? 'Δυσκολεύομαι να ηρεμήσω' : 'I find it hard to calm down'
               ].map((suggestion, i) => (
                 <button 
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="text-[13px] text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 py-2 px-4 rounded-xl border border-teal-200/50 dark:border-teal-800/50 transition-colors"
                 >
                   {suggestion}
                 </button>
               ))}
            </div>
          </div>
        )}
        
        {history.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-3xl px-5 py-4 shadow-sm text-[15px] leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-teal-700 text-white rounded-tr-none font-medium' 
                : 'bg-white dark:bg-stone-800/90 text-stone-800 dark:text-stone-100 border border-stone-100 dark:border-stone-700/50 rounded-tl-none font-serif italic text-[16px]'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/50 dark:bg-stone-800/50 rounded-3xl rounded-tl-none px-6 py-4 border border-stone-100 dark:border-stone-800/50">
               <div className="flex gap-2">
                 <div className="w-1.5 h-1.5 bg-teal-500/50 rounded-full animate-bounce" />
                 <div className="w-1.5 h-1.5 bg-teal-500/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                 <div className="w-1.5 h-1.5 bg-teal-500/50 rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 dark:bg-stone-900/80 border-t border-stone-200 dark:border-stone-800 backdrop-blur-md sticky bottom-0 z-20">
        {isOffline && (
          <div className="text-center py-2 px-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] mb-3 font-medium">
            {language === 'el' 
              ? 'Η Γάτα αναπαύεται... (Είσαι εκτός σύνδεσης)' 
              : 'The Cat is resting... (You are offline)'}
          </div>
        )}
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isOffline}
            placeholder={isOffline ? (language === 'el' ? 'Εκτός σύνδεσης...' : 'Offline...') : (language === 'el' ? 'Μίλησε μου...' : 'Speak to me...')}
            className="flex-1 bg-stone-100 dark:bg-stone-800 border-none rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 font-medium disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="group w-14 h-14 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-50 disabled:grayscale shadow-lg shadow-teal-700/20"
          >
            <span className="text-xl font-bold group-hover:translate-x-1 transition-transform">➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}

