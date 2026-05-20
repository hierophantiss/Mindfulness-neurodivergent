const fs = require('fs');
let code = fs.readFileSync('src/pages/Sanctuary.tsx', 'utf8');

// We want to update the import statements first:
if (!code.includes('useAudioMixer')) {
  code = code.replace(
    'import { cn } from \'../lib/utils\';',
    'import { cn } from \'../lib/utils\';\nimport { useAudioMixer, AVAILABLE_TRACKS } from \'../contexts/AudioContext\';\nimport * as Icons from \'lucide-react\';'
  );
}

// Now replace the whole component `Sanctuary` UI inside the `return (`...`)`
const newReturnBlock = `
    <div className="relative min-h-screen w-full bg-transparent overflow-y-auto flex flex-col pt-16 custom-scrollbar pb-32">
      <AnimatePresence>
        {isDimmed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-5 py-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.1] text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 flex justify-center flex-col items-center">
            <h1 className="text-[26px] font-serif italic text-white/90 leading-none">
              {language === 'el' ? 'Το Καταφύγιο' : 'The Sanctuary'}
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#4a9eca] mt-1.5">
              {language === 'el' ? 'ΧΩΡΟΣ ΑΝΑΠΑΥΣΗΣ' : 'SPACE OF REST'}
            </p>
          </div>
          <button 
            onClick={() => setIsDimmed(!isDimmed)}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300",
              isDimmed ? "bg-teal-500/20 border-teal-500/50 text-teal-400" : "bg-white/5 border-white/10 text-white/40"
            )}
          >
            <Moon size={20} />
          </button>
        </div>

        {/* Custom Tabs */}
        {!isDimmed && (
          <div className="flex p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl mb-8">
            <button
              onClick={() => setActiveTab('audio')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === 'audio' 
                  ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.05]" 
                  : "text-white/30 hover:text-white/60"
              )}
            >
              <Headphones size={16} />
              {language === 'el' ? 'ΗΧΗΤΙΚΑ ΤΟΠΙΑ' : 'SOUNDSCAPES'}
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === 'video' 
                  ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.05]" 
                  : "text-white/30 hover:text-white/60"
              )}
            >
              <Film size={16} />
              {language === 'el' ? 'ΒΙΝΤΕΟ' : 'VIDEO'}
            </button>
          </div>
        )}

        {/* --- AUDIO TAB (MIXER) --- */}
        {activeTab === 'audio' && !isDimmed && (
          <>
            <div className="flex flex-col items-center justify-center py-6 relative mb-8">
              <div className="relative w-56 h-56 flex items-center justify-center mb-8">
                <motion.div 
                  animate={{ 
                    scale: masterPlaying ? [1, 1.1, 1] : 1,
                    opacity: masterPlaying ? [0.4, 0.7, 0.4] : 0.2
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-teal-500/10 border border-teal-500/30"
                />
                <div className="absolute inset-0 rounded-full border border-teal-500/10" />
                
                <button 
                  onClick={toggleMaster}
                  className="relative z-10 w-20 h-20 flex items-center justify-center rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 hover:bg-teal-500/30 transition-colors"
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  {masterPlaying ? (
                    <span className="flex gap-1.5">
                      <span className="w-2 h-6 bg-current rounded-full" />
                      <span className="w-2 h-6 bg-current rounded-full" />
                    </span>
                  ) : (
                    <Play size={32} className="ml-1" fill="currentColor" />
                  )}
                </button>
              </div>
              
              <div className="flex flex-col items-center gap-2 mb-8 text-center px-4">
                <h2 className="text-[22px] font-serif italic text-white/90">
                  {language === 'el' ? 'Ηχητική Μίξη' : 'Audio Mixer'}
                </h2>
                <p className="text-[11px] font-bold tracking-[0.15em] text-[#4a9eca] uppercase">
                  {Object.values(tracks).filter(t => t.isPlaying).length} {language === 'el' ? 'ΕΝΕΡΓΑ' : 'ACTIVE'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 pb-24">
              {AVAILABLE_TRACKS.map(track => {
                const state = tracks[track.id] || { isPlaying: false, volume: 0.5 };
                const IconComp = (Icons as any)[track.icon] || Icons.Music;
                return (
                  <div key={track.id} className={cn(
                    "flex flex-col gap-4 p-4 rounded-[1.5rem] border transition-all duration-300",
                    state.isPlaying ? "bg-[#1a3832]/60 border-teal-500/30" : "bg-white/[0.03] border-white/[0.08]"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 flex items-center justify-center rounded-2xl",
                          state.isPlaying ? "bg-teal-500/20 text-teal-400" : "bg-white/[0.05] text-white/40"
                        )}>
                          <IconComp size={24} strokeWidth={1.5} />
                        </div>
                        <span className="text-[17px] font-serif italic text-white/90">
                          {language === 'el' ? track.labelEL : track.labelEN}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => toggleTrack(track.id)}
                        className={cn(
                          "w-14 h-8 rounded-full relative transition-colors",
                          state.isPlaying ? "bg-teal-500" : "bg-white/[0.1]"
                        )}
                      >
                        <motion.div 
                          animate={{ x: state.isPlaying ? 24 : 0 }}
                          className="w-6 h-6 ml-1 bg-white rounded-full shadow-md"
                        />
                      </button>
                    </div>
                    
                    {state.isPlaying && (
                      <div className="flex items-center gap-4 px-2 pt-2">
                        <Volume2 size={16} className="text-white/40 flex-shrink-0" />
                        <input 
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={state.volume}
                          onChange={(e) => setTrackVolume(track.id, parseFloat(e.target.value))}
                          className="flex-1 accent-teal-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* --- VIDEO TAB (REMAINS EXACTLY AS IT WAS) --- */}
        {activeTab === 'video' && !isDimmed && (
          <div className="flex flex-col gap-6 pb-24">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Youtube size={20} />
              </div>
              <div>
                <h2 className="text-[20px] font-serif italic text-white/90 leading-tight">
                  {language === 'en' ? 'Cinema of Consciousness' : 'Σινεμά της Συνειδητότητας'}
                </h2>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold mt-1">
                  {language === 'en' ? 'Visual insights and philosophical explorations' : 'Οπτικές αναζητήσεις και φιλοσοφικές εξερευνήσεις'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {videos.map((video) => (
                <button 
                  key={video.id}
                  onClick={() => {
                    setActiveVideo(video.id);
                    setVideoStartTime(0);
                    setMantraStep(0);
                    setActiveAttentionStyles([]);
                    setIsVoidActive(false);
                  }}
                  className="group flex flex-col md:flex-row gap-5 p-4 md:p-5 bg-[#0f1117] border border-white/10 rounded-[1.5rem] overflow-hidden hover:border-white/20 transition-all text-left w-full active:scale-[0.98]"
                >
                  <div className="relative w-full md:w-56 aspect-video rounded-[1rem] overflow-hidden flex-shrink-0 border border-white/[0.05]">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" style={{ backgroundImage: \`url(\${video.thumbnail})\` }} />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-teal-500/80 group-hover:border-teal-400 group-hover:scale-110 transition-all">
                        <Play size={20} className="translate-x-[1px]" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0 pb-1">
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-teal-400 mb-2 block">
                      {video.category}
                    </span>
                    <h3 className="text-[17px] font-serif italic text-white/90 leading-tight mb-2 pr-4">{video.title}</h3>
                    <p className="text-[13px] text-white/50 leading-relaxed font-light mt-auto">
                      {language === 'en' ? video.description.intro.substring(0, 110) + '...' : video.description.intro.substring(0, 110) + '...'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Video Player Modal */}
        <AnimatePresence>
          {activeVideo && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-[#050d1a]"
            >
              <div className="absolute top-6 left-5 z-[110]">
                <button 
                  onClick={() => {
                    setActiveVideo(null);
                    setMantraStep(0);
                    setActiveAttentionStyles([]);
                    setIsVoidActive(false);
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.1] text-white/60 hover:text-white transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>

              <div className="w-full h-fit min-h-screen overflow-y-auto">
                <div className="w-full aspect-video md:aspect-[21/9] sticky top-0 z-[100] bg-black shadow-2xl">
                  {/* ... Here was the Youtube embed */}
                  <iframe 
                    src={\`https://www.youtube-nocookie.com/embed/\${activeVideo}?autoplay=1&controls=1&rel=0&modestbranding=1\`}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>

                <div className="max-w-3xl mx-auto px-5 py-8 pb-32">
                  {videos.find(v => v.id === activeVideo) && (
                    <div className="flex flex-col gap-6">
                      {/* Detailed info extracted earlier */}
                      <div className="mb-6 pb-6 border-b border-white/10">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-teal-400 mb-2 block">
                          {videos.find(v => v.id === activeVideo)?.category}
                        </span>
                        <h2 className="text-[28px] font-serif italic text-white/90 leading-tight mb-4">
                          {videos.find(v => v.id === activeVideo)?.title}
                        </h2>
                        <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
                          {videos.find(v => v.id === activeVideo)?.description.intro}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {videos.find(v => v.id === activeVideo)?.description.points.map((point: any, idx: number) => (
                          <div key={idx} className="bg-white/[0.03] border border-white/[0.08] p-5 rounded-2xl">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="px-2 py-1 rounded-md bg-teal-500/10 text-teal-300 text-[10px] font-mono font-bold tracking-wider">
                                {point.time}
                              </span>
                              <h4 className="text-[15px] font-medium text-white/90">{point.title}</h4>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed">
                              {point.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
`;

