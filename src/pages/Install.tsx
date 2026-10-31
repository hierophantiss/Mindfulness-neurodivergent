import { useState } from 'react';
import { ArrowLeft, Download, Share2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useInstallApp } from '../hooks/useInstallApp';
import { MICROSOFT_STORE_URL } from '../lib/links';

// How to install the app, on every kind of device: the page to send to
// someone together with the link. The visitor's own device comes first.

const SITE = 'https://neurodivergent-mindfulness.org';

type Platform = 'windows' | 'android' | 'ios' | 'mac' | 'other';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  if (/Windows/.test(ua)) return 'windows';
  if (/Macintosh|Mac OS X/.test(ua)) return 'mac';
  return 'other';
}

const T = {
  el: {
    title: 'Εγκατάσταση',
    lead: 'Η εφαρμογή είναι δωρεάν και δεν θέλει λογαριασμό. Δουλεύει και μέσα στον browser, αλλά αν την εγκαταστήσεις μπαίνει στην αρχική οθόνη ή στο μενού Έναρξη, ανοίγει σε όλη την οθόνη και λειτουργεί και χωρίς σύνδεση.',
    yours: 'Η συσκευή σου',
    installed: 'Η εφαρμογή είναι ήδη εγκατεστημένη σε αυτή τη συσκευή.',
    now: 'Εγκατάσταση τώρα',
    store: 'Λήψη από το Microsoft Store',
    or: 'ή',
    sections: {
      windows: {
        name: 'Υπολογιστής με Windows',
        intro: 'Ο πιο απλός τρόπος είναι το Microsoft Store.',
        steps: ['Άνοιξε τη σελίδα της εφαρμογής στο Microsoft Store και πάτα «Λήψη».', 'Χωρίς το Store: άνοιξε τον ιστότοπο στο Edge ή στο Chrome και πάτα το εικονίδιο εγκατάστασης δεξιά στη γραμμή διεύθυνσης, ή Μενού (⋯ ή ⋮) → «Εφαρμογές» → «Εγκατάσταση».'],
      },
      android: {
        name: 'Κινητό ή tablet Android',
        intro: 'Από το Chrome, σε λίγα δευτερόλεπτα.',
        steps: ['Άνοιξε τον ιστότοπο στο Chrome.', 'Πάτα τις τρεις τελείες (⋮) πάνω δεξιά.', 'Πάτα «Εγκατάσταση εφαρμογής» ή «Προσθήκη στην αρχική οθόνη».', 'Στο Samsung Internet: το βελάκι λήψης στη γραμμή διεύθυνσης, ή Μενού → «Προσθήκη σελίδας σε» → «Αρχική οθόνη».'],
      },
      ios: {
        name: 'iPhone ή iPad',
        intro: 'Από το Safari, με το κουμπί Κοινοποίηση.',
        steps: ['Άνοιξε τον ιστότοπο στο Safari.', 'Πάτα το κουμπί Κοινοποίηση (το τετράγωνο με το βέλος προς τα πάνω).', 'Κατέβα και πάτα «Προσθήκη στην οθόνη αφετηρίας», μετά «Προσθήκη».'],
        note: 'Στο iPhone αξίζει να την προσθέσεις: αλλιώς το Safari σβήνει την πρόοδο και το ημερολόγιό σου, αν περάσουν 7 μέρες χωρίς να την ανοίξεις.',
      },
      mac: {
        name: 'Mac',
        intro: 'Από το Safari, το Chrome ή το Edge.',
        steps: ['Safari: μενού Αρχείο → «Προσθήκη στο Dock».', 'Chrome ή Edge: το εικονίδιο εγκατάστασης δεξιά στη γραμμή διεύθυνσης.'],
      },
      other: {
        name: 'Άλλη συσκευή',
        intro: 'Σε Chrome ή Edge, σε κάθε σύστημα.',
        steps: ['Άνοιξε τον ιστότοπο και πάτα το εικονίδιο εγκατάστασης στη γραμμή διεύθυνσης, ή Μενού → «Εγκατάσταση εφαρμογής».'],
      },
    },
    shareTitle: 'Στείλε τη σε κάποιον',
    shareText: 'Στείλε αυτή τη σελίδα: όποιος την ανοίξει βλέπει πρώτα τα βήματα για τη δική του συσκευή.',
    share: 'Κοινοποίηση',
    copied: 'Ο σύνδεσμος αντιγράφηκε',
    back: 'Πίσω',
  },
  en: {
    title: 'Install the app',
    lead: 'The app is free and needs no account. It works in the browser too, but once installed it sits on your home screen or Start menu, opens full screen and works offline.',
    yours: 'Your device',
    installed: 'The app is already installed on this device.',
    now: 'Install now',
    store: 'Get it from the Microsoft Store',
    or: 'or',
    sections: {
      windows: {
        name: 'Windows computer',
        intro: 'The simplest way is the Microsoft Store.',
        steps: ['Open the app’s page in the Microsoft Store and choose “Get”.', 'Without the Store: open the site in Edge or Chrome and click the install icon at the right of the address bar, or Menu (⋯ or ⋮) → “Apps” → “Install”.'],
      },
      android: {
        name: 'Android phone or tablet',
        intro: 'From Chrome, in a few seconds.',
        steps: ['Open the site in Chrome.', 'Tap the three dots (⋮) at the top right.', 'Tap “Install app” or “Add to Home screen”.', 'In Samsung Internet: the download arrow in the address bar, or Menu → “Add page to” → “Home screen”.'],
      },
      ios: {
        name: 'iPhone or iPad',
        intro: 'From Safari, with the Share button.',
        steps: ['Open the site in Safari.', 'Tap the Share button (the square with the arrow pointing up).', 'Scroll down, tap “Add to Home Screen”, then “Add”.'],
        note: 'On iPhone it is worth adding it: otherwise Safari clears your progress and journal after 7 days without a visit.',
      },
      mac: {
        name: 'Mac',
        intro: 'From Safari, Chrome or Edge.',
        steps: ['Safari: File menu → “Add to Dock”.', 'Chrome or Edge: the install icon at the right of the address bar.'],
      },
      other: {
        name: 'Another device',
        intro: 'In Chrome or Edge, on any system.',
        steps: ['Open the site and click the install icon in the address bar, or Menu → “Install app”.'],
      },
    },
    shareTitle: 'Send it to someone',
    shareText: 'Send this page: whoever opens it sees the steps for their own device first.',
    share: 'Share',
    copied: 'Link copied',
    back: 'Back',
  },
};

