import { lazy, Suspense, useEffect, useState } from 'react';
import type { BackupMode } from './BackupDialog';

// The backup window (and the backup code with it) loads the first time it is
// opened from the menu, not with every page; then it stays, so it closes with
// its animation.
const BackupDialog = lazy(() => import('./BackupDialog'));

export default function BackupDialogLazy({ mode, onClose }: { mode: BackupMode | null; onClose: () => void }) {
  const [wanted, setWanted] = useState(mode !== null);
  useEffect(() => {
    if (mode !== null) setWanted(true);
  }, [mode]);
  if (!wanted && mode === null) return null;
  return (
    <Suspense fallback={null}>
      <BackupDialog mode={mode} onClose={onClose} />
    </Suspense>
  );
}
