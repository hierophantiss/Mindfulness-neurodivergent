import { useCallback, useEffect, useRef, useState } from 'react';
import { toSentences, type ReadLang, type ReadSegment, type SegmentKind } from '../lib/chapterReading';
import { piperEngine, setPiperWaitingListener } from '../lib/speechEngines';
import { PiperError } from '../lib/piper/client';

/**
 * Reads a list of segments aloud, sentence by sentence, with the Piper voice
 * downloaded once to the device. Nothing leaves the device. Pause stops the
 * voice; resume restarts the current sentence. If the voice fails, the reader
 * pauses on that sentence and reports a short code, so it can be resumed.
 */

export type ReaderStatus = 'idle' | 'playing' | 'paused';

export interface ReaderSettings {
  rate: number;
  follow: boolean;
}

const SETTINGS_KEY = 'n_mindfulness_reader_settings';
const DEFAULT_SETTINGS: ReaderSettings = { rate: 0.9, follow: true };

export function loadReaderSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    return {
      rate: typeof saved.rate === 'number' ? saved.rate : DEFAULT_SETTINGS.rate,
      follow: typeof saved.follow === 'boolean' ? saved.follow : DEFAULT_SETTINGS.follow,
    };
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

export interface ReaderMedia {
  title: string;
  artist: string;
}

export function useSpeechReader(
  segments: ReadSegment[],
  lang: ReadLang,
  settings: ReaderSettings,
  /** The voice is on the device; reading can only start then. */
  ready: boolean,
  media?: ReaderMedia
) {
  const [status, setStatus] = useState<ReaderStatus>('idle');
  const [index, setIndex] = useState(0);
  /** Set while the reader is silent between exercise steps: when the silence ends. */
  const [silence, setSilence] = useState<{ until: number; ms: number } | null>(null);
  /** True while the voice is still preparing the sentence (first use can take a few seconds). */
  const [waiting, setWaiting] = useState(false);
  /** Short code of the last failure, shown with a "try again"; cleared when reading resumes. */
  const [errorCode, setErrorCode] = useState<number | null>(null);

  useEffect(() => {
    setPiperWaitingListener(setWaiting);
    return () => setPiperWaitingListener(null);
  }, []);

  const indexRef = useRef(0);
  const sentenceRef = useRef(0);
  const tokenRef = useRef(0);
  const waitRef = useRef<{ timer: number; resolve: () => void } | null>(null);
  const statusRef = useRef<ReaderStatus>('idle');
  const segRef = useRef(segments);
  const settingsRef = useRef(settings);
  const readyRef = useRef(ready);
  segRef.current = segments;
  settingsRef.current = settings;
  readyRef.current = ready;

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

  const halt = () => {
    tokenRef.current += 1;
    if (waitRef.current) {
      window.clearTimeout(waitRef.current.timer);
      waitRef.current.resolve();
      waitRef.current = null;
    }
    setSilence(null);
    piperEngine.cancel();
  };

  /** The next few sentences after the current one, for the voice to prepare. */
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
        return;
      }
      const seg = segs[i];
      const sentences = toSentences(seg.text);
      const s = sentenceRef.current;

      if (s < sentences.length) {
        piperEngine.prefetch(upcoming(i, s + 1, 3), lang);
        try {
          await piperEngine.speak(sentences[s], {
            lang,
            rate: Math.max(0.5, Math.min(1.5, settingsRef.current.rate * RATE_FACTOR[seg.kind])),
          });
        } catch (e) {
          if (token !== tokenRef.current) return;
          // Stay on this sentence: "try again" resumes exactly here.
          halt();
          setStatusBoth('paused');
          setErrorCode(e instanceof PiperError ? e.stage : 0);
          return;
        }
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
    window.setTimeout(() => run(token), 30);
  };

  const playFrom = useCallback((i: number) => {
    // Read through a ref: a start queued during the download runs after `ready` turns true.
    if (!readyRef.current || !segRef.current.length) return;
    halt();
    piperEngine.unlock();
    setErrorCode(null);
    indexRef.current = Math.max(0, Math.min(i, segRef.current.length - 1));
    sentenceRef.current = 0;
    setIndex(indexRef.current);
    setStatusBoth('playing');
    start(tokenRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  const pause = useCallback(() => {
    if (statusRef.current !== 'playing') return;
    halt();
    setStatusBoth('paused');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') return;
    piperEngine.unlock();
    setErrorCode(null);
    setStatusBoth('playing');
    start(tokenRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  const stop = useCallback(() => {
    halt();
    indexRef.current = 0;
    sentenceRef.current = 0;
    setIndex(0);
    setErrorCode(null);
    setStatusBoth('idle');
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

  // A changed speed applies at once: restart the current sentence.
  useEffect(() => {
    if (statusRef.current !== 'playing') return;
    halt();
    start(tokenRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.rate]);

  // The voice was removed while reading: stop.
  useEffect(() => {
    if (!ready && statusRef.current !== 'idle') stop();
  }, [ready, stop]);

  // Lock-screen and headset controls.
  useEffect(() => {
    const ms = typeof navigator !== 'undefined' ? navigator.mediaSession : undefined;
    if (!ms || status === 'idle') return;
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
  }, [status, media?.title, media?.artist, pause, resume, jump]);

  // New text (another chapter or language) or leaving the page: stop.
  useEffect(() => () => stop(), [segments, stop]);

  return {
    status,
    index,
    silence,
    waiting: waiting && status === 'playing',
    errorCode,
    playFrom,
    pause,
    resume,
    stop,
    jump,
  };
}
