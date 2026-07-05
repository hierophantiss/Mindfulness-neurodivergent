import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Microscope } from 'lucide-react';
import { cn } from '../lib/utils';

interface Evidence {
  en: string;
  el: string;
  ref: string;
}

export function EvidenceLine({ evidence, language }: { evidence?: Evidence, language: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!evidence) return null;
  
  return (
    <div className="w-full max-w-sm mx-auto my-3 px-4 text-center z-20 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors bg-[#0f1117] px-3 py-1.5 rounded-full border border-white/5"
      >
        <Microscope size={12} />
        {language === 'el' ? 'Γιατι λειτουργει' : 'Why this works'}
      </button>
      {isOpen && (
        <div className="mt-2 text-sm text-white/70 italic bg-[#0f1117] border border-white/5 p-3 rounded-xl animate-in fade-in slide-in-from-top-2 text-left relative z-30 leading-relaxed shadow-lg">
          {language === 'el' ? evidence.el : evidence.en}
          <div className="mt-3 text-right">
             <Link 
               to={`/methodology#${evidence.ref}`} 
               className="text-teal-400/80 hover:text-teal-300 text-[10px] uppercase tracking-wider font-bold inline-block"
               onClick={(e) => e.stopPropagation()}
             >
               {language === 'el' ? 'Δειτε την ερευνα →' : 'View research →'}
             </Link>
          </div>
        </div>
      )}
    </div>
  );
}
