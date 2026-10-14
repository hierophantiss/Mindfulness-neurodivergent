import { useCallback, useEffect, useRef, useState } from 'react';
import { toSentences, type ReadLang, type ReadSegment, type SegmentKind } from '../lib/chapterReading';

/**
 * Reads a list of segments aloud with the device's own voices (Web Speech API).
 * Nothing leaves the device. Each segment is spoken sentence by sentence;
 * pause stops the voice and resume restarts the current sentence, which works
 * the same on every browser (native pause/resume is unreliable on Android).
 */

export type ReaderStatus = 'idle' | 'playing' | 'paused';

export interface ReaderSettings {
  rate: number;
  follow: boolean;
  voiceEl?: string;
  voiceEn?: string;
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

export function useSpeechReader(segments: ReadSegment[], lang: ReadLang, settings: ReaderSettings) {
  const isSupported = speechSupported();
  const [status, setStatus] = useState<ReaderStatus>('idle');
  const [index, setIndex] = useState(0);
  /** Set while the reader is silent between exercise steps: when the silence ends. */
  const [silence, setSilence] = useState<{ until: number; ms: number } | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const indexRef = useRef(0);
  const sentenceRef = useRef(0);
  const tokenRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wakeRef = useRef<{ release: () => Promise<void> } | null>(null);
  const statusRef = useRef<ReaderStatus>('idle');
  const segRef = useRef(segments);
  const settingsRef = useRef(settings);
  const voicesRef = useRef(voices);
  segRef.current = segments;
  settingsRef.current = settings;
  voicesRef.current = voices;

  useEffect(() => {
    if (!isSupported) return;
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener?.('voiceschanged', load);
    return () => synth.removeEventListener?.('voiceschanged', load);
  }, [isSupported]);

  const setStatusBoth = (s: ReaderStatus) => {
    statusRef.current = s;
    setStatus(s);
  };

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    setSilence(null);
  };

  const later = (fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  };

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

  const halt = () => {
    tokenRef.current += 1;
    clearTimers();
    if (isSupported) window.speechSynthesis.cancel();
    utterRef.current = null;
  };

  const run = useCallback((token: number) => {
    const segs = segRef.current;
    const i = indexRef.current;
    if (token !== tokenRef.current) return;
    if (i >= segs.length) {
      setStatusBoth('idle');
      indexRef.current = 0;
      setIndex(0);
      keepAwake(false);
      return;
    }
    const seg = segs[i];
    const sentences = toSentences(seg.text);
    const s = sentenceRef.current;

    if (s >= sentences.length) {
      const ms = PAUSE_AFTER[seg.kind];
      const next = segs[i + 1];
      const extra = next && next.kind === 'practice' ? PAUSE_BEFORE_PRACTICE : 0;
      const wait = ms + extra;
      if (seg.kind === 'step') setSilence({ until: Date.now() + wait, ms: wait });
      later(() => {
        if (token !== tokenRef.current) return;
        setSilence(null);
        indexRef.current = i + 1;
        sentenceRef.current = 0;
        setIndex(i + 1);
        run(token);
      }, wait);
      return;
    }

    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(sentences[s]);
    u.lang = lang === 'el' ? 'el-GR' : 'en-GB';
    const cfg = settingsRef.current;
    const v = pickVoice(lang, voicesRef.current, lang === 'el' ? cfg.voiceEl : cfg.voiceEn);
    if (v) {
      u.voice = v;
      u.lang = v.lang;
    }
    u.rate = Math.max(0.5, Math.min(1.5, cfg.rate * RATE_FACTOR[seg.kind]));

    let done = false;
    const finish = () => {
      if (done || token !== tokenRef.current) return;
      done = true;
      sentenceRef.current = s + 1;
      run(token);
    };
    u.onend = finish;
    u.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      finish();
    };
    utterRef.current = u; // keeps the utterance alive so `onend` fires (Chrome)
    synth.speak(u);

    // Some Android voices never fire `onend`; if the voice has gone quiet, move on.
    const started = Date.now();
    const watch = () => {
      if (done || token !== tokenRef.current) return;
      if (!synth.speaking && !synth.pending && Date.now() - started > 1200) finish();
      else later(watch, 600);
    };
    later(watch, 1500);
  }, [lang]);

  const playFrom = useCallback((i: number) => {
    if (!isSupported || !segRef.current.length) return;
    halt();
    indexRef.current = Math.max(0, Math.min(i, segRef.current.length - 1));
    sentenceRef.current = 0;
    setIndex(indexRef.current);
    setStatusBoth('playing');
    keepAwake(true);
    const token = tokenRef.current;
    // Cancel needs a moment on some engines before a new utterance is accepted.
    later(() => run(token), 60);
  }, [isSupported, run]);

  const pause = useCallback(() => {
    if (statusRef.current !== 'playing') return;
    halt();
    setStatusBoth('paused');
    keepAwake(false);
  }, []);

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') return;
    setStatusBoth('playing');
    keepAwake(true);
    const token = tokenRef.current;
    later(() => run(token), 60);
  }, [run]);

  const stop = useCallback(() => {
    halt();
    indexRef.current = 0;
    sentenceRef.current = 0;
    setIndex(0);
    setStatusBoth('idle');
    keepAwake(false);
  }, []);

  const jump = useCallback((i: number) => {
    if (statusRef.current === 'playing') playFrom(i);
    else {
      halt();
      indexRef.current = Math.max(0, Math.min(i, segRef.current.length - 1));
      sentenceRef.current = 0;
      setIndex(indexRef.current);
    }
  }, [playFrom]);

  // A changed rate or voice applies from the next sentence; restart the current one.
  useEffect(() => {
    if (statusRef.current !== 'playing') return;
    halt();
    const token = tokenRef.current;
    later(() => run(token), 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.rate, settings.voiceEl, settings.voiceEn]);

  // The screen lock is released when the page is hidden; take it again on return.
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible' && statusRef.current === 'playing') keepAwake(true);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // New text (another chapter or language) or leaving the page: stop.
  useEffect(() => () => stop(), [segments, stop]);

  return {
    isSupported,
    status,
    index,
    silence,
    voices: voicesFor(lang, voices),
    voicesLoaded: voices.length > 0,
    playFrom,
    pause,
    resume,
    stop,
    jump,
  };
}
