import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  if (value === 0) return "0";

  // Handle very small numbers
  if (value < 0.01 && value > 0) {
    return value.toFixed(6);
  }

  // Handle numbers less than 1000
  if (value < 1000) {
    return value.toFixed(2);
  }

  // Handle thousands, millions, billions
  const suffixes = ["", "K", "M", "B", "T"];
  let suffixIndex = 0;
  let formattedValue = value;

  while (formattedValue >= 1000 && suffixIndex < suffixes.length - 1) {
    formattedValue /= 1000;
    suffixIndex++;
  }

  // Format with appropriate decimal places
  const decimals = formattedValue >= 100 ? 0 : formattedValue >= 10 ? 1 : 2;

  return formattedValue.toFixed(decimals) + suffixes[suffixIndex];
}
