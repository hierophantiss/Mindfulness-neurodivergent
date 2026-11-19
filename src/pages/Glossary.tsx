import { Link } from 'react-router-dom';
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

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <div className="pt-2">
        <PageHeader back="/method" eyebrow={BOOK_NAME[lang]} title={el ? 'Γλωσσάρι' : 'Glossary'} lead={g.intro} />
      </div>

      <dl className="flex flex-col">
        {g.terms.map(t => (
          <div key={t.id} id={t.id} className="scroll-mt-6 flex flex-col gap-1.5 py-4 border-t border-white/[0.06] first:border-t-0 first:pt-0">
            <dt className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <span className="font-display text-[21px] leading-snug text-ink">{t.term}</span>
              <span className="text-[13px] text-ink/65">
                (
                {t.chapters.length ? (
                  <>
                    {el ? 'Κεφ. ' : 'Ch. '}
                    {t.chapters.map((n, i) => (
                      <span key={n}>
                        {i > 0 && ', '}
                        <Link
                          to={`/chapters/${n}`}
                          aria-label={el ? `Κεφάλαιο ${n}` : `Chapter ${n}`}
                          className="inline-block py-1 underline decoration-white/25 underline-offset-4 hover:text-ink/90"
                        >
                          {n}
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
