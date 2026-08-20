import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

export default function SamathaAnimation() {
  const { language } = useLanguage();

  return (
    <div className="relative w-full h-[600px] bg-transparent rounded-2xl overflow-hidden border border-pine-800 shadow-xl my-6">
      <iframe 
        src={`/animations/samatha_attention.html?lang=${language}`}
        className="w-full h-full border-0"
        title="Attention Geometry"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
