const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/text-pine-100/g, 'text-zinc-100');
  content = content.replace(/text-pine-200/g, 'text-zinc-200');
  content = content.replace(/text-pine-300/g, 'text-zinc-300');
  content = content.replace(/text-pine-400/g, 'text-zinc-400');
  content = content.replace(/text-pine-500/g, 'text-zinc-500');
  content = content.replace(/text-pine-600/g, 'text-zinc-600');
  
  content = content.replace(/bg-pine-600/g, 'bg-zinc-600');
  content = content.replace(/bg-pine-700/g, 'bg-zinc-700');
  content = content.replace(/bg-pine-800/g, 'bg-zinc-800');
  content = content.replace(/bg-pine-900/g, 'bg-zinc-900');
  content = content.replace(/bg-pine-950/g, 'bg-zinc-950');

  content = content.replace(/border-pine-300/g, 'border-zinc-300');
  content = content.replace(/border-pine-600/g, 'border-zinc-600');
  content = content.replace(/border-pine-700/g, 'border-zinc-700');
  content = content.replace(/border-pine-800/g, 'border-zinc-800');
  content = content.replace(/border-pine-900/g, 'border-zinc-900');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', filePath);
}

fixFile('src/pages/PracticeBreath.tsx');
fixFile('src/pages/GenericExercise.tsx');
fixFile('src/pages/Faq.tsx');
