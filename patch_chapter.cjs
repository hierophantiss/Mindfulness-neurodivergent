const fs = require('fs');
let code = fs.readFileSync('src/pages/ChapterDetail.tsx', 'utf8');

if (!code.includes('ChapterAudioPlayer')) {
  // Add import
  code = code.replace(
    "import { Music, Play, Pause, ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react';",
    "import { Music, Play, Pause, ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react';\nimport ChapterAudioPlayer from '../components/ChapterAudioPlayer';"
  );

  // Add allParagraphs logic right before returning the main JSX
  const allParagraphsLogic = `
  const allParagraphs = [];
  if (chapter) {
    allParagraphs.push(chapter.title);
    allParagraphs.push(chapter.summary);
    if (chapter.tldr) allParagraphs.push(chapter.tldr);
    chapter.theorySections?.forEach(sec => {
      allParagraphs.push(sec.title);
      sec.paragraphs?.forEach(p => allParagraphs.push(p));
    });
  }
`;
  
  code = code.replace(
    "  if (!chapter) {\n    return <div",
    allParagraphsLogic + "\n  if (!chapter) {\n    return <div"
  );

  // Insert ChapterAudioPlayer inside <main>
  code = code.replace(
    "      <main \n        className=\"flex-1 relative overflow-x-hidden flex flex-col w-full\"\n        onTouchStart={handleTouchStart}\n        onTouchEnd={handleTouchEnd}\n      >\n        <AnimatePresence",
    `      <main 
        className="flex-1 relative overflow-x-hidden flex flex-col w-full items-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full max-w-[65ch] px-4 pt-4 z-10">
          <ChapterAudioPlayer paragraphs={allParagraphs} />
        </div>
        <AnimatePresence`
  );
  
  fs.writeFileSync('src/pages/ChapterDetail.tsx', code);
}
