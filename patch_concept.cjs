const fs = require('fs');
let content = fs.readFileSync('src/components/ConceptInfoOverlay.tsx', 'utf8');

const regex = /(export function ConceptModal\s*\([^)]*\)[^{]*\{)/;
if (regex.test(content)) {
  content = content.replace(regex, `$1\n  const { reduceMotion } = useAccessibility();\n`);
}
content = content.replace(/transition=\{\{/g, 'transition={reduceMotion ? { duration: 0.01 } : {');

fs.writeFileSync('src/components/ConceptInfoOverlay.tsx', content);
