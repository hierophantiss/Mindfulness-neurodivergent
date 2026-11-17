// The Android app's content security policy.
//
// On the website the policy comes as a header (public/_headers); in the app the
// pages come from the phone, where there are no headers, so the same rules go
// into the page itself, as a <meta> tag. Run by the Android workflow on dist/
// after the build, before the app and its update zip are made.
//
// The differences from the website: the app's own origin is https://localhost,
// so the site's address is named for what comes from it (the chapters' audio
// and its timing maps, src/lib/native.ts `remote`). Capacitor's bridge script
// is added by the WebView before the page (or, on old WebViews, right after
// <head>, before this tag), so it is not affected. frame-ancestors has no effect
// in a <meta> tag and is left out.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://neurodivergent-mindfulness.org';

const APP_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  'img-src \'self\' data: blob: https://img.youtube.com https://i.ytimg.com',
  `media-src 'self' blob: data: ${SITE}`,
  `connect-src 'self' ${SITE}`,
  "frame-src 'self' https://www.youtube-nocookie.com",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const dir = process.argv[2] || 'dist';
const file = join(dir, 'index.html');
const html = readFileSync(file, 'utf8');
if (html.includes('http-equiv="Content-Security-Policy"')) {
  console.log('app-csp: already there');
} else {
  const tag = `<meta http-equiv="Content-Security-Policy" content="${APP_CSP}">`;
  // Right after the charset, before any script or style of the page.
  const out = html.replace(/(<meta charset="[^"]*"\s*\/?>)/i, `$1\n    ${tag}`);
  if (out === html) {
    console.error('app-csp: no <meta charset> in index.html; the policy was not added');
    process.exit(1);
  }
  writeFileSync(file, out);
  console.log('app-csp: added to', file);
}
