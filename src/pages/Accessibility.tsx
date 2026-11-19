import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../hooks/useLanguage';
import { CONTACT_EMAIL } from '../lib/links';
import { Block, T } from '../data/pages/accessibility';

// The accessibility statement: what the app already does, how it is checked,
// what does not work well yet, and how to say so. Kept honest: when something
// here changes, the date and the lists change with it.


export default function Accessibility() {
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
        </section>
      ))}

      <section className="card-relief rounded-3xl p-5 flex flex-col gap-2.5">
        <h2 className="font-display text-[24px] leading-snug text-ink">{t.contactTitle}</h2>
        <p className="text-[15.5px] leading-relaxed text-ink/80">{t.contact}</p>
        <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.subject)}`} className="text-[15.5px] text-sign-gold underline underline-offset-4 break-all">{CONTACT_EMAIL}</a>
      </section>
    </div>
  );
}
