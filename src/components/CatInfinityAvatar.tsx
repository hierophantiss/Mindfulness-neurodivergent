import React from 'react';

/** The cat companion: the same white cat with the rainbow infinity as the app icon. */
export function CatInfinityAvatar({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <img
      src="/icon-192.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`${className} rounded-full select-none pointer-events-none`}
    />
  );
}
