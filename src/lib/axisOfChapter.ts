// The first four chapters are the four axes of the method, in order.
export type AxisId = 'body' | 'breath' | 'attention' | 'space';

const AXES: AxisId[] = ['body', 'breath', 'attention', 'space'];

/** The axis a chapter teaches (chapters 1–4), or null for the others. */
export const axisOfChapter = (num: number): AxisId | null => (num >= 1 && num <= 4 ? AXES[num - 1] : null);

/** The sign's part for each axis: line, circle, triangle, infinity. */
export const AXIS_GLYPH: Record<AxisId, string> = { body: 'Ι', breath: '○', attention: '△', space: '∞' };
