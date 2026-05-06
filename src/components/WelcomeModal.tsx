import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const { t, language } = useLanguage();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-950/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div 
        className={`bg-pine-900 border border-pine-700/50 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden transform transition-all duration-500 delay-100 ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 to-pine-500" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-pine-400 hover:text-white bg-pine-800/50 hover:bg-pine-700/50 p-1.5 rounded-full transition-colors"
          aria-label={t('welcome.closeBtn')}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-pine-100 mb-4 pr-8 uppercase tracking-wide">
          {t('welcome.title')}
        </h2>

        <div className="space-y-4 text-sm text-pine-300 leading-relaxed text-justify mb-5">
          <p className="font-medium text-teal-100 opacity-90 drop-shadow-sm">
            {t('welcome.p1')}
          </p>
          <p>
            {t('welcome.p3')}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8 bg-pine-950/40 py-2.5 rounded-xl border border-pine-800/60">
          <p className="text-[10px] text-pine-400/90 font-medium text-center uppercase tracking-[0.15em]">
            {language === 'el' ? 'ΔΩΡΕΑΝ • ΧΩΡΙΣ ΛΟΓΑΡΙΑΣΜΟ • ΜΟΝΟ ΣΤΗ ΣΥΣΚΕΥΗ' : 'FREE • NO ACCOUNT • DEVICE ONLY'}
          </p>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-teal-600/90 hover:bg-teal-500 text-white font-semibold py-3.5 rounded-2xl transition-all shadow-md active:scale-[0.98]"
        >
          {t('welcome.startBtn')}
        </button>
      </div>
    </div>
  );
}
