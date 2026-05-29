// Standalone types — no React, no browser APIs
export interface PhaseDef {
  dur: number;
  label?: string;
  [key: string]: any;
}

export interface PhaseLabel {
  text: string;
  [key: string]: any;
}

export interface AudioConfig {
  baseFreq?: number;
  beatFreq?: number;
  volume?: number;
  [key: string]: any;
}
