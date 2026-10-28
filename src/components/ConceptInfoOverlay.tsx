import { useFocusTrap } from '../hooks/useFocusTrap';
import { useAccessibility } from '../hooks/useAccessibility';
import React, { useState } from 'react';
import { Info, X, Lightbulb, Beaker } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { KNOWLEDGE_CONCEPTS } from '../data/concepts';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { CHAPTER_TITLES } from '../data/chapterTitles';

// Where in the book each idea is explained (chapter, and the page in the app's
// reader, 1-based). Without an entry: the first chapter the idea belongs to.
const READ_MORE: Record<string, { chapter: number; page?: number }> = {
  gravity: { chapter: 1, page: 3 },
  axis: { chapter: 1, page: 2 },
  grounding: { chapter: 1, page: 2 },
  slow_exhale: { chapter: 2, page: 4 },
  gentle_return: { chapter: 3 },
  labeling: { chapter: 3, page: 5 },
  peripheral_vision: { chapter: 4, page: 2 },
  open_awareness: { chapter: 4, page: 7 },
};

/**
 * Text where [[word|concept]] makes the word tappable: it opens the concept's
 * small window (used in the short practices, so nobody is asked to do
 * something the app has not explained).
 */
export function ConceptText({ text }: { text: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[\[([^|\]]+)\|([^\]]+)\]\]$/);
        return m ? <ConceptTerm key={i} word={m[1]} conceptId={m[2]} /> : <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

function ConceptTerm({ word, conceptId }: { word: string; conceptId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!KNOWLEDGE_CONCEPTS[conceptId]) return <>{word}</>;
  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(true); }}
        className="inline font-semibold text-ink underline decoration-dotted decoration-white/40 underline-offset-4 hover:decoration-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-sm"
      >
        {word}
      </button>
      <ConceptModal isOpen={isOpen} onClose={() => setIsOpen(false)} conceptId={conceptId} />
    </>
  );
}

export function ConceptInfoIcon({ conceptId, className = "w-6 h-6 ml-1" }: { conceptId: string, className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const el = language === 'el';
  const title = KNOWLEDGE_CONCEPTS[conceptId]?.[el ? 'el' : 'en']?.title;
  const label = title ? `${el ? 'Τι σημαίνει' : 'What it means'}: ${title}` : (el ? 'Περισσότερα' : 'More info');
  
  return (
    <>
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(true); }}
        className={`inline-flex items-center justify-center rounded-full text-ink/40 hover:text-ink hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400 ${className}`}
        aria-label={label}
      >
        <Info size={15} />
      </button>
      
      <ConceptModal isOpen={isOpen} onClose={() => setIsOpen(false)} conceptId={conceptId} />
    </>
  );
}

export function ConceptModal({ isOpen, onClose, conceptId }: { isOpen: boolean, onClose: () => void, conceptId: string }) {
    const { reduceMotion } = useAccessibility();
  const modalRef = useFocusTrap(isOpen, onClose);
  

  const { language } = useLanguage();
  const concept = KNOWLEDGE_CONCEPTS[conceptId];
  
  if (!concept) return null;
  const l = language === 'el' ? 'el' : 'en';
  const readMore = READ_MORE[conceptId] ?? (Array.isArray(concept.chapters) && concept.chapters.length ? { chapter: concept.chapters[0] } : null);

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
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`concept-title-${conceptId}`}
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="card-relief relative w-full max-w-md rounded-3xl z-10 max-h-[82vh] flex flex-col overflow-hidden"
          >
            {/* Sticky/Fixed Modal Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-black/20 shrink-0">
              <div className="flex items-center gap-2">
                <Lightbulb size={15} className="text-teal-400 animate-pulse" />
                <span className="text-[13px] font-medium text-teal-400 font-mono">
                  {language === 'el' ? 'Νευροεπιστήμη & πρακτική' : 'Neuroscience & practice'}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="text-ink/40 hover:text-ink hover:bg-white/5 p-1 rounded-full transition-all focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400"
                aria-label={language === 'el' ? 'Κλείσιμο' : 'Close'}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Scrollable Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <h3 id={`concept-title-${conceptId}`} className="text-xl text-ink mb-1 leading-tight font-medium">{concept[l].title}</h3>
              
              <p className="text-sm text-teal-200/80 font-medium pb-4 border-b border-white/5 leading-relaxed">
                {concept[l].short}
              </p>
              
              <div className="text-[15px] text-ink/80 leading-relaxed font-sans space-y-3">
                {concept[l].full.split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              
              {concept[l].ndNote && (
                <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.04]">
                  <p className="text-[13px] text-amber-100/90 leading-relaxed font-sans">
                    <span className="font-medium text-amber-500/80 block mb-1.5 text-[13px] font-mono">{language === 'el' ? 'Για τον νευροδιαφορετικό νου' : 'For the neurodivergent mind'}</span>
                    {concept[l].ndNote}
                  </p>
                </div>
              )}
              
              {readMore && (
                <Link
                  to={`/chapters/${readMore.chapter}${readMore.page && readMore.page > 1 ? `?p=${readMore.page}` : ''}`}
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-[14px] text-ink/85 hover:bg-white/[0.07] transition-colors"
                >
                  <span>
                    {l === 'el' ? 'Διάβασε περισσότερα: ' : 'Read more: '}
                    <span className="text-ink">{l === 'el' ? 'Κεφάλαιο' : 'Chapter'} {readMore.chapter} · {CHAPTER_TITLES[l][readMore.chapter]}</span>
                  </span>
                  <span aria-hidden="true" className="text-ink/40">→</span>
                </Link>
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
