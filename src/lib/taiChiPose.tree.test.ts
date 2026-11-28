import { describe, expect, it } from 'vitest';
import {
  taiChiPose, treeLegs, treeTiming, type PoseMemo, type TreeLeg,
  TREE, UPPER_ARM, FOREARM, THIGH, SHIN, ANKLE_Y, FOOT_HALF, SHOULDER_Y,
} from './taiChiPose';

const pose = (bf: number, isRising: boolean, treeLeg: TreeLeg, memo: PoseMemo = { type: TREE }) =>
  taiChiPose({ bf, isRising, movementType: TREE, idle: false, natural: false, seated: false, sway: 0, treeLeg }, memo);
const steps = (n = 60) => Array.from({ length: n + 1 }, (_, i) => i / n);
const len = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

describe('the Tree', () => {
  it('keeps the standing foot planted all the way through', () => {
    for (const bf of steps()) {
      const right = treeLegs(bf, 'right');   // the right leg lifts: it is on screen-left
      expect(right.ankleR).toEqual({ x: 200 + FOOT_HALF, y: ANKLE_Y });
      const left = treeLegs(bf, 'left');
      expect(left.ankleL).toEqual({ x: 200 - FOOT_HALF, y: ANKLE_Y });
    }
  });

  it('starts and ends on both feet, the weight in the middle', () => {
    const l = treeLegs(0, 'right');
    expect(l.ankleL).toEqual({ x: 200 - FOOT_HALF, y: ANKLE_Y });
    expect(l.shift).toBe(0);
    expect(l.lift).toBe(0);
  });

  it('at the top, the lifted foot is off the earth, low against the standing calf', () => {
    const l = treeLegs(1, 'right');
    // Off the floor, but low: below the standing knee (a low tree, not foot on thigh).
    expect(l.ankleL.y).toBeLessThan(ANKLE_Y - 10);
    expect(l.ankleL.y).toBeGreaterThan(l.kneeR.y + 3);
    // Near the standing leg (its line at that height), on its inner side.
    const k = (l.ankleL.y - l.kneeR.y) / (l.ankleR.y - l.kneeR.y);
    const calfX = l.kneeR.x + (l.ankleR.x - l.kneeR.x) * k;
    expect(calfX - l.ankleL.x).toBeGreaterThan(2);
    expect(calfX - l.ankleL.x).toBeLessThan(8);
    // The knee turns out, away from the standing leg; the weight is over the standing foot.
    expect(l.kneeL.x).toBeLessThan(l.hipL.x - 6);
    expect(l.shift).toBeGreaterThan(4);
  });

  it('first moves the weight, then lifts the foot (and back: the foot is down before the weight returns)', () => {
    expect(treeTiming(0.35).lift).toBe(0);
    expect(treeTiming(0.35).shift).toBeGreaterThan(0.85);
    expect(treeTiming(0.42).shift).toBe(1);
  });

  it('keeps the thigh, the shin and the arm their own length', () => {
    for (const leg of ['right', 'left'] as const) {
      const memo: PoseMemo = { type: TREE };
      for (const bf of steps()) {
        const l = treeLegs(bf, leg);
        for (const [h, k, a] of [[l.hipL, l.kneeL, l.ankleL], [l.hipR, l.kneeR, l.ankleR]]) {
          expect(len(h, k)).toBeLessThanOrEqual(THIGH + 0.01);
          expect(len(k, a)).toBeLessThanOrEqual(SHIN + 0.01);
        }
        const p = pose(bf, true, leg, memo);
        expect(len(p.sL, p.eL)).toBeCloseTo(UPPER_ARM, 6);
        expect(len(p.eL, p.hL)).toBeCloseTo(FOREARM, 6);
        expect(len(p.sR, p.eR)).toBeCloseTo(UPPER_ARM, 6);
      }
    }
  });

  it('the two sides are mirror images of each other', () => {
    for (const bf of steps()) {
      const r = pose(bf, true, 'right'), l = pose(bf, true, 'left');
      const m = (x: number) => 400 - x;
      expect(l.hL.x).toBeCloseTo(m(r.hR.x), 6); expect(l.hL.y).toBeCloseTo(r.hR.y, 6);
      expect(l.eR.x).toBeCloseTo(m(r.eL.x), 6);
      expect(l.leftRot).toBeCloseTo(-r.rightRot, 6);
      const R = r.legs!, L = l.legs!;
      expect(L.ankleR.x).toBeCloseTo(m(R.ankleL.x), 6); expect(L.ankleR.y).toBeCloseTo(R.ankleL.y, 6);
      expect(L.kneeR.x).toBeCloseTo(m(R.kneeL.x), 6); expect(L.kneeR.y).toBeCloseTo(R.kneeL.y, 6);
      expect(L.footRot).toBeCloseTo(-R.footRot, 6);
      expect(L.shift).toBeCloseTo(-R.shift, 6);
    }
  });

  it('in the tree, the arms make an arch above the head: elbows high and out, hands apart', () => {
    const p = pose(1, true, 'right');
    const mid = 200 + p.bodyShift;
    expect(p.eL.y).toBeLessThan(SHOULDER_Y);            // elbows above the shoulders
    expect(p.eL.x).toBeLessThan(p.hL.x);                // out beyond the hands
    expect(p.hL.y).toBeLessThan(p.eL.y - 10);           // forearms nearly upright
    expect(p.hL.y).toBeLessThan(184);                   // the hands above the head
    expect(p.hR.x - p.hL.x).toBeGreaterThan(30);        // apart, never joined
    expect(p.hR.x - mid).toBeCloseTo(mid - p.hL.x, 6);  // the same on both sides of the body
  });

  it('moves smoothly: no jumps from one moment to the next, nor when the sides change', () => {
    for (const leg of ['right', 'left'] as const) {
      for (const isRising of [true, false]) {
        let prev = pose(0, isRising, leg);
        for (const bf of steps(200).slice(1)) {
          const p = pose(bf, isRising, leg);
          for (const k of ['hL', 'eL', 'hR', 'eR'] as const) expect(len(p[k], prev[k])).toBeLessThan(1.2);
          for (const k of ['kneeL', 'ankleL', 'kneeR', 'ankleR'] as const) expect(len(p.legs![k], prev.legs![k])).toBeLessThan(1);
          prev = p;
        }
      }
    }
    // On both feet (between cycles) the two sides are the same pose.
    const a = pose(0, false, 'right'), b = pose(0, true, 'left');
    for (const k of ['hL', 'eL', 'hR', 'eR'] as const) expect(len(a[k], b[k])).toBeLessThan(1e-9);
    for (const k of ['kneeL', 'ankleL', 'kneeR', 'ankleR', 'hipL', 'hipR'] as const) expect(len(a.legs![k], b.legs![k])).toBeLessThan(1e-9);
  });
});
