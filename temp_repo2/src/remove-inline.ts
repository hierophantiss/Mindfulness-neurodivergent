import * as fs from 'fs';

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Remove the inline styles that override soft-glass
content = content.replace(/style=\{\{ background: dayTheme\.bg, borderColor: dayTheme\.border \}\}/g, '');

fs.writeFileSync('src/pages/Dashboard.tsx', content, 'utf8');
console.log('Removed inline styles overriding soft-glass');
