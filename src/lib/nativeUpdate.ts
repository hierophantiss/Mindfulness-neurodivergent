// Updates for the Android app without the store: the site's files, built by
// the "Android" workflow, wait in this repository's GitHub release
// "app-bundle" (app-bundle.json says which is newest). With a connection, the
// app asks once after it opens, downloads a newer copy quietly and switches to
// it the next time it opens, never in the middle of a practice. If a new copy
// fails to start, the plugin goes back to the one that worked.
//
// Nothing about the person is sent: it is one request for a small file.
// The plugin's own reporting to Capgo is off (capacitor.config.ts).
//
// Trust: a copy runs only if (1) it comes from this repository's own release,
// at the one address below, (2) app-bundle.json carries an Ed25519 signature
// of its version, address and SHA-256 that this app's own key confirms, and
// (3) the file matches that SHA-256 (the plugin checks it). The private key
// lives only in the GitHub environment "app-update" (secret OTA_SIGNING_KEY),
// used by the Android workflow's last job; whoever can only write to the
// release cannot make a copy the app will take. If that key is ever lost or
// changed, a new key reaches the phones through a Google Play update.

import * as ed from '@noble/ed25519';
import { recordError } from './errorLog';

const RELEASE = 'https://github.com/hierophantiss/Mindfulness-neurodivergent/releases/download/app-bundle/';
const MANIFEST = `${RELEASE}app-bundle.json`;
/** The public half of the key that signs the updates (Ed25519, raw, base64). */
export const UPDATE_PUBLIC_KEY = 'kD6Q46TI5HUQHzWE/UgwvnoLZmwPfQYYlV6NuLtyLds=';
const PENDING = 'n_mindfulness_app_bundle_next';

/** This copy's number: the workflow run that built it (0 when built by hand). */
export const BUNDLE_VERSION = Number(import.meta.env.VITE_BUNDLE_VERSION || 0);

interface Manifest { version: number; url: string; sha256?: string; minNative?: number; sig?: string }

/** Only a copy from this repository's own release, at its own address. */
export function fromOurRelease(url: string): boolean {
  return url.startsWith(RELEASE) && /^app-bundle-\d+\.zip$/.test(url.slice(RELEASE.length));
}

export function isNewer(m: Partial<Manifest> | null | undefined, mine: number, nativeBuild: number): m is Manifest {
  return !!m && typeof m.version === 'number' && Number.isInteger(m.version) && typeof m.url === 'string' && fromOurRelease(m.url)
    && m.version > mine && nativeBuild >= (m.minNative ?? 0);
}

/** What the workflow signs (scripts/sign-app-bundle.mjs writes the same). */
export function signedText(m: Pick<Manifest, 'version' | 'url' | 'sha256' | 'minNative'>): string {
  return `mindfulness-app-bundle\n${m.version}\n${m.url}\n${m.sha256}\n${m.minNative ?? 0}`;
}

const fromBase64 = (b: string) => Uint8Array.from(atob(b), (c) => c.charCodeAt(0));

/** Whether this app's key confirms the manifest's signature. */
export async function signatureHolds(m: Manifest, publicKey = UPDATE_PUBLIC_KEY): Promise<boolean> {
  try {
    if (typeof m.sig !== 'string' || typeof m.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(m.sha256)) return false;
    return await ed.verifyAsync(fromBase64(m.sig), new TextEncoder().encode(signedText(m)), fromBase64(publicKey));
  } catch {
    return false;
  }
}

/** At the start: a copy downloaded last time takes over now. Returns true if the app is reloading. */
export async function switchToPending(): Promise<boolean> {
  let id: string | null = null;
  try { id = localStorage.getItem(PENDING); localStorage.removeItem(PENDING); } catch { /* ignore */ }
  if (!id) return false;
  const { CapacitorUpdater } = await import('@capgo/capacitor-updater');
  try {
    const { bundle } = await CapacitorUpdater.current();
    if (bundle.id === id) return false;
    await CapacitorUpdater.set({ id });
    return true;
  } catch {
    return false;
  }
}

async function check() {
  if (!navigator.onLine) return;
  const [{ CapacitorHttp }, { App }, { CapacitorUpdater }] = await Promise.all([
    import('@capacitor/core'), import('@capacitor/app'), import('@capgo/capacitor-updater'),
  ]);
  // As text, then read: GitHub may label the file as a plain download.
  const res = await CapacitorHttp.get({ url: MANIFEST, headers: { 'Cache-Control': 'no-cache' }, responseType: 'text' });
  if (res.status !== 200) return;
  const m = (typeof res.data === 'string' ? JSON.parse(res.data) : res.data) as Partial<Manifest>;
  const info = await App.getInfo();
  if (!isNewer(m, BUNDLE_VERSION, Number(info.build) || 0)) return;
  // Signed with the update key, or nothing happens (and a note is kept).
  // The plugin then checks the downloaded file against the signed SHA-256.
  if (!(await signatureHolds(m))) {
    recordError('app-update', new Error(`update ${m.version}: signature does not hold`));
    return;
  }
  const bundle = await CapacitorUpdater.download({ url: m.url, version: String(m.version), checksum: m.sha256! });
  try { localStorage.setItem(PENDING, bundle.id); } catch { /* ignore */ }
}

export async function startUpdates() {
  const { CapacitorUpdater } = await import('@capgo/capacitor-updater');
  // This copy started fine: keep it (otherwise the plugin rolls back).
  await CapacitorUpdater.notifyAppReady();
  // Look a little after the start, when the page has settled.
  window.setTimeout(() => { check().catch((e) => recordError('app-update', e)); }, 5000);
}
