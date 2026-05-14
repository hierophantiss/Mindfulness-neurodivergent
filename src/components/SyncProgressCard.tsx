import React from 'react';
import { Cloud, CloudUpload, CloudDownload, CloudOff, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useFirebase } from '../lib/FirebaseContext';
import { useSync } from '../hooks/useSync';

export default function SyncProgressCard() {
  const { language } = useLanguage();
  const { user, signInWithGoogle } = useFirebase();
  const { syncStatus, syncToCloud, syncFromCloud } = useSync();

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 mt-6">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user ? 'bg-teal-500/20 text-teal-400' : 'bg-white/10 text-white/50'}`}>
          {syncStatus === 'syncing' ? (
             <Loader2 size={24} className="animate-spin" />
          ) : syncStatus === 'success' ? (
             <Check size={24} />
          ) : user ? (
             <Cloud size={24} />
          ) : (
             <CloudOff size={24} />
          )}
        </div>
        <div>
          <h3 className="text-xl font-serif text-white italic">
            {language === 'el' ? 'Συγχρονισμός Προόδου' : 'Persistent Progress'}
          </h3>
          <p className="text-sm text-white/60">
            {!user ? (language === 'el' 
              ? 'Συνδεθείτε για να αποθηκεύσετε την πρόοδό σας στο Cloud.' 
              : 'Sign in to save your progress to the Cloud.') : 
              (language === 'el'
              ? 'Αποθηκεύστε και συγχρονίστε την πρόοδό σας.'
              : 'Save and synchronize your progress seamlessly.')}
          </p>
        </div>
      </div>

      {!user ? (
        <button 
          onClick={signInWithGoogle}
          className="w-full py-4 mt-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-2xl flex items-center justify-center gap-3 transition-colors text-indigo-300 font-medium"
        >
          <Cloud size={20} />
          {language === 'el' ? 'Σύνδεση με Google' : 'Sign in with Google'}
        </button>
      ) : (
        <div className="flex gap-4 mt-4">
          <button 
            onClick={syncToCloud}
            disabled={syncStatus === 'syncing'}
            className="flex-1 py-3 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 rounded-2xl flex items-center justify-center gap-2 transition-colors text-teal-300 font-medium disabled:opacity-50"
          >
            <CloudUpload size={18} />
            {language === 'el' ? 'Αποθήκευση στο Cloud' : 'Save to Cloud'}
          </button>
          <button 
            onClick={syncFromCloud}
            disabled={syncStatus === 'syncing'}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-2 transition-colors text-white/80 font-medium disabled:opacity-50"
          >
            <CloudDownload size={18} />
            {language === 'el' ? 'Λήψη από Cloud' : 'Load from Cloud'}
          </button>
        </div>
      )}
    </div>
  );
}
