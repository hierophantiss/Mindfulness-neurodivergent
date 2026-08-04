import { useAccessibility } from '../hooks/useAccessibility';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, ChevronLeft, ChevronRight, X, Play, Youtube, Film, Check, SkipForward, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { cn } from '../lib/utils';
import { informativeVideos } from '../data/informativeVideos';
import { dzogchenArticle } from '../data/dzogchenArticle';
import { neverForceArticle } from '../data/neverForceArticle';
import { softGazeArticle } from '../data/softGazeArticle';
import { polyvagalArticle } from '../data/polyvagalArticle';
import { platoCaveArticle } from '../data/platoCaveArticle';
import { youAreThePathArticle } from '../data/youAreThePathArticle';
import { waveAndSeaArticle } from '../data/waveAndSeaArticle';
import { rabbitholeContent } from '../data/rabbitholeContent';

const formatMarkdown = (text: string) => {
  if (!text) return null;
  const boldParts = text.split(/(\*\*[\s\S]*?\*\*)/g);
  return (
    <>
      {boldParts.map((boldPart, i) => {
        if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
          return <span key={i} className="font-bold text-white tracking-wide mix-blend-plus-lighter" style={{ fontWeight: 800 }}>{boldPart.slice(2, -2)}</span>;
        }
        
        const italicParts = boldPart.split(/(\*[\s\S]*?\*)/g);
        return (
          <React.Fragment key={i}>
            {italicParts.map((itPart, j) => {
              if (itPart.startsWith('*') && itPart.endsWith('*')) {
                return <em key={j} className="italic text-white/90">{itPart.slice(1, -1)}</em>;
              }
              return <span key={j}>{itPart}</span>;
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default function RabbitHole() {
    const { reduceMotion } = useAccessibility();
  

  const { articleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  
  const [activeArticle, setActiveArticleState] = useState<string | null>(null);
  
  // Video player states
  const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles');
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videoStartTime, setVideoStartTime] = useState<number>(0);
  const [mantraStep, setMantraStep] = useState<number>(0);
  const [activeAttentionStyles, setActiveAttentionStyles] = useState<string[]>([]);
  const [isVoidActive, setIsVoidActive] = useState(false);
  const { logActivity } = useActivityTracker();
  
  // Track reading time
  const readingStartTimeRef = useRef<number | null>(null);

  const setActiveArticle = (id: string | null) => {
    // Log previous article if it was open for more than 20 seconds
    if (activeArticle && readingStartTimeRef.current) {
      const duration = Math.round((Date.now() - readingStartTimeRef.current) / 1000);
      if (duration >= 20) {
        logActivity({
          category: 'rabbithole',
          itemId: activeArticle,
          durationSeconds: duration,
          completed: true,
          axis: 'space'
        });
      }
    }

    setActiveArticleState(id);
    setCurrentPage(0);
    
    if (id) {
      readingStartTimeRef.current = Date.now();
      if (articleId !== id) {
        navigate(`/rabbithole/${id}`, { replace: true });
      }
    } else {
      readingStartTimeRef.current = null;
      navigate(`/rabbithole`, { replace: true });
    }
  };

  useEffect(() => {
    // Log on unmount if an article was being read
    return () => {
      if (activeArticle && readingStartTimeRef.current) {
        const duration = Math.round((Date.now() - readingStartTimeRef.current) / 1000);
        if (duration >= 20) {
          logActivity({
            category: 'rabbithole',
            itemId: activeArticle,
            durationSeconds: duration,
            completed: true,
            axis: 'space'
          });
        }
      }
    };
  }, [activeArticle, logActivity]);
  
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // If it's a sub-route (e.g. /rabbithole/the-goose-is-out)
    if (articleId) {
      if (activeArticle !== articleId) {
        setActiveArticleState(articleId);
        setCurrentPage(0);
      }
    } else {
      // Backwards compatibility for ?article= queries
      const articleFromUrl = searchParams.get('article');
      if (articleFromUrl) {
        setActiveArticleState(articleFromUrl);
        setCurrentPage(0);
        navigate(`/rabbithole/${articleFromUrl}`, { replace: true });
      } else if (location.state && (location.state as any).activeArticle) {
        const stateArticle = (location.state as any).activeArticle;
        setActiveArticleState(stateArticle);
        setCurrentPage(0);
        navigate(`/rabbithole/${stateArticle}`, { replace: true, state: {} });
      } else {
        setActiveArticleState(null);
      }
    }
  }, [articleId, location.state, navigate, searchParams]);
  
  const touchStartX = useRef(0);

  const t = {
    title: language === 'en' ? 'The Rabbit Hole' : 'Κουνελότρυπα',
    subtitle: language === 'en' ? 'Allegories of the World' : 'Αλληγορίες του Κόσμου',
    back: language === 'en' ? 'Back' : 'Πίσω',
    startReading: language === 'en' ? 'Start Reading' : 'Έναρξη Ανάγνωσης',
    close: language === 'en' ? 'Close' : 'Κλείσιμο',
  };

  
  const formatDate = (dateStr: string | undefined, lang: string) => {
    if (!dateStr) return null;
    const [year, month] = dateStr.split('-');
    if (lang === 'el') {
      const elMonths: Record<string, string> = { '05': 'Μάιος', '06': 'Ιούνιος', '07': 'Ιούλιος' };
      return `${elMonths[month]} ${year}`;
    }
    const enMonths: Record<string, string> = { '05': 'May', '06': 'June', '07': 'July' };
    return `${enMonths[month]} ${year}`;
  };

  const articles = [
    {
      id: neverForceArticle.id,
      date: '2025-05',
      title: language === 'en' ? neverForceArticle.title.en : neverForceArticle.title.el,
      author: language === 'en' ? neverForceArticle.author.en : neverForceArticle.author.el,
      pages: language === 'en' ? neverForceArticle.pagesEn : neverForceArticle.pagesEl
    },
    {
      id: dzogchenArticle.id,
      date: '2025-05',
      title: language === 'en' ? dzogchenArticle.title.en : dzogchenArticle.title.el,
      author: language === 'en' ? dzogchenArticle.author.en : dzogchenArticle.author.el,
      pages: language === 'en' ? dzogchenArticle.pagesEn : dzogchenArticle.pagesEl
    },
    {
      id: softGazeArticle.id,
      date: '2025-06',
      title: language === 'en' ? softGazeArticle.title.en : softGazeArticle.title.el,
      author: language === 'en' ? softGazeArticle.author.en : softGazeArticle.author.el,
      pages: language === 'en' ? softGazeArticle.pagesEn : softGazeArticle.pagesEl
    },
    {
      id: polyvagalArticle.id,
      date: '2025-06',
      title: language === 'en' ? polyvagalArticle.title.en : polyvagalArticle.title.el,
      author: language === 'en' ? polyvagalArticle.author.en : polyvagalArticle.author.el,
      pages: language === 'en' ? polyvagalArticle.pagesEn : polyvagalArticle.pagesEl
    },
    {
      id: platoCaveArticle.id,
      date: '2025-06',
      title: language === 'en' ? platoCaveArticle.title.en : platoCaveArticle.title.el,
      author: language === 'en' ? platoCaveArticle.author.en : platoCaveArticle.author.el,
      pages: language === 'en' ? platoCaveArticle.pagesEn : platoCaveArticle.pagesEl
    },
    {
      id: youAreThePathArticle.id,
      date: '2025-07',
      title: language === 'en' ? youAreThePathArticle.title.en : youAreThePathArticle.title.el,
      author: language === 'en' ? youAreThePathArticle.author.en : youAreThePathArticle.author.el,
      pages: language === 'en' ? youAreThePathArticle.pagesEn : youAreThePathArticle.pagesEl
    },
    {
      id: waveAndSeaArticle.id,
      date: '2025-07',
      title: language === 'en' ? waveAndSeaArticle.title.en : waveAndSeaArticle.title.el,
      author: language === 'en' ? waveAndSeaArticle.author.en : waveAndSeaArticle.author.el,
      pages: language === 'en' ? waveAndSeaArticle.pagesEn : waveAndSeaArticle.pagesEl
    },
    {
      id: 'koshas-veils',
      date: '2025-05',
      title: language === 'en' ? 'The Veils of Being' : 'Τα Πέπλα της Ύπαρξης',
      author: language === 'en' ? 'Yoga & 4-fold Axis' : 'Φιλοσοφία του 4πλού Άξονα',
      pages: language === 'en' ? rabbitholeContent['koshas-veils'].en : rabbitholeContent['koshas-veils'].el
    },
    {
      id: 'dzogchen-nature-of-mind',
      title: language === 'en' ? 'The Nature of Mind & Tregchod' : 'Η Φύση του Νου & Η Λύση της Έντασης',
      author: language === 'en' ? 'Dzogchen & Neuroscience' : 'Τζοκτσέν & Νευροεπιστήμη',
      pages: language === 'en' ? rabbitholeContent['dzogchen-nature-of-mind'].en : rabbitholeContent['dzogchen-nature-of-mind'].el
    },
    {
      id: 'what-is-sandbox',
      date: '2025-05',
      title: language === 'en' ? 'What does Sandbox mean?' : 'Τι σημαίνει Sandbox;',
      author: language === 'en' ? 'Core Concept' : 'Βασική Έννοια',
      pages: language === 'en' ? rabbitholeContent['what-is-sandbox'].en : rabbitholeContent['what-is-sandbox'].el
    },
    {
      id: 'riding-the-wind',
      date: '2025-05',
      title: language === 'en' ? 'Learning to Ride the Wind' : 'Μαθαίνοντας να ιππεύεις τον άνεμο',
      author: language === 'en' ? 'Tsa Lung & Practice' : 'Tsa Lung & Παράδοση',
      pages: language === 'en' ? rabbitholeContent['riding-the-wind'].en : rabbitholeContent['riding-the-wind'].el
    },
    {
      id: 'the-goose-is-out',
      date: '2025-05',
      title: language === 'en' ? 'The Goose is Out' : 'Η Χήνα Είναι Έξω',
      author: language === 'en' ? 'Mindfulness & Neurodiversity' : 'Ενσυνειδητότητα & Νευροδιαφορετικότητα',
      pages: language === 'en' ? rabbitholeContent['the-goose-is-out'].en : rabbitholeContent['the-goose-is-out'].el
    },
    {
      id: 'quantum-void-awareness',
      date: '2025-06',
      title: language === 'en' ? "The Seething Void: What Physics Calls Empty" : "Το Κοχλάζον Κενό: Αυτό που η Φυσική Αποκαλεί Άδειο",
      author: language === 'en' ? "Quantum Physics & the 4th Axis" : "Κβαντική Φυσική & ο 4ος Άξονας",
      pages: language === 'en' ? rabbitholeContent['quantum-void-awareness'].en : rabbitholeContent['quantum-void-awareness'].el
    },
    {
      id: 'forces-of-the-cosmos',
      date: '2025-06',
      title: language === 'en' ? 'The Forces of the Cosmos, the Axes of the Mind' : 'Οι Δυνάμεις του Κόσμου, οι Άξονες του Νου',
      author: 'Theodoros Bairaktaris',
      pages: language === 'en' ? rabbitholeContent['forces-of-the-cosmos'].en : rabbitholeContent['forces-of-the-cosmos'].el
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
  }, [activeArticle]);

  // Story Viewer Render
  if (activeArticle) {
    const article = articles.find(a => a.id === activeArticle);
    if (!article) return <div className="text-white p-20 mt-20 text-center">Article not found: {activeArticle}</div>;

    const storyViewer = (
      <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md text-white flex flex-col animate-in fade-in duration-300">
        
        {/* Top Progress Bar & Header */}
        <div className="pt-safe px-4 pb-3 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md/80 backdrop-blur-md relative z-20">
          <button 
            onClick={() => setActiveArticle(null)} 
            className="p-2 -ml-2 text-white/40 hover:text-white transition-colors active:scale-95"
            aria-label={t.close}
          >
            <X size={24} />
          </button>
          <div className="flex-1 px-4 text-center">
            <h2 className="text-[14px] font-medium font-serif italic text-white/90 truncate">{article.title}</h2>
            {article.date && (
              <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                {formatDate(article.date, language)}
              </p>
            )}
          </div>
          <div className="w-10 text-xs text-teal-400/80 font-mono text-right font-medium tracking-wide">
            {currentPage + 1}<span className="text-white/20">/{article.pages.length}</span>
          </div>
        </div>

        {/* Progress Indicator Lines */}
        <div className="flex gap-1.5 px-4 py-3 opacity-80 z-20">
          {article.pages.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i === currentPage 
                  ? 'bg-teal-400/80 scale-y-125' 
                  : i < currentPage 
                    ? 'bg-teal-500/30' 
                    : 'bg-white/10'
              }`} 
            />
          ))}
        </div>

        {/* Reading Area Wrapper */}
        <div className="flex-1 relative flex overflow-hidden">
          
          {/* Shadow Animation for Plato's Cave */}
          {activeArticle === 'plato-cave-neurodivergent' && (
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen opacity-20">
              <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 to-transparent" />
              <div className="plato-shadow-1 absolute bottom-[5%] left-[5%] w-[45vw] h-[50vh] bg-amber-900/40 rounded-full blur-[100px] pointer-events-none" />
              <div className="plato-shadow-2 absolute top-[10%] right-[10%] w-[40vw] h-[60vh] bg-orange-800/30 rounded-full blur-[120px] pointer-events-none" />
              <div className="plato-shadow-3 absolute bottom-[30%] left-[30%] w-[35vw] h-[45vh] bg-amber-950/40 rounded-full blur-[110px] pointer-events-none" />
            </div>
          )}

          {/* Invisible Hitboxes (Fixed in the viewer, outside scrolling) */}
          <button 
            className="absolute top-0 left-0 w-[30%] h-full z-10 flex flex-col justify-center items-start pl-2 md:pl-6 group focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400"
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
            className="absolute top-0 right-0 w-[30%] h-full z-10 flex flex-col justify-center items-end pr-2 md:pr-6 group focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400"
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

          {/* Scrolling Content */}
          <div 
            className="flex-1 overflow-y-auto px-6 md:px-16"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Main Text Content */}
            <div 
              key={currentPage} 
              className="min-h-full flex flex-col justify-center max-w-xl mx-auto w-full py-12 pb-32 animate-in fade-in zoom-in-[0.98] duration-300 ease-out relative z-0 pointer-events-none"
            >
              <BookOpen size={24} className="text-teal-500/20 mx-auto justify-center mb-8" />
              <p className="text-[20px] md:text-[24px] leading-[1.7] font-serif text-white/90 text-center tracking-wide whitespace-pre-line pointer-events-auto" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.6)"}}>
                {formatMarkdown(article.pages[currentPage])}
              </p>
            </div>
          </div>
        </div>
      </div>
    );

    return createPortal(storyViewer, document.body);
  }

  // List View Render (when activeArticle is null)
  return (
    <div className="flex flex-col min-h-screen animate-in fade-in pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-md/80 backdrop-blur-xl border-b border-white/5 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <Link 
            to="/"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.05] text-white/40 hover:text-white transition-colors active:scale-95"
            aria-label={t.back}
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="flex flex-col items-center flex-1">
            <h1 className="text-lg font-serif italic text-white/90 tracking-wide flex items-center gap-2">
              <span className="text-[16px] not-italic opacity-80">🐇🕳️</span> {t.title}
            </h1>
            <p className="text-[9px] text-teal-400/60 uppercase tracking-[0.25em] mt-0.5">{t.subtitle}</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pt-6 max-w-4xl mx-auto w-full">
        {/* Custom Tabs */}
        <div className="flex p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl mb-8 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('articles')}
            className={cn(
              "flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300",
              activeTab === 'articles' 
                ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.05]" 
                : "text-white/30 hover:text-white/60"
            )}
          >
            <BookOpen size={16} />
            {language === 'el' ? 'ΚΕΙΜΕΝΑ' : 'ARTICLES'}
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={cn(
              "flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300",
              activeTab === 'videos' 
                ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.05]" 
                : "text-white/30 hover:text-white/60"
            )}
          >
            <Film size={16} />
            {language === 'el' ? 'ΒΙΝΤΕΟ' : 'VIDEOS'}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center mb-12 text-center px-4 space-y-4 max-w-2xl mx-auto">
          <p className="text-white/40 text-sm md:text-base font-serif italic leading-relaxed">
            {activeTab === 'articles' ? (
              language === 'en' 
                ? 'A collection of theoretical pieces, allegories, and insights from across the world charting the human path to the exploration of consciousness.'
                : 'Μια βιβλιοθήκη με θεωρητικά κείμενα, αλληγορίες και στοχασμούς από όλο τον κόσμο για την ανθρώπινη πορεία προς την εξερεύνηση της συνειδητότητας.'
            ) : (
              language === 'en'
                ? 'Visual insights and philosophical explorations.'
                : 'Οπτικές αναζητήσεις και φιλοσοφικές εξερευνήσεις.'
            )}
          </p>
          {activeTab === 'articles' && (
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/70 font-medium text-sm font-serif italic leading-relaxed">
                {language === 'en'
                  ? '"These texts are not scientific literature, but philosophical reflections, poetic allegories, and symbolic explorations of the human experience."'
                  : '«Τα κείμενα αυτά δεν αποτελούν επιστημονικά δοκίμια, αλλά φιλοσοφικούς στοχασμούς, ποιητικές αλληγορίες και συμβολικές εξερευνήσεις της συνείδησης.»'}
              </p>
            </div>
          )}
        </div>

        {activeTab === 'articles' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Link to Method & Symbols */}
          <Link 
            to="/method"
 className="w-full md:col-span-2 glass-card rounded-[2rem] p-6 md:p-8 block text-left transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-teal-500/20 relative group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-[0.04] transition-all duration-700">
              <span className="text-[120px] md:text-[160px] grayscale">🐘</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="flex items-center gap-4 mb-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                <span className="text-[24px] drop-shadow-md grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">🐘</span>
              </div>
              <div>
                <h2 className="text-[20px] md:text-[24px] font-serif italic font-medium text-[#d4d4d8] leading-snug tracking-tight group-hover:text-teal-100 transition-colors">{language === 'en' ? 'The Method & Symbols' : 'Η Μέθοδος & τα Σύμβολα'}</h2>
                <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#d4d4d8]/50 font-bold mt-1.5">{language === 'en' ? 'THE ELEPHANT & THE MONKEY' : 'Ο ΕΛΕΦΑΝΤΑΣ ΚΑΙ Η ΜΑΙΜΟΥ'}</p>
              </div>
            </div>
            <p className="text-[#d4d4d8]/70 text-sm md:text-[15px] leading-relaxed line-clamp-3 relative z-10 font-medium">
              {language === 'en' 
                ? "Dive into the allegorical framework that structures the practice. Understanding how the mind wanders and returns."
                : "Εξερευνήστε το αλληγορικό πλαίσιο που δομεί την πρακτική. Πώς ο νους περιπλανάται και πώς επιστρέφει."}
            </p>
            <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center text-teal-400/80 font-medium text-[13px] md:text-sm relative z-10 group-hover:text-teal-300 transition-colors">
              <span className="flex items-center gap-2">
                {language === 'en' ? 'Explore Symbols' : 'Εξερεύνηση Συμβόλων'} <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {articles.map((article) => {
            const isNew = article.id === 'plato-cave-neurodivergent';
            return (
              <button 
                key={article.id}
                onClick={() => { setActiveArticle(article.id); setCurrentPage(0); }}
                className={`w-full border rounded-[2rem] p-6 md:p-8 shadow-xl flex flex-col text-left transition-all duration-300 active:scale-[0.98] hover:shadow-2xl relative overflow-hidden group ${
                  isNew 
 ? 'glass-card border-teal-500/20 hover:border-teal-500/40 hover:bg-teal-950/20' 
 : 'glass-card hover:border-white/10 hover:bg-white/[0.04]'
                }`}
              >
                {isNew && (
                  <div className="absolute top-5 right-5 bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest z-20">
                    {language === 'en' ? 'New' : 'Νεο'}
                  </div>
                )}
                
                {/* Subtle background glow for new items */}
                {isNew && <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.03] to-transparent pointer-events-none" />}

                <div className="flex items-center gap-4 mb-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 flex-shrink-0 group-hover:scale-110 transition-transform duration-500 ${isNew ? 'bg-teal-500/[0.05]' : 'bg-white/[0.02]'}`}>
                    <BookOpen size={22} className={`${isNew ? 'text-teal-400/80' : 'text-white/30'}`} />
                  </div>
                  <div className="flex-1 pr-12">
                    <h2 className="text-[18px] md:text-[20px] font-serif italic font-medium text-white/90 leading-snug tracking-tight group-hover:text-white transition-colors">{article.title}</h2>
                    <p className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold mt-1.5 ${isNew ? 'text-teal-400/60' : 'text-white/30'}`}>
                      {article.author}
                      {article.date && (
                        <span className="opacity-60 ml-2 before:content-['•'] before:mr-2">
                          {formatDate(article.date, language)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-white/40 text-[13px] md:text-[14px] leading-relaxed line-clamp-3 relative z-10 font-sans">
                  "{article.pages[0].replace(/\*\*/g, '')}"
                </p>
                <div className="mt-auto pt-6">
                  <div className="pt-5 border-t border-white/5 flex justify-between items-center text-white/50 font-medium text-[13px] md:text-[14px] relative z-10 group-hover:text-white/70 transition-colors">
                    <span className="flex items-center gap-2">
                       {t.startReading} <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[10px] text-white/20 font-bold tracking-[0.25em] uppercase">
                      {article.pages.length} {language === 'en' ? 'PAGES' : 'ΣΕΛΙΔΕΣ'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        ) : (
        <div className="flex flex-col gap-4">
          {informativeVideos.map((video) => (
            <button 
              key={video.id}
              onClick={() => {
                setActiveVideo(video.id);
                setVideoStartTime(0);
                setMantraStep(0);
                setActiveAttentionStyles([]);
                setIsVoidActive(false);
              }}
              className="group flex flex-col md:flex-row gap-5 p-4 md:p-5 bg-white/[0.02] border border-white/10 rounded-[1.5rem] overflow-hidden hover:border-white/20 transition-all text-left w-full active:scale-[0.98]"
            >
              <div className="relative w-full md:w-56 aspect-video rounded-[1rem] overflow-hidden flex-shrink-0 border border-white/[0.05]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" style={{ backgroundImage: `url(${video.thumbnail})` }} />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-teal-500/80 group-hover:border-teal-400 group-hover:scale-110 transition-all">
                    <Play size={20} className="translate-x-[1px]" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0 pb-1">
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-teal-400 mb-2 block">
                  {language === 'el' ? video.category.el : video.category.en}
                </span>
                <h3 className="text-[17px] font-serif italic text-white/90 leading-snug mb-1.5 group-hover:text-white transition-colors line-clamp-2">
                  {language === 'el' ? video.title.el : video.title.en}
                </h3>
                <p className="text-[10px] uppercase tracking-widest font-black text-white/30 truncate">
                  {video.author}
                </p>
              </div>
            </button>
          ))}
        </div>
        )}
      </div>
      {/* Video Portal Modal */}
      {activeVideo && createPortal(
        <div className={cn(
          "fixed inset-0 z-[10000] flex flex-col animate-in fade-in duration-1000 overflow-y-auto custom-scrollbar transition-colors duration-1000",
          isVoidActive ? "bg-black" : "bg-black/40 backdrop-blur-md"
        )}>
          {/* Starry Background for Void Mode */}
          <AnimatePresence>
            {isVoidActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={reduceMotion ? { duration: 0.01 } : { duration: 3 }}
                className="fixed inset-0 pointer-events-none z-0"
              >
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_0%,transparent_1px)] bg-[length:120px_120px]" />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_1px)] bg-[length:180px_180px] animate-pulse" />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.03)_0%,transparent_1px)] bg-[length:250px_250px]" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10 flex items-center justify-between p-4 md:p-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Youtube size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                {language === 'el' ? 'ΠΡΟΒΟΛΗ ΒΙΝΤΕΟ' : 'NOW PLAYING'}
              </span>
            </div>
            <button 
              onClick={() => setActiveVideo(null)}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative z-10 flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 md:p-8 gap-8 transition-opacity duration-1000">
            {/* Player Container */}
            <div className={cn(
              "flex-[2] space-y-6 transition-all duration-1000",
              isVoidActive ? "scale-105" : "scale-100"
            )}>
              <div className={cn(
                "w-full aspect-video rounded-[2rem] overflow-hidden bg-black shadow-2xl transition-all duration-1000 relative group",
                isVoidActive ? "border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.05)]" : "border-white/10"
              )}>
                <iframe
                  key={`${activeVideo}-${videoStartTime}`}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo}?autoplay=1&start=${videoStartTime}&rel=0&modestbranding=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <div className={cn("hidden md:block transition-opacity duration-1000", isVoidActive ? "opacity-20" : "opacity-100")}>
                 <h2 className="text-3xl md:text-4xl font-serif italic text-white/95 mb-2">
                   {informativeVideos.find(v => v.id === activeVideo)?.title[language as 'en'|'el']}
                 </h2>
                 <p className="text-lg text-white/30 font-medium font-serif italic">
                   {informativeVideos.find(v => v.id === activeVideo)?.author}
                 </p>
              </div>
            </div>

            {/* Description / Insights Sidebar */}
            <div className={cn(
              "flex-1 space-y-8 animate-in slide-in-from-right-4 duration-700 delay-300 transition-opacity duration-1000",
              isVoidActive ? "opacity-20 hover:opacity-100" : "opacity-100"
            )}>
              {(() => {
                          const { reduceMotion } = useAccessibility();
                const videoData = informativeVideos.find(v => v.id === activeVideo);
                if (videoData?.description) {
                  const desc = videoData.description[language as 'en'|'el'];
                  return (
                    <div className="space-y-8 pb-12">
                      {/* Special Void Toggle for Space Meditations */}
                      {videoData.isSpaceMeditation && (
                        <motion.button 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          onClick={() => setIsVoidActive(!isVoidActive)}
                          className={cn(
                            "w-full py-5 rounded-[2.5rem] border flex items-center justify-center gap-3 transition-all duration-700 font-serif italic text-lg shadow-2xl",
                            isVoidActive 
                             ? "bg-white/5 border-white/30 text-white shadow-[0_0_60px_rgba(255,255,255,0.1)]" 
                             : "bg-teal-500/10 border-teal-500/30 text-teal-400 hover:bg-teal-500/20"
                          )}
                        >
                          <motion.div 
                            animate={{ 
                              scale: isVoidActive ? [1, 1.5, 1] : 1,
                              opacity: isVoidActive ? [0.5, 1, 0.5] : 1
                            }}
                            transition={reduceMotion ? { duration: 0.01 } : { duration: 4, repeat: Infinity }}
                            className={cn("w-3 h-3 rounded-full", isVoidActive ? "bg-white" : "bg-teal-500")} 
                          />
                          {isVoidActive 
                             ? (language === 'el' ? 'Return from Reality' : 'Return from the Void')
                             : (language === 'el' ? 'Enter the Void' : 'Enter the Void')}
                        </motion.button>
                      )}

                      <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-4">
                        <p className="text-[14px] text-white/60 leading-relaxed font-sans">
                          {desc.intro}
                        </p>
                        <div className="pt-4 border-t border-white/5">
                           <p className="text-[12px] font-serif italic text-teal-400/80">
                             {desc.tip}
                           </p>
                        </div>
                      </div>

                      {desc.mantra && (
                        <div className="space-y-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2">
                            {language === 'el' ? 'ΟΔΗΓΟΣ ΡΟΗΣ' : 'FLOW GUIDE'}
                          </span>
                          <div className="bg-[#1D9E75]/5 border border-[#1D9E75]/20 rounded-[2.5rem] p-8 text-center relative overflow-hidden group/mantra">
                             <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-50"></div>
                             
                             {/* Stepper Dots */}
                             <div className="flex justify-center gap-1.5 mb-8 relative z-10">
                               {desc.mantra.map((_, idx) => (
                                 <div 
                                   key={idx}
                                   className={`h-1 rounded-full transition-all duration-500 ${idx === mantraStep ? 'w-8 bg-teal-400' : 'w-2 bg-white/10'}`}
                                 />
                               ))}
                             </div>

                             <div className="relative h-20 flex items-center justify-center mb-6">
                               <h4 className="text-3xl md:text-4xl font-serif italic text-white/90 animate-in fade-in zoom-in duration-500 tracking-widest" key={mantraStep}>
                                 {desc.mantra[mantraStep]}
                               </h4>
                             </div>

                             <div className="flex items-center justify-center gap-4 relative z-10">
                               <button 
                                 onClick={() => setMantraStep((prev) => (prev > 0 ? prev - 1 : (desc.mantra ? desc.mantra.length - 1 : 0)))}
                                 className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                               >
                                 <ChevronLeft size={20} />
                               </button>
                               <button 
                                 onClick={() => setMantraStep((prev) => (prev < (desc.mantra ? desc.mantra.length - 1 : 0) ? prev + 1 : 0))}
                                 className="px-8 h-12 rounded-full bg-teal-500 text-black font-bold text-[11px] uppercase tracking-widest hover:bg-teal-400 transition-all active:scale-95 shadow-lg shadow-teal-500/20"
                               >
                                 {language === 'el' ? 'ΕΠΟΜΕΝΟ' : 'NEXT'}
                               </button>
                             </div>
                             
                             <button 
                               onClick={() => {
                                 let time = 0;
                                 if (videoData.id === '7Qbat52NE98') time = 564; // Tai Chi Mantra [09:24]
                                 setVideoStartTime(time);
                               }}
                               className="mt-6 text-[9px] font-bold text-teal-400/60 uppercase tracking-[0.2em] hover:text-teal-400 transition-colors flex items-center justify-center gap-2 mx-auto"
                             >
                                <Youtube size={12} />
                                {language === 'el' ? 'ΔΕΣ ΤΟ ΣΤΟ ΒΙΝΤΕΟ' : 'WATCH IN VIDEO'} {videoData.id === '7Qbat52NE98' ? '[09:24]' : ''}
                             </button>
                          </div>
                        </div>
                      )}

                      {desc.movements && (
                        <div className="space-y-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2">
                            {language === 'el' ? 'ΟΔΗΓΟΣ ΚΙΝΗΣΕΩΝ' : 'MOVEMENTS GUIDE'}
                          </span>
                          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] p-8 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-50"></div>
                             
                             {/* Header */}
                             <div className="flex items-center justify-between mb-8 relative z-10">
                               <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
                                   {language === 'el' ? `ΚΙΝΗΣΗ ${desc.movements[mantraStep]?.id || 1} / 10` : `MOVEMENT ${desc.movements[mantraStep]?.id || 1} / 10`}
                                 </span>
                                 <h4 className="text-xl font-serif italic text-white/90">
                                   {desc.movements[mantraStep]?.name}
                                 </h4>
                               </div>
                               <div className="flex gap-2">
                                 <button 
                                   onClick={() => setMantraStep((prev) => (prev > 0 ? prev - 1 : 9))}
                                   className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                                 >
                                   <ChevronLeft size={18} />
                                 </button>
                                 <button 
                                   onClick={() => setMantraStep((prev) => (prev < 9 ? prev + 1 : 0))}
                                   className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                                 >
                                   <ChevronRight size={18} />
                                 </button>
                               </div>
                             </div>

                             {/* Breath Instruction */}
                             <div className="grid grid-cols-2 gap-4 relative z-10">
                               <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center group transition-all hover:bg-teal-500/10 hover:border-teal-500/30">
                                 <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 mx-auto mb-3">
                                   <ChevronRight size={16} className="-rotate-90" />
                                 </div>
                                 <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">
                                    {language === 'el' ? 'ΕΙΣΠΝΟΗ' : 'INHALE'}
                                 </span>
                                 <p className="text-sm font-serif italic text-white/80">
                                    {language === 'el' ? 'Χέρια πάνω' : 'Hands up'}
                                 </p>
                               </div>
                               <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center group transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30">
                                 <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-3">
                                   <ChevronRight size={16} className="rotate-90" />
                                 </div>
                                 <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">
                                    {language === 'el' ? 'ΕΚΠΝΟΗ' : 'EXHALE'}
                                 </span>
                                 <p className="text-sm font-serif italic text-white/80">
                                    {language === 'el' ? 'Χέρια κάτω' : 'Hands down'}
                                 </p>
                               </div>
                             </div>

                             <button 
                               onClick={() => {
                                 let time = 0;
                                 if (videoData.id === 'no4x4ewf1dM') time = 65; // Plum Village Mantra [01:05]
                                 setVideoStartTime(time);
                               }}
                               className="mt-8 text-[9px] font-bold text-indigo-400/60 uppercase tracking-[0.2em] hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 mx-auto"
                             >
                                <Youtube size={12} />
                                {language === 'el' ? 'ΔΕΣ ΤΟ ΣΤΟ ΒΙΝΤΕΟ' : 'WATCH IN VIDEO'} {videoData.id === 'no4x4ewf1dM' ? '[01:05]' : ''}
                             </button>
                          </div>
                        </div>
                      )}

                      {desc.attentionStyles && (
                        <div className="space-y-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2">
                            {language === 'el' ? 'ΣΤΥΛ ΠΡΟΣΟΧΗΣ' : 'ATTENTION STYLES'}
                          </span>
                          <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2.5rem] p-8 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50"></div>
                             
                             <div className="grid grid-cols-2 gap-3 relative z-10 mb-8">
                               {desc.attentionStyles.map((style) => {
                                 const isActive = activeAttentionStyles.includes(style.id);
                                 return (
                                   <button 
                                     key={style.id}
                                     onClick={() => {
                                       setActiveAttentionStyles(prev => 
                                         isActive ? prev.filter(id => id !== style.id) : [...prev, style.id]
                                       );
                                       const [mins, secs] = style.time.split(':').map(Number);
                                       setVideoStartTime((mins * 60) + secs);
                                     }}
                                     className={`p-4 rounded-3xl border transition-all text-left group active:scale-95 ${
                                       isActive 
                                         ? 'bg-amber-500/20 border-amber-500/50 shadow-lg shadow-amber-500/10' 
                                         : 'bg-white/5 border-white/10 hover:border-white/20'
                                     }`}
                                   >
                                      <div className={`w-2 h-2 rounded-full mb-3 transition-all ${isActive ? 'bg-amber-400 scale-125' : 'bg-white/20'}`}></div>
                                      <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isActive ? 'text-amber-200' : 'text-white/40'}`}>
                                        {style.name}
                                      </span>
                                      <p className="text-[10px] text-white/30 leading-tight">
                                        {style.desc}
                                      </p>
                                   </button>
                                 );
                               })}
                             </div>

                             {activeAttentionStyles.length === 4 ? (
                               <div className="relative z-10 bg-teal-500/20 border border-teal-500/40 rounded-3xl p-6 text-center animate-in zoom-in duration-500">
                                 <div className="w-12 h-12 rounded-full bg-teal-500/30 flex items-center justify-center text-teal-400 mx-auto mb-4 animate-pulse">
                                   <Play size={24} fill="currentColor" />
                                 </div>
                                 <h4 className="text-xl font-serif italic text-white mb-2">
                                   {language === 'el' ? 'Ενεργοποίηση Άξονα Χώρου' : 'Space Axis Activated'}
                                 </h4>
                                 <p className="text-[11px] text-teal-300/60 uppercase tracking-widest font-bold mb-4">
                                   {language === 'el' ? 'ΚΑΤΑΣΤΑΣΗ PURE BEING' : 'PURE BEING STATE'}
                                 </p>
                                 <button 
                                   onClick={() => setVideoStartTime(306)}
                                   className="w-full h-12 rounded-2xl bg-teal-500 text-black font-black text-[11px] uppercase tracking-[0.2em] hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20"
                                 >
                                    {language === 'el' ? 'ΒΙΩΣΕ ΤΟ ΤΩΡΑ' : 'EXPERIENCE NOW'} [05:06]
                                 </button>
                               </div>
                             ) : (
                               <div className="relative z-10 text-center py-4">
                                 <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em]">
                                   {language === 'el' 
                                     ? `Επιλογή ${activeAttentionStyles.length}/4 για τον Χώρο` 
                                     : `Select ${activeAttentionStyles.length}/4 for Space`}
                                 </p>
                               </div>
                             )}
                          </div>
                        </div>
                      )}

                      {desc.points && (
                        <div className="space-y-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2">
                            {language === 'el' ? 'ΚΛΕΙΔΙΑ ΠΡΑΚΤΙΚΗΣ' : 'PRACTICE KEYS'}
                          </span>
                          <div className="space-y-3">
                            {desc.points.map((pt, i) => (
                              <button 
                                key={i} 
                                onClick={() => {
                                  const [mins, secs] = pt.time.split(':').map(Number);
                                  const totalSeconds = (mins * 60) + secs;
                                  setVideoStartTime(totalSeconds);
                                }}
                                className="group w-full text-left p-5 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-teal-500/20 transition-all"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[13px] font-bold text-white/80 group-hover:text-teal-300 transition-colors">{pt.title}</span>
                                  <span className="text-[10px] font-mono text-teal-500/50 bg-teal-500/5 px-2 py-1 rounded-lg group-hover:bg-teal-500/20 group-hover:text-teal-400 transition-all">
                                    {pt.time}
                                  </span>
                                </div>
                                <p className="text-[12px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                                  {pt.text}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {desc.bridge && (
                        <div className="space-y-4">
                          <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10 transition-all group">
                             <button 
                               onClick={() => setVideoStartTime(desc.bridgeTime!)}
                               className="text-[13px] font-serif italic text-white/80 leading-relaxed text-center group-hover:text-white transition-colors block w-full mb-4 cursor-pointer focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400"
                             >
                                "{desc.bridge}"
                             </button>
                             <button 
                               onClick={() => {
                                 setActiveVideo(null);
                                 navigate("/practice");
                               }}
                               className="flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors w-full"
                             >
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                   {language === 'el' ? 'ΜΕΤΑΒΑΣΗ ΣΤΟΝ ΧΩΡΟ' : 'BRIDGE TO SPACE'}
                                </span>
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                             </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-6">
                    <div className="md:hidden">
                       <h2 className="text-2xl font-serif italic text-white/95 mb-2">
                         {videoData?.title[language as 'en'|'el']}
                       </h2>
                       <p className="text-sm text-white/30 font-medium">
                         {videoData?.author} • {videoData?.category[language as 'en'|'el']}
                       </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem]">
                       <div className="flex items-center gap-3 mb-6 text-teal-400/40">
                         <Info size={20} />
                         <span className="text-[10px] font-black uppercase tracking-widest">
                           {language === 'el' ? 'ΠΛΗΡΟΦΟΡΙΕΣ' : 'INFORMATION'}
                         </span>
                       </div>
                       <p className="text-white/50 text-[14px] leading-relaxed italic font-serif">
                         {language === 'el' 
                           ? 'Αυτό το βίντεο αποτελεί μέρος της συλλογής μας για την εξερεύνηση της συνείδησης και της νευροδιαφορετικότητας.' 
                           : 'This video is part of our collection exploring consciousness and neurodiversity.'}
                       </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
