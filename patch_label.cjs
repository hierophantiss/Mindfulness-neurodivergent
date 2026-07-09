const fs = require('fs');
let code = fs.readFileSync('src/pages/PracticeBreath.tsx', 'utf8');

const original = `<div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center pointer-events-none">
                  {running && (
                    <p className={cn("text-2xl tracking-[0.2em] font-mono font-light transition-colors text-center drop-shadow-md", isInhale ? "text-[#7dd3fc]" : isExhale ? "text-[#5eead4]" : "text-[#fcd34d]")}>
                      {phaseSeconds} <span className="text-lg opacity-50 relative -top-0.5">/ {maxSeconds}</span>
                    </p>
                  )}
                </div>`;

const replacement = `<div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                  {running && (
                    <div className="flex flex-col items-center">
                      <p className={cn("text-2xl tracking-[0.2em] font-mono font-light transition-colors text-center drop-shadow-md", isInhale ? "text-[#7dd3fc]" : isExhale ? "text-[#5eead4]" : "text-[#fcd34d]")}>
                        {phaseSeconds} <span className="text-lg opacity-50 relative -top-0.5">/ {maxSeconds}</span>
                      </p>
                      <div className="relative h-6 mt-1 flex items-center justify-center">
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
                            )}
                          >
                            {isInhale ? (language === 'el' ? 'Εισπνοή' : 'Inhale') : 
                             isExhale ? (language === 'el' ? 'Εκπνοή' : 'Exhale') : 
                             phaseIdx === 1 ? (language === 'el' ? 'Κράτημα' : 'Hold') : 
                             (language === 'el' ? 'Παύση' : 'Rest')}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>`;

code = code.replace(original, replacement);
fs.writeFileSync('src/pages/PracticeBreath.tsx', code);
console.log("Patched label in PracticeBreath.tsx");
