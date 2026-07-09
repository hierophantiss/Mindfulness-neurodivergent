const fs = require('fs');
let code = fs.readFileSync('src/components/MeditatorFigure.tsx', 'utf8');

// Insert the starfield generation just before the component definition
const starGen = `
const STARFIELD = Array.from({ length: 45 }).map((_, i) => ({
  id: i,
  cx: Math.random() * 340,
  cy: Math.random() * 380, // Cover most of the background, except the very bottom
  r: 0.5 + Math.random() * 1.5,
  baseOpacity: 0.2 + Math.random() * 0.5,
  dur: 8 + Math.random() * 8,
  delay: Math.random() * -15
}));

export const MeditatorFigure`;

code = code.replace('export const MeditatorFigure', starGen);

const oldStars = `{/* 1. Background stars (Optional based on earth?) Let's always show them or maybe bounded */}
        <circle cx="45" cy="80" r="1.5" fill="#cdd6f4" opacity="0.6" />
        <circle cx="290" cy="120" r="1.2" fill="#cdd6f4" opacity="0.5" />
        <circle cx="80" cy="240" r="1.5" fill="#cdd6f4" opacity="0.7" />
        <circle cx="260" cy="300" r="1.2" fill="#cdd6f4" opacity="0.5" />
        <circle cx="140" cy="40" r="1" fill="#cdd6f4" opacity="0.6" />`;

const newStars = `{/* 1. Dense Starfield */}
        {STARFIELD.map((star) => (
          <motion.circle
            key={star.id}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill="#cdd6f4"
            initial={{ opacity: star.baseOpacity }}
            animate={!reduceMotion ? { opacity: [star.baseOpacity * 0.3, star.baseOpacity, star.baseOpacity * 0.3] } : undefined}
            transition={!reduceMotion ? { duration: star.dur, delay: star.delay, repeat: Infinity, ease: "easeInOut" } : undefined}
          />
        ))}`;

code = code.replace(oldStars, newStars);
fs.writeFileSync('src/components/MeditatorFigure.tsx', code);
console.log('Patched starfield');
