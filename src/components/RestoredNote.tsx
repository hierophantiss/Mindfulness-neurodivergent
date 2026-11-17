import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

// After a restore the app starts again at once (BackupDialog); this says, on
// that start, that it was done, and how much of the file was left out.
export const RESTORED_KEY = 'n_mindfulness_restored';

export default function RestoredNote() {
  const { language } = useLanguage();
  const el = language === 'el';
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    try {
      const v = sessionStorage.getItem(RESTORED_KEY);
      if (v === null) return;
      sessionStorage.removeItem(RESTORED_KEY);
      const n = Number((JSON.parse(v) as { left?: unknown }).left);
      setLeft(Number.isFinite(n) && n > 0 ? n : 0);
    } catch { /* nothing to say */ }
  }, []);
  if (left === null) return null;
  return (
    <div role="status" className="mb-4 flex items-start gap-3 rounded-2xl border border-[var(--tint-sage-line)] bg-[var(--tint-sage-bg)] p-4 text-[var(--tint-sage-ink)]">
      <p className="flex-1 text-sm leading-relaxed">
        {el ? 'Η επαναφορά από το αντίγραφο έγινε.' : 'Restored from the copy.'}
        {left > 0 && (el
          ? ` ${left} στοιχεία του αρχείου δεν είναι της εφαρμογής ή δεν έχουν τη σωστή μορφή, και δεν γράφτηκαν.`
          : ` ${left} items in the file are not the app’s or not in the right form, and were not written.`)}
      </p>
      <button type="button" onClick={() => setLeft(null)} aria-label={el ? 'Κλείσιμο' : 'Close'}
        className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tint-sage-line)]">
        <X size={18} />
      </button>
    </div>
  );
}
