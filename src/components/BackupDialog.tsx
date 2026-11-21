import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { backupText, isLocked, lockBackup, previewBackup, restoreBackup, saveBackupFile, unlockBackup, type BackupPreview } from '../lib/backup';
import { RESTORED_KEY } from './RestoredNote';

// Saving a copy of the data, and bringing one back: the menu, Settings and
// the home page's monthly reminder all open this. A copy can be locked with a
// passphrase (lib/backup.ts); it is made and opened on the device only.

const MIN_PASS = 8;

export type BackupMode = 'save' | 'restore';

interface Props {
  mode: BackupMode | null;
  onClose: () => void;
  /** After a copy was saved. */
  onSaved?: () => void;
}

type Step =
  | { s: 'idle' }
  | { s: 'busy' }
  | { s: 'saved' }
  | { s: 'locked'; text: string; name: string; wrong?: boolean }
  /** A copy was read: what it will replace, before anything is written. */
  | { s: 'confirm'; text: string; preview: BackupPreview }
  | { s: 'restored'; restored: number; left: number }
  | { s: 'error'; message: string };

export default function BackupDialog({ mode, onClose, onSaved }: Props) {
  const { language } = useLanguage();
  const el = language === 'el';
  const open = mode !== null;
  const ref = useFocusTrap(open, onClose);
  const titleId = useId();
  const [lock, setLock] = useState(false);
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [step, setStep] = useState<Step>({ s: 'idle' });
  const fileRef = useRef<HTMLInputElement>(null);

  // Each opening starts clean; nothing typed is kept.
  useEffect(() => {
    if (!open) return;
    setLock(false); setPass(''); setPass2(''); setStep({ s: 'idle' });
  }, [open, mode]);

  if (!open || typeof document === 'undefined') return null;

  const passOk = pass.length >= MIN_PASS && pass === pass2;

  const save = async () => {
    try {
      setStep({ s: 'busy' });
      const plain = backupText();
      const text = lock ? await lockBackup(plain, pass) : plain;
      if (!(await saveBackupFile(text, lock))) {
        setStep({ s: 'error', message: el ? 'Το αντίγραφο δεν αποθηκεύτηκε (έκλεισε το παράθυρο κοινοποίησης). Δοκίμασε ξανά και διάλεξε πού θα πάει, π.χ. Αρχεία ή Drive.' : 'The copy was not saved (the share window was closed). Try again and choose where it goes, e.g. Files or Drive.' });
        return;
      }
      setPass(''); setPass2('');
      setStep({ s: 'saved' });
      onSaved?.();
    } catch {
      setStep({ s: 'error', message: el ? 'Το αντίγραφο δεν φτιάχτηκε. Δοκίμασε ξανά.' : 'The copy could not be made. Please try again.' });
    }
  };

  const notACopy = () => setStep({ s: 'error', message: el ? 'Αυτό το αρχείο δεν είναι αντίγραφο της εφαρμογής. Δεν άλλαξε τίποτα.' : 'This file is not a copy from the app. Nothing was changed.' });

  const restoreText = (text: string) => {
    try {
      const r = restoreBackup(text);
      setStep({ s: 'restored', restored: r.restored, left: r.left });
      // Start again at once, before the open pages write their own (older)
      // state over what was just restored; the next start says it was done.
      try { sessionStorage.setItem(RESTORED_KEY, JSON.stringify({ left: r.left })); } catch { /* the restart still shows it all */ }
      window.setTimeout(() => window.location.reload(), 50);
    } catch {
      notACopy();
    }
  };

  /** First what the copy holds and its day; it is written only after «Ναι». */
  const askFirst = (text: string, name: string, lastModified?: number) => {
    try {
      const preview = previewBackup(text, name);
      if (!preview.savedAt && lastModified) preview.savedAt = new Date(lastModified);
      setStep({ s: 'confirm', text, preview });
    } catch {
      notACopy();
    }
  };

  const chosen = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      let parsed: unknown = null;
      try { parsed = JSON.parse(text); } catch { /* not JSON: askFirst says so */ }
      if (isLocked(parsed)) { setPass(''); setStep({ s: 'locked', text, name: file.name }); }
      else askFirst(text, file.name, file.lastModified);
    };
    reader.readAsText(file);
  };

  const unlock = async (text: string, name: string) => {
    setStep({ s: 'busy' });
    try {
      const plain = await unlockBackup(text, pass);
      setPass('');
      askFirst(plain, name);
    } catch (e) {
      if ((e as Error).message === 'passphrase') setStep({ s: 'locked', text, name, wrong: true });
      else notACopy();
    }
  };

  const field = 'w-full rounded-xl bg-[var(--color-bg)] border border-white/15 px-3 py-2.5 text-[15px] text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-light)]';
  const primary = 'w-full min-h-[44px] rounded-xl bg-[var(--color-accent)] text-[var(--color-stage)] font-medium text-[15px] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-light)]';
  const busy = step.s === 'busy';

  const body = mode === 'save' ? (
    step.s === 'saved' ? (
      <p className="text-[14.5px] leading-relaxed text-[var(--color-ink)]/85">
        {el ? (lock ? 'Το κλειδωμένο αντίγραφο αποθηκεύτηκε. Κράτα τον κωδικό σε ασφαλές μέρος.' : 'Το αντίγραφο αποθηκεύτηκε.') : (lock ? 'The locked copy was saved. Keep the passphrase somewhere safe.' : 'The copy was saved.')}
      </p>
    ) : (
      <>
        <p className="text-[14.5px] leading-relaxed text-[var(--color-ink)]/80">
          {el ? 'Ένα αρχείο με την πρόοδο, το Ημερολόγιο και τις ρυθμίσεις σου. Μένει μόνο όπου το αποθηκεύσεις εσύ.' : 'A file with your progress, Journal and settings. It stays only where you save it.'}
        </p>
        <label className="mt-4 flex items-center gap-3 min-h-[44px] cursor-pointer text-[15px] text-[var(--color-ink)]">
          <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} className="w-5 h-5 accent-[var(--color-accent)]" />
          <Lock size={16} aria-hidden="true" />
          {el ? 'Κλείδωσε το με κωδικό' : 'Lock it with a passphrase'}
        </label>
        {lock && (
          <div className="mt-2 space-y-2">
            <input type="password" autoComplete="new-password" value={pass} onChange={(e) => setPass(e.target.value)} className={field}
              aria-label={el ? 'Κωδικός' : 'Passphrase'} placeholder={el ? `Κωδικός (τουλάχιστον ${MIN_PASS} χαρακτήρες)` : `Passphrase (at least ${MIN_PASS} characters)`} />
            <input type="password" autoComplete="new-password" value={pass2} onChange={(e) => setPass2(e.target.value)} className={field}
              aria-label={el ? 'Ξανά ο κωδικός' : 'Passphrase again'} placeholder={el ? 'Ξανά ο κωδικός' : 'Passphrase again'} />
            {pass2.length > 0 && pass !== pass2 && (
              <p className="text-[13px] text-[var(--tint-rose-ink)]">{el ? 'Οι δύο κωδικοί δεν είναι ίδιοι.' : 'The two passphrases differ.'}</p>
            )}
            <p className="text-[13px] leading-relaxed text-[var(--color-ink)]/85 rounded-xl bg-[var(--tint-sand-bg)] border border-[var(--tint-sand-line)] p-3">
              {el ? 'Αν ξεχάσεις τον κωδικό, το αντίγραφο δεν ανοίγει, ούτε από τον δημιουργό της εφαρμογής ούτε από κανέναν.' : 'If you forget the passphrase, the copy cannot be opened, not by the app’s creator, not by anyone.'}
            </p>
          </div>
        )}
        {step.s === 'error' && <p role="alert" className="mt-3 text-[13.5px] text-[var(--tint-rose-ink)]">{step.message}</p>}
        <button type="button" onClick={save} disabled={busy || (lock && !passOk)} className={`mt-4 ${primary}`}>
          {busy ? (el ? 'Κλειδώνει…' : 'Locking…') : (el ? 'Αποθήκευση αντιγράφου' : 'Save the copy')}
        </button>
      </>
    )
  ) : (
    step.s === 'restored' ? (
      <div role="status" className="space-y-2 text-[14.5px] leading-relaxed text-[var(--color-ink)]/85">
        <p>{el ? 'Η επαναφορά έγινε. Η εφαρμογή ξεκινά ξανά.' : 'Restored. The app starts again.'}</p>
        {step.left > 0 && (
          <p className="text-[13.5px] text-[var(--color-ink)]/70">
            {el ? `${step.left} στοιχεία του αρχείου δεν είναι της εφαρμογής ή δεν έχουν τη σωστή μορφή, και δεν γράφτηκαν.` : `${step.left} items in the file are not the app’s or not in the right form, and were not written.`}
          </p>
        )}
      </div>
    ) : step.s === 'locked' ? (
      <form onSubmit={(e) => { e.preventDefault(); void unlock(step.text, step.name); }} className="space-y-3">
        <p className="text-[14.5px] leading-relaxed text-[var(--color-ink)]/80">
          {el ? 'Το αντίγραφο είναι κλειδωμένο. Γράψε τον κωδικό του.' : 'This copy is locked. Enter its passphrase.'}
        </p>
        <input type="password" autoComplete="current-password" autoFocus value={pass} onChange={(e) => setPass(e.target.value)} className={field}
          aria-label={el ? 'Κωδικός' : 'Passphrase'} aria-invalid={step.wrong || undefined} />
        {step.wrong && <p role="alert" className="text-[13.5px] text-[var(--tint-rose-ink)]">{el ? 'Ο κωδικός δεν ταιριάζει. Δεν άλλαξε τίποτα.' : 'The passphrase does not match. Nothing was changed.'}</p>}
        <button type="submit" disabled={!pass} className={primary}>{el ? 'Άνοιγμα' : 'Open'}</button>
      </form>
    ) : step.s === 'confirm' ? (
      <div className="space-y-3 text-[14.5px] leading-relaxed text-[var(--color-ink)]/85">
        <p className="font-medium text-[var(--color-ink)]">
          {step.preview.savedAt
            ? (el ? `Αντίγραφο της ${step.preview.savedAt.toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' })}.` : `A copy from ${step.preview.savedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.`)
            : (el ? 'Η μέρα αυτού του αντιγράφου δεν είναι γνωστή.' : 'The day of this copy is not known.')}
        </p>
        <p>{el ? 'Θα αντικαταστήσει σε αυτή τη συσκευή ό,τι έχει το αρχείο:' : 'On this device it will replace what the file holds:'}</p>
        <ul className="list-disc pl-5 space-y-1">
          {step.preview.journalDays > 0 && <li>{el ? `Ημερολόγιο: ${step.preview.journalDays} ${step.preview.journalDays === 1 ? 'μέρα' : 'μέρες'} (όπως ήταν τότε)` : `Journal: ${step.preview.journalDays} ${step.preview.journalDays === 1 ? 'day' : 'days'} (as they were then)`}</li>}
          {step.preview.progress && <li>{el ? 'Πρόοδος: κεφάλαια, Πρόγραμμα, πού σταμάτησες να διαβάζεις' : 'Progress: chapters, the Program, where you stopped reading'}</li>}
          {step.preview.record && <li>{el ? 'Το ιστορικό των ασκήσεων και του «Πώς νιώθεις»' : 'The record of practices and of “How do you feel”'}</li>}
          {step.preview.settings && <li>{el ? 'Ρυθμίσεις' : 'Settings'}</li>}
        </ul>
        <p className="text-[13.5px] text-[var(--color-ink)]/70">{el ? 'Ό,τι δεν έχει το αρχείο μένει όπως είναι.' : 'What the file does not hold stays as it is.'}</p>
        <div className="flex flex-col gap-2 pt-1">
          <button type="button" onClick={() => restoreText(step.text)} className={primary}>{el ? 'Ναι, επανάφερέ το' : 'Yes, restore it'}</button>
          <button type="button" onClick={onClose} className="w-full min-h-[44px] rounded-xl border border-white/15 text-[15px] text-[var(--color-ink)]/85">{el ? 'Άκυρο' : 'Cancel'}</button>
        </div>
      </div>
    ) : (
      <>
        <p className="text-[14.5px] leading-relaxed text-[var(--color-ink)]/80">
          {el ? 'Διάλεξε ένα αρχείο αντιγράφου της εφαρμογής. Ό,τι έχει θα αντικαταστήσει τα ίδια στοιχεία σε αυτή τη συσκευή.' : 'Choose a copy saved from the app. What it holds replaces the same items on this device.'}
        </p>
        {step.s === 'error' && <p role="alert" className="mt-3 text-[13.5px] text-[var(--tint-rose-ink)]">{step.message}</p>}
        <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => { chosen(e.target.files?.[0]); e.target.value = ''; }} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className={`mt-4 ${primary}`}>
          {busy ? (el ? 'Ανοίγει…' : 'Opening…') : (el ? 'Διάλεξε το αρχείο' : 'Choose the file')}
        </button>
      </>
    )
  );

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-2xl bg-[var(--color-surface)] border border-white/10 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 id={titleId} className="text-[18px] font-medium text-[var(--color-ink)]">
            {mode === 'save' ? (el ? 'Αντίγραφο των δεδομένων σου' : 'A copy of your data') : (el ? 'Επαναφορά από αντίγραφο' : 'Restore from a copy')}
          </h2>
          <button type="button" onClick={onClose} aria-label={el ? 'Κλείσιμο' : 'Close'}
            className="-m-2 w-11 h-11 shrink-0 flex items-center justify-center rounded-full text-[var(--color-ink)]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-light)]">
            <X size={18} />
          </button>
        </div>
        {body}
      </div>
    </div>,
    document.body,
  );
}
