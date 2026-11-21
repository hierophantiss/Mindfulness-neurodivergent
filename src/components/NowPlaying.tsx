import { Link, useLocation } from 'react-router-dom';
import { AudioLines, Square } from 'lucide-react';
import { useAudioMixer } from '../contexts/AudioContext';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';
import { useFrameInBand } from '../lib/frameInBand';
import { cn } from '../lib/utils';

// A sound from the Sanctuary (or a chapter's sound under the reading) goes on
// while you move around the app. This small control says what is playing and
// stops it from wherever you are; its name opens the Sanctuary. It is not
// shown in the Sanctuary itself (which has its own controls), and never for a
// practice's own sound (the practice has its «Ήχος»).
//
// On a phone it floats at the bottom left, just above the bottom bar (the cat
// and its sentence are on the right); while a chapter's animation has its own
// buttons down there, it steps aside, as the "Listen" button does. On a
// computer it sits in the side bar, above SOS.

export const isSanctuaryPath = (pathname: string) => /^\/sanctuary\/?$/.test(pathname);

export default function NowPlaying({ place }: { place: 'float' | 'side' }) {
  const { nowPlaying, stopAudio } = useAudioMixer();
  const { language } = useLanguage();
  const { reduceMotion } = useAccessibility();
  const { pathname } = useLocation();
  const aside = useFrameInBand();
  if (!nowPlaying || isSanctuaryPath(pathname)) return null;

  const el = language === 'el';
  const name = el ? nowPlaying.name.el : nowPlaying.name.en;
  const regionLabel = el ? 'Ήχος που παίζει' : 'Sound playing';
  const stopLabel = el ? 'Σταμάτα τον ήχο' : 'Stop the sound';

  // The link's name: what it shows, then where it goes.
  const openLabel = el ? `${name}: άνοιξε το Καταφύγιο` : `${name}: open the Sanctuary`;
  const nameWithWhere = <span className="truncate">{name}</span>;

  if (place === 'side') {
    return (
      <div role="group" aria-label={regionLabel} data-testid="now-playing" className="mb-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
        <p className="px-3 pt-2.5 text-[11.5px] leading-none text-ink/65">{el ? 'Παίζει τώρα' : 'Now playing'}</p>
        <div className="flex items-stretch">
          <Link
            to="/sanctuary"
            aria-label={openLabel}
            className="flex-1 min-w-0 flex items-center gap-2.5 min-h-[44px] pl-3 pr-2 rounded-bl-2xl text-[14px] text-ink/90 hover:text-ink transition-colors"
          >
            <AudioLines size={17} strokeWidth={1.7} aria-hidden="true" className="shrink-0 text-teal-300" />
            {nameWithWhere}
          </Link>
          <button
            type="button"
            onClick={stopAudio}
            aria-label={stopLabel}
            title={stopLabel}
            className="shrink-0 w-11 min-h-[44px] flex items-center justify-center rounded-br-2xl text-ink/75 hover:text-ink hover:bg-white/[0.05] transition-colors"
          >
            <Square size={13} fill="currentColor" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  // In a chapter there is no bottom bar on a phone: the control sits above the
  // chapter's own "Listen" bar instead.
  const reading = /^\/chapters\/\d+/.test(pathname);
  return (
    <div
      role="group"
      aria-label={regionLabel}
      data-testid="now-playing"
      inert={aside}
      className={cn(
        'fixed left-4 z-30 desk:hidden flex items-stretch h-12 max-w-[calc(100vw-120px)] rounded-full bg-[var(--color-surface)]/95 backdrop-blur-xl border border-teal-500/25 shadow-[0_8px_28px_rgb(0_0_0/0.35)]',
        reading ? 'bottom-[calc(96px+env(safe-area-inset-bottom))]' : 'bottom-[calc(78px+env(safe-area-inset-bottom))]',
        reduceMotion ? 'transition-none' : 'transition-opacity duration-300',
        aside && 'opacity-0 pointer-events-none',
      )}
    >
      <Link
        to="/sanctuary"
        aria-label={openLabel}
        className="min-w-0 flex items-center gap-2 pl-4 pr-3 rounded-l-full text-[13.5px] text-teal-100/90 hover:text-teal-50 transition-colors"
      >
        <AudioLines size={16} aria-hidden="true" className="shrink-0 text-teal-300" />
        {nameWithWhere}
      </Link>
      <button
        type="button"
        onClick={stopAudio}
        aria-label={stopLabel}
        title={stopLabel}
        className="shrink-0 w-12 flex items-center justify-center rounded-r-full border-l border-white/[0.08] text-ink/80 hover:text-ink hover:bg-white/[0.05] transition-colors"
      >
        <Square size={13} fill="currentColor" aria-hidden="true" />
      </button>
    </div>
  );
}
