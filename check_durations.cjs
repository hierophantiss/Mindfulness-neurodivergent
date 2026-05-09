const { getVideoDurationInSeconds } = require('get-video-duration');
const fs = require('fs');

async function main() {
  const dir = 'public';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'));
  
  for (const file of files) {
    try {
      const duration = await getVideoDurationInSeconds(`${dir}/${file}`);
      console.log(`${file}: ${duration}s`);
    } catch (err) {
      console.log(`${file}: Error - ${err.message}`);
    }
  }
}
main();
