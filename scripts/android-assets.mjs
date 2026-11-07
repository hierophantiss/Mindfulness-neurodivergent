// The Android workflow's icon and splash sources, made from the app's own icons
// (public/) into assets/, which @capacitor/assets then turns into every size.
// Run in CI only; assets/ is never kept in the repository.
import { mkdirSync, copyFileSync } from 'node:fs';
import sharp from 'sharp';

const BG = '#0f1117'; // --color-bg (src/index.css)
mkdirSync('assets', { recursive: true });
copyFileSync('public/icon-512.png', 'assets/icon-only.png');
copyFileSync('public/icon-512-maskable.png', 'assets/icon-foreground.png');
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: BG } }).png().toFile('assets/icon-background.png');
const logo = await sharp('public/icon-512.png').resize(640, 640).toBuffer();
for (const name of ['splash.png', 'splash-dark.png']) {
  await sharp({ create: { width: 2732, height: 2732, channels: 4, background: BG } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(`assets/${name}`);
}
console.log('android assets ready');
