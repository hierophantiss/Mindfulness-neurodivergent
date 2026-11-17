import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { FakeAudioContext } from '../test/fakeWebAudio';
import { AudioProvider, loadAmbientLayers, useAudioMixer } from './AudioContext';

// The app's one sound engine, on a stand-in for Web Audio: what it builds
// when a practice starts, how it changes while it plays, and that it always
// stops what it started.

let ctx: FakeAudioContext;
class Ctx extends FakeAudioContext { constructor() { super(); ctx = this; } }
// The background sounds load on first use; here they are loaded before the tests.
beforeAll(async () => { (window as unknown as { AudioContext: unknown }).AudioContext = Ctx; await loadAmbientLayers(); });
beforeEach(() => { vi.useFakeTimers(); if (ctx) ctx.nodes = []; });
afterEach(() => { vi.useRealTimers(); });

const wrapper = ({ children }: { children: ReactNode }) => <AudioProvider>{children}</AudioProvider>;
const mixer = () => renderHook(() => useAudioMixer(), { wrapper });
const osc = (hz: number) => ctx.of('oscillator').filter((o) => (o.frequency as { value: number }).value === hz);
const param = (n: unknown, p: string) => (n as Record<string, import('../test/fakeWebAudio').FakeParam>)[p];

describe('the sound engine', () => {
  it('a binaural practice: one tone in each ear, the beat between them, rising gently', () => {
    const { result } = mixer();
    act(() => result.current.startAudio({ base: 200, beat: 6, pulse: 0.1 }));
    expect(result.current.isPlaying).toBe(true);
    const [left] = osc(200), [right] = osc(206);
    expect(left?.started && right?.started).toBe(true);
    expect(osc(0.1)[0]?.started).toBe(true);              // the slow pulse
    // The level starts at silence and rises over seconds (no click).
    const master = ctx.of('gain')[0];
    expect(param(master, 'gain').events[0]).toEqual(['set', 0, 0]);
    const rise = param(master, 'gain').events.find(([m]) => m === 'linear')!;
    expect(rise[1]).toBeCloseTo(0.5 * result.current.volume * result.current.masterVolume);
    expect(rise[2]).toBeGreaterThan(1);
  });

  it('nature sounds only: no tones, each layer at its own level, changeable while it plays', () => {
    const { result } = mixer();
    act(() => result.current.startAudio({ base: 0, beat: 0, disableSynth: true, ambientLayers: ['rain', 'ocean'], layerLevels: { rain: 0.3 } }));
    expect(ctx.of('oscillator').filter((o) => o.started && (o.frequency as { value: number }).value > 20)).toHaveLength(0);
    expect(ctx.playing().some((n) => n.kind === 'buffer')).toBe(true);
    const levels = ctx.of('gain').map((g) => param(g, 'gain').value);
    expect(levels).toContain(0.3);
    act(() => result.current.setLayerLevel('ocean', 0.2));
    act(() => result.current.setLayerLevel('rain', 5));      // held to the top
    const targets = ctx.of('gain').flatMap((g) => param(g, 'gain').events.filter(([m]) => m === 'target').map(([, v]) => v));
    expect(targets).toEqual(expect.arrayContaining([0.2, 1]));
  });

  it('stop: the sound fades, then everything it started is stopped', () => {
    const { result } = mixer();
    act(() => result.current.startAudio({ base: 180, beat: 4, pulse: 0.1, ambientLayers: ['wind'] }));
    expect(ctx.playing().length).toBeGreaterThan(2);
    act(() => result.current.stopAudio());
    expect(result.current.isPlaying).toBe(false);
    expect(param(ctx.of('gain')[0], 'gain').last).toBe(0);    // fading to silence first
    act(() => { vi.advanceTimersByTime(1700); });
    expect(ctx.playing()).toEqual([]);
  });

  it('a new practice right after a stop is not cut off by the old stop', () => {
    const { result } = mixer();
    act(() => result.current.startAudio({ base: 180, beat: 4 }));
    act(() => result.current.stopAudio());
    act(() => result.current.startAudio({ base: 220, beat: 10 }));
    act(() => { vi.advanceTimersByTime(2000); });
    expect(osc(180).every((o) => o.stopped)).toBe(true);       // the old one, gone
    expect(osc(220)[0].stopped).toBe(false);                   // the new one, still playing
    expect(osc(230)[0].stopped).toBe(false);
    expect(result.current.isPlaying).toBe(true);
  });

  it('starting again replaces what plays (never two at once)', () => {
    const { result } = mixer();
    act(() => result.current.startAudio({ base: 150, beat: 5 }));
    act(() => result.current.startAudio({ base: 160, beat: 5 }));
    expect(osc(150).every((o) => o.stopped)).toBe(true);
    expect(osc(160)[0].stopped).toBe(false);
  });

  it('the sleep timer\'s fade: down to silence over the time given, then stopped', () => {
    const { result } = mixer();
    act(() => result.current.startAudio({ base: 100, beat: 2, ambientLayers: ['brown'] }));
    ctx.currentTime = 10;
    act(() => result.current.fadeOutAudio(30));
    const fade = param(ctx.of('gain')[0], 'gain').events.filter(([m]) => m === 'linear').pop()!;
    expect(fade).toEqual(['linear', 0, 40]);
    act(() => { vi.advanceTimersByTime(29_000); });
    expect(ctx.playing().length).toBeGreaterThan(0);           // still fading
    act(() => { vi.advanceTimersByTime(1_500); });
    expect(ctx.playing()).toEqual([]);
  });

  it('follows the breath: louder as the arms rise; the humming guide only on the exhale', () => {
    const { result } = mixer();
    act(() => result.current.startAudio({ base: 128, beat: 0, id: 'bhramari-humming' }));
    const breath = ctx.of('gain')[1];
    act(() => result.current.updateArmPos(1));
    expect(param(breath, 'gain').last).toBeCloseTo(1);
    act(() => result.current.updateArmPos(0));
    expect(param(breath, 'gain').last).toBeCloseTo(0.3);
    const lastTarget = (g: unknown) => param(g, 'gain').events.filter(([m]) => m === 'target').pop()?.[1];
    act(() => result.current.updatePhase(2, 'exhale'));
    const voice = ctx.of('gain').find((g) => lastTarget(g) === 0.85);
    expect(voice).toBeTruthy();                                 // the guide comes in on the exhale
    act(() => result.current.updatePhase(0, 'inhale'));
    expect(lastTarget(voice)).toBe(0);                         // and goes quiet on the inhale
  });

  it('volume changes reach what plays, smoothly', () => {
    const { result } = mixer();
    act(() => result.current.startAudio({ base: 200, beat: 6 }));
    act(() => result.current.setGlobalVolume(0.2));
    const t = param(ctx.of('gain')[0], 'gain').events.filter(([m]) => m === 'target').pop()!;
    expect(t[1]).toBeCloseTo(0.5 * 0.2 * result.current.masterVolume);
  });

  it('leaving the page stops everything', () => {
    const { result, unmount } = mixer();
    act(() => result.current.startAudio({ base: 200, beat: 6, pulse: 0.2, ambientLayers: ['rain', 'stream', 'crickets'] }));
    expect(ctx.playing().length).toBeGreaterThan(3);
    unmount();
    act(() => { vi.advanceTimersByTime(60_000); });
    expect(ctx.playing()).toEqual([]);
  });

  it('every nature layer starts and stops cleanly', () => {
    const { result } = mixer();
    const layers = ['rain', 'ocean', 'wind', 'brown', 'pink', 'green', 'breath', 'fire', 'stream', 'crickets', 'storm', 'purr'] as const;
    for (const l of layers) {
      act(() => result.current.startAudio({ base: 0, beat: 0, disableSynth: true, ambientLayers: [l] }));
      act(() => { vi.advanceTimersByTime(5_000); });
      expect(ctx.playing().length, l).toBeGreaterThan(0);
      act(() => result.current.stopAudio());
      act(() => { vi.advanceTimersByTime(2_000); });
      expect(ctx.playing(), l).toEqual([]);
    }
  });
});
