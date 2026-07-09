const fs = require('fs');
let code = fs.readFileSync('src/components/BreathingHero.tsx', 'utf8');

code = code.replace(
  "const breathPhase = isInhale ? 'inhale' : isExhale ? 'exhale' : phaseIdx === 1 ? 'hold' : 'rest';",
  "const breathPhase = phaseIdx === -1 ? 'idle' : isInhale ? 'inhale' : isExhale ? 'exhale' : phaseIdx === 1 ? 'hold' : 'rest';"
);

fs.writeFileSync('src/components/BreathingHero.tsx', code);
console.log('Applied patch_breathing_hero2');
