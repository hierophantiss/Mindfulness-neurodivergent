import type { SVGProps } from 'react';

// The icons of the app's places, drawn for the app in one line (24×24, round
// ends), so the same place has the same sign everywhere: the list "More" on
// the home page, the side bar on a computer, the bottom bar.
//   Microdoses: a drop (a small dose, calm; not a flash)
//   Sanctuary: waves (its sounds: rain, the sea, sleep)
//   Programme: a sprout (a little care each day, growing slowly)
//   Rabbit Hole: a loose spiral, two turns (going deeper, without dizziness)
//   Journal: a pen (a feather)
export const PLACE_PATHS = {
  drop: 'M12 3.5c3.4 4.1 5.6 7.3 5.6 10.3a5.6 5.6 0 0 1-11.2 0c0-3 2.2-6.2 5.6-10.3zM9.4 14.6a2.7 2.7 0 0 0 2.2 2.5',
  waves: 'M3 8.5c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0M3 13c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0M6.5 17.5c1.2-1 2.5-1 3.7 0s2.5 1 3.7 0 2.5-1 3.7 0',
  sprout: 'M3.8 21c4.9-2.1 11.5-2.1 16.4 0M12 20V11.5M12 13.8c-4.3 0-7-2.6-7-7 4.3 0 7 2.6 7 7zM12 11.2c0-4.3 2.7-7.2 7.6-7.2 0 4.6-2.7 7.2-7.6 7.2z',
  spiral: 'M12.00 10.80 L12.27 10.71 L12.59 10.68 L12.92 10.73 L13.25 10.87 L13.57 11.10 L13.84 11.40 L14.04 11.79 L14.16 12.23 L14.18 12.71 L14.09 13.21 L13.89 13.70 L13.56 14.15 L13.13 14.54 L12.60 14.84 L12.00 15.03 L11.35 15.08 L10.67 14.99 L10.01 14.74 L9.39 14.35 L8.85 13.82 L8.43 13.16 L8.14 12.41 L8.02 11.58 L8.08 10.73 L8.33 9.88 L8.76 9.08 L9.36 8.37 L10.13 7.79 L11.02 7.37 L12.00 7.15 L13.03 7.14 L14.07 7.35 L15.07 7.78 L15.97 8.43 L16.73 9.27 L17.31 10.28 L17.67 11.40 L17.79 12.61 L17.65 13.84 L17.25 15.03 L16.60 16.14 L15.71 17.10 L14.62 17.88 L13.36 18.41 L12.00 18.68 L10.59 18.65 L9.19 18.32 L7.86 17.70 L6.68 16.79 L5.69 15.64 L4.96 14.29 L4.51 12.79 L4.39 11.20 L4.61 9.60 L5.17 8.05 L6.04 6.64 L7.22 5.42 L8.64 4.46 L10.26 3.80 L12.00 3.50',
  quill: 'M19.5 4.5C12 5 7.6 10 6.6 17.4c7.4-1 12.4-5.4 12.9-12.9zM19.5 4.5 4 20M9.5 14.5h4.2',
} as const;

type Props = Omit<SVGProps<SVGSVGElement>, 'd'> & { size?: number | string; strokeWidth?: number | string };

function make(d: string, name: string) {
  const Icon = ({ size = 24, strokeWidth = 2, ...rest }: Props) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d={d} />
    </svg>
  );
  Icon.displayName = name;
  return Icon;
}

export const DropIcon = make(PLACE_PATHS.drop, 'DropIcon');
export const WavesIcon = make(PLACE_PATHS.waves, 'WavesIcon');
export const SproutIcon = make(PLACE_PATHS.sprout, 'SproutIcon');
export const SpiralIcon = make(PLACE_PATHS.spiral, 'SpiralIcon');
export const QuillIcon = make(PLACE_PATHS.quill, 'QuillIcon');
