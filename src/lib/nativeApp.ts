// The Android app's own adjustments, loaded only inside the app (main.tsx):
// the pages reach under the status and navigation bars (the CSS already keeps
// clear of them with env(safe-area-inset-*)), and files are handed to the
// phone's share sheet, since an app's web view cannot "download" like a browser.
import { remote } from './native';

const BIG_REMOTE = /^\/audio\//; // the audiobook: large, it lives on the site

function coverWholeScreen() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (meta && !/viewport-fit/.test(meta.content)) meta.content += ', viewport-fit=cover';
}

async function blobToBase64(blob: Blob): Promise<string> {
  const url: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
  return url.slice(url.indexOf(',') + 1);
}

/** A file from the app (a PDF, the backup, a calendar file, the book): saved, then the share sheet opens. */
async function shareFile(href: string, name: string) {
  const [{ Filesystem, Directory }, { Share }] = await Promise.all([import('@capacitor/filesystem'), import('@capacitor/share')]);
  const blob = await (await fetch(href)).blob();
  const safe = name.replace(/[^\w.\-()Ͱ-Ͽ]+/g, '-') || 'file';
  const { uri } = await Filesystem.writeFile({ path: safe, data: await blobToBase64(blob), directory: Directory.Cache });
  await Share.share({ title: safe, files: [uri] });
}

async function openInBrowser(url: string) {
  const { Browser } = await import('@capacitor/browser');
  await Browser.open({ url });
}

function handleDownloads() {
  // Every <a download>, the ones in the page and the ones made in code
  // (week PDF, backup, reminder): one place for all of them.
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[download]') as HTMLAnchorElement | null;
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    const path = a.getAttribute('href') || '';
    const name = a.getAttribute('download') || decodeURIComponent(path.split('/').pop() || 'file');
    const task = BIG_REMOTE.test(path) ? openInBrowser(remote(path)) : shareFile(a.href, name);
    task.catch(() => { /* the person can try again; nothing is lost */ });
  }, true);
}

export async function startNativeApp() {
  coverWholeScreen();
  handleDownloads();
  const { startUpdates } = await import('./nativeUpdate');
  await startUpdates();
}
