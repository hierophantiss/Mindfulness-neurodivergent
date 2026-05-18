import fs from 'fs';
import path from 'path';

const p = path.join(process.cwd(), 'node_modules/vite-plugin-prerender/dist/index.mjs');
if (fs.existsSync(p)) {
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('createRequire')) {
    c = 'import { createRequire } from "module"; const require = createRequire(import.meta.url);\n' + c;
  }
  // Also log the actual error out in the catch block
  if (c.includes('const msg = "[vite-plugin-prerender] Unable to prerender all routes!";')) {
    c = c.replace('const msg = "[vite-plugin-prerender] Unable to prerender all routes!";\n    console.error(msg);', 'console.error("[vite-plugin-prerender] Unable to prerender all routes!", err);');
  }
  fs.writeFileSync(p, c);
  console.log('✅ Patched vite-plugin-prerender');
}

