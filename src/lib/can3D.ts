// Whether this device draws the 3D figure (three.js) well: a real graphics
// chip, not a software renderer. Asked once; a figure that then cannot keep up
// (too few frames, a lost drawing context) says so with `no3D`, and from then
// on every figure in this visit is the 2D one.

let can3D: boolean | null = null;

export function wants3D(): boolean {
  if (can3D !== null) return can3D;
  if (typeof window === 'undefined') return (can3D = false);
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return (can3D = false);
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const gpu = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    can3D = !/SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    can3D = false;
  }
  return can3D;
}

export function no3D() {
  can3D = false;
}
