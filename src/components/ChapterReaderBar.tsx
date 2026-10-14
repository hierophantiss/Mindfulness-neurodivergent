import { useEffect, useRef, useState } from 'react';
import { Headphones, Pause, Play, SkipBack, SkipForward, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import type { ReadLang, SegmentKind } from '../lib/chapterReading';
import type { EngineId, ReaderSettings, ReaderStatus } from '../hooks/useSpeechReader';
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
    voice: 'Φωνή',
    deviceVoice: 'Του κινητού',
    piperVoice: 'Piper',
    deviceVoiceList: 'Φωνή του κινητού',
    noVoice: 'Δεν βρέθηκε ελληνική φωνή στη συσκευή. Δοκίμασε τη φωνή Piper από τις ρυθμίσεις.',
    kind: { heading: 'Θεωρία', theory: 'Θεωρία', card: 'Κάρτα', practice: 'Άσκηση', step: 'Άσκηση' },
    stepTime: 'Κάνε το βήμα',
    paused: 'Σε παύση',
    preparing: 'Ετοιμάζεται η φωνή…',
    chooseTitle: 'Με ποια φωνή;',
    chooseDevice: 'Φωνή του κινητού',
    chooseDeviceSub: 'Ξεκινά αμέσως. Η ποιότητα εξαρτάται από τη συσκευή.',
    choosePiper: 'Φωνή Piper',
    choosePiperSub: (mb: number) => `Κατεβαίνει μία φορά (περίπου ${mb} MB) και μετά δουλεύει και χωρίς ίντερνετ. Καλύτερα με Wi-Fi.`,
    chooseLater: 'Μπορείς να την αλλάξεις όποτε θέλεις από τις ρυθμίσεις ακρόασης.',
    downloading: 'Κατέβασμα της φωνής',
    meanwhile: 'Ξεκίνα με τη φωνή του κινητού στο μεταξύ',
    failed: 'Το κατέβασμα δεν ολοκληρώθηκε. Έλεγξε τη σύνδεση και δοκίμασε ξανά.',
    retry: 'Δοκίμασε ξανά',
    download: (mb: number) => `Κατέβασμα (περίπου ${mb} MB)`,
    remove: (mb: number) => `Διαγραφή της φωνής Piper από τη συσκευή (περίπου ${mb} MB)`,
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
    voice: 'Voice',
    deviceVoice: 'Device',
    piperVoice: 'Piper',
    deviceVoiceList: 'Device voice',
    noVoice: 'No English voice was found on this device. Try the Piper voice in the settings.',
    kind: { heading: 'Theory', theory: 'Theory', card: 'Card', practice: 'Practice', step: 'Practice' },
    stepTime: 'Your turn',
    paused: 'Paused',
    preparing: 'Preparing the voice…',
    chooseTitle: 'Which voice?',
    chooseDevice: 'Device voice',
    chooseDeviceSub: 'Starts straight away. Quality depends on your device.',
    choosePiper: 'Piper voice',
    choosePiperSub: (mb: number) => `Downloads once (about ${mb} MB), then works offline too. Best on Wi-Fi.`,
    chooseLater: 'You can change it any time in the listening settings.',
    downloading: 'Downloading the voice',
    meanwhile: 'Start with the device voice meanwhile',
    failed: 'The download did not finish. Check your connection and try again.',
    retry: 'Try again',
    download: (mb: number) => `Download (about ${mb} MB)`,
    remove: (mb: number) => `Remove the Piper voice from this device (about ${mb} MB)`,
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
  hasResume: boolean;
  noVoice: boolean;
  voices: SpeechSynthesisVoice[];
  voiceName?: string;
  settings: ReaderSettings;
  reduceMotion: boolean;
  piper: { supported: boolean; state: PiperState; download: () => void; remove: () => void };
  deviceSupported: boolean;
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
  const [choosing, setChoosing] = useState(false);
  /** Reading should begin by itself once the Piper download finishes. */
  const startWhenReady = useRef<null | (() => void)>(null);
  /** What the tap on "Listen" asked for, kept while the voice is being chosen. */
  const pendingStart = useRef<() => void>(p.onStart);
  const active = p.status !== 'idle';
  const pState = p.piper.state;

  useEffect(() => {
    if (pState.kind === 'ready' && startWhenReady.current) {
      const go = startWhenReady.current;
      startWhenReady.current = null;
      setChoosing(false);
      if (p.status === 'idle') go();
    }
  }, [pState.kind, p.status]);

  const setEngine = (engine: EngineId) => p.onSettings({ ...p.settings, engine });

  const begin = (go: () => void) => {
    if (!p.settings.engine && p.piper.supported) {
      startWhenReady.current = null;
      setChoosing(true);
      pendingStart.current = go;
      return;
    }
    if (p.settings.engine === 'piper' && pState.kind !== 'ready' && p.piper.supported) {
      // Chosen before but no longer on the device (storage cleared): offer it again.
      pendingStart.current = go;
      setChoosing(true);
      return;
    }
    go();
  };
  const chooseDevice = () => {
    setEngine('device');
    setChoosing(false);
    startWhenReady.current = null;
    pendingStart.current();
  };
  const choosePiper = () => {
    setEngine('piper');
    if (pState.kind === 'ready') {
      setChoosing(false);
      pendingStart.current();
      return;
    }
    startWhenReady.current = pendingStart.current;
    if (pState.kind !== 'downloading') p.piper.download();
  };
  const meanwhile = () => {
    // Keep Piper as the choice: the reader switches to it by itself when the download ends.
    startWhenReady.current = null;
    setChoosing(false);
    pendingStart.current();
  };

  const chooser = (
    <AnimatePresence>
      {choosing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: p.reduceMotion ? 0.01 : 0.2 }}
          className={cn(card, 'p-4 space-y-3 mb-2')}
          role="dialog"
          aria-label={t.chooseTitle}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80 font-sans">{t.chooseTitle}</span>
            <button type="button" onClick={() => { startWhenReady.current = null; setChoosing(false); }} aria-label={t.close} className="h-8 w-8 rounded-full flex items-center justify-center text-white/40 hover:text-white/80">
              <X size={16} />
            </button>
          </div>

          {pState.kind === 'downloading' ? (
            <div className="space-y-3">
              <Progress state={pState} label={t.downloading} />
              {p.deviceSupported && (
                <button type="button" onClick={meanwhile} className="w-full h-10 rounded-xl border border-white/10 text-sm text-white/70 font-sans hover:text-white/90">
                  {t.meanwhile}
                </button>
              )}
            </div>
          ) : (
            <>
              {p.deviceSupported && (
                <button type="button" onClick={chooseDevice} className="w-full text-left rounded-xl border border-white/10 hover:border-white/20 p-3 space-y-1 transition-colors">
                  <span className="block text-sm text-white/85 font-sans">{t.chooseDevice}</span>
                  <span className="block text-xs text-white/45 font-sans leading-relaxed">{t.chooseDeviceSub}</span>
                </button>
              )}
              <button type="button" onClick={choosePiper} className="w-full text-left rounded-xl border border-teal-500/25 hover:border-teal-400/40 bg-teal-500/[0.04] p-3 space-y-1 transition-colors">
                <span className="block text-sm text-teal-100/90 font-sans">{t.choosePiper}</span>
                <span className="block text-xs text-white/45 font-sans leading-relaxed">{t.choosePiperSub(mb)}</span>
              </button>
              {pState.kind === 'error' && <p className="text-xs text-amber-200/70 font-sans">{t.failed}</p>}
              <p className="text-[11px] text-white/35 font-sans">{t.chooseLater}</p>
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
          {chooser}
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
  const engine: EngineId = p.settings.engine === 'piper' ? 'piper' : 'device';

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

              {p.piper.supported && (
                <div className="space-y-2">
                  <span className="text-[11px] text-white/40 font-sans">{t.voice}</span>
                  <div className="flex gap-2">
                    {(['device', 'piper'] as EngineId[]).map((id) => (
                      <button
                        key={id}
                        type="button"
                        disabled={id === 'device' && !p.deviceSupported}
                        onClick={() => {
                          setEngine(id);
                          if (id === 'piper' && pState.kind !== 'ready' && pState.kind !== 'downloading') p.piper.download();
                        }}
                        aria-pressed={engine === id}
                        className={cn(
                          'flex-1 h-9 rounded-xl text-sm font-sans border transition-colors disabled:opacity-30',
                          engine === id
                            ? 'border-teal-500/40 bg-teal-500/10 text-teal-200'
                            : 'border-white/5 text-white/50 hover:text-white/80'
                        )}
                      >
                        {id === 'device' ? t.deviceVoice : t.piperVoice}
                      </button>
                    ))}
                  </div>
                  <Progress state={pState} label={t.downloading} />
                  {pState.kind === 'error' && (
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-amber-200/70 font-sans">{t.failed}</p>
                      <button type="button" onClick={p.piper.download} className="text-xs text-teal-200 font-sans shrink-0">{t.retry}</button>
                    </div>
                  )}
                  {engine === 'piper' && pState.kind === 'absent' && (
                    <button type="button" onClick={p.piper.download} className="text-xs text-teal-200 font-sans">{t.download(mb)}</button>
                  )}
                  {pState.kind === 'ready' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (engine === 'piper') setEngine('device');
                        p.piper.remove();
                      }}
                      className="text-[11px] text-white/35 hover:text-white/60 font-sans text-left"
                    >
                      {t.remove(mb)}
                    </button>
                  )}
                </div>
              )}

              {engine === 'device' && p.voices.length > 1 && (
                <label className="block space-y-2">
                  <span className="text-[11px] text-white/40 font-sans">{t.deviceVoiceList}</span>
                  <select
                    value={p.voiceName || ''}
                    onChange={(e) =>
                      p.onSettings({
                        ...p.settings,
                        [p.lang === 'el' ? 'voiceEl' : 'voiceEn']: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-xl bg-[#0f1117] border border-white/10 text-sm text-white/80 px-3 font-sans"
                  >
                    {p.voices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <span className="text-sm text-white/70 font-sans">{t.follow}</span>
                <input
                  type="checkbox"
                  checked={p.settings.follow}
                  onChange={(e) => p.onSettings({ ...p.settings, follow: e.target.checked })}
                  className="h-5 w-5 accent-teal-500"
                />
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        <div role="region" aria-label={t.listen} className={cn(card, 'overflow-hidden')}>
          <div className="h-[2px] bg-white/5">
            <div className="h-full bg-teal-400/50 transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>

          {p.noVoice && engine === 'device' && (
            <p className="px-4 pt-3 text-xs text-amber-200/70 font-sans leading-relaxed">{t.noVoice}</p>
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
