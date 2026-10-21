import { useEffect, useRef } from 'react';

/**
 * Keyboard shortcuts for people with a keyboard (e.g. on a computer):
 * keys are matched on `event.key` (" " for Space, "ArrowLeft", "Escape", ...).
 * Typing in a field is never interrupted, and Space on a focused button keeps
 * its normal meaning (it presses that button).
 */
export function useKeyboardShortcuts(keys: Record<string, () => void>, enabled = true) {
  const keysRef = useRef(keys);
  keysRef.current = keys;

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (t?.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === ' ' && (tag === 'BUTTON' || tag === 'A')) return;
      const action = keysRef.current[e.key];
      if (!action) return;
      e.preventDefault();
      action();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
}
