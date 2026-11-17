// A stand-in for the Web Audio API, for unit tests (jsdom has none). It plays
// nothing; it records what the app builds: which nodes, their settings, what
// was scheduled on each parameter, and what was started and stopped.

export class FakeParam {
  value: number;
  /** Everything scheduled, in order: [method, value, time]. */
  events: [string, number, number][] = [];
  constructor(v = 0) { this.value = v; }
  setValueAtTime(v: number, t: number) { this.value = v; this.events.push(['set', v, t]); return this; }
  linearRampToValueAtTime(v: number, t: number) { this.events.push(['linear', v, t]); return this; }
  exponentialRampToValueAtTime(v: number, t: number) { this.events.push(['exp', v, t]); return this; }
  setTargetAtTime(v: number, t: number) { this.events.push(['target', v, t]); return this; }
  setValueCurveAtTime(c: number[], t: number) { this.events.push(['curve', c[c.length - 1] ?? 0, t]); return this; }
  cancelScheduledValues(t: number) { this.events.push(['cancel', 0, t]); return this; }
  cancelAndHoldAtTime(t: number) { this.events.push(['hold', 0, t]); return this; }
  /** Where it is heading: the last value set or scheduled. */
  get last(): number {
    const e = [...this.events].reverse().find(([m]) => m !== 'cancel' && m !== 'hold');
    return e ? e[1] : this.value;
  }
}

const PARAMS = new Set(['gain', 'frequency', 'detune', 'Q', 'pan', 'playbackRate', 'threshold', 'knee', 'ratio', 'attack', 'release', 'offset', 'delayTime']);

export interface FakeNode {
  kind: string;
  started: boolean;
  stopped: boolean;
  connections: unknown[];
  [key: string]: unknown;
}

function makeNode(ctx: FakeAudioContext, kind: string): FakeNode {
  const base: FakeNode = {
    kind, started: false, stopped: false, connections: [],
    connect(dest: unknown) { base.connections.push(dest); return dest; },
    disconnect() { base.connections = []; },
    // start(when, offset, duration): with a duration, it ends by itself.
    start(_when?: number, _offset?: number, duration?: number) { base.started = true; if (duration !== undefined) base.stopped = true; },
    stop() { if (!base.started) throw new Error('not started'); base.stopped = true; },
    addEventListener() {}, removeEventListener() {},
  };
  const node = new Proxy(base, {
    get(t, p: string) {
      if (!(p in t) && PARAMS.has(p)) t[p] = new FakeParam(p === 'gain' ? 1 : 0);
      return t[p];
    },
  });
  ctx.nodes.push(node);
  return node;
}

export class FakeAudioContext {
  nodes: FakeNode[] = [];
  currentTime = 0;
  sampleRate = 4000;   // small buffers: the noise is made quickly
  state: 'running' | 'suspended' | 'closed' = 'running';
  destination = { kind: 'destination', channelCount: 2, channelInterpretation: 'speakers', maxChannelCount: 2 };
  resume() { this.state = 'running'; return Promise.resolve(); }
  suspend() { this.state = 'suspended'; return Promise.resolve(); }
  close() { this.state = 'closed'; return Promise.resolve(); }
  createGain() { return makeNode(this, 'gain'); }
  createOscillator() { const n = makeNode(this, 'oscillator'); n.type = 'sine'; n.setPeriodicWave = () => {}; return n; }
  createBufferSource() { const n = makeNode(this, 'buffer'); n.buffer = null; n.loop = false; return n; }
  createBiquadFilter() { const n = makeNode(this, 'filter'); n.type = 'lowpass'; return n; }
  createStereoPanner() { return makeNode(this, 'panner'); }
  createDynamicsCompressor() { return makeNode(this, 'compressor'); }
  createChannelMerger() { return makeNode(this, 'merger'); }
  createDelay() { return makeNode(this, 'delay'); }
  createConstantSource() { return makeNode(this, 'constant'); }
  createPeriodicWave() { return {}; }
  createBuffer(channels: number, length: number, sampleRate: number) {
    const data = Array.from({ length: channels }, () => new Float32Array(length));
    return { numberOfChannels: channels, length, sampleRate, duration: length / sampleRate, getChannelData: (c: number) => data[c] };
  }
  /** The nodes of one kind. */
  of(kind: string) { return this.nodes.filter((n) => n.kind === kind); }
  /** Sources (oscillators, buffers) started and not yet stopped (nor set to end by themselves). */
  playing() { return this.nodes.filter((n) => (n.kind === 'oscillator' || n.kind === 'buffer') && n.started && !n.stopped); }
}
