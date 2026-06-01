import * as fs from 'fs';
import { danezisArticle } from './danezisArticle';

const filePath = 'src/pages/RabbitHole.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const danezisStart = content.indexOf("id: 'danezis-space',");
if (danezisStart === -1) {
    console.error("Could not find danezis-space");
    process.exit(1);
}
const beforeDanezis = content.lastIndexOf('{', danezisStart);

const forcesStart = content.indexOf("id: 'forces-of-the-cosmos',");
if (forcesStart === -1) {
    console.error("Could not find forces-of-the-cosmos");
    process.exit(1);
}
const beforeForces = content.lastIndexOf('{', forcesStart);

const replacement = `{
      id: '${danezisArticle.id}',
      title: language === 'en' ? ${JSON.stringify(danezisArticle.title.en)} : ${JSON.stringify(danezisArticle.title.el)},
      author: language === 'en' ? ${JSON.stringify(danezisArticle.author.en)} : ${JSON.stringify(danezisArticle.author.el)},
      pages: language === 'en' ? ${JSON.stringify(danezisArticle.pagesEn, null, 8).trim()} : ${JSON.stringify(danezisArticle.pagesEl, null, 8).trim()}
    },
    `;

content = content.substring(0, beforeDanezis) + replacement + content.substring(beforeForces);
fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully replaced danezis-space with quantum-void-awareness");
