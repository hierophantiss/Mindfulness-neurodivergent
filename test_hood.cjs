const fs = require('fs');
const svg = `
<svg viewBox="0 0 340 420" xmlns="http://www.w3.org/2000/svg" style="background:#123b45">
    {/* Body/Gravity */}
    <line x1="170" y1="30" x2="170" y2="440" stroke="#fef08a" stroke-width="2" stroke-linecap="round" opacity="0.8" />

    {/* FIGURE */}
    <g transform="translate(0, 52)">
        {/* Back of hood / shoulders - natural raised drape */}
        <path d="M 105,190 C 105,130 130,90 170,90 C 210,90 235,130 235,190 Z" fill="#2a3a30" />
        
        {/* Neck opening shadow / inner hood */}
        <path d="M 142,135 C 142,175 198,175 198,135 Z" fill="#1d2822" />
        
        {/* Neck */}
        <path d="M 160,140 L 160,165 C 160,170 180,170 180,165 L 180,140 Z" fill="#c3946d" />
        
        {/* Face */}
        <path d="M 146,122 C 146,105 194,105 194,122 C 194,145 182,152 170,152 C 158,152 146,145 146,122 Z" fill="#dfb18b" />
        
        {/* Hood brim covering forehead */}
        <path d="M 146,122 C 146,100 194,100 194,122 C 185,112 155,112 146,122 Z" fill="#2a3a30" />
        <path d="M 146,122 C 146,145 158,152 170,152 C 182,152 194,145 194,122" fill="none" stroke="#2a3a30" stroke-width="2" />
        
        {/* Eyes & Smile */}
        <path d="M 154,126 Q 159,129 164,126" fill="none" stroke="#1d2822" stroke-width="1.5" stroke-linecap="round" />
        <path d="M 176,126 Q 181,129 186,126" fill="none" stroke="#1d2822" stroke-width="1.5" stroke-linecap="round" />
        <path d="M 166,138 Q 170,141 174,138" fill="none" stroke="#1d2822" stroke-width="1.5" stroke-linecap="round" />
    </g>
</svg>
`;
fs.writeFileSync('test.html', svg);
