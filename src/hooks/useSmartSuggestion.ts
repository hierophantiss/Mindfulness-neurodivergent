import { useState, useEffect, useMemo } from 'react';
import { useAxisBalance } from './useAxisBalance';
import { Axis } from '../data/types';
import { MICRODOSES_EXERCISES, MicrodoseExercise } from '../data/microdoses';

const getDayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export function useSmartSuggestion(): {
  axis: Axis | null;
  suggestion: MicrodoseExercise | null;
  mode: 'state+history' | 'history' | null;
  state: 'hyper' | 'hypo' | 'balanced' | null;
} {
  const [storageTick, setStorageTick] = useState(0);

  useEffect(() => {
    const handleStorage = () => setStorageTick(t => t + 1);
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const balance = useAxisBalance();

  return useMemo(() => {
    let recentState: 'hyper' | 'hypo' | 'balanced' | null = null;
    let mode: 'state+history' | 'history' | null = null;
    let allowedAxes: Axis[] = ['body', 'breath', 'attention', 'space'];

    try {
      const stored = localStorage.getItem('n_mindfulness_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.ts === 'number' && typeof parsed.state === 'string') {
          const isFresh = Date.now() - parsed.ts < 90 * 60 * 1000;
          if (isFresh) {
            recentState = parsed.state as 'hyper' | 'hypo' | 'balanced';
          }
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    if (recentState === 'hyper') {
      allowedAxes = ['body', 'breath'];
    } else if (recentState === 'hypo') {
      allowedAxes = ['attention', 'space'];
    }

    if (balance.totalWeightedCount === 0 && !recentState) {
      return { axis: null, suggestion: null, mode: null, state: null };
    }

    mode = recentState ? 'state+history' : 'history';

    const scores = balance.distribution as Record<Axis, number>;
    
    // Pick the allowed axis with the LOWEST score.
    // Tie-break order: body > breath > attention > space
    const tieBreakOrder: Axis[] = ['body', 'breath', 'attention', 'space'];
    let chosenAxis: Axis | null = null;
    let minScore = Infinity;

    for (const axis of tieBreakOrder) {
      if (allowedAxes.includes(axis)) {
        const score = scores[axis] || 0;
        if (score < minScore) {
          minScore = score;
          chosenAxis = axis;
        }
      }
    }

    if (!chosenAxis) {
      return { axis: null, suggestion: null, mode: null, state: null };
    }

    let candidates = MICRODOSES_EXERCISES.filter(m => m.axis === chosenAxis);

    if (recentState === 'hyper') {
      const shortCandidates = candidates.filter(m => m.maxSeconds <= 60);
      if (shortCandidates.length > 0) {
        candidates = shortCandidates;
      }
    }

    let suggestion: MicrodoseExercise | null = null;
    if (candidates.length > 0) {
      const index = getDayOfYear(new Date()) % candidates.length;
      suggestion = candidates[index];
    }

    return { axis: chosenAxis, suggestion, mode, state: recentState };
  }, [balance, storageTick]);
}
