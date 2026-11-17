// Writes app-bundle.json for the Android app's updates, signed with the
// update key (Ed25519). Used by the Android workflow's "publish-update" job;
// the app checks the signature with its own copy of the public key
// (src/lib/nativeUpdate.ts, signedText: the same text).
//
//   OTA_SIGNING_KEY=<PKCS8 PEM> node scripts/sign-app-bundle.mjs <version> <url> <sha256> <minNative> > app-bundle.json

import { createPrivateKey, createPublicKey, sign, verify } from 'node:crypto';

const [version, url, sha256, minNative = '1'] = process.argv.slice(2);
const pem = process.env.OTA_SIGNING_KEY;
if (!pem) { console.error('No OTA_SIGNING_KEY: the update is not published.'); process.exit(1); }
if (!/^\d+$/.test(version) || !/^https:\/\//.test(url) || !/^[0-9a-f]{64}$/.test(sha256) || !/^\d+$/.test(minNative)) {
  console.error('Usage: sign-app-bundle.mjs <version> <url> <sha256> <minNative>'); process.exit(1);
}
const key = createPrivateKey(pem);
const text = Buffer.from(`mindfulness-app-bundle\n${version}\n${url}\n${sha256}\n${minNative}`);
const sig = sign(null, text, key);
if (!verify(null, text, createPublicKey(key), sig)) { console.error('The signature does not check.'); process.exit(1); }
// Which key signed it (its public half, as in the app), for the log.
console.error('Signed by', createPublicKey(key).export({ type: 'spki', format: 'der' }).subarray(12).toString('base64'));
process.stdout.write(JSON.stringify({ version: Number(version), url, sha256, minNative: Number(minNative), sig: sig.toString('base64') }) + '\n');
