import React from 'react';

/** The cat companion: the white cat with the rainbow infinity (the app icon until 24/10). */
export function CatInfinityAvatar({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <img
      src="/cat-192.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`${className} rounded-full select-none pointer-events-none`}
    />
  );
}
