// Standalone types — no React, no browser APIs

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
}
