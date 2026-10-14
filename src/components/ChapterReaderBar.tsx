import { useEffect, useRef, useState } from 'react';
import { Headphones, Pause, Play, SkipBack, SkipForward, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import type { ReadLang, SegmentKind } from '../lib/chapterReading';
import type { ReaderSettings, ReaderStatus } from '../hooks/useSpeechReader';
import type { PiperState } from '../hooks/usePiperVoice';
import { PIPER_VOICES } from '../lib/piper/voices';

const T = {
  el: {
    listen: 'Ακρόαση',
    continue: 'Συνέχεια ακρόασης',
    fromHere: 'Από εδώ',
    pause: 'Παύση',
    play: 'Συνέχεια',
    prev: 'Προηγούμενο',
    next: 'Επόμενο',
    stop: 'Κλείσιμο ακρόασης',
    settings: 'Ρυθμίσεις ακρόασης',
    speed: 'Ταχύτητα',
    follow: 'Η σελίδα ακολουθεί την ανάγνωση',
    kind: { heading: 'Θεωρία', theory: 'Θεωρία', card: 'Κάρτα', practice: 'Άσκηση', step: 'Άσκηση' },
    stepTime: 'Κάνε το βήμα',
    paused: 'Σε παύση',
    preparing: 'Ετοιμάζεται η φωνή…',
    getTitle: 'Η φωνή της ακρόασης',
    getText: (mb: number) =>
      `Η ακρόαση γίνεται με τη φωνή Piper, που λειτουργεί μέσα στη συσκευή σου. Κατεβαίνει μία φορά (περίπου ${mb} MB) και μετά δουλεύει και χωρίς ίντερνετ. Καλύτερα με Wi-Fi.`,
    getButton: 'Κατέβασμα της φωνής',
    downloading: 'Κατέβασμα της φωνής',
    startsAfter: 'Η ανάγνωση θα ξεκινήσει μόλις ολοκληρωθεί.',
    failed: 'Το κατέβασμα δεν ολοκληρώθηκε. Έλεγξε τη σύνδεση και δοκίμασε ξανά.',
    retry: 'Δοκίμασε ξανά',
    stalled: 'Η φωνή σταμάτησε. Πάτα συνέχεια για να ξαναπροσπαθήσει.',
    code: 'Κωδικός',
    remove: (mb: number) => `Διαγραφή της φωνής από τη συσκευή (περίπου ${mb} MB)`,
    close: 'Κλείσιμο',
  },
  en: {
    listen: 'Listen',
    continue: 'Continue listening',
    fromHere: 'From here',
    pause: 'Pause',
    play: 'Resume',
    prev: 'Previous',
    next: 'Next',
    stop: 'Close listening',
    settings: 'Listening settings',
    speed: 'Speed',
    follow: 'The page follows the reading',
    kind: { heading: 'Theory', theory: 'Theory', card: 'Card', practice: 'Practice', step: 'Practice' },
    stepTime: 'Your turn',
    paused: 'Paused',
    preparing: 'Preparing the voice…',
    getTitle: 'The listening voice',
    getText: (mb: number) =>
      `Listening uses the Piper voice, which runs on your device. It downloads once (about ${mb} MB), then works offline too. Best on Wi-Fi.`,
    getButton: 'Download the voice',
    downloading: 'Downloading the voice',
    startsAfter: 'Reading will start as soon as it finishes.',
    failed: 'The download did not finish. Check your connection and try again.',
    retry: 'Try again',
    stalled: 'The voice stopped. Press resume to try again.',
    code: 'Code',
    remove: (mb: number) => `Remove the voice from this device (about ${mb} MB)`,
    close: 'Close',
  },
} as const;

const RATES = [0.8, 0.9, 1, 1.1];

interface Props {
  lang: ReadLang;
  status: ReaderStatus;
  index: number;
  total: number;
  kind?: SegmentKind;
  silence: { until: number; ms: number } | null;
  waiting: boolean;
  errorCode: number | null;
  errorDetail?: string;
  hasResume: boolean;
  settings: ReaderSettings;
  reduceMotion: boolean;
  piper: { state: PiperState; ready: boolean; download: () => void; remove: () => void };
  onStart: () => void;
  onResumeSaved: () => void;
  onPause: () => void;
  onResume: () => void;
  onPrev: () => void;
  onNext: () => void;
  onStop: () => void;
  onSettings: (s: ReaderSettings) => void;
}

const bottom = 'bottom-[calc(88px+env(safe-area-inset-bottom))] lg:bottom-6';
const card = 'rounded-2xl bg-[#1a1d27]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]';

function Progress({ state, label }: { state: PiperState; label: string }) {
  if (state.kind !== 'downloading') return null;
  const pct = state.total ? Math.min(100, Math.round((state.loaded / state.total) * 100)) : 0;
  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex justify-between text-xs text-white/60 font-sans">
        <span>{label}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full bg-teal-400/60 transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ChapterReaderBar(p: Props) {
  const t = T[p.lang];
  const mb = PIPER_VOICES[p.lang].downloadMb;
  const [open, setOpen] = useState(false);
  const [getting, setGetting] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  /** What the tap on "Listen" asked for; it runs by itself once the voice is on the device. */
  const pendingStart = useRef<null | (() => void)>(null);
  const active = p.status !== 'idle';
  const pState = p.piper.state;

  useEffect(() => {
    if (p.piper.ready && pendingStart.current) {
      const go = pendingStart.current;
      pendingStart.current = null;
      setGetting(false);
      if (p.status === 'idle') go();
    }
  }, [p.piper.ready, p.status]);

  const begin = (go: () => void) => {
    if (p.piper.ready) {
      go();
      return;
    }
    pendingStart.current = go;
    setGetting(true);
  };

  const getVoice = (
    <AnimatePresence>
      {getting && !p.piper.ready && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: p.reduceMotion ? 0.01 : 0.2 }}
          className={cn(card, 'p-4 space-y-3 mb-2')}
          role="dialog"
          aria-label={t.getTitle}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/85 font-sans">{t.getTitle}</span>
            <button
              type="button"
              onClick={() => {
                pendingStart.current = null;
                setGetting(false);
              }}
              aria-label={t.close}
              className="h-8 w-8 rounded-full flex items-center justify-center text-white/40 hover:text-white/80"
            >
              <X size={16} />
            </button>
          </div>

          {pState.kind === 'downloading' ? (
            <div className="space-y-2">
              <Progress state={pState} label={t.downloading} />
              <p className="text-[11px] text-white/40 font-sans">{t.startsAfter}</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-white/55 font-sans leading-relaxed">{t.getText(mb)}</p>
              {pState.kind === 'error' && <p className="text-xs text-amber-200/70 font-sans">{t.failed}</p>}
              <button
                type="button"
                onClick={p.piper.download}
                className="w-full h-11 rounded-xl border border-teal-500/30 bg-teal-500/10 text-sm text-teal-100 font-sans hover:bg-teal-500/15 transition-colors"
              >
                {pState.kind === 'error' ? t.retry : t.getButton}
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!active) {
    return (
      <div data-no-read className={cn('fixed left-0 right-0 z-40 px-4 pointer-events-none', bottom)}>
        <div className="max-w-md mx-auto pointer-events-auto">
          {getVoice}
          <div className="flex items-center justify-end gap-2">
            {p.hasResume && (
              <button
                type="button"
                onClick={() => begin(p.onStart)}
                className="h-11 px-4 rounded-full bg-[#1a1d27]/90 backdrop-blur-xl border border-white/10 text-white/60 text-sm font-sans hover:text-white/90 transition-colors"
              >
                {t.fromHere}
              </button>
            )}
            <button
              type="button"
              onClick={() => begin(p.hasResume ? p.onResumeSaved : p.onStart)}
              className="h-11 pl-4 pr-5 rounded-full bg-[#1a1d27]/90 backdrop-blur-xl border border-teal-500/25 text-teal-200/90 shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex items-center gap-2 text-sm font-sans hover:border-teal-400/40 hover:text-teal-100 transition-colors"
            >
              <Headphones size={16} aria-hidden="true" />
              <span>{p.hasResume ? t.continue : t.listen}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isStep = p.kind === 'step' && !!p.silence;
  const label =
    p.status === 'paused' ? t.paused : p.waiting ? t.preparing : isStep ? t.stepTime : p.kind ? t.kind[p.kind] : '';
  const progress = p.total > 1 ? (p.index / (p.total - 1)) * 100 : 100;

  return (
    <div data-no-read className={cn('fixed left-0 right-0 z-40 px-4 pointer-events-none', bottom)}>
      <div className="max-w-md mx-auto pointer-events-auto">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: p.reduceMotion ? 0.01 : 0.2 }}
              className={cn(card, 'mb-2 p-4 space-y-4')}
            >
              <div className="space-y-2">
                <span className="text-[11px] text-white/40 font-sans">{t.speed}</span>
                <div className="flex gap-2">
                  {RATES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => p.onSettings({ ...p.settings, rate: r })}
                      aria-pressed={p.settings.rate === r}
                      className={cn(
                        'flex-1 h-9 rounded-xl text-sm font-sans border transition-colors',
                        p.settings.rate === r
                          ? 'border-teal-500/40 bg-teal-500/10 text-teal-200'
                          : 'border-white/5 text-white/50 hover:text-white/80'
                      )}
                    >
                      {r.toLocaleString(p.lang === 'el' ? 'el-GR' : 'en-GB', { minimumFractionDigits: 1 })}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <span className="text-sm text-white/70 font-sans">{t.follow}</span>
                <input
                  type="checkbox"
                  checked={p.settings.follow}
                  onChange={(e) => p.onSettings({ ...p.settings, follow: e.target.checked })}
                  className="h-5 w-5 accent-teal-500"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  p.piper.remove();
                }}
                className="text-[11px] text-white/35 hover:text-white/60 font-sans text-left"
              >
                {t.remove(mb)}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div role="region" aria-label={t.listen} className={cn(card, 'overflow-hidden')}>
          <div className="h-[2px] bg-white/5">
            <div className="h-full bg-teal-400/50 transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>

          {p.errorCode !== null && (
            <div className="px-4 pt-3 space-y-1" role="status">
              <p className="text-xs text-amber-200/70 font-sans leading-relaxed">
                {t.stalled}{' '}
                <button type="button" onClick={() => setShowDetail((v) => !v)} className="text-white/30 underline-offset-2 hover:underline">
                  ({t.code} {p.errorCode})
                </button>
              </p>
              {showDetail && p.errorDetail && (
                <p className="text-[10px] text-white/35 font-mono break-words select-all">{p.errorDetail}</p>
              )}
            </div>
          )}

          <div className="flex items-center gap-0.5 px-1.5 py-2">
            <button type="button" onClick={p.onPrev} aria-label={t.prev} className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-white/50 hover:text-white/90 transition-colors">
              <SkipBack size={18} />
            </button>
            <button
              type="button"
              onClick={p.status === 'playing' ? p.onPause : p.onResume}
              aria-label={p.status === 'playing' ? t.pause : t.play}
              className="h-12 w-12 shrink-0 rounded-full flex items-center justify-center bg-teal-500/15 text-teal-200 border border-teal-500/25 hover:bg-teal-500/25 transition-colors"
            >
              {p.status === 'playing' ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
            <button type="button" onClick={p.onNext} aria-label={t.next} className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-white/50 hover:text-white/90 transition-colors">
              <SkipForward size={18} />
            </button>

            <div className="flex-1 min-w-0 px-2" aria-live="polite">
              <div className="text-xs text-white/70 font-sans leading-tight">{label}</div>
              <div className="text-[11px] text-white/35 font-sans tabular-nums">
                {p.index + 1} / {p.total}
              </div>
              {isStep && p.silence && (
                <div className="mt-1 h-[2px] rounded-full bg-white/5 overflow-hidden">
                  <div
                    key={p.silence.until}
                    className="h-full bg-teal-300/40"
                    style={{
                      width: p.reduceMotion ? '100%' : undefined,
                      animation: p.reduceMotion ? undefined : `reader-fill ${p.silence.ms}ms linear forwards`,
                    }}
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={t.settings}
              aria-expanded={open}
              className={cn('h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-colors', open ? 'text-teal-200' : 'text-white/40 hover:text-white/80')}
            >
              <SlidersHorizontal size={17} />
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                p.onStop();
              }}
              aria-label={t.stop}
              className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
