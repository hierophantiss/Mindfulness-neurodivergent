// Cloudflare Pages Function: /audio/<file>
//
// The audio lives in this repository's GitHub Releases ("audiobook" for the
// book, "app-audio" for the chapters of the app's reader). GitHub serves those
// files as downloads (application/octet-stream, attachment) and without CORS,
// so phones, iPhones above all, may not play them in place. This bridge fetches
// the file and passes it on as audio, from the site's own address, with range
// requests for seeking. Only known file names are served.

const REPO = 'hierophantiss/Mindfulness-neurodivergent';

const FILES = [
  { re: /^(?:el|en)-\d{2}\.mp3$/, tag: 'audiobook' },
  { re: /^mindfulness-guide-(?:el|en)\.(?:mp3|m4b)$/, tag: 'audiobook' },
  { re: /^app-(?:el|en)-\d{2}\.(?:mp3|json)$/, tag: 'app-audio' },
];

const TYPES = {
  mp3: 'audio/mpeg',
  m4b: 'audio/mp4',
  json: 'application/json; charset=utf-8',
};

export async function onRequest({ request, params }) {
  const name = String(params.name || '');
  const file = FILES.find((f) => f.re.test(name));
  if (!file) return new Response('Not found', { status: 404 });
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  }

  const ext = name.split('.').pop();
  const upstreamHeaders = {};
  const range = request.headers.get('Range');
  if (range) upstreamHeaders.Range = range;

  // GitHub redirects to a signed storage URL; fetch follows it.
  const up = await fetch(`https://github.com/${REPO}/releases/download/${file.tag}/${name}`, {
    headers: upstreamHeaders,
    redirect: 'follow',
  });
  if (up.status === 404) return new Response('Not found', { status: 404 });
  if (!up.ok) return new Response('Upstream error', { status: 502 });

  const headers = new Headers({
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Content-Disposition': 'inline',
    'Accept-Ranges': 'bytes',
    // The timing maps change with the text; the audio changes with them.
    'Cache-Control': ext === 'json' ? 'public, max-age=300' : 'public, max-age=86400',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
    'X-Content-Type-Options': 'nosniff',
  });
  for (const h of ['Content-Length', 'Content-Range', 'ETag', 'Last-Modified']) {
    const v = up.headers.get(h);
    if (v) headers.set(h, v);
  }

  return new Response(request.method === 'HEAD' ? null : up.body, { status: up.status, headers });
}
