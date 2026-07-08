const fs = require('fs');
let content = fs.readFileSync('src/components/FourfoldAxisHero.tsx', 'utf8');

const figureFaceStart = content.indexOf('{/* 4.b FACE (over body line) */}');
const nextSection = content.indexOf('{/* b. BREATH */}');

const newFigureFace = `{/* 4.b FACE (over body line) */}
      <g id="figure-face" transform="translate(0, 52)">
        {/* Neck */}
        <path d="M 160,140 L 160,165 C 160,170 180,170 180,165 L 180,140 Z" fill="#c3946d" />
        
        {/* Face - full oval */}
        <path d="M 145,122 C 145,100 195,100 195,122 C 195,146 182,154 170,154 C 158,154 145,146 145,122 Z" fill="#dfb18b" />
        
        {/* Front Hood Brim (overlapping forehead to create hood shape) */}
        <path d="M 145,122 C 145,95 195,95 195,122 C 185,114 155,114 145,122 Z" fill="#2a3a30" />
        <path d="M 145,122 C 145,146 158,154 170,154 C 182,154 195,146 195,122" fill="none" stroke="#2a3a30" strokeWidth="2.5" />
        
        {/* Eyes (closed) - minimal */}
        <path d="M 154,127 Q 159,130 164,127" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 176,127 Q 181,130 186,127" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Smile - minimal calm */}
        <path d="M 166,139 Q 170,142 174,139" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      `;

content = content.substring(0, figureFaceStart) + newFigureFace + content.substring(nextSection);

fs.writeFileSync('src/components/FourfoldAxisHero.tsx', content);
