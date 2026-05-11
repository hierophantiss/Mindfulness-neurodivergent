
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Beaker, ArrowLeft, Loader2, Play } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';

interface Lab {
  id: string;
  name: string;
  url: string;
  type: string;
}

export default function PracticeLabs() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLabs() {
      try {
        const q = query(
          collection(db, 'media'),
          where('type', '==', 'html'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const labsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lab[];
        setLabs(labsData);
      } catch (err) {
        console.error('Error fetching labs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLabs();
  }, []);

  const formatName = (name: string) => {
    let clean = name.replace(/^\d+_/, '').replace('.html', '');
    return clean.split(/[_-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/practice')} 
          className="btn-zen !px-3 !py-3"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
          {language === 'el' ? 'Διαδραστικά Εργαλεία' : 'Interactive Tools'}
        </span>
      </div>

      <header className="space-y-4 max-w-2xl">
        <h2 className="text-5xl md:text-6xl font-heading text-white italic leading-tight">
          {language === 'el' ? 'Εργαστήρια' : 'Interactive Labs'}
        </h2>
        <p className="text-lg text-pine-300 font-light leading-relaxed">
          {language === 'el' 
            ? 'Πειραματικές ασκήσεις και διαδραστικά περιβάλλοντα για την εξερεύνηση της προσοχής.' 
            : 'Experimental exercises and interactive environments to explore attention.'}
        </p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-pine-400 text-sm italic">{language === 'el' ? 'Προετοιμασία περιβάλλοντος...' : 'Preparing environment...'}</p>
        </div>
      ) : labs.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-[2.5rem]">
          <p className="text-pine-400 italic">
            {language === 'el' ? 'Δεν βρέθηκαν διαθέσιμα εργαστήρια.' : 'No labs found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {labs.map(lab => (
            <Link
              key={lab.id}
              to={`/practice/lab/${lab.id}`}
              className="group relative glass-card rounded-[2.5rem] p-8 transition-all duration-500 hover:border-indigo-400/40 hover:-translate-y-1 overflow-hidden"
            >
              <div className="flex flex-col h-full gap-8 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-400/10 flex items-center justify-center text-indigo-300 border border-indigo-400/20 group-hover:scale-110 transition-transform duration-500">
                  <Beaker size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-heading text-white italic group-hover:text-indigo-100 transition-colors">
                    {formatName(lab.name)}
                  </h3>
                  <p className="text-sm text-pine-300 font-light line-clamp-2 leading-relaxed">
                    {language === 'el' 
                      ? 'Διαδραστική εμπειρία βασισμένη στον κώδικα για βαθιά επίγνωση.' 
                      : 'Interactive experience based on code for deep awareness.'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{language === 'el' ? 'ΠΕΙΡΑΜΑΤΙΚΟ' : 'EXPERIMENTAL'}</span>
                  <div className="bg-white/10 p-2 rounded-xl text-white group-hover:bg-white group-hover:text-pine-950 transition-all duration-500">
                    <Play size={16} fill="currentColor" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
