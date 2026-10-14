import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../hooks/useLanguage';

/** Shown for any address the app does not know. The static dist/404.html is served with status 404. */
export default function NotFound() {
  const { language } = useLanguage();
  const el = language === 'el';

  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] px-6 text-center gap-8">
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="space-y-4 max-w-md">
        <h1 className="text-3xl md:text-4xl font-serif italic text-white/90 leading-snug">
          {el ? 'Αυτή η σελίδα δεν υπάρχει' : 'This page does not exist'}
        </h1>
        <p className="text-base md:text-lg text-white/60 font-light leading-relaxed">
          {el
            ? 'Ίσως άλλαξε η διεύθυνση. Άφησε μια αργή εκπνοή και συνέχισε από εδώ.'
            : 'The address may have changed. Let out a slow exhale and carry on from here.'}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Link
          to="/"
          className="flex-1 text-center p-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-white/90 transition-all"
        >
          {el ? 'Στην αρχική' : 'Home'}
        </Link>
        <Link
          to="/chapters"
          className="flex-1 text-center p-4 rounded-2xl border border-white/5 hover:border-white/15 text-white/60 hover:text-white/85 transition-all"
        >
          {el ? 'Στα κεφάλαια' : 'Chapters'}
        </Link>
      </div>
    </div>
  );
}
