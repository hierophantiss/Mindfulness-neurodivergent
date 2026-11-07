// Updates for the Android app without the store: the site's files, built by
// the "Android" workflow, wait in this repository's GitHub release
// "app-bundle" (app-bundle.json says which is newest). With a connection, the
// app asks once after it opens, downloads a newer copy quietly and switches to
// it the next time it opens, never in the middle of a practice. If a new copy
// fails to start, the plugin goes back to the one that worked.
//
// Nothing about the person is sent: it is one request for a small file.
// The plugin's own reporting to Capgo is off (capacitor.config.ts).

const MANIFEST = 'https://github.com/hierophantiss/Mindfulness-neurodivergent/releases/download/app-bundle/app-bundle.json';
const PENDING = 'n_mindfulness_app_bundle_next';

/** This copy's number: the workflow run that built it (0 when built by hand). */
export const BUNDLE_VERSION = Number(import.meta.env.VITE_BUNDLE_VERSION || 0);

interface Manifest { version: number; url: string; sha256?: string; minNative?: number }

export function isNewer(m: Partial<Manifest> | null | undefined, mine: number, nativeBuild: number): m is Manifest {
  return !!m && typeof m.version === 'number' && typeof m.url === 'string' && /^https:\/\//.test(m.url)
    && m.version > mine && nativeBuild >= (m.minNative ?? 0);
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
  const res = await CapacitorHttp.get({ url: MANIFEST, headers: { 'Cache-Control': 'no-cache' } });
  if (res.status !== 200) return;
  const m = (typeof res.data === 'string' ? JSON.parse(res.data) : res.data) as Partial<Manifest>;
  const info = await App.getInfo();
  if (!isNewer(m, BUNDLE_VERSION, Number(info.build) || 0)) return;
  // The bundle comes over HTTPS from the repository's own release.
  const bundle = await CapacitorUpdater.download({ url: m.url, version: String(m.version) });
  try { localStorage.setItem(PENDING, bundle.id); } catch { /* ignore */ }
}

export async function startUpdates() {
  const { CapacitorUpdater } = await import('@capgo/capacitor-updater');
  // This copy started fine: keep it (otherwise the plugin rolls back).
  await CapacitorUpdater.notifyAppReady();
  // Look a little after the start, when the page has settled.
  window.setTimeout(() => { check().catch(() => { /* next time */ }); }, 5000);
}
