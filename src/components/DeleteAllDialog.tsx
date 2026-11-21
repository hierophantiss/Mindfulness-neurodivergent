import { useId } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { clearAll } from '../lib/storage';

// Deleting everything the app keeps on this device (Settings, the one place
// for it). It says exactly what goes, offers a copy first, and asks for a
// clear «Yes»; there is no undo.

interface Props {
  open: boolean;
  onClose: () => void;
  /** «Keep a copy first»: the backup window, in its "save" mode. */
  onKeepCopy: () => void;
}

export default function DeleteAllDialog({ open, onClose, onKeepCopy }: Props) {
  const { language } = useLanguage();
  const el = language === 'el';
  const ref = useFocusTrap(open, onClose);
  const titleId = useId();
  if (!open || typeof document === 'undefined') return null;

  const erased = el
    ? [
        'Το Ημερολόγιο: όλα όσα έγραψες',
        'Την πρόοδό σου: κεφάλαια, Πρόγραμμα, πού σταμάτησες να διαβάζεις',
        'Το ιστορικό των ασκήσεων και του «Πώς νιώθεις»',
        'Τις ρυθμίσεις, μαζί με της προσβασιμότητας (Μειωμένη κίνηση, Εύκολη ανάγνωση, Δόνηση) και τη γλώσσα',
        'Τους ήχους που διάλεξες και τη μίξη σου',
      ]
    : [
        'The Journal: everything you wrote',
        'Your progress: chapters, the Program, where you stopped reading',
        'The record of your practices and of “How do you feel”',
        'The settings, accessibility ones included (Reduce motion, Easy reading, Vibration), and the language',
        'The sounds you chose and your mix',
      ];

  const erase = () => {
    clearAll();
    window.location.href = '/';
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="alertdialog" aria-modal="true" aria-labelledby={titleId}
        className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl bg-[var(--color-surface)] border border-white/10 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 id={titleId} className="text-[18px] font-medium text-ink">
            {el ? 'Διαγραφή όλων των δεδομένων' : 'Delete all data'}
          </h2>
          <button type="button" onClick={onClose} aria-label={el ? 'Κλείσιμο' : 'Close'}
            className="-m-2 w-11 h-11 shrink-0 flex items-center justify-center rounded-full text-ink/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-light)]">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <p className="text-[14.5px] leading-relaxed text-ink/85">
          {el ? 'Θα σβηστούν από αυτή τη συσκευή, χωρίς αναίρεση:' : 'This erases from this device, with no undo:'}
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-[14px] leading-relaxed text-ink/80" data-testid="delete-all-list">
          {erased.map(x => <li key={x}>{x}</li>)}
        </ul>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink/70">
          {el ? 'Ένα αντίγραφο σού επιτρέπει να τα φέρεις πίσω αργότερα.' : 'A copy lets you bring them back later.'}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <button type="button" onClick={onKeepCopy}
            className="w-full min-h-[44px] rounded-xl bg-[var(--color-accent)] text-[var(--color-stage)] font-medium text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-light)]">
            {el ? 'Κράτα πρώτα ένα αντίγραφο' : 'Keep a copy first'}
          </button>
          <button type="button" onClick={erase}
            className="w-full min-h-[44px] rounded-xl border border-[var(--tint-rose-line)] bg-[var(--tint-rose-bg)] text-[var(--tint-rose-ink)] font-medium text-[15px] hover:bg-[var(--tint-rose-hi)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-light)]">
            {el ? 'Ναι, διάγραψέ τα όλα' : 'Yes, delete it all'}
          </button>
          <button type="button" onClick={onClose}
            className="w-full min-h-[44px] rounded-xl text-[15px] text-ink/85 hover:bg-white/[0.05]">
            {el ? 'Άκυρο' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
