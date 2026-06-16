import React, { useState } from 'react';
import { Info, X, Lightbulb, Beaker } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { KNOWLEDGE_CONCEPTS } from '../data/concepts';
import { createPortal } from 'react-dom';

export function ConceptInfoIcon({ conceptId, className = "w-6 h-6 ml-1" }: { conceptId: string, className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(true); }}
        className={`inline-flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all ${className}`}
        aria-label="More info"
      >
        <Info size={15} />
      </button>
      
      <ConceptModal isOpen={isOpen} onClose={() => setIsOpen(false)} conceptId={conceptId} />
    </>
  );
}

export function ConceptModal({ isOpen, onClose, conceptId }: { isOpen: boolean, onClose: () => void, conceptId: string }) {
  const { language } = useLanguage();
  const concept = KNOWLEDGE_CONCEPTS[conceptId];
  
  if (!concept) return null;
  const l = language === 'el' ? 'el' : 'en';

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative w-full max-w-md bg-[#0a151b] rounded-3xl border border-white/10 shadow-2xl z-10 max-h-[82vh] flex flex-col overflow-hidden"
          >
            {/* Sticky/Fixed Modal Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-black/20 shrink-0">
              <div className="flex items-center gap-2">
                <Lightbulb size={15} className="text-teal-400 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-teal-400 font-mono">
                  {language === 'el' ? 'ΝΕΥΡΟΕΠΙΣΤΗΜΗ & ΠΡΑΚΤΙΚΗ' : 'NEUROSCIENCE & PRACTICE'}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="text-white/40 hover:text-white hover:bg-white/5 p-1 rounded-full transition-all focus:outline-none"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Scrollable Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <h3 className="text-xl font-serif text-white mb-1 leading-tight font-medium">{concept[l].title}</h3>
              
              <p className="text-sm text-teal-200/80 font-medium pb-4 border-b border-white/5 leading-relaxed">
                {concept[l].short}
              </p>
              
              <div className="text-[15px] text-white/80 leading-relaxed font-sans space-y-3">
                {concept[l].full.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              
              {concept[l].ndNote && (
                <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.04]">
                  <p className="text-[13px] text-amber-100/90 leading-relaxed font-sans">
                    <span className="font-bold text-amber-500/80 block mb-1.5 uppercase tracking-wider text-[10px] font-mono">ND Note</span>
                    {concept[l].ndNote}
                  </p>
                </div>
              )}
              
              {concept[l].science && (
                <div className="flex gap-2 items-start opacity-75 bg-black/10 p-3 rounded-xl border border-white/5">
                  <Beaker size={13} className="mt-0.5 shrink-0 text-indigo-400" />
                  <p className="text-[11px] leading-relaxed font-mono text-indigo-200/90">{concept[l].science}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
