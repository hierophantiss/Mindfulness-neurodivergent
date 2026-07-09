const fs = require('fs');
let code = fs.readFileSync('src/components/PracticeSection.tsx', 'utf8');

if (!code.includes("import { motion, AnimatePresence }")) {
  code = code.replace(
    'import { useNavigate } from "react-router-dom";',
    'import { useNavigate } from "react-router-dom";\nimport { motion, AnimatePresence } from "motion/react";'
  );
}

const orig = `<div className="relative h-6 mt-1 flex items-center justify-center">
                   <p className="text-[11px] md:text-xs font-sans tracking-[0.2em] uppercase font-medium transition-colors"
                      style={{ color: isRising ? 'rgba(125,211,252,0.7)' : (elapsed > inhale + holdFull && elapsed <= inhale + holdFull + exhale) ? 'rgba(94,234,212,0.7)' : 'rgba(252,211,77,0.7)' }}>
                     {lang === 'el' ? phaseNameEl : phaseNameEn}
                   </p>
                 </div>`;

const repl = `<div className="relative h-6 mt-1 flex items-center justify-center w-full">
                   <AnimatePresence>
                     <motion.div
                       key={phaseNameEn}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       transition={{ duration: 0.3, ease: 'easeInOut' }}
                       className="absolute text-[11px] md:text-xs font-sans tracking-[0.2em] uppercase font-medium text-center whitespace-nowrap"
                       style={{ color: isRising ? 'rgba(125,211,252,0.7)' : (elapsed > inhale + holdFull && elapsed <= inhale + holdFull + exhale) ? 'rgba(94,234,212,0.7)' : 'rgba(252,211,77,0.7)' }}
                     >
                       {lang === 'el' ? phaseNameEl : phaseNameEn}
                     </motion.div>
                   </AnimatePresence>
                 </div>`;

code = code.replace(orig, repl);
fs.writeFileSync('src/components/PracticeSection.tsx', code);
console.log('Patched PracticeSection crossfade');
