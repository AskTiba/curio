import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for robust Tailwind class merging and conditional joining.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
