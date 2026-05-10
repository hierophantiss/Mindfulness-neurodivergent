const fs = require('fs');
let content = fs.readFileSync('src/data/chapters.ts', 'utf8');
content = content.replace(
  'just like the space of awareness. Thoughts',
  'just like the space of awareness (Maha Ati/Mahamudra). Thoughts'
);
content = content.replace(
  'όπως και ο χώρος της επίγνωσης. Σκέψεις',
  'όπως και ο χώρος της επίγνωσης (Μάχα Άτι - Maha Ati/Mahamudra). Σκέψεις'
);

// Add interactive: "open_awareness"
content = content.replace(
  '],\n      exercise:{title:"Exercise: Broadening the Space"',
  '],\n      interactive: "open_awareness",\n      exercise:{title:"Exercise: Broadening the Space"'
);
content = content.replace(
  '],\n      exercise:{title:\'Άσκηση: Διεύρυνση του Χώρου\'',
  '],\n      interactive: "open_awareness",\n      exercise:{title:\'Άσκηση: Διεύρυνση του Χώρου\''
);

fs.writeFileSync('src/data/chapters.ts', content);