export default function Install() {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'el';
  const t = T[lang];
  const { installed, install } = useInstallApp(lang);
  const [hint, setHint] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [platform] = useState(detectPlatform);
  const order: Platform[] = [platform, ...(['windows', 'android', 'ios', 'mac'] as Platform[]).filter(p => p !== platform)];
  const pageUrl = `${SITE}/${lang}/install`;

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: lang === 'el' ? 'Ενσυνειδητότητα για Νευροδιαφορετικούς' : 'Neurodivergent Mindfulness', url: pageUrl });
        return;
      }
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* closed by the person, or not allowed */
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 pt-2">
        <Link to="/" aria-label={t.back} className="btn-zen !px-3 !py-3">
          <ArrowLeft size={20} />
        </Link>
      </div>

      <header className="flex flex-col gap-3">
        <h1 className="font-display text-[38px] desk:text-[52px] leading-[1.05] text-ink">{t.title}</h1>
        <p className="text-[16.5px] leading-relaxed text-ink/85">{t.lead}</p>
        {installed && (
          <p role="status" className="flex items-center gap-2 text-[15px] text-[var(--axis-body-ink)]">
            <Check size={18} aria-hidden="true" /> {t.installed}
          </p>
        )}
      </header>

      {order.map((p, i) => {
        const s = t.sections[p];
        const first = i === 0;
        return (
          <section
            key={p}
            aria-labelledby={`install-${p}`}
            className={first ? 'glass glass-gold rounded-[24px] p-5 desk:p-6 flex flex-col gap-3' : 'flex flex-col gap-3'}
          >
            {first && p !== 'other' && <span className="text-[13px] text-sign-gold">{t.yours}</span>}
            <h2 id={`install-${p}`} className="font-display text-[24px] leading-snug text-ink">{s.name}</h2>
            <p className="text-[15.5px] leading-relaxed text-ink/80">{s.intro}</p>
            {p === 'windows' && (
              <a
                href={MICROSOFT_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold self-start inline-flex items-center gap-2 min-h-[46px] px-5 rounded-full text-[15px] font-medium"
              >
                <Download size={17} aria-hidden="true" /> {t.store}
              </a>
            )}
            <ol className="flex flex-col gap-2 list-decimal pl-6 marker:text-ink/50">
              {s.steps.map(step => (
                <li key={step} className="text-[15.5px] leading-relaxed text-ink/85 pl-1">{step}</li>
              ))}
            </ol>
            {'note' in s && s.note && (
              <p className="text-[14px] leading-relaxed text-ink/70 border-l-2 border-white/15 pl-3">{s.note}</p>
            )}
            {first && !installed && (p === 'android' || p === 'other' || p === 'mac' || p === 'windows') && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={async () => setHint(await install())}
                  className="self-start inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border border-white/15 bg-white/[0.04] text-[14.5px] text-ink/90 hover:bg-white/[0.08] transition-colors"
                >
                  {p === 'windows' ? `${t.or} ${t.now.toLowerCase()}` : t.now}
                </button>
                {hint && <p role="status" className="text-[14px] leading-relaxed text-ink/70">{hint}</p>}
              </div>
            )}
          </section>
        );
      })}

      <section aria-labelledby="install-share" className="flex flex-col gap-3 pt-2 border-t border-white/[0.06]">
        <h2 id="install-share" className="font-display text-[24px] leading-snug text-ink pt-4">{t.shareTitle}</h2>
        <p className="text-[15.5px] leading-relaxed text-ink/80">{t.shareText}</p>
        <p className="text-[15px] text-ink/90 break-all">{pageUrl}</p>
        <button
          type="button"
          onClick={share}
          className="self-start inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border border-white/15 bg-white/[0.04] text-[14.5px] text-ink/90 hover:bg-white/[0.08] transition-colors"
        >
          {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
          {copied ? t.copied : t.share}
        </button>
      </section>
    </div>
  );
}
