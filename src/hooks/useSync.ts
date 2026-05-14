import { useState, useCallback, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirebase } from '../lib/FirebaseContext';
import { useCompanion } from './useCompanion';

const COMPANION_KEY = 'mindful_companion_v5';
const BREATH_HISTORY = 'breath_history';
const JOURNAL_HISTORY = 'journal_history';
const JOURNAL_V1 = 'journal_v1';

export function useSync() {
  const { user } = useFirebase();
  const { updateCompanionData } = useCompanion();
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");

  const syncToCloud = useCallback(async () => {
    if (!user) return;
    setSyncStatus("syncing");
    
    try {
      const companionData = localStorage.getItem(COMPANION_KEY) || "";
      const breathHistory = localStorage.getItem(BREATH_HISTORY) || "";
      const journalHistory = localStorage.getItem(JOURNAL_HISTORY) || "";
      const journalV1 = localStorage.getItem(JOURNAL_V1) || "";

      const userProfile = {
        uid: user.uid,
        companionData,
        breathHistory,
        journalHistory,
        journalV1,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
      
      setSyncStatus("success");
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (error) {
      setSyncStatus("error");
      handleFirestoreError(error, OperationType.UPDATE, 'users/' + user.uid);
    }
  }, [user]);

  const syncFromCloud = useCallback(async () => {
    if (!user) return;
    setSyncStatus("syncing");
    try {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        let updated = false;

        if (data.companionData) {
            localStorage.setItem(COMPANION_KEY, data.companionData);
            try {
              updateCompanionData(JSON.parse(data.companionData));
            } catch(e) {}
            updated = true;
        }
        if (data.breathHistory) {
            localStorage.setItem(BREATH_HISTORY, data.breathHistory);
            updated = true;
        }
        if (data.journalHistory) {
            localStorage.setItem(JOURNAL_HISTORY, data.journalHistory);
            updated = true;
        }
        if (data.journalV1) {
            localStorage.setItem(JOURNAL_V1, data.journalV1);
            updated = true;
        }
        
        if (updated) {
          window.dispatchEvent(new Event('storage')); // Trigger other storage listeners
        }

        setSyncStatus("success");
        setTimeout(() => setSyncStatus("idle"), 3000);
      } else {
        setSyncStatus("idle");
      }
    } catch (error) {
       setSyncStatus("error");
       handleFirestoreError(error, OperationType.GET, 'users/' + user.uid);
    }
  }, [user, updateCompanionData]);

  return { syncStatus, syncToCloud, syncFromCloud };
}
