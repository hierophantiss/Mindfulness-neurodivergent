import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Wind, CloudRain, TreePine, Moon, ChevronLeft, Volume2, VolumeX, Timer, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';
import { useBinauralAudio } from '../hooks/useBinauralAudio';

const sounds = [
  { id: 'waves', icon: Waves, label: { el: 'Κύματα', en: 'Ocean Waves' }, color: 'text-cyan-400', file: '/ocean-waves.mp3' },
  { id: 'rain', icon: CloudRain, label: { el: 'Βροχή', en: 'Soft Rain' }, color: 'text-indigo-400', file: '/soft-rain.mp3' },
  { id: 'forest', icon: TreePine, label: { el: 'Δάσος', en: 'Forest Birds' }, color: 'text-emerald-400', file: '/forest.mp3' },
  { id: 'wind', icon: Wind, label: { el: 'Άνεμος', en: 'Mountain Wind' }, color: 'text-slate-400', file: '/wind.mp3' },
];

export default function Sanctuary() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isDimmed, setIsDimmed] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Initialize audio hook
  const { startAudio, stopAudio, isPlaying } = useBinauralAudio({
    base: 110,
    beat: 6.3,
    pulse: 0.1,
    ambientLayers: activeSound ? [sounds.find(s => s.id === activeSound)?.file || ''] : []
  });

  useEffect(() => {
    let interval: any;
    if (timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      stopAudio();
      setActiveSound(null);
      setTimeLeft(null);
      setTimer(null);
    }
    return () => clearInterval(interval);
  }, [timeLeft, stopAudio]);

  const handleSoundToggle = (id: string) => {
    if (activeSound === id) {
      stopAudio();
      setActiveSound(null);
    } else {
      setActiveSound(id);
      if (!isPlaying) startAudio();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative min-h-screen w-full bg-[#05070a] overflow-hidden flex flex-col pt-20">
      {/* Background Dimmer */}
      <AnimatePresence>
        {isDimmed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-serif italic text-white/90 tracking-tight">
              {language === 'el' ? 'Το Καταφύγιο' : 'The Sanctuary'}
            </h1>
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/20 mt-1">
              {language === 'el' ? 'ΧΩΡΟΣ ΑΝΑΠΑΥΣΗΣ' : 'SPACE OF REST'}
            </p>
          </div>
          <button 
            onClick={() => setIsDimmed(!isDimmed)}
            className={cn(
              "p-2 rounded-full border transition-all duration-300",
              isDimmed ? "bg-teal-500/20 border-teal-500/50 text-teal-400" : "bg-white/5 border-white/10 text-white/40"
            )}
          >
            <Moon size={20} />
          </button>
        </div>

        {/* Visual Focus */}
        <div className="flex-1 flex flex-col items-center justify-center py-12 relative">
          <motion.div 
            animate={{ 
              scale: isPlaying ? [1, 1.05, 1] : 1,
              opacity: isPlaying ? [0.6, 1, 0.6] : 0.4
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-48 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center p-8 blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-teal-500/20 to-transparent animate-pulse" />
          </motion.div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <AnimatePresence mode="wait">
              {timeLeft !== null ? (
                <motion.span 
                  key="timer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="text-4xl font-sans font-light text-teal-100/60 tabular-nums"
                >
                  {formatTime(timeLeft)}
                </motion.span>
              ) : (
                <motion.div 
                   key="icon"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="text-teal-400/20"
                >
                  {activeSound ? (
                    (() => {
                      const Svg = sounds.find(s => s.id === activeSound)?.icon || Waves;
                      return <Svg size={64} className="animate-pulse" />;
                    })()
                  ) : <Waves size={64} />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sound Selection */}
        <div className="space-y-8 mt-auto pb-12">
          {!isDimmed && (
            <div className="grid grid-cols-2 gap-3">
              {sounds.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => handleSoundToggle(sound.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-[2rem] border transition-all duration-500 group",
                    activeSound === sound.id 
                      ? "bg-white/[0.08] border-white/20 shadow-xl" 
                      : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-2xl transition-all duration-500",
                    activeSound === sound.id ? "bg-white/10 " + sound.color : "bg-white/5 text-white/20 group-hover:text-white/40"
                  )}>
                    <sound.icon size={24} />
                  </div>
                  <span className={cn(
                    "text-[11px] font-sans font-medium tracking-wide uppercase",
                    activeSound === sound.id ? "text-white" : "text-white/30"
                  )}>
                    {language === 'el' ? sound.label.el : sound.label.en}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Volume and Timer Controls */}
          {activeSound && !isDimmed && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pt-4"
            >
              <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <Volume2 size={16} className="text-white/20" />
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-teal-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                />
              </div>

              <div className="flex justify-between gap-2 overflow-x-auto pb-2 px-1 no-scrollbar">
                {[5, 10, 15, 20, 30].map(mins => (
                  <button
                    key={mins}
                    onClick={() => {
                      setTimer(mins);
                      setTimeLeft(mins * 60);
                    }}
                    className={cn(
                      "flex-shrink-0 px-4 py-2 rounded-xl border text-[11px] font-sans font-medium transition-all",
                      timer === mins 
                        ? "bg-teal-500/20 border-teal-500/40 text-teal-300" 
                        : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"
                    )}
                  >
                    {mins}m
                  </button>
                ))}
                {timer && (
                  <button 
                    onClick={() => { setTimer(null); setTimeLeft(null); }}
                    className="flex-shrink-0 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px]"
                  >
                    Reset
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
