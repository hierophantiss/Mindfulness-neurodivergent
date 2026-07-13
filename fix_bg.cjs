const fs = require('fs');
let content = fs.readFileSync('src/components/InteractiveBackground.tsx', 'utf8');
content = content.replace("const weather = (hour >= 3 && hour <= 4) ? 'rain' : 'clear';", "const weather = (hour >= 3 && hour <= 4) ? 'rain' : 'clear' as string;");
fs.writeFileSync('src/components/InteractiveBackground.tsx', content);
