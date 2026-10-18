import { useEffect, useRef } from 'react';

import { PhaseDef, PhaseLabel } from '../data/types-breath';
export type { PhaseDef, PhaseLabel };

const DEFAULT_PHASES: PhaseDef[] = [
  { dur: 4000, armFrom: 0, armTo: 1 }, // inhale
  { dur: 2000, armFrom: 1, armTo: 1 }, // hold up
  { dur: 6000, armFrom: 1, armTo: 0 }, // exhale
  { dur: 1000, armFrom: 0, armTo: 0 }  // hold down
];

const DEFAULT_LABELS: PhaseLabel[] = [
  { text: 'Inhale', label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "σήκωσε τα χέρια αργά", en: "raise arms slowly" } },
  { text: 'Hold', label: { el: "Παύση", en: "Hold" }, sub: { el: "κράτα ψηλά", en: "hold high" } },
  { text: 'Exhale', label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κατέβασε αργά", en: "lower slowly" } },
  { text: 'Hold', label: { el: "Παύση", en: "Hold" }, sub: { el: "νιώσε το βάρος", en: "feel the weight" } }
];

function easeInOutSine(x: number) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

interface BreathCanvasProps {
  running: boolean;
  phases?: PhaseDef[];
  phaseLabels?: PhaseLabel[];
  cycles: number;
  onCycleComplete: (cycles: number) => void;
  onPhaseChange: (phase: PhaseLabel, index: number) => void;
  /** armPos 0..1 (how full the breath is), progress 0..1 within the current phase. */
  onTick?: (armPos: number, progress: number) => void;
}

/**
 * The breathing clock. Draws nothing: it runs the phases, reports how full the
 * breath is and how far the current phase has gone, and counts the cycles.
 */
export default function BreathCanvas({
  running,
  phases = DEFAULT_PHASES,
  phaseLabels = DEFAULT_LABELS,
  cycles,
  onCycleComplete,
  onPhaseChange,
  onTick
}: BreathCanvasProps) {
  const state = useRef({
    phaseIdx: 0,
    phaseStartTime: performance.now(),
    cycles: 0,
  });

  useEffect(() => {
    state.current.phaseStartTime = performance.now();
    state.current.phaseIdx = 0;
  }, [running, phases]);

  useEffect(() => {
    state.current.cycles = cycles;
  }, [cycles]);

  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      if (running) {
        const elapsed = now - state.current.phaseStartTime;
        const phase = phases[state.current.phaseIdx];
        const progress = Math.min(elapsed / phase.dur, 1);
        const ep = easeInOutSine(progress);
        const armPos = phase.armFrom + (phase.armTo - phase.armFrom) * ep;

        if (onTick) onTick(armPos, progress);

        if (progress >= 1) {
          state.current.phaseIdx = (state.current.phaseIdx + 1) % phases.length;
          state.current.phaseStartTime = now;
          onPhaseChange(phaseLabels[state.current.phaseIdx], state.current.phaseIdx);

          if (state.current.phaseIdx === 0) {
            state.current.cycles++;
            onCycleComplete(state.current.cycles);
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    onPhaseChange(phaseLabels[0], 0);

    return () => cancelAnimationFrame(animId);
  }, [running, onCycleComplete, onPhaseChange]);

  return null;
}
