import { describe, expect, it } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fromOurRelease, isNewer, signatureHolds, UPDATE_PUBLIC_KEY } from './nativeUpdate';

const REL = 'https://github.com/hierophantiss/Mindfulness-neurodivergent/releases/download/app-bundle/';

describe('isNewer', () => {
  const m = { version: 12, url: `${REL}app-bundle-12.zip`, minNative: 1 };
  it('takes a newer copy that this app can run', () => {
    expect(isNewer(m, 11, 1)).toBe(true);
  });
  it('leaves the same or an older copy', () => {
    expect(isNewer(m, 12, 1)).toBe(false);
    expect(isNewer(m, 13, 1)).toBe(false);
  });
  it('waits for a store update when the copy needs a newer app', () => {
    expect(isNewer({ ...m, minNative: 3 }, 11, 2)).toBe(false);
  });
  it('ignores anything that is not a proper manifest', () => {
    expect(isNewer(null, 0, 1)).toBe(false);
    expect(isNewer({ version: 99, url: 'http://insecure/x.zip' }, 0, 1)).toBe(false);
    expect(isNewer({ url: 'https://x/y.zip' }, 0, 1)).toBe(false);
  });
  it('takes a copy only from this repository\'s own release', () => {
    expect(fromOurRelease(`${REL}app-bundle-12.zip`)).toBe(true);
    expect(isNewer({ ...m, url: 'https://evil.example/app-bundle-12.zip' }, 0, 1)).toBe(false);
    expect(isNewer({ ...m, url: 'https://github.com/someone/else/releases/download/app-bundle/app-bundle-12.zip' }, 0, 1)).toBe(false);
    expect(fromOurRelease(`${REL}app-bundle-12.zip?x=1`)).toBe(false);
    expect(fromOurRelease(`${REL}../play/app-bundle-12.zip`)).toBe(false);
  });
});

describe('the update signature', () => {
  // A key for the test only, made fresh each time.
  const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  const pem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
  const pub = publicKey.export({ type: 'spki', format: 'der' }).subarray(12).toString('base64');
  const sha = 'a'.repeat(64);
  const url = `${REL}app-bundle-40.zip`;
  const signWithScript = (key: string) => {
    const r = spawnSync(process.execPath, ['scripts/sign-app-bundle.mjs', '40', url, sha, '1'], { env: { ...process.env, OTA_SIGNING_KEY: key }, encoding: 'utf8' });
    return { status: r.status, manifest: r.status === 0 ? JSON.parse(r.stdout) : null };
  };

  it('holds for a manifest the workflow signed', async () => {
    const { status, manifest } = signWithScript(pem);
    expect(status).toBe(0);
    expect(await signatureHolds(manifest, pub)).toBe(true);
  });

  it('fails when anything in it is changed, or it is unsigned, or signed by another key', async () => {
    const { manifest } = signWithScript(pem);
    expect(await signatureHolds({ ...manifest, url: `${REL}app-bundle-41.zip` }, pub)).toBe(false);
    expect(await signatureHolds({ ...manifest, sha256: 'b'.repeat(64) }, pub)).toBe(false);
    expect(await signatureHolds({ ...manifest, version: 41 }, pub)).toBe(false);
    expect(await signatureHolds({ ...manifest, minNative: 0 }, pub)).toBe(false);
    expect(await signatureHolds({ ...manifest, sig: undefined }, pub)).toBe(false);
    expect(await signatureHolds(manifest, UPDATE_PUBLIC_KEY)).toBe(false);
  });

  it('is not published without the key', () => {
    expect(signWithScript('').status).toBe(1);
  });
});