// Insert the exact new hooks at the top of the component:
let repl = code;
const hookInsertStr = `  const { masterPlaying, masterVolume, tracks, toggleMaster, toggleTrack, setTrackVolume } = useAudioMixer();`;
// Find `export default function Sanctuary() {` and replace it
repl = repl.replace(
  /export default function Sanctuary\(\) \{((\s|.)*?)const videos = \[/,
  `export default function Sanctuary() {\n  const navigate = useNavigate();\n  const { language } = useLanguage();\n  const [activeTab, setActiveTab] = useState<'audio' | 'video'>('audio');\n  const [isDimmed, setIsDimmed] = useState(false);\n  const [activeVideo, setActiveVideo] = useState<string | null>(null);\n  const [videoStartTime, setVideoStartTime] = useState<number>(0);\n  const [mantraStep, setMantraStep] = useState<number>(0);\n  const [activeAttentionStyles, setActiveAttentionStyles] = useState<string[]>([]);\n  const [isVoidActive, setIsVoidActive] = useState(false);\n\n${hookInsertStr}\n\n  const videos = [`
);

// We find the return statement to replace everything inside
const returnIdx = repl.lastIndexOf('return (');
if (returnIdx !== -1) {
  repl = repl.substring(0, returnIdx) + 'return (' + newReturnBlock + ';\n}\n';
}

fs.writeFileSync('src/pages/Sanctuary.tsx', repl);
console.log('Successfully rewrote Sanctuary.tsx with the Sound Mixer + old Video Library combinations');
