import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitaire pour fusionner les classes Tailwind de manière conditionnelle et propre.
 * @param inputs - Liste de classes ou conditions (voir clsx)
 * @returns La chaîne de caractères fusionnée par tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
