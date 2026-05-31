import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Languages, Activity, Info, LogOut, Sparkles, Moon, Sun, Database, FileText, Download, Bug, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';
import { useCompanion } from '../hooks/useCompanion';
import { cn } from '../lib/utils';
import { RainbowInfinity } from '../components/RainbowInfinity';

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { reduceMotion, toggleReduceMotion } = useAccessibility();
  const { companionData } = useCompanion();
  const [canInstall, setCanInstall] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const addLog = (msg: string) => {
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    addLog(`Check initDeferredPrompt: ${!!(window as any).initDeferredPrompt}`);
    addLog(`In standalone mode: ${isStandalone}`);
    addLog(`Is in iframe: ${window.self !== window.top}`);
    addLog(`User agent: ${navigator.userAgent}`);

    // Check for webviews (Facebook, IG, etc.)
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isFacebookApp = /FBAN|FBAV/i.test(ua);
    const isInstagramApp = /Instagram/i.test(ua);
    const isLineApp = /Line/i.test(ua);
    const isWebView = /; wv\)/i.test(ua) || isFacebookApp || isInstagramApp || isLineApp;
    addLog(`Is WebView/In-App Browser: ${isWebView}`);

    // Check manifest link
    const manifestLink = document.querySelector('link[rel="manifest"]');
    addLog(`Manifest link: ${manifestLink ? (manifestLink as HTMLLinkElement).href : 'Not found'}`);
    
    // Check SW fetch handler
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        addLog(`SW Ready. Active: ${!!reg.active}`);
        
        // Also check if getting related apps is supported
        if ('getInstalledRelatedApps' in navigator) {
          try {
            (navigator as any).getInstalledRelatedApps().then((relatedApps: any) => {
               addLog(`Related apps installed: ${relatedApps.length}`);
            }).catch((e: any) => {
               addLog(`Related apps error: ${e.message}`);
            });
          } catch(e: any) {
             addLog(`Related apps error: ${e.message}`);
          }
        }
      }).catch(err => {
        addLog(`SW Ready Error: ${err}`);
      });
    }
    
    if ((window as any).initDeferredPrompt) {
      setCanInstall(true);
    }
    
    const handleInstallable = () => {
      addLog('pwa-installable event fired');
      setCanInstall(true);
    };
    const handleInstalled = () => {
      addLog('pwa-installed event fired');
      setCanInstall(false);
    };

    window.addEventListener('pwa-installable', handleInstallable as any);
    window.addEventListener('pwa-installed', handleInstalled as any);

    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        addLog(`SW Registrations: ${regs.length}`);
      });
    } else {
      addLog('Service worker not supported');
    }

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable as any);
      window.removeEventListener('pwa-installed', handleInstalled as any);
    };
  }, []);

  const handleInstall = async () => {
    addLog('Install clicked');
    const promptEvent = (window as any).initDeferredPrompt;
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        addLog(`User choice: ${choiceResult.outcome}`);
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
          setCanInstall(false);
          (window as any).initDeferredPrompt = null;
        } else {
          console.log('User dismissed the A2HS prompt');
        }
      } catch (err: any) {
        addLog(`Prompt error: ${err.message}`);
        console.error('PWA Prompt Error:', err);
        alert(language === 'el' 
            ? "Υπήρξε πρόβλημα με την προτροπή εγκατάστασης." 
            : "There was a problem with the install prompt.");
      }
    } else {
      addLog('No prompt event available during click');
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);
      const isIframe = window.self !== window.top;
      
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isWebView = /; wv\)/i.test(ua) || /FBAN|FBAV|Instagram|Line/i.test(ua);
      
      let msg = language === 'el' ? "Η εγκατάσταση δεν υποστηρίζεται αυτή τη στιγμή." : "Installation not currently supported.";
      
      if (isIframe) {
        msg = language === 'el' 
         ? "Βρίσκεστε σε περιβάλλον iframe (πρόσβαση από άλλη σελίδα). Ανοίξτε την εφαρμογή σε νέα καρτέλα για εγκατάσταση!" 
         : "You are inside an iframe. Please open the app in a new tab to install!";
      } else if (isWebView) {
        msg = language === 'el'
         ? "Ανοίξατε την εφαρμογή μέσα από κάποιο άλλο App (πχ. Facebook/Instagram). Παρακαλούμε ανοίξτε τη σε κανονικό Browser (Chrome/Safari) για εγκατάσταση."
         : "You opened the app inside an in-app browser. Please open it in a regular browser (Chrome/Safari) to install.";
      } else if (isStandalone) {
        msg = language === 'el' ? "Η εφαρμογή βρίσκεται ήδη σε λειτουργία App!" : "App is already running in standalone mode!";
      } else if (isIos) {
        msg = language === 'el' 
         ? "Σε συσκευές Apple (iOS), πατήστε το 'Share' (κοινοποίηση) κάτω στην οθόνη και μετά 'Προσθήκη στην οθόνη έναρξης' (Add to Home Screen)." 
         : "On Apple (iOS) devices, tap 'Share' then 'Add to Home Screen'.";
      } else {
        const isSamsungBrowser = navigator.userAgent.includes('SamsungBrowser');
        msg = language === 'el' 
         ? isSamsungBrowser 
            ? "Στο Samsung Internet Browser: Πατήστε το εικονίδιο λήψης πάνω δεξιά στη γραμμή διεύθυνσης ή ανοίξτε το μενού (τρεις γραμμές κάτω δεξιά) και επιλέξτε 'Προσθήκη σελίδας σε' > 'Αρχική οθόνη'."
            : "Αν η εφαρμογή είναι ήδη εγκατεστημένη δεν θα εμφανιστεί ξανά. Αλλιώς, πατήστε το μενού του browser (τρεις τελείες πάνω δεξιά) και επιλέξτε 'Εγκατάσταση εφαρμογής' (Install app) ή 'Προσθήκη στην αρχική οθόνη'." 
         : isSamsungBrowser
            ? "On Samsung Internet: Tap the download icon in the address bar, or tap the menu (three lines bottom right) and select 'Add page to' > 'Home screen'."
            : "If the app is already installed it won't prompt again. Otherwise, tap the browser menu (three dots top right) and select 'Install app' or 'Add to Home screen'.";
      }
      alert(msg);
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
        ...(!window.matchMedia('(display-mode: standalone)').matches ? [{
          id: 'install',
          icon: Download,
          label: { el: 'Εγκατάσταση (App)', en: 'Install App' },
          value: null,
          action: handleInstall,
          color: 'text-green-400'
        }] : []),
        {
          id: 'debug',
          icon: Bug,
          label: { el: 'Διαγνωστικά', en: 'Diagnostics' },
          value: null,
          action: () => setShowDebug(!showDebug),
          color: 'text-orange-400'
        }
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
            id: 'anonymity-id',
            icon: ShieldCheck,
            label: { el: 'Ανώνυμο Προφίλ (UUID)', en: 'Anonymous Profile (UUID)' },
            value: copied 
              ? { el: 'Αντιγράφηκε!', en: 'Copied!' } 
              : companionData.userId 
                ? (companionData.userId.substring(0, 13) + '...')
                : { el: 'Δημιουργία...', en: 'Generating...' },
            action: () => {
              if (companionData.userId) {
                navigator.clipboard.writeText(companionData.userId);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }
            },
            color: 'text-sky-400'
          },
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
    <div className="relative min-h-screen w-full bg-transparent flex flex-col pt-20 pb-32">
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
            <div className="flex items-center justify-center w-10 h-10">
               <RainbowInfinity size={28} className="opacity-80 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
            </div>
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

      {showDebug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg text-white mb-4">PWA Diagnostics</h2>
            <div className="space-y-2 mb-6">
              {debugLog.map((log, i) => (
                <div key={i} className="text-xs font-mono text-green-400 bg-black/50 p-2 rounded">
                  {log}
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowDebug(false)}
              className="w-full py-3 bg-white/10 text-white rounded-xl hover:bg-white/20"
            >
              Κλείσιμο
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
