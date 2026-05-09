const fs = require('fs');

const dir = 'public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'));

for (const file of files) {
  try {
    const buffer = fs.readFileSync(`${dir}/${file}`);
    const mvhdIdx = buffer.indexOf(Buffer.from('mvhd'));
    
    if (mvhdIdx !== -1) {
      const version = buffer.readUInt8(mvhdIdx + 4);
      let timeScale, duration;
      if (version === 0) {
        timeScale = buffer.readUInt32BE(mvhdIdx + 16);
        duration = buffer.readUInt32BE(mvhdIdx + 20);
      } else {
        timeScale = buffer.readUInt32BE(mvhdIdx + 24);
        // JS max safe int is enough for 8 bytes if we ignore the top 4 bytes for reasonable durations
        const durationHigh = buffer.readUInt32BE(mvhdIdx + 28);
        const durationLow = buffer.readUInt32BE(mvhdIdx + 32);
        duration = durationHigh * Math.pow(2, 32) + durationLow;
      }
      console.log(`${file}: ${duration / timeScale} seconds (version ${version})`);
    } else {
      console.log(`${file}: No mvhd found`);
    }
  } catch (err) {
    console.log(`${file}: Error - ${err.message}`);
  }
}
