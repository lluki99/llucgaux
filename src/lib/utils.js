import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 


export const isIframe = window.self !== window.top;

// Normalizes legacy string values (old data saved before genre became multi-select) into arrays.
export function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value) return [value];
  return [];
}