const fs = require('fs');

let code = fs.readFileSync('src/pages/PracticeBreath.tsx', 'utf8');

const original = `{/* Phase Text Overlay inside hero card */}
                <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                  {running && (
                    <div className="flex flex-col items-center">`;

const replacement = `{/* Phase Text Overlay inside hero card */}
                <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                  {running && pattern.category !== 'vocal' && (
                    <div className="flex flex-col items-center">`;

code = code.replace(original, replacement);
fs.writeFileSync('src/pages/PracticeBreath.tsx', code);
console.log('Applied patch_practice_breath');
