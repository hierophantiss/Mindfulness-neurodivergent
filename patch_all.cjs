const fs = require('fs');

const fileComponentMap = {
  'src/components/InfoModal.tsx': 'InfoModal({',
  'src/components/OfflineNotification.tsx': 'OfflineNotification() {',
  'src/components/SwayingHero.tsx': 'SwayingHero({',
  'src/components/PlayPauseOverlay.tsx': 'PlayPauseOverlay({',
  'src/components/ConceptInfoOverlay.tsx': 'ConceptInfoOverlay({',
  'src/components/PracticeSection.tsx': 'PracticeSection() {',
  'src/components/StateCheckin.tsx': 'StateCheckin({',
  'src/components/InteractiveRenderer.tsx': 'InteractiveRenderer({',
  'src/components/InteractiveBackground.tsx': 'InteractiveBackground() {',
  'src/components/BreathHeroVessel.tsx': 'BreathHeroVessel({',
  'src/components/Layout.tsx': 'Layout({',
  'src/components/DesktopNavigation.tsx': 'DesktopNavigation() {',
  'src/components/Companion.tsx': 'Companion() {',
  'src/components/BreathVessel.tsx': 'BreathVessel({',
  'src/pages/Journal.tsx': 'Journal() {',
  'src/pages/ProgramWeek.tsx': 'ProgramWeek() {',
  'src/pages/RabbitHole.tsx': 'RabbitHole() {',
  'src/pages/ChapterDetail.tsx': 'ChapterDetail() {',
  'src/pages/Sanctuary.tsx': 'Sanctuary() {'
};

for (const [file, signature] of Object.entries(fileComponentMap)) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  const depth = file.split('/').length - 2;
  const prefix = '../'.repeat(depth);
  const importStmt = `import { useAccessibility } from '${prefix}hooks/useAccessibility';\n`;
  if (!content.includes('useAccessibility')) {
    content = importStmt + content;
  }
  
  // Find the signature and insert the hook right after it
  // But wait, the signature might have newlines or different spaces.
  // We can use a regex that matches the component name and the opening brace.
  const compName = signature.split('(')[0];
  const regex = new RegExp(`(export (?:default )?function ${compName}\\s*\\([^)]*\\)[^{]*\\{)`);
  
  if (regex.test(content)) {
    content = content.replace(regex, `$1\n  const { reduceMotion } = useAccessibility();\n`);
  } else {
    console.log('Could not find component signature for', file);
  }
  
  // Now replace transition={{
  if (file !== 'src/components/BreathVessel.tsx' && file !== 'src/components/BreathHeroVessel.tsx') {
    content = content.replace(/transition=\{\{/g, 'transition={reduceMotion ? { duration: 0.01 } : {');
  } else {
    // For BreathVessel and BreathHeroVessel, we conditionally disable the glow filter
    content = content.replace(/filter="url\(#glow\)"/g, 'filter={reduceMotion ? undefined : "url(#glow)"}');
    content = content.replace(/filter="url\(#glowDrop\)"/g, 'filter={reduceMotion ? undefined : "url(#glowDrop)"}');
  }
  
  fs.writeFileSync(file, content);
}
console.log('Done mapping components!');
