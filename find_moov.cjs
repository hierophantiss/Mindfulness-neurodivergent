const fs = require('fs');

const dir = 'public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'));

for (const file of files) {
  try {
    const stats = fs.statSync(`${dir}/${file}`);
    const size = stats.size;
    
    // Read the whole file and look for 'moov'
    const buffer = fs.readFileSync(`${dir}/${file}`);
    const moovIdx = buffer.indexOf(Buffer.from('moov'));
    const mvhdIdx = buffer.indexOf(Buffer.from('mvhd'));
    
    if (mvhdIdx !== -1) {
      const start = mvhdIdx + 12;
      const timeScale = buffer.readUInt32BE(start);
      const duration = buffer.readUInt32BE(start + 4);
      console.log(`${file}: duration ${duration / timeScale} (timeScale: ${timeScale}, moov at: ${moovIdx}, mvhd at: ${mvhdIdx})`);
    } else {
      console.log(`${file}: No mvhd found!`);
    }
  } catch (err) {
    console.log(`${file}: Error - ${err.message}`);
  }
}
