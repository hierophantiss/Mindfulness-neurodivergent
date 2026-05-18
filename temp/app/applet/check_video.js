import fs from 'fs';
const file = fs.statSync('public/raising_arms.mp4');
console.log('Size:', file.size);
