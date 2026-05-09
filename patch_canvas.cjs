const fs = require('fs');

let content = fs.readFileSync('src/components/BreathCanvas.tsx', 'utf8');

// Find start of draw(ctx, canvas);
const tickEndIdx = content.indexOf('draw(ctx, canvas);');

// Find end of draw function
const drawEndStr = '      ctx.restore();\n    };\n';
const drawEndIdx = content.indexOf(drawEndStr);

if (tickEndIdx !== -1 && drawEndIdx !== -1) {
  const before = content.substring(0, tickEndIdx);
  const after = content.substring(drawEndIdx + drawEndStr.length);
  
  let newContent = before + '      animId = requestAnimationFrame(tick);\n    };\n' + after;
  
  // also replace `<canvas ... />`
  newContent = newContent.replace(/<canvas[\s\S]*?<\/canvas>/gs, ''); // if any standard close
  newContent = newContent.replace(/<canvas[^>]*\/>/gs, '');           // self-closing
  
  // also replace canvasRef declaration
  newContent = newContent.replace(/const canvasRef = useRef<HTMLCanvasElement>\(null\);/g, '');
  
  // also remove window.removeEventListener('resize', resize); line
  newContent = newContent.replace(/window\.removeEventListener\('resize',\s*resize\);/g, '');

  fs.writeFileSync('src/components/BreathCanvas.tsx', newContent);
  console.log('patched');
} else {
  console.log('indices not found', tickEndIdx, drawEndIdx);
}
