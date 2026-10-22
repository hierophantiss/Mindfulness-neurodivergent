import type { Axis } from './types';

// Kept apart from the check-in data so that small pieces (the menu, the info
// window) can use the colours without loading every practice.
export const AXIS_COLOR: Record<Axis, string> = {
  body: 'var(--color-axis-body, #7A9E7E)',
  breath: 'var(--color-axis-breath, #C07050)',
  attention: 'var(--color-axis-focus, #C8922A)',
  space: 'var(--color-axis-space, #B5A7D0)',
};
