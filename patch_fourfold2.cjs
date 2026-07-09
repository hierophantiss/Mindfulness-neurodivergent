const fs = require('fs');
const file = 'src/components/FourfoldAxisHero.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace("  return (\n      return (", "  return (");
fs.writeFileSync(file, code);
