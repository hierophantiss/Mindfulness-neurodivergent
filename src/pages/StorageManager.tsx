import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { storage, db, handleFirestoreError, OperationType, signInWithGoogle } from '../lib/firebase';
import { useFirebase } from '../lib/FirebaseContext';
import { Upload, Trash2, Video, Music, Image as ImageIcon, Box, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'video' | 'audio' | 'animation' | 'image';
  size: number;
  mimeType: string;
  createdAt: any;
}

export default function StorageManager() {
  const { user, loading: authLoading } = useFirebase();
  const { language } = useLanguage();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // isAdmin check (following the rules logic)
  const isAdmin = user?.email?.toLowerCase() === 'bairaktaris.theodoros@gmail.com';

  useEffect(() => {
    if (!authLoading && user) {
      fetchMedia();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchMedia = async () => {
    setLoading(true);
    const path = 'media';
    try {
      const q = query(collection(db, path)); // Query all first to avoid missing docs without createdAt
      const querySnapshot = await getDocs(q);
      const items: MediaItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as MediaItem);
      });
      // Sort in JS manually
      items.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setMedia(items);
    } catch (err) {
      console.error('Error fetching media:', err);
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch (e: any) {
        setError(language === 'el' ? 'Σφάλμα κατά την ανάκτηση των δεδομένων (Permissions).' : 'Error fetching media (Permissions).');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!isAdmin) {
      setError(language === 'el' ? 'Μόνο ο διαχειριστής μπορεί να ανεβάσει αρχεία.' : 'Only the admin can upload files.');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    const fileList = Array.from(files);
    let completedCount = 0;

    for (const file of fileList) {
      try {
        const storageRef = ref(storage, `assets/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              // Average progress across all files
              const overallProgress = ((completedCount * 100) + fileProgress) / fileList.length;
              setProgress(overallProgress);
            },
            (err) => {
              console.error('Upload error:', err);
              reject(err);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                let type: MediaItem['type'] = 'image';
                if (file.type.startsWith('video/')) type = 'video';
                else if (file.type.startsWith('audio/')) type = 'audio';
                else if (file.name.toLowerCase().endsWith('.mp4') || file.name.toLowerCase().endsWith('.webm')) type = 'animation';
                else if (file.type.startsWith('image/')) type = 'image';

                const path = 'media';
                console.log('Attempting to save to Firestore:', { name: file.name, type });
                await addDoc(collection(db, path), {
                  name: file.name,
                  url: downloadURL,
                  type: type,
                  size: file.size,
                  mimeType: file.type,
                  uploadedBy: user?.uid,
                  createdAt: serverTimestamp(),
                  storagePath: storageRef.fullPath
                });
                
                completedCount++;
                console.log(`Success! File ${completedCount}/${fileList.length} saved.`);
                resolve();
              } catch (dbErr: any) {
                console.error('Firestore error during upload:', dbErr);
                let message = dbErr.message || 'Unknown Firestore error';
                try {
                  handleFirestoreError(dbErr, OperationType.CREATE, 'media');
                } catch (handledErr: any) {
                  message = handledErr.message;
                }
                reject(new Error(message));
              }
            }
          );
        });
      } catch (err: any) {
        console.error('Error in batch upload:', err);
        setError(language === 'el' ? `Σφάλμα στο αρχείο ${file.name}: ${err.message}` : `Error in file ${file.name}: ${err.message}`);
        // Continue with next file or stop? Let's stop to be safe.
        break;
      }
    }

    fetchMedia();
    setUploading(false);
    setProgress(0);
    if (e.target) e.target.value = ''; // Reset input
  };

  const handleDelete = async (item: MediaItem & { storagePath?: string }) => {
    if (!isAdmin) return;
    if (!window.confirm(language === 'el' ? 'Σίγουρα θέλετε να το διαγράψετε;' : 'Are you sure you want to delete this?')) return;

    try {
      // Delete from storage if path exists
      if (item.storagePath) {
        const storageRef = ref(storage, item.storagePath);
        await deleteObject(storageRef);
      }
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'media', item.id));
      setMedia(media.filter((m) => m.id !== item.id));
    } catch (err) {
      console.error('Error deleting:', err);
      try {
        handleFirestoreError(err, OperationType.DELETE, `media/${item.id}`);
      } catch (e) {
        alert('Delete failed.');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center p-24">
        <Loader2 size={48} className="animate-spin text-teal-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-pine-200">
        <AlertCircle size={48} className="mb-4 text-amber-500" />
        <p className="text-xl mb-2">{language === 'el' ? 'Παρακαλώ συνδεθείτε για να διαχειριστείτε τα αρχεία.' : 'Please log in to manage media.'}</p>
        <button 
          onClick={signInWithGoogle}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-2xl transition-all"
        >
          {language === 'el' ? 'Σύνδεση τώρα' : 'Sign in now'}
        </button>
      </div>
    );
  }

  const isEmailVerified = user.emailVerified;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-pine-950/40 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-1">
            {language === 'el' ? 'Διαχείριση Πολυμέσων' : 'Media Manager'}
          </h1>
          <div className="flex flex-col gap-1">
            <p className="text-pine-300 text-sm">
                Connected as: <span className="text-teal-400 font-mono">{user.email}</span>
            </p>
            {isAdmin && (
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Admin Access Granted
              </p>
            )}
          </div>
        </div>
        
        {isAdmin && (
          <label className={`cursor-pointer bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-lg active:scale-95 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Upload size={18} />
            <span className="font-semibold">{language === 'el' ? 'Ανέβασμα' : 'Upload'}</span>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload} 
              disabled={uploading} 
              multiple 
            />
          </label>
        )}
      </div>

      {uploading && (
        <div className="mb-8 p-4 bg-teal-900/20 border border-teal-500/30 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-teal-300">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm font-medium">{language === 'el' ? 'Ανέβασμα...' : 'Uploading...'}</span>
            </div>
            <span className="text-xs text-teal-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-200 text-sm">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 size={32} className="animate-spin text-teal-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {media.length === 0 ? (
            <div className="col-span-full py-12 text-center text-pine-400 italic">
              {language === 'el' ? 'Δεν βρέθηκαν αρχεία.' : 'No media found.'}
            </div>
          ) : (
            media.map((item) => (
              <div key={item.id} className="group relative bg-white/[0.03] border border-white/5 rounded-3xl p-4 hover:bg-white/[0.06] transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${item.type === 'video' ? 'bg-amber-500/10 text-amber-400' : item.type === 'audio' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {item.type === 'video' ? <Video size={24} /> : item.type === 'audio' ? <Music size={24} /> : <Box size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate mb-0.5">{item.name}</h3>
                    <p className="text-[10px] text-pine-400 uppercase tracking-widest flex items-center gap-2">
                      {item.type} • {(item.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                  <button 
                    onClick={() => {
                        navigator.clipboard.writeText(item.url);
                        alert('Link copied!');
                    }}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-pine-200 py-1.5 rounded-xl text-xs transition-colors"
                  >
                    Copy Link
                  </button>
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(item)}
                      className="p-2 text-pine-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!isAdmin && user && (
        <div className="mt-8 p-4 bg-amber-900/10 border border-amber-500/20 rounded-2xl text-amber-200 text-xs italic text-center">
          {language === 'el' ? 'Μόνο ο Θεόδωρος μπορεί να διαχειριστεί τα αρχεία.' : 'Only Theodoros can manage media assets.'}
        </div>
      )}
    </div>
  );
}
