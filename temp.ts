import fs from 'fs';
const paths = JSON.parse(fs.readFileSync('src/prerender-paths.json', 'utf8'));
const articles = [
  'never-force'
];
const newPaths = [];
for (const a of articles) {
  newPaths.push('/en/rabbithole/' + a);
  newPaths.push('/el/rabbithole/' + a);
}
const finalPaths = [...new Set([...paths, ...newPaths])];
fs.writeFileSync('src/prerender-paths.json', JSON.stringify(finalPaths, null, 2));
console.log('Updated paths');
