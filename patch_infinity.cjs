const fs = require('fs');
let code = fs.readFileSync('src/components/MeditatorFigure.tsx', 'utf8');

// Replace the space rays group wrapper
code = code.replace(
  '<g className="axis-layer space-rays" style={{ opacity: getOpacity(\'space\') }} transform="translate(0, 52)">',
  '<g className="axis-layer space-rays" transform="translate(0, 52)">'
);

// We need to apply getOpacity('space') only to the rays
code = code.replace(
  '{showAxisSymbols === \'all\' && (',
  '<g style={{ opacity: getOpacity(\'space\') }}>{showAxisSymbols === \'all\' && ('
);

code = code.replace(
  '</g>\n              )}\n              \n              {/* Infinity Core',
  '</g>\n              )}</g>\n              \n              {/* Infinity Core'
);

fs.writeFileSync('src/components/MeditatorFigure.tsx', code);
console.log('Applied patch_infinity');
