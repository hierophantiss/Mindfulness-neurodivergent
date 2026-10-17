/// <reference lib="webworker" />
/**
 * Piper text-to-speech in a Web Worker: espeak-ng phonemes (WASM) → VITS model
 * (ONNX Runtime, WASM) → 16-bit WAV. Model and runtime are kept in Cache
 * Storage after the first download, so reading works offline afterwards.
 */
import * as ort from 'onnxruntime-web/wasm';
import createPiperPhonemize from '@diffusionstudio/piper-wasm/build/piper_phonemize.js';
import { PIPER_CACHE, PIPER_RUNTIME, PIPER_VOICES, piperFiles, piperIsStored, piperModelUrl } from './voices';

type Lang = keyof typeof PIPER_VOICES;
type Req =
  | { id: number; type: 'stored'; lang: Lang }
  | { id: number; type: 'download'; lang: Lang }
  | { id: number; type: 'remove'; lang: Lang }
  | { id: number; type: 'synth'; lang: Lang; text: string };

interface ModelConfig {
  audio: { sample_rate: number };
  espeak: { voice: string };
  inference: { noise_scale: number; length_scale: number; noise_w: number };
  speaker_id_map?: Record<string, number>;
  /** Size of the model's phoneme table; ids at or above it would crash the model. */
  num_symbols?: number;
}

const CACHE = PIPER_CACHE;
const post = (msg: unknown, transfer: Transferable[] = []) =>
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(msg, transfer);

const modelUrl = piperModelUrl;
const filesFor = piperFiles;
const isStored = piperIsStored;

async function download(lang: Lang, onProgress: (loaded: number, total: number) => void) {
  const cache = await caches.open(CACHE);
  const files = filesFor(lang);
  const estimate = PIPER_VOICES[lang].downloadMb * 1024 * 1024;
  const loaded: number[] = files.map(() => 0);
  const totals: number[] = files.map(() => 0);
  const report = () => {
    const known = totals.reduce((a, b) => a + b, 0);
    onProgress(loaded.reduce((a, b) => a + b, 0), Math.max(known, estimate));
  };
  // One file at a time keeps memory low on phones.
  for (let i = 0; i < files.length; i++) {
    const url = files[i];
    const hit = await cache.match(url);
    if (hit) {
      const size = Number(hit.headers.get('content-length')) || (await hit.clone().blob()).size;
      loaded[i] = totals[i] = size;
      report();
      continue;
    }
    const res = await fetch(url);
    if (!res.ok || !res.body) throw new Error(`download failed (${res.status})`);
    totals[i] = Number(res.headers.get('content-length')) || 0;
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded[i] += value.length;
      if (!totals[i]) totals[i] = loaded[i];
      report();
    }
    const blob = new Blob(chunks as BlobPart[]);
    await cache.put(url, new Response(blob, { headers: { 'content-length': String(blob.size) } }));
    totals[i] = loaded[i] = blob.size;
    report();
  }
}

async function remove(lang: Lang) {
  const cache = await caches.open(CACHE);
  const other = (Object.keys(PIPER_VOICES) as Lang[]).filter((l) => l !== lang);
  const othersStored = await Promise.all(other.map(isStored));
  // Keep the shared runtime while another language still uses it.
  const keepRuntime = othersStored.some(Boolean);
  const urls = keepRuntime ? [`${modelUrl(lang)}.json`, modelUrl(lang)] : filesFor(lang);
  await Promise.all(urls.map((u) => cache.delete(u)));
  if (session?.lang === lang) {
    await session.ort.release();
    session = null;
  }
}

const blobUrls = new Map<string, string>();
async function cachedUrl(url: string) {
  const known = blobUrls.get(url);
  if (known) return known;
  const hit = await (await caches.open(CACHE)).match(url);
  if (!hit) throw new Error('voice not downloaded');
  // WebAssembly compiles fastest (streaming) only when the type is right.
  const type = url.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream';
  const obj = URL.createObjectURL(new Blob([await hit.arrayBuffer()], { type }));
  blobUrls.set(url, obj);
  return obj;
}

// ── Runtime ────────────────────────────────────────────────────────────
let runtimeReady: Promise<void> | null = null;
function ensureRuntime() {
  runtimeReady ??= (async () => {
    ort.env.wasm.numThreads = 1; // threads need cross-origin isolation, which the site does not use
    ort.env.wasm.wasmPaths = {
      'ort-wasm-simd.wasm': await cachedUrl(PIPER_RUNTIME.ortSimd),
      'ort-wasm.wasm': PIPER_RUNTIME.ortPlain, // only fetched on devices without SIMD
    };
  })().catch((e) => {
    runtimeReady = null;
    throw e;
  });
  return runtimeReady;
}

let session: { lang: Lang; ort: ort.InferenceSession; config: ModelConfig } | null = null;
async function ensureVoice(lang: Lang) {
  if (session?.lang === lang) return session;
  await ensureRuntime();
  const cache = await caches.open(CACHE);
  const cfgRes = await cache.match(`${modelUrl(lang)}.json`);
  const modelRes = await cache.match(modelUrl(lang));
  if (!cfgRes || !modelRes) throw new Error('voice not downloaded');
  const config = (await cfgRes.json()) as ModelConfig;
  const model = new Uint8Array(await modelRes.arrayBuffer());
  if (session) await session.ort.release();
  session = null;
  const s = await ort.InferenceSession.create(model, {
    executionProviders: ['wasm'],
    // Phones give WebAssembly little memory: do not keep large reusable buffers between sentences.
    enableCpuMemArena: false,
    enableMemPattern: false,
  });
  session = { lang, ort: s, config };
  return session;
}

