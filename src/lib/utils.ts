import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a human-readable subject name into a URL-safe kebab-case slug.
 * e.g. "Calculus II" -> "calculus-2", "English B2" -> "english-b2"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\bii\b/g, '2')   // Roman numeral II -> 2
    .replace(/\biii\b/g, '3')  // Roman numeral III -> 3
    .replace(/[^\w\s-]/g, '')  // strip non-word chars except spaces and hyphens
    .replace(/[\s_]+/g, '-')   // spaces/underscores -> hyphens
    .replace(/^-+|-+$/g, '')   // trim leading/trailing hyphens
}
