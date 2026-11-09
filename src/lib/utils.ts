import { clsx, type ClassValue } from 'clsx';

// Joins class names (and drops the false ones). It does not resolve two
// classes for the same property: pass only one of them (that saved ~27 KB,
// tailwind-merge, from the script every page loads).
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
