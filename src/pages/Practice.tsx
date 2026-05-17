import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wind, Zap, ArrowLeft, Move } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useProgress } from '../contexts/ProgressContext';
import { Check } from 'lucide-react';

export default function Practice() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { progress } = useProgress();

  const completedBreathsCount = progress.completedBreaths.length;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn-zen !px-3 !py-3"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
          {language === 'el' ? 'Κεντρο Εξασκησης' : 'Practice Hub'}
        </span>
      </div>

      <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
        <h2 className="text-5xl md:text-6xl font-serif text-white/90 italic leading-tight">
          {language === 'el' ? 'Εξάσκηση' : 'Practice'}
        </h2>
        <p className="text-lg text-white/50 font-sans leading-relaxed">
          {language === 'el' 
            ? 'Επίλεξε την κατηγορία εξάσκησης που ταιριάζει στην κατάστασή σου.' 
            : 'Choose the practice category that fits your current state.'}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 pb-12 max-w-4xl mx-auto w-full">
        {/* Breath Card */}
        <Link
          to="/practice/movement#breath"
          className="group relative block p-8 md:p-10 shape-cloud-1 bg-teal-950/40 backdrop-blur-md border border-teal-900/40 transition-all duration-300 active:scale-[0.98] hover:border-teal-400/40 hover:bg-teal-950 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-1000" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-20 h-20 shrink-0 shape-cloud-2 bg-teal-400/10 flex items-center justify-center text-teal-400 border border-teal-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Wind size={36} strokeWidth={1.5} />
            </div>
            <div className="space-y-4 text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <h3 className="text-3xl md:text-4xl font-serif text-white/90 italic drop-shadow-md">
                  {language === 'en' ? 'Breath & Sleep' : 'Αναπνοή & Ύπνος'}
                </h3>
                {completedBreathsCount > 0 && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-teal-500/20 border border-teal-500/30 text-teal-400 text-[10px] font-bold uppercase tracking-wider">
                    <Check size={12} strokeWidth={3} />
                    {completedBreathsCount}
                  </div>
                )}
              </div>
              <p className="text-teal-100/60 font-sans max-w-2xl text-[15px] md:text-[17px] leading-relaxed">
                {language === 'en' 
                 ? 'Deep breathing rhythms, sleep induction, and nervous system regulation.' 
                 : 'Ρυθμοί αναπνοής, χαλάρωση νευρικού συστήματος και προετοιμασία για ύπνο.'}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                <span className="px-3 py-1.5 rounded-full bg-teal-950/50 border border-teal-800/50 text-[10px] text-teal-300 uppercase tracking-wider font-bold">432Hz / 528Hz</span>
                <span className="px-3 py-1.5 rounded-full bg-teal-950/50 border border-teal-800/50 text-[10px] text-teal-300 uppercase tracking-wider font-bold">Cat Purr</span>
                <span className="px-3 py-1.5 rounded-full bg-teal-950/50 border border-teal-800/50 text-[10px] text-teal-300 uppercase tracking-wider font-bold">Ocean & Rain</span>
                <span className="px-3 py-1.5 rounded-full bg-teal-950/50 border border-teal-800/50 text-[10px] text-teal-300 uppercase tracking-wider font-bold">Binaural</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Movement Card */}
        <Link
          to="/practice/movement#movement"
 className="group relative block p-8 md:p-10 shape-cloud-3 glass-card transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-indigo-500/20"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -ml-32 -mt-32 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-1000" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-20 h-20 shrink-0 shape-cloud-4 bg-indigo-400/10 flex items-center justify-center text-indigo-400 border border-indigo-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Move size={36} strokeWidth={1.5} />
            </div>
            <div className="space-y-3 text-center md:text-left flex-1">
              <h3 className="text-3xl md:text-4xl font-serif text-white/90 italic">
                {language === 'en' ? 'Mindful Movement' : 'Ενσυνείδητη Κίνηση'}
              </h3>
              <p className="text-white/50 font-sans max-w-xl text-[15px] md:text-[17px] leading-relaxed">
                {language === 'en' 
                 ? 'Gentle somatic practices connecting breath and physical movement.' 
                 : 'Ήπιες σωματικές πρακτικές που συνδέουν την αναπνοή με τη φυσική κίνηση του σώματος.'}
              </p>
            </div>
          </div>
        </Link>

        {/* Microdoses Card */}
        <Link
          to="/practice/microdoses"
 className="group relative block p-8 md:p-10 shape-cloud-2 glass-card transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-amber-500/20"
        >
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -mr-32 -mb-32 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-1000" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-20 h-20 shrink-0 shape-cloud-5 bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Zap size={36} strokeWidth={1.5} />
            </div>
            <div className="space-y-3 text-center md:text-left flex-1">
              <h3 className="text-3xl md:text-4xl font-serif text-white/90 italic">
                {language === 'en' ? 'Invisible Microdoses' : 'Αόρατες Μικροδόσεις'}
              </h3>
              <p className="text-white/50 font-sans max-w-xl text-[15px] md:text-[17px] leading-relaxed">
                {language === 'en' 
                 ? 'Stealth practices you can do anywhere without being noticed.' 
                 : 'Αόρατες πρακτικές που γίνονται παντού χωρίς να σε καταλάβει κανείς.'}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
