import { useLanguage } from '../hooks/useLanguage';

// "bare": inside a window that already frames it (a chapter's .anim-frame);
// otherwise it brings the same window itself (a day of the Programme).
export default function CameraAnimation({ mode = 'camera', bare = false }: { mode?: 'hero' | 'camera' | 'anchor' | 'zoom'; bare?: boolean }) {
  const { language } = useLanguage();
  // camera-hero.html covers every mode but the plain camera.
  const base = mode === 'camera' ? '/animations/camera.html' : '/animations/camera-hero.html';
  const frame = (
    <iframe
      src={`${base}?lang=${language}`}
      className="absolute inset-0 w-full h-full border-0"
      title="Camera Exercise"
      sandbox="allow-scripts allow-same-origin"
    />
  );
  return bare ? frame : <div className="anim-frame my-6">{frame}</div>;
}
