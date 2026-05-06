import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

export default function RabbitHole() {
  const { language } = useLanguage();
  const [activeArticle, setActiveArticle] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  const touchStartX = useRef(0);

  const t = {
    title: language === 'en' ? 'The Rabbit Hole' : 'Η Τρύπα του Λαγού',
    subtitle: language === 'en' ? 'Allegories of the World' : 'Αλληγορίες του Κόσμου',
    back: language === 'en' ? 'Back' : 'Πίσω',
    startReading: language === 'en' ? 'Start Reading' : 'Έναρξη Ανάγνωσης',
    close: language === 'en' ? 'Close' : 'Κλείσιμο',
  };

  const articles = [
    {
      id: 'buddha-autism',
      title: language === 'en' ? 'Was Buddha on the Spectrum?' : 'Ήταν ο Βούδας στο φάσμα;',
      author: 'Louise Woodford',
      pages: language === 'en' ? [
        "Do you find it shocking to imply that the Buddha might have been autistic? Autism is nothing more than a different cognitive and behavioral functioning, often misunderstood because it doesn't meet majority expectations.",
        "An autistic person is not disordered or lacking in spiritual evolution. I've often wondered: if Buddha Shakyamuni lived today in the West, what 'diagnosis' would he receive?",
        "He wasn't a follower of crowds; he often moved against social expectations. He avoided intimacy, found peace in solitude, felt a connection with animals, reflected deeply, and held high moral values.",
        "He was a solitary child, preferring to sit by a tree rather than play with peers. As an adult, he wandered from community to community, unattached socially, absolutely dedicated to awakening.",
        "He experienced the world with unusually deep internal sensitivity. Does this sound familiar?",
        "Friendships and connections are created through emotional bridges. Having emotions that are 'all or nothing' makes creating these emotional bridges difficult. If you were to design a condition that deprives you of this connection, it would be autism.",
        "A large part of our suffering as autistic individuals is caused by the comparing mind and attachment. The Dharma teaches us that the comparing mind is one of the ego's tools to construct identity.",
        "Through meditation, I learn to observe my thoughts, so when these comparison thoughts arise, I can simply watch them come and go without fighting them.",
        "Body mindfulness was another great help. Now I recognize that emotions manifest physically in my body, and I can observe those sensations without running away from them.",
        "Why would I want to be 'ordinary'? If I take four pieces of wood and place a flat board on top, that structure is called a 'table' — a construct of the mind. Just like the table, the 'autistic person' is a concept.",
        "Environmental activist Greta Thunberg said autism is a superpower. If there is a type of person who can give the spiritual path the unwavering focus it demands, that might just be an autistic person!",
        "I have decided to show up in life as I imagine the Buddha would: with vulnerable honesty, openly, without masks. If some people find me strange or boring, that is fine.",
        "For now, I will accept the label 'autistic' — just as I accept the word 'table'. But autism is not what I am in my essence. And, with all due respect, I do not believe it is a disorder.",
        "If you look for me, you will find me mentally in the forest, with the trees and the animals, reflecting deeply. Because, ultimately, there is nothing — absolutely nothing — that I am missing."
      ] : [
        "Πιστεύετε ότι ο Βούδας ήταν τέλειος, χωρίς καμία «διαταραχή», και σας φαίνεται παράλογο ή σοκαριστικό να υπονοηθεί ότι μπορεί να ήταν αυτιστικός; Αν ναι, τότε ίσως η αντίληψή σας για το τι σημαίνει «αυτισμός» να είναι ελαφρώς παραπλανητική.",
        "Ο αυτισμός δεν είναι τίποτα περισσότερο από μια διαφορετική γνωστική και συμπεριφορική λειτουργία. Ένα άτομο στο αυτιστικό φάσμα δεν είναι διαταραγμένο ούτε μειονεκτεί σε ό,τι αφορά την πνευματική εξέλιξη.",
        "Πολλές φορές έχω αναρωτηθεί: αν ο Βούδας Σακιαμούνι ζούσε σήμερα στη Δύση, ποια \"διάγνωση\" θα του αποδιδόταν; Δεν ήταν άνθρωπος που ακολουθούσε τα πλήθη – το αντίθετο μάλιστα: κινούταν κόντρα στις κοινωνικές προσδοκίες.",
        "Απέφευγε την οικειότητα, έβρισκε γαλήνη στη μοναξιά, ένιωθε συνάφεια με τα ζώα, στοχαζόταν βαθιά, είχε υψηλές ηθικές αξίες. Ήταν μοναχικό παιδί, που προτιμούσε να κάθεται δίπλα σε ένα δέντρο παρά να παίζει με τους συνομηλίκους του.",
        "Ως ενήλικας, περιπλανιόταν από κοινότητα σε κοινότητα, δεν δεσμευόταν κοινωνικά, ήταν απόλυτα αφοσιωμένος στην αφύπνιση. Βίωνε τον κόσμο με μια ασυνήθιστα βαθιά και ευαίσθητη εσωτερικότητα.\n\nΣας φαίνεται οικείο όλο αυτό;",
        "Οι φιλίες και οι συνδέσεις δημιουργούνται μέσω συναισθηματικών γεφυρών. Το να έχουμε συναισθήματα που είναι «όλα ή τίποτα» δυσκολεύει τη δημιουργία αυτών των γεφυρών. Έτσι, αν σχεδιάζατε μια συνθήκη που σας στερεί την ευκολία σύνδεσης, αυτή θα ήταν ο αυτισμός.",
        "Ένα μεγάλο μέρος των δεινών μας ως αυτιστικών ατόμων προκαλείται από τη σύγκριση του νου και την προσκόλληση. Το ντάρμα μας διδάσκει ότι η σύγκριση του νου είναι ένα από τα εργαλεία του εγώ για να κατασκευάσει ταυτότητα.",
        "Μέσω του διαλογισμού, μαθαίνω να παρατηρώ τις σκέψεις μου, έτσι ώστε όταν προκύπτουν αυτές οι σκέψεις σύγκρισης, να μπορώ απλώς να τις παρακολουθώ να έρχονται και να φεύγουν.",
        "Η ενσυνειδητότητα του σώματος ήταν μια άλλη μεγάλη βοήθεια. Τώρα αναγνωρίζω ότι τα συναισθήματα εκδηλώνονται φυσικά στο σώμα μου και μπορώ να σταματήσω να τρέχω μακριά από τις αισθήσεις που δεν μου αρέσουν.",
        "Γιατί να θέλω να γίνω “συνηθισμένος”; Αν πάρω τέσσερα κομμάτια ξύλου και ένα επίπεδο ξύλο, τότε αυτή η δομή ονομάζεται «τραπέζι» — μια κατασκευή του νου. Όπως και το τραπέζι, έτσι και το «αυτιστικό άτομο» είναι μια έννοια.",
        "Η περιβαλλοντική ακτιβίστρια Γκρέτα Τούνμπεργκ είπε πως ο αυτισμός είναι υπερδύναμη. Αν υπάρχει ένας τύπος ανθρώπου που μπορεί να δώσει στο πνευματικό μονοπάτι την ακλόνητη εστίαση που απαιτεί, τότε αυτός μπορεί να είναι ένα αυτιστικό άτομο!",
        "Έχω αποφασίσει να εμφανίζομαι στη ζωή όπως φαντάζομαι ότι θα έκανε ο Βούδας: με ευάλωτη ειλικρίνεια, ανοιχτά, χωρίς μάσκες. Αν κάποιοι με βρίσκουν παράξενο ή βαρετό, δεν πειράζει.",
        "Προς το παρόν, θα αποδεχτώ την ταμπέλα “αυτιστικός” — όπως αποδέχομαι τη λέξη “τραπέζι”. Όμως ο αυτισμός δεν είναι αυτό που είμαι στην ουσία μου. Και, με κάθε σεβασμό, δεν πιστεύω πως είναι διαταραχή.",
        "Αν με αναζητήσετε, θα με βρείτε νοερά στο δάσος, μαζί με τα δέντρα και τα ζώα, να στοχάζομαι βαθιά. Γιατί, τελικά, δεν υπάρχει τίποτα — απολύτως τίποτα — που να μου λείπει."
      ]
    }
  ];

  // Story Viewer Handlers
  const handleNext = () => {
    if (activeArticle) {
      const activeData = articles.find(a => a.id === activeArticle);
      if (activeData && currentPage < activeData.pages.length - 1) {
        setCurrentPage(p => p + 1);
      }
    }
  };

  const handlePrev = () => {
    setCurrentPage(p => Math.max(0, p - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 40) {
      handleNext(); // swipe left -> next page
    } else if (diff < -40) {
      handlePrev(); // swipe right -> prev page
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeArticle) {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'Escape') setActiveArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Story Viewer Render
  if (activeArticle) {
    const article = articles.find(a => a.id === activeArticle);
    if (!article) return null;

    return (
      <div className="fixed inset-0 z-50 bg-[#050f1c] text-white flex flex-col animate-in fade-in duration-300">
        
        {/* Top Progress Bar & Header */}
        <div className="pt-safe px-4 pb-3 flex items-center justify-between border-b border-pine-800/40 bg-[#071324]/80 backdrop-blur-md relative z-20">
          <button 
            onClick={() => setActiveArticle(null)} 
            className="p-2 -ml-2 text-pine-400 hover:text-white transition-colors active:scale-95"
            aria-label={t.close}
          >
            <X size={24} />
          </button>
          <div className="flex-1 px-4 text-center">
            <h2 className="text-[14px] font-bold text-pine-100 truncate">{article.title}</h2>
          </div>
          <div className="w-10 text-xs text-teal-400 font-mono text-right font-medium tracking-wide">
            {currentPage + 1}<span className="text-pine-600">/{article.pages.length}</span>
          </div>
        </div>

        {/* Progress Indicator Lines */}
        <div className="flex gap-1.5 px-4 py-3 opacity-80 z-20">
          {article.pages.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i === currentPage 
                  ? 'bg-teal-400 scale-y-125' 
                  : i < currentPage 
                    ? 'bg-teal-500/50' 
                    : 'bg-pine-800/60'
              }`} 
            />
          ))}
        </div>

        {/* Reading Area */}
        <div 
          className="flex-1 relative flex items-center justify-center px-6 md:px-16 pb-10"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Text Content */}
          <div 
            key={currentPage} 
            className="max-w-xl w-full animate-in fade-in zoom-in-[0.98] duration-300 ease-out"
          >
            <BookOpen size={24} className="text-teal-500/20 mx-auto justify-center mb-6" />
            <p className="text-[19px] md:text-[22px] leading-[1.8] font-serif text-pine-100 text-center tracking-wide" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.4)"}}>
              {article.pages[currentPage]}
            </p>
          </div>

          {/* Invisible Hitboxes with glowing subtle chevrons */}
          <button 
            className="absolute top-0 left-0 w-[40%] h-full z-10 flex flex-col justify-center items-start pl-2 md:pl-6 group outline-none"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            aria-label="Previous page"
            disabled={currentPage === 0}
          >
            {currentPage > 0 && (
              <div className="p-3 rounded-full opacity-10 md:opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronLeft size={40} className="text-white" />
              </div>
            )}
          </button>
          
          <button 
            className="absolute top-0 right-0 w-[40%] h-full z-10 flex flex-col justify-center items-end pr-2 md:pr-6 group outline-none"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            aria-label="Next page"
            disabled={currentPage === article.pages.length - 1}
          >
            {currentPage < article.pages.length - 1 && (
              <div className="p-3 rounded-full opacity-10 md:opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronRight size={40} className="text-white" />
              </div>
            )}
          </button>

        </div>
      </div>
    );
  }

  // List View Render (when activeArticle is null)
  return (
    <div className="flex flex-col min-h-screen bg-[#071324] animate-in fade-in pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#071324]/80 backdrop-blur-xl border-b border-pine-800/60 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <Link 
            to="/"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-pine-900/50 text-pine-200 hover:text-white transition-colors active:scale-95"
            aria-label={t.back}
          >
            <ChevronLeft size={24} />
          </Link>
          <div className="flex flex-col items-center flex-1">
            <h1 className="text-sm font-bold text-pine-100 tracking-wide uppercase flex items-center gap-2">
              <span className="text-xl">🐇🕳️</span> {t.title}
            </h1>
            <p className="text-[10px] text-pine-400 uppercase tracking-widest">{t.subtitle}</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pt-6 max-w-2xl mx-auto w-full">
        <p className="text-pine-300/80 text-sm italic mb-8 text-center px-4 leading-relaxed">
          {language === 'en' 
            ? 'A collection of theoretical pieces, allegories, and insights from across the world charting the human path to the exploration of consciousness.'
            : 'Μια βιβλιοθήκη με θεωρητικά κείμενα, αλληγορίες και στοχασμούς από όλο τον κόσμο για την ανθρώπινη πορεία προς την εξερεύνηση της συνειδητότητας.'}
        </p>

        <div className="space-y-4 md:space-y-6">
          {/* Link to Method & Symbols */}
          <Link 
            to="/method"
            className="w-full bg-gradient-to-br from-pine-800/60 to-pine-900/80 border border-pine-600/40 rounded-[2rem] p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.25)] block text-left transition-all duration-500 active:scale-[0.98] hover:shadow-[0_12px_40px_rgba(20,184,166,0.15)] hover:border-teal-500/30 relative overflow-hidden group backdrop-blur-md"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-500">
              <span className="text-[100px] md:text-[140px]">🐘</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="flex items-center gap-4 mb-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-pine-950/80 flex items-center justify-center border border-white/5 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                <span className="text-[24px] drop-shadow-md">🐘</span>
              </div>
              <div>
                <h2 className="text-[19px] md:text-[22px] font-heading font-medium text-white leading-snug tracking-wide group-hover:text-teal-50 transition-colors">{language === 'en' ? 'The Method & Symbols' : 'Η Μέθοδος & τα Σύμβολα'}</h2>
                <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-teal-400/80 font-bold mt-1.5">{language === 'en' ? 'THE ELEPHANT & THE MONKEY' : 'Ο ΕΛΕΦΑΝΤΑΣ ΚΑΙ Η ΜΑΙΜΟΥ'}</p>
              </div>
            </div>
            <p className="text-pine-200/90 text-sm md:text-base leading-relaxed line-clamp-3 relative z-10 font-medium">
              {language === 'en' 
                ? "Dive into the allegorical framework that structures the practice. Understanding how the mind wanders and returns."
                : "Εξερευνήστε το αλληγορικό πλαίσιο που δομεί την πρακτική. Πώς ο νους περιπλανάται και πώς επιστρέφει."}
            </p>
            <div className="mt-6 pt-5 border-t border-pine-700/50 flex justify-between items-center text-teal-300 font-bold text-[13px] md:text-sm relative z-10 group-hover:text-teal-200 transition-colors">
              <span className="flex items-center gap-2">
                {language === 'en' ? 'Explore Symbols' : 'Εξερεύνηση Συμβόλων'} <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {articles.map((article) => (
            <button 
              key={article.id}
              onClick={() => { setActiveArticle(article.id); setCurrentPage(0); }}
              className="w-full bg-gradient-to-b from-pine-900/50 to-pine-950/80 border border-pine-700/40 rounded-[2rem] p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col text-left transition-all duration-500 active:scale-[0.98] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-pine-600/60 hover:from-pine-800/50 hover:to-pine-900/80 relative overflow-hidden group backdrop-blur-md"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-15 transition-all duration-500">
                <BookOpen className="w-[80px] h-[80px] md:w-[120px] md:h-[120px]" />
              </div>
              <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-pine-950/80 flex items-center justify-center border border-white/5 flex-shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] group-hover:scale-110 transition-transform duration-500">
                  <BookOpen size={24} className="text-teal-400 drop-shadow-md" />
                </div>
                <div>
                  <h2 className="text-[19px] md:text-[22px] font-heading font-medium text-white leading-snug tracking-wide group-hover:text-pine-50 transition-colors">{article.title}</h2>
                  <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-pine-400/90 font-bold mt-1.5">{article.author}</p>
                </div>
              </div>
              <p className="text-pine-200/90 text-sm md:text-base leading-relaxed line-clamp-3 relative z-10 font-medium italic">
                "{article.pages[0]}"
              </p>
              <div className="mt-6 pt-5 border-t border-pine-800/80 flex justify-between items-center text-teal-400 font-bold text-[13px] md:text-sm relative z-10 group-hover:text-teal-300 transition-colors">
                <span className="flex items-center gap-2">
                  {t.startReading} <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] text-pine-400/80 font-bold tracking-[0.2em] uppercase">
                  {article.pages.length} {language === 'en' ? 'PAGES' : 'ΣΕΛΙΔΕΣ'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
