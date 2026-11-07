import { describe, expect, it } from 'vitest';
import { isNewer } from './nativeUpdate';

describe('isNewer', () => {
  const m = { version: 12, url: 'https://github.com/x/app-bundle-12.zip', minNative: 1 };
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
});
