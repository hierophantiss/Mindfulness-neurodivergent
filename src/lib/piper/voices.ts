type ReadLang = 'el' | 'en';

/**
 * Piper voices (https://github.com/rhasspy/piper), run on the device.
 * The model is downloaded once into the browser's private storage; nothing is
 * stored in this repo and no text ever leaves the device.
 */
export interface PiperVoice {
  id: string;
  /** Path inside the rhasspy/piper-voices repository on Hugging Face. */
  path: string;
  /** Approximate one-time download, model + runtime, in MB. */
  downloadMb: number;
}

export const PIPER_VOICES: Record<ReadLang, PiperVoice> = {
  el: { id: 'el_GR-rapunzelina-low', path: 'el/el_GR/rapunzelina/low/el_GR-rapunzelina-low.onnx', downloadMb: 90 },
  en: { id: 'en_GB-cori-medium', path: 'en/en_GB/cori/medium/en_GB-cori-medium.onnx', downloadMb: 90 },
};

export const PIPER_MODEL_BASE = 'https://huggingface.co/rhasspy/piper-voices/resolve/main';

/** Runtime files, pinned to exact versions and fetched from public CDNs. */
export const PIPER_RUNTIME = {
  ortSimd: 'https://cdnjs.cloudflare.com/ajax/libs/onnxruntime-web/1.18.0/ort-wasm-simd.wasm',
  ortPlain: 'https://cdnjs.cloudflare.com/ajax/libs/onnxruntime-web/1.18.0/ort-wasm.wasm',
  phonemizeWasm: 'https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize.wasm',
  phonemizeData: 'https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize.data',
};

/** Cache Storage bucket for the model and runtime; readable from the page and the worker. */
export const PIPER_CACHE = 'piper-voice-v1';

export const piperModelUrl = (lang: ReadLang) => `${PIPER_MODEL_BASE}/${PIPER_VOICES[lang].path}`;

export const piperFiles = (lang: ReadLang) => [
  `${piperModelUrl(lang)}.json`,
  piperModelUrl(lang),
  PIPER_RUNTIME.ortSimd,
  PIPER_RUNTIME.phonemizeWasm,
  PIPER_RUNTIME.phonemizeData,
];

/** True when everything the voice needs is already on the device. */
export async function piperIsStored(lang: ReadLang) {
  if (typeof caches === 'undefined') return false;
  try {
    const cache = await caches.open(PIPER_CACHE);
    const hits = await Promise.all(piperFiles(lang).map((u) => cache.match(u)));
    return hits.every(Boolean);
  } catch {
    return false;
  }
}
