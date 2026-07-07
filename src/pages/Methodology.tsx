import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Brain, Waves, Sparkles, Heart, Activity, CheckCircle, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { METHODOLOGY_DATA as T } from "../data/methodology";


export default function Methodology() {
  const { language } = useLanguage();
  const t = T[language as keyof typeof T];

  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.substring(1);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#0f1117] font-sans pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-6 py-5 bg-white/[0.04] border-b border-white/[0.05] sticky top-0 z-10 backdrop-blur-md">
        <button 
          onClick={() => {
            if (window.history.length > 2) navigate(-1);
            else navigate('/settings');
          }}
          className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center text-[#d4d4d8] hover:bg-white/[0.08] hover:text-white transition-colors active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold text-teal-400 uppercase tracking-widest drop-shadow-sm truncate px-4">
          {t.title}
        </h1>
        <div className="w-10" />
      </header>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
        
        {/* Title Block */}
        <div className="text-center space-y-3 py-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold tracking-wider uppercase mb-2">
            <ShieldCheck size={14} />
            <span>{t.eeatBadge}</span>
          </div>
          <h2 className="text-2xl font-serif italic text-white/95 leading-snug">
            {t.subtitle}
          </h2>
          <p className="text-[#d4d4d8]/70 text-sm leading-relaxed max-w-xl mx-auto">
            {t.intro}
          </p>
        </div>

        {/* Philosophy */}
        <section className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-3 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500" />
          <h3 className="text-md font-bold text-white tracking-wide">
            {t.philosophyTitle}
          </h3>
          <p className="text-sm text-[#d4d4d8]/85 leading-relaxed text-justify">
            {t.philosophyText}
          </p>
        </section>

        {/* Core Pillars List */}
        <section className="space-y-4">
          {t.pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={index}
                id={pillar.id}
                className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 hover:bg-white/[0.05] transition-all space-y-3 scroll-mt-24"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    <Icon size={20} />
                  </div>
                  <h4 className="text-[15px] font-bold text-white leading-tight">
                    {pillar.title}
                  </h4>
                </div>
                <p className="text-xs text-[#d4d4d8]/80 leading-relaxed text-left">
                  {pillar.desc}
                </p>
                <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-teal-300/80 tracking-wide">
                  📚 DOI/Ref: {pillar.citation}
                </div>
              </div>
            );
          })}
        </section>

        {/* Quote Block */}
        <section className="text-center py-6 px-4 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.01]">
          <p className="text-sm font-serif italic text-teal-200/90 max-w-lg mx-auto leading-relaxed">
            {t.quote}
          </p>
          <div className="mt-8 flex justify-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>© Awareness Gateway Science Board</span>
            <span>•</span>
            <span>Est. 2026</span>
          </div>
        </section>

      </div>
    </div>
  );
}
