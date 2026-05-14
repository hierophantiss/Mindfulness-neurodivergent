import React from 'react';
import GravityThoughts from './animations/GravityThoughts';
import OpenAwareness from './animations/OpenAwareness';
import CameraAnimation from './CameraAnimation';
import SamathaAnimation from './SamathaAnimation';

interface InteractiveRendererProps {
  id: string;
}

export default function InteractiveRenderer({ id }: InteractiveRendererProps) {
  // Prefer React Components if available
  if (id === 'gravity_thoughts') return <GravityThoughts />;
  if (id === 'openawareness' || id === 'open_awareness') return <OpenAwareness />;
  if (id === 'camera_exercise') return <CameraAnimation mode="camera" />;
  if (id === 'samatha_attention') return <SamathaAnimation />;
  if (id === 'camera_hero') return <CameraAnimation mode="hero" />;

  // Map other IDs to existing or newly created HTML files in /animations/
  const htmlMap: Record<string, string> = {
    'treepose': 'treepose.html',
    'metronomos': 'metronomos.html',
    'eswterikhafh': 'eswterikhafh.html',
    'three_attention': 'three_attention.html',
    'attention_dispersion': 'attention_dispersion.html',
    'racing_mind': 'racing_mind.html',
    'journey': 'journey.html',
  };

  const fileName = htmlMap[id] || `${id}.html`;
  
  // Base URL for animations
  const src = `/animations/${fileName}`;

  return (
    <div className="relative w-full h-[500px] md:h-[650px] bg-[#050710] shape-cloud-3 overflow-hidden border border-white/5 shadow-2xl my-10 group">
      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10" />
      <iframe 
        src={src} 
        className="w-full h-full border-0"
        title={`Interactive Exercise: ${id}`}
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
      />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
    </div>
  );
}
