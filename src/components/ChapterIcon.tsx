import { axisOfChapter, AXIS_GLYPH } from '../lib/axisOfChapter';

// One drawn mark per chapter, in the chapter's colour: the sign's part for the
// four axis chapters (1–4), and a thin line drawing for the others, in the
// style of the home page's icons. Decorative: the title beside it says it.

const PATHS: Record<number, string> = {
  // 5 · The neurodivergent mind: defence, racing, the mask
  5: 'M4 5c2.6 1.1 5.4 1.1 8 0s5.4-1.1 8 0v6a8 8 0 0 1-16 0zM7.5 10.2c.8-.6 1.7-.6 2.5 0M14 10.2c.8-.6 1.7-.6 2.5 0M9 14.6c1.9 1.3 4.1 1.3 6 0',
  // 6 · Daily life: the day rising
  6: 'M3 18h18M7 18a5 5 0 0 1 10 0M12 7.5V4.5M5.9 11.4 3.8 9.3M18.1 11.4l2.1-2.1M8 21h8',
  // 7 · The new driver: a compass
  7: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.6 8.4l-2.2 5-5 2.2 2.2-5z',
  // 8 · When the wave rises
  8: 'M2 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M6 9.5C7.2 6.4 9.6 4.5 12.6 4.5c1.8 0 3.3.7 4.4 1.9-1.6-.2-3 .5-3.6 1.9',
  // 9 · The presence worksheet
  9: 'M9 3.5h6v3H9zM7 5H5.5v15.5h13V5H17M8.8 12.2l1.7 1.7 3.4-3.4M8.8 17h6.4',
  // 10 · The four stages, step by step
  10: 'M3 20h4.5v-4h4.5v-4h4.5V8H21',
  // 11 · The background: science and wisdom, in layers
  11: 'M12 3.5 2.5 8.5 12 13.5l9.5-5zM2.5 12.5 12 17.5l9.5-5M2.5 16.5 12 21.5l9.5-5',
};

/** Relative luminance of a #rrggbb colour (0 dark … 1 light). */
function luminance(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return 1;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** A chapter colour too deep to read as a thin line on the dark sky is lifted toward the ink colour. */
export const iconColor = (hex: string) =>
  luminance(hex) < 0.15 ? `color-mix(in srgb, ${hex} 55%, var(--color-ink))` : hex;

export function ChapterIcon({ num, color: base, size = 22 }: { num: number; color: string; size?: number }) {
  const axis = axisOfChapter(num);
  const color = iconColor(base);
  if (axis) {
    return (
      <span aria-hidden="true" className="font-display leading-none" style={{ color, fontSize: size * 1.15 }}>
        {AXIS_GLYPH[axis]}
      </span>
    );
  }
  const d = PATHS[num];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color, filter: `drop-shadow(0 0 5px color-mix(in srgb, ${color} 50%, transparent))` }}>
      <path d={d} />
    </svg>
  );
}
