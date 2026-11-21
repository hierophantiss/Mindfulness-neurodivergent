import { useEffect, useState } from 'react';
import { isQuiet, setQuiet, QUIET_EVENT } from '../lib/companionTips';

/** "Quiet cat" (no messages on the pages), the same in the cat's sheet and in Settings. */
export function useQuietCat(): [boolean, () => void] {
  const [quiet, setState] = useState(isQuiet);
  useEffect(() => {
    const sync = () => setState(isQuiet());
    window.addEventListener(QUIET_EVENT, sync);
    return () => window.removeEventListener(QUIET_EVENT, sync);
  }, []);
  return [quiet, () => setQuiet(!isQuiet())];
}
