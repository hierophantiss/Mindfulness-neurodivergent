const fs = require('fs');
const svg = `
<svg viewBox="0 0 340 420" xmlns="http://www.w3.org/2000/svg" style="background:#123b45">
    {/* Body/Gravity */}
    <line x1="170" y1="30" x2="170" y2="440" stroke="#fef08a" stroke-width="2" stroke-linecap="round" opacity="0.8" />

    {/* FIGURE */}
    <g transform="translate(0, 52)">
        <ellipse cx="170" cy="320" rx="100" ry="12" fill="#0c121e" opacity="0.5" />
        
        {/* Hood/Shoulders */}
        <path d="M 105,190 C 105,130 130,90 170,90 C 210,90 235,130 235,190 Z" fill="#2a3a30" />
        
        {/* Legs */}
        <path d="M 65,285 C 65,240 110,245 170,245 C 230,245 275,240 275,285 C 275,320 220,330 170,330 C 120,330 65,320 65,285 Z" fill="#2a3a30" />
        
        {/* Torso */}
        <path d="M 125,180 L 125,260 C 145,265 195,265 215,260 L 215,180 Z" fill="#2a3a30" />
        
        {/* Arms */}
        <path d="M 115,180 C 100,240 130,285 170,275" fill="none" stroke="#1d2822" stroke-width="22" stroke-linecap="round" />
        <path d="M 225,180 C 240,240 210,285 170,275" fill="none" stroke="#1d2822" stroke-width="22" stroke-linecap="round" />
        
        <path d="M 115,180 C 100,240 130,285 170,275" fill="none" stroke="#2a3a30" stroke-width="18" stroke-linecap="round" />
        <path d="M 225,180 C 240,240 210,285 170,275" fill="none" stroke="#2a3a30" stroke-width="18" stroke-linecap="round" />
        
        {/* Face */}
        <path d="M 148,115 C 148,105 192,105 192,115 C 192,140 182,152 170,152 C 158,152 148,140 148,115 Z" fill="#dfb18b" />
        
        {/* Eyes & Smile */}
        <path d="M 154,124 Q 159,127 164,124" fill="none" stroke="#1d2822" stroke-width="1.5" stroke-linecap="round" />
        <path d="M 176,124 Q 181,127 186,124" fill="none" stroke="#1d2822" stroke-width="1.5" stroke-linecap="round" />
        <path d="M 166,138 Q 170,141 174,138" fill="none" stroke="#1d2822" stroke-width="1.5" stroke-linecap="round" />

        {/* Hands Mudra */}
        {/* Left hand */}
        <path d="M 148,272 C 158,266 168,266 170,275 C 160,282 148,280 148,272 Z" fill="#dfb18b" />
        {/* Right hand */}
        <path d="M 192,272 C 182,266 172,266 170,275 C 180,282 192,280 192,272 Z" fill="#dfb18b" />
        {/* Fingers detail */}
        <path d="M 148,272 C 158,278 170,275 170,275" fill="none" stroke="#cf9c74" stroke-width="1.5" />
        <path d="M 192,272 C 182,278 170,275 170,275" fill="none" stroke="#cf9c74" stroke-width="1.5" />
    </g>
</svg>
`;
fs.writeFileSync('test.html', svg);
