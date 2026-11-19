import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../hooks/useLanguage';
import { CONTACT_EMAIL } from '../lib/links';
import { Block, T } from '../data/pages/privacy';

// Privacy, and what the app is and is not. The page the app stores link to as
// the privacy policy; it says the same as "About", in full.


export default function Privacy() {
  const { language } = useLanguage();
  const t = T[language === 'en' ? 'en' : 'el'];

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <div className="pt-2">
        <PageHeader back="/" title={t.title} lead={t.short}>
          <p className="text-[13px] text-ink/60">{t.updated}</p>
        </PageHeader>
      </div>

      {t.blocks.map(b => (
        <section key={b.title} className="flex flex-col gap-3">
          <h2 className="font-display text-[24px] leading-snug text-ink">{b.title}</h2>
          {b.paras?.map(p => <p key={p} className="text-[15.5px] leading-relaxed text-ink/80">{p}</p>)}
          {b.list && (
            <ul className="flex flex-col gap-2.5">
              {b.list.map(item => (
                <li key={item} className="flex gap-3 text-[15.5px] leading-relaxed text-ink/80">
                  <span className="mt-[11px] w-1.5 h-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {b.after?.map(p => <p key={p} className="text-[15.5px] leading-relaxed text-ink/90">{p}</p>)}
        </section>
      ))}

      <section aria-labelledby="privacy-crisis" className="card-relief rounded-3xl p-5 flex flex-col gap-2.5 border-[var(--tint-rose-line)]">
        <h2 id="privacy-crisis" className="font-display text-[22px] text-[var(--tint-rose-ink)]">{t.crisisTitle}</h2>
        <p className="text-[15px] leading-relaxed text-ink/80">{t.crisis[0]}</p>
        <ul className="flex flex-col gap-1.5">
          {t.crisis.slice(1).map(line => {
            const num = line.match(/\d{3,4}/)?.[0];
            return (
              <li key={line} className="text-[15.5px] text-ink/90">
                {num ? <>{line.slice(0, line.indexOf(num))}<a href={`tel:${num}`} className="font-medium text-[var(--tint-rose-ink)] underline underline-offset-4">{num}</a>{line.slice(line.indexOf(num) + num.length)}</> : line}
              </li>
            );
          })}
        </ul>
        <p className="text-[14px] text-ink/70">
          <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ink/90">{t.crisisAbroad}</a>
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-[24px] leading-snug text-ink">{t.contactTitle}</h2>
        <p className="text-[15.5px] leading-relaxed text-ink/80">{t.contact}</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-[15.5px] text-sign-gold underline underline-offset-4 break-all">{CONTACT_EMAIL}</a>
      </section>
    </div>
  );
}
