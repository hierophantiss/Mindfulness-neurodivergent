import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();

  const handleNav = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  // Do not show top left button on certain screens if they have their own headers, 
  // but generally a fixed top-left is what the user asked for.
  // We'll give it a high z-index and fixed position.

  const menuItems = [
    { path: '/', icon: '🏠', labelEn: 'Home', labelEl: 'Αρχικη' },
    { path: '/chapters', icon: '📖', labelEn: 'Read', labelEl: 'Διαβασμα' },
    { path: '/practice', icon: '🎯', labelEn: 'Practice', labelEl: 'Πρακτικη' },
    { path: '/program', icon: '🗺️', labelEn: 'Program', labelEl: 'Πλανο' },
    { path: '/journal', icon: '✍️', labelEn: 'Journal', labelEl: 'Ημερολογιο' },
    { path: '/faq', icon: '❓', labelEn: 'FAQ', labelEl: 'Συχνές Ερωτήσεις' },
    { path: '/intro', icon: '∞', labelEn: 'Guide', labelEl: 'Οδηγος' },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 w-12 h-12 bg-pine-900/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-pine-100 hover:bg-pine-800/80 hover:border-teal-500/30 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        aria-label="Menu"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-pine-950/60 backdrop-blur-md z-[9998]"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-gradient-to-b from-pine-950/95 to-[#061114] backdrop-blur-xl border-r border-pine-800/50 z-[9999] shadow-[20px_0_40px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="p-4 flex justify-between items-center border-b border-pine-800/60">
                <span className="font-bold text-pine-100 tracking-wider text-sm uppercase">Menu</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-pine-300 hover:bg-pine-800 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-3">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                        isActive 
                          ? 'bg-teal-900/40 border border-teal-500/30 text-teal-100' 
                          : 'hover:bg-pine-800/50 text-pine-200 border border-transparent'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-medium tracking-wide">
                        {language === 'en' ? item.labelEn : item.labelEl}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
