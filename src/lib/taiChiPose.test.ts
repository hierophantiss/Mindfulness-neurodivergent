import { describe, expect, it } from 'vitest';
import { taiChiPose, type PoseMemo, UPPER_ARM } from './taiChiPose';

const MOVES = ['5-5', 'deep-bow-5-5', 'lotus-bloom-5-5', 'be-like-a-flower-5-5', 'tai-chi-cloud-hands', 'qigong-lifting-sky'];

/** One breath, in small steps: the inhale (rising) then the exhale. */
function* breath() {
  for (let i = 0; i <= 40; i++) yield { bf: i / 40, isRising: true };
  for (let i = 40; i >= 0; i--) yield { bf: i / 40, isRising: false };
}

describe('taiChiPose', () => {
  it('gives every movement a whole, finite pose through the breath', () => {
    for (const movementType of MOVES) {
      const memo: PoseMemo = { type: movementType };
      for (const { bf, isRising } of breath()) {
        const p = taiChiPose({ bf, isRising, movementType, idle: false, natural: false, seated: false, sway: 0 }, memo);
        for (const v of [p.sL, p.sR, p.eL, p.hL, p.eR, p.hR]) {
          expect(Number.isFinite(v.x) && Number.isFinite(v.y)).toBe(true);
        }
        expect(Number.isFinite(p.leftRot) && Number.isFinite(p.rightRot)).toBe(true);
        // The upper arm never grows longer than it is.
        expect(Math.hypot(p.eL.x - p.sL.x, p.eL.y - p.sL.y)).toBeLessThanOrEqual(UPPER_ARM + 0.01);
      }
    }
  });

  it('keeps the two sides mirror images (all but Cloud Hands)', () => {
    for (const movementType of MOVES.filter(m => m !== 'tai-chi-cloud-hands')) {
      const memo: PoseMemo = { type: movementType };
      for (const { bf, isRising } of breath()) {
        const p = taiChiPose({ bf, isRising, movementType, idle: false, natural: false, seated: false, sway: 0 }, memo);
        expect(p.hR.x - 200).toBeCloseTo(200 - p.hL.x, 6);
        expect(p.hR.y).toBeCloseTo(p.hL.y, 6);
        expect(p.rightRot).toBeCloseTo(-p.leftRot, 6);
      }
    }
  });
});
