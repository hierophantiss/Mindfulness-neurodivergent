
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Maximize, Minimize, RefreshCw } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';

export default function LabViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [lab, setLab] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    async function fetchLab() {
      if (!id) return;
      try {
        const docRef = doc(db, 'media', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLab({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Lab not found');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLab();
  }, [id]);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const reload = () => setKey(prev => prev + 1);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-pine-300 font-medium">{language === 'el' ? 'Φόρτωση εργαστηρίου...' : 'Loading lab...'}</p>
      </div>
    );
  }

  if (error || !lab) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
        <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
          <ArrowLeft size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{language === 'el' ? 'Σφάλμα' : 'Error'}</h2>
          <p className="text-pine-300">{error || 'Lab not found'}</p>
        </div>
        <button 
          onClick={() => navigate('/practice/labs')}
          className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl transition-all"
        >
          {language === 'el' ? 'Επιστροφή' : 'Go Back'}
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col animate-in fade-in duration-500",
      isFullscreen ? "fixed inset-0 z-[100] bg-black" : "min-h-[80vh]"
    )}>
      {/* ToolBar */}
      <div className="flex items-center justify-between p-4 bg-[#0C1E26] border-b border-white/5">
        <div className="flex items-center gap-4">
          {!isFullscreen && (
            <button 
              onClick={() => navigate('/practice/labs')}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              {lab.name.replace(/^\d+_/, '').replace('.html', '').split(/[_-]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </h1>
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">{language === 'el' ? 'ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ' : 'INTERACTIVE LAB'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={reload}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
            title={language === 'el' ? 'Ανανέωση' : 'Reload'}
          >
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
            title={isFullscreen ? (language === 'el' ? 'Έξοδος' : 'Exit') : (language === 'el' ? 'Πλήρης Οθόνη' : 'Fullscreen')}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {/* Iframe Area */}
      <div className="flex-1 relative bg-black overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <iframe 
          key={key}
          src={lab.url}
          className="absolute inset-0 w-full h-full border-none shadow-2xl"
          title={lab.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
