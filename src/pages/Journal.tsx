import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Search, Calendar, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ElementPrompt {
  id: string;
  icon: string;
  title: Record<'el' | 'en', string>;
  questions: Record<'el' | 'en', string[]>;
}

const elements: ElementPrompt[] = [
  {
    id: 'earth',
    icon: '🪨',
    title: { el: 'Γη (Σώμα & Γείωση)', en: 'Earth (Body & Grounding)' },
    questions: {
      el: ['Ποια σημεία του σώματός μου ήταν σφιγμένα;', 'Ένιωσα τη βαρύτητα και τη σταθερότητα σήμερα;', 'Πώς ήταν η στάση μου;'],
      en: ['Which parts of my body held tension?', 'Did I feel gravity and stability today?', 'How was my posture?']
    }
  },
  {
    id: 'water',
    icon: '💧',
    title: { el: 'Νερό (Ροή & Συναίσθημα)', en: 'Water (Flow & Emotion)' },
    questions: {
      el: ['Τι συναισθήματα αναδύθηκαν σήμερα;', 'Ήμουν ευέλικτος στις δυσκολίες;', 'Υπήρξε ροή ή εμπλοκή στην ενέργειά μου;'],
      en: ['What emotions surfaced today?', 'Was I flexible with difficulties?', 'Was there flow or blockages in my energy?']
    }
  },
  {
    id: 'fire',
    icon: '🔥',
    title: { el: 'Φωτιά (Δράση & Εστίαση)', en: 'Fire (Action & Focus)' },
    questions: {
      el: ['Πού διοχέτευσα την προσοχή μου;', 'Ήταν η εστίασή μου καθαρή ή διασπασμένη;', 'Τι με κινητοποίησε ή τι με εξάντλησε;'],
      en: ['Where did I direct my attention?', 'Was my focus clear or scattered?', 'What motivated me or drained me?']
    }
  },
  {
    id: 'air',
    icon: '💨',
    title: { el: 'Αέρας (Νους & Χώρος)', en: 'Air (Mind & Space)' },
    questions: {
      el: ['Ήταν οι σκέψεις μου βιαστικές ή ήρεμες;', 'Βρήκα χώρο ανάμεσα στις αντιδράσεις μου;', 'Πώς ήταν η ποιότητα της αναπνοής μου;'],
      en: ['Were my thoughts hurried or calm?', 'Did I find space between my reactions?', 'How was the quality of my breath?']
    }
  }
];

const MOODS = [
  { id: 1, emoji: '😔', label: { el: 'Βαρύ', en: 'Heavy' } },
  { id: 2, emoji: '😐', label: { el: 'Επίπεδο', en: 'Flat' } },
  { id: 3, emoji: '🙂', label: { el: 'Ήρεμο', en: 'Calm' } },
  { id: 4, emoji: '😄', label: { el: 'Θετικό', en: 'Positive' } },
];

interface JournalEntry {
  text: string;
  mood: number | null;
  timestamp: number;
}

