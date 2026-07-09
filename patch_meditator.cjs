const fs = require('fs');
let code = fs.readFileSync('src/components/MeditatorFigure.tsx', 'utf8');

// Fix sway cycle duration
code = code.replace(
  'duration: 4.5,',
  'duration: 2.25,'
);

// In case the transition config duration is too long for reduced motion, but it's fine.
fs.writeFileSync('src/components/MeditatorFigure.tsx', code);
console.log('Applied patch_meditator');
