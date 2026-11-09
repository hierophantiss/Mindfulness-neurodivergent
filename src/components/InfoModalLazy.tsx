import { lazy, Suspense, useEffect, useState } from 'react';

// The About window loads the first time someone opens it (it is not part of
// the script every page needs), then stays, so it closes with its animation.
const InfoModal = lazy(() => import('./InfoModal'));

export default function InfoModalLazy({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [wanted, setWanted] = useState(isOpen);
  useEffect(() => {
    if (isOpen) setWanted(true);
  }, [isOpen]);
  if (!wanted && !isOpen) return null;
  return (
    <Suspense fallback={null}>
      <InfoModal isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
}
