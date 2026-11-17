import { useState, type ReactNode } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import { useLanguage } from '../hooks/useLanguage';

// The animations that are pages of their own (public/animations/*.html, in
// an iframe) cannot follow the app's "less motion" setting from inside. So
// with it on, they do not start by themselves: a calm note and a button, and
// they play only if the person chooses.
export default function MotionGate({ children }: { children: ReactNode }) {
  const { reduceMotion } = useAccessibility();
  const { language } = useLanguage();
  const el = language === 'el';
  const [go, setGo] = useState(false);
  if (!reduceMotion || go) return <>{children}</>;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="max-w-xs text-[14px] leading-relaxed text-ink/75">
        {el ? 'Η «λιγότερη κίνηση» είναι ενεργή: η κινούμενη εικόνα ξεκινά μόνο αν το θελήσεις.' : '“Less motion” is on: the animation starts only if you choose.'}
      </p>
      <button type="button" onClick={() => setGo(true)} className="btn-soft">
        {el ? 'Δείξε την κινούμενη εικόνα' : 'Show the animation'}
      </button>
    </div>
  );
}
