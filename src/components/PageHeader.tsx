import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

// One header for the app's pages, so every page opens the same way:
// a row with the way back (and, if the page has one, its own action on the
// right), then a small line that says where you are, the title in GFS Didot,
// and a sentence or two on what the page is for. Left-aligned, on the phone
// and on the computer.
//
// size "main": the pages you reach from the bar (Read, Practice, the
//   Programme, Install…). size "sub": a page inside one of them (a category,
//   a week, the questions).
//
// Pages that are a practice in progress (a breath, the Sanctuary, a reading)
// keep their own quiet bar instead: there the content is the point.

type Props = {
  title: ReactNode;
  /** Where you are, above the title (e.g. "Practice"). */
  eyebrow?: ReactNode;
  /** The line above is part of the heading (it names what the page is). */
  eyebrowInTitle?: boolean;
  lead?: ReactNode;
  /** Where the arrow goes: a path, a function, or nothing for no arrow. */
  back?: string | (() => void);
  /** The page's own action, at the right of the top row. */
  action?: ReactNode;
  size?: 'main' | 'sub';
  /** Anything that belongs to the header under the lead (a status, a link). */
  children?: ReactNode;
  id?: string;
};

export function PageHeader({ title, eyebrow, eyebrowInTitle = false, lead, back, action, size = 'main', children, id }: Props) {
  const eyebrowClass = 'sky-text text-[13px] desk:text-[14px] font-medium text-teal-400';
  const titleClass = `sky-text font-display text-ink text-balance ${
    size === 'main'
      ? 'text-[38px] max-[359px]:text-[34px] leading-[1.05] desk:text-[52px]'
      : 'text-[30px] max-[359px]:text-[27px] leading-[1.1] desk:text-[40px]'
  }`;
  const navigate = useNavigate();
  const { language } = useLanguage();
  const goBack = typeof back === 'function' ? back : back ? () => navigate(back) : null;

  return (
    <div className="flex flex-col gap-5 desk:gap-6">
      {(goBack || action) && (
        <div className="flex items-center justify-between gap-3 min-h-[44px]">
          {goBack ? (
            <button
              type="button"
              onClick={goBack}
              aria-label={language === 'en' ? 'Back' : 'Πίσω'}
              className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-white/10 border border-white/[0.06] text-ink/70 hover:text-ink transition-colors"
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      <header className="flex flex-col gap-2.5">
        {eyebrowInTitle && eyebrow ? (
          // The line above belongs to the heading (e.g. the book's name above "The book"):
          // both in the h1, looking exactly as the two separate lines.
          <h1 id={id} className="flex flex-col gap-2.5">
            <span className={eyebrowClass}>{eyebrow}</span>
            <span className={titleClass}>{title}</span>
          </h1>
        ) : (
          <>
            {eyebrow && <p className={eyebrowClass}>{eyebrow}</p>}
            <h1 id={id} className={titleClass}>
              {title}
            </h1>
          </>
        )}
        {lead && <p className="sky-text text-[16px] desk:text-[17px] leading-relaxed text-ink/75 max-w-[36em]">{lead}</p>}
        {children}
      </header>
    </div>
  );
}
