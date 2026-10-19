import { useCallback, useEffect, useRef, useState } from 'react';
import { BASE_RATE, type ReadLang, type ReadSegment } from '../lib/chapterReading';
import {
  audioUrl,
  forgetOldVoice,
  getAudio,
  keepOnDevice,
  loadTiming,
  localAudio,
  type ChapterTiming,
} from '../lib/chapterAudio';

/**
 * Reads a chapter aloud with its recorded audio (Sulafat) and a timing map:
 * the segment being heard is highlighted, the page follows it, and the silence
 * after an exercise step is shown. One <audio> element plays the whole chapter,
 * so it keeps going with the screen off and answers the lock-screen controls.
 *
 * Error codes shown to the listener: 1 = offline and the chapter is not yet on
 * the device; 2 = playback failed; 3 = playback was not allowed (tap play
 * again); 4 = this chapter has no audio yet.
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

export interface ReaderMedia {
  title: string;
  artist: string;
}

interface Span {
  t0: number;
  e: number;
}

/** Start and end of speech for each segment, in the order of `segments` (null: not in the audio). */
function align(segments: ReadSegment[], timing: ChapterTiming): (Span | null)[] {
  const byKey = new Map(timing.segments.map((s) => [s.key, s]));
  return segments.map((s) => {
    const t = byKey.get(s.key);
    return t ? { t0: t.t0, e: t.e } : null;
  });
}

