const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Revert patch_dash7 because it added padding inside the flow on mobile
code = code.replace(
  'className="w-full max-w-xs md:max-w-sm lg:max-w-md lg:sticky lg:top-24 flex-shrink-0 flex flex-col justify-center items-center px-4 gap-2 lg:gap-6 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] lg:pt-0 pb-[calc(4rem+env(safe-area-inset-bottom)+1rem)] lg:pb-0"',
  'className="w-full max-w-xs md:max-w-sm lg:max-w-md lg:sticky lg:top-24 flex-shrink-0 flex flex-col justify-center items-center px-4 gap-2 lg:gap-6 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] lg:pt-0"'
);

// Apply the requested padding to the root container, replacing pb-28
code = code.replace(
  'className="relative w-full min-h-screen bg-transparent overflow-x-hidden text-white font-sans selection:bg-[#4a9eca]/30 selection:text-white pb-28"',
  'className="relative w-full min-h-screen bg-transparent overflow-x-hidden text-white font-sans selection:bg-[#4a9eca]/30 selection:text-white pb-[calc(5rem+env(safe-area-inset-bottom))]"'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
console.log('Applied patch_dash8');
