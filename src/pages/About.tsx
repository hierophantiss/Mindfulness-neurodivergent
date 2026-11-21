import { Link } from 'react-router-dom';
import { Anchor, Wind, Focus, Maximize, Mail, MessageCircleHeart } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { openWelcome } from '../lib/welcome';
import { useLanguage } from '../hooks/useLanguage';
import { ABOUT } from '../data/about';
import { AXIS_COLOR } from '../data/axisColor';
import { MICROSOFT_STORE_URL, CONTACT_EMAIL } from '../lib/links';
import { feedbackMailto } from '../lib/feedback';
import { versionText } from '../lib/version';
import { BOOK_NAME } from '../seo/head';

// About: the method, the app and its maker, in the words of the old "About"
// window (data/about.ts), word for word, now a page of its own.

const AXIS_ICON = { body: Anchor, breath: Wind, attention: Focus, space: Maximize } as const;

const h2 = 'font-display text-[24px] leading-snug text-ink';
const para = 'text-[15.5px] leading-relaxed text-ink/80';
const textLink = 'inline-flex items-center min-h-[44px] text-[14.5px] text-ink/75 underline decoration-white/25 underline-offset-4 hover:text-ink';

function Dots({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map(item => (
        <li key={item} className={`flex gap-3 ${para}`}>
          <span className="mt-[11px] w-1.5 h-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A text with the page's name in quotes («…» / “…”) made into a link to that page. */
function ProLinked({ text, to }: { text: string; to: string }) {
  const m = text.match(/^([\s\S]*?)([«“])([^»”]+)([»”])([\s\S]*)$/);
  if (!m) return <>{text}</>;
  return <>{m[1]}<Link to={to} className="underline decoration-white/25 underline-offset-4 hover:text-ink">{m[2]}{m[3]}{m[4]}</Link>{m[5]}</>;
}

export default function About() {
  const { language } = useLanguage();
  const l = language === 'en' ? 'en' : 'el';
  const el = l === 'el';
  const a = ABOUT;

  return (
    <div className="flex flex-col gap-9 pb-10 animate-in fade-in duration-500">
      <div className="pt-2">
        <PageHeader back="/" eyebrow={a.title[l]} title={el ? 'Σχετικά' : 'About'} lead={a.subtitle[l]}>
          <p className="text-[15px] leading-relaxed text-ink/70 max-w-[36em]">{a.subtitlePlain[l]}</p>
        </PageHeader>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className={h2}>{el ? 'Καλώς ήρθες' : 'Welcome'}</h2>
        <p className={para}>{a.purpose[l]}</p>
        <p className="flex flex-wrap gap-x-5">
          <Link to="/method" className={textLink}>{el ? 'Η Μέθοδος' : 'The Method'}</Link>
          <Link to="/chapters" className={textLink}>{BOOK_NAME[l]}</Link>
          {/* The welcome's three cards (who it is for, what it is not), at any time. */}
          <button type="button" onClick={openWelcome} className={textLink}>{el ? 'Η εφαρμογή σε 3 κάρτες' : 'The app in 3 cards'}</button>
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={h2}>{a.features.title[l]}</h2>
        <Dots items={a.features.items.map(i => i[l])} />
      </section>

      <section className="card-relief rounded-3xl p-5 desk:p-6 flex flex-col gap-3">
        <h2 className={h2}>{a.trauma.title[l]}</h2>
        <Dots items={a.trauma.items.map(i => i[l])} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={h2}>{a.research.title[l]}</h2>
        <Dots items={a.research.items.map(i => i[l])} />
        <p><Link to="/methodology" className={textLink}>{a.research.more[l]}</Link></p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={h2}>{a.axesTitle[l]}</h2>
        <ul className="grid grid-cols-1 desk:grid-cols-2 gap-3">
          {a.axes.map(axis => {
            const Icon = AXIS_ICON[axis.id];
            return (
              <li key={axis.id} className="card-relief rounded-3xl px-4 py-3.5 flex gap-3 items-start">
                <span className="icon-relief w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center border border-white/10">
                  <Icon size={18} aria-hidden="true" style={{ color: AXIS_COLOR[axis.id] }} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-[16px] text-ink">{axis.title[l]}</span>
                  <span className="text-[14px] leading-relaxed text-ink/75">{axis.desc[l]}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="about-creator" className="flex flex-col gap-2.5">
        <p className="text-[13px] font-medium text-teal-400">{a.creatorLabel[l]}</p>
        <h2 id="about-creator" className={h2}>{a.creatorName[l]}</h2>
        <p className={para}>{a.creatorDesc[l]}</p>
        <p className="text-[15.5px] leading-relaxed text-ink/90">{a.creatorQuote[l]}</p>
        <p className={para}>{a.madeWith[l]}</p>
      </section>

      {/* For whoever would recommend it at work: what it is and is not, the licence, how. */}
      <section id="professionals" aria-labelledby="about-professionals" className="card-relief rounded-3xl p-5 desk:p-6 flex flex-col gap-3 scroll-mt-24">
        <h2 id="about-professionals" className={h2}>{a.professionals.title[l]}</h2>
        {a.professionals.blocks.map(b => (
          <p key={b.head.en} className={para}>
            <strong className="font-semibold text-ink">{b.head[l]}</strong>{' '}
            {b.link ? <ProLinked text={b.text[l]} to={b.link} /> : b.text[l]}
          </p>
        ))}
        <p className={para}>
          <strong className="font-semibold text-ink">{a.professionals.contactHead[l]}</strong>{' '}
          {a.creatorName[l]} · <a href={`mailto:${CONTACT_EMAIL}`} className="underline decoration-white/25 underline-offset-4 hover:text-ink">{CONTACT_EMAIL}</a>
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={h2}>{a.contact.title[l]}</h2>
        <p className={para}>{a.contact.text[l]}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={feedbackMailto(l)}
            className="inline-flex items-center gap-2 px-5 min-h-[44px] rounded-full bg-white/[0.05] border border-sign-gold/40 text-[14px] text-ink/90 hover:bg-white/[0.09] transition-colors"
          >
            <MessageCircleHeart size={15} aria-hidden="true" className="text-sign-gold" />
            {el ? 'Τι θα άλλαζες;' : 'What would you change?'}
          </a>
          <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(a.contact.subject[l])}`} className="btn-soft">
            <Mail size={15} aria-hidden="true" className="text-ink/70" />
            {a.contact.button[l]}
          </a>
        </div>
        <p className="text-[14px] leading-relaxed text-ink/70">{a.contact.note[l]}</p>
        <p className="text-[14px] leading-relaxed text-ink/70">{a.contact.urgent[l]}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={h2}>{a.privacy.title[l]}</h2>
        <p className={para}>{a.privacy.text[l]}</p>
        <p className="flex flex-wrap gap-x-5">
          <Link to="/privacy" className={textLink}>{el ? 'Απόρρητο και όροι, όλο το κείμενο' : 'Privacy and terms, in full'}</Link>
          <Link to="/accessibility" className={textLink}>{el ? 'Προσβασιμότητα' : 'Accessibility'}</Link>
          <Link to="/install" className={textLink}>{el ? 'Πώς την εγκαθιστάς' : 'How to install it'}</Link>
          <a href={MICROSOFT_STORE_URL} target="_blank" rel="noopener noreferrer" className={textLink}>Microsoft Store</a>
        </p>
      </section>

      <footer className="flex flex-col items-center gap-1 pt-4 border-t border-white/[0.06] text-center">
        <p className="text-[13px] text-ink/65">{a.footer[l]}</p>
        <p className="text-[12px] text-ink/65 tabular-nums">{versionText(l)}</p>
      </footer>
    </div>
  );
}