export function useSpeechReader(
  segments: ReadSegment[],
  lang: ReadLang,
  settings: ReaderSettings,
  /** The chapter whose audio to play; null while there is none. */
  chapterNum: number | null,
  media?: ReaderMedia
) {
  const [status, setStatus] = useState<ReaderStatus>('idle');
  const [index, setIndex] = useState(0);
  /** Set while the reader is silent after an exercise step: when the silence ends. */
  const [silence, setSilence] = useState<{ until: number; ms: number } | null>(null);
  /** True while the audio is loading. */
  const [waiting, setWaiting] = useState(false);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [errorDetail, setErrorDetail] = useState('');

  const statusRef = useRef<ReaderStatus>('idle');
  const indexRef = useRef(0);
  const segRef = useRef(segments);
  const spansRef = useRef<(Span | null)[]>([]);
  const timingRef = useRef<ChapterTiming | null>(null);
  const srcRef = useRef<string>('');
  const localRef = useRef<string | null>(null);
  const pendingSeek = useRef<number | null>(null);
  const silenceFor = useRef(-1);
  const settingsRef = useRef(settings);
  segRef.current = segments;
  settingsRef.current = settings;

  const setStatusBoth = (s: ReaderStatus) => {
    statusRef.current = s;
    setStatus(s);
  };
  const setIndexBoth = (i: number) => {
    indexRef.current = i;
    setIndex(i);
  };

  const rate = () => Math.max(0.5, Math.min(2, settingsRef.current.rate / BASE_RATE));

  // Load the timing map (and the copy on the device, if any) when the chapter opens.
  useEffect(() => {
    forgetOldVoice();
    timingRef.current = null;
    spansRef.current = [];
    if (localRef.current) URL.revokeObjectURL(localRef.current);
    localRef.current = null;
    if (chapterNum == null) return;
    let alive = true;
    loadTiming(lang, chapterNum).then((t) => {
      if (!alive || !t) return;
      timingRef.current = t;
      spansRef.current = align(segRef.current, t);
    });
    localAudio(lang, chapterNum).then((u) => {
      if (alive) localRef.current = u;
      else if (u) URL.revokeObjectURL(u);
    });
    return () => {
      alive = false;
    };
  }, [lang, chapterNum]);

  useEffect(() => {
    if (timingRef.current) spansRef.current = align(segments, timingRef.current);
  }, [segments]);

  const failureCode = () =>
    typeof navigator !== 'undefined' && navigator.onLine === false ? 1 : timingRef.current ? 2 : 4;

  /** The segment playing at time t (the last one that has started). */
  const segmentAt = (t: number) => {
    const spans = spansRef.current;
    let found = -1;
    for (let i = 0; i < spans.length; i++) {
      const sp = spans[i];
      if (sp && sp.t0 <= t + 0.05) found = i;
    }
    return found;
  };

  const nextStart = (i: number) => {
    const spans = spansRef.current;
    for (let k = i + 1; k < spans.length; k++) if (spans[k]) return spans[k]!.t0;
    return timingRef.current?.duration ?? 0;
  };

  const seekTo = (i: number) => {
    const sp = spansRef.current[i];
    const el = getAudio();
    const t = sp ? sp.t0 : 0;
    if (el.readyState >= 1) el.currentTime = t;
    else pendingSeek.current = t;
  };

  // Follow the audio: highlight, silences, end.
  useEffect(() => {
    const el = getAudio();
    const onTime = () => {
      if (statusRef.current === 'idle' || el.src !== srcRef.current) return;
      const t = el.currentTime;
      const i = segmentAt(t);
      if (i >= 0 && i !== indexRef.current) {
        setIndexBoth(i);
        setSilence(null);
      }
      const cur = i >= 0 ? i : indexRef.current;
      const sp = spansRef.current[cur];
      const seg = segRef.current[cur];
      if (sp && seg?.kind === 'step' && t >= sp.e && silenceFor.current !== cur && statusRef.current === 'playing') {
        silenceFor.current = cur;
        const ms = Math.max(0, ((nextStart(cur) - t) / rate()) * 1000);
        setSilence({ until: Date.now() + ms, ms });
      }
    };
    const onMeta = () => {
      if (pendingSeek.current != null) {
        el.currentTime = pendingSeek.current;
        pendingSeek.current = null;
      }
    };
    const onWaiting = () => statusRef.current === 'playing' && setWaiting(true);
    const onPlaying = () => setWaiting(false);
    const onEnded = () => {
      if (el.src !== srcRef.current) return;
      setSilence(null);
      setIndexBoth(Math.max(0, segRef.current.length - 1));
      setStatusBoth('idle');
    };
    const onError = () => {
      if (statusRef.current === 'idle' || el.src !== srcRef.current) return;
      setWaiting(false);
      setStatusBoth('paused');
      setErrorCode(failureCode());
      setErrorDetail(`${el.error?.code ?? ''} ${el.error?.message ?? ''}`.trim());
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('waiting', onWaiting);
    el.addEventListener('playing', onPlaying);
    el.addEventListener('ended', onEnded);
    el.addEventListener('error', onError);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('waiting', onWaiting);
      el.removeEventListener('playing', onPlaying);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('error', onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Starts playback inside the listener's tap (needed on iPhone), then finds the place. */
  const startAt = (i: number) => {
    if (chapterNum == null) return;
    const el = getAudio();
    const local = localRef.current;
    const want = local || new URL(audioUrl(lang, chapterNum), window.location.href).href;
    // Keep the source if this chapter is already loaded (from the network or the device).
    const loaded = srcRef.current !== '' && el.src === srcRef.current && !el.error;
    if (!loaded) {
      el.src = want;
      srcRef.current = el.src;
    }
    el.defaultPlaybackRate = rate();
    el.playbackRate = rate();
    silenceFor.current = -1;
    setSilence(null);
    seekTo(i);
    el.play()
      .then(() => {
        if (!localRef.current) keepOnDevice(lang, chapterNum);
        // The map may have arrived after the tap: put the audio in its place now.
        if (!spansRef.current.length) {
          loadTiming(lang, chapterNum).then((t) => {
            if (!t) return;
            timingRef.current = t;
            spansRef.current = align(segRef.current, t);
            if (indexRef.current > 0) seekTo(indexRef.current);
          });
        }
      })
      .catch((e: DOMException) => {
        setWaiting(false);
        setStatusBoth('paused');
        setErrorCode(e?.name === 'NotAllowedError' ? 3 : failureCode());
        setErrorDetail(String(e?.name || e));
      });
  };

  const playFrom = useCallback((i: number) => {
    if (!segRef.current.length || chapterNum == null) return;
    const k = Math.max(0, Math.min(i, segRef.current.length - 1));
    setErrorCode(null);
    setIndexBoth(k);
    setStatusBoth('playing');
    startAt(k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, chapterNum]);

  const pause = useCallback(() => {
    if (statusRef.current !== 'playing') return;
    getAudio().pause();
    setSilence(null);
    setWaiting(false);
    setStatusBoth('paused');
  }, []);

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') return;
    setErrorCode(null);
    setStatusBoth('playing');
    const el = getAudio();
    if (el.src && el.src === srcRef.current && !el.error) {
      el.playbackRate = rate();
      el.play().catch(() => startAt(indexRef.current));
    } else startAt(indexRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, chapterNum]);

  const stop = useCallback(() => {
    const el = getAudio();
    el.pause();
    setSilence(null);
    setWaiting(false);
    setErrorCode(null);
    setIndexBoth(0);
    setStatusBoth('idle');
  }, []);

  const jump = useCallback((i: number) => {
    const k = Math.max(0, Math.min(i, segRef.current.length - 1));
    if (statusRef.current === 'playing') {
      setIndexBoth(k);
      silenceFor.current = -1;
      setSilence(null);
      seekTo(k);
    } else {
      setIndexBoth(k);
      if (getAudio().src === srcRef.current) seekTo(k);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A changed speed applies at once.
  useEffect(() => {
    const el = getAudio();
    el.defaultPlaybackRate = rate();
    el.playbackRate = rate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.rate]);

  // Lock-screen and headset controls.
  useEffect(() => {
    const ms = typeof navigator !== 'undefined' ? navigator.mediaSession : undefined;
    if (!ms || status === 'idle') return;
    try {
      if (media && typeof MediaMetadata !== 'undefined') {
        ms.metadata = new MediaMetadata({ title: media.title, artist: media.artist, artwork: [{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }] });
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

  // Another chapter or language, or leaving the page: stop.
  useEffect(() => () => stop(), [segments, stop]);

  return {
    status,
    index,
    silence,
    waiting: waiting && status === 'playing',
    errorCode,
    errorDetail,
    playFrom,
    pause,
    resume,
    stop,
    jump,
  };
}
