import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReadAloud } from '../hooks/useReadAloud';
import { useLanguage } from '../hooks/useLanguage';

/**
 * Grabs the readable prose of the current page from #main-content,
 * stripping navigation, buttons and anything marked data-no-read / aria-hidden.
 * Add data-no-read to any element you never want spoken.
 */
function getReadableText(): string {
  const el = document.getElementById('main-content');
  if (!el) return '';
  const clone = el.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll(
      'nav, button, script, style, svg, [aria-hidden="true"], [data-no-read]'
    )
    .forEach((n) => n.remove());
  return (clone.innerText || '').replace(/\s+/g, ' ').trim();
}

/**
 * Global press-to-listen control. Rendered once in Layout, available on every page.
 * Uses the device's built-in voices (Web Speech API) — private, offline, free.
 */
export default function ReadAloudButton() {
  const { isSupported, isReading, isPaused, speak, pause, resume, stop } =
    useReadAloud();
  const { language } = useLanguage();
  const location = useLocation();

  // Stop reading whenever the user navigates to a new page.
  useEffect(() => {
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (!isSupported) return null;

  const listen = language === 'el' ? 'Ακρόαση' : 'Listen';
  const pauseL = language === 'el' ? 'Παύση' : 'Pause';
  const resumeL = language === 'el' ? 'Συνέχεια' : 'Resume';
  const stopL = language === 'el' ? 'Διακοπή' : 'Stop';
  const label = !isReading ? listen : isPaused ? resumeL : pauseL;

  const handleMain = () => {
    if (!isReading) {
      const text = getReadableText();
      if (text) speak(text, language);
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  return (
    <div
      data-no-read
      className="fixed left-4 z-40 flex items-center gap-2 bottom-[calc(110px+env(safe-area-inset-bottom))] lg:bottom-6"
    >
      {isReading && (
        <button
          type="button"
          onClick={stop}
          aria-label={stopL}
          className="h-11 w-11 rounded-full bg-pine-800/80 backdrop-blur text-pine-100 shadow-lg flex items-center justify-center hover:bg-pine-700 transition-colors"
        >
          <span aria-hidden="true">■</span>
        </button>
      )}
      <button
        type="button"
        onClick={handleMain}
        aria-label={label}
        aria-pressed={isReading}
        className="h-14 px-5 rounded-full bg-emerald-600/90 backdrop-blur text-white shadow-lg flex items-center gap-2 hover:bg-emerald-500 transition-colors"
      >
        <span aria-hidden="true" className="text-lg">
          {!isReading ? '🔊' : isPaused ? '▶' : '⏸'}
        </span>
        <span className="text-sm font-medium">{label}</span>
      </button>
    </div>
  );
}
