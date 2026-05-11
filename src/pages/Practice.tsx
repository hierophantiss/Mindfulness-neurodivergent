import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wind, Zap, ArrowLeft, Move, Beaker } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function Practice() {
  const navigate = useNavigate();
  const { language } = useLanguage();

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

      <header className="space-y-4 max-w-2xl">
        <h2 className="text-5xl md:text-6xl font-heading text-white italic leading-tight">
          {language === 'el' ? 'Εξάσκηση' : 'Practice'}
        </h2>
        <p className="text-lg text-pine-300 font-light leading-relaxed">
          {language === 'el' 
            ? 'Επίλεξε την κατηγορία εξάσκησης που ταιριάζει στην κατάστασή σου.' 
            : 'Choose the practice category that fits your current state.'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
        {/* Interactive Labs Card */}
        <Link
          to="/practice/labs"
          className="group relative block p-10 rounded-[2.5rem] glass-card transition-all duration-700 hover:border-indigo-400/40 md:col-span-2 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-125 transition-transform duration-1000">
            <Beaker size={160} strokeWidth={0.5} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-indigo-400/10 flex items-center justify-center text-indigo-300 border border-indigo-400/20 group-hover:scale-110 transition-transform duration-500">
              <Beaker size={40} />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-heading text-white italic">
                {language === 'en' ? 'Interactive Labs' : 'Διαδραστικά Εργαστήρια'}
              </h3>
              <p className="text-pine-300 font-light max-w-xl">
                {language === 'en' ? 'Explore your mind through code. Use the HTML tools you’ve uploaded.' : 'Εξερεύνησε το νου μέσα από τον κώδικα. Χρησιμοποίησε τα HTML εργαλεία που ανέβασες.'}
              </p>
            </div>
          </div>
        </Link>

        {/* Movement Card */}
        <Link
          to="/practice/movement"
          className="group relative block p-10 rounded-[2.5rem] glass-card transition-all duration-700 hover:border-teal-400/40"
        >
          <div className="flex flex-col gap-8 relative z-10 h-full justify-between">
            <div className="w-16 h-16 rounded-2xl bg-teal-400/10 flex items-center justify-center text-teal-400 border border-teal-400/20 group-hover:scale-110 transition-transform duration-500">
              <Move size={32} />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-heading text-white italic">
                {language === 'en' ? 'Breath & Movement' : 'Αναπνοή & Κίνηση'}
              </h3>
              <p className="text-pine-300 font-light text-sm leading-relaxed">
                {language === 'en' ? 'Full exercises with video guidance and binaural audio.' : 'Ολοκληρωμένες ασκήσεις με καθοδήγηση βίντεο και binaural ήχο.'}
              </p>
            </div>
          </div>
        </Link>

        {/* Microdoses Card */}
        <Link
          to="/practice/microdoses"
          className="group relative block p-10 rounded-[2.5rem] glass-card transition-all duration-700 hover:border-amber-400/40"
        >
          <div className="flex flex-col gap-8 relative z-10 h-full justify-between">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/20 group-hover:scale-110 transition-transform duration-500">
              <Zap size={32} />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-heading text-white italic">
                {language === 'en' ? 'Invisible Microdoses' : 'Αόρατες Μικροδόσεις'}
              </h3>
              <p className="text-pine-300 font-light text-sm leading-relaxed">
                {language === 'en' ? 'Stealth practices you can do anywhere without being noticed.' : 'Αόρατες πρακτικές που γίνονται παντού χωρίς να σε καταλάβει κανείς.'}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
