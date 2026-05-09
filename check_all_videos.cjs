const fs = require('fs');

const dir = 'public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'));

for (const file of files) {
  try {
    const buffer = fs.readFileSync(`${dir}/${file}`);
    let start = buffer.indexOf(Buffer.from('mvhd')) + 16;
    let timeScale = buffer.readUInt32BE(start);
    let duration = buffer.readUInt32BE(start + 4);
    console.log(`${file}: ${duration / timeScale}`);
  } catch (err) {
    console.log(`${file}: Error reading or parsing duration`);
  }
}
