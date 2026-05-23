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
    const lines = content.split('\n');
    for(let i=0; i<lines.length; i++) {
        if((lines[i].includes('glass-card') || lines[i].includes('soft-glass')) && lines[i].includes('overflow-hidden')) {
            lines[i] = lines[i].replace(/overflow-hidden/g, '');
            // Normalize spaces
            lines[i] = lines[i].replace(/\s+/g, ' ').replace(/ "/g, '"').replace(/" /g, '"');
            changed = true;
        }
    }
    if (changed) {
        content = lines.join('\n');
        fs.writeFileSync(f, content, 'utf8');
        console.log('Removed overflow-hidden from ' + f);
    }
  }
});
