import fs from 'fs';
['chap1', 'chap3', 'chap4'].forEach(name => {
  fs.copyFileSync(`public/${name}.jpg`, `public/${name}.png`);
});
