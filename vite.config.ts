import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        // A new version waits; it is applied on the next start, or when you go
        // back to the home page, never in the middle of a practice or a chapter.
        registerType: 'prompt',
        injectRegister: null,           // we register manually in the entry point
        manifest: false,                // keep existing public/manifest.json
        workbox: {
          // The app itself (and the shell page), not the 248 prerendered pages: those
          // are for search engines and load from the network when opened.
          globPatterns: ['**/*.{js,css,woff2,svg,ico}', 'index.html'],
          globIgnores: ['**/*.{mp4,pdf,png,jpg}', '**/*_debug.html'],
          // The cat companion, so it shows offline too.
          additionalManifestEntries: [{ url: '/cat-192.png', revision: 'cat-2026-10-19' }],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/\.(?:pdf|epub)$/, /^\/workbook_/, /^\/animations\//, /^\/audio\//],
          ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^lang$/],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          cleanupOutdatedCaches: true,
          clientsClaim: false,
          skipWaiting: false
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
