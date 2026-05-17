import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Save } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export const triggerReward = () => {
  window.dispatchEvent(new CustomEvent('trigger-reward'));
};

const easingCurve = [0.25, 1, 0.3, 1] as const;

export default function RewardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleTrigger = () => {
      setIsOpen(true);
      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('trigger-reward', handleTrigger);
    return () => window.removeEventListener('trigger-reward', handleTrigger);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: easingCurve }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-6"
        >
          {/* Backdrop blur effect */}
          <motion.div 
            initial={{ backdropFilter: 'blur(0px)', opacity: 0 }}
            animate={{ backdropFilter: 'blur(8px)', opacity: 1 }}
            exit={{ backdropFilter: 'blur(0px)', opacity: 0 }}
            transition={{ duration: 0.6, ease: easingCurve }}
            className="absolute inset-0 bg-stone-950/60" 
          />

          <motion.div
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative bg-white/5 border border-white/20 shadow-2xl rounded-3xl p-8 max-w-sm w-full backdrop-blur-md flex flex-col items-center overflow-hidden"
          >
            {/* Success shine effect */}
            <motion.div 
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '200%', opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/10 to-transparent skew-x-12"
            />

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mb-6 border border-teal-500/30 relative shadow-[0_0_30px_rgba(45,212,191,0.2)]"
            >
               {/* Flower Graphic */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-teal-300 drop-shadow-[0_0_10px_rgba(94,234,212,0.8)]" />
              </motion.div>
            </motion.div>

            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-serif text-teal-50 mb-2 tracking-tight text-center italic"
            >
              {language === 'el' ? 'Ο Σπόρος Γεμίζει Φως' : 'The Seed Gathers Light'}
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-stone-300 text-center text-sm font-sans max-w-[200px] leading-relaxed"
            >
              {language === 'el' 
                ? 'Κάθε στιγμή παρουσίας, ένα αόρατο πότισμα.' 
                : 'Every moment of presence, an invisible watering.'}
            </motion.p>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
