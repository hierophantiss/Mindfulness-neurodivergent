const fs = require('fs');
const file = 'src/components/FourfoldAxisHero.tsx';
let code = fs.readFileSync(file, 'utf8');

// We need to import MeditatorFigure and replace the SVG entirely
const replaceStart = code.indexOf('<div className="relative inline-block w-full">');
const replaceEnd = code.lastIndexOf('</div>');

const topImportsEnd = code.indexOf('export interface FourfoldAxisHeroProps {');

let imports = code.slice(0, topImportsEnd);
imports = imports.replace("import { X } from 'lucide-react';", "import { X } from 'lucide-react';\nimport { MeditatorFigure } from './MeditatorFigure';");

const newBody = `  return (
    <MeditatorFigure 
      showAxisSymbols="all"
      animationMode="idle"
      withEarth={true}
      hoveredAxis={hoveredAxis}
      activeAxis={activeAxis}
      onAxisHover={setHoveredAxis}
      onAxisClick={handleAxisClick}
    />
  );
};
`;

const finalCode = imports + code.slice(topImportsEnd, replaceStart) + newBody;
fs.writeFileSync(file, finalCode);
console.log('Applied patch_fourfold');
