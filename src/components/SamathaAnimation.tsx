import { useLanguage } from '../hooks/useLanguage';

// "bare": inside a window that already frames it (a chapter's .anim-frame);
// otherwise it brings the same window itself (a day of the Programme).
export default function SamathaAnimation({ bare = false }: { bare?: boolean }) {
  const { language } = useLanguage();
  const frame = (
    <iframe
      src={`/animations/samatha_attention.html?lang=${language}`}
      className="absolute inset-0 w-full h-full border-0"
      title="Attention Geometry"
      sandbox="allow-scripts allow-same-origin"
    />
  );
  return bare ? frame : <div className="anim-frame my-6">{frame}</div>;
}
