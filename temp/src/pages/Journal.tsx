import React, { useState, useEffect } from 'react';
import { ArrowLeft, Feather, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

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

export default function Journal() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [entryText, setEntryText] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateStr = currentDate.toISOString().split('T')[0];

  useEffect(() => {
    const saved = localStorage.getItem(`journal_papyrus_${dateStr}`);
    setEntryText(saved || '');
  }, [dateStr]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEntryText(val);
    localStorage.setItem(`journal_papyrus_${dateStr}`, val);
  };

  const addPrompt = (q: string) => {
    const newText = entryText + (entryText ? '\n\n' : '') + `~ ${q}\n`;
    setEntryText(newText);
    localStorage.setItem(`journal_papyrus_${dateStr}`, newText);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const isToday = new Date().toISOString().split('T')[0] === dateStr;

  return (
    <div className="relative min-h-screen w-full bg-[#e8decd] text-[#4a3f35] font-serif overflow-y-auto pb-24 custom-scrollbar">
       {/* Papyrus texture overlay */}
       <div 
         className="fixed inset-0 opacity-40 pointer-events-none mix-blend-multiply" 
         style={{ 
           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
           backgroundRepeat: 'repeat'
         }} 
       />

       <div className="max-w-3xl mx-auto px-6 py-12 relative z-10 flex flex-col shadow-2xl bg-[#eee4d2]/80 min-h-screen backdrop-blur-sm border-x border-[#4a3f35]/10">
         <div className="flex items-center justify-between mb-10 border-b border-[#4a3f35]/20 pb-6">
           <button 
             onClick={() => navigate('/')} 
             className="w-10 h-10 rounded-full border border-[#4a3f35]/20 flex items-center justify-center text-[#4a3f35]/70 hover:bg-[#4a3f35]/10 transition-colors"
           >
             <ArrowLeft size={18} />
           </button>
           <h1 className="text-3xl md:text-4xl font-serif italic text-[#4a3f35]">
             {language === 'el' ? 'Ημερολόγιο' : 'Journal'}
           </h1>
           <div className="w-10 h-10 flex items-center justify-center text-[#4a3f35]/50">
             <Feather size={22} />
           </div>
         </div>

         <div className="flex-1 flex flex-col">
           <div className="flex items-center justify-between mb-8">
             <button 
               onClick={() => changeDate(-1)}
               className="p-2 text-[#4a3f35]/50 hover:text-[#4a3f35] transition-colors"
             >
               <ChevronLeft size={24} />
             </button>
             <span className="text-sm md:text-base uppercase tracking-[0.2em] font-sans font-bold text-[#4a3f35]/80">
               {currentDate.toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </span>
             <button 
               onClick={() => changeDate(1)}
               disabled={isToday}
               className={`p-2 transition-colors ${isToday ? 'opacity-0 cursor-default' : 'text-[#4a3f35]/50 hover:text-[#4a3f35]'}`}
             >
               <ChevronRight size={24} />
             </button>
           </div>
           
           <textarea
             value={entryText}
             onChange={handleTextChange}
             placeholder={language === 'el' ? "Γράψε τις σκέψεις σου εδώ..." : "Write your thoughts here..."}
             className="w-full flex-1 min-h-[45vh] bg-transparent resize-none outline-none text-lg md:text-xl leading-[2.5] placeholder:text-[#4a3f35]/30 focus:ring-0"
             style={{ 
               backgroundAttachment: 'local',
               backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(74, 63, 53, 0.15) 39px, rgba(74, 63, 53, 0.15) 40px)',
               lineHeight: '40px',
               paddingTop: '8px'
             }}
           />
         </div>

         <div className="mt-16 pt-12 border-t border-[#4a3f35]/20">
           <h3 className="text-xs md:text-sm uppercase tracking-[0.15em] font-sans font-bold text-[#4a3f35]/60 mb-8 text-center">
             {language === 'el' ? 'Τα 4 Στοιχεία - Ερωτήσεις Αναστοχασμού' : 'The 4 Elements - Reflection Prompts'}
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {elements.map((el) => (
               <div key={el.id} className="p-5 rounded-2xl border border-[#4a3f35]/15 bg-[#e8decd]/40 hover:bg-[#e8decd] transition-colors group shadow-sm">
                 <div className="flex items-center gap-3 mb-4">
                   <span className="text-2xl drop-shadow-sm">{el.icon}</span>
                   <h4 className="font-bold font-sans text-sm tracking-wide text-[#4a3f35]/90">{el.title[language]}</h4>
                 </div>
                 <div className="space-y-2">
                   {el.questions[language].map((q, i) => (
                     <button
                       key={i}
                       onClick={() => addPrompt(q)}
                       className="block w-full text-left text-[14px] leading-snug text-[#4a3f35]/70 hover:text-[#4a3f35] p-2 -mx-2 rounded-lg transition-colors group-hover:bg-[#4a3f35]/5"
                     >
                       "{q}"
                     </button>
                   ))}
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
    </div>
  );
}
