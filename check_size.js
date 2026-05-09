import fs from 'fs';
['public/chap1.jpg', 'public/chap3.jpg', 'public/chap4.jpg'].forEach(f => {
  try {
    const stat = fs.statSync(f);
    console.log(`${f}: ${stat.size} bytes`);
  } catch(e) {
    console.log(`${f}: ${e.message}`);
  }
});
