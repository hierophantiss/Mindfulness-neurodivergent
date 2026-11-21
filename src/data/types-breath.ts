// Standalone types — no React, no browser APIs

/** The breath wave in the background sounds: 5 s rising (in), 5 s falling (out). */
export const BREATH_WAVE_SECONDS = 10;

/** Text in both languages. */
export interface Bilingual { el: string; en: string }

/** One phase of a breath: how long, and where the arms (0 down … 1 up) go. */
export interface PhaseDef {
  dur: number;
  armFrom: number;
  armTo: number;
  /** A few movements also bend the elbows, turn the head or the waist. */
  elbowFrom?: number;
  elbowTo?: number;
  headFrom?: number;
  headTo?: number;
  waistFrom?: number;
  waistTo?: number;
}

/** What a phase is called, and the short hint under it. */
export interface PhaseLabel {
  text?: string;
  label: Bilingual;
  sub: Bilingual;
}

export type AmbientLayer = 'rain' | 'ocean' | 'wind' | 'brown' | 'pink' | 'green' | 'breath' | 'fire' | 'stream' | 'crickets' | 'storm' | 'purr';

/**
 * A background sound that goes on while you move around the app: a sound or
 * "My mix" from the Sanctuary, or a chapter's sound under the reading. The
 * "now playing" control (components/NowPlaying.tsx) names it and stops it.
 * A practice's own sound has none: it is part of the practice.
 */
export interface NowPlaying {
  source: 'sanctuary' | 'chapter';
  name: Bilingual;
  /** The Sanctuary's track, so the Sanctuary shows it again when reopened. */
  trackId?: string;
}

/** The sound of a practice (contexts/AudioContext.tsx plays it). */
export interface AudioConfig {
  base: number;
  beat: number;
  pulse?: number;
  carrierType?: 'sine' | 'triangle' | 'square' | 'sawtooth';
  pulseType?: 'sine';
  disableSynth?: boolean;
  ambientLayers?: AmbientLayer[];
  /** Each layer's own level, 0–1 (1 when not given): "My mix" in the Sanctuary. */
  layerLevels?: Partial<Record<AmbientLayer, number>>;
  id?: string;
  /** Set only for a background sound (see NowPlaying). */
  nowPlaying?: NowPlaying;
}
