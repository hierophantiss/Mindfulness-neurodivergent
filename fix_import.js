const fs = require('fs');
let code = fs.readFileSync('src/pages/ChapterDetail.tsx', 'utf8');

if (!code.includes('import ChapterAudioPlayer')) {
  code = code.replace(
    "import { useLanguage } from '../hooks/useLanguage';",
    "import { useLanguage } from '../hooks/useLanguage';\nimport ChapterAudioPlayer from '../components/ChapterAudioPlayer';"
  );
  fs.writeFileSync('src/pages/ChapterDetail.tsx', code);
}
