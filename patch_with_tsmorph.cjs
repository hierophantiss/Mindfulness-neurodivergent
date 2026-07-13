const { Project, SyntaxKind } = require('ts-morph');

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

const project = new Project();
project.addSourceFilesAtPaths(files);

for (const sourceFile of project.getSourceFiles()) {
  const filePath = sourceFile.getFilePath();
  
  // Add import if missing
  if (!sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue().includes('hooks/useAccessibility'))) {
    const depth = filePath.split('/').length - 4; // 'app/applet/src/...'
    const prefix = depth === 1 ? '../' : '../../'; // simple heuristic
    // actually just look at the file path relative to src
    const relPath = filePath.split('/src/')[1];
    const prefix2 = relPath.includes('/') ? '../' : './';
    
    sourceFile.addImportDeclaration({
      namedImports: ['useAccessibility'],
      moduleSpecifier: `${prefix2}hooks/useAccessibility`
    });
  }

  // Find all React component functions (Functions or ArrowFunctions that return JSX)
  const functions = [...sourceFile.getFunctions(), ...sourceFile.getDescendantsOfKind(SyntaxKind.ArrowFunction)];
  
  for (const func of functions) {
    // Check if it returns JSX
    const hasJsx = func.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 || 
                   func.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0;
    const hasMotion = func.getText().includes('motion.') || func.getText().includes('AnimatePresence');
    
    // In InteractiveBackground, it doesn't use motion heavily inside the main JSX, but it uses canvas
    // Wait, InteractiveBackground does have motion.div.
    
    if (hasJsx && (hasMotion || filePath.includes('InteractiveBackground'))) {
      // Check if it already has reduceMotion
      if (!func.getText().includes('useAccessibility')) {
        const body = func.getBody();
        if (body && body.getKind() === SyntaxKind.Block) {
          body.insertStatements(0, 'const { reduceMotion } = useAccessibility();');
        }
      }
    }
  }
  
  sourceFile.saveSync();
}
console.log('ts-morph done');
