import { useEffect, useRef, useState } from 'react';
import { Download, Check, X } from 'lucide-react';
import {
  CHAPTER_COUNT,
  canKeepAudio,
  chaptersOnDevice,
  downloadAllChapters,
  offlineLangs,
  removeOfflineChapters,
} from '../lib/chapterAudio';
import type { ReadLang } from '../lib/chapterReading';

// "Listen offline": every chapter's audio onto the device with one button,
// for the metro or a flight. Shown on the chapter list.

const SIZE: Record<ReadLang, string> = { el: '60 MB', en: '50 MB' };

const T = {
  el: {
    title: 'Ακρόαση χωρίς σύνδεση',
    lead: (size: string) => `Κατέβασε τον ήχο και των ${CHAPTER_COUNT} κεφαλαίων, για να τα ακούς χωρίς ίντερνετ: στο μετρό, στο αεροπλάνο, όπου δεν έχει σήμα. Περίπου ${size}· καλύτερα με Wi-Fi.`,
    some: (n: number) => `Στη συσκευή ήδη: ${n} από ${CHAPTER_COUNT}, όσα έχεις ακούσει.`,
    get: `Κατέβασε και τα ${CHAPTER_COUNT}`,
    rest: 'Κατέβασε τα υπόλοιπα',
    going: (n: number) => `Κατεβαίνει… ${n} από ${CHAPTER_COUNT}`,
    stop: 'Διακοπή',
    done: `Και τα ${CHAPTER_COUNT} κεφάλαια είναι στη συσκευή. Ακούγονται και χωρίς σύνδεση.`,
    failed: (n: number) => `${n} δεν κατέβηκαν· ίσως χάθηκε η σύνδεση. Δοκίμασε ξανά όταν έχεις Wi-Fi.`,
    again: 'Δοκίμασε ξανά',
    remove: (size: string) => `Αφαίρεση από τη συσκευή (περίπου ${size})`,
    offline: 'Χρειάζεται σύνδεση για να κατέβουν.',
  },
  en: {
    title: 'Listen offline',
    lead: (size: string) => `Download the audio of all ${CHAPTER_COUNT} chapters to listen without the internet: on the metro, on a flight, wherever there is no signal. About ${size}; Wi-Fi is best.`,
    some: (n: number) => `Already on this device: ${n} of ${CHAPTER_COUNT}, the ones you have listened to.`,
    get: `Download all ${CHAPTER_COUNT}`,
    rest: 'Download the rest',
    going: (n: number) => `Downloading… ${n} of ${CHAPTER_COUNT}`,
    stop: 'Stop',
    done: `All ${CHAPTER_COUNT} chapters are on this device. They play without a connection too.`,
    failed: (n: number) => `${n} did not download; the connection may have dropped. Try again on Wi-Fi.`,
    again: 'Try again',
    remove: (size: string) => `Remove from this device (about ${size})`,
    offline: 'A connection is needed to download them.',
  },
};

const btn = 'btn-soft self-start';

export function OfflineAudioCard({ lang }: { lang: ReadLang }) {
  const t = T[lang];
  const [onDevice, setOnDevice] = useState<number | null>(null);
  const [pinned, setPinned] = useState(() => offlineLangs().includes(lang));
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(0);
  const [online, setOnline] = useState(() => typeof navigator === 'undefined' || navigator.onLine);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    let live = true;
    setPinned(offlineLangs().includes(lang));
    setFailed(0);
    chaptersOnDevice(lang).then((n) => live && setOnDevice(n));
    const up = () => setOnline(navigator.onLine);
    window.addEventListener('online', up);
    window.addEventListener('offline', up);
    return () => {
      live = false;
      window.removeEventListener('online', up);
      window.removeEventListener('offline', up);
      abort.current?.abort();
    };
  }, [lang]);

  if (!canKeepAudio() || onDevice === null) return null;

  const all = onDevice >= CHAPTER_COUNT;

  const start = async () => {
    const ctl = new AbortController();
    abort.current = ctl;
    setBusy(true);
    setFailed(0);
    setPinned(true);
    const res = await downloadAllChapters(lang, (ready) => setOnDevice((n) => Math.max(n ?? 0, ready)), ctl.signal);
    setOnDevice(await chaptersOnDevice(lang));
    setFailed(ctl.signal.aborted ? 0 : res.failed);
    setBusy(false);
  };

  const remove = async () => {
    await removeOfflineChapters(lang);
    setPinned(false);
    setOnDevice(await chaptersOnDevice(lang));
  };

  return (
    <section aria-labelledby="offline-audio" className="card-relief rounded-2xl p-5 desk:p-6 flex flex-col gap-3 text-left">
      <h2 id="offline-audio" className="flex items-center gap-2 text-[15px] font-medium text-ink/90">
        <Download size={17} aria-hidden="true" className="text-[var(--axis-breath-ink)]" />
        {t.title}
      </h2>

      {all && !busy ? (
        <p className="flex items-start gap-2 text-[14.5px] leading-relaxed text-ink/80">
          <Check size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--axis-body-ink)]" />
          {t.done}
        </p>
      ) : (
        <p className="text-[14.5px] leading-relaxed text-ink/75">{t.lead(SIZE[lang])}</p>
      )}

      {!busy && !all && onDevice > 0 && <p className="text-[13px] text-ink/60">{t.some(onDevice)}</p>}

      {busy && (
        <div className="flex flex-col gap-2" role="status" aria-live="polite">
          <span className="text-[13.5px] text-ink/75">{t.going(onDevice)}</span>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden" aria-hidden="true">
            <div className="h-full rounded-full bg-[var(--axis-breath-ink)] transition-[width] duration-500" style={{ width: `${(onDevice / CHAPTER_COUNT) * 100}%` }} />
          </div>
        </div>
      )}

      {failed > 0 && !busy && <p role="status" className="text-[13.5px] leading-relaxed text-ink/70">{t.failed(failed)}</p>}

      <div className="flex flex-wrap items-center gap-3">
        {busy ? (
          <button type="button" onClick={() => abort.current?.abort()} className={btn}>
            <X size={16} aria-hidden="true" /> {t.stop}
          </button>
        ) : all ? (
          <button type="button" onClick={remove} className="min-h-[44px] text-[13px] text-ink/60 underline underline-offset-4 hover:text-ink/85">
            {t.remove(SIZE[lang])}
          </button>
        ) : online ? (
          <button type="button" onClick={start} className={btn}>
            <Download size={16} aria-hidden="true" /> {failed > 0 ? t.again : onDevice > 0 || pinned ? t.rest : t.get}
          </button>
        ) : (
          <p className="text-[13px] text-ink/60">{t.offline}</p>
        )}
      </div>
    </section>
  );
}
