const fs = require('fs');
const babel = require('@babel/core');

const files = [
  'src/components/InfoModal.tsx',
  'src/components/OfflineNotification.tsx',
  'src/components/SwayingHero.tsx',
  'src/components/PlayPauseOverlay.tsx',
  'src/components/ConceptInfoOverlay.tsx',
  'src/components/PracticeSection.tsx',
  'src/components/StateCheckin.tsx',
  'src/components/InteractiveRenderer.tsx',
  'src/components/InteractiveBackground.tsx',
  'src/components/BreathHeroVessel.tsx',
  'src/components/Layout.tsx',
  'src/components/DesktopNavigation.tsx',
  'src/components/Companion.tsx',
  'src/components/BreathVessel.tsx',
  'src/pages/Journal.tsx',
  'src/pages/ProgramWeek.tsx',
  'src/pages/RabbitHole.tsx',
  'src/pages/ChapterDetail.tsx',
  'src/pages/Sanctuary.tsx'
];

function transformFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Quick regex to add the import if missing
  const depth = file.split('/').length - 2;
  const prefix = '../'.repeat(depth);
  if (!code.includes('useAccessibility')) {
    code = `import { useAccessibility } from '${prefix}hooks/useAccessibility';\n` + code;
  }

  // We can just find all `transition={{` and replace them.
  // And to define `reduceMotion`, we can do it via a simple regex for ALL functions that contain `motion.`
  // Actually, wait, what if I just use a regular expression to find all component declarations and insert the hook?
  
  fs.writeFileSync(file, code);
}
