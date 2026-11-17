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
  // The last answer that worked, kept for a week: used when GitHub does not
  // answer (it limits calls without an account, shared by Cloudflare's IPs).
  const lastGood = new Request(`${api}#last-good`);
  let res = await cache.match(key);
  if (!res) {
    const up = await fetch(api, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'neurodivergent-mindfulness.org' } }).catch(() => null);
    if (up && up.ok) {
      const text = await up.text();
      res = new Response(text, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600' } });
      waitUntil(cache.put(key, res.clone()));
      waitUntil(cache.put(lastGood, new Response(text, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=604800' } })));
    } else {
      res = await cache.match(lastGood);
      if (!res) return notYet(request);
    }
  }
  let release;
  try { release = await res.json(); } catch { return notYet(request); }
  const apk = (release.assets || [])
    .filter((a) => /\.apk$/i.test(a.name))
    .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))[0];
  if (!apk) return notYet(request);
  return Response.redirect(apk.browser_download_url, 302);
}

// No file yet (or GitHub not answering): back to the Install page, in the
// visitor's language (?lang=, else the page they came from), with a note.
function notYet(request) {
  const url = new URL(request.url);
  let lang = url.searchParams.get('lang');
  if (lang !== 'el' && lang !== 'en') {
    const ref = request.headers.get('Referer') || '';
    lang = /\/el(\/|$)/.test(ref) ? 'el' : /\/en(\/|$)/.test(ref) ? 'en' : (/^el\b/i.test(request.headers.get('Accept-Language') || '') ? 'el' : 'en');
  }
  return new Response(null, { status: 302, headers: { Location: `/${lang}/install?apk=later`, 'Cache-Control': 'no-store' } });
}
