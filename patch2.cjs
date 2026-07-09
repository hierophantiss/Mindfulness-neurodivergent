const fs = require('fs');
let content = fs.readFileSync('src/components/FourfoldAxisHero.tsx', 'utf8');

const earthEnd = content.indexOf('{/* 4. FIGURE */}');
const breathStart = content.indexOf('{/* b. BREATH */}');

const newContent = `{/* a. BODY/GRAVITY (behind figure) */}
      <g className="axis-layer" style={{ opacity: getOpacity('body'), transition: 'opacity 0.4s ease' }} transform="translate(0, 52)">
        {/* Glow halo */}
        <line x1="170" y1="30" x2="170" y2="440" stroke="url(#body-grad)" strokeWidth="6" strokeLinecap="round" filter="url(#symbol-glow)" />
        {/* Solid core */}
        <line x1="170" y1="30" x2="170" y2="440" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        {/* Hit Area */}
        <line 
          x1="170" y1="30" x2="170" y2="440" 
          stroke="transparent" strokeWidth="30" 
          className="cursor-pointer"
          onMouseEnter={() => setHoveredAxis('body')}
          onMouseLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('body')}
        />
      </g>

      {/* 4. FIGURE */}
      <g id="figure" transform="translate(0, 52)">
        {/* Soft shadow under figure */}
        <ellipse cx="170" cy="320" rx="90" ry="12" fill="#0c121e" opacity="0.5" />
        
        {/* Crossed Legs (Widened) */}
        <path d="M 75,285 C 75,245 115,250 170,250 C 225,250 265,245 265,285 C 265,315 215,325 170,325 C 125,325 75,315 75,285 Z" fill="#2E4034" />
        
        {/* Leg folds */}
        <path d="M 170,270 C 135,280 100,295 85,305" fill="none" stroke="#1d2822" strokeWidth="4" strokeLinecap="round" />
        <path d="M 170,270 C 205,280 240,295 255,305" fill="none" stroke="#1d2822" strokeWidth="4" strokeLinecap="round" />

        {/* Torso (slimmer column) */}
        <path d="M 135,180 L 135,265 C 150,270 190,270 205,265 L 205,180 Z" fill="#2E4034" />
        
        {/* Back of hood / shoulders - smaller, snug around head */}
        <path d="M 125,190 C 130,130 140,105 170,105 C 200,105 210,130 215,190 Z" fill="#2E4034" />
        
        {/* Neck opening shadow / inner hood */}
        <path d="M 144,135 C 144,170 196,170 196,135 Z" fill="#1d2822" />
        
        {/* Arms folded - natural drape */}
        <path d="M 125,185 C 110,235 140,275 170,270" fill="none" stroke="#1d2822" strokeWidth="20" strokeLinecap="round" />
        <path d="M 215,185 C 230,235 200,275 170,270" fill="none" stroke="#1d2822" strokeWidth="20" strokeLinecap="round" />
        
        <path d="M 125,185 C 110,235 140,275 170,270" fill="none" stroke="#2E4034" strokeWidth="16" strokeLinecap="round" />
        <path d="M 215,185 C 230,235 200,275 170,270" fill="none" stroke="#2E4034" strokeWidth="16" strokeLinecap="round" />

        {/* Hands - Heart Mudra */}
        <path d="M 152,274 C 145,265 155,255 170,265 C 170,270 160,280 152,274 Z" fill="#dfb18b" />
        <path d="M 188,274 C 195,265 185,255 170,265 C 170,270 180,280 188,274 Z" fill="#dfb18b" />
        
        {/* Negative space inside the hands (heart shape) */}
        <path d="M 170,266 C 166,262 162,266 166,270 L 170,274 L 174,270 C 178,266 174,262 170,266 Z" fill="#2E4034" />
        
        {/* Finger lines */}
        <path d="M 155,268 C 158,272 163,274 167,274" fill="none" stroke="#cf9c74" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 185,268 C 182,272 177,274 173,274" fill="none" stroke="#cf9c74" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* 4.b FACE (over body line previously, now just face) */}
      <g id="figure-face" transform="translate(0, 52)">
        {/* Neck */}
        <path d="M 162,145 L 162,165 C 162,170 178,170 178,165 L 178,145 Z" fill="#c3946d" />
        
        {/* Face - short oval under hood */}
        <path d="M 148,130 C 148,115 192,115 192,130 C 192,150 182,156 170,156 C 158,156 148,150 148,130 Z" fill="#dfb18b" />
        
        {/* Hood covering forehead */}
        <path d="M 146,128 C 146,110 194,110 194,128 C 185,118 155,118 146,128 Z" fill="#2E4034" />
        <path d="M 146,128 C 146,152 158,158 170,158 C 182,158 194,152 194,128" fill="none" stroke="#2E4034" strokeWidth="2.5" />
        
        {/* Eyes (closed) - minimal */}
        <path d="M 155,134 Q 159,137 163,134" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 177,134 Q 181,137 185,134" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Smile - minimal calm */}
        <path d="M 166,145 Q 170,148 174,145" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      `;

content = content.substring(0, earthEnd) + newContent + content.substring(breathStart);

fs.writeFileSync('src/components/FourfoldAxisHero.tsx', content);
