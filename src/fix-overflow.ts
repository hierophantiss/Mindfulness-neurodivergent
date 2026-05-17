import * as fs from 'fs';

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Replace overflow-hidden on glass elements
content = content.replace(/soft-glass overflow-hidden/g, 'soft-glass');
content = content.replace(/overflow-hidden shape-cloud-1 soft-glass/g, 'shape-cloud-1 soft-glass');
content = content.replace(/soft-glass transition-all duration-300 active:scale-\[0.98\] overflow-hidden/g, 'soft-glass transition-all duration-300 active:scale-[0.98]');

// Add rounded-[inherit] to inner gradient overlays
content = content.replace(/absolute inset-0 bg-gradient-to-br via-transparent to-black\/40 pointer-events-none/g, 'absolute inset-0 bg-gradient-to-br via-transparent to-black/40 pointer-events-none rounded-[inherit]');

fs.writeFileSync('src/pages/Dashboard.tsx', content, 'utf8');
console.log('Fixed overflow-hidden on soft-glass components in Dashboard.tsx');
