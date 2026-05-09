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
        <h2 className="text-4xl font-medium text-white tracking-tight mb-3">
          {language === 'el' ? 'Εξάσκηση' : 'Practice'}
        </h2>
        <p className="text-lg text-pine-300 font-normal mb-8">
          {language === 'el' ? 'Επίλεξε την κατηγορία εξάσκησης που χρειάζεσαι.' : 'Choose the practice category you need.'}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-safe mb-4">
        {/* Movement & Breath Hub Card */}
        <Link
          to="/practice/movement"
          className="group relative block p-6 md:p-8 rounded-[2rem] transition-all duration-500 cursor-pointer overflow-hidden shadow-xl active:scale-[0.98] hover:-translate-y-1 backdrop-blur-md bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-indigo-400/30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]"></div>
          
          <div className="flex flex-col items-center text-center gap-5 relative z-10 w-full h-full justify-center min-h-[160px] md:min-h-[200px]">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-inner transition-transform duration-500 group-hover:scale-110 bg-indigo-500/10 text-indigo-300 border border-indigo-400/20 backdrop-blur-sm">
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
          className="group relative block p-6 md:p-8 rounded-[2rem] transition-all duration-500 cursor-pointer overflow-hidden shadow-xl active:scale-[0.98] hover:-translate-y-1 backdrop-blur-md bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-emerald-400/30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]"></div>
          
          <div className="flex flex-col items-center text-center gap-5 relative z-10 w-full h-full justify-center min-h-[160px] md:min-h-[200px]">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-inner transition-transform duration-500 group-hover:scale-110 bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 backdrop-blur-sm">
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
