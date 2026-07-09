const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Tighten quote margins
code = code.replace(
  'className="text-center px-4"',
  'className="text-center px-4 mt-1 mb-1"'
);

// Reduce gap-10 to gap-6 in Dashboard Content
code = code.replace(
  'className="w-full max-w-lg px-5 flex flex-col gap-10"',
  'className="w-full max-w-lg px-5 flex flex-col gap-6"'
);

// Replace pt-2 with pt-1 in main container
code = code.replace(
  'gap-2 lg:gap-16 pt-2 lg:pt-12',
  'gap-2 lg:gap-16 pt-1 lg:pt-12'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
console.log('Applied patch_dash6');
