const fs = require('fs');
const MP4Box = require('mp4box');

const dir = 'public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'));

for (const file of files) {
  const mp4boxfile = MP4Box.createFile();
  mp4boxfile.onReady = function(info) {
    const durationSecs = info.duration / info.timescale;
    console.log(`${file}: ${durationSecs} seconds`);
  };
  mp4boxfile.onError = function(e) {
    console.log(`${file}: Error - ${e}`);
  };

  const buffer = fs.readFileSync(`${dir}/${file}`);
  const arrayBuffer = new Uint8Array(buffer).buffer;
  arrayBuffer.fileStart = 0;
  mp4boxfile.appendBuffer(arrayBuffer);
  mp4boxfile.flush();
}
