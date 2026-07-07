import { useMemo } from 'react';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { Axis } from '../data/types';
import { MICRODOSES_EXERCISES } from '../data/microdoses';

// Helper to get day of year
const getDayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export function useAxisBalance() {
  const { logs } = useActivityTracker();

  return useMemo(() => {
    const now = new Date();
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(now.getDate() - 14);

    const recentLogs = logs.filter(log => {
      if (!log.axis) return false;
      const logDate = new Date(log.timestamp);
      return logDate >= fourteenDaysAgo;
    });

    const rawCount = recentLogs.length;

    if (rawCount < 4) {
      return { distribution: {}, totalWeightedCount: 0, quietestAxis: null, suggestion: null };
    }

    const scores: Record<Axis, number> = {
      body: 0,
      breath: 0,
      attention: 0,
      space: 0
    };

    let totalWeightedCount = 0;

    recentLogs.forEach(log => {
      const weight = (log.category === 'rabbithole' || log.category === 'chapter') ? 0.5 : 1.0;
      if (log.axis && (log.axis === 'body' || log.axis === 'breath' || log.axis === 'attention' || log.axis === 'space')) {
        scores[log.axis as Axis] += weight;
        totalWeightedCount += weight;
      }
    });

    const axes: Axis[] = ['body', 'breath', 'attention', 'space'];
    let quietestAxis: Axis = 'body';
    let lowestScore = scores['body'];

    axes.forEach(axis => {
      if (scores[axis] < lowestScore) {
        lowestScore = scores[axis];
        quietestAxis = axis;
      }
    });

    const candidates = MICRODOSES_EXERCISES.filter(m => m.axis === quietestAxis);
    const dayOfYear = getDayOfYear(now);
    
    let suggestion = null;
    if (candidates.length > 0) {
      const index = dayOfYear % candidates.length;
      suggestion = candidates[index];
    }

    return {
      distribution: scores,
      totalWeightedCount,
      quietestAxis,
      suggestion
    };
  }, [logs]);
}
