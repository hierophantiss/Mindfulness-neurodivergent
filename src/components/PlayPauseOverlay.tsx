import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause } from 'lucide-react';

interface PlayPauseOverlayProps {
  isPlaying: boolean;
}

export function PlayPauseOverlay({ isPlaying }: PlayPauseOverlayProps) {
  const [show, setShow] = useState(false);
  const [initialMount, setInitialMount] = useState(true);

  useEffect(() => {
    if (initialMount) {
      setInitialMount(false);
      return;
    }
    
    setShow(true);
    const timeout = setTimeout(() => setShow(false), 600);
    return () => clearTimeout(timeout);
  }, [isPlaying]);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-24 h-24 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
          >
            {isPlaying ? (
              <Play size={40} className="ml-2 fill-white opacity-80" />
            ) : (
              <div className="flex gap-2">
                 <div className="w-3 h-10 bg-white opacity-80 rounded-sm" />
                 <div className="w-3 h-10 bg-white opacity-80 rounded-sm" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
