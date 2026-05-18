import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export default function GravityThoughts() {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [curScene, setCurScene] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [trans, setTrans] = useState(false);
  
  const curSceneRef = useRef(0);
  const targetSceneRef = useRef(0);
  const transRef = useRef(false);
  const transTRef = useRef(0);
  const autoPlayRef = useRef(false);
  
  const localeData = {
    el: {
      scenes: [
        { label:"Γείωση · Βαρύτητα", sub:"Πέλματα στο έδαφος, ηρεμία", bg:[25,45,48], caption:"Το σύστημα ησυχάζει. Νιώθεις τα πέλματα να πατούν γερά. Η αναπνοή ρυθμίζεται. Οι σκέψεις είναι λίγες και διάφανες." },
        { label:"Δίνη Reality Tunnel", sub:"Αυτοκριτική, 'τι θα γίνει αν'", bg:[55,35,48], caption:"Το μυαλό γεμίζει ερωτήσεις και φόβους. Η φούσκα μεγαλώνει. Το κέντρο βάρους ανεβαίνει. Χάνεις την επαφή με το σώμα." },
        { label:"Παγίδευση · Φούσκα τούνελ", sub:"Πλήρης ταύτιση – ταχύτητα, αδιαφάνεια", bg:[65,38,42], caption:"Οι σκέψεις γίνονται τούνελ. Βλέπεις μόνο τον κίνδυνο. Χωρίς άγκυρα, το reality tunnel γίνεται φυλακή." },
        { label:"Επαναφορά · Αναπνοή + Βάρος", sub:"Πνευμονογαστρικό νεύρο – η φούσκα γίνεται διάφανη", bg:[30,58,52], caption:"Η βαθιά αναπνοή ενεργοποιεί το πνευμονογαστρικό. Τα πέλματα γειώνουν. Η φούσκα παραμένει ήρεμη, διάφανη – δεν σε αποκόπτει. Είσαι εδώ." }
      ],
      bubbleWords: ["ενοχές","ανησυχία","ντροπή","φόβος","αυτοκριτική","αμφιβολία","τι θα γίνει αν","reality tunnel","παγίδα","DMN"],
      introTitle:"Δίνη Σκέψεων · Άγκυρα Βαρύτητας",
      introSub:"Reality Tunnel — Η φούσκα της αυτοκριτικής & η επιστροφή στο σώμα",
      introHint:"▶ Ξεκινήστε",
      warning:"⚠️ Προσοχή: Έντονα οπτικά εφέ (κινούμενες λέξεις, δίνες). Κατάλληλο για άτομα που επιθυμούν εξοικείωση με αισθητηριακά ερεθίσματα."
    },
    en: {
      scenes: [
        { label:"Grounded · Gravity", sub:"Feet on earth, calm", bg:[25,45,48], caption:"The system calms down. Feel your feet firmly on the ground. Breath steadies. Thoughts are few and transparent." },
        { label:"Reality Tunnel Vortex", sub:"Self-criticism, 'what if'", bg:[55,35,48], caption:"The mind fills with questions and fears. The bubble grows. Center of gravity rises. You lose body connection." },
        { label:"Trapped · Tunnel Bubble", sub:"Full identification – speed, opacity", bg:[65,38,42], caption:"Thoughts become a tunnel. You only see danger. Without an anchor, the reality tunnel becomes a prison." },
        { label:"Reset · Breath + Weight", sub:"Vagus nerve – bubble becomes transparent", bg:[30,58,52], caption:"Deep breathing activates the vagus nerve. Feet ground you. The bubble stays calm, transparent – it doesn't disconnect you. You are here." }
      ],
      bubbleWords: ["guilt","worry","shame","fear","self-criticism","doubt","what if","reality tunnel","trap","DMN"],
      introTitle:"Thought Vortex · Gravity Anchor",
      introSub:"Reality Tunnel — The bubble of self-criticism & return to body",
      introHint:"▶ Begin",
      warning:"⚠️ Caution: Intense visual effects (moving words, vortex). Suitable for those familiar with sensory stimuli."
    }
  };

  const currentLang = language === 'en' ? 'en' : 'el';
  const data = localeData[currentLang];
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, cx = 0, cy = 0;
    
    const resize = () => {
      if (!canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
    };
    
    // Initial size
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    let wordParticles: any[] = [];
    let vortexSpecks: any[] = [];
    
    const initWords = (sceneIdx: number) => {
      let targetCount = (sceneIdx === 0 || sceneIdx === 3) ? 24 : 72;
      wordParticles = [];
      for(let i=0; i<targetCount; i++) {
        const word = data.bubbleWords[Math.floor(Math.random() * data.bubbleWords.length)];
        wordParticles.push({
          word,
          angle: Math.random() * Math.PI * 2,
          radius: 20 + Math.random() * 95,
          speed: 0.2 + Math.random() * 1.3,
          size: 14 + Math.random() * 12,
          alpha: 0.6 + Math.random() * 0.4,
          orbitOffset: Math.random() * Math.PI * 2,
          yOffset: (Math.random() - 0.5) * 60
        });
      }
    };

    const initSpecks = () => {
      vortexSpecks = [];
      for(let i=0; i<70; i++) {
        vortexSpecks.push({ angle:Math.random()*Math.PI*2, radius:20+Math.random()*120, speed:0.3+Math.random()*1.4, size:1.5+Math.random()*3.5 });
      }
    };

    initWords(curSceneRef.current);
    initSpecks();

    const stars: any[] = [];
    for(let i=0; i<60; i++) stars.push({ 
      x: Math.random(), // store relative 0-1
      y: Math.random(), // store relative 0-1
      vx:(Math.random()-0.5)*0.0003, 
      vy:(Math.random()-0.5)*0.0003, 
      sz:0.5+Math.random()*1.2, 
      alpha:0.1+Math.random()*0.2 
    });

    function drawHero(x: number, y: number, tiltRad: number, headScale: number, bodyShiftY: number, alpha: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(x, y + bodyShiftY);
      ctx.rotate(tiltRad);
      const op = Math.min(1, alpha);
      
      ctx.fillStyle = `rgba(255, 224, 102, ${op*0.8})`;
      ctx.fillRect(98, 0, 4, 420);
      
      ctx.fillStyle = `rgba(18, 18, 18, ${op*0.95})`;
      ctx.beginPath(); ctx.moveTo(60, 155); ctx.quadraticCurveTo(100, 140, 140, 155); ctx.lineTo(140, 300); ctx.quadraticCurveTo(100, 320, 60, 300); ctx.fill();
      ctx.fillStyle = `rgba(255, 59, 47, ${op*0.7})`;
      ctx.fillRect(99, 155, 2, 145);
      
      ctx.fillStyle = `rgba(18, 18, 18, ${op*0.95})`;
      ctx.beginPath(); ctx.moveTo(60, 170); ctx.quadraticCurveTo(40, 180, 45, 260); ctx.quadraticCurveTo(50, 290, 60, 290); ctx.fill();
      ctx.beginPath(); ctx.moveTo(140, 170); ctx.quadraticCurveTo(160, 180, 155, 260); ctx.quadraticCurveTo(150, 290, 140, 290); ctx.fill();
      
      ctx.fillStyle = `rgba(243, 197, 154, ${op*0.9})`;
      ctx.beginPath(); ctx.ellipse(52, 300, 9, 13, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(148, 300, 9, 13, 0, 0, Math.PI*2); ctx.fill();
      
      ctx.fillStyle = `rgba(18, 18, 18, ${op*0.95})`;
      ctx.beginPath(); ctx.moveTo(65, 300); ctx.lineTo(95, 300); ctx.lineTo(95, 410); ctx.quadraticCurveTo(80, 420, 65, 410); ctx.fill();
      ctx.beginPath(); ctx.moveTo(105, 300); ctx.lineTo(135, 300); ctx.lineTo(135, 410); ctx.quadraticCurveTo(120, 420, 105, 410); ctx.fill();
      ctx.fillStyle = `rgba(10, 10, 10, ${op})`;
      ctx.beginPath(); ctx.ellipse(80, 415, 16, 7, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(120, 415, 16, 7, 0, 0, Math.PI*2); ctx.fill();
      
      ctx.save();
      ctx.translate(100, 95);
      ctx.scale(headScale, headScale);
      ctx.translate(-100, -95);
      ctx.fillStyle = `rgba(31, 47, 48, ${op*0.95})`;
      ctx.beginPath(); ctx.moveTo(50, 95); ctx.quadraticCurveTo(100, 15, 150, 95); ctx.quadraticCurveTo(145, 160, 130, 180); ctx.quadraticCurveTo(100, 155, 70, 180); ctx.quadraticCurveTo(55, 160, 50, 95); ctx.fill();
      ctx.fillStyle = `rgba(243, 197, 154, ${op*0.95})`;
      ctx.beginPath(); ctx.ellipse(100, 115, 26, 30, 0, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = `rgba(34,34,34,${op})`; ctx.lineWidth = 2;
      if(headScale > 1.15) {
        ctx.beginPath(); ctx.arc(88, 115, 4, 0, Math.PI*2); ctx.fillStyle = `rgba(210,100,80,${op*0.6})`; ctx.fill();
        ctx.beginPath(); ctx.arc(112, 115, 4, 0, Math.PI*2); ctx.fill();
      } else {
        ctx.beginPath(); ctx.moveTo(85, 115); ctx.quadraticCurveTo(90, 120, 95, 115); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(105, 115); ctx.quadraticCurveTo(110, 120, 115, 115); ctx.stroke();
      }
      if(headScale > 1.2) {
        ctx.beginPath(); ctx.moveTo(90, 135); ctx.quadraticCurveTo(100, 142, 110, 135); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(90, 130); ctx.quadraticCurveTo(100, 138, 110, 130); ctx.stroke();
      }
      ctx.fillStyle = `rgba(243, 197, 154, ${op*0.9})`;
      ctx.fillRect(96, 140, 8, 18);
      ctx.restore();
      
      const grad = ctx.createLinearGradient(75, 215, 125, 215);
      grad.addColorStop(0, '#ff3c38'); grad.addColorStop(0.2, '#ff9f1c'); grad.addColorStop(0.4, '#ffe066');
      grad.addColorStop(0.6, '#2ec4b6'); grad.addColorStop(0.8, '#3a86ff'); grad.addColorStop(1, '#8338ec');
      ctx.beginPath();
      ctx.moveTo(75, 215); ctx.bezierCurveTo(75,200,95,200,100,215); ctx.bezierCurveTo(105,230,125,230,125,215); 
      ctx.bezierCurveTo(125,200,105,200,100,215); ctx.bezierCurveTo(95,230,75,230,75,215);
      ctx.strokeStyle = grad; ctx.lineWidth = 5; ctx.stroke();
      
      ctx.fillStyle = `rgba(183, 255, 0, ${op*0.9})`;
      ctx.save(); ctx.translate(100, 303); ctx.rotate(0.785); ctx.fillRect(-8, -8, 16, 16); ctx.restore();
      
      ctx.fillStyle = `rgba(203, 213, 225, ${op})`;
      ctx.font = '12px Inter';
      ctx.fillText(currentLang === 'el' ? "Κέντρο Βάρους" : "Center of gravity", 135, 305);
      
      ctx.restore();
    }

    function drawGround(alpha: number, yPos: number) {
      if (!ctx) return;
      ctx.beginPath(); ctx.moveTo(cx-300, yPos); ctx.lineTo(cx+300, yPos);
      ctx.strokeStyle = `rgba(140,190,150,${alpha*0.5})`; ctx.lineWidth = 2; ctx.stroke();
      const grad = ctx.createRadialGradient(cx, yPos+8, 0, cx, yPos+8, 70);
      grad.addColorStop(0, `rgba(100,170,130,${alpha*0.2})`); grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad; ctx.fillRect(cx-200, yPos-15, 400, 40);
    }

    function drawAxis(x: number, topY: number, botY: number, alpha: number) {
      if (!ctx) return;
      ctx.beginPath(); ctx.moveTo(x, topY); ctx.lineTo(x, botY);
      ctx.strokeStyle = `rgba(160,180,130,${alpha*0.6})`; ctx.lineWidth = 1.5; ctx.setLineDash([6,8]); ctx.stroke();
      ctx.setLineDash([]);
    }

    function drawCoGMarker(x: number, y: number, alpha: number, stressLevel: number) {
      if (!ctx) return;
      let color = (stressLevel > 1.2) ? '210,100,80' : (stressLevel > 0.8 ? '210,170,90' : '140,190,150');
      ctx.fillStyle = `rgba(${color},${alpha*0.35})`;
      ctx.beginPath(); ctx.moveTo(x, y-9); ctx.lineTo(x+9, y); ctx.lineTo(x, y+9); ctx.lineTo(x-9, y); ctx.fill();
      ctx.fillStyle = `rgba(${color},${alpha*0.9})`;
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2); ctx.fill();
      if(stressLevel > 1.2) {
        ctx.fillStyle = `rgba(255,180,120,${alpha})`;
        ctx.font = 'bold 10px Inter';
        ctx.fillText("⚠️", x+12, y+4);
      }
    }

    function drawBubbleWords(sceneIdx: number, alpha: number, t: number) {
      if (!ctx) return;
      let intensityFactor = 1.0;
      if(sceneIdx === 0) intensityFactor = 0.2;
      else if(sceneIdx === 1) intensityFactor = 0.7;
      else if(sceneIdx === 2) intensityFactor = 1.2;
      else if(sceneIdx === 3) intensityFactor = 0.35;
      
      const bCX = cx, bCY = cy - 55;
      
      ctx.save();
      ctx.globalAlpha = alpha * (sceneIdx===0 ? 0.1 : (sceneIdx===3 ? 0.2 : 0.45));
      ctx.fillStyle = `rgba(210,220,190,0.08)`;
      ctx.beginPath(); ctx.ellipse(bCX, bCY, 88, 74, 0, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = `rgba(210,190,150,0.25)`; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.restore();
      
      for(let p of wordParticles) {
        let angle = p.angle + p.speed * 0.018 * intensityFactor + t * 0.12;
        let rad = p.radius + Math.sin(t * 0.7 + p.orbitOffset) * 8;
        let x = bCX + Math.cos(angle) * rad * 0.7;
        let y = bCY + Math.sin(angle) * rad * 0.6 + p.yOffset * 0.4;
        if(y < cy-105) y = cy-105;
        if(y > cy-5) y = cy-5;
        let wAlpha = p.alpha * alpha;
        if(sceneIdx === 0) wAlpha *= 0.3;
        if(sceneIdx === 3) wAlpha *= 0.5;
        if(sceneIdx === 2) wAlpha *= 1.1;
        ctx.font = `${Math.floor(15 + p.size * 0.5)}px sans-serif`;
        ctx.fillStyle = `rgba(250, 215, 160, ${wAlpha * 0.95})`;
        ctx.fillText(p.word, x, y);
        p.angle += p.speed * 0.004 * intensityFactor;
      }
      
      for(let s of vortexSpecks) {
        let ang = s.angle + s.speed * 0.018 * intensityFactor + t;
        let rad = s.radius + Math.sin(t * 1.3) * 12;
        let x = bCX + Math.cos(ang) * rad * 0.7;
        let y = bCY + Math.sin(ang) * rad * 0.6;
        ctx.beginPath(); ctx.arc(x, y, s.size * (0.4 + intensityFactor*0.5), 0, Math.PI*2);
        ctx.fillStyle = `rgba(210, 140, 100, ${alpha * 0.2 * intensityFactor})`;
        ctx.fill();
        s.angle += s.speed * 0.005 * intensityFactor;
      }
      
      const breath = (Math.sin(t * 1.5) + 1) / 2;
      const radiusRing = 26 + breath * 12;
      ctx.beginPath(); ctx.arc(cx, cy+5, radiusRing, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(140,220,180,${alpha*0.5})`; ctx.lineWidth = 1.8; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy+5, radiusRing-6, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(200,240,200,${alpha*0.6})`; ctx.stroke();
    }

    function renderScene(sceneIdx: number, alpha: number, t: number) {
      if (!ctx) return;
      const bg = data.scenes[sceneIdx].bg;
      const grad = ctx.createLinearGradient(0,0,0,h);
      grad.addColorStop(0, `rgb(${bg[0]+8},${bg[1]+8},${bg[2]+12})`);
      grad.addColorStop(1, `rgb(${Math.max(5,bg[0]-5)},${Math.max(8,bg[1]-6)},${Math.max(10,bg[2]-5)})`);
      ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
      
      ctx.globalAlpha = 0.25;
      stars.forEach(s => { 
        s.x+=s.vx; s.y+=s.vy; 
        if(s.x<0) s.x=1; if(s.x>1) s.x=0; 
        if(s.y<0) s.y=1; if(s.y>1) s.y=0; 
        ctx.beginPath(); ctx.arc(s.x*w, s.y*h, s.sz, 0, Math.PI*2); 
        ctx.fillStyle=`rgba(210,230,200,${s.alpha})`; ctx.fill(); 
      });
      ctx.globalAlpha = 1;
      
      const groundY = cy + 110;
      drawGround(alpha, groundY);
      drawAxis(cx, cy-130, groundY, alpha);
      
      let tilt = 0, headScale = 1, bodyShift = 0, stressLevel = 1;
      if(sceneIdx === 0) { tilt = 0; headScale = 1; bodyShift = 0; stressLevel = 0.8; }
      else if(sceneIdx === 1) { tilt = Math.sin(t * 1.6) * 0.04; headScale = 1.12; bodyShift = -5; stressLevel = 1.2; }
      else if(sceneIdx === 2) { tilt = Math.sin(t * 2.0) * 0.08 + 0.03; headScale = 1.28; bodyShift = -12; stressLevel = 1.6; }
      else if(sceneIdx === 3) { tilt = Math.sin(t * 0.7) * 0.01; headScale = 1.02; bodyShift = 1; stressLevel = 0.9; }
      
      const heroX = cx - 100;
      const heroY = cy - 210;
      drawHero(heroX, heroY, tilt, headScale, bodyShift, alpha);
      drawBubbleWords(sceneIdx, alpha, t);
      
      let cogY = heroY + 255 + bodyShift;
      if(sceneIdx === 1) cogY += Math.sin(t*2)*3;
      if(sceneIdx === 2) cogY += Math.sin(t*2.5)*5;
      drawCoGMarker(cx, cogY, alpha, stressLevel);
      
      if(sceneIdx === 0 || sceneIdx === 3) {
        ctx.beginPath(); ctx.arc(cx, heroY + 260, 28, 0, Math.PI*2);
        ctx.fillStyle = `rgba(120,200,140,${alpha*0.1*(0.6+Math.sin(t*1.2)*0.3)})`; ctx.fill();
      }
    }

    let time = 0;
    let globalAlpha = 0;
    let lastTime = 0;
    let reqId: number;

    const animate = (now: number) => {
      const dt = Math.min((now - (lastTime||now))/1000, 0.05);
      lastTime = now;
      time += dt;
      if (globalAlpha < 1) globalAlpha = Math.min(1, globalAlpha + dt*0.6);
      
      if (transRef.current) {
        transTRef.current = Math.min(1, transTRef.current + dt*0.7);
        const ease = transTRef.current < 0.5 ? 4*Math.pow(transTRef.current,3) : 1-Math.pow(-2*transTRef.current+2,3)/2;
        renderScene(curSceneRef.current, globalAlpha*(1-ease), time);
        renderScene(targetSceneRef.current, globalAlpha*ease, time);
        if (transTRef.current >= 1) {
          transRef.current = false;
          curSceneRef.current = targetSceneRef.current;
          setCurScene(targetSceneRef.current);
          setTrans(false);
          initWords(curSceneRef.current);
          initSpecks();
        }
      } else {
        renderScene(curSceneRef.current, globalAlpha, time);
      }
      reqId = requestAnimationFrame(animate);
    };

    reqId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(reqId);
      ro.disconnect();
    };
  }, [data]);

  useEffect(() => {
    autoPlayRef.current = autoPlay;
    let timer: any;
    if (autoPlay) {
      const runNext = () => {
        if (!autoPlayRef.current) return;
        if (curSceneRef.current < 3) {
          triggerGoToScene(curSceneRef.current + 1);
          timer = setTimeout(runNext, 9000);
        } else {
          setAutoPlay(false);
        }
      };
      timer = setTimeout(runNext, 9000);
    }
    return () => clearTimeout(timer);
  }, [autoPlay]);

  const triggerGoToScene = (idx: number) => {
    if (idx === curSceneRef.current || transRef.current || idx < 0 || idx > 3) return;
    targetSceneRef.current = idx;
    transRef.current = true;
    transTRef.current = 0;
    setTrans(true);
  };

  const currentSceneData = data.scenes[curScene];

  return (
    <div className="relative w-full h-[70vh] min-h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-[#0c171b] border border-white/10 group mb-10 select-none">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full cursor-pointer" />
      
      {showIntro && (
        <div 
          className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-[#071013] transition-opacity duration-1000"
          onClick={() => setShowIntro(false)}
        >
          <div className="text-3xl md:text-5xl font-light tracking-wider bg-gradient-to-br from-[#f5f2e9] to-[#bde0cf] text-transparent bg-clip-text mb-4 font-serif">
            {data.introTitle}
          </div>
          <div className="text-sm md:text-base text-[#bbd9ce] max-w-[85%]">
            {data.introSub}
          </div>
          <div className="bg-[#b44632]/20 border-l-4 border-[#ffaa77] p-4 mt-8 max-w-sm text-xs md:text-sm text-[#ffddbb] rounded-xl backdrop-blur-sm">
            {data.warning}
          </div>
          <div className="mt-8 px-6 py-2 border border-[#8cc8aa]/60 rounded-full bg-[#1e4641]/60 backdrop-blur-md text-sm tracking-widest text-[#f5f2e9]">
            {data.introHint}
          </div>
        </div>
      )}

      <div className={`absolute bottom-[140px] md:bottom-[180px] w-[92%] left-[4%] z-40 max-w-lg bg-black/75 backdrop-blur-md px-5 py-3 rounded-2xl md:rounded-3xl text-xs md:text-sm leading-relaxed text-[#e2f0ea] border-l-4 border-[#7fc1a3] transition-opacity duration-700 mx-auto right-[4%] ${trans ? 'opacity-0' : 'opacity-100'}`}>
        {currentSceneData.caption}
      </div>

      <div className={`absolute bottom-[75px] md:bottom-[85px] w-[92%] left-[4%] z-40 max-w-2xl bg-black/70 backdrop-blur-xl px-5 py-3 rounded-[2rem] md:rounded-[3rem] border border-[#8cd2b4]/40 text-center transition-opacity duration-700 right-[4%] mx-auto ${trans ? 'opacity-0' : 'opacity-100'}`}>
        <div className="font-serif text-lg md:text-2xl text-transparent bg-clip-text bg-gradient-to-br from-[#f3f0e6] to-[#bfe0cf] tracking-wide">
          {currentSceneData.label}
        </div>
        <div className="text-[10px] md:text-xs tracking-[0.12em] text-[#cde6db] mt-1 uppercase">
          {currentSceneData.sub}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-40 bg-black/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] md:text-xs font-mono text-white/80">
        {curScene + 1}/4
      </div>

      <div className="absolute top-0 right-0 w-12 h-full flex flex-col items-center justify-center gap-3 z-40 pr-2">
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            onClick={() => triggerGoToScene(i)}
            className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${curScene === i ? 'bg-[#d0f0e0] scale-[1.7] shadow-[0_0_8px_#8cd5b5]' : 'bg-[#c8dcd2]/40'}`}
            aria-label={`Scene ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 md:gap-3 z-40">
        <button 
          onClick={() => triggerGoToScene(curScene - 1)}
          disabled={curScene === 0}
          className="px-3 md:px-4 py-1.5 bg-[#1e3737]/90 border border-[#8cbeaa]/60 text-[#f0ede5] rounded-full text-[11px] md:text-xs font-medium hover:bg-[#3a7868] disabled:opacity-50 transition-colors backdrop-blur-md"
        >
          {language === 'el' ? '◀ Πίσω' : '◀ Prev'}
        </button>
        <button 
          onClick={() => setAutoPlay(!autoPlay)}
          className="px-3 md:px-4 py-1.5 bg-[#1e3737]/90 border border-[#8cbeaa]/60 text-[#f0ede5] rounded-full text-[11px] md:text-xs font-medium hover:bg-[#3a7868] transition-colors backdrop-blur-md"
        >
          {autoPlay ? (language === 'el' ? '⏸ Παύση' : '⏸ Pause') : (language === 'el' ? '▶ Αυτόματο' : '▶ Auto')}
        </button>
        <button 
          onClick={() => triggerGoToScene(curScene + 1)}
          disabled={curScene === 3}
          className="px-3 md:px-4 py-1.5 bg-[#1e3737]/90 border border-[#8cbeaa]/60 text-[#f0ede5] rounded-full text-[11px] md:text-xs font-medium hover:bg-[#3a7868] disabled:opacity-50 transition-colors backdrop-blur-md"
        >
          {language === 'el' ? 'Επόμενο ▶' : 'Next ▶'}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-40">
        <div 
          className="h-full bg-gradient-to-r from-[#5fba9b] via-[#b9a7dc] to-[#efc48a] transition-all duration-1000 ease-[cubic-bezier(0.2,0.9,0.4,1)]"
          style={{ width: `${(curScene / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}
