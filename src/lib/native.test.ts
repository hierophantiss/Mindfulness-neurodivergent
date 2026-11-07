import { afterEach, describe, expect, it } from 'vitest';
import { isNative, remote, SITE } from './native';

const w = window as { Capacitor?: unknown };

describe('native', () => {
  afterEach(() => { delete w.Capacitor; });

  it('is the website by default: paths stay as they are', () => {
    expect(isNative()).toBe(false);
    expect(remote('/audio/app-el-01.mp3')).toBe('/audio/app-el-01.mp3');
  });

  it('in the Android app, the site’s own files go to the site', () => {
    w.Capacitor = { isNativePlatform: () => true };
    expect(isNative()).toBe(true);
    expect(remote('/audio/app-el-01.mp3')).toBe(`${SITE}/audio/app-el-01.mp3`);
    expect(remote('https://example.org/x')).toBe('https://example.org/x');
  });
});
