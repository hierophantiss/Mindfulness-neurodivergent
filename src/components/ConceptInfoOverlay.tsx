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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-sm bg-[#0a1518] rounded-3xl border border-white/10 overflow-hidden shadow-2xl z-10"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb size={16} className="text-teal-400" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-teal-400/80">
                    {language === 'el' ? 'ΝΕΥΡΟΕΠΙΣΤΗΜΗ & ΠΡΑΚΤΙΚΗ' : 'NEUROSCIENCE & PRACTICE'}
                  </span>
                </div>
                <button 
                  onClick={onClose}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <h3 className="text-xl font-serif text-white mb-2 leading-tight">{concept[l].title}</h3>
              <p className="text-sm text-teal-100/80 font-medium mb-4 pb-4 border-b border-white/10">
                {concept[l].short}
              </p>
              
              <p className="text-[15px] text-white/80 leading-relaxed mb-5">
                {concept[l].full}
              </p>
              
              {concept[l].ndNote && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-4">
                  <p className="text-[13px] text-amber-100/90 leading-relaxed">
                    <span className="font-bold text-amber-500/80 block mb-1 uppercase tracking-wider text-[10px]">ND Note</span>
                    {concept[l].ndNote}
                  </p>
                </div>
              )}
              
              {concept[l].science && (
                <div className="flex gap-2 items-start opacity-60">
                  <Beaker size={12} className="mt-0.5 shrink-0" />
                  <p className="text-[11px] leading-tight font-mono">{concept[l].science}</p>
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
