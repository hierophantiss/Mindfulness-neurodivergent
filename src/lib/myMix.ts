import type { AmbientLayer } from '../contexts/AudioContext';

// "My mix" in the Sanctuary: up to three of the nature sounds together, each
// at its own level. Kept only on this device.

export type MixPart = { layer: AmbientLayer; level: number };

export const MIX_ID = 'my-mix';
/** Three at most: enough to make a place of sound, few enough to stay calm (and light on an old phone). */
export const MIX_MAX = 3;
/** The sounds that can go in a mix (the breathing wave is a guide, not a sound to mix). */
export const MIXABLE: AmbientLayer[] = ['rain', 'storm', 'ocean', 'stream', 'wind', 'fire', 'crickets', 'purr', 'brown', 'pink'];

const KEY = 'sanctuary-my-mix';

export function readMix(): MixPart[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(v)) return [];
    return v
      .filter((p): p is MixPart => !!p && MIXABLE.includes(p.layer) && typeof p.level === 'number')
      .slice(0, MIX_MAX)
      .map(p => ({ layer: p.layer, level: Math.max(0, Math.min(1, p.level)) }));
  } catch {
    return [];
  }
}

export function saveMix(mix: MixPart[]) {
  try {
    if (mix.length) localStorage.setItem(KEY, JSON.stringify(mix));
    else localStorage.removeItem(KEY);
  } catch { /* not stored: it still plays */ }
}
