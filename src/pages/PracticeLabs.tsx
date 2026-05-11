
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
    // Remove timestamp prefix if exists (e.g. 1778513365071_name.html)
    let clean = name.replace(/^\d+_/, '').replace('.html', '');
    // Convert snake_case or kebab-case to Title Case
    return clean.split(/[_-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/practice')} 
          className="w-10 h-10 rounded-full bg-pine-800 border border-pine-700 flex items-center justify-center text-pine-300 hover:bg-pine-700 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <section>
        <h2 className="text-3xl font-serif text-white tracking-tight mb-2 flex items-center gap-3">
          <Beaker className="text-indigo-400" />
          {language === 'el' ? 'Διαδραστικά Εργαστήρια' : 'Interactive Labs'}
        </h2>
        <p className="text-pine-200">
          {language === 'el' 
            ? 'Πειραματικές ασκήσεις και διαδραστικά περιβάλλοντα για την εξερεύνηση της προσοχής και της επίγνωσης.' 
            : 'Experimental exercises and interactive environments to explore attention and awareness.'}
        </p>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-pine-400 text-sm">{language === 'el' ? 'Φόρτωση εργαστηρίων...' : 'Loading labs...'}</p>
        </div>
      ) : labs.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/5">
          <p className="text-pine-400">
            {language === 'el' ? 'Δεν βρέθηκαν διαθέσιμα εργαστήρια.' : 'No labs found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-safe mb-4">
          {labs.map(lab => (
            <Link
              key={lab.id}
              to={`/practice/lab/${lab.id}`}
              className="group relative bg-[#12242D] border border-white/10 hover:border-indigo-500/50 rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              <div className="flex flex-col h-full gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Beaker size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-100">
                    {formatName(lab.name)}
                  </h3>
                  <p className="text-sm text-pine-300 line-clamp-2">
                    {language === 'el' 
                      ? 'Διαδραστική εμπειρία βασισμένη στον κώδικα.' 
                      : 'Interactive experience based on code.'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{language === 'el' ? 'ΠΕΙΡΑΜΑΤΙΚΟ' : 'EXPERIMENTAL'}</span>
                  <div className="bg-indigo-600 p-2 rounded-xl text-white">
                    <Play size={16} fill="white" />
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
