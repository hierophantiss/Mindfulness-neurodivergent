const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// 1. pt-12 to pt-4 lg:pt-12 and gap-8 to gap-2 lg:gap-16
code = code.replace(
  'gap-8 lg:gap-16 pt-12',
  'gap-2 lg:gap-16 pt-2 lg:pt-12'
);

// 2. Hero section gap-6 to gap-2 lg:gap-6
code = code.replace(
  'justify-center items-center px-4 gap-6 pt-[calc(env(safe-area-inset-top,0px)+1rem)] lg:pt-0',
  'justify-center items-center px-4 gap-2 lg:gap-6 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] lg:pt-0'
);

// 3. Remove mb-2 from Second Row
code = code.replace(
  'className="w-full flex items-center justify-start gap-2 px-2 mb-2"',
  'className="w-full flex items-center justify-start gap-2 px-2"'
);

// 4. Scale down FourfoldAxisHero to w-[85%] on mobile
code = code.replace(
  '<FourfoldAxisHero activeAxis={effectiveAxis} />',
  '<div className="w-[85%] md:w-full mx-auto flex items-center justify-center"><FourfoldAxisHero activeAxis={effectiveAxis} /></div>'
);

// 5. Suggestion: reduce mt-2 to mt-0, p-5 to p-4, gap-3 to gap-2
code = code.replace(
  'className="w-full max-w-sm mt-2 rounded-[24px] bg-[#1a1f26]/40 backdrop-blur-xl border border-white/[0.04] p-5 flex flex-col gap-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]"',
  'className="w-full max-w-sm mt-0 rounded-[24px] bg-[#1a1f26]/40 backdrop-blur-xl border border-white/[0.04] p-4 flex flex-col gap-2 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]"'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
console.log('Applied patch_dash5');
