const fs = require('fs');

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

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace transition={{ with transition={reduceMotion ? { duration: 0.01 } : {
  // Be careful with multiple occurrences
  content = content.replace(/transition=\{\{/g, 'transition={reduceMotion ? { duration: 0.01 } : {');
  
  // For InfoModal and other files that don't have transition, let's inject it into motion.div!
  // Wait, if it doesn't have transition, it uses default.
  // Instead of injecting into all motion.div, we can inject `transition={reduceMotion ? { duration: 0.01 } : undefined}` 
  // But injecting that into all `<motion.` might conflict with existing transitions.
  
  fs.writeFileSync(file, content);
}
console.log('Done!');
