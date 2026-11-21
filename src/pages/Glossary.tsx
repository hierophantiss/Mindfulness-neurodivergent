import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../hooks/useLanguage';
import { GLOSSARY } from '../data/glossary';
import { BOOK_NAME } from '../seo/head';

// The method's terms, from the book's glossary, word for word (data/glossary.ts
// is made from book/workbook_*.md). Each term says where it first appears;
// the chapter numbers lead to the chapters.

export default function Glossary() {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'el';
  const el = lang === 'el';
  const g = GLOSSARY[lang];
  // A search over the terms and what they mean (accents and case do not matter).
  const [query, setQuery] = useState('');
  const fold = (x: string) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const q = fold(query.trim());
  const terms = q ? g.terms.filter(t => fold(t.term).includes(q) || fold(t.definition).includes(q)) : g.terms;

  // A link to one term (/glossary#id) opens the page at that term.
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 60);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <div className="pt-2">
        <PageHeader back="/method" eyebrow={BOOK_NAME[lang]} title={el ? 'Γλωσσάρι' : 'Glossary'} lead={g.intro} />
      </div>

      <label className="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/10 px-4 min-h-[48px] focus-within:border-[var(--color-accent)]/60">
        <Search size={17} aria-hidden="true" className="shrink-0 text-ink/65" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={el ? 'Βρες έναν όρο' : 'Find a term'}
          aria-label={el ? 'Βρες έναν όρο' : 'Find a term'}
          className="flex-1 min-w-0 bg-transparent outline-none text-[16px] text-ink placeholder:text-ink/50"
        />
      </label>
      {q && terms.length === 0 && (
        <p role="status" className="text-[15px] text-ink/75">{el ? 'Κανένας όρος δεν ταιριάζει.' : 'No term matches.'}</p>
      )}

      <dl className="flex flex-col">
        {terms.map(t => (
          <div key={t.id} id={t.id} className="scroll-mt-6 flex flex-col gap-1.5 py-4 border-t border-white/[0.06] first:border-t-0 first:pt-0">
            <dt className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <span className="font-display text-[21px] leading-snug text-ink">{t.term}</span>
              <span className="text-[13px] text-ink/65">
                (
                {t.chapters.length ? (
                  <>
                    {t.chapters.map((n, i) => (
                      <span key={n}>
                        {i > 0 && ', '}
                        <Link
                          to={`/chapters/${n}`}
                          className="inline-flex items-center min-h-[44px] underline decoration-white/25 underline-offset-4 hover:text-ink/90"
                        >
                          {el ? `Κεφ. ${n}` : `Ch. ${n}`}
                        </Link>
                      </span>
                    ))}
                  </>
                ) : t.where}
                )
              </span>
            </dt>
            <dd className="text-[15.5px] leading-relaxed text-ink/80">{t.definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
