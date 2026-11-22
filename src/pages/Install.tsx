import { PageHeader } from '../components/PageHeader';
import { useState } from 'react';
import { Download, Share2, Check } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useInstallApp } from '../hooks/useInstallApp';
import { MICROSOFT_STORE_URL } from '../lib/links';
import { T } from '../data/pages/install';

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

// The Android APK (Play's, signed by Google) is offered only when anyone can
// use it: while the app is in Play's closed test, a copy from outside Play
// sends the person to Play, where only testers can get it. On once a version
// without Play's "Automatic protection" is up, or the app is public on Play.
const APK_FOR_ALL = false;


export default function Install() {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'el';
  const t = T[lang];
  // Back from /download/android when the file could not be reached.
  const apkLater = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('apk') === 'later';
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
      <div className="pt-2">
        <PageHeader back="/" title={t.title} lead={t.lead}>
          {installed && (
            <p role="status" className="flex items-center gap-2 text-[15px] text-[var(--axis-body-ink)]">
              <Check size={18} aria-hidden="true" /> {t.installed}
            </p>
          )}
        </PageHeader>
      </div>

      {order.map((p, i) => {
        const s = p === 'android' && APK_FOR_ALL ? t.sections.androidApk : t.sections[p];
        const note = (s as { note?: string }).note;
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
                className="btn-main self-start"
              >
                <Download size={17} aria-hidden="true" /> {t.store}
              </a>
            )}
            {p === 'android' && APK_FOR_ALL && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {/* A plain link: the site's /download/android sends it on to the file. */}
                <a
                  href={`/download/android?lang=${lang}`}
                  className="btn-main"
                >
                  <Download size={17} aria-hidden="true" /> {t.apk}
                </a>
                {apkLater && (
                  <p role="status" className="w-full text-[13.5px] text-ink/75">
                    {lang === 'el' ? 'Το αρχείο δεν είναι διαθέσιμο αυτή τη στιγμή. Δοκίμασε ξανά σε λίγο, ή εγκατάστησε από το Google Play.' : 'The file is not available right now. Try again shortly, or install from Google Play.'}
                  </p>
                )}
                <span className="text-[13px] text-ink/70">{t.apkSize}</span>
              </div>
            )}
            <ol className="flex flex-col gap-2 list-decimal pl-6 marker:text-ink/50">
              {s.steps.map(step => (
                <li key={step} className="text-[15.5px] leading-relaxed text-ink/85 pl-1">{step}</li>
              ))}
            </ol>
            {note && (
              <p className="text-[14px] leading-relaxed text-ink/70 border-l-2 border-white/15 pl-3">{note}</p>
            )}
            {first && !installed && ((p === 'android' && !APK_FOR_ALL) || p === 'other' || p === 'mac' || p === 'windows') && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={async () => setHint(await install())}
                  className={p === 'windows' ? 'btn-soft self-start' : 'btn-main self-start'}
                >
                  {/* Gold where it is the main way (on Windows the Store is). */}
                  {p !== 'windows' && <Download size={17} aria-hidden="true" />}
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
          className="btn-soft self-start"
        >
          {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
          {copied ? t.copied : t.share}
        </button>
      </section>
    </div>
  );
}
