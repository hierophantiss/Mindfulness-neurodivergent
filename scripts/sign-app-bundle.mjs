// Writes app-bundle.json for the Android app's updates, signed with the
// update key (Ed25519). Used by the Android workflow's "publish-update" job;
// the app checks the signature with its own copy of the public key
// (src/lib/nativeUpdate.ts, signedText: the same text).
//
//   OTA_SIGNING_KEY=<key> node scripts/sign-app-bundle.mjs <version> <url> <sha256> <minNative> > app-bundle.json

import { createPrivateKey, createPublicKey, sign, verify } from 'node:crypto';

const [version, url, sha256, minNative = '1'] = process.argv.slice(2);
const pem = process.env.OTA_SIGNING_KEY;
if (!pem) { console.error('No OTA_SIGNING_KEY: the update is not published.'); process.exit(1); }
if (!/^\d+$/.test(version) || !/^https:\/\//.test(url) || !/^[0-9a-f]{64}$/.test(sha256) || !/^\d+$/.test(minNative)) {
  console.error('Usage: sign-app-bundle.mjs <version> <url> <sha256> <minNative>'); process.exit(1);
}
// The key as pasted: either the 32-byte private key as one line of base64
// (44 characters, easy to paste on a phone), or a PKCS8 PEM. Spaces and line
// breaks (or their loss) do not matter: only the base64 counts.
const b64 = pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '').replace(/[^A-Za-z0-9+/=]/g, '');
const raw = Buffer.from(b64, 'base64');
// PKCS8 for Ed25519 is a fixed 16-byte header and the 32-byte key.
const der = raw.length === 32 ? Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), raw]) : raw;
let key;
try {
  key = createPrivateKey({ key: der, format: 'der', type: 'pkcs8' });
} catch {
  // Lengths only, never the key: enough to see what went wrong in the paste.
  console.error(`OTA_SIGNING_KEY is not a readable Ed25519 private key (${b64.length} base64 characters, ${raw.length} bytes; expected 44 and 32).`);
  process.exit(1);
}
if (key.asymmetricKeyType !== 'ed25519') { console.error('OTA_SIGNING_KEY is not an Ed25519 key.'); process.exit(1); }
const text = Buffer.from(`mindfulness-app-bundle\n${version}\n${url}\n${sha256}\n${minNative}`);
const sig = sign(null, text, key);
if (!verify(null, text, createPublicKey(key), sig)) { console.error('The signature does not check.'); process.exit(1); }
// Which key signed it (its public half, as in the app), for the log.
console.error('Signed by', createPublicKey(key).export({ type: 'spki', format: 'der' }).subarray(12).toString('base64'));
process.stdout.write(JSON.stringify({ version: Number(version), url, sha256, minNative: Number(minNative), sig: sig.toString('base64') }) + '\n');
