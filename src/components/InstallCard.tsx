import { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { isIOSBrowserTab } from '../lib/dataSafety';
import { isNative } from '../lib/native';
import { promptInstall } from '../lib/installPrompt';

/**
 * On the home page: the app on your screen, with one tap. Shown only where it
 * can be done that way (the browser has offered to install), or on an iPhone
 * or iPad in Safari, where the card says the two steps instead (Apple allows
 * no install button). Never in the Android app or once installed. "Not now"
 * means a month of quiet.
 */

const SNOOZE_KEY = 'n_mindfulness_install_card_snooze';
const MONTH = 30 * 24 * 60 * 60 * 1000;

function snoozed(): boolean {
  try {
    const t = Number(localStorage.getItem(SNOOZE_KEY));
    return Number.isFinite(t) && t > 0 && Date.now() - t < MONTH;
  } catch {
    return false;
  }
}

type Props = {
  lang: 'el' | 'en';
  installed: boolean;
  canPrompt: boolean;
};

export default function InstallCard({ lang, installed, canPrompt }: Props) {
  const [quiet] = useState(snoozed);
  const [ios] = useState(isIOSBrowserTab);
  const [state, setState] = useState<'ask' | 'done' | 'gone'>('ask');
  const el = lang === 'el';

  if (isNative() || quiet || state === 'gone') return null;
  if (state === 'ask' && (installed || !(canPrompt || ios))) return null;

  const later = () => {
    try { localStorage.setItem(SNOOZE_KEY, String(Date.now())); } catch { /* storage blocked: the card may come back */ }
    setState('gone');
  };

  // The browser's own window asks; whatever the answer, the card has done its part.
  const go = async () => {
    const outcome = await promptInstall();
    setState(outcome === 'accepted' ? 'done' : 'gone');
  };

  return (
    <section
      aria-labelledby="home-install-title"
      className="mt-6 desk:mt-8 flex items-start gap-3 rounded-2xl bg-[var(--tint-lav-bg)] border border-[var(--tint-lav-line)] pl-4 pr-2 py-3 desk:max-w-[720px]"
    >
      <div className="flex-1 min-w-0">
        {state === 'ask' ? (
          <>
            <h2 id="home-install-title" className="text-[14px] font-medium leading-snug text-ink/90">
              {el ? 'Η εφαρμογή στην οθόνη σου' : 'The app on your screen'}
            </h2>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink/75">
              {el
                ? 'Χωρίς κατάστημα και χωρίς λογαριασμό. Ανοίγει σαν εφαρμογή, δουλεύει και χωρίς σύνδεση, και ό,τι γράφεις μένει στη συσκευή σου.'
                : 'No store and no account. It opens like an app, works offline, and what you write stays on your device.'}
            </p>
            {ios ? (
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/85">
                {el ? 'Πάτα ' : 'Tap '}
                <span className="inline-flex items-center gap-1 align-middle text-ink">
                  <Share size={14} aria-hidden="true" />
                  {el ? '«Κοινοποίηση»' : '“Share”'}
                </span>
                {el
                  ? ' στη γραμμή του Safari και μετά «Προσθήκη στην οθόνη αφετηρίας».'
                  : ' in Safari’s bar, then “Add to Home Screen”.'}
              </p>
            ) : null}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {!ios && (
                <button
                  type="button"
                  onClick={go}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full px-3.5 bg-[var(--tint-lav-hi)] border border-[var(--tint-lav-line)] text-[13px] text-ink/90 hover:text-ink transition-colors"
                >
                  <Download size={14} aria-hidden="true" />
                  {el ? 'Εγκατάσταση' : 'Install'}
                </button>
              )}
              <button
                type="button"
                onClick={later}
                className="min-h-[44px] inline-flex items-center px-2 text-[13px] text-ink/65 hover:text-ink/85 transition-colors"
              >
                {el ? 'Όχι τώρα' : 'Not now'}
              </button>
            </div>
          </>
        ) : (
          <p id="home-install-title" role="status" className="text-[13.5px] leading-relaxed text-ink/85">
            {el
              ? 'Έγινε. Θα τη βρεις στην οθόνη σου ως «Mindfulness».'
              : 'Done. You will find it on your screen as “Mindfulness”.'}
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
