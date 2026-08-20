import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

export default function CameraAnimation({ mode = 'camera' }: { mode?: 'hero' | 'camera' | 'anchor' | 'zoom' }) {
  const { language } = useLanguage();
  // Use camera-hero.html by default as it covers all features
  // We can switch to basic 'camera' if desired
  const base = mode === 'camera' ? '/animations/camera.html' : '/animations/camera-hero.html';
  const src = `${base}?lang=${language}`;
  
  return (
    <div className="relative w-full h-[600px] bg-[#050510] rounded-2xl overflow-hidden border border-pine-800 shadow-xl my-6">
      <iframe 
        src={src} 
        className="absolute inset-0 w-full h-full border-0"
        title="Camera Exercise"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
