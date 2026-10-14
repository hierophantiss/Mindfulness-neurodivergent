import { useCallback, useEffect, useRef, useState } from 'react';
import { toSentences, type ReadLang, type ReadSegment, type SegmentKind } from '../lib/chapterReading';
import { deviceEngine, piperEngine, setPiperWaitingListener, type SpeechEngine } from '../lib/speechEngines';

/**
 * Reads a list of segments aloud, sentence by sentence, with either the
 * device's own voices (Web Speech API) or the Piper voice downloaded once.
 * Nothing leaves the device. Pause stops the voice; resume restarts the
 * current sentence, which behaves the same on every browser.
 */

export type ReaderStatus = 'idle' | 'playing' | 'paused';
export type EngineId = 'device' | 'piper';

export interface ReaderSettings {
  rate: number;
  follow: boolean;
  voiceEl?: string;
  voiceEn?: string;
  /** Unset until the listener has chosen a voice the first time. */
  engine?: EngineId;
}

const SETTINGS_KEY = 'n_mindfulness_reader_settings';
const DEFAULT_SETTINGS: ReaderSettings = { rate: 0.9, follow: true };

export function loadReaderSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveReaderSettings(s: ReaderSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable: settings last for this visit only */
  }
}

/** Silence after each kind of segment, in ms. Steps leave time to do the step. */
const PAUSE_AFTER: Record<SegmentKind, number> = {
  heading: 900,
  theory: 700,
  card: 1400,
  practice: 2500,
  step: 7000,
};
/** Exercises and cards are read a little slower than the theory. */
const RATE_FACTOR: Record<SegmentKind, number> = {
  heading: 1,
  theory: 1,
  card: 0.95,
  practice: 0.92,
  step: 0.9,
};
const PAUSE_BEFORE_PRACTICE = 1800;

const speechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

const QUALITY = /natural|neural|online|enhanced|premium|google/i;

function voicesFor(lang: ReadLang, all: SpeechSynthesisVoice[]) {
  return all.filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith(lang));
}

export function pickVoice(lang: ReadLang, all: SpeechSynthesisVoice[], preferred?: string) {
  const list = voicesFor(lang, all);
  if (!list.length) return null;
  const chosen = preferred && list.find((v) => v.name === preferred);
  if (chosen) return chosen;
  const score = (v: SpeechSynthesisVoice) =>
    (QUALITY.test(v.name) ? 2 : 0) +
    (lang === 'en' && /en[-_]gb/i.test(v.lang) ? 1 : 0) +
    (v.localService ? 0.5 : 0);
  return [...list].sort((a, b) => score(b) - score(a))[0];
}

export interface ReaderMedia {
  title: string;
  artist: string;
}

