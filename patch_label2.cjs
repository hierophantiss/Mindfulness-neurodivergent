const fs = require('fs');
let code = fs.readFileSync('src/pages/PracticeBreath.tsx', 'utf8');

const orig = `                      <div className="relative h-6 mt-1 flex items-center justify-center">
                        <AnimatePresence mode="popLayout">
                          <motion.div
                            key={phaseIdx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className={cn(
                              "text-[11px] md:text-xs font-sans tracking-[0.2em] uppercase font-medium",
                              isInhale ? "text-[#7dd3fc]/70" : isExhale ? "text-[#5eead4]/70" : "text-[#fcd34d]/70"
                            )}`;

const repl = `                      <div className="relative h-6 mt-1 flex items-center justify-center w-full">
                        <AnimatePresence>
                          <motion.div
                            key={phaseIdx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className={cn(
                              "absolute text-[11px] md:text-xs font-sans tracking-[0.2em] uppercase font-medium text-center whitespace-nowrap",
                              isInhale ? "text-[#7dd3fc]/70" : isExhale ? "text-[#5eead4]/70" : "text-[#fcd34d]/70"
                            )}`;

code = code.replace(orig, repl);
fs.writeFileSync('src/pages/PracticeBreath.tsx', code);
console.log('Patched label crossfade');