export default function Journal() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateStr = currentDate.toISOString().split('T')[0];
  
  const [entryText, setEntryText] = useState('');
  const [activeMood, setActiveMood] = useState<number | null>(null);
  
  const [viewState, setViewState] = useState<'edit' | 'history'>('edit');
  const [searchQuery, setSearchQuery] = useState('');

  // Load Entry
  useEffect(() => {
    const v2Data = localStorage.getItem(`journal_v2_${dateStr}`);
    if (v2Data) {
      try {
        const parsed = JSON.parse(v2Data) as JournalEntry;
        setEntryText(parsed.text || '');
        setActiveMood(parsed.mood || null);
        return;
      } catch(e) {}
    }
    
    // Fallback parsing (v1 migration)
    const v1Data = localStorage.getItem(`journal_papyrus_${dateStr}`);
    if (v1Data) {
      setEntryText(v1Data);
      setActiveMood(null);
    } else {
      setEntryText('');
      setActiveMood(null);
    }
  }, [dateStr]);

  // Autosave
  const saveEntry = (text: string, mood: number | null) => {
    setEntryText(text);
    setActiveMood(mood);
    
    if (!text.trim() && mood === null) {
      localStorage.removeItem(`journal_v2_${dateStr}`);
      return;
    }
    
    const data: JournalEntry = {
      text,
      mood,
      timestamp: Date.now()
    };
    localStorage.setItem(`journal_v2_${dateStr}`, JSON.stringify(data));
    
    // Maintain v1 backwards compatibility if needed, but not strictly necessary
    localStorage.setItem(`journal_papyrus_${dateStr}`, text);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    saveEntry(e.target.value, activeMood);
  };

  const handleMoodSelect = (moodId: number) => {
    saveEntry(entryText, activeMood === moodId ? null : moodId);
  };

  const addPrompt = (q: string) => {
    const newText = entryText + (entryText ? '\n\n' : '') + `~ ${q}\n`;
    saveEntry(newText, activeMood);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const isToday = new Date().toISOString().split('T')[0] === dateStr;

  // Compile history dynamically
  const allEntries = useMemo(() => {
    const entries: { date: string, data: JournalEntry }[] = [];
    const processedDates = new Set<string>();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key?.startsWith('journal_v2_')) {
        try {
          const date = key.replace('journal_v2_', '');
          const data = JSON.parse(localStorage.getItem(key)!) as JournalEntry;
          if (data.text.trim() || data.mood) {
             entries.push({ date, data });
             processedDates.add(date);
          }
        } catch(e) {}
      } else if (key?.startsWith('journal_papyrus_')) {
         const date = key.replace('journal_papyrus_', '');
         if (processedDates.has(date)) continue; // ignore if v2 exists
         
         const text = localStorage.getItem(key);
         if (text?.trim()) {
           entries.push({ date, data: { text, mood: null, timestamp: 0 } });
           processedDates.add(date);
         }
      }
    }
    return entries.sort((a,b) => b.date.localeCompare(a.date));
  }, [viewState]);

  const filteredHistory = allEntries.filter(entry => 
    entry.data.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
    entry.date.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#0f1117] text-white/80 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-6 bg-[#0f1117]/80 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={() => viewState === 'history' ? setViewState('edit') : navigate('/')} 
          className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-serif italic text-lg text-white/90">
          {language === 'el' ? 'Ημερολόγιο' : 'Journal'}
        </span>
        <button 
          onClick={() => setViewState(viewState === 'edit' ? 'history' : 'edit')}
          className={cn(
             "w-10 h-10 rounded-full flex items-center justify-center transition-all",
             viewState === 'history' ? "bg-teal-500/20 text-teal-300 border border-teal-500/30" : "bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]"
          )}
        >
          {viewState === 'edit' ? <Calendar size={18} /> : <X size={18} />}
        </button>
      </header>

      {/* CONTENT */}
      {viewState === 'edit' ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-6 py-8 pb-32">
           
           {/* Date Nav */}
           <div className="flex items-center justify-between mb-10 bg-white/[0.02] p-2 rounded-full border border-white/[0.05]">
              <button onClick={() => changeDate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/[0.05] text-white/50 hover:text-white transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-sm tracking-[0.15em] uppercase font-semibold text-white/90">
                  {currentDate.toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US', { day: 'numeric', month: 'long' })}
                </span>
                <span className="text-[10px] tracking-wider text-white/40">
                  {currentDate.getFullYear()}
                </span>
              </div>
              <button onClick={() => changeDate(1)} disabled={isToday} className={cn("w-10 h-10 flex items-center justify-center rounded-full transition-colors", isToday ? "opacity-30 cursor-not-allowed text-white/30" : "hover:bg-white/[0.05] text-white/50 hover:text-white")}>
                <ChevronRight size={20} />
              </button>
           </div>

           {/* Mood Tracker */}
           <div className="mb-8">
             <p className="text-[11px] uppercase tracking-[0.15em] text-white/40 font-bold mb-4 ml-2">
               {language === 'el' ? 'ΔΙΑΘΕΣΗ' : 'MOOD'}
             </p>
             <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
               {MOODS.map(m => (
                 <button 
                   key={m.id}
                   onClick={() => handleMoodSelect(m.id)}
                   className={cn(
                     "flex-1 flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-2xl border transition-all",
                     activeMood === m.id 
                       ? "bg-teal-500/10 border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.1)]" 
                       : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]"
                   )}
                 >
                   <span className="text-2xl">{m.emoji}</span>
                   <span className={cn("text-[10px] tracking-wider font-medium text-center", activeMood === m.id ? "text-teal-300" : "text-white/40")}>{m.label[language]}</span>
                 </button>
               ))}
             </div>
           </div>

           {/* Editor */}
           <div className="relative mb-12">
             <textarea 
                value={entryText}
                onChange={handleTextChange}
                placeholder={language === 'el' ? 'Άδειασε το μυαλό σου εδώ...' : 'Empty your mind here...'}
                className="w-full min-h-[40vh] bg-transparent resize-none outline-none text-[16px] md:text-[18px] leading-[1.8] text-white/80 placeholder:text-white/20 font-serif italic py-4"
             />
           </div>

           {/* Prompts */}
           <div className="border-t border-white/[0.05] pt-10">
             <div className="flex items-center gap-2 mb-6 ml-2">
               <Sparkles size={14} className="text-teal-400" />
               <h3 className="text-[11px] uppercase tracking-[0.15em] font-bold text-teal-400">
                 {language === 'el' ? 'ΕΡΕΘΙΣΜΑΤΑ ΓΡΑΦΗΣ' : 'WRITING PROMPTS'}
               </h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {elements.map((el) => (
                 <div key={el.id} className="p-4 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/[0.05]">
                      <span className="text-lg">{el.icon}</span>
                      <span className="text-xs font-bold tracking-wider text-white/60 uppercase">{el.title[language]}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {el.questions[language].map((q, i) => (
                        <button key={i} onClick={() => addPrompt(q)} className="text-left text-sm leading-snug text-white/50 hover:text-white transition-colors py-1.5 px-2 -mx-2 rounded-lg hover:bg-white/[0.04]">
                          "{q}"
                        </button>
                      ))}
                    </div>
                 </div>
               ))}
             </div>
           </div>

        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-6 py-8">
           {/* HISTORY VIEW */}
           <div className="relative mb-8">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40">
               <Search size={16} />
             </div>
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder={language === 'el' ? 'Αναζήτηση εγγραφών...' : 'Search entries...'}
               className="w-full bg-white/[0.03] border border-white/[0.08] rounded-full py-4 pl-12 pr-6 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-teal-500/50 transition-colors"
             />
           </div>

           <div className="space-y-4 pb-24">
             {filteredHistory.length === 0 ? (
               <div className="text-center text-white/40 py-12 text-sm italic font-serif">
                 {language === 'el' ? 'Δεν βρέθηκαν εγγραφές.' : 'No entries found.'}
               </div>
             ) : (
               filteredHistory.map((item) => (
                 <button 
                   key={item.date} 
                   onClick={() => {
                     setCurrentDate(new Date(item.date));
                     setViewState('edit');
                   }}
                   className="w-full text-left p-5 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group"
                 >
                   <div className="flex items-center justify-between mb-3 border-b border-white/[0.05] pb-3">
                     <span className="text-xs font-bold tracking-[0.1em] text-white/60 uppercase">
                       {new Date(item.date).toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                     </span>
                     {item.data.mood && (
                       <span className="text-lg opacity-80">{MOODS.find(m => m.id === item.data.mood)?.emoji}</span>
                     )}
                   </div>
                   <p className="text-sm leading-relaxed text-white/70 font-serif line-clamp-3">
                     {item.data.text || (language === 'el' ? '(Κενή εγγραφή)' : '(Empty entry)')}
                   </p>
                 </button>
               ))
             )}
           </div>
        </motion.div>
      )}
    </div>
  );
}
