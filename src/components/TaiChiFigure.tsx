/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useState, type ComponentProps } from "react";
import TaiChiHero from "./TaiChiHero";
import { useAccessibility } from "../hooks/useAccessibility";
import { no3D, wants3D } from "../lib/can3D";

// The 3D figure (three.js) loads only here, on the practice page.
const TaiChiHero3D = lazy(() => import("./TaiChiHero3D"));

/**
 * The Tai Chi figure of the practices: in 3D where the device draws it well,
 * otherwise (no WebGL, a software renderer, too few frames, less motion asked
 * for) the 2D figure, which is also shown while the 3D one loads.
 */
export default function TaiChiFigure(props: ComponentProps<typeof TaiChiHero>) {
  // "Less motion" (the app's setting, which starts from the device's): 2D.
  const { reduceMotion } = useAccessibility();
  const [use3D, setUse3D] = useState(wants3D);
  const flat = <TaiChiHero {...props} />;
  if (!use3D || reduceMotion) return flat;
  return (
    <Suspense fallback={flat}>
      <TaiChiHero3D
        breathForce={props.breathForce}
        isRising={props.isRising}
        movementType={props.movementType}
        treeLeg={props.treeLeg}
        idle={props.idle}
        breathStateText={props.breathStateText}
        onTrouble={() => { no3D(); setUse3D(false); }}
      />
    </Suspense>
  );
}
