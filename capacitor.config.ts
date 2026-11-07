// The Android app: the whole site, built (dist/), inside the APK, so it opens
// and works with no connection and no website. Updates come in two ways: a new
// version through the store, or a newer copy of the site's files from this
// repository's GitHub Releases (src/lib/nativeUpdate.ts), checked quietly.
//
// CAP_TEST=1 builds a test copy with its own name and id, so it can sit next
// to the app from the store on the same phone.
import type { CapacitorConfig } from '@capacitor/cli';

const test = process.env.CAP_TEST === '1';

const config: CapacitorConfig = {
  appId: test ? 'org.neurodivergent_mindfulness.app.test' : 'org.neurodivergent_mindfulness.app',
  appName: test ? 'Mindfulness · δοκιμή' : 'Mindfulness',
  webDir: 'dist',
  // --color-bg (src/index.css): what shows for an instant before the page paints.
  backgroundColor: '#0f1117',
  android: {
    backgroundColor: '#0f1117',
  },
  plugins: {
    // Our own updates only: nothing goes to Capgo's servers (no stats, no channel).
    CapacitorUpdater: {
      autoUpdate: false,
      statsUrl: '',
      updateUrl: '',
      channelUrl: '',
      appReadyTimeout: 10000,
      autoDeleteFailed: true,
      autoDeletePrevious: true,
      resetWhenUpdate: true,
    },
    SystemBars: { style: 'DARK' },
  },
};

export default config;
