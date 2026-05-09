const fs = require('fs');
['sitemap.xml', 'public/sitemap.xml'].forEach(file => {
  if (fs.existsSync(file)) {
    let raw = fs.readFileSync(file, 'utf8');
    raw = raw.replace(/mindfulness-practice\.site/g, 'neurodivergent-mindfulness.org');
    fs.writeFileSync(file, raw);
    console.log(`Updated ${file}`);
  }
});
