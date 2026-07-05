import { motion } from "motion/react";
import { useMemo } from "react";

interface SwayingHeroProps {
  tickCount: number; // 0 to 19
  tempo: number;
}

export default function SwayingHero({ tickCount, tempo }: SwayingHeroProps) {
  const stars = useMemo(() => {
    const list = [];
    const seedRandom = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return () => {
        const x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
      };
    };
    const random = seedRandom("taichi_stars_v3");
    for (let i = 0; i < 45; i++) {
      list.push({
        id: i,
        cx: random() * 400,
        cy: random() * 240,
        r: random() * 1.5 + 0.6,
        delay: random() * 3,
        pulseSpeed: random() * 2 + 1,
        isSparkle: random() > 0.85,
      });
    }
    return list;
  }, []);

  // Mapping animation: Each tick is an extreme.
  // tickCount % 2 === 0 -> Right side
  // tickCount % 2 === 1 -> Left side
  const maxAngle = 14; 
  const isEvenTick = tickCount % 2 === 0;
  const targetRotation = isEvenTick ? maxAngle : -maxAngle;
  
  // To create the arc (highest point at center, lowest at sides):
  // We animate Y through a trajectory frame: [Sides -> Center -> Sides] over the tick duration.
  // We are currently at one side (Y = 12), moving to the other side (Y = 12), 
  // passing through the center (Y = 0) halfway.
  const targetTranslateY = [12, -2, 12];
  
  // The hips/base shift slightly in the direction of the lean to emphasize the motion
  const targetTranslateX = isEvenTick ? 2 : -2; 
  
  // Keep hands mostly grounded on knees with minimal movement
  const targetHandRotation = -targetRotation * 0.15;
  // The head leans slightly INTO the sway to make the largest arc movement.
  const targetHeadRotation = targetRotation * 0.15;

  // Breathing scales (5 ticks for inhale, 5 for exhale)
  const phase = Math.floor(tickCount / 5) % 2;
  const isExhaling = phase === 1;
  const targetBreathing = isExhaling ? 0.98 : 1.03;

  const transitionConfig = { duration: tempo / 1000, ease: "easeInOut" as const };
  const yTransitionConfig = { duration: tempo / 1000, times: [0, 0.5, 1], ease: "easeInOut" as const };

  // Infinity symbol rainbow gradient colors
  const rainbowStops = [
    { offset: "0%",   color: "#ff0000" },
    { offset: "16%",  color: "#ff7700" },
    { offset: "33%",  color: "#ffee00" },
    { offset: "50%",  color: "#00cc44" },
    { offset: "66%",  color: "#0088ff" },
    { offset: "83%",  color: "#8800ff" },
    { offset: "100%", color: "#ff0000" },
  ];

  return (
    <div className="relative w-full aspect-square bg-[#070b14] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">

      {/* Background SVG: Stars + Earth */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 400">
        <defs>
          <radialGradient id="sky-grad-sway" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#0f192b" />
            <stop offset="60%" stopColor="#070c16" />
            <stop offset="100%" stopColor="#030408" />
          </radialGradient>
          <filter id="earth-glow-sway" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="ocean-grad-sway" cx="50%" cy="10%" r="90%">
            <stop offset="0%" stopColor="#102e5c" />
            <stop offset="60%" stopColor="#0a1d3a" />
            <stop offset="100%" stopColor="#040913" />
          </radialGradient>
          <linearGradient id="land-grad-sway" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b4a34f" />
            <stop offset="50%" stopColor="#a3923c" />
            <stop offset="100%" stopColor="#645d25" />
          </linearGradient>
          {/* Rainbow gradient for infinity */}
          <linearGradient id="rainbow-infinity" x1="0%" y1="0%" x2="100%" y2="0%">
            {rainbowStops.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
          <filter id="infinity-glow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="silver-axis" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" stopOpacity="0" />
            <stop offset="20%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="80%" stopColor="#e2e8f0" stopOpacity="1" />
            <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="400" height="400" fill="url(#sky-grad-sway)" />

        {stars.map((star) => (
          <g key={star.id} opacity={0.5}>
            {star.isSparkle ? (
              <path
                d={`M ${star.cx - 3} ${star.cy} L ${star.cx + 3} ${star.cy} M ${star.cx} ${star.cy - 3} L ${star.cx} ${star.cy + 3}`}
                stroke="#ffffff"
                strokeWidth={0.6}
                opacity={0.3 + 0.7 * Math.abs(Math.sin((Date.now() / 1500) * star.pulseSpeed + star.delay))}
              />
            ) : (
              <circle
                cx={star.cx}
                cy={star.cy}
                r={star.r}
                fill="#ffffff"
                opacity={0.2 + 0.8 * Math.abs(Math.sin((Date.now() / 1000) * star.pulseSpeed + star.delay))}
              />
            )}
          </g>
        ))}

        {/* EARTH */}
        <g transform="translate(200, 320) scale(1.8) translate(-200, -283)">
          <circle cx="200" cy="500" r="216" fill="none" stroke="#7dd3fc" strokeWidth="4" opacity="0.15" filter="url(#earth-glow-sway)" />
          <circle cx="200" cy="500" r="215" fill="url(#ocean-grad-sway)" stroke="#fed7aa" strokeWidth={0.5} opacity={0.6} />
          <g clipPath="url(#earth-clip-sway)" opacity={0.6}>
            <clipPath id="earth-clip-sway">
              <circle cx="200" cy="500" r="215" />
            </clipPath>
            <path d="M 120 400 Q 140 375 160 380 T 195 365 T 220 370 T 250 355 T 280 375 L 305 410 Q 280 432 250 430 T 180 415 Z" fill="url(#land-grad-sway)" opacity="0.8" />
            <path d="M 115 410 Q 140 420 170 422 T 190 435 T 230 440 T 260 420 T 290 445 Q 260 482 240 500 T 210 528 T 190 550 T 165 520 Z" fill="url(#land-grad-sway)" opacity="0.88" />
            <radialGradient id="earth-shading-sway" cx="50%" cy="10%" r="90%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="75%" stopColor="#000000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0.95" />
            </radialGradient>
            <circle cx="200" cy="500" r="215" fill="url(#earth-shading-sway)" />
          </g>
        </g>
      </svg>

      {/* Animated Hero Character */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
        <svg fill="none" viewBox="0 0 400 400" className="w-[180%] h-[180%] mt-[16%]">

          {/* ── FIXED BASE: Legs + cushion ── */}
          <g>
            <ellipse cx="200" cy="300" rx="35" ry="8" fill="#030408" opacity="0.9" />
            {/* Wider, more rounded crossed legs that blend into torso */}
            <path
              d="M 155 288 Q 175 308 200 306 Q 225 308 245 288 Q 248 294 200 310 Q 152 294 155 288"
              fill="#1b1e26"
              stroke="#13161b"
              strokeWidth="0.5"
            />
            <path d="M 155 288 Q 170 300 200 298 Q 178 293 155 288" fill="#252a34" />
            <path d="M 245 288 Q 230 300 200 298 Q 222 293 245 288" fill="#252a34" />
          </g>

          {/* ── FIXED HANDS on knees (counter-rotate to stay grounded) ── */}
          <motion.g 
            animate={{ rotate: targetHandRotation }} 
            transition={transitionConfig}
            style={{ transformOrigin: "200px 291px" }}
          >
            {/* Left hand */}
            <ellipse cx="160" cy="291" rx="5" ry="3.2" fill="#e5bda3" transform="rotate(-18 160 291)" />
            {/* Right hand */}
            <ellipse cx="240" cy="291" rx="5" ry="3.2" fill="#e5bda3" transform="rotate(18 240 291)" />
          </motion.g>

          {/* ── UPPER BODY: spring-physics pendulum ── */}
          <motion.g
            animate={{
              x: targetTranslateX,
              y: targetTranslateY,
              rotate: targetRotation,
            }}
            transition={{
              ...transitionConfig,
              y: yTransitionConfig
            }}
            style={{
              transformOrigin: "200px 291px",
            }}
          >
            {/* Torso & Arms scale gently with breath */}
            <motion.g 
              animate={{ scale: targetBreathing }} 
              transition={transitionConfig}
              style={{ transformOrigin: "200px 260px" }}
            >
              {/* TORSO — curved bottom to blend into legs */}
              <path
                d="M 184 232 L 216 232 L 214 278 Q 210 294 200 296 Q 190 294 186 278 Z"
                fill="#13161d"
              />
              {/* Subtle robe fold */}
              <path
                d="M 190 252 L 210 252 L 211 262 L 189 262 Z"
                fill="#1b1e26"
                stroke="#0b0d12"
                strokeWidth="0.8"
              />

              {/* Left Arm — follows torso */}
              <path
                d="M 184 236 Q 166 254 161 284"
                fill="none"
                stroke="#13161d"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Right Arm */}
              <path
                d="M 216 236 Q 234 254 239 284"
                fill="none"
                stroke="#13161d"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* ── RAINBOW INFINITY on chest ── */}
              <g filter="url(#infinity-glow)" opacity={0.92}>
                {/* Left lobe */}
                <path
                  d="M 200 255 C 200 248, 188 244, 184 249 C 180 254, 180 260, 184 263 C 188 266, 200 262, 200 255 Z"
                  fill="none"
                  stroke="url(#rainbow-infinity)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Right lobe */}
                <path
                  d="M 200 255 C 200 248, 212 244, 216 249 C 220 254, 220 260, 216 263 C 212 266, 200 262, 200 255 Z"
                  fill="none"
                  stroke="url(#rainbow-infinity)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            </motion.g>

            {/* HEAD & HOOD (Separate counter-rotation & isolated from breathing scale) */}
            <motion.g 
              animate={{ rotate: targetHeadRotation, x: 1 }} 
              transition={transitionConfig}
              style={{ transformOrigin: "199px 219px" }}
            >
              {/* Neck */}
              <rect x="195" y="219" width="8" height="11" fill="#e5bda3" />
              {/* Face */}
              <ellipse cx="199" cy="208" rx="10" ry="12" fill="#e5bda3" />
              {/* Closed eyes */}
              <path d="M 192 208 Q 194 210 196 208" fill="none" stroke="#6b4c35" strokeWidth="1" strokeLinecap="round" />
              <path d="M 202 208 Q 204 210 206 208" fill="none" stroke="#6b4c35" strokeWidth="1" strokeLinecap="round" />
              {/* Calm smile */}
              <path d="M 196 215 Q 199 217 202 215" fill="none" stroke="#7e533c" strokeWidth="1" strokeLinecap="round" />
              {/* Hood outer */}
              <path
                d="M 184 228 C 177 214 181 193 191 189 C 195 187 203 187 207 189 C 217 193 221 214 214 228 Z"
                fill="#13161d"
                stroke="#000000"
                strokeWidth="0.5"
              />
              {/* Hood inner shadow */}
              <path
                d="M 188 226 C 184 213 186 201 193 197 C 197 195 201 195 205 197 C 212 201 214 213 210 226 Z"
                fill="#0c0e12"
              />
            </motion.g>
          </motion.g>

          {/* Ethereal Silver Gravity Axis placed ON TOP of the hero to act as a clear plumb line */}
          <g pointerEvents="none">
            <path d="M 200 10 L 200 390" stroke="url(#silver-axis)" strokeWidth="1.5" strokeDasharray="6 8" opacity="0.9" />
            <path d="M 200 10 L 200 390" stroke="#ffffff" strokeWidth="4" opacity="0.3" filter="url(#infinity-glow)" />
          </g>

        </svg>
      </div>
    </div>
  );
}
