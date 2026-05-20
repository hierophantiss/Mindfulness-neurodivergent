/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class ZenAudioEngine {
  private ctx: AudioContext | null = null;
  private primaryOsc: OscillatorNode | null = null;
  private secondaryOsc: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private baseFreq = 136.1; // Earth / Ohm Frequency (very grounding)
  private volume = 0.4;

  constructor() {
    // Lazy loaded after user interaction
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser", e);
    }
  }

  public start() {
    this.init();
    if (!this.ctx) return;
    if (this.isPlaying) return;

    // Resume context if suspended (browser autoplay policy)
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(console.warn);
    }

    const t = this.ctx.currentTime;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, t);
    // Smooth fade in
    this.masterGain.gain.linearRampToValueAtTime(this.volume, t + 1.5);

    // Warm Low Pass Filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(220, t);
    this.filter.Q.setValueAtTime(2.0, t);

    // Primary grounding frequency (Solfeggio or Ohm)
    this.primaryOsc = this.ctx.createOscillator();
    this.primaryOsc.type = "triangle"; // richer tone for audibility
    this.primaryOsc.frequency.setValueAtTime(this.baseFreq, t);

    // Secondary oscillator for Theta binaural beat gap (4.5Hz)
    this.secondaryOsc = this.ctx.createOscillator();
    this.secondaryOsc.type = "triangle"; // richer tone for audibility
    this.secondaryOsc.frequency.setValueAtTime(this.baseFreq + 4.5, t);

    // Dynamic low-frequency modulation (for standard ocean wave swell feeling)
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = "sine";
    this.lfo.frequency.setValueAtTime(0.12, t); // Very slow swell

    this.lfoGain = this.ctx.createGain();
    this.lfoGain.gain.setValueAtTime(50, t); //Modulate filter by 50Hz

    // Wire up LFO
    this.lfo.connect(this.lfoGain);
    if (this.filter && this.filter.frequency) {
      this.lfoGain.connect(this.filter.frequency);
    }

    // Connect audio node chain
    this.primaryOsc.connect(this.filter);
    this.secondaryOsc.connect(this.filter);
    this.filter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Start oscillators
    this.primaryOsc.start(t);
    this.secondaryOsc.start(t);
    this.lfo.start(t);

    this.isPlaying = true;
  }

  public stop() {
    if (!this.ctx || !this.isPlaying) return;

    const t = this.ctx.currentTime;
    if (this.masterGain) {
      // Smooth fade-out before stopping to prevent clicking
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
      this.masterGain.gain.linearRampToValueAtTime(0, t + 0.8);
    }

    const prim = this.primaryOsc;
    const sec = this.secondaryOsc;
    const lf = this.lfo;

    setTimeout(() => {
      try {
        if (prim) prim.stop();
        if (sec) sec.stop();
        if (lf) lf.stop();
      } catch (err) {
        // Safe check
      }
    }, 900);

    this.isPlaying = false;
  }

  /**
   * Modulate pitch and filter sweep to match the breathing state
   * @param breathForce 0.0 to 1.0 (empty lungs to full lungs)
   * @param isRising true if inhaling, false if exhaling
   */
  public update(breathForce: number, isRising: boolean) {
    if (!this.ctx || !this.isPlaying) return;

    const t = this.ctx.currentTime;

    // Solfeggio swell: higher breathing intensity expands the filter cutoff
    // and slightly increases volume to mimic expansive inhalation energy (Swell of ocean waves)
    if (this.filter) {
      const minCutoff = 160;
      const maxCutoff = 380;
      const targetCutoff = minCutoff + (maxCutoff - minCutoff) * breathForce;
      this.filter.frequency.setTargetAtTime(targetCutoff, t, 0.4);
    }

    if (this.masterGain) {
      // Slight swell in volume during inhalation
      const minVol = this.volume * 0.7;
      const maxVol = this.volume * 1.3;
      const targetVol = minVol + (maxVol - minVol) * breathForce;
      this.masterGain.gain.setTargetAtTime(targetVol, t, 0.5);
    }

    // Subtle micro-pitch glide (Tai Chi Qi movement frequency elevation)
    if (this.primaryOsc && this.secondaryOsc) {
      const pitchBend = isRising ? 1.2 : -1.2;
      this.primaryOsc.frequency.setTargetAtTime(this.baseFreq + pitchBend * breathForce, t, 0.8);
      this.secondaryOsc.frequency.setTargetAtTime(this.baseFreq + 4.5 + pitchBend * breathForce, t, 0.8);
    }
  }

  public setVolume(vol: number) {
    this.volume = vol;
    if (this.ctx && this.isPlaying && this.masterGain) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setTargetAtTime(this.volume, t, 0.1);
    }
  }

  public setFrequency(baseFreq: number) {
    this.baseFreq = baseFreq;
    if (this.ctx && this.isPlaying && this.primaryOsc && this.secondaryOsc) {
      const t = this.ctx.currentTime;
      this.primaryOsc.frequency.cancelScheduledValues(t);
      this.secondaryOsc.frequency.cancelScheduledValues(t);
      this.primaryOsc.frequency.setTargetAtTime(this.baseFreq, t, 0.5);
      this.secondaryOsc.frequency.setTargetAtTime(this.baseFreq + 4.5, t, 0.5);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}
