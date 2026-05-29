import fs from 'fs';

function cleanFile(path) {
  let code = fs.readFileSync(path, 'utf-8');
  code = code.replace(/text-pine-100/g, 'text-zinc-100')
             .replace(/text-pine-200\/90/g, 'text-zinc-200/90')
             .replace(/text-pine-200/g, 'text-zinc-200')
             .replace(/text-pine-300/g, 'text-zinc-300')
             .replace(/text-pine-400/g, 'text-zinc-400')
             .replace(/text-pine-500/g, 'text-zinc-500')
             .replace(/bg-pine-950/g, 'bg-zinc-950')
             .replace(/bg-[#061114]/g, 'bg-zinc-950')
             .replace(/bg-pine-900\/90/g, 'bg-zinc-900/90')
             .replace(/bg-pine-900/g, 'bg-zinc-900')
             .replace(/bg-pine-800\/80/g, 'bg-zinc-800/80')
             .replace(/bg-pine-800\/50/g, 'bg-zinc-800/50')
             .replace(/bg-pine-800\/40/g, 'bg-zinc-800/40')
             .replace(/bg-pine-800/g, 'bg-zinc-800')
             .replace(/bg-pine-700/g, 'bg-zinc-700')
             .replace(/bg-pine-600/g, 'bg-zinc-600')
             .replace(/border-pine-900/g, 'border-zinc-900')
             .replace(/border-pine-800/g, 'border-zinc-800')
             .replace(/border-pine-700/g, 'border-zinc-700')
             .replace(/border-pine-600/g, 'border-zinc-600')
             .replace(/border-pine-300/g, 'border-zinc-300');
  fs.writeFileSync(path, code);
  console.log('done!', path);
}

cleanFile('src/pages/PracticeBreath.tsx');
cleanFile('src/pages/GenericExercise.tsx');
cleanFile('src/pages/Faq.tsx');

