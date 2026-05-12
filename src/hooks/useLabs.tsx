
import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Lab {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface LabContextType {
  labs: Lab[];
  loading: boolean;
  refreshLabs: () => Promise<void>;
}

const LabContext = createContext<LabContextType | undefined>(undefined);

export function LabProvider({ children }: { children: React.ReactNode }) {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLabs = async () => {
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
      
      // Optional: Pre-fetch urls for browser cache (advanced)
      // This only pre-fetches the HTML, not the assets inside
      /*
      labsData.forEach(lab => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = lab.url;
        document.head.appendChild(link);
      });
      */
      
    } catch (err) {
      console.error('Error fetching labs globally:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  // Pre-fetching component logic
  useEffect(() => {
    if (labs.length > 0) {
      // Create a small hidden container for prefetching
      const prefetchContainer = document.createElement('div');
      prefetchContainer.id = 'lab-prefetch-container';
      prefetchContainer.style.position = 'absolute';
      prefetchContainer.style.width = '1px';
      prefetchContainer.style.height = '1px';
      prefetchContainer.style.overflow = 'hidden';
      prefetchContainer.style.opacity = '0';
      prefetchContainer.style.pointerEvents = 'none';
      prefetchContainer.style.zIndex = '-1000';
      document.body.appendChild(prefetchContainer);

      // We pre-load the first few labs (or all if they aren't many)
      // to avoid heavy loading when user clicks.
      // We use a slight delay so we don't block the initial app render
      const timer = setTimeout(() => {
        labs.slice(0, 5).forEach(lab => {
          // Pre-warming DNS and connection via link tags
          const preconnect = document.createElement('link');
          preconnect.rel = 'preconnect';
          preconnect.href = lab.url;
          document.head.appendChild(preconnect);

          const prefetch = document.createElement('link');
          prefetch.rel = 'prefetch';
          prefetch.as = 'document';
          prefetch.href = lab.url;
          document.head.appendChild(prefetch);
          
          // For iframes, sometimes we need to actually load it to cache assets
          const hiddenIframe = document.createElement('iframe');
          hiddenIframe.src = lab.url;
          hiddenIframe.loading = 'lazy'; // Don't compete with main app
          prefetchContainer.appendChild(hiddenIframe);
        });
      }, 3000);

      return () => {
        clearTimeout(timer);
        if (document.body.contains(prefetchContainer)) {
          document.body.removeChild(prefetchContainer);
        }
      };
    }
  }, [labs]);

  return (
    <LabContext.Provider value={{ labs, loading, refreshLabs: fetchLabs }}>
      {children}
    </LabContext.Provider>
  );
}

export function useLabs() {
  const context = useContext(LabContext);
  if (context === undefined) {
    throw new Error('useLabs must be used within a LabProvider');
  }
  return context;
}
