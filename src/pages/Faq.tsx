import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { KNOWLEDGE_FAQ } from '../data/faq';
import { useLanguage } from '../hooks/useLanguage';

export default function Faq() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="flex flex-col flex-1 bg-transparent -mx-4 -mt-4 -mb-8 px-4 pt-4 pb-12 md:-mx-8 md:-mt-8 md:-mb-8 md:px-8 md:pt-8 md:pb-12 overflow-y-auto w-full">
      
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => {
            if (window.history.length > 2) navigate(-1);
            else navigate('/');
          }} 
          className="w-10 h-10 rounded-full bg-zinc-900/50 border border-zinc-700/50 flex flex-none items-center justify-center text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-heading font-medium text-white tracking-wide">
          {language === 'el' ? 'Συχνές Ερωτήσεις' : 'FAQs'}
        </h1>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto w-full">
        {Object.keys(KNOWLEDGE_FAQ).map(chapter => {
          const faqs = KNOWLEDGE_FAQ[parseInt(chapter)][language === 'en' ? 'en' : 'el'];
          if (!faqs || faqs.length === 0) return null;
          
          return (
            <div key={chapter} className="mb-10 w-full">
              <h3 className="font-bold text-xs text-teal-400 uppercase tracking-[0.2em] mb-5 px-2 flex items-center gap-3">
                <span className="w-6 h-px bg-teal-800/50"></span>
                {language === 'el' ? `Κεφάλαιο ${chapter}` : `Chapter ${chapter}`}
                <span className="flex-1 h-px bg-zinc-800/50"></span>
              </h3>
              <div className="space-y-4 w-full">
                {faqs.map((faq: any, idx: number) => (
                  <details key={idx} className="bg-gradient-to-br from-pine-900/40 to-pine-950/60 border border-zinc-700/30 rounded-2xl p-5 md:p-6 group shadow-sm transition-all duration-300 hover:border-zinc-600/50 backdrop-blur-sm w-full outline-none [&_summary::-webkit-details-marker]:hidden">
                    <summary className="font-heading font-medium cursor-pointer focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400 list-none flex justify-between items-center text-base md:text-lg text-zinc-100 group-open:text-teal-100 transition-colors w-full">
                      <span className="pr-6 leading-snug">{faq.q}</span>
                      <span className="text-teal-500/80 group-open:rotate-180 transition-transform duration-500 shrink-0 w-8 h-8 rounded-full bg-zinc-950/50 flex items-center justify-center border border-white/5">↓</span>
                    </summary>
                    <div className="mt-5 pt-5 border-t border-zinc-800/60 text-[15px] md:text-base leading-relaxed text-zinc-200/90 whitespace-pre-wrap">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
