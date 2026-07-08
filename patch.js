const fs = require('fs');
let content = fs.readFileSync('src/components/FourfoldAxisHero.tsx', 'utf8');

const figureGroupStart = content.indexOf('{/* 4. FIGURE */}');
const axisLayersStart = content.indexOf('{/* 5. AXIS LAYERS */}');

const newFigureGroup = `{/* 4. FIGURE */}
      <g id="figure" transform="translate(0, 52)">
        {/* Soft shadow under figure */}
        <ellipse cx="170" cy="320" rx="100" ry="12" fill="#0c121e" opacity="0.5" />
        
        {/* Crossed Legs (Widened) */}
        <path d="M 65,285 C 65,240 110,245 170,245 C 230,245 275,240 275,285 C 275,320 220,330 170,330 C 120,330 65,320 65,285 Z" fill="#2a3a30" />
        
        {/* Leg folds - soft */}
        <path d="M 170,265 C 130,275 90,295 75,305" fill="none" stroke="#1d2822" strokeWidth="5" strokeLinecap="round" />
        <path d="M 170,265 C 210,275 250,295 265,305" fill="none" stroke="#1d2822" strokeWidth="5" strokeLinecap="round" />
        
        {/* Torso (slimmer column) */}
        <path d="M 125,180 L 125,260 C 145,265 195,265 215,260 L 215,180 Z" fill="#2a3a30" />
        
        {/* Back of hood / shoulders - natural raised drape */}
        <path d="M 105,190 C 105,130 130,90 170,90 C 210,90 235,130 235,190 Z" fill="#2a3a30" />
        
        {/* Neck opening shadow / inner hood */}
        <path d="M 142,135 C 142,175 198,175 198,135 Z" fill="#1d2822" />
        
        {/* Arms folded - natural drape */}
        <path d="M 115,185 C 95,240 130,285 170,275" fill="none" stroke="#1d2822" strokeWidth="22" strokeLinecap="round" />
        <path d="M 225,185 C 245,240 210,285 170,275" fill="none" stroke="#1d2822" strokeWidth="22" strokeLinecap="round" />
        
        <path d="M 115,185 C 95,240 130,285 170,275" fill="none" stroke="#2a3a30" strokeWidth="18" strokeLinecap="round" />
        <path d="M 225,185 C 245,240 210,285 170,275" fill="none" stroke="#2a3a30" strokeWidth="18" strokeLinecap="round" />
        
        {/* Hands - Heart Mudra */}
        <path d="M 145,278 C 145,260 162,260 170,266 C 170,275 165,285 145,278 Z" fill="#dfb18b" />
        <path d="M 195,278 C 195,260 178,260 170,266 C 170,275 175,285 195,278 Z" fill="#dfb18b" />
        {/* Heart cut-out (negative space) */}
        <path d="M 170,268 C 164,264 160,268 162,273 L 170,280 L 178,273 C 180,268 176,264 170,268 Z" fill="#2a3a30" />
        {/* Finger lines */}
        <path d="M 148,272 C 153,275 160,278 165,278" fill="none" stroke="#cf9c74" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 192,272 C 187,275 180,278 175,278" fill="none" stroke="#cf9c74" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      `;

content = content.substring(0, figureGroupStart) + newFigureGroup + content.substring(axisLayersStart);

fs.writeFileSync('src/components/FourfoldAxisHero.tsx', content);
