import fs from 'fs';
import path from 'path';

const p = path.join(process.cwd(), 'node_modules/vite-plugin-prerender/dist/index.mjs');
if (fs.existsSync(p)) {
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('createRequire')) {
    c = 'import { createRequire } from "module"; const require = createRequire(import.meta.url);\n' + c;
    fs.writeFileSync(p, c);
    console.log('✅ Patched vite-plugin-prerender');
  }
}
