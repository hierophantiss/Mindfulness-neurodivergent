const fs = require('fs');

const filesToPatch = [
  'src/data/breathPatterns.ts',
  'src/components/Onboarding.tsx',
  'src/pages/GenericExercise.tsx',
  'src/components/BreathCanvas.tsx',
  'src/data/chapters.ts'
];

for(const f of filesToPatch) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/hero_breathing\.mp4/g, 'infinity_greeting.mp4');
    content = content.replace(/raising_arms\.mp4/g, 'infinity_greeting.mp4');
    content = content.replace(/deep_bow\.mp4/g, 'infinity_greeting.mp4');
    content = content.replace(/tree_pose\.mp4/g, 'infinity_greeting.mp4');
    content = content.replace(/lotus_bloom\.mp4/g, 'infinity_greeting.mp4');
    content = content.replace(/bending_forward\.mp4/g, 'infinity_greeting.mp4');
    content = content.replace(/be_like_a_flower\.mp4/g, 'infinity_greeting.mp4');
    fs.writeFileSync(f, content);
  }
}
