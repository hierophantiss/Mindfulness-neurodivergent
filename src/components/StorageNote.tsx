import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { canKeepData } from '../lib/storage';

// When the browser lets no site keep anything on the device ("block all site
// data"), the app still works, but what is written or set is gone when the
// page closes. Better to know it before writing in the Journal. It shows only
// then; the × puts it away for this visit (it cannot be remembered longer).
export default function StorageNote() {
  const { language } = useLanguage();
  const el = language === 'el';
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(!canKeepData()); }, []);
  if (!show) return null;
  return (
    <div role="status" className="mb-4 flex items-start gap-3 rounded-2xl border border-[var(--tint-lav-line)] bg-[var(--tint-lav-bg)] p-4 text-[var(--tint-lav-ink)]">
      <div className="flex-1">
        <p className="text-sm font-medium">
          {el ? 'Δεν κρατιέται τίποτα σε αυτή τη συσκευή' : 'Nothing can be kept on this device'}
        </p>
        <p className="mt-1 text-xs leading-relaxed opacity-80">
          {el
            ? 'Ο browser σου δεν επιτρέπει σε αυτόν τον ιστότοπο να κρατά δεδομένα. Η εφαρμογή δουλεύει κανονικά, αλλά ό,τι γράψεις ή ρυθμίσεις (Ημερολόγιο, πρόοδος) χάνεται όταν κλείσει η σελίδα. Για να κρατιούνται, επέτρεψε τα δεδομένα ιστοτόπων για το neurodivergent-mindfulness.org στις ρυθμίσεις του browser.'
            : 'Your browser does not let this site keep any data. The app works as usual, but what you write or set (Journal, progress) is lost when the page closes. To keep it, allow site data for neurodivergent-mindfulness.org in your browser’s settings.'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setShow(false)}
        aria-label={el ? 'Κλείσιμο' : 'Close'}
        className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tint-lav-line)]"
      >
        <X size={18} />
      </button>
    </div>
  );
}
