import { PageHeader } from '../components/PageHeader';
import { versionText } from '../lib/version';
import { isNative } from '../lib/native';
import React, { useState, useEffect } from 'react';
import { downloadBackup, restoreBackup } from '../lib/backup';
import { lastBackupDate } from '../lib/dataSafety';
import { readErrors, clearErrors, errorReport } from '../lib/errorLog';
import { Languages, Activity, LetterText, Info, LogOut, Sparkles, Sun, Database, FileText, Download, Bug, ShieldCheck, Accessibility, MessageCircleHeart, CalendarClock } from 'lucide-react';
import { openIcs, googleCalendarUrl } from '../lib/reminder';
import { feedbackMailto } from '../lib/feedback';
import { CONTACT_EMAIL } from '../lib/links';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';
import { cn } from '../lib/utils';

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { reduceMotion, toggleReduceMotion, easyRead, toggleEasyRead } = useAccessibility();
  const [canInstall, setCanInstall] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  // The time last chosen for the calendar reminder (a convenience on this device).
  const [remindAt, setRemindAt] = useState(() => {
    try { return localStorage.getItem('n_mindfulness_reminder_time') || '09:00'; } catch { return '09:00'; }
  });
  const chooseTime = (v: string) => {
    setRemindAt(v);
    try { localStorage.setItem('n_mindfulness_reminder_time', v); } catch { /* storage unavailable */ }
  };
  // The day of the last copy, shown next to "Save Data".
  const [lastBackup, setLastBackup] = useState(lastBackupDate);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  // Errors the app noted on this device (lib/errorLog.ts).
  const [errors, setErrors] = useState(readErrors);

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
        // Not in the installed app (on the phone's home screen, or the Android app).
        ...(!window.matchMedia('(display-mode: standalone)').matches && !isNative() ? [{
          id: 'install',
          icon: Download,
          label: { el: 'Εγκατάσταση (App)', en: 'Install App' },
          value: null,
          action: () => navigate('/install'),
          color: 'text-green-400'
        }] : []),
        {
          id: 'reminder',
          icon: CalendarClock,
          label: { el: 'Υπενθύμιση στο ημερολόγιο', en: 'Reminder in your calendar' },
          hint: { el: 'Μία ήπια υπενθύμιση τη μέρα, χωρίς σερί', en: 'One gentle reminder a day, no streaks' },
          value: null,
          action: () => setShowReminder(true),
          color: 'text-[var(--axis-breath-ink)]'
        },
        {
          id: 'feedback',
          icon: MessageCircleHeart,
          label: { el: 'Τι θα άλλαζες;', en: 'What would you change?' },
          hint: { el: 'Ένα email με πέντε σύντομες ερωτήσεις, από το δικό σου email', en: 'An email with five short questions, from your own email' },
          value: null,
          action: () => { window.location.href = feedbackMailto(language === 'en' ? 'en' : 'el'); },
          color: 'text-sign-gold'
        },
        {
          id: 'debug',
          icon: Bug,
          label: { el: 'Διαγνωστικά', en: 'Diagnostics' },
          value: errors.length ? { el: `${errors.length} σφάλματα`, en: `${errors.length} errors` } : null,
          action: () => { setErrors(readErrors()); setShowDebug(!showDebug); },
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
          pressed: reduceMotion,
          color: 'text-indigo-400'
        },
        {
          id: 'easy-read',
          icon: LetterText,
          label: { el: 'Εύκολη ανάγνωση', en: 'Easy reading' },
          hint: { el: 'Λίγο μεγαλύτερα γράμματα, περισσότερος χώρος ανάμεσα σε γράμματα, λέξεις και γραμμές, χωρίς πλάγια', en: 'Slightly larger letters, more space between letters, words and lines, no slanted text' },
          value: easyRead ? { el: 'Ενεργό', en: 'Enabled' } : { el: 'Ανενεργό', en: 'Disabled' },
          action: toggleEasyRead,
          pressed: easyRead,
          color: 'text-sky-300'
        }
      ]
    },
    {
        title: { el: 'Δεδομένα', en: 'Data' },
        items: [
          {
            id: 'export-data',
            icon: Download,
            label: { el: 'Αποθήκευση Δεδομένων (Backup)', en: 'Save Data (Backup)' },
            value: lastBackup
              ? { el: `Τελευταίο: ${lastBackup.toLocaleDateString('el-GR', { day: 'numeric', month: 'short' })}`, en: `Last: ${lastBackup.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` }
              : null,
            action: () => {
              downloadBackup();
              setLastBackup(lastBackupDate());
              alert(language === 'el' ? 'Τα δεδομένα σου αποθηκεύτηκαν σε αρχείο.' : 'Your data has been saved to a file.');
            },
            color: 'text-indigo-400'
          },
          {
            id: 'import-data',
            icon: Database,
            label: { el: 'Ανάκτηση (Restore)', en: 'Restore Data' },
            value: null,
            action: () => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'application/json';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    restoreBackup(event.target?.result as string);
                    alert(language === 'el' ? 'Επιτυχής επαναφορά! Η εφαρμογή θα επανεκκινηθεί.' : 'Restore successful! App will reload.');
                    window.location.reload();
                  } catch (err) {
                    alert(language === 'el' ? 'Σφάλμα ανάγνωσης αρχείου.' : 'Error reading backup file.');
                  }
                };
                reader.readAsText(file);
              };
              input.click();
            },
            color: 'text-teal-400'
          },
          {
            id: 'export-pdf',
            icon: FileText,
            label: { el: 'Εξαγωγή Βιβλίου (PDF)', en: 'Export Workbook (PDF)' },
            value: null,
            action: () => {
              window.open(`/workbook_${language === 'en' ? 'en' : 'el'}.pdf`, '_blank');
            },
            color: 'text-blue-400'
          },
          {
            id: 'privacy',
            icon: ShieldCheck,
            label: { el: 'Απόρρητο και όροι', en: 'Privacy and terms' },
            value: null,
            action: () => navigate('/privacy'),
            color: 'text-emerald-300'
          },
          {
            id: 'accessibility',
            icon: Accessibility,
            label: { el: 'Δήλωση προσβασιμότητας', en: 'Accessibility statement' },
            value: null,
            action: () => navigate('/accessibility'),
            color: 'text-sky-300'
          },
          {
            id: 'clear',
            icon: LogOut,
            label: { el: 'Διαγραφή Δεδομένων', en: 'Clear Data' },
            value: null,
            action: () => {
                if (confirm(language === 'el' ? 'Είσαι σίγουρος; Όλες οι καταγραφές θα διαγραφούν.' : 'Are you sure? All records will be deleted.')) {
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
    <div className="relative min-h-screen w-full bg-transparent flex flex-col pt-2 pb-32">
       <div className="w-full max-w-xl mx-auto">
          <div className="mb-10">
            <PageHeader
              back={() => {
                if (window.history.length > 2) navigate(-1);
                else navigate('/');
              }}
              title={language === 'el' ? 'Ρυθμίσεις' : 'Settings'}
            />
          </div>

          <div className="space-y-8">
            {/* The research behind the method: a card like the rows below, in the sign's blue. */}
            <button
              type="button"
              onClick={() => navigate('/methodology')}
              className="card-relief w-full text-left flex items-center gap-4 p-4 rounded-[20px] hover:brightness-110 transition-all group active:scale-[0.98]"
            >
              <div className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center bg-[var(--tint-blue-bg)] border border-[var(--tint-blue-line)] text-[var(--tint-blue-ink)]">
                <ShieldCheck size={22} aria-hidden="true" />
              </div>
              <span className="flex flex-col min-w-0 gap-0.5">
                <span className="text-[15px] font-medium text-ink/90 group-hover:text-ink transition-colors">
                  {language === 'el' ? 'Η Επιστημονική Βάση' : 'The Research Basis'}
                </span>
                <span className="text-[13px] leading-snug text-ink/70">
                  {language === 'el'
                    ? 'Οι μελέτες πίσω από κάθε κομμάτι της μεθόδου, και τι δεν έχουν δείξει ακόμα.'
                    : 'The studies behind each part of the method, and what they have not shown yet.'}
                </span>
              </span>
            </button>

            {sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-[13px] font-medium text-ink/65 px-1">
                  {language === 'el' ? section.title.el : section.title.en}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.action}
                      aria-pressed={'pressed' in item ? item.pressed : undefined}
                      className="card-relief w-full flex items-center justify-between p-4 rounded-2xl hover:brightness-110 transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4 min-w-0 text-left">
                        <div className={cn("w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-white/5", item.color)}>
                          <item.icon size={18} />
                        </div>
                        <span className="flex flex-col min-w-0 gap-0.5">
                          <span className="text-[14px] font-sans font-medium text-ink/80 group-hover:text-ink transition-colors">
                            {language === 'el' ? item.label.el : item.label.en}
                          </span>
                          {'hint' in item && item.hint && (
                            <span className="text-[12px] leading-snug text-ink/70">{language === 'el' ? item.hint.el : item.hint.en}</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 pl-2">
                         {item.value && (
                           <span className="text-[12px] font-sans text-ink/70 bg-white/5 px-2 py-1 rounded-lg">
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
          <div className="mt-16 flex flex-col items-center gap-4 opacity-80">
             <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center p-3">
                <Sparkles size={20} className="text-ink" />
             </div>
             <div className="text-center">
                <p className="text-[13px] font-sans font-medium text-ink mb-1">
                   Mindfulness for Neurodivergent Minds
                </p>
                {/* Which version this is: the day it was built, and in the Android app the
                    copy number too (it rises when the app has updated itself). */}
                <p className="text-[12px] font-sans text-ink/70">
                   {versionText(language === 'el' ? 'el' : 'en')}
                </p>
             </div>
          </div>
       </div>

      {showReminder && (() => {
        const el = language === 'el';
        const lg = el ? 'el' : 'en';
        return createPortal(
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80" onClick={() => setShowReminder(false)}>
            <div role="dialog" aria-modal="true" aria-labelledby="reminder-title" onClick={(e) => e.stopPropagation()} className="card-relief p-6 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto flex flex-col gap-4">
              <h2 id="reminder-title" className="font-display text-[24px] text-ink">{el ? 'Υπενθύμιση στο ημερολόγιο' : 'Reminder in your calendar'}</h2>
              <p className="text-[14px] leading-relaxed text-ink/75">
                {el
                  ? 'Ένα γεγονός που επαναλαμβάνεται κάθε μέρα στο δικό σου ημερολόγιο: «Λίγα λεπτά για σένα». Χωρίς σερί και χωρίς μέτρημα· το μετακινείς ή το σβήνεις όπως κάθε γεγονός.'
                  : 'An event that repeats every day in your own calendar: “A few minutes for you”. No streaks, no counting; move it or delete it like any event.'}
              </p>
              <label className="flex items-center justify-between gap-4 rounded-xl bg-black/30 border border-white/5 px-4 min-h-[52px]">
                <span className="text-[14px] text-ink/85">{el ? 'Ώρα' : 'Time'}</span>
                <input
                  type="time"
                  value={remindAt}
                  onChange={(e) => chooseTime(e.target.value)}
                  className="bg-transparent text-[16px] text-ink outline-none [color-scheme:dark]"
                />
              </label>
              <div className="flex flex-col gap-2 pt-1">
                <button type="button" onClick={() => openIcs(lg, remindAt)} className="min-h-[44px] rounded-xl btn-gold text-[14px] font-medium">
                  {el ? 'Πρόσθεσε στο ημερολόγιο (.ics)' : 'Add to calendar (.ics)'}
                </button>
                <a href={googleCalendarUrl(lg, remindAt)} target="_blank" rel="noopener noreferrer" className="min-h-[44px] flex items-center justify-center rounded-xl border border-white/10 text-[14px] text-ink/85 hover:text-ink">
                  Google Calendar
                </a>
                <p className="text-[12.5px] leading-relaxed text-ink/70">
                  {el
                    ? 'Το αρχείο ανοίγει στο ημερολόγιο του iPhone, του Mac, στο Outlook και στο Samsung Calendar. Στο Android με Google Calendar, διάλεξε το δεύτερο κουμπί.'
                    : 'The file opens in the calendar on iPhone and Mac, in Outlook and in Samsung Calendar. On Android with Google Calendar, choose the second button.'}
                </p>
                <button type="button" onClick={() => setShowReminder(false)} className="min-h-[44px] rounded-xl bg-white/[0.06] text-[14px] text-ink/90 hover:bg-white/[0.1]">
                  {el ? 'Κλείσιμο' : 'Close'}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        );
      })()}

      {showDebug && (() => {
        const el = language === 'el';
        const report = errorReport(el ? 'el' : 'en', errors) + '\n\n' + debugLog.join('\n');
        const mail = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(el ? 'Σφάλματα της εφαρμογής' : 'App errors')}&body=${encodeURIComponent(report.slice(0, 1900))}`;
        return createPortal(
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80" onClick={() => setShowDebug(false)}>
            <div role="dialog" aria-modal="true" aria-labelledby="diag-title" onClick={(e) => e.stopPropagation()} className="card-relief p-6 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto flex flex-col gap-4">
              <h2 id="diag-title" className="font-display text-[24px] text-ink">{el ? 'Διαγνωστικά' : 'Diagnostics'}</h2>
              <p className="text-[14px] leading-relaxed text-ink/75">
                {el
                  ? 'Όταν κάτι δεν δουλεύει, η εφαρμογή κρατά μια σύντομη σημείωση σε αυτή τη συσκευή. Δεν στέλνεται πουθενά μόνη της· αν θέλεις, τη στέλνεις εσύ στον δημιουργό με email.'
                  : 'When something does not work, the app keeps a short note on this device. It is never sent anywhere on its own; if you like, you send it to the creator by email.'}
              </p>
              {errors.length === 0 ? (
                <p className="text-[14px] text-ink/85">{el ? 'Κανένα σφάλμα. Όλα καλά.' : 'No errors. All is well.'}</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {errors.slice().reverse().map((x, i) => (
                    <li key={i} className="rounded-xl bg-black/30 border border-white/5 p-3 text-[12.5px] leading-snug">
                      <span className="block text-ink/70">{new Date(x.t).toLocaleString(el ? 'el-GR' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {x.where}{x.count > 1 ? ` · ×${x.count}` : ''}</span>
                      <span className="block mt-1 text-ink/85 break-words">{x.msg}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-col gap-2 pt-1">
                {errors.length > 0 && (
                  <a href={mail} className="min-h-[44px] flex items-center justify-center rounded-xl btn-gold text-[14px] font-medium">
                    {el ? 'Στείλε το στον δημιουργό' : 'Send it to the creator'}
                  </a>
                )}
                {errors.length > 0 && (
                  <button type="button" onClick={() => { clearErrors(); setErrors([]); }} className="min-h-[44px] rounded-xl border border-white/10 text-[14px] text-ink/75 hover:text-ink">
                    {el ? 'Καθάρισμα' : 'Clear'}
                  </button>
                )}
                <details className="text-[12px] text-ink/70">
                  <summary className="cursor-pointer min-h-[36px] flex items-center">{el ? 'Τεχνικά στοιχεία' : 'Technical details'}</summary>
                  <div className="mt-2 flex flex-col gap-1 font-mono break-all">
                    {debugLog.map((log, i) => <span key={i}>{log}</span>)}
                  </div>
                </details>
                <button type="button" onClick={() => setShowDebug(false)} className="min-h-[44px] rounded-xl bg-white/[0.06] text-[14px] text-ink/90 hover:bg-white/[0.1]">
                  {el ? 'Κλείσιμο' : 'Close'}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        );
      })()}
    </div>
  );
}
