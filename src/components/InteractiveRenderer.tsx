import { useAccessibility } from '../hooks/useAccessibility';
import React, { useState } from 'react';
import GravityThoughts from './animations/GravityThoughts';
import OpenAwareness from './animations/OpenAwareness';
import CameraAnimation from './CameraAnimation';
import SamathaAnimation from './SamathaAnimation';
import { Maximize2, X, Play } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';

interface InteractiveRendererProps {
  id: string;
  asModal?: boolean;
}

export default function InteractiveRenderer({ id, asModal }: InteractiveRendererProps) {
    const { reduceMotion } = useAccessibility();
  

  const [isOpen, setIsOpen] = useState(!asModal);
  const { language } = useLanguage();

  // Map other IDs to existing or newly created HTML files in /animations/
  const htmlMap: Record<string, string> = {
    'gravity_thoughts': 'gravity_thoughts.html',
    'treepose': 'treepose.html',
    'metronomos': 'metronomos.html',
    'eswterikhafh': 'eswterikhafh.html',
    'three_attention': 'three_attention.html',
    'attention_dispersion': 'attention_dispersion.html',
    'racing_mind': 'racing_mind.html',
    'journey': 'journey.html',
  };

  const renderContent = () => {
    if (id === 'gravity_thoughts') return <GravityThoughts />;
    if (id === 'openawareness' || id === 'open_awareness') return <OpenAwareness />;
    if (id === 'camera_exercise') return <CameraAnimation mode="camera" />;
    if (id === 'samatha_attention') return <SamathaAnimation />;
    if (id === 'camera_hero') return <CameraAnimation mode="hero" />;

    const fileName = htmlMap[id] || `${id}.html`;
    const src = `/animations/${fileName}?lang=${language}`;

    return (
      <iframe 
        src={src} 
        className="w-full h-full border-0 rounded-2xl bg-[#050710]"
        title={`Interactive Exercise: ${id}`}
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
      />
    );
  };

  if (asModal && !isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full h-32 md:h-48 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-2xl group flex flex-col items-center justify-center gap-3 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-12 h-12 rounded-full border border-teal-500/20 bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
          <Play size={20} className="ml-1" />
        </div>
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 group-hover:text-teal-400 font-sans transition-colors">
          Άνοιγμα Διαδραστικής Άσκησης
        </span>
      </button>
    );
  }

  const content = (
    <div className={`relative w-full ${asModal ? 'h-[100dvh] md:h-[90vh] md:max-h-[900px] md:max-w-[1200px] md:rounded-3xl' : 'h-[500px] md:h-[650px] shape-cloud-3 rounded-2xl'} bg-[#050710] overflow-hidden border border-white/5 shadow-2xl`}>
      {asModal && (
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>
      )}
      {renderContent()}
    </div>
  );

  if (asModal) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0f1117]/95 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={reduceMotion ? { duration: 0.01 } : { duration: 0.4, ease: "easeOut" }}
              className="relative w-full h-full md:h-auto flex items-center justify-center"
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return <div className="my-10">{content}</div>;
}
