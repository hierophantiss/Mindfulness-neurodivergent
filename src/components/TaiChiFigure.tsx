/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useState, type ComponentProps } from "react";
import TaiChiHero from "./TaiChiHero";
import { useAccessibility } from "../hooks/useAccessibility";

// The 3D figure (three.js) loads only here, on the practice page.
const TaiChiHero3D = lazy(() => import("./TaiChiHero3D"));

let can3D: boolean | null = null;
/** A real graphics chip: the 3D figure can be drawn. */
function wants3D(): boolean {
  if (can3D !== null) return can3D;
  if (typeof window === "undefined") return (can3D = false);
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return (can3D = false);
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const gpu = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    can3D = !/SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    can3D = false;
  }
  return can3D;
}

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
        idle={props.idle}
        breathStateText={props.breathStateText}
        onTrouble={() => { can3D = false; setUse3D(false); }}
      />
    </Suspense>
  );
}