export function useSpeechReader(
  segments: ReadSegment[],
  lang: ReadLang,
  settings: ReaderSettings,
  /** Piper is used only when the listener chose it and the voice is on the device. */
  piperReady: boolean,
  media?: ReaderMedia
) {
  const [status, setStatus] = useState<ReaderStatus>('idle');
  const [index, setIndex] = useState(0);
  /** Set while the reader is silent between exercise steps: when the silence ends. */
  const [silence, setSilence] = useState<{ until: number; ms: number } | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  /** True while the Piper voice is still preparing the sentence (first use can take a few seconds). */
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    setPiperWaitingListener(setWaiting);
    return () => setPiperWaitingListener(null);
  }, []);

  const usePiper = settings.engine === 'piper' && piperReady;
  const isSupported = speechSupported() || usePiper;
  const engine: SpeechEngine = usePiper ? piperEngine : deviceEngine;

  const indexRef = useRef(0);
  const sentenceRef = useRef(0);
  const tokenRef = useRef(0);
  const waitRef = useRef<{ timer: number; resolve: () => void } | null>(null);
  const wakeRef = useRef<{ release: () => Promise<void> } | null>(null);
  const statusRef = useRef<ReaderStatus>('idle');
  const segRef = useRef(segments);
  const settingsRef = useRef(settings);
  const voicesRef = useRef(voices);
  const engineRef = useRef(engine);
  segRef.current = segments;
  settingsRef.current = settings;
  voicesRef.current = voices;
  engineRef.current = engine;

  useEffect(() => {
    if (!speechSupported()) return;
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener?.('voiceschanged', load);
    return () => synth.removeEventListener?.('voiceschanged', load);
  }, []);

  const setStatusBoth = (s: ReaderStatus) => {
    statusRef.current = s;
    setStatus(s);
  };

  /** A pause that `halt` can cut short. Resolves true if it ran to the end. */
  const wait = (ms: number) =>
    new Promise<boolean>((resolve) => {
      const timer = window.setTimeout(() => {
        waitRef.current = null;
        resolve(true);
      }, ms);
      waitRef.current = { timer, resolve: () => resolve(false) };
    });

  const keepAwake = async (on: boolean) => {
    try {
      const nav = navigator as Navigator & {
        wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> };
      };
      if (on && !wakeRef.current && nav.wakeLock && document.visibilityState === 'visible') {
        wakeRef.current = await nav.wakeLock.request('screen');
      } else if (!on && wakeRef.current) {
        await wakeRef.current.release();
        wakeRef.current = null;
      }
    } catch {
      wakeRef.current = null;
    }
  };
  /** The device voice usually stops when the screen goes off; Piper audio keeps playing. */
  const awake = (on: boolean) => keepAwake(on && engineRef.current === deviceEngine);

  const halt = () => {
    tokenRef.current += 1;
    if (waitRef.current) {
      window.clearTimeout(waitRef.current.timer);
      waitRef.current.resolve();
      waitRef.current = null;
    }
    setSilence(null);
    deviceEngine.cancel();
    piperEngine.cancel();
  };

  /** The next few sentences after the current one, for the engine to prepare. */
  const upcoming = (i: number, s: number, n: number) => {
    const out: string[] = [];
    const segs = segRef.current;
    for (let k = i; k < segs.length && out.length < n; k++) {
      const sentences = toSentences(segs[k].text);
      for (let j = k === i ? s : 0; j < sentences.length && out.length < n; j++) out.push(sentences[j]);
    }
    return out;
  };

  const run = useCallback(async (token: number) => {
    while (token === tokenRef.current) {
      const segs = segRef.current;
      const i = indexRef.current;
      if (i >= segs.length) {
        setStatusBoth('idle');
        indexRef.current = 0;
        setIndex(0);
        awake(false);
        return;
      }
      const seg = segs[i];
      const sentences = toSentences(seg.text);
      const s = sentenceRef.current;

      if (s < sentences.length) {
        const eng = engineRef.current;
        eng.prefetch?.(upcoming(i, s + 1, 3), lang);
        const cfg = settingsRef.current;
        await eng.speak(sentences[s], {
          lang,
          rate: Math.max(0.5, Math.min(1.5, cfg.rate * RATE_FACTOR[seg.kind])),
          voice: pickVoice(lang, voicesRef.current, lang === 'el' ? cfg.voiceEl : cfg.voiceEn),
        });
        if (token !== tokenRef.current) return;
        sentenceRef.current = s + 1;
        continue;
      }

      const next = segs[i + 1];
      const ms = PAUSE_AFTER[seg.kind] + (next && next.kind === 'practice' ? PAUSE_BEFORE_PRACTICE : 0);
      if (seg.kind === 'step') setSilence({ until: Date.now() + ms, ms });
      const full = await wait(ms);
      if (!full || token !== tokenRef.current) return;
      setSilence(null);
      indexRef.current = i + 1;
      sentenceRef.current = 0;
      setIndex(i + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const start = (token: number) => {
    // Some engines need a moment after cancel before they accept new speech.
    window.setTimeout(() => run(token), 60);
  };

  const playFrom = useCallback((i: number) => {
    if (!isSupported || !segRef.current.length) return;
    halt();
    engineRef.current.unlock?.();
    indexRef.current = Math.max(0, Math.min(i, segRef.current.length - 1));
    sentenceRef.current = 0;
    setIndex(indexRef.current);
    setStatusBoth('playing');
    awake(true);
    start(tokenRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported, run]);

  const pause = useCallback(() => {
    if (statusRef.current !== 'playing') return;
    halt();
    setStatusBoth('paused');
    awake(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') return;
    engineRef.current.unlock?.();
    setStatusBoth('playing');
    awake(true);
    start(tokenRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  const stop = useCallback(() => {
    halt();
    indexRef.current = 0;
    sentenceRef.current = 0;
    setIndex(0);
    setStatusBoth('idle');
    awake(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jump = useCallback((i: number) => {
    if (statusRef.current === 'playing') playFrom(i);
    else {
      halt();
      indexRef.current = Math.max(0, Math.min(i, segRef.current.length - 1));
      sentenceRef.current = 0;
      setIndex(indexRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playFrom]);

  // A changed rate, voice or engine applies at once: restart the current sentence.
  useEffect(() => {
    if (statusRef.current !== 'playing') return;
    halt();
    start(tokenRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.rate, settings.voiceEl, settings.voiceEn, usePiper]);

  // The screen lock is released when the page is hidden; take it again on return.
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible' && statusRef.current === 'playing') awake(true);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock-screen and headset controls while the Piper voice plays.
  useEffect(() => {
    const ms = typeof navigator !== 'undefined' ? navigator.mediaSession : undefined;
    if (!ms || !usePiper || status === 'idle') return;
    try {
      if (media && typeof MediaMetadata !== 'undefined') {
        ms.metadata = new MediaMetadata({ title: media.title, artist: media.artist, artwork: [{ src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }] });
      }
      ms.playbackState = status === 'playing' ? 'playing' : 'paused';
      ms.setActionHandler('play', () => resume());
      ms.setActionHandler('pause', () => pause());
      ms.setActionHandler('previoustrack', () => jump(Math.max(0, indexRef.current - 1)));
      ms.setActionHandler('nexttrack', () => jump(Math.min(segRef.current.length - 1, indexRef.current + 1)));
    } catch {
      /* some actions are not supported on every browser */
    }
    return () => {
      try {
        (['play', 'pause', 'previoustrack', 'nexttrack'] as MediaSessionAction[]).forEach((a) => ms.setActionHandler(a, null));
      } catch {
        /* ignore */
      }
    };
  }, [usePiper, status, media?.title, media?.artist, pause, resume, jump]);

  // New text (another chapter or language) or leaving the page: stop.
  useEffect(() => () => stop(), [segments, stop]);

  return {
    isSupported,
    usingPiper: usePiper,
    status,
    index,
    silence,
    waiting: waiting && status === 'playing',
    voices: voicesFor(lang, voices),
    voicesLoaded: voices.length > 0,
    playFrom,
    pause,
    resume,
    stop,
    jump,
  };
}