// ── Phonemes ───────────────────────────────────────────────────────────
type PhonemizeModule = { callMain: (args: string[]) => void };
let phonemizer: Promise<PhonemizeModule> | null = null;
let onPhonemes: ((ids: number[]) => void) | null = null;

async function createPhonemizer(): Promise<PhonemizeModule> {
  const wasm = await cachedUrl(PIPER_RUNTIME.phonemizeWasm);
  const data = await cachedUrl(PIPER_RUNTIME.phonemizeData);
  return createPiperPhonemize({
    noInitialRun: true,
    print: (line: string) => {
      try {
        const ids = JSON.parse(line).phoneme_ids as number[];
        onPhonemes?.(ids);
      } catch {
        /* not a result line */
      }
    },
    printErr: () => {},
    locateFile: (file: string) => (file.endsWith('.wasm') ? wasm : file.endsWith('.data') ? data : file),
  });
}

/** espeak-ng keeps memory between runs; a fresh module every so often keeps phones from running out. */
const RECYCLE_AFTER = 25;
let phonemizerUses = 0;

async function phonemize(text: string, voice: string, retry = true): Promise<number[]> {
  if (phonemizerUses >= RECYCLE_AFTER) {
    phonemizer = null;
    phonemizerUses = 0;
  }
  phonemizer ??= createPhonemizer();
  phonemizerUses++;
  const mod = await phonemizer;
  try {
    return await new Promise<number[]>((resolve, reject) => {
      onPhonemes = resolve;
      mod.callMain(['-l', voice, '--input', JSON.stringify([{ text }]), '--espeak_data', '/espeak-ng-data']);
      // callMain prints synchronously; no output means the module is spent.
      queueMicrotask(() => reject(new Error('no phonemes')));
    });
  } catch (e) {
    phonemizer = null;
    phonemizerUses = 0;
    if (retry) return phonemize(text, voice, false);
    throw e;
  } finally {
    onPhonemes = null;
  }
}

function toWav(pcm: Float32Array, sampleRate: number): ArrayBuffer {
  const buf = new ArrayBuffer(44 + pcm.length * 2);
  const v = new DataView(buf);
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF');
  v.setUint32(4, 36 + pcm.length * 2, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, 'data');
  v.setUint32(40, pcm.length * 2, true);
  for (let i = 0; i < pcm.length; i++) {
    const s = Math.max(-1, Math.min(1, pcm[i]));
    v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buf;
}

/** Where a failure happened, so the player can show a short code instead of a technical message. */
class StageError extends Error {
  constructor(public stage: number, cause: unknown) {
    super(String((cause as Error)?.message || cause));
  }
}
const stage = async <T,>(n: number, f: () => Promise<T>) => {
  try {
    return await f();
  } catch (e) {
    throw e instanceof StageError ? e : new StageError(n, e);
  }
};

async function synth(lang: Lang, text: string) {
  const s = await stage(1, () => ensureVoice(lang));
  const raw = await stage(2, () => phonemize(text, s.config.espeak.voice));
  const max = s.config.num_symbols || Infinity;
  const ids = raw.filter((id) => Number.isInteger(id) && id >= 0 && id < max);
  if (ids.length < 3) throw new StageError(2, new Error('no usable phonemes'));
  const { noise_scale, length_scale, noise_w } = s.config.inference;
  const feeds: Record<string, ort.Tensor> = {
    input: new ort.Tensor('int64', BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
    input_lengths: new ort.Tensor('int64', BigInt64Array.from([BigInt(ids.length)]), [1]),
    scales: new ort.Tensor('float32', Float32Array.from([noise_scale, length_scale, noise_w]), [3]),
  };
  if (s.config.speaker_id_map && Object.keys(s.config.speaker_id_map).length) {
    feeds.sid = new ort.Tensor('int64', BigInt64Array.from([0n]), [1]);
  }
  let out: ort.InferenceSession.OnnxValueMapType;
  try {
    out = await s.ort.run(feeds);
  } catch (e) {
    // The model may be left unusable (e.g. out of memory): load it fresh next time.
    try {
      await s.ort.release();
    } catch {
      /* already broken */
    }
    session = null;
    throw new StageError(3, `${(e as Error)?.message || e} [phonemes ${ids.length}, chars ${text.length}]`);
  }
  const wav = toWav(out.output.data as Float32Array, s.config.audio.sample_rate);
  out.output.dispose?.();
  return wav;
}

// One job at a time: the model and the phonemizer are single instances.
let chain: Promise<unknown> = Promise.resolve();
self.onmessage = (e: MessageEvent<Req>) => {
  const req = e.data;
  chain = chain.then(async () => {
    try {
      if (req.type === 'stored') post({ id: req.id, ok: true, result: await isStored(req.lang) });
      else if (req.type === 'remove') {
        await remove(req.lang);
        post({ id: req.id, ok: true, result: true });
      } else if (req.type === 'download') {
        await download(req.lang, (loaded, total) => post({ id: req.id, progress: { loaded, total } }));
        await ensureVoice(req.lang); // proves the files load before we say "ready"
        post({ id: req.id, ok: true, result: true });
      } else if (req.type === 'synth') {
        const wav = await synth(req.lang, req.text);
        post({ id: req.id, ok: true, result: wav }, [wav]);
      }
    } catch (err) {
      post({ id: req.id, ok: false, error: String((err as Error)?.message || err), stage: (err as StageError).stage ?? 0 });
    }
  });
};
