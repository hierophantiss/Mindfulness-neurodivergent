const fs = require('fs');

const file = 'src/contexts/AudioContext.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace Howl and Howler imports with nothing
code = code.replace("import { Howl, Howler } from 'howler';", "");

// Change audioMapRef typing
code = code.replace("const audioMapRef = useRef<Record<string, Howl>>({});", "const audioMapRef = useRef<Record<string, HTMLAudioElement>>({});");

// Change activeAmbientsRef typing
code = code.replace("const activeAmbientsRef = useRef<Howl[]>([]);", "const activeAmbientsRef = useRef<HTMLAudioElement[]>([]);");

// Replace getOrCreateAudio implementation
const getOrCreateReplacement = `  const getOrCreateAudio = (src: string) => {
    if (!src) return null;
    let audio = audioMapRef.current[src];
    if (!audio) {
      console.log(\`[Central Audio Engine] Creating lazy HTMLAudio for: \${src}\`);
      const absoluteUrl = getAbsoluteUrl(src);
      audio = new Audio(absoluteUrl);
      audio.loop = true;
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      
      audio.addEventListener('error', (e) => {
        console.warn('[Central Audio Engine] HTMLAudio error for', src, e);
      });
      
      audioMapRef.current[src] = audio;
    }
    return audioMapRef.current[src];
  };

  const safePlay = (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('[Central Audio Engine] Play error:', err);
        });
      }
    } catch(err) {
      console.warn('[Central Audio Engine] play() exception:', err);
    }
  };

  const safePause = (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    try {
       audio.pause();
    } catch(err) {}
  };
`;
code = code.replace(/const getOrCreateAudio = [\s\S]*?safePause = \(audio[^\)]*\) => \{[\s\S]*?\n  \};\n/, getOrCreateReplacement);


// Fix useEffect that sets volume
code = code.replace(/audio\.volume\(state\.volume \* masterVolume\);/g, "audio.volume = Math.max(0, Math.min(1, state.volume * masterVolume));");

// Find specific occurrences where Howler.ctx is used and remove them
code = code.replace(/if \(Howler\.ctx && Howler\.ctx\.state === 'suspended'\) \{[\s\S]*?\}/g, "");


// Fix startAudio Howl usage
const startAudioHowlRegex = /let audio = audioMapRef\.current\[path\];[\s\S]*?audio = new Howl\(\{[\s\S]*?\}\);[\s\S]*?audioMapRef\.current\[path\] = audio;\n              \}/;
const startAudioHowlReplacement = `
              let audio = audioMapRef.current[path];
              if (!audio) {
                const absoluteUrl = getAbsoluteUrl(path);
                audio = new Audio(absoluteUrl);
                audio.loop = true;
                audio.preload = 'auto';
                audio.crossOrigin = 'anonymous';
                audioMapRef.current[path] = audio;
              }
`;
code = code.replace(startAudioHowlRegex, startAudioHowlReplacement);


// Fix startAudio maxVol (first instance)
code = code.replace(/audio\.volume\(maxVol \* volumeRef\.current\);/g, "audio.volume = Math.max(0, Math.min(1, maxVol * volumeRef.current));");


// Fix stopAudio Howler elements fade-out
const stopFadeRegex = /\/\/ 2\. Howler elements fade-out[\s\S]*?\/\/ 3\. Complete stop trigger/;
const stopFadeReplacement = `
    // 2. HTMLAudio elements fade-out
    activeAmbientsRef.current.forEach(audio => {
      try {
        let vol = audio.volume;
        const targetVol = vol;
        const interval = setInterval(() => {
          vol -= targetVol / 10;
          if (vol <= 0) {
            audio.volume = 0;
            audio.pause();
            clearInterval(interval);
          } else {
            audio.volume = Math.max(0, Math.min(1, vol));
          }
        }, 50);
      } catch(e) {}
    });

    // 3. Complete stop trigger
`;
code = code.replace(stopFadeRegex, stopFadeReplacement);


// Fix setGlobalVolume map
const globalVolRegex = /const src = \(audio as any\)\._src\?\.\[0\] \|\| '';[\s\S]*?audio\.volume\(v \* maxVol\);/;
const globalVolReplacement = `
        const src = audio.src || '';
        const maxVol = (configRef.current && configRef.current.disableSynth) ? 1.0 : (src.includes('cat') ? 0.8 : 0.4);
        audio.volume = Math.max(0, Math.min(1, v * maxVol));
`;
code = code.replace(globalVolRegex, globalVolReplacement);


// Fix stopAudioNoDelay
const pauseAllRegex = /activeAmbientsRef\.current\.forEach\(audio => \{[\s\S]*?try \{[\s\S]*?audio\.stop\(\);[\s\S]*?\} catch \(e\) \{\}\n    \}\);/;
const pauseAllReplacement = `
    activeAmbientsRef.current.forEach(audio => {
      try {
        audio.pause();
      } catch (e) {}
    });
`;
code = code.replace(pauseAllRegex, pauseAllReplacement);


// Fix cleanup to remove stop and unload methods 
code = code.replace("audio.unload();", "audio.pause(); audio.src = '';");

// Fix audio stop / audio play in startAudio
code = code.replace("audio.stop(); \n                  audio.play();", "audio.pause(); audio.currentTime = 0; safePlay(audio);");


fs.writeFileSync(file, code);
