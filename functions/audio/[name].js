// Cloudflare Pages Function: /audio/<file>
//
// The audio lives in this repository's GitHub Releases ("audiobook" for the
// book, "app-audio" for the reader's chapters and the animations' voice). GitHub serves those
// files as downloads (application/octet-stream, attachment) and without CORS,
// so phones, iPhones above all, may not play them in place. This bridge fetches
// the file and passes it on as audio, from the site's own address, with range
// requests for seeking. Only known file names are served.
//
// GitHub's download address (github.com/…/releases/download/…) is at times slow
// or answers 504 for this repository. So:
// - each of the reader's files (app-audio, a few MB each), once fetched, is
//   kept in Cloudflare's cache (the MP3s for a
//   month, keyed with the app's ?v=, which changes when a recording is made
//   again; the timing maps for five minutes), and later requests, seeking
//   included, are answered from there;
// - if the download address fails, the same file comes through GitHub's API
//   (the release's list of files, itself kept ten minutes).

const REPO = 'hierophantiss/Mindfulness-neurodivergent';

const FILES = [
  { re: /^(?:el|en)-\d{2}\.mp3$/, tag: 'audiobook' },
  { re: /^mindfulness-guide-(?:el|en)\.(?:mp3|m4b)$/, tag: 'audiobook' },
  { re: /^app-(?:el|en)-\d{2}\.(?:mp3|json)$/, tag: 'app-audio' },
  { re: /^anim-[a-z0-9-]+-(?:el|en)\.(?:mp3|json)$/, tag: 'app-audio' },
];

const TYPES = {
  mp3: 'audio/mpeg',
  m4b: 'audio/mp4',
  json: 'application/json; charset=utf-8',
};

const UA = { 'User-Agent': 'neurodivergent-mindfulness.org' };

export async function onRequest({ request, params, waitUntil }) {
  const name = String(params.name || '');
  const file = FILES.find((f) => f.re.test(name));
  if (!file) return new Response('Not found', { status: 404 });
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors({ 'Access-Control-Allow-Methods': 'GET, HEAD', 'Access-Control-Allow-Headers': 'Range', 'Access-Control-Max-Age': '86400' }) });
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD, OPTIONS' } });
  }

  const ext = name.split('.').pop();
  const isMap = ext === 'json';
  // The book's files are large (up to ~70 MB): passed through as they come.
  if (file.tag !== 'app-audio') return passThrough(request, file.tag, name, ext);
  const v = new URL(request.url).searchParams.get('v');
  const cache = caches.default;
  const key = new Request(`https://audio-cache.neurodivergent-mindfulness.org/${file.tag}/${name}${v ? `?v=${encodeURIComponent(v)}` : ''}`);

  let whole = await cache.match(key);
  if (!whole) {
    const body = await fromGitHub(file.tag, name, cache, waitUntil);
    if (body === 404) return new Response('Not found', { status: 404, headers: cors() });
    if (!body) return new Response('Upstream error', { status: 502, headers: cors({ 'Cache-Control': 'no-store' }) });
    whole = new Response(body, {
      headers: { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': isMap ? 'public, max-age=300' : 'public, max-age=2592000' },
    });
    waitUntil(cache.put(key, whole.clone()));
  }

  const bytes = new Uint8Array(await whole.arrayBuffer());
  const size = bytes.length;
  const headers = cors({
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Content-Disposition': 'inline',
    'Accept-Ranges': 'bytes',
    // The timing maps change with the text; the audio changes with them.
    'Cache-Control': isMap ? 'public, max-age=300' : 'public, max-age=86400',
    'X-Content-Type-Options': 'nosniff',
  });

  const range = request.headers.get('Range');
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (m && (m[1] !== '' || m[2] !== '')) {
    let start = m[1] === '' ? Math.max(0, size - Number(m[2])) : Number(m[1]);
    let end = m[1] === '' || m[2] === '' ? size - 1 : Math.min(size - 1, Number(m[2]));
    if (start >= size || start > end) {
      headers.set('Content-Range', `bytes */${size}`);
      return new Response(null, { status: 416, headers });
    }
    headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(request.method === 'HEAD' ? null : bytes.slice(start, end + 1), { status: 206, headers });
  }
  headers.set('Content-Length', String(size));
  return new Response(request.method === 'HEAD' ? null : bytes, { status: 200, headers });
}

