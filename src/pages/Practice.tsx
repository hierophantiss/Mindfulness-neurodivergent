import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wind, Zap, ArrowLeft, Move, Compass } from 'lucide-react';
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
        {/* Grounding Card */}
        <Link
          to="/practice/grounding"
          className="group relative block p-8 md:p-10 shape-cloud-1 glass-card transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-emerald-500/20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-1000" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-20 h-20 shrink-0 shape-cloud-2 bg-emerald-400/10 flex items-center justify-center text-emerald-400 border border-emerald-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Compass size={36} strokeWidth={1.5} />
            </div>
            <div className="space-y-3 text-center md:text-left flex-1">
              <h3 className="text-3xl md:text-4xl font-serif text-white/90 italic">
                {language === 'en' ? 'Grounding Practice' : 'Πρακτική Γείωσης'}
              </h3>
              <p className="text-white/50 font-sans max-w-xl text-[15px] md:text-[17px] leading-relaxed">
                {language === 'en' 
                 ? 'A focused practice incorporating gravity, breath, space, and attention.' 
                 : 'Μια στοχευμένη πρακτική που συνδυάζει βαρύτητα, αναπνοή, χώρο και προσοχή.'}
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
