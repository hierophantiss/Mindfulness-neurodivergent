import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, ChevronLeft, Volume2, Film, Headphones, Play, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';
import { useAudioMixer, AVAILABLE_TRACKS } from '../contexts/AudioContext';
import * as Icons from 'lucide-react';

export default function Sanctuary() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'audio' | 'video'>('audio');
  const [isDimmed, setIsDimmed] = useState(false);
  
  const { masterPlaying, masterVolume, tracks, toggleMaster, toggleTrack, setTrackVolume } = useAudioMixer();

  const activeCount = Object.values(tracks).filter(t => t.isPlaying).length;

  const t = {
    title: language === 'el' ? 'Το Καταφύγιο' : 'The Sanctuary',
    subtitle: language === 'el' ? 'ΧΩΡΟΣ ΑΝΑΠΑΥΣΗΣ' : 'SPACE OF REST',
    audioTab: language === 'el' ? 'ΗΧΗΤΙΚΑ ΤΟΠΙΑ' : 'SOUNDSCAPES',
    videoTab: language === 'el' ? 'ΒΙΝΤΕΟ' : 'VIDEO',
    mixerTitle: language === 'el' ? 'Ηχητική Μίξη' : 'Audio Mixer',
    mixerSubtitle: language === 'el' ? `${activeCount} ΕΝΕΡΓΑ` : `${activeCount} ACTIVE`,
    videosTitle: language === 'el' ? 'Σινεμά της Συνειδητότητας' : 'Cinema of Consciousness',
    videosSubtitle: language === 'el' ? 'Οπτικές αναζητήσεις' : 'Visual insights'
  };

  const getIcon = (name: string) => {
    const Icon = (Icons as any)[name] || Icons.Music;
    return <Icon size={24} strokeWidth={1.5} />;
  };

  return (
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
            <h1 className="text-[26px] font-serif italic text-white/90 leading-none">{t.title}</h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#4a9eca] mt-1.5">{t.subtitle}</p>
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
          <div className="flex p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl mb-8">
            <button
              onClick={() => setActiveTab('audio')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === 'audio' 
                  ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.05]" 
                  : "text-white/30 hover:text-white/60"
              )}
            >
              <Headphones size={16} />
              {t.audioTab}
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === 'video' 
                  ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.05]" 
                  : "text-white/30 hover:text-white/60"
              )}
            >
              <Film size={16} />
              {t.videoTab}
            </button>
          </div>
        )}

        {/* Master Play Button / Global Volume */}
        {activeTab === 'audio' && !isDimmed && (
          <div className="flex flex-col items-center justify-center py-6 relative mb-8">
            <div className="relative w-56 h-56 flex items-center justify-center mb-8">
              <motion.div 
                animate={{ 
                  scale: masterPlaying ? [1, 1.1, 1] : 1,
                  opacity: masterPlaying ? [0.4, 0.7, 0.4] : 0.2
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-teal-500/10 border border-teal-500/30"
              />
              <div className="absolute inset-0 rounded-full border border-teal-500/10" />
              
              <button 
                onClick={toggleMaster}
                className="relative z-10 w-20 h-20 flex items-center justify-center rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 hover:bg-teal-500/30 transition-colors"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                {masterPlaying ? (
                  <span className="flex gap-1.5">
                    <span className="w-2 h-6 bg-current rounded-full" />
                    <span className="w-2 h-6 bg-current rounded-full" />
                  </span>
                ) : (
                  <Play size={32} className="ml-1" fill="currentColor" />
                )}
              </button>
            </div>
            
            <div className="flex flex-col items-center gap-2 mb-8 text-center px-4">
              <h2 className="text-[22px] font-serif italic text-white/90">{t.mixerTitle}</h2>
              <p className="text-[11px] font-bold tracking-[0.15em] text-[#4a9eca] uppercase">{t.mixerSubtitle}</p>
            </div>
          </div>
        )}

        {/* Mixer Tracks */}
        {activeTab === 'audio' && !isDimmed && (
          <div className="flex flex-col gap-4 pb-24">
            {AVAILABLE_TRACKS.map(track => {
              const state = tracks[track.id] || { isPlaying: false, volume: 0.5 };
              return (
                <div key={track.id} className={cn(
                  "flex flex-col gap-4 p-4 rounded-[1.5rem] border transition-all duration-300",
                  state.isPlaying ? "bg-[#1a3832]/60 border-teal-500/30" : "bg-white/[0.03] border-white/[0.08]"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-2xl",
                        state.isPlaying ? "bg-teal-500/20 text-teal-400" : "bg-white/[0.05] text-white/40"
                      )}>
                        {getIcon(track.icon)}
                      </div>
                      <span className="text-[17px] font-serif italic text-white/90">
                        {language === 'el' ? track.labelEL : track.labelEN}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => toggleTrack(track.id)}
                      className={cn(
                        "w-14 h-8 rounded-full relative transition-colors",
                        state.isPlaying ? "bg-teal-500" : "bg-white/[0.1]"
                      )}
                    >
                      <motion.div 
                        animate={{ x: state.isPlaying ? 24 : 0 }}
                        className="w-6 h-6 ml-1 bg-white rounded-full shadow-md"
                      />
                    </button>
                  </div>
                  
                  {state.isPlaying && (
                    <div className="flex items-center gap-4 px-2 pt-2">
                      <Volume2 size={16} className="text-white/40 flex-shrink-0" />
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={state.volume}
                        onChange={(e) => setTrackVolume(track.id, parseFloat(e.target.value))}
                        className="flex-1 accent-teal-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
