const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  'className="w-full max-w-xs md:max-w-sm lg:max-w-md lg:sticky lg:top-24 flex-shrink-0 flex flex-col justify-center items-center px-4 gap-2 lg:gap-6 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] lg:pt-0"',
  'className="w-full max-w-xs md:max-w-sm lg:max-w-md lg:sticky lg:top-24 flex-shrink-0 flex flex-col justify-center items-center px-4 gap-2 lg:gap-6 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] lg:pt-0 lg:pb-[calc(5rem+env(safe-area-inset-bottom))]"'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
console.log('Applied patch_dash9');
