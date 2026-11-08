// Cloudflare Pages Function: /download/android
//
// The Android app for anyone to install: the same app as on Google Play, the
// APK signed by Google that the author downloads from the Play Console and
// attaches to this repository’s release "Android". This sends the visitor
// to that file, whatever its name, so the Install page's link never changes.
// The release is looked up at most every ten minutes (GitHub limits how often
// it may be asked without an account).

const REPO = 'hierophantiss/Mindfulness-neurodivergent';
const TAG = 'Android'; // the release's tag, as created (tags are case-sensitive)

export async function onRequest({ request, waitUntil }) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  const api = `https://api.github.com/repos/${REPO}/releases/tags/${TAG}`;
  const cache = caches.default;
  const key = new Request(api);
  let res = await cache.match(key);
  if (!res) {
    const up = await fetch(api, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'neurodivergent-mindfulness.org' } });
    if (!up.ok) return notYet();
    res = new Response(await up.text(), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600' } });
    waitUntil(cache.put(key, res.clone()));
  }
  let release;
  try { release = await res.json(); } catch { return notYet(); }
  const apk = (release.assets || [])
    .filter((a) => /\.apk$/i.test(a.name))
    .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))[0];
  if (!apk) return notYet();
  return Response.redirect(apk.browser_download_url, 302);
}

// No file yet: back to the Install page rather than an error.
function notYet() {
  return new Response(null, { status: 302, headers: { Location: '/en/install', 'Cache-Control': 'no-store' } });
}
