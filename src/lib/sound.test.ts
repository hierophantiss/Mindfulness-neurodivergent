import { describe, it, expect, vi, beforeAll } from 'vitest';

// A stand-in for the browser's audio engine that counts what is made.
let made = 0;
let oscillators = 0;
class FakeContext {
  state = 'running';
  currentTime = 0;
  destination = {};
  constructor() { made++; }
  resume() { return Promise.resolve(); }
  createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
  createOscillator() {
    oscillators++;
    return { type: '', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} };
  }
}

describe('the one sound engine', () => {
  let sound: typeof import('./sound');
  beforeAll(async () => {
    (window as any).AudioContext = FakeContext;
    (navigator as any).vibrate = vi.fn();
    sound = await import('./sound');
  });

  it('a bell before any tap only vibrates: it never starts sound by itself', () => {
    sound.ringBell();
    expect(made).toBe(0);
    expect(navigator.vibrate).toHaveBeenCalled();
  });

  it('after the first tap, the bell, the tick and the background sounds share one engine', () => {
    sound.listenForFirstTap();
    window.dispatchEvent(new Event('pointerdown'));
    expect(made).toBe(1);
    const engine = sound.getAudioContext();
    sound.ringBell();
    sound.tick();
    expect(sound.getAudioContext()).toBe(engine);
    expect(made).toBe(1);
    expect(oscillators).toBeGreaterThan(0);
  });
});
