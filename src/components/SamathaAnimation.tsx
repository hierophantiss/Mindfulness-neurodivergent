import React from 'react';

export default function SamathaAnimation() {
  return (
    <div className="relative w-full h-[600px] bg-[#05070a] rounded-2xl overflow-hidden border border-pine-800 shadow-xl my-6">
      <iframe 
        src="/animations/samatha.html" 
        className="w-full h-full border-0"
        title="Samatha Animation"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
