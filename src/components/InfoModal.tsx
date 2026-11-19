import { useFocusTrap } from '../hooks/useFocusTrap';
import { useAccessibility } from '../hooks/useAccessibility';
import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Anchor, Wind, Focus, Maximize, Heart, Info, CheckCircle2, BookOpen, Sparkles, Mail, MessageCircleHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MICROSOFT_STORE_URL, CONTACT_EMAIL } from '../lib/links';
import { feedbackMailto } from '../lib/feedback';
import { versionText } from '../lib/version';
import { AXIS_COLOR } from '../data/axisColor';
import { ABOUT } from '../data/about';

// Where "Send me a message" goes. One place to change it later.
import { useLanguage } from '../hooks/useLanguage';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
    const { reduceMotion } = useAccessibility();
  const modalRef = useFocusTrap(isOpen, onClose);
  

  const { language } = useLanguage();

  const AXIS_ICON = { body: Anchor, breath: Wind, attention: Focus, space: Maximize } as const;
  const content = { ...ABOUT, axes: ABOUT.axes.map(a => ({ ...a, icon: AXIS_ICON[a.id] })) };

  const l = language === 'el' ? 'el' : 'en';

  // Rendered on <body>, so it sits above the bottom navigation.
  const modal = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 sm:p-4">
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a1a1a] border border-white/10 shape-cloud-2 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 md:p-8 pb-4 flex flex-col sm:flex-row items-start justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 w-fit mb-2">
                  <Info size={12} className="text-teal-400" />
                  <span className="text-[13px] font-medium text-teal-400/80">
                    {language === 'el' ? 'Πληροφορίες' : 'Information'}
                  </span>
                </div>
                <h2 id="info-modal-title" className="text-2xl md:text-3xl font-medium text-ink tracking-tight">
                  {content.title[l]}
                </h2>
                <p className="text-sm text-ink/70 leading-relaxed max-w-md">
                  {content.subtitle[l]}
                </p>
              </div>
              <button 
                onClick={onClose}
                aria-label={language === 'el' ? 'Κλείσιμο' : 'Close'}
                className="w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-ink/70 hover:text-ink hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400 absolute right-4 top-6 sm:static sm:right-auto sm:top-auto"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 custom-scrollbar space-y-8">
              
              {/* Welcome Description */}
              <div className="bg-gradient-to-r from-teal-500/10 to-[#4a9eca]/10 border border-teal-500/20 rounded-3xl p-5 md:p-6">
                <div className="flex items-center gap-2 text-teal-100 mb-2">
                  <Sparkles size={18} className="text-teal-400" />
                  <h3 className="text-sm font-medium tracking-wide">
                    {language === 'el' ? 'Καλώς ήρθες' : 'Welcome'}
                  </h3>
                </div>
                <p className="text-[14px] text-teal-50/90 leading-relaxed font-light">
                  {content.purpose[l]}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-teal-400/80 mb-3 flex items-center gap-2">
                   {content.features.title[l]}
                </h3>
                <ul className="space-y-2">
                  {content.features.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                       <CheckCircle2 size={16} className="text-teal-400/60 mt-0.5 shrink-0" />
                       <span className="text-sm text-ink/70 leading-relaxed font-sans">{item[l]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trauma Informed */}
              <div className="space-y-3 bg-indigo-500/5 p-5 md:p-6 rounded-[2rem] border border-indigo-500/10">
                <h3 className="text-sm font-medium text-indigo-400/80 mb-3 flex items-center gap-2">
                   <Heart size={16} className="text-indigo-400/60" />
                   {content.trauma.title[l]}
                </h3>
                <ul className="space-y-3">
                  {content.trauma.items.map((item, idx) => (
                    <li key={idx} className="flex flex-col gap-1">
                       <span className="text-sm text-ink/80 leading-relaxed font-sans flex items-start gap-2">
                         <span className="text-indigo-400 mt-1.5">•</span> {item[l]}
                       </span>
                    </li>
                  ))}
                </ul>
              </div>

               {/* Research Section */}
               <div className="space-y-4">
                <h3 className="text-sm font-medium text-amber-400/80 mb-3 flex items-center gap-2">
                   <BookOpen size={16} className="text-amber-400/60" />
                   {content.research.title[l]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {content.research.items.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                      <p className="text-[13px] text-ink/70 leading-relaxed font-sans">
                        {item[l]}
                      </p>
                    </div>
                  ))}
                </div>
                <Link to="/methodology" onClick={onClose} className="inline-block text-[12px] text-teal-400/80 hover:text-teal-300 transition-colors ml-1">
                  {content.research.more[l]}
                </Link>
              </div>


              {/* The 4 Axes grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-ink/65 mb-3">
                   {content.axesTitle[l]}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {content.axes.map((axis) => (
                    <div key={axis.id} className="flex gap-3 px-4 py-3 rounded-3xl bg-white/[0.02] border border-white/5 items-start">
                      <div className="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center border border-white/5 bg-white/[0.03]">
                        <axis.icon size={18} style={{ color: AXIS_COLOR[axis.id] }} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm text-ink font-medium">
                          {axis.title[l]}
                        </h4>
                        <p className="text-[13px] text-ink/70 leading-relaxed">{axis.desc[l]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Creator & Privacy Section */}
              <div className="pt-6 border-t border-white/5 mt-8 flex flex-col items-center gap-3 text-center">
                <div className="flex flex-col items-center max-w-lg mb-4">
                  <p className="text-[13px] font-medium text-teal-400 opacity-60">
                    {content.creatorLabel[l]}
                  </p>
                  <p className="text-lg font-medium text-ink mt-1">
                    {content.creatorName[l]}
                  </p>
                  <p className="text-[13px] text-ink/70 leading-relaxed mt-3 font-sans max-w-sm">
                    {content.creatorDesc[l]}
                  </p>
                  <p className="text-[13px] text-ink/65 leading-relaxed mt-2 font-sans max-w-sm">
                    {content.creatorQuote[l]}
                  </p>
                  <p className="text-[13px] text-ink/70 leading-relaxed mt-3 font-sans max-w-sm">
                    {content.madeWith[l]}
                  </p>
                </div>

                <div className="w-full max-w-sm flex flex-col items-center gap-3 border-t border-white/5 pt-5 pb-1">
                  <p className="text-[13px] font-medium text-teal-400 opacity-60">
                    {content.contact.title[l]}
                  </p>
                  <p className="text-[13px] text-ink/70 leading-relaxed">{content.contact.text[l]}</p>
                  <a
                    href={feedbackMailto(l)}
                    className="inline-flex items-center gap-2 px-5 min-h-[44px] rounded-full bg-white/[0.05] border border-sign-gold/40 text-[13px] text-ink/90 hover:bg-white/[0.09] transition-colors"
                  >
                    <MessageCircleHeart size={15} className="text-sign-gold" />
                    {l === 'el' ? 'Τι θα άλλαζες;' : 'What would you change?'}
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(content.contact.subject[l])}`}
                    className="btn-soft"
                  >
                    <Mail size={15} className="text-ink/70" />
                    {content.contact.button[l]}
                  </a>
                  <p className="text-[12px] text-ink/70 leading-relaxed">{content.contact.note[l]}</p>
                  <p className="text-[12px] text-ink/70 leading-relaxed">{content.contact.urgent[l]}</p>
                </div>
                
                <div className="flex flex-col items-center max-w-sm border-t border-white/5 pt-4">
                  <p className="text-[13px] font-medium opacity-40 mb-1">
                    {content.privacy.title[l]}
                  </p>
                  <p className="text-[12px] text-ink/70 leading-relaxed">
                    {content.privacy.text[l]}
                  </p>
                  <Link to="/privacy" onClick={onClose} className="mt-1.5 inline-flex items-center min-h-[36px] text-[12px] text-ink/70 underline underline-offset-4 hover:text-ink/85">
                    {l === 'el' ? 'Απόρρητο και όροι, όλο το κείμενο' : 'Privacy and terms, in full'}
                  </Link>
                  <span className="flex flex-wrap justify-center gap-x-4">
                    <Link to="/accessibility" onClick={onClose} className="inline-flex items-center min-h-[36px] text-[12px] text-ink/70 underline underline-offset-4 hover:text-ink/85">
                      {l === 'el' ? 'Προσβασιμότητα' : 'Accessibility'}
                    </Link>
                    <Link to="/install" onClick={onClose} className="inline-flex items-center min-h-[36px] text-[12px] text-ink/70 underline underline-offset-4 hover:text-ink/85">
                      {l === 'el' ? 'Πώς την εγκαθιστάς' : 'How to install it'}
                    </Link>
                    <a href={MICROSOFT_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[36px] text-[12px] text-ink/70 underline underline-offset-4 hover:text-ink/85">
                      Microsoft Store
                    </a>
                  </span>
                </div>

                <p className="text-[13px] font-medium opacity-30 mt-6">
                  {content.footer[l]}
                </p>
                <p className="text-[12px] text-ink/70 pb-2 tabular-nums">{versionText(l)}</p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
  return typeof document !== 'undefined' ? createPortal(modal, document.body) : null;
}
