import { isNative } from './native';

// Which version this is: the day it was built and, in the Android app, the
// copy number too (it rises when the app has updated itself).
export function versionText(lang: 'el' | 'en'): string {
  const day = new Date(`${__BUILD_DATE__}:00Z`).toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const copy = isNative() ? ` · ${import.meta.env.VITE_BUNDLE_VERSION || '0'}` : '';
  return `${lang === 'el' ? 'Έκδοση' : 'Version'} ${day}${copy}`;
}
