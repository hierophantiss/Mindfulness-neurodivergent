const fs = require('fs');

const dir = 'public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'));

for (const file of files) {
  const buffer = fs.readFileSync(`${dir}/${file}`, { start: 0, end: 100 });
  console.log(`${file} header: ${buffer.toString('utf8', 0, 30).replace(/\n/g, '')}`);
}
