/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";
import { createTaiChi3D, type TaiChi3D } from "../lib/taiChi3D";
import type { TreeLeg } from "../lib/taiChiPose";
import TaiChiHero from "./TaiChiHero";

interface Props {
  breathForce: number;
  isRising: boolean;
  movementType: string;
  idle?: boolean;
  breathStateText?: string;
  /** The Tree: which leg lifts this cycle. */
  treeLeg?: TreeLeg;
  /** The device cannot draw it well: go back to the 2D figure. */
  onTrouble: () => void;
}

/** The Tai Chi figure in 3D, standing on the same earth as the 2D one. */
export default function TaiChiHero3D({ breathForce, isRising, movementType, idle = false, breathStateText, treeLeg, onTrouble }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<TaiChi3D | null>(null);
  const troubleRef = useRef(onTrouble);
  troubleRef.current = onTrouble;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let scene: TaiChi3D | null = null;
    try {
      scene = createTaiChi3D(mount, () => troubleRef.current());
    } catch {
      troubleRef.current();
      return;
    }
    sceneRef.current = scene;
    return () => { scene?.dispose(); sceneRef.current = null; };
  }, []);

  // Each tick of the breath only hands the scene its new state.
  useEffect(() => {
    sceneRef.current?.setState({ bf: breathForce, isRising, movementType, idle, treeLeg });
  });

  // The 2D picture's sky, earth and axis behind; the 3D figure stands on them.
  return (
    <div className="relative w-full">
      <TaiChiHero backdrop breathForce={breathForce} isRising={isRising} movementType={movementType} idle={idle} treeLeg={treeLeg} breathStateText="" />
      <div ref={mountRef} className="absolute inset-0 rounded-2xl overflow-hidden" />
      {breathStateText && (
        <div className="absolute top-4 inset-x-0 flex flex-col items-center">
          <span className="text-[13px] text-[var(--tint-lav-ink)] bg-[var(--tint-lav-bg)] px-3 py-1 rounded-full border border-[var(--tint-lav-line)]">
            {breathStateText}
          </span>
        </div>
      )}
    </div>
  );
}
