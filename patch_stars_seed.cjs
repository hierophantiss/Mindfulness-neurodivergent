const fs = require('fs');
let code = fs.readFileSync('src/components/MeditatorFigure.tsx', 'utf8');

// Replace STARFIELD to use seeded pseudo-random
const orig = `const STARFIELD = Array.from({ length: 45 }).map((_, i) => ({
  id: i,
  cx: Math.random() * 340,
  cy: Math.random() * 380, // Cover most of the background, except the very bottom
  r: 0.5 + Math.random() * 1.5,
  baseOpacity: 0.2 + Math.random() * 0.5,
  dur: 8 + Math.random() * 8,
  delay: Math.random() * -15
}));`;

const seeded = `// Pseudo-random for stable SSR hydration
const prng = (seed) => () => {
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
const rand = prng(12345);

const STARFIELD = Array.from({ length: 45 }).map((_, i) => ({
  id: i,
  cx: rand() * 340,
  cy: rand() * 380,
  r: 0.5 + rand() * 1.5,
  baseOpacity: 0.2 + rand() * 0.5,
  dur: 8 + rand() * 8,
  delay: rand() * -15
}));`;

code = code.replace(orig, seeded);
fs.writeFileSync('src/components/MeditatorFigure.tsx', code);
console.log('Patched starfield with PRNG');
