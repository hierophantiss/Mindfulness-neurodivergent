import * as fs from 'fs';
import * as path from 'path';

function walk(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if(content.includes('glass-card') || content.includes('soft-glass')) {
    // We want to replace these strings when they appear alongside glass-card or soft-glass.
    // Easier way: just do global replace of border and shadow on the same line.
    const lines = content.split('\n');
    for(let i=0; i<lines.length; i++) {
        if(lines[i].includes('glass-card') || lines[i].includes('soft-glass')) {
            let oldLine = lines[i];
            
            // Remove redundant blur
            lines[i] = lines[i].replace(/backdrop-blur-md/g, '');
            lines[i] = lines[i].replace(/backdrop-blur-sm/g, '');
            lines[i] = lines[i].replace(/backdrop-blur-lg/g, '');
            lines[i] = lines[i].replace(/backdrop-blur-xl/g, '');
            lines[i] = lines[i].replace(/backdrop-blur-3xl/g, '');
            lines[i] = lines[i].replace(/backdrop-blur-\[10px\]/g, '');
            
            // Remove redundant borders
            lines[i] = lines[i].replace(/border border-white\/5/g, '');
            lines[i] = lines[i].replace(/border-white\/5/g, '');
            lines[i] = lines[i].replace(/border border-transparent/g, '');
            lines[i] = lines[i].replace(/border-transparent/g, '');
            // Only replace bare "border" if it's there
            lines[i] = lines[i].replace(/ border /g, ' ');
            lines[i] = lines[i].replace(/"border /g, '"');
            
            // Remove redundant shadows
            lines[i] = lines[i].replace(/shadow-2xl/g, '');
            lines[i] = lines[i].replace(/shadow-xl/g, '');
            lines[i] = lines[i].replace(/shadow-lg/g, '');
            lines[i] = lines[i].replace(/shadow-md/g, '');
            lines[i] = lines[i].replace(/shadow-sm/g, '');
            lines[i] = lines[i].replace(/shadow /g, ' ');
            
            // Normalize spaces
            lines[i] = lines[i].replace(/\s+/g, ' ').replace(/ "/g, '"').replace(/" /g, '"');
            
            if(oldLine !== lines[i]) {
                changed = true;
            }
        }
    }
    content = lines.join('\n');
  }
  
  if(changed) fs.writeFileSync(f, content, 'utf8');
});
console.log('Cleaned up overlapping tailwind classes.');
