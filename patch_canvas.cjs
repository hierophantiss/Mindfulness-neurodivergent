const fs = require('fs');
const file = 'src/components/InteractiveBackground.tsx';
let content = fs.readFileSync(file, 'utf8');

// Inside `const animate = (time: number) => {`, we can just do early return if we want static canvas, but we need to draw it once.
// We can just add `if (reduceMotion) { time = 0; }` ? No, time is passed by requestAnimationFrame.
// Alternatively, we can just skip the requestAnimationFrame loop or not increment physics.

content = content.replace(
  'const animate = (time: number) => {',
  'const animate = (time: number) => {\n      if (reduceMotion) time = 0;'
);

content = content.replace(
  'p.y += p.speedY;',
  'if (!reduceMotion) p.y += p.speedY;'
);
content = content.replace(
  'p.x += p.speedX;',
  'if (!reduceMotion) p.x += p.speedX;'
);

fs.writeFileSync(file, content);
