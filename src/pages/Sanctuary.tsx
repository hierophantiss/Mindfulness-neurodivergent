import { AudioEnabler } from '../components/AudioEnabler';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Wind, CloudRain, TreePine, Moon, ChevronLeft, Volume2, Timer, Info, Play, Youtube, X, ChevronRight, Music, Sparkles, Droplets, Flame, Film, Headphones } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';
import { useBinauralAudio } from '../hooks/useBinauralAudio';

export const sleepTracks: any[] = [
  // Generative Nature
  { id: 'rain-ambient', group: 'binaural', icon: CloudRain, label: { el: 'Ήρεμη Βροχή', en: 'Calm Rain' }, subtitle: { el: 'Φάσμα Ροζ/Καφέ Θορύβου (20Hz-20kHz)', en: 'Pink/Brown Noise Spectrum' }, color: 'text-emerald-400', disableSynth: true, base: 0, beat: 0, ambientLayers: ['rain'] },
  { id: 'ocean-ambient', group: 'binaural', icon: Waves, label: { el: 'Κύματα Ωκεανού', en: 'Ocean Waves' }, subtitle: { el: 'Βαθύς Καφέ/Ροζ Θόρυβος (180Hz-800Hz)', en: 'Deep Brown/Pink Noise (180Hz-800Hz)' }, color: 'text-cyan-400', disableSynth: true, base: 0, beat: 0, ambientLayers: ['ocean'] },
  { id: 'wind-ambient', group: 'binaural', icon: Wind, label: { el: 'Αέρας Βουνού', en: 'Mountain Wind' }, subtitle: { el: 'Ροζ/Λευκός Θόρυβος (500Hz-2800Hz)', en: 'Pink/White Noise Range (500Hz-2800Hz)' }, color: 'text-indigo-400', disableSynth: true, base: 0, beat: 0, ambientLayers: ['wind'] },
  
  // Mixed Binaural & Generative Nature
  { id: 'sleep-963', group: 'binaural', icon: Moon, label: { el: 'Συχνότητα Ύπνου', en: 'Deep Sleep' }, subtitle: { el: '963Hz + Ωκεανός / Delta: 2.5Hz', en: '963Hz + Ocean / Delta: 2.5Hz' }, color: 'text-purple-400', disableSynth: false, base: 963, beat: 2.5, ambientLayers: ['ocean', 'wind'] },
  { id: 'beta-pure', group: 'binaural', icon: Sparkles, label: { el: 'Ισοχρονικός Τόνος', en: 'Focus Beta' }, subtitle: { el: 'Isochronic 20Hz + Βροχή / Beta: 13-30Hz', en: 'Isochronic 20Hz + Rain / Beta: 13-30Hz' }, color: 'text-rose-400', disableSynth: false, base: 200, beat: 20, pulse: 20, ambientLayers: ['rain'] },
  { id: 'theta-dream', group: 'binaural', icon: CloudRain, label: { el: 'Όνειρο Theta', en: 'Theta Dream' }, subtitle: { el: '136.1Hz + Nature / Theta: 4-8Hz', en: '136.1Hz + Nature / Theta: 4-8Hz' }, color: 'text-fuchsia-400', disableSynth: false, base: 136.1, beat: 6.3, pulse: 0.1, ambientLayers: ['rain', 'ocean', 'wind'] },

  // Binaural Pure
  { id: 'delta-pure', group: 'binaural', icon: Music, label: { el: 'Delta Κύματα', en: 'Delta Waves' }, subtitle: { el: 'Καθαρό Delta 2.5Hz / Εύρος: 1-4Hz', en: 'Pure Delta 2.5Hz / Range: 1-4Hz' }, color: 'text-slate-400', disableSynth: false, base: 100, beat: 2.5, pulse: 0.05, ambientLayers: [] },
  { id: 'focus-pure', group: 'binaural', icon: Sparkles, label: { el: 'Εστίαση Beta', en: 'Pure Focus' }, subtitle: { el: 'Καθαρό Beta 14Hz / Εύρος: 13-30Hz', en: 'Pure Beta 14Hz / Range: 13-30Hz' }, color: 'text-amber-400', disableSynth: false, base: 144, beat: 14, pulse: 0, ambientLayers: [] },
];

