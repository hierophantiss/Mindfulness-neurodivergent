import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Check, BarChart2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';
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
        <div className="flex justify-between items-center bg-pine-900/50 rounded-[1.25rem] p-1.5 border border-pine-800">
          {journalData.map((d, i) => {
            const isDayDone = Object.values(d.checked).filter(Boolean).length === axes.length;
            const isActive = i === activeDay;
            return (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all relative",
                  isActive ? "bg-pine-800 shadow-md" : "hover:bg-pine-800/50"
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
      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        {view === 'daily' ? (
          <div className={cn(
            "min-h-full flex flex-col rounded-[1.5rem] border overflow-hidden p-4 transition-colors",
            done ? "bg-teal-900/20 border-teal-500/30" : "bg-pine-800/20 border-pine-700/60"
          )}>
            {/* Day Header */}
            <div className="flex-none flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-pine-50 font-heading">
                  {entry.day}
                </h3>
                {sessions > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-500/30">
                    🫁 {sessions}
                  </span>
                )}
              </div>
            </div>

            {/* Axes Grid */}
            <div className="flex-none grid grid-cols-2 gap-2 mb-6">
              {axes.map(ax => (
                <button
                  key={ax.key}
                  onClick={() => toggleCheck(activeDay, ax.key)}
                  style={{
                    borderColor: ax.hex,
                    backgroundColor: entry.checked[ax.key] ? ax.hex : 'transparent',
                    color: entry.checked[ax.key] ? '#fff' : '#e2e8f0'
                  }}
                  className="border-2 rounded-2xl px-3 py-3 text-[14px] font-semibold transition-all text-left shadow-sm active:scale-[0.98] flex items-center gap-2"
                >
                  <span>{ax.label.split(' ')[0]}</span>
                  <span className="flex-1 truncate">{ax.label.split(' ')[1]}</span>
                </button>
              ))}
            </div>

            <div className="space-y-6 mb-6">
               {/* Comfort Slider with Emoji */}
               <div className="bg-pine-900/40 p-4 rounded-2xl border border-pine-800/60">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] font-bold text-pine-400 uppercase tracking-widest">{texts.comfortLevel[language]}</span>
                  <span className="text-2xl">{texts.comfortEmojis[(entry.comfort || 3) - 1]}</span>
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="1" max="5" 
                    value={entry.comfort || 3} 
                    onChange={(e) => updateComfort(activeDay, parseInt(e.target.value))}
                    className="flex-1 accent-teal-500 h-1.5 bg-pine-950 rounded-full appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-pine-500">{texts.comfortLabels[language][0]}</span>
                  <span className="text-[10px] font-bold text-teal-400">{texts.comfortLabels[language][(entry.comfort || 3) - 1]}</span>
                  <span className="text-[10px] text-pine-500">{texts.comfortLabels[language][4]}</span>
                </div>
              </div>

              {/* Tags Input */}
              <div className="px-1">
                <input 
                  type="text"
                  placeholder={texts.tagsPlaceholder[language]}
                  value={entry.tags || ''}
                  onChange={(e) => updateTags(activeDay, e.target.value)}
                  className="w-full bg-pine-950/40 border border-pine-800 rounded-xl px-4 py-3 text-sm text-pine-200 placeholder:text-pine-700 focus:outline-none focus:border-teal-500/40"
                />
              </div>

              {/* Visual Body Map */}
              <div className="bg-pine-900/40 p-5 rounded-2xl border border-pine-800/60">
                <div className="text-[11px] font-bold text-pine-400 uppercase tracking-widest mb-4">{texts.bodyMapTitle[language]}</div>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-32 h-44 shrink-0 bg-pine-950/60 border border-pine-800 rounded-2xl overflow-hidden shadow-inner relative flex items-center justify-center p-2">
                    <svg viewBox="0 0 100 160" className="w-full h-full">
                      <style>{`
                        .bp { transition: all 0.3s ease; cursor: pointer; fill: none; stroke: #4a5568; stroke-width: 1.5; }
                        .bp-active { stroke: #14b8a6; stroke-width: 2.5; filter: drop-shadow(0 0 4px #14b8a6); opacity: 1 !important; }
                      `}</style>
                      <g className={cn("bp", entry.tensions?.includes('head') && "bp-active")} onClick={() => toggleTension(activeDay, 'head')}>
                        <path d="M50,10 Q58,10 60,20 Q60,30 50,30 Q42,30 40,20 Q40,10 50,10" />
                      </g>
                      <g className={cn("bp", entry.tensions?.includes('neck') && "bp-active")} onClick={() => toggleTension(activeDay, 'neck')}>
                        <path d="M46,30 L46,38 M54,30 L54,38" />
                        <path d="M30,45 Q50,38 70,45 L75,55 L25,55 Z" />
                      </g>
                      <g className={cn("bp", entry.tensions?.includes('chest') && "bp-active")} onClick={() => toggleTension(activeDay, 'chest')}>
                        <path d="M35,55 L65,55 L68,80 L32,80 Z" />
                      </g>
                      <g className={cn("bp", entry.tensions?.includes('belly') && "bp-active")} onClick={() => toggleTension(activeDay, 'belly')}>
                        <path d="M32,80 L68,80 L65,105 L35,105 Z" />
                        <circle cx="50" cy="92" r="2" />
                      </g>
                      <g className={cn("bp", entry.tensions?.includes('hands') && "bp-active")} onClick={() => toggleTension(activeDay, 'hands')}>
                        <path d="M25,48 L15,75 L12,105 Q12,112 18,110 L22,75" />
                        <path d="M75,48 L85,75 L88,105 Q88,112 82,110 L78,75" />
                      </g>
                      <g className={cn("bp", entry.tensions?.includes('legs') && "bp-active")} onClick={() => toggleTension(activeDay, 'legs')}>
                        <path d="M35,105 L30,135 L33,160 L45,158 L42,135 L50,110" />
                        <path d="M65,105 L70,135 L67,160 L55,158 L58,135 L50,110" />
                      </g>
                      <g className={cn("bp", entry.tensions?.includes('back') && "bp-active")} onClick={() => toggleTension(activeDay, 'back')}>
                        <path d="M50,40 L50,105" strokeDasharray="3,3" />
                      </g>
                    </svg>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {Object.entries(texts.bodyParts).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => toggleTension(activeDay, key)}
                        className={cn(
                          "px-3 py-2 rounded-xl text-xs font-bold border transition-all",
                          entry.tensions?.includes(key)
                            ? "bg-teal-500/20 text-teal-400 border-teal-500/40"
                            : "bg-pine-950/40 text-pine-500 border-pine-800 hover:border-pine-600"
                        )}
                      >
                        {label[language]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Prompts Area */}
            {checkedAxes.length > 0 && (
              <div className="mb-6 bg-pine-900/60 p-4 rounded-2xl border border-pine-800/80">
                <div className="text-[10px] font-bold text-pine-400 uppercase tracking-widest mb-3">
                  {texts.promptLabel[language]}
                </div>
                <div className="flex flex-wrap gap-2">
                  {checkedAxes.map(ax => 
                    texts.prompts[ax.key][language].map((q, qIdx) => {
                      const used = entry.note && entry.note.includes(q);
                      if (used) return null;
                      return (
                        <button
                          key={`${ax.key}-${qIdx}`}
                          onClick={() => addPrompt(activeDay, q)}
                          className="text-[11px] px-3 py-2 rounded-xl border bg-pine-800/80 border-pine-700/80 text-pine-200 hover:bg-pine-700 hover:border-pine-500 transition-all text-left active:scale-95"
                        >
                          {q}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Actions & Notes */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <div className="text-[12px] font-semibold text-pine-300">{texts.noteLabel[language]}</div>
                <button 
                  onClick={() => startSpeech(activeDay)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all",
                    isRecording 
                      ? "bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse" 
                      : "bg-teal-500/10 border-teal-500/20 text-teal-400 hover:bg-teal-500/20"
                  )}
                >
                  <span className="text-lg">{isRecording ? '🔴' : '🎙️'}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{isRecording ? 'REC' : 'VOICE'}</span>
                </button>
              </div>
              <textarea
                value={entry.note}
                onChange={(e) => updateNote(activeDay, e.target.value)}
                placeholder={texts.notePlaceholder[language]}
                className="w-full h-40 border border-pine-600/60 bg-pine-950/50 rounded-[1.5rem] p-4 text-[15px] text-pine-100 resize-none focus:outline-none focus:border-teal-500/60 focus:bg-pine-950 transition-colors shadow-inner leading-relaxed placeholder:text-pine-800"
              />
            </div>

            {/* Export Action */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <button 
                onClick={exportJournal}
                className="w-full py-4 rounded-2xl bg-teal-500/10 border-2 border-dashed border-teal-500/40 text-teal-400 text-sm font-bold hover:bg-teal-500/20 transition-all flex items-center justify-center gap-2"
              >
                {texts.exportBtn[language]}
              </button>
              
              <button 
                onClick={resetJournal}
                className="text-[12px] font-medium text-pine-500 hover:text-rose-400 underline decoration-pine-800 hover:decoration-rose-400 underline-offset-8 transition-all px-4 py-4"
              >
                {texts.resetBtn[language]}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mood Trends Chart */}
            <div className="bg-pine-900/40 p-6 rounded-[2rem] border border-pine-800/60">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    {language === 'el' ? 'Τάσεις Διάθεσης' : 'Mood Trends'}
                  </h3>
                  <p className="text-xs text-pine-400">
                    {language === 'el' ? 'Η συναισθηματική σας διακύμανση αυτή την εβδομάδα' : 'Your emotional fluctuation this week'}
                  </p>
                </div>
                <div className="flex gap-2 text-[10px] items-center">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                    <span className="text-pine-300">{language === 'el' ? 'Διάθεση' : 'Mood'}</span>
                  </div>
                </div>
              </div>
              
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#718096', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <YAxis 
                      domain={[0, 5]} 
                      ticks={[1, 2, 3, 4, 5]}
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#718096', fontSize: 10 }}
                      tickFormatter={(value) => texts.comfortEmojis[value-1] || ''}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a1a1a', border: '1px solid #1a3a3a', borderRadius: '1rem', fontSize: '12px' }}
                      itemStyle={{ color: '#14b8a6' }}
                      formatter={(value: number) => [texts.comfortLabels[language][value - 1], language === 'el' ? 'Διάθεση' : 'Mood']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#14b8a6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorMood)" 
                      connectNulls
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Progress Chart */}
            <div className="bg-pine-900/40 p-6 rounded-[2rem] border border-pine-800/60">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white font-heading">
                  {language === 'el' ? 'Συνολική Πρόοδος' : 'Weekly Progress'}
                </h3>
                <p className="text-xs text-pine-400">
                  {language === 'el' ? 'Ενέργειες ανά ημέρα' : 'Completed actions per day'}
                </p>
              </div>
              
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#718096', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <YAxis 
                      domain={[0, 4]} 
                      ticks={[0, 1, 2, 3, 4]}
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#718096', fontSize: 10 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a1a1a', border: '1px solid #1a3a3a', borderRadius: '1rem', fontSize: '12px' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Line 
                      type="stepAfter" 
                      dataKey="checks" 
                      stroke="#818cf8" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#818cf8' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Breath Sessions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-pine-900/40 p-5 rounded-[1.5rem] border border-pine-800/60 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mb-2">
                  <Check size={20} />
                </div>
                <div className="text-2xl font-bold text-white leading-tight">{total}</div>
                <div className="text-[10px] font-bold text-pine-400 uppercase tracking-widest">{language === 'el' ? 'ΟΛΟΚΛΗΡΩΜΕΝΑ' : 'COMPLETED'}</div>
              </div>
              
              <div className="bg-pine-900/40 p-5 rounded-[1.5rem] border border-pine-800/60 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2">
                  <Check size={20} className="rotate-12" />
                </div>
                <div className="text-2xl font-bold text-white leading-tight">
                  {Object.values(breathSessions).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-[10px] font-bold text-pine-400 uppercase tracking-widest">{language === 'el' ? 'ΣΥΝΕΔΡΙΕΣ ΑΝΑΠΝΟΗΣ' : 'BREATH SESSIONS'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
