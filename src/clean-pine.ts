import fs from 'fs';
let code = fs.readFileSync('src/pages/Method.tsx', 'utf-8');
code = code.replace(/text-pine-100/g, 'text-[#d4d4d8]')
           .replace(/text-pine-200\/90/g, 'text-[#d4d4d8]/90')
           .replace(/text-pine-200/g, 'text-[#d4d4d8]')
           .replace(/text-pine-300/g, 'text-[#d4d4d8]/80')
           .replace(/bg-pine-950/g, 'bg-[#0f1117]')
           .replace(/bg-pine-\d+\/\d+/g, 'bg-white/[0.04]')
           .replace(/border-pine-\d+\/\d+/g, 'border-white/[0.05]')
           .replace(/bg-pine-\d+/g, 'bg-[#1a1d27]');
fs.writeFileSync('src/pages/Method.tsx', code);
console.log('done!');
