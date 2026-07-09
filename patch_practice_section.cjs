const fs = require('fs');
let code = fs.readFileSync('src/components/PracticeSection.tsx', 'utf8');

const orig = `<div className="text-4xl font-mono font-light text-white/80 tracking-[0.3em] drop-shadow-md">
                 {currentSec} <span className="text-2xl text-white/40 tracking-[0.3em] relative -top-0.5">/ {totalPhaseSec}</span>
             </div>`;

const repl = `<div className="flex flex-col items-center">
                 <div className="text-4xl font-mono font-light tracking-[0.3em] drop-shadow-md transition-colors"
                      style={{ color: isRising ? '#7dd3fc' : (elapsed > inhale + holdFull && elapsed <= inhale + holdFull + exhale) ? '#5eead4' : '#fcd34d' }}>
                     {currentSec} <span className="text-2xl opacity-50 relative -top-0.5">/ {totalPhaseSec}</span>
                 </div>
                 <div className="relative h-6 mt-1 flex items-center justify-center">
                   <p className="text-[11px] md:text-xs font-sans tracking-[0.2em] uppercase font-medium transition-colors"
                      style={{ color: isRising ? 'rgba(125,211,252,0.7)' : (elapsed > inhale + holdFull && elapsed <= inhale + holdFull + exhale) ? 'rgba(94,234,212,0.7)' : 'rgba(252,211,77,0.7)' }}>
                     {lang === 'el' ? phaseNameEl : phaseNameEn}
                   </p>
                 </div>
             </div>`;

code = code.replace(orig, repl);
fs.writeFileSync('src/components/PracticeSection.tsx', code);
console.log('Patched PracticeSection.tsx');