/** The book's files: straight through, with the person's Range, and the API as the second route. */
async function passThrough(request, tag, name, ext) {
  const range = request.headers.get('Range');
  const h = { ...UA, ...(range ? { Range: range } : {}) };
  let up = null;
  try {
    up = await fetch(`https://github.com/${REPO}/releases/download/${tag}/${name}`, { headers: h, redirect: 'follow', signal: AbortSignal.timeout(8000) });
  } catch {
    up = null;
  }
  if (!up || (!up.ok && up.status !== 404)) {
    try {
      const res = await fetch(`https://api.github.com/repos/${REPO}/releases/tags/${tag}`, { headers: { ...UA, Accept: 'application/vnd.github+json' }, cf: { cacheTtl: 600, cacheEverything: true } });
      const asset = res.ok ? ((await res.json()).assets || []).find((a) => a.name === name) : null;
      up = asset ? await fetch(`https://api.github.com/repos/${REPO}/releases/assets/${asset.id}`, { headers: { ...h, Accept: 'application/octet-stream' }, redirect: 'follow' }) : up;
    } catch {
      /* keep what we have */
    }
  }
  if (!up) return new Response('Upstream error', { status: 502, headers: cors({ 'Cache-Control': 'no-store' }) });
  if (up.status === 404) return new Response('Not found', { status: 404, headers: cors() });
  if (!up.ok) return new Response('Upstream error', { status: 502, headers: cors({ 'Cache-Control': 'no-store' }) });
  const headers = cors({
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Content-Disposition': 'inline',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=86400',
    'X-Content-Type-Options': 'nosniff',
  });
  for (const k of ['Content-Length', 'Content-Range', 'ETag', 'Last-Modified']) {
    const v = up.headers.get(k);
    if (v) headers.set(k, v);
  }
  return new Response(request.method === 'HEAD' ? null : up.body, { status: up.status, headers });
}

function cors(extra = {}) {
  return new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
    ...extra,
  });
}

/** The whole file from GitHub (an ArrayBuffer), 404 if it does not exist, or null if GitHub did not answer. */
async function fromGitHub(tag, name, cache, waitUntil) {
  // 1. The download address, with a time limit (it sometimes hangs, then answers 504).
  try {
    const up = await fetch(`https://github.com/${REPO}/releases/download/${tag}/${name}`, { redirect: 'follow', signal: AbortSignal.timeout(6000), headers: UA });
    if (up.ok) return await up.arrayBuffer();
  } catch {
    /* slow or failed: the API next */
  }
  // 2. GitHub's API: find the file in the release, then fetch it by its id.
  try {
    const listKey = new Request(`https://audio-cache.neurodivergent-mindfulness.org/release/${tag}`);
    let list = await cache.match(listKey);
    if (!list) {
      const res = await fetch(`https://api.github.com/repos/${REPO}/releases/tags/${tag}`, { headers: { ...UA, Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(6000) });
      if (!res.ok) return null;
      list = new Response(await res.text(), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600' } });
      waitUntil(cache.put(listKey, list.clone()));
    }
    const asset = ((await list.json()).assets || []).find((a) => a.name === name);
    if (!asset) return 404;
    const up = await fetch(`https://api.github.com/repos/${REPO}/releases/assets/${asset.id}`, { headers: { ...UA, Accept: 'application/octet-stream' }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
    if (up.ok) return await up.arrayBuffer();
    return up.status === 404 ? 404 : null;
  } catch {
    return null;
  }
}
