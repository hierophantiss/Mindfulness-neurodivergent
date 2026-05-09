const fs = require('fs');
const files = fs.readdirSync('public').filter(f => f.endsWith('.mp4'));
files.forEach(f => {
  const stat = fs.statSync('public/' + f);
  console.log(`${f}: ${stat.size} bytes`);
});
