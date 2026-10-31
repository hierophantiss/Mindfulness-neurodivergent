import { useState } from 'react';
import { X } from 'lucide-react';
import { downloadBackup } from '../lib/backup';
import { backupReminderDue, isIOSBrowserTab, snoozeBackupReminder } from '../lib/dataSafety';

/**
 * About once a month, on the home page: save a copy of what lives only on
 * this device. Never in the first two weeks; "Not now" means a month of quiet
 * (lib/dataSafety.ts).
 */
export default function BackupReminder({ lang }: { lang: 'el' | 'en' }) {
  const [due] = useState(() => backupReminderDue());
  const [state, setState] = useState<'ask' | 'saved' | 'gone'>('ask');
  const [ios] = useState(isIOSBrowserTab);
  const el = lang === 'el';

  if (!due || state === 'gone') return null;

  const save = () => {
    downloadBackup();
    setState('saved');
  };
  const later = () => {
    snoozeBackupReminder();
    setState('gone');
  };

  return (
    <section
      aria-labelledby="home-backup-title"
      className="mt-6 desk:mt-8 flex items-start gap-3 rounded-2xl bg-[var(--tint-sand-bg)] border border-[var(--tint-sand-line)] pl-4 pr-2 py-3 desk:max-w-[720px]"
    >
      <div className="flex-1 min-w-0">
        {state === 'ask' ? (
          <>
            <h2 id="home-backup-title" className="text-[14px] font-medium leading-snug text-ink/90">
              {el ? 'Κράτα ένα αντίγραφο' : 'Keep a copy'}
            </h2>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink/75">
              {el
                ? 'Η πρόοδος και το ημερολόγιό σου μένουν μόνο σε αυτή τη συσκευή. Ένα αντίγραφο σε αρχείο τα κρατά, αν αλλάξεις κινητό ή αν σβηστούν τα δεδομένα του browser.'
                : 'Your progress and journal stay only on this device. A copy in a file keeps them if you change phones or the browser’s data is cleared.'}
              {ios && (el
                ? ' Στο iPhone τα προστατεύει και η «Προσθήκη στην οθόνη αφετηρίας».'
                : ' On iPhone, “Add to Home Screen” protects them too.')}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={save}
                className="min-h-[36px] inline-flex items-center rounded-full px-3.5 bg-[var(--tint-sand-hi)] border border-[var(--tint-sand-line)] text-[13px] text-ink/90 hover:text-ink transition-colors"
              >
                {el ? 'Αποθήκευση αντιγράφου' : 'Save a copy'}
              </button>
              <button
                type="button"
                onClick={later}
                className="min-h-[36px] inline-flex items-center px-2 text-[13px] text-ink/65 hover:text-ink/85 transition-colors"
              >
                {el ? 'Όχι τώρα' : 'Not now'}
              </button>
            </div>
          </>
        ) : (
          <p id="home-backup-title" role="status" className="text-[13.5px] leading-relaxed text-ink/85">
            {el
              ? 'Το αντίγραφο αποθηκεύτηκε. Το επαναφέρεις, αν χρειαστεί, από τις Ρυθμίσεις → Ανάκτηση. Θα σου το θυμίσω ξανά σε έναν μήνα.'
              : 'The copy is saved. If you ever need it, restore it from Settings → Restore. I will remind you again in a month.'}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={state === 'ask' ? later : () => setState('gone')}
        aria-label={el ? 'Κλείσιμο' : 'Close'}
        className="shrink-0 w-10 h-10 -mt-1 rounded-full flex items-center justify-center text-ink/50 hover:text-ink/80 transition-colors"
      >
        <X size={16} />
      </button>
    </section>
  );
}
