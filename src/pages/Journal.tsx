import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Check, BarChart2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';
import { useReward } from '../contexts/RewardContext';
import { getAIReflection, AIReflectionResponse } from '../services/geminiService';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Sparkles, Loader2, MessageSquare, ListFilter, Quote, Activity } from 'lucide-react';

type Axis = 'body' | 'breath' | 'focus' | 'space';

interface JournalEntry {
  id: number;
  day: string;
  checked: Record<Axis, boolean>;
  note: string;
  mood?: string;
  energy?: number; // 1-5
  sensory?: string[];
  comfort?: number; // 1-5
  tags?: string;
  tensions?: string[];
}

export default function Journal() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { triggerReward } = useReward();
  const [isRecording, setIsRecording] = useState(false);
  
  const texts = {
    journalTitle: { el: 'Ημερολόγιο', en: 'Journal' },
    journalSub: { el: '7-Ήμερη Πρακτική', en: '7-Day Practice' },
    days: { 
      el: ['Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο','Κυριακή'], 
      en: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] 
    },
    daysShort: {
      el: ['Δ','Τ','Τ','Π','Π','Σ','Κ'],
      en: ['M','T','W','T','F','S','S']
    },
    axes: {
      el: [
        { key: 'body' as Axis, label: '🧍 Σώμα', hex: 'var(--color-axis-body)' },
        { key: 'breath' as Axis, label: '🫁 Αναπνοή', hex: 'var(--color-axis-breath)' },
        { key: 'focus' as Axis, label: '👁 Προσοχή', hex: 'var(--color-axis-focus)' },
        { key: 'space' as Axis, label: '✦ Χώρος', hex: 'var(--color-axis-space)' }
      ],
      en: [
        { key: 'body' as Axis, label: '🧍 Body', hex: 'var(--color-axis-body)' },
        { key: 'breath' as Axis, label: '🫁 Breath', hex: 'var(--color-axis-breath)' },
        { key: 'focus' as Axis, label: '👁 Attention', hex: 'var(--color-axis-focus)' },
        { key: 'space' as Axis, label: '✦ Space', hex: 'var(--color-axis-space)' }
      ]
    },
    resetBtn: { el: 'Επαναφορά εβδομάδας', en: 'Reset week' },
    noteLabel: { el: 'Τι παρατήρησα σήμερα:', en: 'What I noticed today:' },
    notePlaceholder: { el: 'Γράψε τις παρατηρήσεις σου...', en: 'Write your observations...' },
    promptLabel: { el: 'Βοηθητικές ερωτήσεις:', en: 'Guided reflections:' },
    prompts: {
      body: { el: ['Σε ποιο σημείο ήμουν σφιγμένος;','Ένιωσα τη βαρύτητά μου;','Πώς ήταν η στάση μου;'], en: ['Where was I holding tension?','Did I feel my weight / gravity?','How was my posture?'] },
      breath: { el: ['Ήταν η αναπνοή μου γρήγορη ή αργή;','Ένιωσα τον αέρα στα ρουθούνια;','Ακολούθησα τον κύκλο 4-2-6-1;'], en: ['Was my breathing fast or slow?','Did I feel air at my nostrils?','Did I follow the 4-2-6-1 cycle?'] },
      focus: { el: ['Η προσοχή ήταν κλειστή, ανοιχτή ή διασπασμένη;','Πού κόλλησε η προσοχή μου;','Πόσες φορές επέστρεψα;'], en: ['Was attention closed, open or scattered?','Where did my attention stick?','How many times did I return?'] },
      space: { el: ['Είχα ανοιχτή επίγνωση;','Ένιωσα τον χώρο γύρω μου;','Άκουσα ήχους χωρίς να κολλήσω;'], en: ['Did I have open awareness?','Did I feel the space around me?','Did I hear sounds without getting stuck?'] }
    },
    confirmReset: { el: 'Να καθαριστούν όλες οι εγγραφές;', en: 'Clear all entries?' },
    moods: [
      { id: 'calm', el: '🧘 Ήρεμος', en: '🧘 Calm', color: '#14b8a6' },
      { id: 'focus', el: '🎯 Συγκεντρωμένος', en: '🎯 Focused', color: '#0ea5e9' },
      { id: 'tired', el: '😴 Κουρασμένος', en: '😴 Tired', color: '#6366f1' },
      { id: 'anxious', el: '🌀 Αγχωμένος', en: '🌀 Anxious', color: '#f59e0b' },
      { id: 'overwhelmed', el: '💥 Υπερφορτωμένος', en: '💥 Overwhelmed', color: '#ef4444' }
    ],
    sensoryLabels: {
      el: ['🔊 Θόρυβος', '🔇 Ησυχία', '💡 Έντονο φως', '👥 Πολύς κόσμος', '🏠 Ασφαλής χώρος'],
      en: ['🔊 Noisy', '🔇 Quiet', '💡 Bright light', '👥 Social', '🏠 Safe space']
    },
    energyLabel: { el: 'Επίπεδο Ενέργειας', en: 'Energy Level' },
    sensoryTitle: { el: 'Περιβάλλον / Αισθήσεις', en: 'Environment / Sensory' },
    comfortLevel: { el: 'Επίπεδο Άνεσης', en: 'Comfort Level' },
    comfortLabels: {
      el: ['Πολύ δύσκολα','Δύσκολα','Έτσι κι έτσι','Καλά','Πολύ καλά'],
      en: ['Very hard', 'Hard', 'Okay', 'Good', 'Very good']
    },
    comfortEmojis: ['😣','😕','😐','🙂','😌'],
    bodyParts: {
      head: { el: 'Κεφάλι', en: 'Head' },
      neck: { el: 'Αυχένας', en: 'Neck' },
      chest: { el: 'Θώρακας', en: 'Chest' },
      belly: { el: 'Κοιλιά', en: 'Belly' },
      back: { el: 'Πλάτη', en: 'Back' },
      hands: { el: 'Χέρια', en: 'Hands' },
      legs: { el: 'Πόδια', en: 'Legs' }
    },
    bodyMapTitle: { el: 'Σημεία Έντασης', en: 'Tension Map' },
    tagsPlaceholder: { el: 'Ετικέτες (π.χ. πρωινή, σπίτι...)', en: 'Tags (e.g. morning, home...)' },
    exportBtn: { el: '💾 Εξαγωγή Σημειώσεων', en: '💾 Export Notes' },
    micError: { el: 'Το μικρόφωνο δεν υποστηρίζεται', en: 'Microphone not supported' },
    savedLocal: { el: 'Αποθηκεύτηκε τοπικά', en: 'Saved locally' }
  };

  const getEmptyWeek = (): JournalEntry[] => {
    return texts.days[language].map((d, i) => ({
      id: i,
      day: d,
      checked: { body: false, breath: false, focus: false, space: false },
      note: '',
      energy: 3,
      sensory: [],
      comfort: 3,
      tags: '',
      tensions: []
    }));
  };

  const [journalData, setJournalData] = useState<JournalEntry[]>([]);
  const [activeDay, setActiveDay] = useState<number>(0);
  const [breathSessions, setBreathSessions] = useState<Record<number, number>>({});
  const [view, setView] = useState<'daily' | 'stats'>('daily');
  const [aiReflection, setAiReflection] = useState<AIReflectionResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const moodValueMap: Record<string, number> = {
    'calm': 5,
    'focus': 4,
    'tired': 3,
    'anxious': 2,
    'overwhelmed': 1
  };

  const chartData = useMemo(() => {
    return journalData.map((d, i) => ({
      name: texts.daysShort[language][i],
      mood: d.mood ? moodValueMap[d.mood] : null,
      fullDay: d.day,
      sessions: breathSessions[i] || 0,
      checks: Object.values(d.checked).filter(Boolean).length
    }));
  }, [journalData, language, breathSessions]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('journal_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        const withCorrectDays = parsed.map((e: any, i: number) => ({
          ...e,
          day: texts.days[language][i]
        }));
        setJournalData(withCorrectDays);
        
        const firstUnticked = withCorrectDays.findIndex((e: any) => Object.values(e.checked).filter(Boolean).length < texts.axes[language].length);
        if (firstUnticked !== -1) {
          setActiveDay(firstUnticked);
        }
      } else {
        setJournalData(getEmptyWeek());
      }
    } catch {
      setJournalData(getEmptyWeek());
    }

    try {
      const sessionsStr = localStorage.getItem('breath_sessions');
      if (sessionsStr) {
        const sessionsData = JSON.parse(sessionsStr);
        const getWeekStart = () => {
          const now = new Date(); 
          const day = now.getDay(); 
          const diff = now.getDate() - day + (day === 0 ? -6 : 1); 
          const monday = new Date(now.setDate(diff)); 
          return monday.toISOString().split('T')[0];
        };
        const prefix = getWeekStart() + '_';
        
        const sessionsMap: Record<number, number> = {};
        for (let i = 0; i < 7; i++) {
          if (sessionsData[prefix + i]) {
            sessionsMap[i] = sessionsData[prefix + i];
          }
        }
        setBreathSessions(sessionsMap);
      }
    } catch {}
  }, [language]);

  const saveJournal = (data: JournalEntry[]) => {
    setJournalData(data);
    localStorage.setItem('journal_v1', JSON.stringify(data));
    showSaveToast();
  };

  const showSaveToast = () => {
    const toast = document.createElement('div');
    toast.textContent = texts.savedLocal[language];
    toast.className = "fixed bottom-24 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-in fade-in slide-in-from-bottom-2 z-50 pointer-events-none";
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-out', 'fade-out', 'slide-out-to-bottom-2');
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  }

  const toggleCheck = (di: number, key: Axis) => {
    const newData = [...journalData];
    newData[di].checked[key] = !newData[di].checked[key];
    
    // Check if now all axes are checked
    const isNowAllChecked = Object.values(newData[di].checked).every(Boolean);
    if (isNowAllChecked && !Object.values(journalData[di].checked).every(Boolean)) {
       triggerReward('journal');
    }
    
    saveJournal(newData);
  };

  const updateNote = (di: number, text: string) => {
    const newData = [...journalData];
    newData[di].note = text;
    saveJournal(newData);
  };

  const updateMood = (di: number, moodId: string) => {
    const newData = [...journalData];
    newData[di].mood = newData[di].mood === moodId ? undefined : moodId;
    saveJournal(newData);
  };

  const updateComfort = (di: number, val: number) => {
    const newData = [...journalData];
    newData[di].comfort = val;
    saveJournal(newData);
  };

  const updateTags = (di: number, val: string) => {
    const newData = [...journalData];
    newData[di].tags = val;
    saveJournal(newData);
  };

  const toggleTension = (di: number, part: string) => {
    const newData = [...journalData];
    const current = newData[di].tensions || [];
    if (current.includes(part)) {
      newData[di].tensions = current.filter(p => p !== part);
    } else {
      newData[di].tensions = [...current, part];
    }
    saveJournal(newData);
  };

  const toggleSensory = (di: number, label: string) => {
    const newData = [...journalData];
    const current = newData[di].sensory || [];
    if (current.includes(label)) {
      newData[di].sensory = current.filter(l => l !== label);
    } else {
      newData[di].sensory = [...current, label];
    }
    saveJournal(newData);
  };

  const addPrompt = (di: number, prompt: string) => {
    const newData = [...journalData];
    const current = newData[di].note || '';
    if (current.includes(prompt)) return;
    newData[di].note = current + (current ? '\n' : '') + '• ' + prompt + ' ';
    saveJournal(newData);
  };

  const startSpeech = (di: number) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert(texts.micError[language]);
      return;
    }

    const recognition = new SR();
    recognition.lang = language === 'el' ? 'el-GR' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      const newData = [...journalData];
      const current = newData[di].note || '';
      newData[di].note = current + (current ? ' ' : '') + text;
      saveJournal(newData);
    };

    recognition.start();
  };

  const exportJournal = () => {
    const axesList = texts.axes[language];
    let content = `NEURODIVERGENT MINDFULNESS - JOURNAL EXPORT\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `------------------------------------------\n\n`;

    journalData.forEach((entry, i) => {
      const checkedCount = Object.values(entry.checked).filter(Boolean).length;
      content += `${entry.day} (Day ${i + 1})\n`;
      content += `Progress: ${checkedCount}/${axesList.length} completed\n`;
      if (entry.comfort) {
        content += `Comfort: ${entry.comfort}/5 (${texts.comfortLabels[language][entry.comfort - 1]})\n`;
      }
      if (entry.tags) content += `Tags: ${entry.tags}\n`;
      if (entry.tensions && entry.tensions.length > 0) {
        const parts = entry.tensions.map(p => (texts.bodyParts as any)[p][language]).join(', ');
        content += `Tension areas: ${parts}\n`;
      }
      if (entry.note) content += `Notes:\n${entry.note}\n`;
      content += `\n------------------------------------------\n\n`;
    });

    const file = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindfulness_journal_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetJournal = () => {
    const message = texts.confirmReset[language];
    if (window.confirm(message)) {
      saveJournal(getEmptyWeek());
      setActiveDay(0);
      setAiReflection(null);
    }
  };

  const handleFetchAI = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      // Filter for days that have at least some data (either a check or a note)
      const dataWithContent = journalData.filter(d => 
        Object.values(d.checked).some(Boolean) || (d.note && d.note.length > 5)
      );

      if (dataWithContent.length === 0) {
        setAiError(language === 'el' ? 'Χρειάζεται τουλάχιστον μία καταγραφή για ανάλυση.' : 'Need at least one entry for analysis.');
        setIsAiLoading(false);
        return;
      }

      const reflection = await getAIReflection(journalData, language);
      setAiReflection(reflection);
      triggerReward('journal');
    } catch (err: any) {
      setAiError(language === 'el' ? 'Σφάλμα κατά την ανάλυση. Δοκιμάστε ξανά.' : 'Error during analysis. Try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!journalData.length) return null;

  const axes = texts.axes[language];
  const max = 7 * axes.length;
  const total = journalData.reduce((s, e) => s + Object.values(e.checked).filter(Boolean).length, 0);
  const pct = Math.round((total / max) * 100);
  
  const entry = journalData[activeDay];
  const done = Object.values(entry.checked).filter(Boolean).length === axes.length;
  const sessions = breathSessions[activeDay] || 0;
  const checkedAxes = axes.filter(ax => entry.checked[ax.key]);

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex-none flex items-center gap-3 px-4 pt-2 pb-2">
        <button 
          onClick={() => navigate('/')} 
          className="w-10 h-10 rounded-full bg-pine-800 border border-pine-700 flex flex-none items-center justify-center text-pine-300 hover:bg-pine-700 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h2 className="text-[18px] md:text-[20px] font-bold text-pine-100 tracking-wide font-heading leading-tight">{texts.journalTitle[language]}</h2>
          <div className="text-[11px] md:text-[13px] text-pine-400 font-medium">
            {total}/{max} ✓ · {pct}%
          </div>
        </div>
        <div className="flex bg-pine-900/50 p-1 rounded-xl border border-pine-800">
          <button 
            onClick={() => setView('daily')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5",
              view === 'daily' ? "bg-pine-700 text-white shadow-sm" : "text-pine-500 hover:text-pine-300"
            )}
          >
            <Calendar size={12} />
            {language === 'el' ? 'ΗΜΕΡΑ' : 'DAILY'}
          </button>
          <button 
            onClick={() => setView('stats')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5",
              view === 'stats' ? "bg-teal-600 text-white shadow-sm" : "text-pine-500 hover:text-pine-300"
            )}
          >
            <BarChart2 size={12} />
            {language === 'el' ? 'ΣΤΑΤΙΣΤΙΚΑ' : 'STATS'}
          </button>
        </div>
      </div>

      {/* Progress Bar overall */}
      <div className="flex-none px-4 mb-2">
        <div className="h-1.5 bg-pine-800 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex-none px-2 mb-3">
        <div className="flex justify-between items-center bg-pine-900/50 shape-btn p-1.5 border border-pine-800">
          {journalData.map((d, i) => {
            const isDayDone = Object.values(d.checked).filter(Boolean).length === axes.length;
            const isActive = i === activeDay;
            return (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all relative active:scale-95 duration-200",
                  isActive ? "bg-pine-800 shadow-md" : "hover:bg-pine-800/50 hover:bg-pine-800/40"
                )}
              >
                <span className={cn(
                  "text-[10px] uppercase font-bold mb-1",
                  isActive ? "text-pine-200" : "text-pine-50"
                )}>{texts.daysShort[language][i]}</span>
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                  isDayDone ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" : 
                  isActive ? "bg-white text-pine-900 shadow-sm" : 
                  "bg-pine-950 border border-pine-800 text-pine-400"
                )}>
                  {isDayDone ? <Check size={12} strokeWidth={3} /> : (i + 1)}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-12 custom-scrollbar">
        {view === 'daily' ? (
          <div className="space-y-6">
            {/* Quick Mood Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                  {language === 'el' ? 'Πώς νιώθετε;' : 'How are you feeling?'}
                </span>
                {entry.mood && (
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                    {texts.moods.find(m => m.id === entry.mood)?.[language]}
                  </span>
                )}
              </div>
              <div className="flex justify-between gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {texts.moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => updateMood(activeDay, mood.id)}
                    className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 active:scale-90",
                      entry.mood === mood.id 
                        ? "bg-white/[0.08] border border-white/20 shadow-lg scale-110" 
                        : "bg-white/[0.02] border border-white/5 opacity-40 hover:opacity-100"
                    )}
                  >
                    {mood.el.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Check-in Sections Grouped */}
            <div className="space-y-8">
              {/* 1. THE MIND */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-l-2 border-indigo-500/30 pl-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/60">
                    {language === 'el' ? 'Ο Νους' : 'The Mind'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[axes[1], axes[2]].map(ax => (
                    <button
                      key={ax.key}
                      onClick={() => toggleCheck(activeDay, ax.key)}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all duration-300 text-left active:scale-[0.98] group",
                        entry.checked[ax.key] 
                          ? "bg-indigo-500/10 border-indigo-500/40" 
                          : "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100"
                      )}
                    >
                      <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center mb-2 transition-colors",
                          entry.checked[ax.key] ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-white/40 group-hover:text-white/60"
                      )}>
                        <span className="text-sm">{ax.label.split(' ')[0]}</span>
                      </div>
                      <span className={cn(
                        "text-[13px] font-serif italic",
                        entry.checked[ax.key] ? "text-white" : "text-white/30"
                      )}>{ax.label.split(' ')[1]}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* 2. THE BODY */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-l-2 border-emerald-500/30 pl-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/60">
                    {language === 'el' ? 'Το Σώμα' : 'The Body'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <button
                      onClick={() => toggleCheck(activeDay, axes[0].key)}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all duration-300 text-left active:scale-[0.98] group",
                        entry.checked[axes[0].key] 
                          ? "bg-emerald-500/10 border-emerald-500/40" 
                          : "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100"
                      )}
                    >
                      <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center mb-2 transition-colors",
                          entry.checked[axes[0].key] ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/40 group-hover:text-white/60"
                      )}>
                         <span className="text-sm">{axes[0].label.split(' ')[0]}</span>
                      </div>
                      <span className={cn(
                        "text-[13px] font-serif italic",
                        entry.checked[axes[0].key] ? "text-white" : "text-white/30"
                      )}>{axes[0].label.split(' ')[1]}</span>
                    </button>

                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                       <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">{texts.comfortLevel[language]}</span>
                       <div className="flex items-center gap-2">
                          <span className="text-lg">{texts.comfortEmojis[(entry.comfort || 3) - 1]}</span>
                          <input 
                            type="range" min="1" max="5" 
                            value={entry.comfort || 3} 
                            onChange={(e) => updateComfort(activeDay, parseInt(e.target.value))}
                            className="flex-1 accent-emerald-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                          />
                       </div>
                    </div>
                </div>

                {/* Body Map Integration - Cleaner */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 overflow-hidden">
                  <div className="flex gap-6 items-center">
                    <div className="w-24 h-32 shrink-0 opacity-40 hover:opacity-100 transition-opacity">
                      <svg viewBox="0 0 100 160" className="w-full h-full">
                        <style>{`
                          .bp { transition: all 0.3s ease; cursor: pointer; fill: none; stroke: rgba(255,255,255,0.1); stroke-width: 1.5; }
                          .bp-active { stroke: #10b981; stroke-width: 2.5; filter: drop-shadow(0 0 4px rgba(16,185,129,0.4)); opacity: 1 !important; }
                        `}</style>
                        <g className={cn("bp", entry.tensions?.includes('head') && "bp-active")} onClick={() => toggleTension(activeDay, 'head')}>
                          <path d="M50,10 Q58,10 60,20 Q60,30 50,30 Q42,30 40,20 Q40,10 50,10" />
                        </g>
                        <g className={cn("bp", entry.tensions?.includes('neck') && "bp-active")} onClick={() => toggleTension(activeDay, 'neck')}>
                          <path d="M46,30 L46,38 M54,30 L54,38" />
                        </g>
                        <g className={cn("bp", entry.tensions?.includes('chest') && "bp-active")} onClick={() => toggleTension(activeDay, 'chest')}>
                          <path d="M35,55 L65,55 L68,80 L32,80 Z" />
                        </g>
                        <g className={cn("bp", entry.tensions?.includes('belly') && "bp-active")} onClick={() => toggleTension(activeDay, 'belly')}>
                          <path d="M32,80 L68,80 L65,105 L35,105 Z" />
                        </g>
                        <g className={cn("bp", entry.tensions?.includes('hands') && "bp-active")} onClick={() => toggleTension(activeDay, 'hands')}>
                          <path d="M25,48 L15,75 L12,105 Q12,112 18,110 L22,75" />
                          <path d="M75,48 L85,75 L88,105 Q88,112 82,110 L78,75" />
                        </g>
                        <g className={cn("bp", entry.tensions?.includes('legs') && "bp-active")} onClick={() => toggleTension(activeDay, 'legs')}>
                          <path d="M35,105 L30,135 L33,160 L45,158 L42,135 L50,110" />
                          <path d="M65,105 L70,135 L67,160 L55,158 L58,135 L50,110" />
                        </g>
                      </svg>
                    </div>
                    <div className="flex flex-wrap gap-1.5 flex-1 content-start">
                      {Object.keys(texts.bodyParts).slice(0, 6).map(key => (
                         <button
                           key={key}
                           onClick={() => toggleTension(activeDay, key)}
                           className={cn(
                             "px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all active:scale-95",
                             entry.tensions?.includes(key)
                               ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                               : "bg-white/5 text-white/30 border-white/5 hover:border-white/10"
                           )}
                         >
                           {(texts.bodyParts as any)[key][language]}
                         </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. THE ENVIRONMENT */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-l-2 border-amber-500/30 pl-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/60">
                    {language === 'el' ? 'Ο Χώρος' : 'The Environment'}
                  </span>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => toggleCheck(activeDay, axes[3].key)}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left active:scale-[0.98] group flex items-center justify-between",
                      entry.checked[axes[3].key] 
                        ? "bg-amber-500/10 border-amber-500/40" 
                        : "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                          entry.checked[axes[3].key] ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-white/40"
                      )}>
                        <span className="text-sm">{axes[3].label.split(' ')[0]}</span>
                      </div>
                      <span className={cn(
                        "text-[13px] font-serif italic",
                        entry.checked[axes[3].key] ? "text-white" : "text-white/30"
                      )}>{axes[3].label.split(' ')[1]}</span>
                    </div>
                    {entry.checked[axes[3].key] && <Check size={16} className="text-amber-400" />}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    {texts.sensoryLabels[language].slice(0, 4).map(label => (
                       <button
                         key={label}
                         onClick={() => toggleSensory(activeDay, label)}
                         className={cn(
                           "px-3 py-3 rounded-2xl text-[11px] font-sans font-medium border transition-all text-left group",
                           entry.sensory?.includes(label)
                             ? "bg-white/[0.08] text-white border-white/20"
                             : "bg-white/[0.02] text-white/30 border-white/5 opacity-60 hover:opacity-100"
                         )}
                       >
                         {label}
                       </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* NOTES / JOURNALING */}
              <section className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                     {language === 'el' ? 'Σημειώσεις & Σκέψεις' : 'Notes & Reflections'}
                  </span>
                  <button 
                    onClick={() => startSpeech(activeDay)}
                    className={cn(
                      "p-2 rounded-full transition-all duration-300 active:scale-90",
                      isRecording ? "bg-rose-500/20 text-rose-400 animate-pulse" : "bg-white/5 text-white/30"
                    )}
                  >
                    {isRecording ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    value={entry.note}
                    onChange={(e) => updateNote(activeDay, e.target.value)}
                    placeholder={texts.notePlaceholder[language]}
                    className="w-full h-48 rounded-[2rem] bg-white/[0.03] border border-white/5 p-6 text-[15px] text-white/90 font-sans leading-relaxed focus:outline-none focus:bg-white/[0.06] transition-all placeholder:text-white/10"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 px-1 no-scrollbar">
                   {checkedAxes.map(ax => 
                    texts.prompts[ax.key][language].map((q, qIdx) => (
                      <button
                        key={`${ax.key}-${qIdx}`}
                        onClick={() => addPrompt(activeDay, q)}
                        className="flex-shrink-0 px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-[11px] text-white/40 hover:text-white hover:bg-white/5 transition-all text-left italic font-serif"
                      >
                        {q}
                      </button>
                    ))
                  )}
                </div>
              </section>
            </div>

            <div className="flex flex-col gap-4 pt-8">
              <button 
                onClick={exportJournal}
                className="w-full py-4 rounded-2xl bg-teal-500/10 border-2 border-dashed border-teal-500/20 text-teal-400 text-[11px] font-black uppercase tracking-widest hover:bg-teal-500/20 transition-all active:scale-[0.98]"
              >
                {texts.exportBtn[language]}
              </button>
              
              <button 
                onClick={resetJournal}
                className="py-4 text-[11px] font-sans font-medium text-white/10 hover:text-rose-500/50 transition-colors"
              >
                {texts.resetBtn[language]}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Insight */}
            <div className="flex flex-col items-center justify-center py-6 text-center">
               <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
                  <BarChart2 size={32} />
               </div>
               <h3 className="text-2xl font-serif italic text-white/90">
                 {language === 'el' ? 'Η Εβδομάδα σου' : 'Your Week'}
               </h3>
               <p className="text-[10px] uppercase font-black tracking-widest text-white/20 mt-1">
                 {language === 'el' ? 'ΣΤΟΙΧΕΙΑ ΠΡΟΣΩΠΙΚΗΣ ΡΟΗΣ' : 'PERSONAL FLOW DATA'}
               </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 text-center">
                  <span className="block text-[32px] font-sans font-light text-white mb-1 leading-none">{total}</span>
                  <span className="block text-[9px] uppercase font-black tracking-widest text-white/20">
                    {language === 'el' ? 'ΟΛΟΚΛΗΡΩΜΕΝΑ' : 'COMPLETED'}
                  </span>
               </div>
               <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 text-center">
                  <span className="block text-[32px] font-sans font-light text-indigo-400 mb-1 leading-none">
                    {Object.values(breathSessions).reduce((a, b) => a + b, 0)}
                  </span>
                  <span className="block text-[9px] uppercase font-black tracking-widest text-white/20">
                    {language === 'el' ? 'ΑΝΑΣΕΣ' : 'SESSIONS'}
                  </span>
               </div>
            </div>

            {/* AI AI Reflection Section - Moved Up for priority */}
            <div className="pt-2">
               {!aiReflection && !isAiLoading ? (
                 <button 
                   onClick={handleFetchAI}
                   className="w-full flex items-center justify-center gap-4 p-8 rounded-[2.5rem] border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 transition-all duration-500 group active:scale-[0.98]"
                 >
                   <div className="w-12 h-12 rounded-2xl bg-teal-400/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                     <Sparkles size={24} />
                   </div>
                   <div className="text-left">
                     <span className="block text-lg font-serif italic text-white/90">
                       {language === 'el' ? 'AI Αναστοχασμός' : 'AI Reflection'}
                     </span>
                     <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-teal-500/40">
                       {language === 'el' ? 'ΑΝΑΚΑΛΥΨΕ ΤΑ ΜΟΤΙΒΑ ΣΟΥ' : 'DISCOVER YOUR PATTERNS'}
                     </span>
                   </div>
                 </button>
               ) : (
                 <div className="space-y-4">
                   {isAiLoading ? (
                     <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                        <Loader2 size={32} className="text-teal-500 animate-spin" />
                        <p className="text-[11px] font-sans font-medium text-white/30 tracking-widest uppercase animate-pulse">
                          {language === 'el' ? 'Αναγνώριση Μοτίβων...' : 'Identifying Patterns...'}
                        </p>
                     </div>
                   ) : aiReflection ? (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                     >
                       {/* AI Summary Card */}
                       <div className="relative p-10 rounded-[3rem] bg-teal-500/5 border border-teal-500/10 overflow-hidden shadow-2xl">
                          <div className="absolute top-6 right-8 text-teal-400/5">
                            <Quote size={80} />
                          </div>
                          <p className="relative z-10 text-[20px] font-serif italic text-white/90 leading-relaxed text-center">
                            "{aiReflection.summary}"
                          </p>
                       </div>

                       {/* Findings Grid - Modernized */}
                       <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5">
                            <div className="flex items-center gap-3 mb-6 text-teal-400">
                               <div className="p-2 rounded-xl bg-teal-400/10">
                                 <ListFilter size={18} />
                               </div>
                               <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                 {language === 'el' ? 'Παρατηρήσεις' : 'Patterns Detected'}
                               </span>
                            </div>
                            <ul className="space-y-4">
                              {aiReflection.patterns.map((p, i) => (
                                <li key={i} className="flex gap-4 text-[14px] text-white/70 font-sans leading-relaxed">
                                  <span className="text-teal-500 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" />
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5">
                            <div className="flex items-center gap-3 mb-6 text-indigo-400">
                               <div className="p-2 rounded-xl bg-indigo-400/10">
                                 <MessageSquare size={18} />
                               </div>
                               <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                 {language === 'el' ? 'Βοηθητικές Ερωτήσεις' : 'Questions for you'}
                               </span>
                            </div>
                            <ul className="space-y-4">
                              {aiReflection.questions.map((q, i) => (
                                <li key={i} className="text-[14px] text-white/70 font-serif italic leading-relaxed py-3 px-6 border-l-2 border-indigo-500/20 bg-indigo-500/5 rounded-r-2xl">
                                  {q}
                                </li>
                              ))}
                            </ul>
                          </div>
                       </div>

                       <button 
                         onClick={handleFetchAI}
                         className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-white/10 hover:text-teal-400 transition-colors"
                       >
                         {language === 'el' ? 'Ανανέωση Ανάλυσης' : 'Refresh Analysis'}
                       </button>
                     </motion.div>
                   ) : null}
                 </div>
               )}
            </div>

            {/* Mood Trends Chart - More Elegant */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-serif italic text-white/90">
                    {language === 'el' ? 'Συναισθηματική Ροή' : 'Emotional Flow'}
                  </h4>
                  <p className="text-[9px] uppercase font-black tracking-widest text-white/20 mt-1">
                    {language === 'el' ? 'ΔΙΑΚΥΜΑΝΣΗ ΔΙΑΘΕΣΗΣ' : 'MOOD FLUCTUATION'}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-white/5 text-white/20">
                   <Activity size={18} />
                </div>
              </div>
              
              <div className="h-[240px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <YAxis 
                      domain={[0, 5]} 
                      ticks={[1, 3, 5]}
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }}
                      tickFormatter={(value) => texts.comfortEmojis[value-1] || ''}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0c0e14', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.5rem', fontSize: '11px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#14b8a6' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#14b8a6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorMood)" 
                      connectNulls
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-serif italic text-white/90">
                    {language === 'el' ? 'Συνολική Δεσμευση' : 'Total Engagement'}
                  </h4>
                  <p className="text-[9px] uppercase font-black tracking-widest text-white/20 mt-1">
                    {language === 'el' ? 'ΕΝΕΡΓΕΙΕΣ ΠΡΑΚΤΙΚΗΣ' : 'PRACTICE ACTIONS'}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-white/5 text-white/20">
                   <Calendar size={18} />
                </div>
              </div>
              
              <div className="h-[180px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <YAxis 
                      domain={[0, 4]} 
                      ticks={[0, 2, 4]}
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="checks" 
                      stroke="#818cf8" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 6, fill: '#818cf8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
