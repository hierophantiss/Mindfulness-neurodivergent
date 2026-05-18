import React, { useState, useEffect } from 'react';
import { WifiOff, X, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

export default function OfflineNotification() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {(isOffline || showStatus) && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-sm"
        >
          <div className={`p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center gap-4 ${
            isOffline 
              ? 'bg-amber-900/20 border-amber-500/30 text-amber-200' 
              : 'bg-teal-900/20 border-teal-500/30 text-teal-200'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isOffline ? 'bg-amber-500/20' : 'bg-teal-500/20'
            }`}>
              {isOffline ? <WifiOff size={20} /> : <Wifi size={20} />}
            </div>
            
            <div className="flex-1">
              <h4 className="text-sm font-bold uppercase tracking-wider">
                {isOffline 
                  ? (language === 'el' ? 'Εκτος συνδεσης' : 'Offline Mode')
                  : (language === 'el' ? 'Συνδεθηκε' : 'Back Online')
                }
              </h4>
              <p className="text-xs opacity-70">
                {isOffline 
                  ? (language === 'el' ? 'Η εφαρμογή λειτουργεί κανονικά και εκτός σύνδεσης.' : 'App is working normally in offline mode.')
                  : (language === 'el' ? 'Η σύνδεση αποκαταστάθηκε.' : 'Connection restored successfully.')
                }
              </p>
            </div>

            <button 
              onClick={() => setShowStatus(false)}
              className="p-1 hover:bg-white/5 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
