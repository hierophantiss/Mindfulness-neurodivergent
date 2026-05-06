import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wind, Zap, ArrowLeft, Move } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function Practice() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate('/')} 
        className="w-10 h-10 rounded-full bg-pine-800 border border-pine-700 flex items-center justify-center text-pine-300 hover:bg-pine-700 hover:text-white transition-colors mb-2"
      >
        <ArrowLeft size={20} />
      </button>

      <section>
        <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">
          {language === 'el' ? 'Εξάσκηση' : 'Practice'}
        </h2>
        <p className="text-pine-200">
          {language === 'el' ? 'Επίλεξε την κατηγορία εξάσκησης που χρειάζεσαι.' : 'Choose the practice category you need.'}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-safe mb-4">
        {/* Movement & Breath Hub Card */}
        <Link
          to="/practice/movement"
          className="group relative block border p-6 md:p-8 rounded-[2rem] transition-all duration-500 cursor-pointer overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:scale-[0.98] hover:shadow-[0_12px_40px_rgba(79,70,229,0.15)] hover:-translate-y-1 backdrop-blur-md bg-gradient-to-br from-indigo-950/60 to-indigo-900/80 border-indigo-700/40 hover:border-indigo-500/50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]"></div>
          
          <div className="flex flex-col items-center text-center gap-5 relative z-10 w-full h-full justify-center min-h-[160px] md:min-h-[200px]">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-inner transition-transform duration-500 group-hover:scale-110 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <Move className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-heading font-medium mb-3 drop-shadow-sm leading-tight text-white group-hover:text-indigo-50 transition-colors">
                {language === 'en' ? 'Breath & Movement' : 'Αναπνοή & Κίνηση'}
              </h3>
              <p className="text-base text-indigo-200/90 leading-relaxed font-medium">
                {language === 'en' ? 'Full exercises with video guidance and binaural audio.' : 'Ολοκληρωμένες ασκήσεις με καθοδήγηση βίντεο και binaural ήχο.'}
              </p>
            </div>
          </div>
        </Link>

        {/* Microdoses Hub Card */}
        <Link
          to="/practice/microdoses"
          className="group relative block border p-6 md:p-8 rounded-[2rem] transition-all duration-500 cursor-pointer overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:scale-[0.98] hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)] hover:-translate-y-1 backdrop-blur-md bg-gradient-to-br from-emerald-950/60 to-emerald-900/80 border-emerald-700/40 hover:border-emerald-500/50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]"></div>
          
          <div className="flex flex-col items-center text-center gap-5 relative z-10 w-full h-full justify-center min-h-[160px] md:min-h-[200px]">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-inner transition-transform duration-500 group-hover:scale-110 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <Zap className="w-8 h-8 md:w-10 md:h-10 fill-emerald-300" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-heading font-medium mb-3 drop-shadow-sm leading-tight text-white group-hover:text-emerald-50 transition-colors">
                {language === 'en' ? 'Microdoses' : 'Μικρές Δόσεις'}
              </h3>
              <p className="text-base text-emerald-200/90 leading-relaxed font-medium">
                {language === 'en' ? 'Quick, text-based guides for immediate grounding anywhere.' : 'Γρήγοροι, γραπτοί οδηγοί για άμεση γείωση οπουδήποτε.'}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
