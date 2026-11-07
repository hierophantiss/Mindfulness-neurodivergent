/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

/** When this version was built (vite.config.ts). */
declare const __BUILD_DATE__: string;

interface ImportMetaEnv {
  /** The Android app's copy number: the workflow run that built it. */
  readonly VITE_BUNDLE_VERSION?: string;
}
