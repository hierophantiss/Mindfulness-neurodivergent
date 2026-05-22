/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSharedAudioContext } from "../lib/audioManager";

export class ZenAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private baseFreq = 136.1; // Earth / Ohm Frequency (very grounding)
  private volume = 0.4;

  constructor() {
    // Lazy loaded after user interaction
  }

  public init() {
    // Dummy initialization
  }

  public start() {
    if (this.isPlaying) return;
    console.log('[Zen Audio Engine] Dummy session started.');
    this.isPlaying = true;
  }

  public stop() {
    if (!this.isPlaying) return;
    console.log('[Zen Audio Engine] Dummy session stopped.');
    this.isPlaying = false;
  }

  /**
   * Modulate pitch and filter sweep to match the breathing state
   * @param breathForce 0.0 to 1.0 (empty lungs to full lungs)
   * @param isRising true if inhaling, false if exhaling
   */
  public update(breathForce: number, isRising: boolean) {
    // Dummy update sweep
  }

  public setVolume(vol: number) {
    this.volume = vol;
  }

  public setFrequency(baseFreq: number) {
    this.baseFreq = baseFreq;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}
