import type { ComponentType } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { MIXABLE, MIX_MAX, type MixPart } from '../lib/myMix';
import type { AmbientLayer } from '../contexts/AudioContext';

type Text = { el: string; en: string };
export type MixSound = { layer: AmbientLayer; label: Text; icon: ComponentType<{ size?: number; strokeWidth?: number }> };

// The editor of "My mix": each sound a row; chosen ones show their level.
// Changes are heard at once (the Sanctuary plays the mix as it changes).
export default function MyMixEditor({ lang, mix, sounds, onToggle, onLevel, onDone }: {
  lang: 'el' | 'en';
  mix: MixPart[];
  sounds: MixSound[];
  onToggle: (layer: AmbientLayer) => void;
  onLevel: (layer: AmbientLayer, level: number) => void;
  onDone: () => void;
}) {
  const el = lang === 'el';
  const full = mix.length >= MIX_MAX;
  const rows = MIXABLE.map(layer => sounds.find(s => s.layer === layer)).filter((s): s is MixSound => !!s);
  return (
    <div className="flex flex-col gap-3 p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/[0.1]">
      <p className="text-[13px] leading-relaxed text-ink/75" aria-live="polite">
        {mix.length === 0
          ? (el ? `Διάλεξε έως ${MIX_MAX} ήχους. Ακούς τη μίξη όσο τη φτιάχνεις.` : `Choose up to ${MIX_MAX} sounds. You hear the mix as you make it.`)
          : full
            ? (el ? `Έχεις ${MIX_MAX} ήχους, όσους χωράει μια μίξη. Βγάλε έναν για να βάλεις άλλον.` : `You have ${MIX_MAX} sounds, as many as a mix holds. Take one out to add another.`)
            : (el ? `${mix.length} από ${MIX_MAX}. Η ένταση του καθενός είναι κάτω από το όνομά του.` : `${mix.length} of ${MIX_MAX}. Each one's level is under its name.`)}
      </p>
      <ul className="flex flex-col gap-1.5">
        {rows.map(s => {
          const part = mix.find(p => p.layer === s.layer);
          const on = !!part;
          const blocked = !on && full;
          const name = el ? s.label.el : s.label.en;
          return (
            <li key={s.layer} className={cn('rounded-2xl border transition-colors', on ? 'bg-teal-500/[0.08] border-teal-500/30' : 'border-white/[0.06]')}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                aria-disabled={blocked}
                onClick={() => { if (!blocked) onToggle(s.layer); }}
                className={cn('w-full min-h-[52px] flex items-center gap-3 px-3.5 text-left', blocked && 'opacity-50 cursor-not-allowed')}
              >
                <span className={cn('w-9 h-9 shrink-0 rounded-xl flex items-center justify-center', on ? 'bg-teal-500/20 text-teal-300' : 'bg-white/[0.05] text-ink/70')}>
                  <s.icon size={19} strokeWidth={1.6} />
                </span>
                <span className="flex-1 min-w-0 text-[15px] text-ink/90">{name}</span>
                <span aria-hidden="true" className={cn('w-6 h-6 shrink-0 rounded-full border flex items-center justify-center', on ? 'bg-teal-400/80 border-transparent text-[var(--color-bg)]' : 'border-white/25')}>
                  {on && <Check size={14} strokeWidth={2.5} />}
                </span>
              </button>
              {on && (
                <div className="px-3.5 pb-3 -mt-0.5 flex items-center gap-3">
                  <span className="text-[12px] text-ink/70 w-14 shrink-0">{el ? 'Ένταση' : 'Level'}</span>
                  <input
                    type="range" min="0.05" max="1" step="0.01"
                    value={part!.level}
                    onChange={e => onLevel(s.layer, parseFloat(e.target.value))}
                    aria-label={(el ? 'Ένταση: ' : 'Level: ') + name}
                    className="flex-1 accent-teal-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={onDone} className="btn-soft self-start">
        {el ? 'Έτοιμο' : 'Done'}
      </button>
    </div>
  );
}
