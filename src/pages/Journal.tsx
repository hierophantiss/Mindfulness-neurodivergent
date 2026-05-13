import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';

type Axis = 'body' | 'breath' | 'focus' | 'space';

interface JournalEntry {
  id: number;
  day: string;
  checked: Record<Axis, boolean>;
  note: string;
  mood?: string;
  energy?: number; // 1-5
  sensory?: string[];
}

export default function Journal() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
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
    sensoryTitle: { el: 'Περιβάλλον / Αισθήσεις', en: 'Environment / Sensory' }
  };

  const getEmptyWeek = (): JournalEntry[] => {
    return texts.days[language].map((d, i) => ({
      id: i,
      day: d,
      checked: { body: false, breath: false, focus: false, space: false },
      note: '',
      energy: 3,
      sensory: []
    }));
  };

  const [journalData, setJournalData] = useState<JournalEntry[]>([]);
  const [activeDay, setActiveDay] = useState<number>(0);
  const [breathSessions, setBreathSessions] = useState<Record<number, number>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('journal_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure language match for day names
        const withCorrectDays = parsed.map((e: any, i: number) => ({
          ...e,
          day: texts.days[language][i]
        }));
        setJournalData(withCorrectDays);
        
        // Find first unticked day
        const firstUnticked = withCorrectDays.findIndex((e: any) => Object.values(e.checked).filter(Boolean).length < texts.axes[language].length);
        if (firstUnticked !== -1 && firstUnticked !== 0) {
          setActiveDay(firstUnticked);
        }
      } else {
        setJournalData(getEmptyWeek());
      }
    } catch {
      setJournalData(getEmptyWeek());
    }

    // Load breath sessions for the week
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
  };

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

  const updateEnergy = (di: number, val: number) => {
    const newData = [...journalData];
    newData[di].energy = val;
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
                  isActive ? "text-pine-200" : "text-pine-500"
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

      {/* Main Content Area (Scrollable if absolutely necessary, but designed to fit) */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className={cn(
          "h-full flex flex-col rounded-[1.5rem] border overflow-hidden p-4 transition-colors",
          done ? "bg-teal-900/20 border-teal-500/30" : "bg-pine-800/50 border-pine-700/60"
        )}>
          {/* Day Header */}
          <div className="flex-none flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-pine-50 font-heading">
              {entry.day}
            </h3>
            {sessions > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-500/30">
                🫁 {sessions}
              </span>
            )}
          </div>

          {/* Axes Grid */}
          <div className="flex-none grid grid-cols-2 gap-2 mb-4">
            {axes.map(ax => (
              <button
                key={ax.key}
                onClick={() => toggleCheck(activeDay, ax.key)}
                style={{
                  borderColor: ax.hex,
                  backgroundColor: entry.checked[ax.key] ? ax.hex : 'transparent',
                  color: entry.checked[ax.key] ? '#fff' : '#e2e8f0'
                }}
                className="border-2 rounded-2xl px-3 py-2 text-[13px] font-semibold transition-all text-left shadow-sm active:scale-[0.98] flex items-center gap-2"
              >
                <span>{ax.label.split(' ')[0]}</span>
                <span className="flex-1 truncate">{ax.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Quick Mood/Energy - Key for ND Accessibility */}
          <div className="flex-none mb-4 space-y-4">
            {/* Energy Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5 px-1">
                <span className="text-[11px] font-bold text-pine-400 uppercase tracking-wider">{texts.energyLabel[language]}</span>
                <span className="text-[14px]">
                  {entry.energy === 1 && '🪫'}
                  {entry.energy === 2 && '🔋'}
                  {entry.energy === 3 && '⚡'}
                  {entry.energy === 4 && '⚡⚡'}
                  {entry.energy === 5 && '🔥'}
                </span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => updateEnergy(activeDay, val)}
                    className={cn(
                      "h-2 flex-1 rounded-full transition-all",
                      (entry.energy || 0) >= val 
                        ? (val <= 2 ? "bg-amber-500" : val <= 4 ? "bg-teal-500" : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]")
                        : "bg-pine-800"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Mood Picker */}
            <div className="flex flex-wrap gap-2">
              {texts.moods.map(m => (
                <button
                  key={m.id}
                  onClick={() => updateMood(activeDay, m.id)}
                  style={{
                    backgroundColor: entry.mood === m.id ? m.color : 'transparent',
                    borderColor: entry.mood === m.id ? m.color : 'rgba(255,255,255,0.1)',
                    color: entry.mood === m.id ? '#fff' : '#94a3b8'
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all active:scale-[0.95]",
                    entry.mood === m.id ? "shadow-lg scale-[1.02]" : "hover:bg-white/5"
                  )}
                >
                  {language === 'el' ? m.el : m.en}
                </button>
              ))}
            </div>
            
            {/* Sensory Environment */}
            <div className="pt-2">
              <span className="block text-[10px] font-bold text-pine-400 uppercase mb-2 ml-1 tracking-wider">{texts.sensoryTitle[language]}</span>
              <div className="flex flex-wrap gap-1.5">
                {texts.sensoryLabels[language].map(label => {
                  const isSelected = entry.sensory?.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => toggleSensory(activeDay, label)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all",
                        isSelected 
                          ? "bg-pine-200 text-pine-900 border-pine-200" 
                          : "bg-pine-950/40 border-pine-800 text-pine-500 hover:border-pine-700"
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Prompts (Only show if at least one axis checked) */}
          <div className="flex-none">
            {checkedAxes.length > 0 && (
              <div className="mb-3 bg-pine-900/60 p-3 rounded-2xl border border-pine-800/80">
                <div className="text-[10px] font-bold text-pine-400 uppercase tracking-widest mb-2">
                  {texts.promptLabel[language]}
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-[80px] md:max-h-[100px] overflow-y-auto no-scrollbar">
                  {checkedAxes.map(ax => 
                    texts.prompts[ax.key][language].map((q, qIdx) => {
                      const used = entry.note && entry.note.includes(q);
                      if (used) return null; // Hide used prompts to save space
                      return (
                        <button
                          key={`${ax.key}-${qIdx}`}
                          onClick={() => addPrompt(activeDay, q)}
                          className="text-[11px] px-2.5 py-1.5 rounded-full border bg-pine-800/80 border-pine-700/80 text-pine-200 hover:bg-pine-700 active:scale-[0.97] transition-all text-left"
                        >
                          {q}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Note Textarea - Takes remaining space */}
          <div className="flex-1 flex flex-col min-h-[100px]">
            <div className="text-[12px] font-semibold text-pine-300 mb-1.5 pl-1">
              {texts.noteLabel[language]}
            </div>
            <textarea
              value={entry.note}
              onChange={(e) => updateNote(activeDay, e.target.value)}
              placeholder={texts.notePlaceholder[language]}
              className="flex-1 w-full border border-pine-600/60 bg-pine-950/50 rounded-2xl p-3 text-[14px] md:text-[15px] text-pine-100 resize-none focus:outline-none focus:border-teal-500/60 focus:bg-pine-950 transition-colors shadow-inner leading-relaxed placeholder:text-pine-700"
            />
          </div>
        </div>

        <div className="flex justify-center mt-3 pb-2">
          <button 
            onClick={resetJournal}
            className="text-[11px] md:text-[12px] font-medium text-pine-500 hover:text-teal-400 underline decoration-pine-700 hover:decoration-teal-500/50 underline-offset-4 transition-colors px-4 py-2"
          >
            {texts.resetBtn[language]}
          </button>
        </div>
      </div>
    </div>
  );
}