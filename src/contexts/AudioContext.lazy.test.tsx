import { describe, it, expect, beforeAll } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { FakeAudioContext } from '../test/fakeWebAudio';
import { AudioProvider, loadAmbientLayers, useAudioMixer } from './AudioContext';

// The background sounds are a separate piece that loads the first time one
// plays. A sound asked for before it has loaded starts once it is there, and
// one whose session was replaced meanwhile never starts.

let ctx: FakeAudioContext;
class Ctx extends FakeAudioContext { constructor() { super(); ctx = this; } }
beforeAll(() => { (window as unknown as { AudioContext: unknown }).AudioContext = Ctx; });

const wrapper = ({ children }: { children: ReactNode }) => <AudioProvider>{children}</AudioProvider>;
const buffers = () => ctx.playing().filter((n) => n.kind === 'buffer');

describe('background sounds that load on first use', () => {
  it('start when they arrive, only for the session still playing', async () => {
    const { result } = renderHook(() => useAudioMixer(), { wrapper });
    const rain = { base: 0, beat: 0, disableSynth: true, ambientLayers: ['rain' as const] };
    // Rain asked for twice before the sounds have loaded: the first session is
    // replaced by the second, so only the second one's rain may start.
    act(() => result.current.startAudio(rain));
    act(() => result.current.startAudio(rain));
    expect(buffers()).toHaveLength(0);
    await act(async () => { await loadAmbientLayers(); });
    const once = buffers().length;
    expect(once).toBeGreaterThan(0);

    // Loaded now: a new session's rain starts at once, and it is one rain.
    act(() => result.current.startAudio(rain));
    expect(buffers()).toHaveLength(once);
  });
});
