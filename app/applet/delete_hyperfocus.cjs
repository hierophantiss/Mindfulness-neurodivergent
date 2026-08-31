const fs = require('fs');
let code = fs.readFileSync('src/data/chapters.ts', 'utf8');

code = code.replace(
  /\{\s*title:\s*'Αγκυλωμένη Προσοχή \(Hyperfocus\)'[\s\S]*?interactive:\s*"camera_exercise"\},?\s*/g,
  ''
);

fs.writeFileSync('src/data/chapters.ts', code);