export default function Sanctuary() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'audio' | 'video' | 'bilateral'>('audio');
  
  const [activeSound, setActiveSound] = useState<string | null>(() => {
    return searchParams.get('track') || null;
  });
  
  const [volume, setVolume] = useState(1.0);
  const [isDimmed, setIsDimmed] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videoStartTime, setVideoStartTime] = useState<number>(0);
  const [mantraStep, setMantraStep] = useState<number>(0);
  const [activeAttentionStyles, setActiveAttentionStyles] = useState<string[]>([]);
  const [isVoidActive, setIsVoidActive] = useState(false);

  const bilateralVideos = [
    {
      id: 'NychXM6Ir_Q',
      title: language === 'en' ? "Bilateral Stimulation: Visual & Audio Focus" : "Bilateral Stimulation: Οπτική & Ηχητική Εστίαση",
      author: "EMDR Bilateral Stimulation",
      category: language === 'en' ? "EMDR / Bilateral Focus" : "EMDR / Διμερής Εστίαση",
      thumbnail: "https://img.youtube.com/vi/NychXM6Ir_Q/maxresdefault.jpg",
      isSpaceMeditation: true,
      description: language === 'en' ? {
        intro: "Bilateral stimulation alternately engages both sides of the brain, creating a sense of calm. Follow the moving visual element with your eyes and listen with both headphones (if possible) to help process tension and regulate the nervous system.",
        tip: "Keep your head still and track the shape only with your eyes, or simply close your eyes and listen to the bilateral audio panning from left to right."
      } : {
        intro: "Η διμερής διέγερση εμπλέκει εναλλάξ τις δύο πλευρές του εγκεφάλου, προσφέροντας ηρεμία. Ακολουθήστε το κινούμενο σχήμα με τα μάτια σας και ακούστε με ακουστικά για να βοηθήσετε στην αυτορρύθμιση και την επεξεργασία της έντασης.",
        tip: "Κρατήστε το κεφάλι σταθερό και ακολουθήστε την κίνηση μόνο με τα μάτια σας. Εναλλακτικά, κλείστε τα μάτια και απλώς αφεθείτε στον ήχο που εναλλάσσεται."
      }
    },
    {
      id: 'N8V-UUriLQM',
      title: language === 'en' ? "Bilateral Peak: Deep Calm" : "Bilateral Peak: Βαθιά Ηρεμία",
      author: "EMDR Bilateral Stimulation",
      category: language === 'en' ? "EMDR / Deep Reset" : "EMDR / Βαθιά Επαναφορά",
      thumbnail: "https://img.youtube.com/vi/N8V-UUriLQM/maxresdefault.jpg",
      isSpaceMeditation: true,
      description: language === 'en' ? {
        intro: "A slower, deeper bilateral cycle designed for deep physical relaxation. Perfect for winding down or recovering from intense sensory or emotional overload.",
        tip: "Let your eyes soften as they follow the target, allowing the rhythm to anchor you completely in the present."
      } : {
        intro: "Ένας πιο αργός, βαθύς διμερής κύκλος σχεδιασμένος για απόλυτη χαλάρωση. Ιδανικός για αποφόρτιση ή ανάκαμψη από έντονη αισθητηριακή ή συναισθηματική υπερφόρτωση.",
        tip: "Αφήστε το βλέμμα σας να μαλακώσει καθώς ακολουθεί τον στόχο, επιτρέποντας στον ρυθμό να σας γειώσει πλήρως στο παρόν."
      }
    }
  ];

  const activeTrackDef = useMemo(() => sleepTracks.find(t => t.id === activeSound), [activeSound]);

  // Handle playing state
  const { startAudio, stopAudio, isPlaying, setGlobalVolume } = useBinauralAudio();

  useEffect(() => {
    setGlobalVolume(volume);
  }, [volume, setGlobalVolume]);

  // Handle deep-linked audio start
  useEffect(() => {
    if (activeSound) {
      const trackDef = sleepTracks.find(t => t.id === activeSound);
      if (trackDef) {
        startAudio({
          base: trackDef.base || 110,
          beat: trackDef.beat || 6.3,
          pulse: trackDef.pulse || 0.1,
          disableSynth: trackDef.disableSynth,
          ambientLayers: trackDef.ambientLayers || []
        });
      }
    }
  }, []);

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
      searchParams.delete('track');
      setSearchParams(searchParams, { replace: true });
    } else {
      stopAudio();
      setActiveSound(id);
      searchParams.set('track', id);
      setSearchParams(searchParams, { replace: true });
      
      const newTrackDef = sleepTracks.find(t => t.id === id);
      if (newTrackDef) {
        startAudio({
          base: newTrackDef.base || 110,
          beat: newTrackDef.beat || 6.3,
          pulse: newTrackDef.pulse || 0.1,
          disableSynth: newTrackDef.disableSynth,
          ambientLayers: newTrackDef.ambientLayers || []
        });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const t = {
    videosTitle: language === 'en' ? 'Cinema of Consciousness' : 'Σινεμά της Συνειδητότητας',
    videosSubtitle: language === 'en' ? 'Visual insights and philosophical explorations' : 'Οπτικές αναζητήσεις και φιλοσοφικές εξερευνήσεις',
    musicTitle: language === 'en' ? 'Binaural Beats & Sleep Music' : 'Ήχοι Ύπνου & Binaural Beats',
    musicSubtitle: language === 'en' ? 'Curated states of rest and deep relaxation' : 'Επιλεγμένες συνθέσεις για βαθιά χαλάρωση',
    groups: {
      music: language === 'en' ? 'Sleep Music & Frequencies' : 'Μουσική Ύπνου & Συχνότητες',
      binaural: language === 'en' ? 'Binaural & Nature' : 'Binaural & Ήχοι Φύσης',
    }
  };

  return (
    <>
      <AudioEnabler />
      <div className="relative min-h-screen w-full bg-transparent overflow-y-auto flex flex-col pt-16 custom-scrollbar pb-32">

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

      <div className="relative z-10 w-full max-w-2xl mx-auto px-5 py-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.1] text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 flex justify-center flex-col items-center">
            <h1 className="text-[26px] font-serif italic text-white/90 leading-none">
              {language === 'el' ? 'Το Καταφύγιο' : 'The Sanctuary'}
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#4a9eca] mt-1.5">
              {language === 'el' ? 'ΧΩΡΟΣ ΑΝΑΠΑΥΣΗΣ' : 'SPACE OF REST'}
            </p>
          </div>
          <button 
            onClick={() => setIsDimmed(!isDimmed)}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300",
              isDimmed ? "bg-teal-500/20 border-teal-500/50 text-teal-400" : "bg-white/5 border-white/10 text-white/40"
            )}
          >
            <Moon size={20} />
          </button>
        </div>

        {/* Custom Tabs */}
        {!isDimmed && (
          <div className="flex p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl mb-8 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab('audio')}
              className={cn(
                "flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === 'audio' 
                  ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.05]" 
                  : "text-white/30 hover:text-white/60"
              )}
            >
              <Headphones size={16} />
              {language === 'el' ? 'BINAURAL BEATS' : 'BINAURAL BEATS'}
            </button>
            <button
              onClick={() => setActiveTab('bilateral')}
              className={cn(
                "flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === 'bilateral' 
                  ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.05]" 
                  : "text-white/30 hover:text-white/60"
              )}
            >
              <Sparkles size={16} />
              {language === 'el' ? 'BILATERAL STIMULATION' : 'BILATERAL STIMULATION'}
            </button>
          </div>
        )}

        {/* Visual Focus (Rendered only on audio tab) */}
        {activeTab === 'audio' && (
          <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
            <div className="relative w-56 h-56 flex items-center justify-center mb-8">
              <motion.div 
                animate={{ 
                  scale: isPlaying ? [1, 1.1, 1] : 1,
                  opacity: isPlaying ? [0.4, 0.7, 0.4] : 0.2
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-teal-500/10 border border-teal-500/30"
              />
              <div className="absolute inset-0 rounded-full border border-teal-500/10" />
            </div>
            
            <div className="flex flex-col items-center gap-2 mb-8 text-center px-4">
              <h2 className="text-[22px] font-serif italic text-white/90">
                {activeTrackDef ? (language === 'el' ? activeTrackDef.label.el : activeTrackDef.label.en) : (language === 'el' ? 'Επιλέξτε ήχο' : 'Select a sound')}
              </h2>
              <p className="text-[11px] font-bold tracking-[0.15em] text-[#4a9eca] uppercase">
                {activeTrackDef ? (language === 'el' ? activeTrackDef.subtitle.el : activeTrackDef.subtitle.en) : ''}
              </p>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <button 
                onClick={() => {
                  if (!activeTrackDef) return;
                  const currentIndex = sleepTracks.findIndex(t => t.id === activeTrackDef.id);
                  const prevIndex = (currentIndex - 1 + sleepTracks.length) % sleepTracks.length;
                  handleSoundToggle(sleepTracks[prevIndex].id);
                  if (!isPlaying) handleSoundToggle(sleepTracks[prevIndex].id); // To ensure playing
                }}
                className={cn("w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:text-white transition-colors", !activeTrackDef && "opacity-50 pointer-events-none")}
              >
                <ChevronLeft size={20} />
              </button>
              
              <button 
                onClick={() => {
                  if (activeTrackDef) {
                    if (isPlaying) stopAudio();
                    else handleSoundToggle(activeTrackDef.id);
                  } else if (sleepTracks.length > 0) {
                    handleSoundToggle(sleepTracks[0].id);
                  }
                }}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 hover:bg-teal-500/30 transition-colors"
              >
                {isPlaying ? <span className="flex gap-1.5"><span className="w-1.5 h-4 bg-current rounded-full" /><span className="w-1.5 h-4 bg-current rounded-full" /></span> : <Play size={24} className="ml-1" fill="currentColor" />}
              </button>

              <button 
                onClick={() => {
                  if (!activeTrackDef) return;
                  const currentIndex = sleepTracks.findIndex(t => t.id === activeTrackDef.id);
                  const nextIndex = (currentIndex + 1) % sleepTracks.length;
                  handleSoundToggle(sleepTracks[nextIndex].id);
                  if (!isPlaying) handleSoundToggle(sleepTracks[nextIndex].id); // To ensure playing
                }}
                className={cn("w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:text-white transition-colors", !activeTrackDef && "opacity-50 pointer-events-none")}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <button 
              onClick={() => {
                // simple cycle timer: null -> 10 -> 20 -> 30 -> null
                if (timer === null) { setTimer(10); setTimeLeft(10 * 60); }
                else if (timer === 10) { setTimer(20); setTimeLeft(20 * 60); }
                else if (timer === 20) { setTimer(30); setTimeLeft(30 * 60); }
                else { setTimer(null); setTimeLeft(null); }
              }}
              className="px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[12px] font-medium text-white/60 hover:bg-white/[0.1] transition-colors"
            >
               {timeLeft !== null ? `· ${formatTime(timeLeft)} · ` : '· '}
               {language === 'el' ? 'Χρονοδιακόπτης' : 'Timer'}
               {timeLeft === null ? ' ·' : ''}
            </button>
          </div>
        )}

        {/* Volume & Timer Controls */}
        {activeTab === 'audio' && activeSound && !isDimmed && (
          <div className="flex flex-col gap-5 px-6 py-5 bg-white/[0.02] border border-white/10 rounded-[2rem] shadow-xl mb-8 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <Volume2 size={20} className="text-white/40" />
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 accent-teal-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Sound Cards */}
        {activeTab === 'audio' && !isDimmed && (
          <div className="flex flex-col gap-10 pb-24">
            {['music', 'binaural'].map(group => (
              <div key={group} className="flex flex-col gap-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#4a9eca] pl-2">
                  {group === 'music' 
                    ? (language === 'el' ? 'ΜΟΥΣΙΚΗ & ΣΥΧΝΟΤΗΤΕΣ' : 'MUSIC & FREQUENCIES')
                    : (language === 'el' ? 'BINAURAL ΚΥΜΑΤΑ' : 'BINAURAL WAVES')
                  }
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {sleepTracks.filter(s => s.group === group).map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => handleSoundToggle(sound.id)}
                      className={cn(
                        "flex justify-between items-center p-4 rounded-[1.5rem] border transition-all duration-300 active:scale-[0.98] text-left overflow-hidden relative group",
                        activeSound === sound.id 
                          ? "bg-[#1a3832]/60 border-teal-500/30" 
                          : "bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06]"
                      )}
                    >
                      <div className="flex items-center gap-4 relative z-10 w-full">
                        <div className={cn(
                          "w-12 h-12 flex items-center justify-center rounded-2xl flex-shrink-0 transition-colors",
                          activeSound === sound.id ? "bg-teal-500/20 text-teal-400" : "bg-white/[0.05] text-white/40 group-hover:text-white/70"
                        )}>
                          <sound.icon size={24} strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-[17px] font-serif italic leading-tight mb-1",
                            activeSound === sound.id ? "text-white" : "text-white/80 group-hover:text-white"
                          )}>
                            {language === 'el' ? sound.label.el : sound.label.en}
                          </span>
                          <span className="text-[10px] font-medium text-white/40 tracking-[0.1em] uppercase">
                            {language === 'el' ? sound.subtitle.el : sound.subtitle.en}
                          </span>
                        </div>
                      </div>
                      <div className="relative z-10 pr-2">
                         {activeSound === sound.id ? (
                           <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
                         ) : (
                           <span className="text-white/30 text-lg font-light">∞</span>
                         )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bilateral Library Section */}
        {activeTab === 'bilateral' && !isDimmed && (
          <div className="flex flex-col gap-6 pb-24">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-2xl bg-[#C8922A]/10 flex items-center justify-center text-[#C8922A]">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-[20px] font-serif italic text-white/90 leading-tight">
                  {language === 'el' ? 'Διμερής Διέγερση / EMDR' : 'Bilateral Stimulation / EMDR'}
                </h2>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold mt-1">
                  {language === 'el' ? 'Ανακούφιση νευρικού συστήματος' : 'Nervous system relief'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {bilateralVideos.map((video) => (
                <button 
                  key={video.id}
                  onClick={() => {
                    setIsDimmed(true);
                    setActiveVideo(video.id);
                    setVideoStartTime(0);
                    setMantraStep(0);
                    setActiveAttentionStyles([]);
                    setIsVoidActive(true);
                  }}
                  className="group flex flex-col md:flex-row gap-5 p-4 md:p-5 bg-[#0f1117] border border-white/10 rounded-[1.5rem] overflow-hidden hover:border-[#C8922A]/30 transition-all text-left w-full active:scale-[0.98]"
                >
                  <div className="relative w-full md:w-56 aspect-video rounded-[1rem] overflow-hidden flex-shrink-0 border border-white/[0.05]">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" style={{ backgroundImage: `url(${video.thumbnail})` }} />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-[#C8922A]/80 group-hover:border-[#C8922A] group-hover:scale-110 transition-all">
                        <Play size={20} className="translate-x-[1px]" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0 pb-1">
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#C8922A] mb-2 block">
                      {video.category}
                    </span>
                    <h3 className="text-[17px] font-serif italic text-white/90 leading-snug mb-1.5 group-hover:text-white transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest font-black text-white/30 truncate">
                      {video.author}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Portal Modal */}
      {activeVideo && createPortal(
        <div className={cn(
          "fixed inset-0 z-[10000] flex flex-col animate-in fade-in duration-1000 overflow-y-auto custom-scrollbar transition-colors duration-1000",
          isVoidActive ? "bg-black" : "bg-black/40 backdrop-blur-md"
        )}>
          {/* Starry Background for Void Mode */}
          <AnimatePresence>
            {isVoidActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3 }}
                className="fixed inset-0 pointer-events-none z-0"
              >
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_0%,transparent_1px)] bg-[length:120px_120px]" />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_1px)] bg-[length:180px_180px] animate-pulse" />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.03)_0%,transparent_1px)] bg-[length:250px_250px]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Bar */}
          <div className={cn(
            "flex-none flex items-center justify-between px-6 h-20 border-b border-white/5 backdrop-blur-xl sticky top-0 z-50 transition-all duration-1000",
            isVoidActive ? "bg-transparent border-transparent opacity-20 hover:opacity-100" : "bg-black/40 backdrop-blur-md/80"
          )}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Youtube size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                {language === 'el' ? 'ΠΡΟΒΟΛΗ ΒΙΝΤΕΟ' : 'NOW PLAYING'}
              </span>
            </div>
            <button 
              onClick={() => setActiveVideo(null)}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative z-10 flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 md:p-8 gap-8 transition-opacity duration-1000">
            {/* Player Container */}
            <div className={cn(
              "flex-[2] space-y-6 transition-all duration-1000",
              isVoidActive ? "scale-105" : "scale-100"
            )}>
              <div className={cn(
                "w-full aspect-video rounded-[2rem] overflow-hidden bg-black shadow-2xl transition-all duration-1000 relative group",
                isVoidActive ? "border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.05)]" : "border-white/10"
              )}>
                <iframe
                  key={`${activeVideo}-${videoStartTime}`}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&start=${videoStartTime}&rel=0&modestbranding=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <div className={cn("hidden md:block transition-opacity duration-1000", isVoidActive ? "opacity-20" : "opacity-100")}>
                 <h2 className="text-3xl md:text-4xl font-serif italic text-white/95 mb-2">
                   {bilateralVideos.find(v => v.id === activeVideo)?.title}
                 </h2>
                 <p className="text-lg text-white/30 font-medium font-serif italic">
                   {bilateralVideos.find(v => v.id === activeVideo)?.author}
                 </p>
              </div>
            </div>

            {/* Description / Insights Sidebar */}
            <div className={cn(
              "flex-1 space-y-8 animate-in slide-in-from-right-4 duration-700 delay-300 transition-opacity duration-1000",
              isVoidActive ? "opacity-20 hover:opacity-100" : "opacity-100"
            )}>
              {(() => {
                const videoData = bilateralVideos.find(v => v.id === activeVideo);
                if (videoData?.description) {
                  const desc = videoData.description;
                  return (
                    <div className="space-y-8 pb-12">
                      <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-4">
                        <p className="text-[14px] text-white/60 leading-relaxed font-sans">
                          {desc.intro}
                        </p>
                        <div className="pt-4 border-t border-white/5">
                           <p className="text-[12px] font-serif italic text-teal-400/80">
                             {desc.tip}
                           </p>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-6">
                    <div className="md:hidden">
                       <h2 className="text-2xl font-serif italic text-white/95 mb-2">
                         {videoData?.title}
                       </h2>
                       <p className="text-sm text-white/30 font-medium">
                         {videoData?.author} • {videoData?.category}
                       </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem]">
                       <div className="flex items-center gap-3 mb-6 text-teal-400/40">
                         <Info size={20} />
                         <span className="text-[10px] font-black uppercase tracking-widest">
                           {language === 'el' ? 'ΠΛΗΡΟΦΟΡΙΕΣ' : 'INFORMATION'}
                         </span>
                       </div>
                       <p className="text-white/50 text-[14px] leading-relaxed italic font-serif">
                         {language === 'el' 
                           ? 'Αυτό το βίντεο αποτελεί μέρος της συλλογής μας για την εξερεύνηση της συνείδησης και της νευροδιαφορετικότητας.' 
                           : 'This video is part of our collection exploring consciousness and neurodiversity.'}
                       </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
    </>
  );
}
