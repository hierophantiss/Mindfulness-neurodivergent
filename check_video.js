const fs = require('fs');

fs.readFile('public/be_like_a_flower.mp4', (err, buffer) => {
  if (err) throw err;
  
  // A rough estimate of duration from start
  let start = buffer.indexOf(Buffer.from('mvhd')) + 16;
  let timeScale = buffer.readUInt32BE(start);
  let duration = buffer.readUInt32BE(start + 4);
  console.log('Duration:', duration / timeScale);
});
