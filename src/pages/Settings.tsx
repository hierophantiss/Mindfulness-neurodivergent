import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Languages, Activity, Info, LogOut, Sparkles, Moon, Sun, Database, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';
import { cn } from '../lib/utils';

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { reduceMotion, toggleReduceMotion } = useAccessibility();
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if the prompt is available
    if ((window as any).initDeferredPrompt) {
      setCanInstall(true);
    }
    
    const handleInstallable = () => setCanInstall(true);
    const handleInstalled = () => setCanInstall(false);

    window.addEventListener('pwa-installable', handleInstallable as any);
    window.addEventListener('pwa-installed', handleInstalled as any);

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable as any);
      window.removeEventListener('pwa-installed', handleInstalled as any);
    };
  }, []);

  const handleInstall = () => {
    const promptEvent = (window as any).initDeferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
          setCanInstall(false);
        }
        (window as any).initDeferredPrompt = null;
      });
    } else {
      alert(language === 'el' ? "Η συσκευή σας δεν υποστηρίζει αυτήν τη λειτουργία ή η εφαρμογή είναι ήδη εγκατεστημένη." : "Your device does not support this feature, or the app is already installed.");
    }
  };

  const sections = [
    {
      title: { el: 'Γενικά', en: 'General' },
      items: [
        {
          id: 'language',
          icon: Languages,
          label: { el: 'Γλώσσα', en: 'Language' },
          value: language === 'el' ? 'Ελληνικά' : 'English',
          action: () => setLanguage(language === 'el' ? 'en' : 'el'),
          color: 'text-teal-400'
        },
        ...(canInstall ? [{
          id: 'install',
          icon: Download,
          label: { el: 'Εγκατάσταση (App)', en: 'Install App' },
          value: null,
          action: handleInstall,
          color: 'text-green-400'
        }] : [])
      ]
    },
    {
      title: { el: 'Προσβασιμότητα', en: 'Accessibility' },
      items: [
        {
          id: 'motion',
          icon: Activity,
          label: { el: 'Μειωμένη Κίνηση', en: 'Reduce Motion' },
          value: reduceMotion ? { el: 'Ενεργό', en: 'Enabled' } : { el: 'Ανενεργό', en: 'Disabled' },
          action: toggleReduceMotion,
          color: 'text-indigo-400'
        },
        {
          id: 'stars',
          icon: Moon,
          label: { el: 'Φόντο (Αστέρια)', en: 'Background Stars' },
          value: { el: 'Αυτόματο', en: 'Automatic' }, // Simulating for now
          action: () => {},
          color: 'text-purple-400'
        }
      ]
    },
    {
        title: { el: 'Δεδομένα', en: 'Data' },
        items: [
          {
            id: 'export-pdf',
            icon: FileText,
            label: { el: 'Εξαγωγή Βιβλίου (PDF)', en: 'Export Workbook (PDF)' },
            value: null,
            action: () => {
              window.open('#/workbook/print', '_blank');
            },
            color: 'text-blue-400'
          },
          {
            id: 'sync',
            icon: Database,
            label: { el: 'Συγχρονισμός Cloud', en: 'Cloud Sync' },
            value: { el: 'Σύντομα', en: 'Coming Soon' }, 
            action: () => {},
            color: 'text-amber-400'
          },
          {
            id: 'clear',
            icon: LogOut,
            label: { el: 'Διαγραφή Δεδομένων', en: 'Clear Data' },
            value: null,
            action: () => {
                if (confirm(language === 'el' ? 'Είστε σίγουροι; Όλες οι καταγραφές θα διαγραφούν.' : 'Are you sure? All records will be deleted.')) {
                    localStorage.clear();
                    window.location.href = '/';
                }
            },
            color: 'text-rose-400'
          }
        ]
      }
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#05070a] flex flex-col pt-20 pb-32">
       <div className="w-full max-w-xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-serif italic text-white/90">
                {language === 'el' ? 'Ρυθμίσεις' : 'Settings'}
            </h1>
            <div className="w-10" /> {/* Spacer */}
          </div>

          <div className="space-y-8">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-white/20 px-1">
                  {language === 'el' ? section.title.el : section.title.en}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/5", item.color)}>
                          <item.icon size={18} />
                        </div>
                        <span className="text-[14px] font-sans font-medium text-white/80 group-hover:text-white transition-colors">
                          {language === 'el' ? item.label.el : item.label.en}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                         {item.value && (
                           <span className="text-[11px] font-sans text-white/30 bg-white/5 px-2 py-1 rounded-lg">
                             {typeof item.value === 'string' ? item.value : (language === 'el' ? item.value.el : item.value.en)}
                           </span>
                         )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-16 flex flex-col items-center gap-4 opacity-30">
             <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center p-3">
                <Sparkles size={20} className="text-white" />
             </div>
             <div className="text-center">
                <p className="text-[10px] font-sans font-medium uppercase tracking-widest text-white mb-1">
                   Awareness Gateway
                </p>
                <p className="text-[9px] font-mono text-white/50">
                   v1.2.0 • 2026
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
