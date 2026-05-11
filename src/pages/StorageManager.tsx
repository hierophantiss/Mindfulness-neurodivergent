import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, serverTimestamp, onSnapshot, where } from 'firebase/firestore';
import { storage, db, handleFirestoreError, OperationType, signInWithGoogle } from '../lib/firebase';
import { useFirebase } from '../lib/FirebaseContext';
import { Upload, Trash2, Video, Music, Image as ImageIcon, Box, Loader2, AlertCircle, Link as LinkIcon, X, RefreshCw } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'video' | 'audio' | 'animation' | 'image' | 'html';
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
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualType, setManualType] = useState<'video' | 'audio' | 'animation' | 'image' | 'html'>('image');

  // isAdmin check (following the rules logic)
  const isAdmin = user?.email?.toLowerCase() === 'bairaktaris.theodoros@gmail.com';

  useEffect(() => {
    const path = 'media';
    setLoading(true);
    const q = query(collection(db, path));
    
    // Safety timeout to prevent infinite loading
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 8000);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      clearTimeout(safetyTimer);
      console.log(`Firestore snapshot: Found ${querySnapshot.size} documents in 'media' collection.`);
      const items: MediaItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({ id: doc.id, ...data } as MediaItem);
      });
      
      // Sort in JS manually
      items.sort((a, b) => {
        const timeA = a.createdAt?.seconds || (a.createdAt instanceof Date ? a.createdAt.getTime() / 1000 : 0);
        const timeB = b.createdAt?.seconds || (b.createdAt instanceof Date ? b.createdAt.getTime() / 1000 : 0);
        return (timeB || 0) - (timeA || 0);
      });
      
      setMedia(items);
      setLoading(false);
    }, (err) => {
      clearTimeout(safetyTimer);
      console.error('Error in onSnapshot:', err);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, [language]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!user) {
      setError(language === 'el' ? 'Παρακαλώ συνδεθείτε.' : 'Please log in.');
      return;
    }

    if (!isAdmin) {
      setError(language === 'el' ? 'Μόνο ο διαχειριστής μπορεί να ανεβάσει αρχεία.' : 'Only the admin can upload files.');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    const fileList = Array.from(files);
    let completedCount = 0;
    let failedCount = 0;

    for (const file of fileList) {
      try {
        const storageRef = ref(storage, `assets/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              const overallProgress = ((completedCount * 100) + fileProgress) / fileList.length;
              setProgress(overallProgress);
            },
            (err) => {
              console.error('Upload error:', err);
              if (err.code === 'storage/unauthorized') {
                reject(new Error(language === 'el' 
                  ? 'Δεν έχετε δικαιώματα εγγραφής στο Storage. Παρακαλώ ελέγξτε τους κανόνες στο Firebase Console.' 
                  : 'You do not have write permissions in Storage. Please check your rules in the Firebase Console.'));
              } else {
                reject(err);
              }
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
                console.log(`Success! File ${completedCount}/${fileList.length} saved in Firestore.`);
                resolve();
              } catch (dbErr: any) {
                console.error('Firestore error during upload:', dbErr);
                failedCount++;
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
        failedCount++;
        setError(language === 'el' ? `Σφάλμα στο αρχείο ${file.name}: ${err.message}` : `Error in file ${file.name}: ${err.message}`);
      }
    }

    setUploading(false);
    setProgress(0);
    if (e.target) e.target.value = '';
    
    if (completedCount > 0) {
      alert(language === 'el' 
        ? `Επιτυχής μεταφόρτωση ${completedCount} αρχείων.${failedCount > 0 ? ` (${failedCount} απέτυχαν)` : ''}`
        : `Successfully uploaded ${completedCount} files.${failedCount > 0 ? ` (${failedCount} failed)` : ''}`);
    } else if (failedCount > 0) {
      alert(language === 'el' ? 'Η μεταφόρτωση απέτυχε για όλα τα αρχεία. Ελέγξτε την κονσόλα για λεπτομέρειες.' : 'Upload failed for all files. Check console for details.');
    }
  };

  const handleUrlChange = (url: string) => {
    setManualUrl(url);
    if (url && !manualName) {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const fileName = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (fileName && fileName.includes('.')) {
          setManualName(fileName);
          if (fileName.endsWith('.html')) setManualType('html');
          else if (fileName.endsWith('.mp4') || fileName.endsWith('.webm')) setManualType('video');
          else if (fileName.endsWith('.mp3') || fileName.endsWith('.wav')) setManualType('audio');
        }
      } catch (e) {
        // Not a valid full URL yet, ignore
      }
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl || !manualName) return;

    setUploading(true);
    try {
      await addDoc(collection(db, 'media'), {
        name: manualName,
        url: manualUrl,
        type: manualType,
        size: 0, // Unknown for manual
        mimeType: 'external/url',
        uploadedBy: user?.uid,
        createdAt: serverTimestamp(),
      });
      setManualUrl('');
      setManualName('');
      setShowUrlModal(false);
      alert(language === 'el' ? 'Επιτυχής καταχώρηση!' : 'Successfully registered!');
    } catch (err: any) {
      console.error('Manual add error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSync = async () => {
    if (!isAdmin) return;
    setUploading(true);
    setError(null);
    let addedCount = 0;

    try {
      const storageRef = ref(storage, 'assets/');
      const result = await listAll(storageRef);
      
      const firestoreItems = await getDocs(collection(db, 'media'));
      const existingPaths = new Set();
      firestoreItems.forEach(doc => {
        const data = doc.data();
        if (data.storagePath) existingPaths.add(data.storagePath);
      });

      for (const itemRef of result.items) {
        if (!existingPaths.has(itemRef.fullPath)) {
          console.log(`Syncing new file found in storage: ${itemRef.name}`);
          const downloadURL = await getDownloadURL(itemRef);
          
          let type: MediaItem['type'] = 'image';
          const name = itemRef.name.toLowerCase();
          if (name.endsWith('.mp4') || name.endsWith('.webm')) type = 'video';
          else if (name.endsWith('.mp3') || name.endsWith('.wav')) type = 'audio';
          else if (name.endsWith('.html')) type = 'html';
          
          await addDoc(collection(db, 'media'), {
            name: itemRef.name,
            url: downloadURL,
            type: type,
            size: 0,
            mimeType: 'application/octet-stream',
            uploadedBy: user?.uid,
            createdAt: serverTimestamp(),
            storagePath: itemRef.fullPath
          });
          addedCount++;
        }
      }

      alert(language === 'el' 
        ? `Ο συγχρονισμός ολοκληρώθηκε. Βρέθηκαν ${addedCount} νέα αρχεία.` 
        : `Sync complete. Found ${addedCount} new files.`);
    } catch (err: any) {
      console.error('Sync error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-pine-950/40 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-1">
            {language === 'el' ? 'Διαχείριση Πολυμέσων' : 'Media Manager'}
          </h1>
          <div className="flex flex-col gap-1">
            {authLoading ? (
              <div className="flex items-center gap-2 text-pine-400 text-sm">
                <Loader2 size={14} className="animate-spin" />
                <span>{language === 'el' ? 'Έλεγχος σύνδεσης...' : 'Checking auth...'}</span>
              </div>
            ) : user ? (
              <>
                <p className="text-pine-300 text-sm">
                    Connected as: <span className="text-teal-400 font-mono">{user.email}</span>
                </p>
                {isAdmin && (
                  <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Admin Access Granted
                  </p>
                )}
              </>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="text-teal-400 text-sm hover:underline flex items-center gap-1"
              >
                {language === 'el' ? 'Συνδεθείτε για διαχείριση' : 'Sign in to manage'}
              </button>
            )}
          </div>
        </div>
        
        {isAdmin && (
          <div className="flex gap-2">
            <button 
              onClick={handleSync}
              disabled={uploading}
              className="bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all border border-white/10"
              title={language === 'el' ? 'Συγχρονισμός με Storage' : 'Sync with Storage'}
            >
              <RefreshCw size={18} className={uploading ? 'animate-spin' : ''} />
              <span className="font-semibold text-sm hidden sm:inline">{language === 'el' ? 'Συγχρονισμός' : 'Sync'}</span>
            </button>
            <label className={`cursor-pointer bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-lg active:scale-95 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Upload size={18} />
              <span className="font-semibold text-sm">{language === 'el' ? 'Ανέβασμα' : 'Upload'}</span>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload} 
                disabled={uploading} 
                multiple 
              />
            </label>
            <button 
              onClick={() => setShowUrlModal(true)}
              className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 transition-all border border-white/10"
            >
              <LinkIcon size={18} />
              <span className="font-semibold text-sm">{language === 'el' ? 'Σύνδεσμος' : 'Link'}</span>
            </button>
          </div>
        )}
      </div>

      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-pine-900 border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-white">{language === 'el' ? 'Προσθήκη με URL' : 'Add via URL'}</h2>
              <button onClick={() => setShowUrlModal(false)} className="text-pine-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleManualAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-pine-400 uppercase mb-1.5">{language === 'el' ? 'Όνομα' : 'Name'}</label>
                <input 
                  type="text" 
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                  placeholder="e.g. video_intro.mp4"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-pine-400 uppercase mb-1.5">URL</label>
                <input 
                  type="url" 
                  value={manualUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-pine-400 uppercase mb-1.5">{language === 'el' ? 'Τύπος' : 'Type'}</label>
                <select 
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="video">Video</option>
                  <option value="animation">Animation (GIF/MP4)</option>
                  <option value="html">HTML Exercise</option>
                  <option value="audio">Audio</option>
                  <option value="image">Image</option>
                </select>
              </div>
              <button 
                type="submit"
                disabled={uploading}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {uploading ? <Loader2 className="animate-spin mx-auto" /> : (language === 'el' ? 'Καταχώρηση' : 'Register')}
              </button>
            </form>
          </div>
        </div>
      )}

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
                  <div className={`p-3 rounded-2xl ${
                    item.type === 'video' ? 'bg-amber-500/10 text-amber-400' : 
                    item.type === 'audio' ? 'bg-blue-500/10 text-blue-400' : 
                    item.type === 'html' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {item.type === 'video' ? <Video size={24} /> : 
                     item.type === 'audio' ? <Music size={24} /> : 
                     item.type === 'html' ? <LinkIcon size={24} /> :
                     <Box size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate mb-0.5">{item.name}</h3>
                    <p className="text-[10px] text-pine-400 uppercase tracking-widest flex items-center gap-2">
                      {item.type} • {(item.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 py-1.5 rounded-xl text-xs transition-colors text-center font-medium"
                  >
                    {language === 'el' ? 'Προβολή' : 'View'}
                  </a>
                  <button 
                    onClick={() => {
                        navigator.clipboard.writeText(item.url);
                        alert('Link copied!');
                    }}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-pine-200 py-1.5 rounded-xl text-xs transition-colors"
                  >
                    Link
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
