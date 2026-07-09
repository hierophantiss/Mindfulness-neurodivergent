const fs = require('fs');

let code = fs.readFileSync('src/pages/PracticeBreath.tsx', 'utf8');

code = code.replace(
  'phaseIdx={running ? phaseIdx : 0}',
  'phaseIdx={running ? phaseIdx : -1}'
);

fs.writeFileSync('src/pages/PracticeBreath.tsx', code);
console.log('Applied patch_practice_breath');
