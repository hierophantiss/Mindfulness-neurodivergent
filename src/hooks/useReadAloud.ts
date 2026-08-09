import { useCallback, useEffect, useRef, useState } from 'react';

type Lang = 'el' | 'en';

/**
 * Read-aloud via the browser's built-in Web Speech API (speechSynthesis).
 * No backend, no network, no data leaves the device — uses the OS voices.
 * Long text is split into short chunks and spoken sequentially, which avoids
 * the well-known Chrome cutoff on long utterances.
 */
export function useReadAloud() {
  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const chunksRef = useRef<string[]>([]);
  const idxRef = useRef(0);
  const langRef = useRef<Lang>('el');

  const pickVoice = (lang: Lang): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find((v) => v.lang.toLowerCase().startsWith(lang)) || null;
  };

  const speakNext = useCallback(() => {
    if (!isSupported) return;
    const synth = window.speechSynthesis;
    if (idxRef.current >= chunksRef.current.length) {
      setIsReading(false);
      setIsPaused(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(chunksRef.current[idxRef.current]);
    const lang = langRef.current;
    u.lang = lang === 'el' ? 'el-GR' : 'en-US';
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.rate = 0.95;
    u.onend = () => {
      idxRef.current += 1;
      speakNext();
    };
    u.onerror = () => {
      idxRef.current += 1;
      speakNext();
    };
    synth.speak(u);
  }, [isSupported]);

  const speak = useCallback(
    (raw: string, lang: Lang) => {
      if (!isSupported) return;
      const synth = window.speechSynthesis;
      synth.cancel();

      // Split into sentence-sized chunks (handles Greek · and ; too), cap length.
      const sentences = (raw || '')
        .replace(/\s+/g, ' ')
        .trim()
        .match(/[^.!?·;]+[.!?·;]*/g) || [];
      const chunks: string[] = [];
      let buf = '';
      for (const s of sentences) {
        if ((buf + s).length > 180) {
          if (buf.trim()) chunks.push(buf.trim());
          buf = s;
        } else {
          buf += s;
        }
      }
      if (buf.trim()) chunks.push(buf.trim());
      if (!chunks.length) return;

      chunksRef.current = chunks;
      idxRef.current = 0;
      langRef.current = lang;
      setIsReading(true);
      setIsPaused(false);

      // Voices can load asynchronously on first use.
      if (synth.getVoices().length === 0) {
        const start = () => {
          window.speechSynthesis.onvoiceschanged = null;
          speakNext();
        };
        window.speechSynthesis.onvoiceschanged = start;
        window.setTimeout(() => {
          if (idxRef.current === 0 && !synth.speaking) speakNext();
        }, 300);
      } else {
        speakNext();
      }
    },
    [isSupported, speakNext]
  );

  const pause = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    chunksRef.current = [];
    idxRef.current = 0;
    setIsReading(false);
    setIsPaused(false);
  }, [isSupported]);

  // Clean up on unmount.
  useEffect(
    () => () => {
      if (isSupported) window.speechSynthesis.cancel();
    },
    [isSupported]
  );

  return { isSupported, isReading, isPaused, speak, pause, resume, stop };
}
